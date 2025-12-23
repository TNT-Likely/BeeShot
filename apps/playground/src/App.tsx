import { useEffect, useRef, useState } from 'react'
import { FabricRenderer } from '@beeshot/renderer'
import { Editor, EditorProvider } from '@beeshot/editor'
import type { Document } from '@beeshot/core'
import { generateId } from '@beeshot/core'
import {
  IconSidebar,
  SidePanel,
  Toolbar,
  Footer,
  Canvas,
  PropertyPanel,
  LayerPanel,
  ElementToolbar,
  type SidebarTab,
} from './components/layout'
import { useTheme } from './hooks'
import { getTemplateById, getDeviceById } from './config'

// 示例文档 - 默认白色背景
const createDefaultDocument = (): Document => ({
  id: generateId('doc'),
  version: '1.0.0',
  name: '未命名项目',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  pages: [
    {
      id: generateId('page'),
      name: '第 1 页',
      width: 1290,
      height: 2796,
      background: {
        type: 'solid',
        color: '#ffffff',
      },
      elements: [],
    },
  ],
  assets: [],
})

function App() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [editor, setEditor] = useState<Editor | null>(null)
  const [document, setDocument] = useState<Document>(() => createDefaultDocument())
  const [activeTab, setActiveTab] = useState<SidebarTab | null>('design')
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [zoom, setZoom] = useState(50)
  const [projectName, setProjectName] = useState('未命名项目')
  const [showLayerPanel, setShowLayerPanel] = useState(false)
  const [sidebarHovered, setSidebarHovered] = useState(false)
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({})
  const { isDark, toggle: toggleTheme } = useTheme()

  // 初始化编辑器
  useEffect(() => {
    if (!canvasRef.current) return

    const renderer = new FabricRenderer()
    renderer.mount(canvasRef.current)
    renderer.loadDocument(document)

    const editorInstance = new Editor({ renderer })
    setEditor(editorInstance)

    // 监听缩放变化
    const unsubZoom = renderer.on('zoom:changed', (newZoom) => {
      setZoom(Math.round(newZoom * 100))
    })

    // 监听内容变化，更新缩略图
    const unsubAdded = renderer.on('element:added', () => {
      setTimeout(() => {
        const page = renderer.getActivePage()
        if (page) {
          const thumb = renderer.getThumbnail(150)
          if (thumb) setThumbnails(prev => ({ ...prev, [page.id]: thumb }))
        }
      }, 100)
    })

    const unsubModified = renderer.on('element:modified', () => {
      setTimeout(() => {
        const page = renderer.getActivePage()
        if (page) {
          const thumb = renderer.getThumbnail(150)
          if (thumb) setThumbnails(prev => ({ ...prev, [page.id]: thumb }))
        }
      }, 100)
    })

    const unsubRemoved = renderer.on('element:removed', () => {
      setTimeout(() => {
        const page = renderer.getActivePage()
        if (page) {
          const thumb = renderer.getThumbnail(150)
          if (thumb) setThumbnails(prev => ({ ...prev, [page.id]: thumb }))
        }
      }, 100)
    })

    // 初始缩放以适应容器，并生成初始缩略图
    setTimeout(() => {
      renderer.zoomToFit()
      const page = renderer.getActivePage()
      if (page) {
        const thumb = renderer.getThumbnail(150)
        if (thumb) setThumbnails(prev => ({ ...prev, [page.id]: thumb }))
      }
    }, 100)

    return () => {
      unsubZoom()
      unsubAdded()
      unsubModified()
      unsubRemoved()
      editorInstance.destroy()
    }
  }, [])

  // 切换页面
  const handlePageSelect = (index: number) => {
    if (!editor || index < 0 || index >= document.pages.length) return

    const page = document.pages[index]
    setCurrentPageIndex(index)

    // 确保 document 同步后再切换
    const rendererDoc = editor.renderer.getDocument()
    if (!rendererDoc || rendererDoc.pages.length !== document.pages.length) {
      editor.renderer.loadDocument(document)
    }

    editor.renderer.setActivePage(page.id)

    // 切换后适应屏幕
    setTimeout(() => {
      editor.renderer.zoomToFit()
    }, 50)
  }

  // 处理缩放
  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom)
    editor?.renderer.setZoom(newZoom / 100)
  }

  // 适合屏幕
  const handleZoomToFit = () => {
    editor?.renderer.zoomToFit()
  }

  // 填满屏幕
  const handleZoomToFill = () => {
    editor?.renderer.zoomToFill()
  }

  // 添加页面
  const handleAddPage = () => {
    if (!editor) return

    const currentPage = document.pages[currentPageIndex]
    const newPage = {
      id: generateId('page'),
      name: `第 ${document.pages.length + 1} 页`,
      width: currentPage?.width || 1290,
      height: currentPage?.height || 2796,
      background: { type: 'solid' as const, color: '#ffffff' },
      elements: [],
    }

    const newDoc = {
      ...document,
      pages: [...document.pages, newPage],
    }

    setDocument(newDoc)

    // 同步到 renderer 并切换到新页面
    editor.renderer.loadDocument(newDoc)
    editor.renderer.setActivePage(newPage.id)
    setCurrentPageIndex(newDoc.pages.length - 1)

    setTimeout(() => {
      editor.renderer.zoomToFit()
    }, 50)
  }

  // 选择模板
  const handleTemplateSelect = (templateId: string) => {
    const template = getTemplateById(templateId)
    if (!template) return

    const newDoc = template.createDocument()
    setDocument(newDoc)
    setProjectName(newDoc.name)

    // 重新加载文档到渲染器
    if (editor) {
      editor.renderer.loadDocument(newDoc)
      setTimeout(() => {
        editor.renderer.zoomToFit()
      }, 100)
    }
  }

  // 选择设备尺寸
  const handleDeviceSelect = (deviceId: string) => {
    const device = getDeviceById(deviceId)
    if (!device || !editor) return

    // 更新当前页面尺寸
    const updatedPages = document.pages.map((page, index) => {
      if (index === currentPageIndex) {
        return { ...page, width: device.width, height: device.height }
      }
      return page
    })

    const newDoc = { ...document, pages: updatedPages }
    setDocument(newDoc)

    // 重新加载文档
    editor.renderer.loadDocument(newDoc)
    setTimeout(() => {
      editor.renderer.zoomToFit()
    }, 100)
  }

  // 切换图层面板
  const handleToggleLayerPanel = () => {
    setShowLayerPanel(!showLayerPanel)
  }

  // 导出
  const handleExport = async () => {
    if (!editor) return
    try {
      const blob = await editor.exportToPNG(2)
      const url = URL.createObjectURL(blob)
      const a = globalThis.document.createElement('a')
      a.href = url
      a.download = `${projectName}.png`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error('Export failed:', e)
    }
  }

  return (
    <EditorProvider editor={editor}>
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Toolbar */}
        <Toolbar
          projectName={projectName}
          onProjectNameChange={setProjectName}
          isDark={isDark}
          onThemeToggle={toggleTheme}
          canUndo={editor?.history.canUndo() ?? false}
          canRedo={editor?.history.canRedo() ?? false}
          onUndo={() => editor?.undo()}
          onRedo={() => editor?.redo()}
          onExport={handleExport}
        />

        {/* Main Content */}
        <div
          className="flex flex-1 overflow-hidden relative"
          onMouseLeave={() => {
            setActiveTab(null)
            setSidebarHovered(false)
          }}
        >
          {/* Icon Sidebar */}
          <IconSidebar
            activeTab={activeTab}
            onTabHover={(tab) => {
              setActiveTab(tab)
              setSidebarHovered(true)
            }}
          />

          {/* Side Panel - floating overlay */}
          <SidePanel
            activeTab={activeTab}
            isHovered={sidebarHovered}
            onTemplateSelect={handleTemplateSelect}
            onDeviceSelect={handleDeviceSelect}
          />

          {/* Canvas Workspace */}
          <div className="flex-1 min-w-0 min-h-0 relative overflow-hidden">
            {/* Canvas */}
            <Canvas ref={canvasRef} />

            {/* Floating Element Toolbar (appears when element selected) */}
            <ElementToolbar />

            {/* Floating Property Panel (inside canvas area) */}
            <PropertyPanel />

            {/* Layer Panel (Floating) */}
            <LayerPanel isOpen={showLayerPanel} />
          </div>
        </div>

        {/* Footer */}
        <Footer
          pages={document.pages.map((p) => ({
            id: p.id,
            name: p.name,
            background: p.background,
            width: p.width,
            height: p.height,
            thumbnail: thumbnails[p.id],
          }))}
          currentPageIndex={currentPageIndex}
          onPageSelect={handlePageSelect}
          onAddPage={handleAddPage}
          zoom={zoom}
          onZoomChange={handleZoomChange}
          onZoomToFit={handleZoomToFit}
          onZoomToFill={handleZoomToFill}
          onToggleLayers={handleToggleLayerPanel}
          showLayers={showLayerPanel}
        />
      </div>
    </EditorProvider>
  )
}

export default App
