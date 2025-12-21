import type { Element } from './elements'
import type { Background } from './background'

/**
 * 页面结构
 */
export interface Page {
  id: string
  name: string
  width: number
  height: number
  background: Background
  elements: Element[]
}

/**
 * 设备预设尺寸
 */
export interface DevicePreset {
  id: string
  name: string
  width: number
  height: number
  category: 'iphone' | 'ipad' | 'android' | 'social' | 'custom'
}

/**
 * 常用设备尺寸预设
 */
export const DEVICE_PRESETS: DevicePreset[] = [
  // iPhone
  { id: 'iphone-6.7', name: 'iPhone 6.7"', width: 1290, height: 2796, category: 'iphone' },
  { id: 'iphone-6.5', name: 'iPhone 6.5"', width: 1242, height: 2688, category: 'iphone' },
  { id: 'iphone-5.5', name: 'iPhone 5.5"', width: 1242, height: 2208, category: 'iphone' },

  // iPad
  { id: 'ipad-12.9', name: 'iPad 12.9"', width: 2048, height: 2732, category: 'ipad' },
  { id: 'ipad-11', name: 'iPad 11"', width: 1668, height: 2388, category: 'ipad' },

  // Social Media
  { id: 'xiaohongshu', name: '小红书 3:4', width: 1242, height: 1656, category: 'social' },
  { id: 'wechat-cover', name: '公众号封面', width: 900, height: 383, category: 'social' },
  { id: 'instagram', name: 'Instagram 1:1', width: 1080, height: 1080, category: 'social' },
]
