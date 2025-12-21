import {
  LayoutTemplate,
  Shapes,
  Type,
  Upload,
  Image,
  Sparkles,
  Folder,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type SidebarTab = 'design' | 'elements' | 'text' | 'brand' | 'uploads' | 'photos' | 'projects'

interface IconSidebarProps {
  activeTab: SidebarTab | null
  onTabChange: (tab: SidebarTab | null) => void
}

const tabs: { id: SidebarTab; icon: LucideIcon; label: string }[] = [
  { id: 'design', icon: LayoutTemplate, label: '设计' },
  { id: 'elements', icon: Shapes, label: '元素' },
  { id: 'text', icon: Type, label: '文本' },
  { id: 'brand', icon: Sparkles, label: '品牌' },
  { id: 'uploads', icon: Upload, label: '上传' },
  { id: 'photos', icon: Image, label: '照片' },
  { id: 'projects', icon: Folder, label: '项目' },
]

export function IconSidebar({ activeTab, onTabChange }: IconSidebarProps) {
  return (
    <aside className="flex flex-col w-[72px] h-full bg-gray-50 dark:bg-sidebar border-r border-gray-200 dark:border-transparent shrink-0">
      {/* Logo */}
      <div className="flex items-center justify-center h-14">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-honey-400 to-honey-500 flex items-center justify-center shadow-lg shadow-honey-500/25">
          <span className="text-lg font-bold text-white">B</span>
        </div>
      </div>

      {/* Tabs */}
      <nav className="flex-1 flex flex-col pt-1">
        {tabs.map(({ id, icon: Icon, label }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              onClick={() => onTabChange(isActive ? null : id)}
              className={`
                relative flex flex-col items-center justify-center py-3 mx-1.5 rounded-xl
                transition-all duration-150
                ${isActive
                  ? 'bg-brand text-white shadow-lg shadow-brand/25'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-sidebar-hover hover:text-gray-700 dark:hover:text-white'
                }
              `}
              title={label}
            >
              <Icon size={20} strokeWidth={1.5} />
              <span className="text-[11px] mt-1.5 font-medium">{label}</span>
            </button>
          )
        })}
      </nav>

      {/* Bottom spacer */}
      <div className="h-4" />
    </aside>
  )
}
