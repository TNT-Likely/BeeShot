/**
 * 元素类型
 */
export type ElementType = 'text' | 'image' | 'shape' | 'group' | 'qrcode' | 'phone-frame'

/**
 * 基础元素接口
 */
export interface BaseElement {
  id: string
  type: ElementType
  name: string

  // 位置和尺寸
  x: number
  y: number
  width: number
  height: number

  // 变换
  rotation: number
  scaleX: number
  scaleY: number

  // 显示属性
  opacity: number
  visible: boolean
  locked: boolean

  // 层级
  zIndex?: number
}

/**
 * 元素联合类型
 */
export type Element =
  | import('./text').TextElement
  | import('./image').ImageElement
  | import('./shape').ShapeElement
  | import('./group').GroupElement
