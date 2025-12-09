import { SlideSchema, SlideVariables } from './types'

// 模板套装定义
export interface TemplatePack {
  id: string
  name: string
  description: string
  author?: string
  preview?: string  // 预览图 URL
  slides: PackSlide[]
}

// 套装中的单个 slide 配置
export interface PackSlide {
  schema: SlideSchema
  defaultVariables: Partial<SlideVariables>
}

// ============================================
// 蜜蜂记账套装 - 完美还原之前的 HTML 样式
// ============================================

const BEECOUNT_BACKGROUND: SlideSchema['background'] = {
  type: 'gradient',
  colors: ['#0a0a0a', '#111111', '#0a0a0a'],
}

// 通用文字样式
const titleStyle = {
  fontSize: 100,
  fontWeight: 700,
  color: '#F8C91C',
  textAlign: 'center' as const,
  letterSpacing: '0.5em',
  textShadow: '0 0 40px rgba(248, 201, 28, 0.5)',
}

const subtitleStyle = {
  fontSize: 44,
  fontWeight: 300,
  color: 'rgba(255, 255, 255, 0.7)',
  textAlign: 'center' as const,
  letterSpacing: '0.8em',
}

// 蜜蜂记账套装
export const BEECOUNT_PACK: TemplatePack = {
  id: 'beecount',
  name: '蜜蜂记账',
  description: '深色背景 + 金色主题，适合 App Store 宣传图',
  author: 'BeeShot',
  slides: [
    // Slide 1: 轻松记账
    {
      schema: {
        id: 'beecount-1',
        name: '轻松记账',
        background: BEECOUNT_BACKGROUND,
        elements: [
          {
            type: 'text',
            id: 'title',
            name: '标题',
            position: { x: '50%', y: '5%', anchor: 'top-center' },
            content: '{{title}}',
            style: titleStyle,
            zIndex: 10,
          },
          {
            type: 'text',
            id: 'subtitle',
            name: '副标题',
            position: { x: '50%', y: '10%', anchor: 'top-center' },
            content: '{{subtitle}}',
            style: subtitleStyle,
            zIndex: 10,
          },
          {
            type: 'image',
            id: 'screenshot',
            name: '截图',
            position: {
              x: '50%',
              y: '16%',
              width: '35%',
              height: '72%',
              anchor: 'top-center',
            },
            src: '{{screenshot}}',
            placeholder: '上传截图',
            style: {
              borderRadius: 30,
              boxShadow: '0 30px 80px rgba(0, 0, 0, 0.5), 0 0 0 2px rgba(255, 255, 255, 0.1)',
              objectFit: 'cover',
            },
            zIndex: 10,
          },
        ],
      },
      defaultVariables: {
        title: '轻松记账',
        subtitle: '每一笔都清清楚楚',
      },
    },

    // Slide 2: 多账本管理
    {
      schema: {
        id: 'beecount-2',
        name: '多账本管理',
        background: BEECOUNT_BACKGROUND,
        elements: [
          {
            type: 'text',
            id: 'title',
            name: '标题',
            position: { x: '50%', y: '5%', anchor: 'top-center' },
            content: '{{title}}',
            style: titleStyle,
            zIndex: 10,
          },
          {
            type: 'text',
            id: 'subtitle',
            name: '副标题',
            position: { x: '50%', y: '10%', anchor: 'top-center' },
            content: '{{subtitle}}',
            style: subtitleStyle,
            zIndex: 10,
          },
          {
            type: 'image',
            id: 'screenshot',
            name: '截图',
            position: {
              x: '50%',
              y: '16%',
              width: '35%',
              height: '72%',
              anchor: 'top-center',
            },
            src: '{{screenshot}}',
            placeholder: '上传截图',
            style: {
              borderRadius: 30,
              boxShadow: '0 30px 80px rgba(0, 0, 0, 0.5), 0 0 0 2px rgba(255, 255, 255, 0.1)',
              objectFit: 'cover',
            },
            zIndex: 10,
          },
        ],
      },
      defaultVariables: {
        title: '多账本',
        subtitle: '分类管理更清晰',
      },
    },

    // Slide 3: 数据统计
    {
      schema: {
        id: 'beecount-3',
        name: '数据统计',
        background: BEECOUNT_BACKGROUND,
        elements: [
          {
            type: 'text',
            id: 'title',
            name: '标题',
            position: { x: '50%', y: '5%', anchor: 'top-center' },
            content: '{{title}}',
            style: titleStyle,
            zIndex: 10,
          },
          {
            type: 'text',
            id: 'subtitle',
            name: '副标题',
            position: { x: '50%', y: '10%', anchor: 'top-center' },
            content: '{{subtitle}}',
            style: subtitleStyle,
            zIndex: 10,
          },
          {
            type: 'image',
            id: 'screenshot',
            name: '截图',
            position: {
              x: '50%',
              y: '16%',
              width: '35%',
              height: '72%',
              anchor: 'top-center',
            },
            src: '{{screenshot}}',
            placeholder: '上传截图',
            style: {
              borderRadius: 30,
              boxShadow: '0 30px 80px rgba(0, 0, 0, 0.5), 0 0 0 2px rgba(255, 255, 255, 0.1)',
              objectFit: 'cover',
            },
            zIndex: 10,
          },
        ],
      },
      defaultVariables: {
        title: '数据统计',
        subtitle: '收支一目了然',
      },
    },

    // Slide 4: 隐私安全
    {
      schema: {
        id: 'beecount-4',
        name: '隐私安全',
        background: BEECOUNT_BACKGROUND,
        elements: [
          {
            type: 'text',
            id: 'title',
            name: '标题',
            position: { x: '50%', y: '5%', anchor: 'top-center' },
            content: '{{title}}',
            style: titleStyle,
            zIndex: 10,
          },
          {
            type: 'text',
            id: 'subtitle',
            name: '副标题',
            position: { x: '50%', y: '10%', anchor: 'top-center' },
            content: '{{subtitle}}',
            style: subtitleStyle,
            zIndex: 10,
          },
          {
            type: 'image',
            id: 'screenshot',
            name: '截图',
            position: {
              x: '50%',
              y: '16%',
              width: '35%',
              height: '72%',
              anchor: 'top-center',
            },
            src: '{{screenshot}}',
            placeholder: '上传截图',
            style: {
              borderRadius: 30,
              boxShadow: '0 30px 80px rgba(0, 0, 0, 0.5), 0 0 0 2px rgba(255, 255, 255, 0.1)',
              objectFit: 'cover',
            },
            zIndex: 10,
          },
        ],
      },
      defaultVariables: {
        title: '隐私安全',
        subtitle: '数据本地存储',
      },
    },

    // Slide 5: 亮暗主题双截图展示
    {
      schema: {
        id: 'beecount-5',
        name: '主题展示',
        background: BEECOUNT_BACKGROUND,
        elements: [
          {
            type: 'text',
            id: 'title',
            name: '标题',
            position: { x: '50%', y: '5%', anchor: 'top-center' },
            content: '{{title}}',
            style: { ...titleStyle, fontSize: 90 },
            zIndex: 10,
          },
          {
            type: 'text',
            id: 'subtitle',
            name: '副标题',
            position: { x: '50%', y: '9.5%', anchor: 'top-center' },
            content: '{{subtitle}}',
            style: { ...subtitleStyle, fontSize: 40 },
            zIndex: 10,
          },
          {
            type: 'image',
            id: 'screenshot1',
            name: '亮色截图',
            position: {
              x: '32%',
              y: '15%',
              width: '28%',
              height: '60%',
              anchor: 'top-center',
              rotation: -6,
            },
            src: '{{screenshot}}',
            placeholder: '亮色主题',
            style: {
              borderRadius: 24,
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
              objectFit: 'cover',
            },
            zIndex: 10,
          },
          {
            type: 'image',
            id: 'screenshot2',
            name: '暗色截图',
            position: {
              x: '68%',
              y: '15%',
              width: '28%',
              height: '60%',
              anchor: 'top-center',
              rotation: 6,
            },
            src: '{{screenshot2}}',
            placeholder: '暗色主题',
            style: {
              borderRadius: 24,
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
              objectFit: 'cover',
            },
            zIndex: 10,
          },
          {
            type: 'tags',
            id: 'tags',
            name: '特性标签',
            position: {
              x: '50%',
              y: '80%',
              anchor: 'top-center',
            },
            tags: ['{{tags}}'],
            gap: 16,
            style: {
              fill: 'rgba(248, 201, 28, 0.15)',
              borderRadius: 20,
            },
            tagStyle: {
              fontSize: 18,
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.9)',
            },
            zIndex: 10,
          },
        ],
      },
      defaultVariables: {
        title: '深浅主题',
        subtitle: '随心切换舒适体验',
        tags: ['开源免费', '无广告', '隐私安全', '本地存储'],
      },
    },

    // Slide 6: 下载二维码
    {
      schema: {
        id: 'beecount-6',
        name: '下载页',
        background: BEECOUNT_BACKGROUND,
        elements: [
          {
            type: 'text',
            id: 'title',
            name: '标题',
            position: { x: '50%', y: '4%', anchor: 'top-center' },
            content: '{{title}}',
            style: { ...titleStyle, fontSize: 90 },
            zIndex: 10,
          },
          {
            type: 'text',
            id: 'subtitle',
            name: '副标题',
            position: { x: '50%', y: '8.5%', anchor: 'top-center' },
            content: '{{subtitle}}',
            style: { ...subtitleStyle, fontSize: 40 },
            zIndex: 10,
          },
          {
            type: 'image',
            id: 'screenshot',
            name: '截图',
            position: {
              x: '50%',
              y: '13%',
              width: '32%',
              height: '52%',
              anchor: 'top-center',
            },
            src: '{{screenshot}}',
            placeholder: '上传截图',
            style: {
              borderRadius: 24,
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5), 0 0 0 2px rgba(255, 255, 255, 0.1)',
              objectFit: 'cover',
            },
            zIndex: 10,
          },
          {
            type: 'qrcode',
            id: 'qrcode1',
            name: 'iOS 二维码',
            position: {
              x: '35%',
              y: '68%',
              anchor: 'top-center',
            },
            url: '{{qrcode1.url}}',
            label: '{{qrcode1.label}}',
            style: {
              size: 160,
              padding: 12,
              borderRadius: 16,
              background: '#ffffff',
            },
            labelStyle: {
              fontSize: 20,
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 500,
            },
            zIndex: 10,
          },
          {
            type: 'qrcode',
            id: 'qrcode2',
            name: 'Android 二维码',
            position: {
              x: '65%',
              y: '68%',
              anchor: 'top-center',
            },
            url: '{{qrcode2.url}}',
            label: '{{qrcode2.label}}',
            style: {
              size: 160,
              padding: 12,
              borderRadius: 16,
              background: '#ffffff',
            },
            labelStyle: {
              fontSize: 20,
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 500,
            },
            zIndex: 10,
          },
        ],
      },
      defaultVariables: {
        title: '立即下载',
        subtitle: '开启轻松记账之旅',
        qrcode1: { url: 'https://apps.apple.com/app/id6754611670', label: 'App Store' },
        qrcode2: { url: 'https://github.com/TNT-Likely/BeeCount/releases', label: 'Android' },
      },
    },
  ],
}

// ============================================
// 所有可用的模板套装
// ============================================

export const TEMPLATE_PACKS: TemplatePack[] = [
  BEECOUNT_PACK,
]

// 根据 ID 获取套装
export const getPackById = (id: string): TemplatePack | undefined => {
  return TEMPLATE_PACKS.find(pack => pack.id === id)
}
