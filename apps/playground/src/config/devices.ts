/**
 * 设备预设配置
 */
export interface DevicePreset {
  id: string
  name: string
  width: number
  height: number
  category: 'iphone' | 'ipad' | 'android' | 'custom'
  description?: string
}

export const devicePresets: DevicePreset[] = [
  // iPhone
  {
    id: 'iphone-6.7',
    name: 'iPhone 6.7"',
    width: 1290,
    height: 2796,
    category: 'iphone',
    description: 'iPhone 14 Pro Max, 15 Pro Max',
  },
  {
    id: 'iphone-6.5',
    name: 'iPhone 6.5"',
    width: 1242,
    height: 2688,
    category: 'iphone',
    description: 'iPhone 11 Pro Max, XS Max',
  },
  {
    id: 'iphone-6.1',
    name: 'iPhone 6.1"',
    width: 1179,
    height: 2556,
    category: 'iphone',
    description: 'iPhone 14 Pro, 15 Pro',
  },
  {
    id: 'iphone-5.5',
    name: 'iPhone 5.5"',
    width: 1242,
    height: 2208,
    category: 'iphone',
    description: 'iPhone 6/7/8 Plus',
  },
  {
    id: 'iphone-5.4',
    name: 'iPhone 5.4"',
    width: 1080,
    height: 2340,
    category: 'iphone',
    description: 'iPhone 12/13 mini',
  },

  // iPad
  {
    id: 'ipad-12.9',
    name: 'iPad 12.9"',
    width: 2048,
    height: 2732,
    category: 'ipad',
    description: 'iPad Pro 12.9"',
  },
  {
    id: 'ipad-11',
    name: 'iPad 11"',
    width: 1668,
    height: 2388,
    category: 'ipad',
    description: 'iPad Pro 11"',
  },
  {
    id: 'ipad-10.9',
    name: 'iPad 10.9"',
    width: 1640,
    height: 2360,
    category: 'ipad',
    description: 'iPad Air',
  },

  // Android
  {
    id: 'android-phone',
    name: 'Android 手机',
    width: 1080,
    height: 1920,
    category: 'android',
    description: '通用 Android 手机 (16:9)',
  },
  {
    id: 'android-phone-tall',
    name: 'Android 全面屏',
    width: 1080,
    height: 2340,
    category: 'android',
    description: 'Android 全面屏 (19.5:9)',
  },
  {
    id: 'android-tablet',
    name: 'Android 平板',
    width: 1600,
    height: 2560,
    category: 'android',
    description: 'Android 平板 10"',
  },
]

export function getDeviceById(id: string): DevicePreset | undefined {
  return devicePresets.find((d) => d.id === id)
}

export function getDevicesByCategory(category: DevicePreset['category']): DevicePreset[] {
  return devicePresets.filter((d) => d.category === category)
}
