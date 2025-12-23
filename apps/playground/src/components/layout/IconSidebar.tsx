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
  onTabHover: (tab: SidebarTab | null) => void
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

export function IconSidebar({ activeTab, onTabHover }: IconSidebarProps) {
  return (
    <aside className="flex flex-col w-[72px] h-full bg-[#F0F1F5] dark:bg-[#1e1e1e] shrink-0 z-30">
      {/* Logo */}
      <div className="flex items-center justify-center h-12 mt-1">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-sm">
          <span className="text-lg font-bold text-amber-900">B</span>
        </div>
      </div>

      {/* Tabs */}
      <nav className="flex-1 flex flex-col pt-2">
        {tabs.map(({ id, icon: Icon, label }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              onMouseEnter={() => onTabHover(id)}
              className={`
                relative flex flex-col items-center justify-center py-2.5 mx-1.5 rounded-xl
                transition-all duration-150
                ${isActive
                  ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-700 dark:hover:text-white'
                }
              `}
              title={label}
            >
              <Icon size={20} strokeWidth={1.5} />
              <span className="text-[10px] mt-1 font-medium">{label}</span>
            </button>
          )
        })}
      </nav>

      {/* Bottom spacer */}
      <div className="h-3" />
    </aside>
  )
}
