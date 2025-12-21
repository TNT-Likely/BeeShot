import {
  ChevronDown,
  Undo2,
  Redo2,
  Clock,
  Download,
  Share2,
  MoreHorizontal,
  Home,
} from 'lucide-react'

interface ToolbarProps {
  projectName: string
  onProjectNameChange: (name: string) => void
  isDark: boolean
  onThemeToggle: () => void
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  onExport: () => void
}

export function Toolbar({
  projectName,
  onProjectNameChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onExport,
}: ToolbarProps) {
  return (
    <header className="flex items-center justify-between h-14 px-4 bg-white dark:bg-sidebar border-b border-gray-200 dark:border-gray-800/50 shrink-0">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Home */}
        <button className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-sidebar-hover transition-colors">
          <Home size={20} strokeWidth={1.5} />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

        {/* Project Name */}
        <div className="flex items-center gap-1">
          <input
            type="text"
            value={projectName}
            onChange={(e) => onProjectNameChange(e.target.value)}
            className="px-2 py-1 text-sm font-medium bg-transparent border-none outline-none text-gray-800 dark:text-white max-w-[200px] hover:bg-gray-100 dark:hover:bg-sidebar-hover rounded-lg transition-colors"
          />
          <button className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <ChevronDown size={16} />
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

        {/* History */}
        <div className="flex items-center">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-sidebar-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="撤销"
          >
            <Undo2 size={18} strokeWidth={1.5} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-sidebar-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="重做"
          >
            <Redo2 size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Time */}
        <button className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs text-gray-400 hover:bg-gray-100 dark:hover:bg-sidebar-hover transition-colors">
          <Clock size={14} />
          <span>刚刚保存</span>
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* More */}
        <button className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-sidebar-hover transition-colors">
          <MoreHorizontal size={20} strokeWidth={1.5} />
        </button>

        {/* Download */}
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-sidebar-hover transition-colors"
        >
          <Download size={18} strokeWidth={1.5} />
          <span>下载</span>
        </button>

        {/* Share Button */}
        <button className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold bg-brand hover:bg-brand-hover text-white transition-colors shadow-lg shadow-brand/25">
          <Share2 size={16} strokeWidth={2} />
          分享
        </button>
      </div>
    </header>
  )
}
