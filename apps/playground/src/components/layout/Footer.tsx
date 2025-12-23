import { useState, useEffect } from 'react'
import { Plus, ChevronLeft, ChevronRight, Grid3X3, HelpCircle, Layers, Maximize, Copy, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { ZoomDropdown } from '@beeshot/components'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@beeshot/ui'
import type { Background } from '@beeshot/core'

interface Page {
  id: string
  name: string
  thumbnail?: string
  background?: Background
  width?: number
  height?: number
}

function getBackgroundStyle(background?: Background): string {
  if (!background) return '#ffffff'

  if (background.type === 'solid') {
    return background.color || '#ffffff'
  }

  if (background.type === 'gradient' && background.gradient) {
    const { gradient } = background
    const angle = gradient.angle || 0
    const stops = gradient.stops.map(s => `${s.color} ${s.offset * 100}%`).join(', ')
    return `linear-gradient(${angle}deg, ${stops})`
  }

  return '#ffffff'
}

interface FooterProps {
  pages: Page[]
  currentPageIndex: number
  onPageSelect: (index: number) => void
  onAddPage: () => void
  onDeletePage?: (index: number) => void
  onDuplicatePage?: (index: number) => void
  onMovePage?: (fromIndex: number, toIndex: number) => void
  zoom: number
  onZoomChange: (zoom: number) => void
  onZoomToFit?: () => void
  onZoomToFill?: () => void
  onToggleLayers?: () => void
  showLayers?: boolean
}

export function Footer({
  pages,
  currentPageIndex,
  onPageSelect,
  onAddPage,
  onDeletePage,
  onDuplicatePage,
  onMovePage,
  zoom,
  onZoomChange,
  onZoomToFit,
  onZoomToFill,
  onToggleLayers,
  showLayers,
}: FooterProps) {
  const [activeContextIndex, setActiveContextIndex] = useState(-1)

  // 键盘快捷键 - 删除当前页面
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && pages.length > 1) {
        const target = e.target as HTMLElement
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
          return
        }
        // 只在有选中元素时才阻止，因为 CanvasContextMenu 也监听这个事件
        // 这里的逻辑由 CanvasContextMenu 统一处理
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [pages.length])

  return (
    <footer className="flex items-center justify-between h-11 px-4 bg-[#F0F1F5] dark:bg-sidebar shrink-0">
      {/* Left - Page Thumbnails */}
      <div className="flex items-center gap-2">
        {/* Add Page */}
        <button
          onClick={onAddPage}
          className="flex items-center justify-center w-6 h-9 rounded bg-white dark:bg-sidebar-hover hover:bg-gray-100 dark:hover:bg-white/20 text-gray-500 dark:text-white transition-colors border border-dashed border-gray-300"
          title="添加页面"
        >
          <Plus size={14} strokeWidth={2} />
        </button>

        {/* Page Thumbnails */}
        <div className="flex items-center gap-2 ml-1">
          {pages.slice(0, 5).map((page, index) => {
            const previewHeight = 36
            const aspectRatio = (page.width || 1290) / (page.height || 2796)
            const previewWidth = Math.round(previewHeight * aspectRatio)

            return (
              <ContextMenu key={page.id} onOpenChange={(open) => open && setActiveContextIndex(index)}>
                <ContextMenuTrigger asChild>
                  <button
                    onClick={() => onPageSelect(index)}
                    className={`
                      relative rounded overflow-hidden transition-all border border-gray-300
                      ${index === currentPageIndex
                        ? 'ring-2 ring-sky-500 ring-offset-1 ring-offset-[#F0F1F5] dark:ring-offset-sidebar'
                        : 'opacity-70 hover:opacity-100'
                      }
                    `}
                    style={{
                      width: previewWidth,
                      height: previewHeight,
                    }}
                  >
                    <div
                      className="w-full h-full"
                      style={{
                        background: page.thumbnail
                          ? `url(${page.thumbnail}) center/cover`
                          : getBackgroundStyle(page.background)
                      }}
                    />
                    <span className="absolute bottom-0 left-0 right-0 text-[8px] text-gray-600 bg-white/80 text-center leading-tight">
                      {index + 1}
                    </span>
                  </button>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-48">
                  <ContextMenuItem onClick={() => onDuplicatePage?.(activeContextIndex)}>
                    <Copy className="mr-2 h-4 w-4" />
                    复制页面
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={() => activeContextIndex > 0 && onMovePage?.(activeContextIndex, activeContextIndex - 1)}
                    disabled={activeContextIndex === 0}
                  >
                    <ArrowUp className="mr-2 h-4 w-4" />
                    上移
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={() => activeContextIndex < pages.length - 1 && onMovePage?.(activeContextIndex, activeContextIndex + 1)}
                    disabled={activeContextIndex === pages.length - 1}
                  >
                    <ArrowDown className="mr-2 h-4 w-4" />
                    下移
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem
                    onClick={() => pages.length > 1 && onDeletePage?.(activeContextIndex)}
                    disabled={pages.length <= 1}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    删除页面
                    <ContextMenuShortcut>⌫</ContextMenuShortcut>
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            )
          })}
          {pages.length > 5 && (
            <span className="text-xs text-gray-400 ml-1">+{pages.length - 5}</span>
          )}
        </div>
      </div>

      {/* Center - Page Navigation */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => currentPageIndex > 0 && onPageSelect(currentPageIndex - 1)}
          disabled={currentPageIndex === 0}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-sidebar-hover transition-colors disabled:opacity-30"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-xs text-gray-500 dark:text-gray-300 min-w-[50px] text-center tabular-nums">
          {currentPageIndex + 1} / {pages.length}
        </span>
        <button
          onClick={() => currentPageIndex < pages.length - 1 && onPageSelect(currentPageIndex + 1)}
          disabled={currentPageIndex === pages.length - 1}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-sidebar-hover transition-colors disabled:opacity-30"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Right - Zoom Controls */}
      <div className="flex items-center gap-1">
        {/* Layers */}
        <button
          onClick={onToggleLayers}
          className={`p-1.5 rounded-lg transition-colors ${
            showLayers
              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-sidebar-hover'
          }`}
          title="图层面板"
        >
          <Layers size={16} />
        </button>

        {/* Help */}
        <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-sidebar-hover transition-colors">
          <HelpCircle size={16} />
        </button>

        {/* Grid View */}
        <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-sidebar-hover transition-colors">
          <Grid3X3 size={16} />
        </button>

        {/* Fullscreen */}
        <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-sidebar-hover transition-colors">
          <Maximize size={16} />
        </button>

        {/* Zoom Dropdown from @beeshot/components */}
        <div className="ml-2">
          <ZoomDropdown
            zoom={zoom}
            onZoomChange={onZoomChange}
            onZoomToFit={onZoomToFit}
            onZoomToFill={onZoomToFill}
          />
        </div>
      </div>
    </footer>
  )
}
