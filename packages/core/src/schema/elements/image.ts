import type { BaseElement } from './base'

/**
 * 图片填充模式
 */
export type ImageFit = 'fill' | 'contain' | 'cover'

/**
 * 图片元素
 */
export interface ImageElement extends BaseElement {
  type: 'image'
  src: string

  // 填充
  fit: ImageFit
  borderRadius: number

  // 效果
  shadow?: ImageShadow
  filters?: ImageFilters
}

/**
 * 图片阴影
 */
export interface ImageShadow {
  color: string
  offsetX: number
  offsetY: number
  blur: number
  spread?: number
}

/**
 * 图片滤镜
 */
export interface ImageFilters {
  brightness?: number  // 0-200, 100 is default
  contrast?: number    // 0-200, 100 is default
  saturation?: number  // 0-200, 100 is default
  blur?: number        // 0-20
}

/**
 * 创建默认图片元素
 */
export function createImageElement(
  partial: Partial<ImageElement> & { id: string; src: string }
): ImageElement {
  return {
    type: 'image',
    name: '图片',
    x: 0,
    y: 0,
    width: 300,
    height: 200,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
    visible: true,
    locked: false,
    fit: 'cover',
    borderRadius: 0,
    ...partial,
  }
}
