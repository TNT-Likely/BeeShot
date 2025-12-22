import { Plus, ChevronLeft, ChevronRight, Minus, Grid3X3, HelpCircle, Layers } from 'lucide-react'

interface Page {
  id: string
  name: string
  thumbnail?: string
}

interface FooterProps {
  pages: Page[]
  currentPageIndex: number
  onPageSelect: (index: number) => void
  onAddPage: () => void
  zoom: number
  onZoomChange: (zoom: number) => void
  onToggleLayers?: () => void
  showLayers?: boolean
}

export function Footer({
  pages,
  currentPageIndex,
  onPageSelect,
  onAddPage,
  zoom,
  onZoomChange,
  onToggleLayers,
  showLayers,
}: FooterProps) {
  return (
    <footer className="flex items-center justify-between h-11 px-4 bg-white dark:bg-sidebar border-t border-gray-200 dark:border-gray-800/50 shrink-0">
      {/* Left - Page Thumbnails */}
      <div className="flex items-center gap-2">
        {/* Add Page */}
        <button
          onClick={onAddPage}
          className="flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 dark:bg-sidebar-hover hover:bg-gray-200 dark:hover:bg-white/20 text-gray-600 dark:text-white transition-colors"
          title="添加页面"
        >
          <Plus size={16} strokeWidth={2} />
        </button>

        {/* Page Thumbnails */}
        <div className="flex items-center gap-1.5 ml-1">
          {pages.slice(0, 5).map((page, index) => (
            <button
              key={page.id}
              onClick={() => onPageSelect(index)}
              className={`
                relative w-7 h-7 rounded-lg overflow-hidden transition-all
                ${index === currentPageIndex
                  ? 'ring-2 ring-sky-500 ring-offset-1 ring-offset-white dark:ring-offset-sidebar'
                  : 'opacity-60 hover:opacity-100'
                }
              `}
            >
              <div
                className="w-full h-full"
                style={{
                  background: page.thumbnail
                    ? `url(${page.thumbnail}) center/cover`
                    : 'linear-gradient(135deg, #667eea, #764ba2)'
                }}
              />
              <span className="absolute bottom-0 left-0 right-0 text-[9px] text-white bg-black/50 text-center py-0.5">
                {index + 1}
              </span>
            </button>
          ))}
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

        {/* Zoom Controls */}
        <div className="flex items-center ml-2 bg-gray-100 dark:bg-sidebar-hover rounded-lg px-1">
          <button
            onClick={() => onZoomChange(Math.max(10, zoom - 10))}
            className="p-1.5 rounded text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition-colors"
          >
            <Minus size={14} />
          </button>

          <button
            className="px-2 py-1 min-w-[48px] text-xs text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 rounded transition-colors tabular-nums"
            onClick={() => onZoomChange(100)}
          >
            {zoom}%
          </button>

          <button
            onClick={() => onZoomChange(Math.min(400, zoom + 10))}
            className="p-1.5 rounded text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    </footer>
  )
}
