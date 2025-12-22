import { IText, Shadow } from 'fabric'
import type { TextElement } from '@beeshot/core'

/**
 * 文本元素渲染器
 */
export class TextRenderer {
  /**
   * 创建 Fabric IText 对象
   */
  static create(element: TextElement): IText {
    const text = new IText(element.content, {
      left: element.x,
      top: element.y,
      width: element.width,
      fontSize: element.fontSize,
      fontFamily: element.fontFamily,
      fontWeight: element.fontWeight,
      fill: element.color,
      textAlign: element.align,
      lineHeight: element.lineHeight,
      charSpacing: element.letterSpacing * 10, // Fabric uses 1/1000 em
      angle: element.rotation,
      scaleX: element.scaleX,
      scaleY: element.scaleY,
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

    // 设置阴影
    if (element.shadow) {
      text.shadow = new Shadow({
        color: element.shadow.color,
        offsetX: element.shadow.offsetX,
        offsetY: element.shadow.offsetY,
        blur: element.shadow.blur,
      })
    }

    // 存储元素 ID
    text.set('data', { elementId: element.id })

    return text
  }

  /**
   * 从 Fabric 对象更新元素数据
   */
  static toElement(fabricObj: IText, existingElement: TextElement): TextElement {
    return {
      ...existingElement,
      x: fabricObj.left ?? existingElement.x,
      y: fabricObj.top ?? existingElement.y,
      width: fabricObj.width ?? existingElement.width,
      height: fabricObj.height ?? existingElement.height,
      rotation: fabricObj.angle ?? existingElement.rotation,
      scaleX: fabricObj.scaleX ?? existingElement.scaleX,
      scaleY: fabricObj.scaleY ?? existingElement.scaleY,
      content: fabricObj.text ?? existingElement.content,
      fontSize: fabricObj.fontSize ?? existingElement.fontSize,
      fontFamily: fabricObj.fontFamily ?? existingElement.fontFamily,
      fontWeight: (fabricObj.fontWeight as number) ?? existingElement.fontWeight,
      color: (fabricObj.fill as string) ?? existingElement.color,
      align: (fabricObj.textAlign as TextElement['align']) ?? existingElement.align,
    }
  }

  /**
   * 更新 Fabric 对象
   */
  static update(fabricObj: IText, props: Partial<TextElement>): void {
    if (props.x !== undefined) fabricObj.set('left', props.x)
    if (props.y !== undefined) fabricObj.set('top', props.y)
    if (props.width !== undefined) fabricObj.set('width', props.width)
    if (props.rotation !== undefined) fabricObj.set('angle', props.rotation)
    if (props.scaleX !== undefined) fabricObj.set('scaleX', props.scaleX)
    if (props.scaleY !== undefined) fabricObj.set('scaleY', props.scaleY)
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
    if (props.content !== undefined) fabricObj.set('text', props.content)
    if (props.fontSize !== undefined) fabricObj.set('fontSize', props.fontSize)
    if (props.fontFamily !== undefined) fabricObj.set('fontFamily', props.fontFamily)
    if (props.fontWeight !== undefined) fabricObj.set('fontWeight', props.fontWeight)
    if (props.color !== undefined) fabricObj.set('fill', props.color)
    if (props.align !== undefined) fabricObj.set('textAlign', props.align)
    if (props.lineHeight !== undefined) fabricObj.set('lineHeight', props.lineHeight)
    if (props.letterSpacing !== undefined) fabricObj.set('charSpacing', props.letterSpacing * 10)

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
