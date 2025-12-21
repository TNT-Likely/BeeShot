/**
 * 深拷贝对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  // 使用 structuredClone（Node 17+）
  if (typeof structuredClone === 'function') {
    return structuredClone(obj)
  }

  // 降级方案
  return JSON.parse(JSON.stringify(obj))
}

/**
 * 浅合并对象
 */
export function shallowMerge<T extends object>(target: T, source: Partial<T>): T {
  return { ...target, ...source }
}
