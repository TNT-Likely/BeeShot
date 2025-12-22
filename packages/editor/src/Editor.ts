import type { IRenderer } from '@beeshot/renderer'
import type { Element } from '@beeshot/core'
import { HistoryManager, AddElementCommand, UpdateElementCommand, RemoveElementCommand } from './history'
import { ShortcutManager } from './shortcuts'
import { ClipboardManager } from './clipboard'

export interface EditorOptions {
  renderer: IRenderer
  enableShortcuts?: boolean
}

/**
 * 编辑器主类
 */
export class Editor {
  public readonly renderer: IRenderer
  public readonly history: HistoryManager
  public readonly shortcuts: ShortcutManager
  public readonly clipboard: ClipboardManager

  constructor(options: EditorOptions) {
    this.renderer = options.renderer
    this.history = new HistoryManager()
    this.clipboard = new ClipboardManager(options.renderer)
    this.shortcuts = new ShortcutManager(this)

    if (options.enableShortcuts !== false) {
      this.shortcuts.registerDefaults()
    }
  }

  // ========== 元素操作（带历史记录）==========

  addElement(element: Element): void {
    const command = new AddElementCommand(this.renderer, element)
    this.history.execute(command)
  }

  updateElement(id: string, props: Partial<Element>): void {
    const oldElement = this.renderer.getElement(id)
    if (!oldElement) return

    // 提取旧属性值
    const oldProps: Partial<Element> = {}
    for (const key of Object.keys(props) as (keyof Element)[]) {
      if (key in oldElement) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (oldProps as any)[key] = (oldElement as any)[key]
      }
    }

    const command = new UpdateElementCommand(this.renderer, id, props, oldProps)
    this.history.execute(command)
  }

  removeElement(id: string): void {
    const element = this.renderer.getElement(id)
    if (!element) return

    const command = new RemoveElementCommand(this.renderer, element)
    this.history.execute(command)
  }

  removeSelectedElements(): void {
    const ids = this.renderer.getSelection()
    ids.forEach((id) => this.removeElement(id))
  }

  // ========== 快捷操作 ==========

  undo(): void {
    this.history.undo()
  }

  redo(): void {
    this.history.redo()
  }

  selectAll(): void {
    this.renderer.selectAll()
  }

  clearSelection(): void {
    this.renderer.clearSelection()
  }

  // ========== 剪贴板操作 ==========

  copy(): void {
    this.clipboard.copy()
  }

  async paste(): Promise<void> {
    await this.clipboard.paste()
  }

  cut(): void {
    this.clipboard.cut()
  }

  async duplicate(): Promise<void> {
    await this.clipboard.duplicate()
  }

  // ========== 导出 ==========

  async exportToPNG(scale = 1): Promise<Blob> {
    return this.renderer.toBlob({ format: 'png', scale })
  }

  async exportToJPG(quality = 0.9): Promise<Blob> {
    return this.renderer.toBlob({ format: 'jpg', quality })
  }

  // ========== 生命周期 ==========

  destroy(): void {
    this.shortcuts.destroy()
    this.renderer.destroy()
  }
}
