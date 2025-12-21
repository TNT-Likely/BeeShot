import type { Element } from '../schema/elements'

/**
 * 编辑器事件类型
 */
export interface EditorEvents {
  // 选择
  'selection:changed': string[]
  'selection:cleared': void

  // 元素
  'element:added': Element
  'element:updated': { id: string; changes: Partial<Element> }
  'element:removed': string

  // 历史
  'history:changed': { canUndo: boolean; canRedo: boolean }

  // 画布
  'zoom:changed': number
  'pan:changed': { x: number; y: number }

  // 文档
  'document:loaded': void
  'document:saved': void
}
