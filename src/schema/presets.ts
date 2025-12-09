import { SlideSchema } from './types'

// 预设 Schema 模板
export const PRESET_SCHEMAS: Record<string, SlideSchema> = {
  // 单截图布局
  single: {
    id: 'single',
    name: '单截图',
    description: '标题 + 单个截图',
    background: {
      type: 'gradient',
      colors: ['#667eea', '#764ba2', '#f093fb'],
    },
    elements: [
      {
        type: 'text',
        id: 'title',
        name: '标题',
        position: { x: '50%', y: '5%', anchor: 'top-center' },
        content: '{{title}}',
        style: {
          fontSize: 90,
          fontWeight: 700,
          color: '#ffffff',
          textAlign: 'center',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        },
      },
      {
        type: 'text',
        id: 'subtitle',
        name: '副标题',
        position: { x: '50%', y: '9%', anchor: 'top-center' },
        content: '{{subtitle}}',
        style: {
          fontSize: 40,
          fontWeight: 400,
          color: 'rgba(255, 255, 255, 0.9)',
          textAlign: 'center',
          textShadow: '0 1px 5px rgba(0, 0, 0, 0.2)',
        },
      },
      {
        type: 'image',
        id: 'screenshot',
        name: '截图',
        position: {
          x: '50%',
          y: '14%',
          width: '32%',
          height: '70%',
          anchor: 'top-center',
        },
        src: '{{screenshot}}',
        placeholder: '上传截图',
        style: {
          borderRadius: 24,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
          objectFit: 'cover',
        },
      },
    ],
  },

  // 带手机框的单截图
  'single-phone': {
    id: 'single-phone',
    name: '单截图(手机框)',
    description: '标题 + 带手机边框的截图',
    background: {
      type: 'gradient',
      colors: ['#667eea', '#764ba2', '#f093fb'],
    },
    elements: [
      {
        type: 'text',
        id: 'title',
        name: '标题',
        position: { x: '50%', y: '5%', anchor: 'top-center' },
        content: '{{title}}',
        style: {
          fontSize: 90,
          fontWeight: 700,
          color: '#ffffff',
          textAlign: 'center',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        },
      },
      {
        type: 'text',
        id: 'subtitle',
        name: '副标题',
        position: { x: '50%', y: '9%', anchor: 'top-center' },
        content: '{{subtitle}}',
        style: {
          fontSize: 40,
          fontWeight: 400,
          color: 'rgba(255, 255, 255, 0.9)',
          textAlign: 'center',
          textShadow: '0 1px 5px rgba(0, 0, 0, 0.2)',
        },
      },
      {
        type: 'phone-frame',
        id: 'phone',
        name: '手机框',
        position: {
          x: '50%',
          y: '13%',
          width: '65%',
          anchor: 'top-center',
        },
        screenshotSrc: '{{screenshot}}',
        style: {
          frameColor: '#000000',
          screenRadius: 40,
          showNotch: true,
        },
      },
    ],
  },

  // 双截图布局
  dual: {
    id: 'dual',
    name: '双截图',
    description: '标题 + 两个倾斜的截图',
    background: {
      type: 'gradient',
      colors: ['#0093E9', '#80D0C7', '#a8edea'],
    },
    elements: [
      {
        type: 'text',
        id: 'title',
        name: '标题',
        position: { x: '50%', y: '5%', anchor: 'top-center' },
        content: '{{title}}',
        style: {
          fontSize: 90,
          fontWeight: 700,
          color: '#ffffff',
          textAlign: 'center',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        },
      },
      {
        type: 'text',
        id: 'subtitle',
        name: '副标题',
        position: { x: '50%', y: '9%', anchor: 'top-center' },
        content: '{{subtitle}}',
        style: {
          fontSize: 40,
          fontWeight: 400,
          color: 'rgba(255, 255, 255, 0.9)',
          textAlign: 'center',
          textShadow: '0 1px 5px rgba(0, 0, 0, 0.2)',
        },
      },
      {
        type: 'image',
        id: 'screenshot1',
        name: '截图1',
        position: {
          x: '30%',
          y: '18%',
          width: '25%',
          height: '55%',
          anchor: 'top-center',
          rotation: -8,
        },
        src: '{{screenshot}}',
        placeholder: '截图1',
        style: {
          borderRadius: 20,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          objectFit: 'cover',
        },
      },
      {
        type: 'image',
        id: 'screenshot2',
        name: '截图2',
        position: {
          x: '70%',
          y: '18%',
          width: '25%',
          height: '55%',
          anchor: 'top-center',
          rotation: 8,
        },
        src: '{{screenshot2}}',
        placeholder: '截图2',
        style: {
          borderRadius: 20,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          objectFit: 'cover',
        },
      },
    ],
  },

  // 截图 + 二维码
  'screenshot-qrcode': {
    id: 'screenshot-qrcode',
    name: '截图+二维码',
    description: '截图 + 下载二维码',
    background: {
      type: 'gradient',
      colors: ['#ff9a9e', '#fecfef', '#fad0c4'],
    },
    elements: [
      {
        type: 'text',
        id: 'title',
        name: '标题',
        position: { x: '50%', y: '4%', anchor: 'top-center' },
        content: '{{title}}',
        style: {
          fontSize: 90,
          fontWeight: 700,
          color: '#ffffff',
          textAlign: 'center',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        },
      },
      {
        type: 'text',
        id: 'subtitle',
        name: '副标题',
        position: { x: '50%', y: '8%', anchor: 'top-center' },
        content: '{{subtitle}}',
        style: {
          fontSize: 40,
          fontWeight: 400,
          color: 'rgba(255, 255, 255, 0.9)',
          textAlign: 'center',
          textShadow: '0 1px 5px rgba(0, 0, 0, 0.2)',
        },
      },
      {
        type: 'image',
        id: 'screenshot',
        name: '截图',
        position: {
          x: '50%',
          y: '12%',
          width: '32%',
          height: '50%',
          anchor: 'top-center',
        },
        src: '{{screenshot}}',
        placeholder: '上传截图',
        style: {
          borderRadius: 20,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
          objectFit: 'cover',
        },
      },
      {
        type: 'qrcode',
        id: 'qrcode1',
        name: '二维码1',
        position: {
          x: '35%',
          y: '67%',
          anchor: 'top-center',
        },
        url: '{{qrcode1.url}}',
        label: '{{qrcode1.label}}',
        style: {
          size: 180,
          padding: 12,
          borderRadius: 16,
          background: '#ffffff',
        },
        labelStyle: {
          fontSize: 20,
          color: 'rgba(255, 255, 255, 0.9)',
          fontWeight: 500,
        },
      },
      {
        type: 'qrcode',
        id: 'qrcode2',
        name: '二维码2',
        position: {
          x: '65%',
          y: '67%',
          anchor: 'top-center',
        },
        url: '{{qrcode2.url}}',
        label: '{{qrcode2.label}}',
        style: {
          size: 180,
          padding: 12,
          borderRadius: 16,
          background: '#ffffff',
        },
        labelStyle: {
          fontSize: 20,
          color: 'rgba(255, 255, 255, 0.9)',
          fontWeight: 500,
        },
      },
    ],
  },

  // 综合展示
  showcase: {
    id: 'showcase',
    name: '综合展示',
    description: '双截图 + 二维码 + 标签',
    background: {
      type: 'gradient',
      colors: ['#134E5E', '#71B280', '#c1dfc4'],
    },
    elements: [
      {
        type: 'text',
        id: 'title',
        name: '标题',
        position: { x: '50%', y: '3%', anchor: 'top-center' },
        content: '{{title}}',
        style: {
          fontSize: 84,
          fontWeight: 700,
          color: '#ffffff',
          textAlign: 'center',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        },
      },
      {
        type: 'text',
        id: 'subtitle',
        name: '副标题',
        position: { x: '50%', y: '6.5%', anchor: 'top-center' },
        content: '{{subtitle}}',
        style: {
          fontSize: 36,
          fontWeight: 400,
          color: 'rgba(255, 255, 255, 0.9)',
          textAlign: 'center',
          textShadow: '0 1px 5px rgba(0, 0, 0, 0.2)',
        },
      },
      {
        type: 'image',
        id: 'screenshot1',
        name: '截图1(亮色)',
        position: {
          x: '32%',
          y: '12%',
          width: '20%',
          height: '38%',
          anchor: 'top-center',
          rotation: -8,
        },
        src: '{{screenshot}}',
        placeholder: '亮色',
        style: {
          borderRadius: 16,
          boxShadow: '0 15px 40px rgba(0, 0, 0, 0.5)',
          objectFit: 'cover',
        },
      },
      {
        type: 'image',
        id: 'screenshot2',
        name: '截图2(暗色)',
        position: {
          x: '68%',
          y: '12%',
          width: '20%',
          height: '38%',
          anchor: 'top-center',
          rotation: 8,
        },
        src: '{{screenshot2}}',
        placeholder: '暗色',
        style: {
          borderRadius: 16,
          boxShadow: '0 15px 40px rgba(0, 0, 0, 0.5)',
          objectFit: 'cover',
        },
      },
      {
        type: 'qrcode',
        id: 'qrcode1',
        name: '二维码1',
        position: {
          x: '35%',
          y: '54%',
          anchor: 'top-center',
        },
        url: '{{qrcode1.url}}',
        label: '{{qrcode1.label}}',
        style: {
          size: 150,
          padding: 10,
          borderRadius: 14,
          background: '#ffffff',
        },
        labelStyle: {
          fontSize: 16,
          color: 'rgba(255, 255, 255, 0.9)',
          fontWeight: 500,
        },
      },
      {
        type: 'qrcode',
        id: 'qrcode2',
        name: '二维码2',
        position: {
          x: '65%',
          y: '54%',
          anchor: 'top-center',
        },
        url: '{{qrcode2.url}}',
        label: '{{qrcode2.label}}',
        style: {
          size: 150,
          padding: 10,
          borderRadius: 14,
          background: '#ffffff',
        },
        labelStyle: {
          fontSize: 16,
          color: 'rgba(255, 255, 255, 0.9)',
          fontWeight: 500,
        },
      },
      {
        type: 'tags',
        id: 'tags',
        name: '标签',
        position: {
          x: '50%',
          y: '77%',
          anchor: 'top-center',
        },
        tags: ['{{tags}}'],
        gap: 12,
        style: {
          fill: 'rgba(255, 255, 255, 0.15)',
          borderRadius: 20,
          backdropFilter: 'blur(10px)',
        },
        tagStyle: {
          fontSize: 14,
          fontWeight: 500,
          color: 'rgba(255, 255, 255, 0.9)',
        },
      },
    ],
  },

  // 蜜蜂记账风格
  beecount: {
    id: 'beecount',
    name: '蜜蜂记账',
    description: '深色背景 + 金色主题',
    background: {
      type: 'gradient',
      colors: ['#0a0a0a', '#111111', '#0a0a0a'],
    },
    elements: [
      // 装饰性渐变背景
      {
        type: 'shape',
        id: 'glow1',
        name: '顶部光晕',
        position: {
          x: '50%',
          y: '-20%',
          width: '80%',
          height: '50%',
          anchor: 'top-center',
        },
        shape: 'circle',
        style: {
          fill: 'radial-gradient(ellipse, rgba(248, 201, 28, 0.3), transparent)',
        },
        zIndex: 1,
      },
      {
        type: 'text',
        id: 'title',
        name: '标题',
        position: { x: '50%', y: '5%', anchor: 'top-center' },
        content: '{{title}}',
        style: {
          fontSize: 100,
          fontWeight: 700,
          color: '#F8C91C',
          textAlign: 'center',
          letterSpacing: '0.5em',
          textShadow: '0 0 40px rgba(248, 201, 28, 0.5)',
        },
        zIndex: 10,
      },
      {
        type: 'text',
        id: 'subtitle',
        name: '副标题',
        position: { x: '50%', y: '10%', anchor: 'top-center' },
        content: '{{subtitle}}',
        style: {
          fontSize: 44,
          fontWeight: 300,
          color: 'rgba(255, 255, 255, 0.7)',
          textAlign: 'center',
          letterSpacing: '0.8em',
        },
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
}

// 获取所有预设列表
export const getPresetList = () => {
  return Object.values(PRESET_SCHEMAS).map(schema => ({
    id: schema.id,
    name: schema.name,
    description: schema.description,
  }))
}

// 根据 ID 获取预设
export const getPresetById = (id: string): SlideSchema | undefined => {
  return PRESET_SCHEMAS[id]
}

// 深拷贝 schema（用于创建可编辑的副本）
export const cloneSchema = (schema: SlideSchema): SlideSchema => {
  return JSON.parse(JSON.stringify(schema))
}
