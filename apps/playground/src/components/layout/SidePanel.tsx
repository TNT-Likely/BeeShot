import { Search, X, Square, Circle, Triangle, Minus, Type, Upload } from 'lucide-react'
import type { SidebarTab } from './IconSidebar'
import { useEditorContext } from '@beeshot/ui'
import { generateId } from '@beeshot/core'
import type { TextElement, ShapeElement } from '@beeshot/core'
import { templates, devicePresets } from '../../config'

interface SidePanelProps {
  activeTab: SidebarTab | null
  isHovered?: boolean
  onClose?: () => void
  onTemplateSelect?: (templateId: string) => void
  onDeviceSelect?: (deviceId: string) => void
}

export function SidePanel({ activeTab, isHovered, onClose, onTemplateSelect, onDeviceSelect }: SidePanelProps) {
  const editor = useEditorContext()

  // 只在 hover 时显示
  if (!activeTab || !isHovered) return null

  const addTextElement = (preset: 'heading' | 'subheading' | 'body') => {
    if (!editor) return

    const configs = {
      heading: { fontSize: 72, fontWeight: 700, content: '标题文本' },
      subheading: { fontSize: 48, fontWeight: 600, content: '副标题' },
      body: { fontSize: 24, fontWeight: 400, content: '正文内容' },
    }

    const config = configs[preset]
    const element: TextElement = {
      id: generateId('text'),
      type: 'text',
      name: config.content,
      x: 300,
      y: 500,
      width: 600,
      height: config.fontSize * 1.5,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      visible: true,
      locked: false,
      content: config.content,
      fontSize: config.fontSize,
      fontFamily: 'Inter',
      fontWeight: config.fontWeight,
      color: '#000000',
      align: 'center',
      lineHeight: 1.4,
      letterSpacing: 0,
    }

    editor.addElement(element)
  }

  const addShapeElement = (shapeType: ShapeElement['shapeType']) => {
    if (!editor) return

    const element: ShapeElement = {
      id: generateId('shape'),
      type: 'shape',
      name: shapeType,
      x: 400,
      y: 600,
      width: shapeType === 'line' ? 300 : 200,
      height: shapeType === 'line' ? 4 : 200,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      visible: true,
      locked: false,
      shapeType,
      fill: { type: 'solid', color: '#F8C91C' },
      stroke: { color: '#000000', width: 0 },
      borderRadius: shapeType === 'rect' ? 8 : undefined,
    }

    editor.addElement(element)
  }

  return (
    <aside className="absolute left-16 top-0 bottom-0 w-[280px] bg-white dark:bg-[#252525] flex flex-col shadow-xl z-20 border-r border-gray-200 dark:border-gray-800">
      {/* Panel Header */}
      <div className="flex items-center justify-between h-12 px-4 shrink-0">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
          {getPanelTitle(activeTab)}
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-sidebar-hover transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="搜索"
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg bg-gray-100 dark:bg-sidebar text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
          />
        </div>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 pb-4">
        {activeTab === 'design' && (
          <DesignPanel onTemplateSelect={onTemplateSelect} onDeviceSelect={onDeviceSelect} />
        )}
        {activeTab === 'elements' && <ElementsPanel onAddShape={addShapeElement} />}
        {activeTab === 'text' && <TextPanel onAddText={addTextElement} />}
        {activeTab === 'uploads' && <UploadsPanel />}
        {activeTab === 'photos' && <PhotosPanel />}
        {activeTab === 'brand' && <BrandPanel />}
        {activeTab === 'projects' && <ProjectsPanel />}
      </div>
    </aside>
  )
}

function getPanelTitle(tab: SidebarTab): string {
  const titles: Record<SidebarTab, string> = {
    design: '设计',
    elements: '元素',
    text: '文本',
    brand: '品牌',
    uploads: '上传',
    photos: '照片',
    projects: '项目',
  }
  return titles[tab]
}

// 设计面板 - 模板和设备预设
function DesignPanel({
  onTemplateSelect,
  onDeviceSelect,
}: {
  onTemplateSelect?: (id: string) => void
  onDeviceSelect?: (id: string) => void
}) {
  return (
    <div className="space-y-5">
      {/* 设备预设 */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase">
          设备尺寸
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {devicePresets.slice(0, 6).map((device) => (
            <button
              key={device.id}
              onClick={() => onDeviceSelect?.(device.id)}
              className="p-3 rounded-lg bg-gray-100 dark:bg-sidebar hover:bg-gray-200 dark:hover:bg-panel-hover transition-colors text-left"
            >
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {device.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {device.width} × {device.height}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 模板 */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase">
          快速模板
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => onTemplateSelect?.(template.id)}
              className="group relative aspect-[9/16] rounded-lg overflow-hidden hover:ring-2 hover:ring-sky-500 transition-all"
            >
              <div
                className="w-full h-full"
                style={{
                  background: getTemplatePreviewBg(template.id),
                }}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <div className="text-xs font-medium text-white">{template.name}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function getTemplatePreviewBg(id: string): string {
  const bgs: Record<string, string> = {
    'simple-white': '#ffffff',
    'gradient-purple': 'linear-gradient(135deg, #667eea, #764ba2)',
    'dark-cool': 'linear-gradient(180deg, #0f0f23, #1a1a2e)',
    'honey-brand': 'linear-gradient(150deg, #F8C91C, #EAB308)',
    comparison: 'linear-gradient(135deg, #1e3a5f, #0d1b2a)',
  }
  return bgs[id] || '#f5f5f5'
}

// 元素面板 - 形状
function ElementsPanel({
  onAddShape,
}: {
  onAddShape: (type: ShapeElement['shapeType']) => void
}) {
  const shapes = [
    { type: 'rect' as const, icon: Square, label: '矩形' },
    { type: 'circle' as const, icon: Circle, label: '圆形' },
    { type: 'triangle' as const, icon: Triangle, label: '三角形' },
    { type: 'line' as const, icon: Minus, label: '线条' },
  ]

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase">
          基础形状
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {shapes.map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              onClick={() => onAddShape(type)}
              className="aspect-square rounded-lg bg-gray-100 dark:bg-sidebar hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex flex-col items-center justify-center gap-1 text-gray-600 dark:text-gray-300"
            >
              <Icon size={22} />
              <span className="text-[10px]">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase">
          装饰元素
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {['✨', '🌟', '💫', '🔥', '❤️', '🎯'].map((emoji, i) => (
            <button
              key={i}
              className="aspect-square rounded-lg bg-gray-100 dark:bg-sidebar hover:bg-gray-200 dark:hover:bg-panel-hover transition-colors flex items-center justify-center text-xl"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// 文本面板
function TextPanel({
  onAddText,
}: {
  onAddText: (preset: 'heading' | 'subheading' | 'body') => void
}) {
  return (
    <div className="space-y-5">
      <button
        onClick={() => onAddText('heading')}
        className="w-full py-3 px-4 rounded-lg bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
      >
        <Type size={18} />
        添加文本框
      </button>

      <div className="space-y-2">
        <button
          onClick={() => onAddText('heading')}
          className="w-full py-3 px-4 rounded-lg bg-gray-100 dark:bg-sidebar hover:bg-gray-200 dark:hover:bg-panel-hover transition-colors text-left"
        >
          <span className="text-xl font-bold text-gray-900 dark:text-white">添加标题</span>
        </button>
        <button
          onClick={() => onAddText('subheading')}
          className="w-full py-2.5 px-4 rounded-lg bg-gray-100 dark:bg-sidebar hover:bg-gray-200 dark:hover:bg-panel-hover transition-colors text-left"
        >
          <span className="text-base font-semibold text-gray-900 dark:text-white">添加副标题</span>
        </button>
        <button
          onClick={() => onAddText('body')}
          className="w-full py-2 px-4 rounded-lg bg-gray-100 dark:bg-sidebar hover:bg-gray-200 dark:hover:bg-panel-hover transition-colors text-left"
        >
          <span className="text-sm text-gray-900 dark:text-white">添加正文</span>
        </button>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase">
          字体组合
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {['Inter', 'Arial', 'Helvetica', 'Georgia'].map((font) => (
            <div
              key={font}
              className="aspect-video rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center cursor-pointer hover:scale-[1.02] transition-transform"
              style={{ fontFamily: font }}
            >
              <span className="text-sm text-gray-700 dark:text-gray-300">{font}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// 上传面板
function UploadsPanel() {
  return (
    <div className="space-y-5">
      <button className="w-full py-8 px-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/10 transition-colors flex flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
        <Upload size={32} />
        <span className="text-sm font-medium">上传图片</span>
        <span className="text-xs">支持 JPG, PNG, SVG</span>
      </button>

      <div>
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase">
          最近上传
        </h3>
        <div className="text-center text-gray-400 text-sm py-8">暂无上传文件</div>
      </div>
    </div>
  )
}

// 照片面板
function PhotosPanel() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['全部', '自然', '城市', '人物', '抽象'].map((cat, i) => (
          <button
            key={cat}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors
              ${i === 0
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                : 'bg-gray-100 dark:bg-sidebar text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-panel-hover'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-sky-500 transition-all"
          >
            <div
              className="w-full h-full"
              style={{
                background: `linear-gradient(${135 + i * 45}deg,
                  hsl(${(i * 50) % 360}, 60%, 70%),
                  hsl(${(i * 50 + 40) % 360}, 60%, 60%))`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// 品牌面板
function BrandPanel() {
  return (
    <div className="space-y-5">
      <div className="p-4 rounded-lg bg-gray-100 dark:bg-sidebar">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">品牌套件</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          设置品牌颜色、字体和 Logo
        </p>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase">
          品牌颜色
        </h3>
        <div className="flex gap-2">
          {['#F8C91C', '#EAB308', '#1a1a1a', '#ffffff', '#667eea'].map((color) => (
            <button
              key={color}
              className="w-10 h-10 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// 项目面板
function ProjectsPanel() {
  return (
    <div className="space-y-5">
      <button className="w-full py-3 px-4 rounded-lg bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 font-semibold text-sm transition-colors">
        新建项目
      </button>

      <div>
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase">
          最近项目
        </h3>
        <div className="text-center text-gray-400 text-sm py-8">暂无项目</div>
      </div>
    </div>
  )
}
