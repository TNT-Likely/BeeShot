import type { BaseElement, Element } from './base'

/**
 * 分组元素
 */
export interface GroupElement extends BaseElement {
  type: 'group'
  children: Element[]
}

/**
 * 创建默认分组元素
 */
export function createGroupElement(
  partial: Partial<GroupElement> & { id: string; children: Element[] }
): GroupElement {
  return {
    type: 'group',
    name: '分组',
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
    visible: true,
    locked: false,
    ...partial,
  }
}
