import type { Element } from '@beeshot/core'

/**
 * 导出选项
 */
export interface ExportOptions {
  format?: 'png' | 'jpg' | 'svg'
  quality?: number      // 0-1, for jpg
  scale?: number        // 导出倍数 1x, 2x, 3x
  backgroundColor?: string
}

/**
 * 渲染器事件类型
 */
export interface RendererEventMap {
  [key: string]: unknown
  'selection:changed': string[]
  'element:added': Element
  'element:modified': Element
  'element:removed': string
  'zoom:changed': number
  'canvas:click': CanvasClickEvent
  'object:moving': ObjectEvent
  'object:scaling': ObjectEvent
  'object:rotating': ObjectEvent
}

/**
 * 画布点击事件
 */
export interface CanvasClickEvent {
  x: number
  y: number
  target: Element | null
}

/**
 * 对象操作事件
 */
export interface ObjectEvent {
  id: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
}
