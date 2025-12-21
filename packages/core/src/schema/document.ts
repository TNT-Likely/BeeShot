import type { Page } from './page'

/**
 * 文档结构
 */
export interface Document {
  id: string
  version: string
  name: string
  createdAt: number
  updatedAt: number
  pages: Page[]
  assets: Asset[]
  metadata?: DocumentMetadata
}

/**
 * 资源文件
 */
export interface Asset {
  id: string
  type: 'image' | 'font' | 'video'
  name: string
  src: string
  size?: number
  mimeType?: string
}

/**
 * 文档元数据
 */
export interface DocumentMetadata {
  author?: string
  description?: string
  tags?: string[]
}
