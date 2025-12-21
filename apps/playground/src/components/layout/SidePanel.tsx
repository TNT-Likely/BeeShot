import { Search, X } from 'lucide-react'
import type { SidebarTab } from './IconSidebar'

interface SidePanelProps {
  activeTab: SidebarTab | null
  onClose?: () => void
}

export function SidePanel({ activeTab, onClose }: SidePanelProps) {
  if (!activeTab) return null

  return (
    <aside className="w-[300px] h-full bg-white dark:bg-panel flex flex-col shadow-xl shrink-0">
      {/* Panel Header */}
      <div className="flex items-center justify-between h-14 px-4 shrink-0">
        <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white">
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
      <div className="px-3 pb-3">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="搜索"
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-gray-100 dark:bg-sidebar text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-brand/50 transition-all"
          />
        </div>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-3 pb-3">
        {renderPanelContent(activeTab)}
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

function renderPanelContent(tab: SidebarTab) {
  if (tab === 'text') {
    return (
      <div className="space-y-4">
        {/* Add text buttons */}
        <button className="w-full py-4 px-4 rounded-xl bg-brand hover:bg-brand-hover text-white font-semibold text-sm transition-colors">
          添加文本框
        </button>

        {/* Text styles */}
        <div className="space-y-2">
          <button className="w-full py-4 px-4 rounded-xl bg-gray-100 dark:bg-sidebar hover:bg-gray-200 dark:hover:bg-panel-hover transition-colors text-left">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">添加标题</span>
          </button>
          <button className="w-full py-3 px-4 rounded-xl bg-gray-100 dark:bg-sidebar hover:bg-gray-200 dark:hover:bg-panel-hover transition-colors text-left">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">添加副标题</span>
          </button>
          <button className="w-full py-2.5 px-4 rounded-xl bg-gray-100 dark:bg-sidebar hover:bg-gray-200 dark:hover:bg-panel-hover transition-colors text-left">
            <span className="text-sm text-gray-900 dark:text-white">添加正文</span>
          </button>
        </div>

        {/* Font combinations */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-1">字体组合</h3>
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl bg-gradient-to-br from-honey-100 to-honey-200 dark:from-honey-900/30 dark:to-honey-800/30 flex items-center justify-center cursor-pointer hover:scale-[1.02] transition-transform"
              >
                <span className="text-xs text-gray-500 dark:text-gray-400">Aa</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Default grid content
  return (
    <div className="space-y-4">
      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {['全部', '推荐', '最近', '照片', '图形'].map((cat, i) => (
          <button
            key={cat}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors
              ${i === 0
                ? 'bg-brand text-white'
                : 'bg-gray-100 dark:bg-sidebar text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-panel-hover'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={`
              rounded-xl overflow-hidden cursor-pointer
              hover:ring-2 hover:ring-brand transition-all
              ${i % 3 === 0 ? 'aspect-square' : 'aspect-[4/5]'}
            `}
          >
            <div
              className="w-full h-full"
              style={{
                background: `linear-gradient(${135 + i * 30}deg,
                  hsl(${(i * 40) % 360}, 70%, 75%),
                  hsl(${(i * 40 + 60) % 360}, 70%, 65%))`
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
