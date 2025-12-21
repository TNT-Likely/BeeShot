import type { BaseElement } from './base'

/**
 * 文本对齐方式
 */
export type TextAlign = 'left' | 'center' | 'right'

/**
 * 文本元素
 */
export interface TextElement extends BaseElement {
  type: 'text'
  content: string

  // 字体样式
  fontSize: number
  fontFamily: string
  fontWeight: number
  color: string

  // 排版
  align: TextAlign
  lineHeight: number
  letterSpacing: number

  // 效果
  shadow?: TextShadow
}

/**
 * 文本阴影
 */
export interface TextShadow {
  color: string
  offsetX: number
  offsetY: number
  blur: number
}

/**
 * 创建默认文本元素
 */
export function createTextElement(
  partial: Partial<TextElement> & { id: string }
): TextElement {
  return {
    type: 'text',
    name: '文本',
    x: 0,
    y: 0,
    width: 200,
    height: 50,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
    visible: true,
    locked: false,
    content: '双击编辑文本',
    fontSize: 24,
    fontFamily: 'system-ui',
    fontWeight: 400,
    color: '#000000',
    align: 'left',
    lineHeight: 1.4,
    letterSpacing: 0,
    ...partial,
  }
}
