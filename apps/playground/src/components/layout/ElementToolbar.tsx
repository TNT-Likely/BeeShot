import {
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Lock,
  Unlock,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  RotateCw,
  Sparkles,
  MoreHorizontal,
} from 'lucide-react'
import { useSelection, useEditorContext } from '@beeshot/editor'
import type { Element, TextElement } from '@beeshot/core'
import { useState, useEffect, useCallback } from 'react'

export function ElementToolbar() {
  const selection = useSelection()
  const editor = useEditorContext()
  const [element, setElement] = useState<Element | null>(null)
  const [bounds, setBounds] = useState<{ left: number; top: number; width: number; height: number } | null>(null)
  const [updateKey, setUpdateKey] = useState(0)

  // 更新元素边界位置
  const updateBounds = useCallback(() => {
    if (!editor || selection.length !== 1) {
      setBounds(null)
      return
    }
    const newBounds = editor.renderer.getElementBounds(selection[0])
    setBounds(newBounds)
  }, [editor, selection])

  useEffect(() => {
    if (selection.length === 1 && editor) {
      const el = editor.renderer.getElement(selection[0])
      setElement(el ? { ...el } : null)
      updateBounds()
    } else {
      setElement(null)
      setBounds(null)
    }
  }, [selection, editor, updateKey, updateBounds])

  useEffect(() => {
    if (!editor) return

    const handleModified = () => {
      setUpdateKey(k => k + 1)
      updateBounds()
    }

    const handleZoom = () => {
      updateBounds()
    }

    const unsub1 = editor.renderer.on('element:modified', handleModified)
    const unsub2 = editor.renderer.on('zoom:changed', handleZoom)

    return () => {
      unsub1()
      unsub2()
    }
  }, [editor, updateBounds])

  if (!element || !editor || !bounds) return null

  const currentElement = editor.renderer.getElement(element.id)
  if (!currentElement) return null

  const handleDelete = () => {
    editor.removeElement(currentElement.id)
  }

  const handleDuplicate = () => {
    editor.clipboard.duplicate()
  }

  const handleBringForward = () => {
    editor.renderer.bringForward(currentElement.id)
  }

  const handleSendBackward = () => {
    editor.renderer.sendBackward(currentElement.id)
  }

  const handleToggleLock = () => {
    editor.updateElement(currentElement.id, { locked: !currentElement.locked })
  }

  const isLocked = currentElement.locked

  // 计算工具栏位置 - 在元素上方
  const toolbarStyle = {
    position: 'absolute' as const,
    left: bounds.left + bounds.width / 2,
    top: bounds.top - 50,
    transform: 'translateX(-50%)',
    zIndex: 100,
  }

  // 获取元素显示名称
  const getElementName = () => {
    switch (currentElement.type) {
      case 'text':
        const text = (currentElement as TextElement).content
        return text.length > 10 ? text.slice(0, 10) + '...' : text
      case 'image':
        return '图片'
      case 'shape':
        return '形状'
      default:
        return '元素'
    }
  }

  // 锁定状态
  if (isLocked) {
    return (
      <div style={toolbarStyle}>
        <div className="flex items-center gap-2 px-3 py-2 bg-amber-500 text-white rounded-full shadow-lg">
          <Lock className="w-4 h-4" />
          <span className="text-sm font-medium">已锁定</span>
          <div className="w-px h-4 bg-white/30" />
          <button
            onClick={handleToggleLock}
            className="flex items-center gap-1 px-2 py-1 bg-white/20 hover:bg-white/30 rounded-full text-xs font-medium transition-colors"
          >
            <Unlock className="w-3 h-3" />
            解锁
          </button>
        </div>
      </div>
    )
  }

  // 正常工具栏
  return (
    <div style={toolbarStyle}>
      <div className="flex items-center gap-1 px-2 py-1.5 bg-white rounded-full shadow-lg border border-gray-200">
        {/* 元素名称 */}
        <span className="px-2 text-sm text-gray-700 font-medium max-w-[120px] truncate">
          {getElementName()}
        </span>

        <Divider />

        {/* AI 助手 */}
        <ToolbarButton
          icon={Sparkles}
          tooltip="AI 助手"
          onClick={() => {}}
          className="text-purple-500 hover:bg-purple-50"
        />

        {/* 刷新/重新生成 */}
        <ToolbarButton
          icon={RotateCw}
          tooltip="重新生成"
          onClick={() => {}}
        />

        {/* Text controls */}
        {currentElement.type === 'text' && (
          <>
            <Divider />
            <TextControls element={currentElement as TextElement} editor={editor} />
          </>
        )}

        <Divider />

        {/* 复制 */}
        <ToolbarButton
          icon={Copy}
          tooltip="复制"
          onClick={handleDuplicate}
        />

        {/* 图层控制 */}
        <ToolbarButton
          icon={ChevronUp}
          tooltip="上移一层"
          onClick={handleBringForward}
        />
        <ToolbarButton
          icon={ChevronDown}
          tooltip="下移一层"
          onClick={handleSendBackward}
        />

        {/* 删除 */}
        <ToolbarButton
          icon={Trash2}
          tooltip="删除"
          onClick={handleDelete}
          danger
        />

        {/* 更多 */}
        <ToolbarButton
          icon={MoreHorizontal}
          tooltip="更多"
          onClick={() => {}}
        />
      </div>
    </div>
  )
}

function TextControls({ element, editor }: { element: TextElement; editor: any }) {
  const updateAlign = (align: 'left' | 'center' | 'right') => {
    editor.updateElement(element.id, { align })
  }

  return (
    <>
      {/* Color picker */}
      <div className="relative">
        <div className="p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
          <div className="relative">
            <Palette className="w-4 h-4 text-gray-600" />
            <div
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white"
              style={{ backgroundColor: element.color }}
            />
          </div>
        </div>
        <input
          type="color"
          value={element.color}
          onChange={(e) => editor.updateElement(element.id, { color: e.target.value })}
          className="absolute inset-0 opacity-0 cursor-pointer"
          title="文字颜色"
        />
      </div>

      {/* Alignment */}
      <div className="flex items-center bg-gray-100 rounded-full p-0.5">
        <AlignButton
          icon={AlignLeft}
          active={element.align === 'left'}
          onClick={() => updateAlign('left')}
          tooltip="左对齐"
        />
        <AlignButton
          icon={AlignCenter}
          active={element.align === 'center'}
          onClick={() => updateAlign('center')}
          tooltip="居中"
        />
        <AlignButton
          icon={AlignRight}
          active={element.align === 'right'}
          onClick={() => updateAlign('right')}
          tooltip="右对齐"
        />
      </div>
    </>
  )
}

function AlignButton({
  icon: Icon,
  active,
  onClick,
  tooltip,
}: {
  icon: any
  active: boolean
  onClick: () => void
  tooltip: string
}) {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      className={`p-1.5 rounded-full transition-all ${
        active
          ? 'bg-white text-gray-900 shadow-sm'
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  )
}

function ToolbarButton({
  icon: Icon,
  tooltip,
  onClick,
  active,
  danger,
  className = '',
}: {
  icon: any
  tooltip: string
  onClick: () => void
  active?: boolean
  danger?: boolean
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      className={`p-1.5 rounded-full transition-all ${
        active
          ? 'bg-purple-500 text-white'
          : danger
            ? 'text-gray-500 hover:bg-red-50 hover:text-red-500'
            : `text-gray-500 hover:bg-gray-100 hover:text-gray-700 ${className}`
      }`}
    >
      <Icon className="w-4 h-4" />
    </button>
  )
}

function Divider() {
  return <div className="w-px h-5 bg-gray-200 mx-0.5" />
}
