type EventHandler<T = unknown> = (data: T) => void

/**
 * 简单事件发射器
 */
export class EventEmitter<Events extends { [key: string]: unknown } = { [key: string]: unknown }> {
  private handlers = new Map<keyof Events, Set<EventHandler>>()

  /**
   * 订阅事件
   */
  on<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set())
    }
    this.handlers.get(event)!.add(handler as EventHandler)

    // 返回取消订阅函数
    return () => this.off(event, handler)
  }

  /**
   * 取消订阅
   */
  off<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): void {
    this.handlers.get(event)?.delete(handler as EventHandler)
  }

  /**
   * 发射事件
   */
  emit<K extends keyof Events>(event: K, data: Events[K]): void {
    this.handlers.get(event)?.forEach((handler) => {
      try {
        handler(data)
      } catch (error) {
        console.error(`Event handler error for "${String(event)}":`, error)
      }
    })
  }

  /**
   * 一次性订阅
   */
  once<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): () => void {
    const wrapper: EventHandler<Events[K]> = (data) => {
      this.off(event, wrapper)
      handler(data)
    }
    return this.on(event, wrapper)
  }

  /**
   * 清除所有事件
   */
  clear(): void {
    this.handlers.clear()
  }
}
