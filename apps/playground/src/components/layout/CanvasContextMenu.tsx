import { useState, useEffect, useCallback } from 'react'
import {
  Copy,
  Trash2,
  Clipboard,
  ArrowUpToLine,
  ArrowDownToLine,
  MoveUp,
  MoveDown,
} from 'lucide-react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@beeshot/ui'
import { useEditorContext } from '@beeshot/editor'

interface CanvasContextMenuProps {
  children: React.ReactNode
}

export function CanvasContextMenu({ children }: CanvasContextMenuProps) {
  const editor = useEditorContext()
  const [hasSelection, setHasSelection] = useState(false)
  const [clipboard, setClipboard] = useState<unknown>(null)

  // 监听选择变化
  useEffect(() => {
    if (!editor) return

    const handleSelectionChange = () => {
      const selection = editor.getSelection()
      setHasSelection(selection.length > 0)
    }

    const unsub1 = editor.renderer.on('selection:changed', handleSelectionChange)
    const unsub2 = editor.renderer.on('selection:cleared', () => setHasSelection(false))

    return () => {
      unsub1()
      unsub2()
    }
  }, [editor])

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return
      }

      if (!editor) return

      // Delete 删除选中元素
      if ((e.key === 'Delete' || e.key === 'Backspace') && hasSelection) {
        e.preventDefault()
        handleDelete()
      }

      // Cmd/Ctrl + C 复制
      if ((e.metaKey || e.ctrlKey) && e.key === 'c' && hasSelection) {
        e.preventDefault()
        handleCopy()
      }

      // Cmd/Ctrl + V 粘贴
      if ((e.metaKey || e.ctrlKey) && e.key === 'v' && clipboard) {
        e.preventDefault()
        handlePaste()
      }

      // Cmd/Ctrl + D 复制
      if ((e.metaKey || e.ctrlKey) && e.key === 'd' && hasSelection) {
        e.preventDefault()
        handleDuplicate()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [editor, hasSelection, clipboard])

  // 菜单操作
  const handleDelete = useCallback(() => {
    if (!editor) return
    const selection = editor.getSelection()
    selection.forEach(el => editor.removeElement(el.id))
  }, [editor])

  const handleCopy = useCallback(() => {
    if (!editor) return
    const selection = editor.getSelection()
    if (selection.length > 0) {
      setClipboard(JSON.parse(JSON.stringify(selection)))
    }
  }, [editor])

  const handlePaste = useCallback(() => {
    if (!editor || !clipboard) return
    const elements = clipboard as Array<{ id: string; x: number; y: number; [key: string]: unknown }>
    elements.forEach(el => {
      const newEl = {
        ...el,
        id: `${el.id.split('_')[0]}_${Date.now()}`,
        x: el.x + 20,
        y: el.y + 20,
      }
      editor.addElement(newEl as Parameters<typeof editor.addElement>[0])
    })
  }, [editor, clipboard])

  const handleDuplicate = useCallback(() => {
    if (!editor) return
    const selection = editor.getSelection()
    selection.forEach(el => {
      const newEl = {
        ...el,
        id: `${el.type}_${Date.now()}`,
        x: el.x + 20,
        y: el.y + 20,
      }
      editor.addElement(newEl as Parameters<typeof editor.addElement>[0])
    })
  }, [editor])

  const handleBringToFront = useCallback(() => {
    if (!editor) return
    const selection = editor.getSelection()
    selection.forEach(el => editor.bringToFront(el.id))
  }, [editor])

  const handleSendToBack = useCallback(() => {
    if (!editor) return
    const selection = editor.getSelection()
    selection.forEach(el => editor.sendToBack(el.id))
  }, [editor])

  const handleBringForward = useCallback(() => {
    if (!editor) return
    const selection = editor.getSelection()
    selection.forEach(el => editor.bringForward(el.id))
  }, [editor])

  const handleSendBackward = useCallback(() => {
    if (!editor) return
    const selection = editor.getSelection()
    selection.forEach(el => editor.sendBackward(el.id))
  }, [editor])

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        {hasSelection ? (
          <>
            <ContextMenuItem onClick={handleCopy}>
              <Copy className="mr-2 h-4 w-4" />
              复制
              <ContextMenuShortcut>⌘C</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem onClick={handleDuplicate}>
              <Copy className="mr-2 h-4 w-4" />
              创建副本
              <ContextMenuShortcut>⌘D</ContextMenuShortcut>
            </ContextMenuItem>

            <ContextMenuSeparator />

            <ContextMenuItem onClick={handleBringToFront}>
              <ArrowUpToLine className="mr-2 h-4 w-4" />
              移至顶层
            </ContextMenuItem>
            <ContextMenuItem onClick={handleBringForward}>
              <MoveUp className="mr-2 h-4 w-4" />
              上移一层
            </ContextMenuItem>
            <ContextMenuItem onClick={handleSendBackward}>
              <MoveDown className="mr-2 h-4 w-4" />
              下移一层
            </ContextMenuItem>
            <ContextMenuItem onClick={handleSendToBack}>
              <ArrowDownToLine className="mr-2 h-4 w-4" />
              移至底层
            </ContextMenuItem>

            <ContextMenuSeparator />

            <ContextMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              删除
              <ContextMenuShortcut>⌫</ContextMenuShortcut>
            </ContextMenuItem>
          </>
        ) : (
          <>
            <ContextMenuItem onClick={handlePaste} disabled={!clipboard}>
              <Clipboard className="mr-2 h-4 w-4" />
              粘贴
              <ContextMenuShortcut>⌘V</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              选择元素以查看更多选项
            </div>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}
