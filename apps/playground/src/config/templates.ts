import type { Document, TextElement, ShapeElement } from '@beeshot/core'
import { generateId } from '@beeshot/core'

/**
 * 模板配置
 */
export interface Template {
  id: string
  name: string
  description: string
  thumbnail?: string
  category: 'simple' | 'gradient' | 'dark' | 'mockup' | 'comparison'
  createDocument: () => Document
}

// 创建基础文本元素
const createTextElement = (
  content: string,
  x: number,
  y: number,
  options: Partial<TextElement> = {}
): TextElement => ({
  id: generateId('text'),
  type: 'text',
  name: content.slice(0, 20),
  x,
  y,
  width: options.width || 800,
  height: options.height || 100,
  rotation: 0,
  scaleX: 1,
  scaleY: 1,
  opacity: 1,
  visible: true,
  locked: false,
  content,
  fontSize: options.fontSize || 48,
  fontFamily: options.fontFamily || 'Inter',
  fontWeight: options.fontWeight || 600,
  color: options.color || '#ffffff',
  align: options.align || 'center',
  lineHeight: options.lineHeight || 1.4,
  letterSpacing: options.letterSpacing || 0,
  ...options,
})

// 创建形状元素
const createShapeElement = (
  shapeType: ShapeElement['shapeType'],
  x: number,
  y: number,
  width: number,
  height: number,
  options: Partial<ShapeElement> = {}
): ShapeElement => ({
  id: generateId('shape'),
  type: 'shape',
  name: shapeType,
  x,
  y,
  width,
  height,
  rotation: 0,
  scaleX: 1,
  scaleY: 1,
  opacity: 1,
  visible: true,
  locked: false,
  shapeType,
  fill: options.fill || { type: 'solid', color: '#ffffff' },
  stroke: options.stroke || { color: 'transparent', width: 0 },
  borderRadius: options.borderRadius,
  ...options,
})

/**
 * 模板 1: 简约白
 */
const simpleWhiteTemplate: Template = {
  id: 'simple-white',
  name: '简约白',
  description: '干净简洁的白色背景模板',
  category: 'simple',
  createDocument: () => ({
    id: generateId('doc'),
    version: '1.0.0',
    name: '简约白模板',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    pages: [
      {
        id: generateId('page'),
        name: '第 1 页',
        width: 1290,
        height: 2796,
        background: { type: 'solid', color: '#ffffff' },
        elements: [
          createTextElement('您的应用名称', 645, 200, {
            width: 1000,
            fontSize: 72,
            fontWeight: 700,
            color: '#1a1a1a',
          }),
          createTextElement('一句话描述您的应用', 645, 320, {
            width: 1000,
            fontSize: 36,
            fontWeight: 400,
            color: '#666666',
          }),
          createShapeElement('rect', 245, 500, 800, 1600, {
            fill: { type: 'solid', color: '#f5f5f5' },
            borderRadius: 40,
          }),
          createTextElement('截图占位', 645, 1250, {
            fontSize: 24,
            color: '#999999',
          }),
          createTextElement('功能特点一', 645, 2300, {
            fontSize: 32,
            fontWeight: 600,
            color: '#1a1a1a',
          }),
          createTextElement('简短的功能描述文字', 645, 2380, {
            fontSize: 24,
            color: '#666666',
          }),
        ],
      },
    ],
    assets: [],
  }),
}

/**
 * 模板 2: 渐变紫
 */
const gradientPurpleTemplate: Template = {
  id: 'gradient-purple',
  name: '渐变紫',
  description: '现代感渐变背景模板',
  category: 'gradient',
  createDocument: () => ({
    id: generateId('doc'),
    version: '1.0.0',
    name: '渐变紫模板',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    pages: [
      {
        id: generateId('page'),
        name: '第 1 页',
        width: 1290,
        height: 2796,
        background: {
          type: 'gradient',
          gradient: {
            type: 'linear',
            angle: 135,
            stops: [
              { offset: 0, color: '#667eea' },
              { offset: 1, color: '#764ba2' },
            ],
          },
        },
        elements: [
          createTextElement('探索无限可能', 645, 250, {
            width: 1000,
            fontSize: 80,
            fontWeight: 700,
            color: '#ffffff',
          }),
          createTextElement('让创意触手可及', 645, 380, {
            width: 1000,
            fontSize: 40,
            fontWeight: 400,
            color: 'rgba(255,255,255,0.85)',
          }),
          createShapeElement('rect', 195, 550, 900, 1700, {
            fill: { type: 'solid', color: 'rgba(255,255,255,0.15)' },
            borderRadius: 50,
          }),
          createTextElement('App 截图', 645, 1350, {
            fontSize: 28,
            color: 'rgba(255,255,255,0.6)',
          }),
          createShapeElement('rect', 145, 2400, 1000, 200, {
            fill: { type: 'solid', color: 'rgba(255,255,255,0.2)' },
            borderRadius: 100,
          }),
          createTextElement('立即下载', 645, 2470, {
            fontSize: 36,
            fontWeight: 600,
            color: '#ffffff',
          }),
        ],
      },
    ],
    assets: [],
  }),
}

/**
 * 模板 3: 深色酷炫
 */
const darkCoolTemplate: Template = {
  id: 'dark-cool',
  name: '深色酷炫',
  description: '高级感深色背景模板',
  category: 'dark',
  createDocument: () => ({
    id: generateId('doc'),
    version: '1.0.0',
    name: '深色酷炫模板',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    pages: [
      {
        id: generateId('page'),
        name: '第 1 页',
        width: 1290,
        height: 2796,
        background: {
          type: 'gradient',
          gradient: {
            type: 'linear',
            angle: 180,
            stops: [
              { offset: 0, color: '#0f0f23' },
              { offset: 1, color: '#1a1a2e' },
            ],
          },
        },
        elements: [
          createShapeElement('circle', 100, 100, 300, 300, {
            fill: { type: 'solid', color: '#F8C91C' },
            opacity: 0.1,
          }),
          createShapeElement('circle', 900, 2400, 400, 400, {
            fill: { type: 'solid', color: '#F8C91C' },
            opacity: 0.08,
          }),
          createTextElement('专业级体验', 645, 280, {
            width: 1000,
            fontSize: 76,
            fontWeight: 700,
            color: '#ffffff',
          }),
          createTextElement('重新定义您的工作流程', 645, 400, {
            width: 1000,
            fontSize: 36,
            color: '#888888',
          }),
          createShapeElement('rect', 195, 580, 900, 1650, {
            fill: { type: 'solid', color: '#1e1e2e' },
            stroke: { color: '#333', width: 1 },
            borderRadius: 40,
          }),
          createTextElement('应用截图', 645, 1350, {
            fontSize: 24,
            color: '#555555',
          }),
          createTextElement('✨ 功能亮点', 645, 2380, {
            fontSize: 28,
            fontWeight: 600,
            color: '#F8C91C',
          }),
          createTextElement('极致性能 · 流畅体验 · 专业工具', 645, 2460, {
            fontSize: 24,
            color: '#888888',
          }),
        ],
      },
    ],
    assets: [],
  }),
}

/**
 * 模板 4: 蜜蜂黄品牌
 */
const honeyBrandTemplate: Template = {
  id: 'honey-brand',
  name: '蜜蜂黄',
  description: 'BeeShot 品牌色模板',
  category: 'gradient',
  createDocument: () => ({
    id: generateId('doc'),
    version: '1.0.0',
    name: '蜜蜂黄模板',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    pages: [
      {
        id: generateId('page'),
        name: '第 1 页',
        width: 1290,
        height: 2796,
        background: {
          type: 'gradient',
          gradient: {
            type: 'linear',
            angle: 150,
            stops: [
              { offset: 0, color: '#F8C91C' },
              { offset: 1, color: '#EAB308' },
            ],
          },
        },
        elements: [
          createTextElement('🐝', 645, 150, {
            fontSize: 120,
          }),
          createTextElement('嗡嗡嗡', 645, 320, {
            width: 1000,
            fontSize: 72,
            fontWeight: 700,
            color: '#1a1a1a',
          }),
          createTextElement('让截图更有蜂蜜味', 645, 430, {
            width: 1000,
            fontSize: 36,
            color: 'rgba(0,0,0,0.6)',
          }),
          createShapeElement('rect', 195, 580, 900, 1650, {
            fill: { type: 'solid', color: 'rgba(255,255,255,0.9)' },
            borderRadius: 50,
          }),
          createTextElement('您的精彩截图', 645, 1350, {
            fontSize: 28,
            color: '#CA8A04',
          }),
          createShapeElement('rect', 245, 2350, 800, 160, {
            fill: { type: 'solid', color: '#1a1a1a' },
            borderRadius: 80,
          }),
          createTextElement('免费下载', 645, 2400, {
            fontSize: 36,
            fontWeight: 600,
            color: '#F8C91C',
          }),
        ],
      },
    ],
    assets: [],
  }),
}

/**
 * 模板 5: 双截图对比
 */
const comparisonTemplate: Template = {
  id: 'comparison',
  name: '双截图对比',
  description: '展示前后对比或功能对比',
  category: 'comparison',
  createDocument: () => ({
    id: generateId('doc'),
    version: '1.0.0',
    name: '对比模板',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    pages: [
      {
        id: generateId('page'),
        name: '第 1 页',
        width: 1290,
        height: 2796,
        background: {
          type: 'gradient',
          gradient: {
            type: 'linear',
            angle: 135,
            stops: [
              { offset: 0, color: '#1e3a5f' },
              { offset: 1, color: '#0d1b2a' },
            ],
          },
        },
        elements: [
          createTextElement('功能对比', 645, 200, {
            width: 1000,
            fontSize: 64,
            fontWeight: 700,
            color: '#ffffff',
          }),
          createTextElement('看看有什么不同', 645, 300, {
            width: 1000,
            fontSize: 32,
            color: 'rgba(255,255,255,0.7)',
          }),
          // 左侧截图框
          createShapeElement('rect', 70, 450, 550, 1100, {
            fill: { type: 'solid', color: 'rgba(255,255,255,0.1)' },
            borderRadius: 30,
          }),
          createTextElement('之前', 345, 1600, {
            fontSize: 28,
            fontWeight: 600,
            color: '#ffffff',
          }),
          // 右侧截图框
          createShapeElement('rect', 670, 450, 550, 1100, {
            fill: { type: 'solid', color: 'rgba(255,255,255,0.1)' },
            borderRadius: 30,
          }),
          createTextElement('之后', 945, 1600, {
            fontSize: 28,
            fontWeight: 600,
            color: '#ffffff',
          }),
          // VS 标志
          createShapeElement('circle', 545, 900, 200, 200, {
            fill: { type: 'solid', color: '#F8C91C' },
          }),
          createTextElement('VS', 645, 970, {
            fontSize: 48,
            fontWeight: 700,
            color: '#1a1a1a',
          }),
          // 底部描述
          createTextElement('升级到专业版', 645, 1800, {
            fontSize: 40,
            fontWeight: 600,
            color: '#F8C91C',
          }),
          createTextElement('解锁更多强大功能', 645, 1880, {
            fontSize: 28,
            color: 'rgba(255,255,255,0.7)',
          }),
        ],
      },
    ],
    assets: [],
  }),
}

/**
 * 所有模板
 */
export const templates: Template[] = [
  simpleWhiteTemplate,
  gradientPurpleTemplate,
  darkCoolTemplate,
  honeyBrandTemplate,
  comparisonTemplate,
]

export function getTemplateById(id: string): Template | undefined {
  return templates.find((t) => t.id === id)
}

export function getTemplatesByCategory(category: Template['category']): Template[] {
  return templates.filter((t) => t.category === category)
}
