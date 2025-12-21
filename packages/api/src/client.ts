import type { ApiResponse, ApiConfig } from './types'

/**
 * API 客户端
 */
export class ApiClient {
  private baseUrl: string
  private headers: Record<string, string>

  constructor(config: ApiConfig = {}) {
    this.baseUrl = config.baseUrl || '/api'
    this.headers = {
      'Content-Type': 'application/json',
      ...config.headers,
    }
  }

  /**
   * 设置认证 Token
   */
  setToken(token: string): void {
    this.headers['Authorization'] = `Bearer ${token}`
  }

  /**
   * 清除认证 Token
   */
  clearToken(): void {
    delete this.headers['Authorization']
  }

  /**
   * 通用请求方法
   */
  private async request<T>(
    method: string,
    path: string,
    data?: unknown
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${path}`

    try {
      const response = await fetch(url, {
        method,
        headers: this.headers,
        body: data ? JSON.stringify(data) : undefined,
      })

      const json = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: json.message || `HTTP ${response.status}`,
        }
      }

      return {
        success: true,
        data: json.data,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  // HTTP 方法
  get<T>(path: string): Promise<ApiResponse<T>> {
    return this.request<T>('GET', path)
  }

  post<T>(path: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>('POST', path, data)
  }

  put<T>(path: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', path, data)
  }

  delete<T>(path: string): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', path)
  }
}

/**
 * 默认 API 客户端实例
 */
export const apiClient = new ApiClient()
