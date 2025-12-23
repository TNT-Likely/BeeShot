import { Canvas as FabricCanvas, Rect, Gradient, Shadow, ActiveSelection, type FabricObject } from 'fabric'
import type { Document, Page, Element, Background, TextElement, ImageElement, ShapeElement } from '@beeshot/core'
import { EventEmitter } from '@beeshot/core'
import type { IRenderer } from '../interface/renderer'
import type { ExportOptions, RendererEventMap } from '../interface/types'
import { TextRenderer, ImageRenderer, ShapeRenderer } from './renderers'

/**
 * Fabric.js 渲染器实现
 */
export class FabricRenderer implements IRenderer {
  private canvas: FabricCanvas | null = null
  private container: HTMLElement | null = null
  private document: Document | null = null
  private activePageId: string | null = null
  private eventEmitter = new EventEmitter<RendererEventMap>()
  private pageWidth = 0
  private pageHeight = 0

  // 元素 ID 到 Fabric 对象的映射
  private elementMap = new Map<string, FabricObject>()
  // 页面背景矩形（不可选）
  private pageRect: Rect | null = null

  // ========== 生命周期 ==========

  mount(container: HTMLElement): void {
    this.container = container

    // 清空容器
    container.innerHTML = ''

    // 创建 canvas 元素
    const canvasEl = document.createElement('canvas')
    container.appendChild(canvasEl)

    // 获取容器尺寸
    const { width, height } = container.getBoundingClientRect()

    // 初始化 Fabric Canvas
    this.canvas = new FabricCanvas(canvasEl, {
      width: width || 800,
      height: height || 600,
      selection: true,
      preserveObjectStacking: true,
      stopContextMenu: true,
      backgroundColor: '#F0F1F5',
    })

    // 设置全局选中样式
    this.setupSelectionStyle()
    this.setupEventListeners()
    this.setupResizeObserver()
    this.setupWheelZoom()
  }

  /**
   * 设置选中样式 - 紫色边框 + 圆形控制点
   */
  private setupSelectionStyle(): void {
    if (!this.canvas) return

    // 全局默认样式
    const selectionColor = '#8B5CF6' // 紫色
    const defaultControls = {
      borderColor: selectionColor,
      borderScaleFactor: 2,
      cornerColor: '#FFFFFF',
      cornerStrokeColor: selectionColor,
      cornerSize: 10,
      cornerStyle: 'circle' as const,
      transparentCorners: false,
      padding: 0,
      rotatingPointOffset: 30,
    }

    // 设置 canvas 的多选框样式
    this.canvas.selectionColor = 'rgba(139, 92, 246, 0.1)'
    this.canvas.selectionBorderColor = selectionColor
    this.canvas.selectionLineWidth = 2

    // 设置对象默认样式 - 通过原型设置
    Object.assign(this.canvas.getActiveObject?.() || {}, defaultControls)

    // 监听对象添加，设置选中样式
    this.canvas.on('object:added', (e) => {
      const obj = e.target
      if (obj && (obj as any).data?.elementId) {
        obj.set(defaultControls)
      }
    })
  }

  private setupResizeObserver(): void {
    if (!this.container || !this.canvas) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        if (this.canvas && width > 0 && height > 0) {
          this.canvas.setDimensions({ width, height })
          // 重新居中内容
          if (this.pageWidth > 0 && this.pageHeight > 0) {
            this.centerContent()
          }
          this.canvas.requestRenderAll()
        }
      }
    })

    resizeObserver.observe(this.container)
  }

  /**
   * 设置滚轮缩放
   */
  private setupWheelZoom(): void {
    if (!this.canvas) return

    this.canvas.on('mouse:wheel', (opt) => {
      const e = opt.e as WheelEvent
      e.preventDefault()
      e.stopPropagation()

      const delta = e.deltaY
      let zoom = this.canvas!.getZoom()

      // 缩放因子
      zoom *= 0.999 ** delta

      // 限制缩放范围
      if (zoom > 5) zoom = 5
      if (zoom < 0.1) zoom = 0.1

      // 以画布中心缩放
      const center = this.canvas!.getCenterPoint()
      this.canvas!.zoomToPoint(center, zoom)
      this.centerContent()
      this.eventEmitter.emit('zoom:changed', zoom)
    })
  }

  unmount(): void {
    if (this.canvas) {
      this.canvas.dispose()
      this.canvas = null
    }
    this.elementMap.clear()
  }

  destroy(): void {
    this.unmount()
    this.eventEmitter.clear()
  }

  // 锁定标识元素
  private lockIndicator: HTMLDivElement | null = null

  // ========== 事件设置 ==========

  private setupEventListeners(): void {
    if (!this.canvas) return

    this.canvas.on('selection:created', () => {
      this.eventEmitter.emit('selection:changed', this.getSelection())
    })

    this.canvas.on('selection:updated', () => {
      this.eventEmitter.emit('selection:changed', this.getSelection())
    })

    this.canvas.on('selection:cleared', () => {
      this.eventEmitter.emit('selection:changed', [])
    })

    // 鼠标移入对象 - 显示锁定标识
    this.canvas.on('mouse:over', (e) => {
      const obj = e.target
      if (obj && (obj as any).data?.elementId) {
        const elementId = (obj as any).data.elementId
        const element = this.getElement(elementId)
        if (element?.locked) {
          this.showLockIndicator(obj)
        }
      }
    })

    // 鼠标移出对象 - 隐藏锁定标识
    this.canvas.on('mouse:out', () => {
      this.hideLockIndicator()
    })

    // 对象修改事件
    this.canvas.on('object:modified', (e) => {
      const obj = e.target
      if (obj) {
        const elementId = (obj as any).data?.elementId
        if (elementId) {
          this.syncElementFromFabric(elementId)
        }
      }
    })

    // 文本编辑事件
    this.canvas.on('text:changed', (e) => {
      const obj = e.target
      if (obj) {
        const elementId = (obj as any).data?.elementId
        if (elementId) {
          this.syncElementFromFabric(elementId)
        }
      }
    })
  }

  /**
   * 显示锁定标识
   */
  private showLockIndicator(obj: FabricObject): void {
    if (!this.container || !this.canvas) return

    // 创建锁定标识元素
    if (!this.lockIndicator) {
      this.lockIndicator = document.createElement('div')
      this.lockIndicator.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <span>已锁定</span>
      `
      this.lockIndicator.style.cssText = `
        position: absolute;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        background: rgba(245, 158, 11, 0.9);
        color: white;
        font-size: 12px;
        font-weight: 500;
        border-radius: 4px;
        pointer-events: none;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      `
      this.container.appendChild(this.lockIndicator)
    }

    // 计算位置
    const zoom = this.canvas.getZoom()
    const vpt = this.canvas.viewportTransform
    if (!vpt) return

    const objCenter = obj.getCenterPoint()
    const left = objCenter.x * zoom + vpt[4]
    const top = (obj.top || 0) * zoom + vpt[5] - 30

    this.lockIndicator.style.left = `${left}px`
    this.lockIndicator.style.top = `${top}px`
    this.lockIndicator.style.transform = 'translateX(-50%)'
    this.lockIndicator.style.display = 'flex'
  }

  /**
   * 隐藏锁定标识
   */
  private hideLockIndicator(): void {
    if (this.lockIndicator) {
      this.lockIndicator.style.display = 'none'
    }
  }

  /**
   * 将 Fabric 对象的变化同步回元素数据
   */
  private syncElementFromFabric(elementId: string): void {
    const page = this.getActivePage()
    if (!page) return

    const elementIndex = page.elements.findIndex((el) => el.id === elementId)
    if (elementIndex === -1) return

    const element = page.elements[elementIndex]
    const fabricObj = this.elementMap.get(elementId)
    if (!fabricObj) return

    let updatedElement: Element

    switch (element.type) {
      case 'text':
        updatedElement = TextRenderer.toElement(fabricObj as any, element as TextElement)
        break
      case 'image':
        updatedElement = ImageRenderer.toElement(fabricObj as any, element as ImageElement)
        break
      case 'shape':
        updatedElement = ShapeRenderer.toElement(fabricObj, element as ShapeElement)
        break
      default:
        return
    }

    page.elements[elementIndex] = updatedElement
    this.eventEmitter.emit('element:modified', updatedElement)
  }

  // ========== 文档操作 ==========

  loadDocument(doc: Document): void {
    this.document = doc
    if (doc.pages.length > 0) {
      this.setActivePage(doc.pages[0].id)
    }
  }

  getDocument(): Document | null {
    return this.document
  }

  setActivePage(pageId: string): void {
    const page = this.document?.pages.find((p) => p.id === pageId)
    if (!page || !this.canvas) return

    this.activePageId = pageId
    this.pageWidth = page.width
    this.pageHeight = page.height
    this.renderPage(page)
  }

  getActivePage(): Page | null {
    return this.document?.pages.find((p) => p.id === this.activePageId) || null
  }

  private async renderPage(page: Page): Promise<void> {
    if (!this.canvas) return

    // 清除画布上的所有对象
    this.canvas.getObjects().forEach((obj) => {
      this.canvas?.remove(obj)
    })
    this.elementMap.clear()

    // 创建页面背景矩形
    this.pageRect = new Rect({
      left: 0,
      top: 0,
      width: page.width,
      height: page.height,
      fill: this.getBackgroundFill(page.background, page.width, page.height),
      selectable: false,
      evented: false,
      shadow: new Shadow({
        color: 'rgba(0,0,0,0.25)',
        blur: 30,
        offsetX: 0,
        offsetY: 8,
      }),
    })

    this.canvas.add(this.pageRect)

    // 渲染所有元素
    for (const element of page.elements) {
      await this.renderElement(element)
    }

    this.canvas.requestRenderAll()
  }

  private getBackgroundFill(
    background: Background,
    width: number,
    height: number
  ): string | Gradient<'linear', 'linear'> {
    if (background.type === 'solid') {
      return background.color || '#ffffff'
    }

    if (background.type === 'gradient' && background.gradient) {
      const { gradient } = background
      const angle = gradient.angle || 0
      const radians = (angle * Math.PI) / 180

      // 计算渐变的起点和终点
      const cos = Math.cos(radians)
      const sin = Math.sin(radians)

      return new Gradient({
        type: 'linear',
        coords: {
          x1: width / 2 - (cos * width) / 2,
          y1: height / 2 - (sin * height) / 2,
          x2: width / 2 + (cos * width) / 2,
          y2: height / 2 + (sin * height) / 2,
        },
        colorStops: gradient.stops.map((stop) => ({
          offset: stop.offset,
          color: stop.color,
        })),
      })
    }

    return '#ffffff'
  }

  /**
   * 渲染单个元素
   */
  private async renderElement(element: Element): Promise<void> {
    if (!this.canvas) return

    let fabricObj: FabricObject | null = null

    switch (element.type) {
      case 'text':
        fabricObj = TextRenderer.create(element as TextElement)
        break
      case 'image':
        fabricObj = await ImageRenderer.create(element as ImageElement)
        break
      case 'shape':
        fabricObj = ShapeRenderer.create(element as ShapeElement)
        break
    }

    if (fabricObj) {
      this.elementMap.set(element.id, fabricObj)
      this.canvas.add(fabricObj)
    }
  }

  // ========== 元素操作 ==========

  async addElement(element: Element): Promise<void> {
    const page = this.getActivePage()
    if (!page || !this.canvas) return

    // 添加到数据模型
    page.elements.push(element)

    // 渲染到画布
    await this.renderElement(element)
    this.canvas.requestRenderAll()

    this.eventEmitter.emit('element:added', element)
  }

  updateElement(id: string, props: Partial<Element>): void {
    const page = this.getActivePage()
    if (!page || !this.canvas) return

    const elementIndex = page.elements.findIndex((el) => el.id === id)
    if (elementIndex === -1) return

    const element = page.elements[elementIndex]
    const fabricObj = this.elementMap.get(id)

    // 更新数据模型
    const updatedElement = { ...element, ...props } as Element
    page.elements[elementIndex] = updatedElement

    // 更新 Fabric 对象
    if (fabricObj) {
      switch (element.type) {
        case 'text':
          TextRenderer.update(fabricObj as any, props as Partial<TextElement>)
          break
        case 'image':
          ImageRenderer.update(fabricObj as any, props as Partial<ImageElement>)
          break
        case 'shape':
          ShapeRenderer.update(fabricObj, props as Partial<ShapeElement>)
          break
      }
      this.canvas.requestRenderAll()
    }

    this.eventEmitter.emit('element:modified', updatedElement)
  }

  removeElement(id: string): void {
    const page = this.getActivePage()
    if (!page || !this.canvas) return

    const elementIndex = page.elements.findIndex((el) => el.id === id)
    if (elementIndex === -1) return

    // 从数据模型移除
    page.elements.splice(elementIndex, 1)

    // 从画布移除
    const fabricObj = this.elementMap.get(id)
    if (fabricObj) {
      this.canvas.remove(fabricObj)
      this.elementMap.delete(id)
    }

    this.canvas.requestRenderAll()
    this.eventEmitter.emit('element:removed', id)
  }

  getElement(id: string): Element | null {
    const page = this.getActivePage()
    if (!page) return null
    return page.elements.find((el) => el.id === id) || null
  }

  getAllElements(): Element[] {
    return this.getActivePage()?.elements || []
  }

  // ========== 选择 ==========

  select(ids: string[]): void {
    if (!this.canvas) return

    const objects = ids
      .map((id) => this.elementMap.get(id))
      .filter((obj): obj is FabricObject => obj !== undefined)

    if (objects.length === 0) {
      this.clearSelection()
    } else if (objects.length === 1) {
      this.canvas.setActiveObject(objects[0])
    } else {
      const selection = new ActiveSelection(objects, { canvas: this.canvas })
      this.canvas.setActiveObject(selection)
    }

    this.canvas.requestRenderAll()
  }

  selectAll(): void {
    if (!this.canvas) return

    const objects = Array.from(this.elementMap.values())
    if (objects.length === 0) return

    if (objects.length === 1) {
      this.canvas.setActiveObject(objects[0])
    } else {
      const selection = new ActiveSelection(objects, { canvas: this.canvas })
      this.canvas.setActiveObject(selection)
    }

    this.canvas.requestRenderAll()
  }

  getSelection(): string[] {
    if (!this.canvas) return []

    const activeObject = this.canvas.getActiveObject()
    if (!activeObject) return []

    // 如果是多选
    if (activeObject instanceof ActiveSelection) {
      return activeObject.getObjects()
        .map((obj) => (obj as any).data?.elementId)
        .filter((id): id is string => id !== undefined)
    }

    // 单选
    const elementId = (activeObject as any).data?.elementId
    return elementId ? [elementId] : []
  }

  clearSelection(): void {
    this.canvas?.discardActiveObject()
    this.canvas?.requestRenderAll()
  }

  // ========== 画布操作 ==========

  setZoom(zoom: number): void {
    if (!this.canvas) return

    // 获取画布中心
    const center = this.canvas.getCenterPoint()

    this.canvas.zoomToPoint(center, zoom)
    this.centerContent()
    this.eventEmitter.emit('zoom:changed', zoom)
  }

  getZoom(): number {
    return this.canvas?.getZoom() || 1
  }

  zoomToFit(): void {
    if (!this.canvas || !this.container || !this.pageWidth || !this.pageHeight) return

    const { width: containerWidth, height: containerHeight } = this.container.getBoundingClientRect()
    const padding = 60

    const scaleX = (containerWidth - padding * 2) / this.pageWidth
    const scaleY = (containerHeight - padding * 2) / this.pageHeight
    const zoom = Math.min(scaleX, scaleY, 1)

    this.canvas.setZoom(zoom)
    this.centerContent()
    this.eventEmitter.emit('zoom:changed', zoom)
  }

  zoomToFill(): void {
    if (!this.canvas || !this.container || !this.pageWidth || !this.pageHeight) return

    const { width: containerWidth, height: containerHeight } = this.container.getBoundingClientRect()

    // 填满屏幕 - 取较大的缩放比例
    const scaleX = containerWidth / this.pageWidth
    const scaleY = containerHeight / this.pageHeight
    const zoom = Math.max(scaleX, scaleY)

    this.canvas.setZoom(zoom)
    this.centerContent()
    this.eventEmitter.emit('zoom:changed', zoom)
  }

  pan(deltaX: number, deltaY: number): void {
    if (!this.canvas) return

    const vpt = this.canvas.viewportTransform
    if (vpt) {
      vpt[4] += deltaX
      vpt[5] += deltaY
      this.canvas.setViewportTransform(vpt)
    }
  }

  centerContent(): void {
    if (!this.canvas || !this.container) return

    const { width: containerWidth, height: containerHeight } = this.container.getBoundingClientRect()
    const zoom = this.canvas.getZoom()

    const scaledPageWidth = this.pageWidth * zoom
    const scaledPageHeight = this.pageHeight * zoom

    const left = (containerWidth - scaledPageWidth) / 2
    const top = (containerHeight - scaledPageHeight) / 2

    const vpt = this.canvas.viewportTransform
    if (vpt) {
      vpt[4] = left
      vpt[5] = top
      this.canvas.setViewportTransform(vpt)
    }
  }

  // ========== 图层 ==========

  bringToFront(id: string): void {
    const fabricObj = this.elementMap.get(id)
    if (fabricObj && this.canvas) {
      this.canvas.bringObjectToFront(fabricObj)
      this.updateElementOrder()
    }
  }

  sendToBack(id: string): void {
    const fabricObj = this.elementMap.get(id)
    if (fabricObj && this.canvas && this.pageRect) {
      this.canvas.sendObjectToBack(fabricObj)
      // 确保页面背景始终在最底层
      this.canvas.sendObjectToBack(this.pageRect)
      this.updateElementOrder()
    }
  }

  bringForward(id: string): void {
    const fabricObj = this.elementMap.get(id)
    if (fabricObj && this.canvas) {
      this.canvas.bringObjectForward(fabricObj)
      this.updateElementOrder()
    }
  }

  sendBackward(id: string): void {
    const fabricObj = this.elementMap.get(id)
    if (fabricObj && this.canvas && this.pageRect) {
      this.canvas.sendObjectBackwards(fabricObj)
      // 确保页面背景始终在最底层
      const objects = this.canvas.getObjects()
      const pageRectIndex = objects.indexOf(this.pageRect)
      const objIndex = objects.indexOf(fabricObj)
      if (objIndex <= pageRectIndex) {
        this.canvas.bringObjectForward(fabricObj)
      }
      this.updateElementOrder()
    }
  }

  /**
   * 更新数据模型中的元素顺序
   */
  private updateElementOrder(): void {
    const page = this.getActivePage()
    if (!page || !this.canvas) return

    const objects = this.canvas.getObjects()
    const newOrder: Element[] = []

    for (const obj of objects) {
      const elementId = (obj as any).data?.elementId
      if (elementId) {
        const element = page.elements.find((el) => el.id === elementId)
        if (element) {
          newOrder.push(element)
        }
      }
    }

    page.elements = newOrder
  }

  // ========== 导出 ==========

  async toDataURL(options: ExportOptions = {}): Promise<string> {
    if (!this.canvas) throw new Error('Canvas not mounted')

    const format = options.format === 'jpg' ? 'jpeg' : 'png'
    return this.canvas.toDataURL({
      format,
      quality: options.quality || 1,
      multiplier: options.scale || 1,
    })
  }

  async toBlob(options: ExportOptions = {}): Promise<Blob> {
    const dataUrl = await this.toDataURL(options)
    const response = await fetch(dataUrl)
    return response.blob()
  }

  toJSON(): string {
    return JSON.stringify(this.document)
  }

  /**
   * 获取元素在视口中的边界（屏幕坐标）
   */
  getElementBounds(id: string): { left: number; top: number; width: number; height: number } | null {
    if (!this.canvas || !this.container) return null

    const fabricObj = this.elementMap.get(id)
    if (!fabricObj) return null

    const zoom = this.canvas.getZoom()
    const vpt = this.canvas.viewportTransform
    if (!vpt) return null

    // 获取对象的边界框
    const boundingRect = fabricObj.getBoundingRect()

    // 转换为屏幕坐标
    return {
      left: boundingRect.left * zoom + vpt[4],
      top: boundingRect.top * zoom + vpt[5],
      width: boundingRect.width * zoom,
      height: boundingRect.height * zoom,
    }
  }

  getThumbnail(maxSize = 100): string {
    if (!this.canvas || !this.pageWidth || !this.pageHeight) return ''

    // 保存当前视口状态
    const currentZoom = this.canvas.getZoom()
    const currentVpt = this.canvas.viewportTransform

    // 计算缩略图缩放比例
    const scale = Math.min(maxSize / this.pageWidth, maxSize / this.pageHeight)

    // 重置视口以导出原始内容
    this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
    this.canvas.setZoom(1)

    // 生成缩略图
    const dataUrl = this.canvas.toDataURL({
      format: 'png',
      quality: 0.8,
      multiplier: scale,
      left: 0,
      top: 0,
      width: this.pageWidth,
      height: this.pageHeight,
    })

    // 恢复视口状态
    if (currentVpt) {
      this.canvas.setViewportTransform(currentVpt)
    }
    this.canvas.setZoom(currentZoom)

    return dataUrl
  }

  // ========== 事件 ==========

  on<K extends keyof RendererEventMap>(
    event: K,
    handler: (data: RendererEventMap[K]) => void
  ): () => void {
    return this.eventEmitter.on(event, handler)
  }

  off<K extends keyof RendererEventMap>(
    event: K,
    handler: (data: RendererEventMap[K]) => void
  ): void {
    this.eventEmitter.off(event, handler)
  }
}
