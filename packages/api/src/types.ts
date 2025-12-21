/**
 * API 配置
 */
export interface ApiConfig {
  baseUrl?: string
  headers?: Record<string, string>
}

/**
 * API 响应
 */
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string }

/**
 * 分页参数
 */
export interface PaginationParams {
  page?: number
  pageSize?: number
}

/**
 * 分页响应
 */
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ============================================
// API 类型定义（预留，后端实现后补充）
// ============================================

/**
 * 用户
 */
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: string
}

/**
 * 项目
 */
export interface Project {
  id: string
  name: string
  userId: string
  data: string  // JSON string of Document
  thumbnail?: string
  createdAt: string
  updatedAt: string
}

/**
 * 模板
 */
export interface Template {
  id: string
  name: string
  category: string
  thumbnail: string
  data: string  // JSON string of Document
  isPremium: boolean
  price?: number
}
