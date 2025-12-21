import type { Document, Page, Element } from '@beeshot/core'
import type { ExportOptions, RendererEventMap } from './types'

/**
 * 渲染器接口
 * 所有渲染器实现都必须遵循此接口
 */
export interface IRenderer {
  // 生命周期
  mount(container: HTMLElement): void
  unmount(): void
  destroy(): void

  // 文档操作
  loadDocument(doc: Document): void
  getDocument(): Document | null
  setActivePage(pageId: string): void
  getActivePage(): Page | null

  // 元素操作
  addElement(element: Element): void
  updateElement(id: string, props: Partial<Element>): void
  removeElement(id: string): void
  getElement(id: string): Element | null
  getAllElements(): Element[]

  // 选择
  select(ids: string[]): void
  selectAll(): void
  getSelection(): string[]
  clearSelection(): void

  // 画布操作
  setZoom(zoom: number): void
  getZoom(): number
  zoomToFit(): void
  pan(deltaX: number, deltaY: number): void
  centerContent(): void

  // 图层
  bringToFront(id: string): void
  sendToBack(id: string): void
  bringForward(id: string): void
  sendBackward(id: string): void

  // 导出
  toDataURL(options?: ExportOptions): Promise<string>
  toBlob(options?: ExportOptions): Promise<Blob>
  toJSON(): string

  // 事件
  on<K extends keyof RendererEventMap>(
    event: K,
    handler: (data: RendererEventMap[K]) => void
  ): () => void
  off<K extends keyof RendererEventMap>(
    event: K,
    handler: (data: RendererEventMap[K]) => void
  ): void
}
