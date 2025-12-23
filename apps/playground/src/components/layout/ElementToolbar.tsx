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
} from 'lucide-react'
import { useSelection, useEditorContext } from '@beeshot/editor'
import type { Element, TextElement } from '@beeshot/core'
import { useState, useEffect } from 'react'

export function ElementToolbar() {
  const selection = useSelection()
  const editor = useEditorContext()
  const [element, setElement] = useState<Element | null>(null)
  const [updateKey, setUpdateKey] = useState(0)

  useEffect(() => {
    if (selection.length === 1 && editor) {
      const el = editor.renderer.getElement(selection[0])
      setElement(el ? { ...el } : null)
    } else {
      setElement(null)
    }
  }, [selection, editor, updateKey])

  useEffect(() => {
    if (!editor) return

    const handleModified = () => {
      setUpdateKey(k => k + 1)
    }

    const unsubscribe = editor.renderer.on('element:modified', handleModified)
    return unsubscribe
  }, [editor])

  if (!element || !editor) return null

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

  // 锁定状态
  if (isLocked) {
    return (
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
        <div className="flex items-center gap-3 px-4 py-2.5 bg-amber-500 text-white rounded-xl shadow-lg">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">已锁定</span>
          </div>
          <div className="w-px h-5 bg-white/30" />
          <button
            onClick={handleToggleLock}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
          >
            <Unlock className="w-4 h-4" />
            解锁
          </button>
        </div>
      </div>
    )
  }

  // 正常工具栏
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
      <div className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800">
        {/* Text controls */}
        {currentElement.type === 'text' && (
          <>
            <TextControls element={currentElement as TextElement} editor={editor} />
            <Divider />
          </>
        )}

        {/* Layer controls */}
        <div className="flex items-center">
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
        </div>

        <Divider />

        {/* Actions */}
        <div className="flex items-center">
          <ToolbarButton
            icon={Lock}
            tooltip="锁定"
            onClick={handleToggleLock}
          />
          <ToolbarButton
            icon={Copy}
            tooltip="复制"
            onClick={handleDuplicate}
          />
          <ToolbarButton
            icon={Trash2}
            tooltip="删除"
            onClick={handleDelete}
            danger
          />
        </div>
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
        <div className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
          <div className="relative">
            <Palette className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
            <div
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-900"
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

      <Divider />

      {/* Alignment */}
      <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
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
      className={`p-2 rounded-lg transition-all ${
        active
          ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
          : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
      }`}
    >
      <Icon className="w-4 h-4" />
    </button>
  )
}

function ToolbarButton({
  icon: Icon,
  tooltip,
  onClick,
  active,
  danger,
}: {
  icon: any
  tooltip: string
  onClick: () => void
  active?: boolean
  danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      className={`p-2 rounded-lg transition-all ${
        active
          ? 'bg-sky-500 text-white shadow-sm'
          : danger
            ? 'text-zinc-500 dark:text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400'
            : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200'
      }`}
    >
      <Icon className="w-5 h-5" />
    </button>
  )
}

function Divider() {
  return <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-700 mx-1" />
}
