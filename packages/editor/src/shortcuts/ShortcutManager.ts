import type { Editor } from '../Editor'

interface Shortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  action: () => void
}

/**
 * 快捷键管理器
 */
export class ShortcutManager {
  private editor: Editor
  private shortcuts: Shortcut[] = []
  private handler: (e: KeyboardEvent) => void

  constructor(editor: Editor) {
    this.editor = editor
    this.handler = this.handleKeyDown.bind(this)

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.handler)
    }
  }

  /**
   * 注册默认快捷键
   */
  registerDefaults(): void {
    // 撤销/重做
    this.register({ key: 'z', ctrl: true, action: () => this.editor.undo() })
    this.register({ key: 'z', ctrl: true, shift: true, action: () => this.editor.redo() })
    this.register({ key: 'y', ctrl: true, action: () => this.editor.redo() })

    // 选择
    this.register({ key: 'a', ctrl: true, action: () => this.editor.selectAll() })
    this.register({ key: 'Escape', action: () => this.editor.clearSelection() })

    // 删除
    this.register({ key: 'Delete', action: () => this.editor.removeSelectedElements() })
    this.register({ key: 'Backspace', action: () => this.editor.removeSelectedElements() })
  }

  /**
   * 注册快捷键
   */
  register(shortcut: Shortcut): void {
    this.shortcuts.push(shortcut)
  }

  /**
   * 处理键盘事件
   */
  private handleKeyDown(e: KeyboardEvent): void {
    // 忽略输入框中的快捷键
    const target = e.target as HTMLElement
    if (['INPUT', 'TEXTAREA'].includes(target.tagName)) {
      return
    }

    for (const shortcut of this.shortcuts) {
      const ctrlMatch = !!e.ctrlKey === !!shortcut.ctrl || !!e.metaKey === !!shortcut.ctrl
      const shiftMatch = !!e.shiftKey === !!shortcut.shift
      const altMatch = !!e.altKey === !!shortcut.alt
      const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase()

      if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
        e.preventDefault()
        shortcut.action()
        return
      }
    }
  }

  /**
   * 销毁
   */
  destroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.handler)
    }
  }
}
