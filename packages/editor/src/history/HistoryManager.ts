import type { Command } from './Command'

/**
 * 历史记录管理器
 */
export class HistoryManager {
  private undoStack: Command[] = []
  private redoStack: Command[] = []
  private maxHistory: number

  constructor(maxHistory = 50) {
    this.maxHistory = maxHistory
  }

  /**
   * 执行命令
   */
  execute(command: Command): void {
    command.execute()
    this.undoStack.push(command)
    this.redoStack = []

    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift()
    }
  }

  /**
   * 撤销
   */
  undo(): boolean {
    const command = this.undoStack.pop()
    if (!command) return false

    command.undo()
    this.redoStack.push(command)
    return true
  }

  /**
   * 重做
   */
  redo(): boolean {
    const command = this.redoStack.pop()
    if (!command) return false

    command.execute()
    this.undoStack.push(command)
    return true
  }

  /**
   * 是否可以撤销
   */
  canUndo(): boolean {
    return this.undoStack.length > 0
  }

  /**
   * 是否可以重做
   */
  canRedo(): boolean {
    return this.redoStack.length > 0
  }

  /**
   * 清空历史
   */
  clear(): void {
    this.undoStack = []
    this.redoStack = []
  }
}
