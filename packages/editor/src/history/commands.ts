import type { Element } from '@beeshot/core'
import type { IRenderer } from '@beeshot/renderer'
import type { Command } from './Command'

/**
 * 添加元素命令
 */
export class AddElementCommand implements Command {
  constructor(
    private renderer: IRenderer,
    private element: Element
  ) {}

  execute(): void {
    this.renderer.addElement(this.element)
  }

  undo(): void {
    this.renderer.removeElement(this.element.id)
  }
}

/**
 * 更新元素命令
 */
export class UpdateElementCommand implements Command {
  constructor(
    private renderer: IRenderer,
    private elementId: string,
    private newProps: Partial<Element>,
    private oldProps: Partial<Element>
  ) {}

  execute(): void {
    this.renderer.updateElement(this.elementId, this.newProps)
  }

  undo(): void {
    this.renderer.updateElement(this.elementId, this.oldProps)
  }
}

/**
 * 删除元素命令
 */
export class RemoveElementCommand implements Command {
  constructor(
    private renderer: IRenderer,
    private element: Element
  ) {}

  execute(): void {
    this.renderer.removeElement(this.element.id)
  }

  undo(): void {
    this.renderer.addElement(this.element)
  }
}
