import type { Element } from '@beeshot/core'
import { generateId, deepClone } from '@beeshot/core'
import type { IRenderer } from '@beeshot/renderer'

/**
 * 剪贴板管理器
 */
export class ClipboardManager {
  private clipboard: Element[] = []
  private renderer: IRenderer

  constructor(renderer: IRenderer) {
    this.renderer = renderer
  }

  /**
   * 复制选中的元素
   */
  copy(): void {
    const selectedIds = this.renderer.getSelection()
    if (selectedIds.length === 0) return

    this.clipboard = selectedIds
      .map((id) => this.renderer.getElement(id))
      .filter((el): el is Element => el !== null)
      .map((el) => deepClone(el))
  }

  /**
   * 粘贴元素
   * @param offset 位置偏移量
   */
  async paste(offset = 20): Promise<Element[]> {
    if (this.clipboard.length === 0) return []

    const pastedElements: Element[] = []

    for (const original of this.clipboard) {
      const newElement = deepClone(original)
      newElement.id = generateId()
      newElement.x += offset
      newElement.y += offset

      await this.renderer.addElement(newElement)
      pastedElements.push(newElement)
    }

    // 选中粘贴的元素
    if (pastedElements.length > 0) {
      this.renderer.select(pastedElements.map((el) => el.id))
    }

    return pastedElements
  }

  /**
   * 复制并粘贴（快捷复制）
   */
  async duplicate(): Promise<Element[]> {
    this.copy()
    return this.paste(30)
  }

  /**
   * 剪切选中的元素
   */
  cut(): void {
    this.copy()
    const selectedIds = this.renderer.getSelection()
    selectedIds.forEach((id) => this.renderer.removeElement(id))
  }

  /**
   * 检查剪贴板是否有内容
   */
  hasContent(): boolean {
    return this.clipboard.length > 0
  }

  /**
   * 清空剪贴板
   */
  clear(): void {
    this.clipboard = []
  }
}
