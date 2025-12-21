import { Canvas as FabricCanvas, Rect, Gradient, Shadow } from 'fabric'
import type { Document, Page, Element, Background } from '@beeshot/core'
import { EventEmitter } from '@beeshot/core'
import type { IRenderer } from '../interface/renderer'
import type { ExportOptions, RendererEventMap } from '../interface/types'

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

  // ========== 生命周期 ==========

  mount(container: HTMLElement): void {
    this.container = container
    const canvasEl = window.document.createElement('canvas')
    canvasEl.id = 'beeshot-canvas'
    container.appendChild(canvasEl)

    // 获取容器尺寸
    const { width, height } = container.getBoundingClientRect()

    this.canvas = new FabricCanvas(canvasEl, {
      width: width || 800,
      height: height || 600,
      selection: true,
      preserveObjectStacking: true,
      stopContextMenu: true,
      backgroundColor: '#e5e5e5',
    })

    this.setupEventListeners()
    this.setupResizeObserver()
  }

  private setupResizeObserver(): void {
    if (!this.container || !this.canvas) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        if (this.canvas && width > 0 && height > 0) {
          this.canvas.setDimensions({ width, height })
          this.canvas.requestRenderAll()
        }
      }
    })

    resizeObserver.observe(this.container)
  }

  unmount(): void {
    if (this.canvas) {
      this.canvas.dispose()
      this.canvas = null
    }
  }

  destroy(): void {
    this.unmount()
    this.eventEmitter.clear()
  }

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

  private renderPage(page: Page): void {
    if (!this.canvas) return

    // 清除画布上的所有对象
    this.canvas.getObjects().forEach((obj) => {
      this.canvas?.remove(obj)
    })

    // 创建页面背景矩形
    const pageRect = new Rect({
      left: 0,
      top: 0,
      width: page.width,
      height: page.height,
      fill: this.getBackgroundFill(page.background, page.width, page.height),
      selectable: false,
      evented: false,
      shadow: new Shadow({
        color: 'rgba(0,0,0,0.15)',
        blur: 20,
        offsetX: 0,
        offsetY: 4,
      }),
    })

    this.canvas.add(pageRect)
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

  // ========== 元素操作 ==========

  addElement(_element: Element): void {
    // TODO: 实现
  }

  updateElement(_id: string, _props: Partial<Element>): void {
    // TODO: 实现
  }

  removeElement(_id: string): void {
    // TODO: 实现
  }

  getElement(_id: string): Element | null {
    // TODO: 实现
    return null
  }

  getAllElements(): Element[] {
    return this.getActivePage()?.elements || []
  }

  // ========== 选择 ==========

  select(_ids: string[]): void {
    // TODO: 实现
  }

  selectAll(): void {
    // TODO: 实现
  }

  getSelection(): string[] {
    // TODO: 实现
    return []
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

  pan(_deltaX: number, _deltaY: number): void {
    // TODO: 实现
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

  bringToFront(_id: string): void {
    // TODO: 实现
  }

  sendToBack(_id: string): void {
    // TODO: 实现
  }

  bringForward(_id: string): void {
    // TODO: 实现
  }

  sendBackward(_id: string): void {
    // TODO: 实现
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
