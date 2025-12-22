import { FabricImage, Shadow } from 'fabric'
import type { ImageElement } from '@beeshot/core'

/**
 * 图片元素渲染器
 */
export class ImageRenderer {
  /**
   * 创建 Fabric Image 对象
   */
  static async create(element: ImageElement): Promise<FabricImage> {
    const img = await FabricImage.fromURL(element.src, {
      crossOrigin: 'anonymous',
    })

    img.set({
      left: element.x,
      top: element.y,
      angle: element.rotation,
      scaleX: element.scaleX * (element.width / (img.width || 1)),
      scaleY: element.scaleY * (element.height / (img.height || 1)),
      opacity: element.opacity,
      visible: element.visible,
      selectable: true,
      evented: true,
      // 锁定时禁止移动/缩放/旋转，但仍可选中
      lockMovementX: element.locked,
      lockMovementY: element.locked,
      lockScalingX: element.locked,
      lockScalingY: element.locked,
      lockRotation: element.locked,
      hasControls: !element.locked,
    })

    // 设置圆角
    if (element.borderRadius > 0) {
      img.set('clipPath', ImageRenderer.createRoundedClip(
        element.width,
        element.height,
        element.borderRadius
      ))
    }

    // 设置阴影
    if (element.shadow) {
      img.shadow = new Shadow({
        color: element.shadow.color,
        offsetX: element.shadow.offsetX,
        offsetY: element.shadow.offsetY,
        blur: element.shadow.blur,
      })
    }

    // 存储元素 ID
    img.set('data', { elementId: element.id })

    return img
  }

  /**
   * 创建圆角裁剪路径
   */
  private static createRoundedClip(width: number, height: number, radius: number) {
    const { Rect } = require('fabric')
    return new Rect({
      width,
      height,
      rx: radius,
      ry: radius,
      originX: 'center',
      originY: 'center',
    })
  }

  /**
   * 从 Fabric 对象更新元素数据
   */
  static toElement(fabricObj: FabricImage, existingElement: ImageElement): ImageElement {
    const imgWidth = fabricObj.width || 1
    const imgHeight = fabricObj.height || 1

    return {
      ...existingElement,
      x: fabricObj.left ?? existingElement.x,
      y: fabricObj.top ?? existingElement.y,
      width: imgWidth * (fabricObj.scaleX ?? 1),
      height: imgHeight * (fabricObj.scaleY ?? 1),
      rotation: fabricObj.angle ?? existingElement.rotation,
      scaleX: 1,
      scaleY: 1,
    }
  }

  /**
   * 更新 Fabric 对象
   */
  static update(fabricObj: FabricImage, props: Partial<ImageElement>): void {
    if (props.x !== undefined) fabricObj.set('left', props.x)
    if (props.y !== undefined) fabricObj.set('top', props.y)
    if (props.rotation !== undefined) fabricObj.set('angle', props.rotation)
    if (props.opacity !== undefined) fabricObj.set('opacity', props.opacity)
    if (props.visible !== undefined) fabricObj.set('visible', props.visible)
    if (props.locked !== undefined) {
      // 锁定时禁止移动/缩放/旋转，但仍可选中
      fabricObj.set('lockMovementX', props.locked)
      fabricObj.set('lockMovementY', props.locked)
      fabricObj.set('lockScalingX', props.locked)
      fabricObj.set('lockScalingY', props.locked)
      fabricObj.set('lockRotation', props.locked)
      fabricObj.set('hasControls', !props.locked)
    }

    // 尺寸变化需要重新计算 scale
    if (props.width !== undefined || props.height !== undefined) {
      const imgWidth = fabricObj.width || 1
      const imgHeight = fabricObj.height || 1
      if (props.width !== undefined) {
        fabricObj.set('scaleX', props.width / imgWidth)
      }
      if (props.height !== undefined) {
        fabricObj.set('scaleY', props.height / imgHeight)
      }
    }

    if (props.shadow) {
      fabricObj.shadow = new Shadow({
        color: props.shadow.color,
        offsetX: props.shadow.offsetX,
        offsetY: props.shadow.offsetY,
        blur: props.shadow.blur,
      })
    }
  }
}
