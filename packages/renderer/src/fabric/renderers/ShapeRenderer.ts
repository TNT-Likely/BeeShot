import { Rect, Circle, Triangle, Line, type FabricObject } from 'fabric'
import type { ShapeElement } from '@beeshot/core'

/**
 * 形状元素渲染器
 */
export class ShapeRenderer {
  /**
   * 创建 Fabric 形状对象
   */
  static create(element: ShapeElement): FabricObject {
    let shape: FabricObject

    const commonProps = {
      left: element.x,
      top: element.y,
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
      fill: element.fill.type === 'solid' ? element.fill.color : 'transparent',
      stroke: element.stroke.color,
      strokeWidth: element.stroke.width,
      strokeDashArray: ShapeRenderer.getStrokeDashArray(element.stroke.style),
    }

    switch (element.shapeType) {
      case 'rect':
        shape = new Rect({
          ...commonProps,
          width: element.width,
          height: element.height,
          rx: element.borderRadius ?? 0,
          ry: element.borderRadius ?? 0,
        })
        break

      case 'circle':
        shape = new Circle({
          ...commonProps,
          radius: Math.min(element.width, element.height) / 2,
        })
        break

      case 'triangle':
        shape = new Triangle({
          ...commonProps,
          width: element.width,
          height: element.height,
        })
        break

      case 'line':
        shape = new Line([0, 0, element.width, element.height], {
          ...commonProps,
          fill: undefined,
        })
        break

      default:
        shape = new Rect({
          ...commonProps,
          width: element.width,
          height: element.height,
        })
    }

    // 设置阴影（如果有）
    if (element.fill.type === 'solid') {
      // 可以添加阴影支持
    }

    // 存储元素 ID
    shape.set('data', { elementId: element.id })

    return shape
  }

  /**
   * 获取描边虚线数组
   */
  private static getStrokeDashArray(style?: string): number[] | undefined {
    switch (style) {
      case 'dashed':
        return [10, 5]
      case 'dotted':
        return [2, 4]
      default:
        return undefined
    }
  }

  /**
   * 从 Fabric 对象更新元素数据
   */
  static toElement(fabricObj: FabricObject, existingElement: ShapeElement): ShapeElement {
    const result: ShapeElement = {
      ...existingElement,
      x: fabricObj.left ?? existingElement.x,
      y: fabricObj.top ?? existingElement.y,
      rotation: fabricObj.angle ?? existingElement.rotation,
      scaleX: fabricObj.scaleX ?? existingElement.scaleX,
      scaleY: fabricObj.scaleY ?? existingElement.scaleY,
    }

    // 根据形状类型获取尺寸
    if (fabricObj instanceof Rect || fabricObj instanceof Triangle) {
      result.width = (fabricObj.width ?? existingElement.width) * (fabricObj.scaleX ?? 1)
      result.height = (fabricObj.height ?? existingElement.height) * (fabricObj.scaleY ?? 1)
      result.scaleX = 1
      result.scaleY = 1
    } else if (fabricObj instanceof Circle) {
      const diameter = ((fabricObj as Circle).radius ?? 50) * 2
      result.width = diameter * (fabricObj.scaleX ?? 1)
      result.height = diameter * (fabricObj.scaleY ?? 1)
      result.scaleX = 1
      result.scaleY = 1
    }

    return result
  }

  /**
   * 更新 Fabric 对象
   */
  static update(fabricObj: FabricObject, props: Partial<ShapeElement>): void {
    if (props.x !== undefined) fabricObj.set('left', props.x)
    if (props.y !== undefined) fabricObj.set('top', props.y)
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

    if (props.fill) {
      fabricObj.set('fill', props.fill.type === 'solid' ? props.fill.color : 'transparent')
    }

    if (props.stroke) {
      fabricObj.set('stroke', props.stroke.color)
      fabricObj.set('strokeWidth', props.stroke.width)
      fabricObj.set('strokeDashArray', ShapeRenderer.getStrokeDashArray(props.stroke.style))
    }

    if (props.width !== undefined && fabricObj instanceof Rect) {
      fabricObj.set('width', props.width)
    }
    if (props.height !== undefined && fabricObj instanceof Rect) {
      fabricObj.set('height', props.height)
    }

    if (props.borderRadius !== undefined && fabricObj instanceof Rect) {
      fabricObj.set('rx', props.borderRadius)
      fabricObj.set('ry', props.borderRadius)
    }
  }
}
