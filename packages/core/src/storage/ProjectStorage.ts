import type { Document } from '../schema/document'

const DB_NAME = 'beeshot-projects'
const DB_VERSION = 1
const STORE_NAME = 'projects'

export interface ProjectRecord {
  id: string
  name: string
  document: Document
  thumbnail?: string
  createdAt: number
  updatedAt: number
}

/**
 * IndexedDB 项目存储服务
 */
export class ProjectStorage {
  private db: IDBDatabase | null = null

  /**
   * 初始化数据库
   */
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => {
        reject(new Error('Failed to open database'))
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // 创建项目存储
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
          store.createIndex('updatedAt', 'updatedAt', { unique: false })
          store.createIndex('name', 'name', { unique: false })
        }
      }
    })
  }

  /**
   * 保存项目
   */
  async saveProject(project: ProjectRecord): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)

      const request = store.put({
        ...project,
        updatedAt: Date.now(),
      })

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error('Failed to save project'))
    })
  }

  /**
   * 获取项目
   */
  async getProject(id: string): Promise<ProjectRecord | null> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(id)

      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(new Error('Failed to get project'))
    })
  }

  /**
   * 获取所有项目（按更新时间倒序）
   */
  async getAllProjects(): Promise<ProjectRecord[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const index = store.index('updatedAt')
      const request = index.openCursor(null, 'prev')

      const projects: ProjectRecord[] = []

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result
        if (cursor) {
          projects.push(cursor.value)
          cursor.continue()
        } else {
          resolve(projects)
        }
      }

      request.onerror = () => reject(new Error('Failed to get all projects'))
    })
  }

  /**
   * 删除项目
   */
  async deleteProject(id: string): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error('Failed to delete project'))
    })
  }

  /**
   * 获取最近的项目
   */
  async getRecentProjects(limit = 10): Promise<ProjectRecord[]> {
    const all = await this.getAllProjects()
    return all.slice(0, limit)
  }

  /**
   * 关闭数据库连接
   */
  close(): void {
    if (this.db) {
      this.db.close()
      this.db = null
    }
  }
}

// 单例
export const projectStorage = new ProjectStorage()
