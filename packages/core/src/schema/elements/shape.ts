import type { BaseElement } from './base'

/**
 * 形状类型
 */
export type ShapeType = 'rect' | 'circle' | 'triangle' | 'line'

/**
 * 形状元素
 */
export interface ShapeElement extends BaseElement {
  type: 'shape'
  shapeType: ShapeType

  // 填充
  fill: ShapeFill
  stroke: ShapeStroke

  // 圆角（仅矩形）
  borderRadius?: number
}

/**
 * 形状填充
 */
export interface ShapeFill {
  type: 'solid' | 'none'
  color?: string
}

/**
 * 形状描边
 */
export interface ShapeStroke {
  width: number
  color: string
  style?: 'solid' | 'dashed' | 'dotted'
}

/**
 * 创建默认形状元素
 */
export function createShapeElement(
  partial: Partial<ShapeElement> & { id: string }
): ShapeElement {
  return {
    type: 'shape',
    name: '形状',
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
    visible: true,
    locked: false,
    shapeType: 'rect',
    fill: { type: 'solid', color: '#3b82f6' },
    stroke: { width: 0, color: '#000000' },
    borderRadius: 0,
    ...partial,
  }
}
