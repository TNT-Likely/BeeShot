/**
 * 背景类型
 */
export type BackgroundType = 'solid' | 'gradient' | 'image'

/**
 * 背景配置
 */
export interface Background {
  type: BackgroundType
  color?: string
  gradient?: GradientConfig
  image?: ImageBackgroundConfig
}

/**
 * 渐变配置
 */
export interface GradientConfig {
  type: 'linear' | 'radial'
  angle?: number
  stops: GradientStop[]
}

/**
 * 渐变色标
 */
export interface GradientStop {
  offset: number  // 0-1
  color: string
}

/**
 * 图片背景配置
 */
export interface ImageBackgroundConfig {
  src: string
  fit: 'fill' | 'contain' | 'cover'
  opacity?: number
}

/**
 * 预设渐变
 */
export const GRADIENT_PRESETS: { name: string; gradient: GradientConfig }[] = [
  {
    name: '紫粉渐变',
    gradient: {
      type: 'linear',
      angle: 135,
      stops: [
        { offset: 0, color: '#667eea' },
        { offset: 1, color: '#f093fb' },
      ],
    },
  },
  {
    name: '蓝绿渐变',
    gradient: {
      type: 'linear',
      angle: 135,
      stops: [
        { offset: 0, color: '#4facfe' },
        { offset: 1, color: '#00f2fe' },
      ],
    },
  },
  {
    name: '橙红渐变',
    gradient: {
      type: 'linear',
      angle: 135,
      stops: [
        { offset: 0, color: '#fa709a' },
        { offset: 1, color: '#fee140' },
      ],
    },
  },
  {
    name: '深空渐变',
    gradient: {
      type: 'linear',
      angle: 135,
      stops: [
        { offset: 0, color: '#0f0c29' },
        { offset: 0.5, color: '#302b63' },
        { offset: 1, color: '#24243e' },
      ],
    },
  },
]
