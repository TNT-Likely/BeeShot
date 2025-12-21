/**
 * 命令接口
 */
export interface Command {
  execute(): void
  undo(): void
}
