import { Layers, Eye, EyeOff, Lock, Unlock, Trash2, Type, Image, Square, X } from 'lucide-react'
import { useSelection, useEditorContext } from '@beeshot/editor'
import type { Element } from '@beeshot/core'
import { useState, useEffect } from 'react'

interface LayerPanelProps {
  isOpen: boolean
  onClose?: () => void
}

export function LayerPanel({ isOpen, onClose }: LayerPanelProps) {
  const editor = useEditorContext()
  const selection = useSelection()
  const [elements, setElements] = useState<Element[]>([])

  useEffect(() => {
    if (!editor) return

    const updateElements = () => {
      const allElements = editor.renderer.getAllElements()
      setElements([...allElements].reverse())
    }

    updateElements()

    const unsub1 = editor.renderer.on('element:added', updateElements)
    const unsub2 = editor.renderer.on('element:removed', updateElements)
    const unsub3 = editor.renderer.on('element:modified', updateElements)

    return () => {
      unsub1()
      unsub2()
      unsub3()
    }
  }, [editor])

  if (!isOpen) return null

  const handleSelect = (id: string) => {
    editor?.renderer.select([id])
  }

  const handleToggleVisibility = (element: Element) => {
    editor?.updateElement(element.id, { visible: !element.visible })
  }

  const handleToggleLock = (element: Element) => {
    editor?.updateElement(element.id, { locked: !element.locked })
  }

  const handleDelete = (id: string) => {
    editor?.removeElement(id)
  }

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <Type className="w-4 h-4" />
      case 'image':
        return <Image className="w-4 h-4" />
      case 'shape':
        return <Square className="w-4 h-4" />
      default:
        return <Layers className="w-4 h-4" />
    }
  }

  const getElementName = (element: Element) => {
    if (element.type === 'text') {
      const textEl = element as any
      return textEl.content?.slice(0, 12) || '文本'
    }
    if (element.type === 'image') {
      return '图片'
    }
    if (element.type === 'shape') {
      const shapeEl = element as any
      const shapeNames: Record<string, string> = {
        rect: '矩形',
        circle: '圆形',
        triangle: '三角形',
        line: '线条',
      }
      return shapeNames[shapeEl.shapeType] || '形状'
    }
    return element.type
  }

  return (
    <div className="absolute right-4 bottom-16 w-72 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 z-20 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            <Layers className="w-4 h-4 text-zinc-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">图层</h3>
            <p className="text-xs text-zinc-400">{elements.length} 个元素</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Layer List */}
      <div className="max-h-64 overflow-y-auto">
        {elements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-2">
              <Layers className="w-5 h-5 text-zinc-300 dark:text-zinc-600" />
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">暂无图层</p>
          </div>
        ) : (
          <div className="p-3 space-y-1.5">
            {elements.map((element) => {
              const isSelected = selection.includes(element.id)
              const isHidden = !element.visible
              const isLocked = element.locked

              return (
                <div
                  key={element.id}
                  onClick={() => handleSelect(element.id)}
                  className={`
                    group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all
                    ${isSelected
                      ? 'bg-sky-50 dark:bg-sky-900/20 ring-1 ring-sky-200 dark:ring-sky-800'
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                    }
                    ${isHidden ? 'opacity-50' : ''}
                  `}
                >
                  {/* Icon */}
                  <div className={`
                    relative w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors
                    ${isSelected
                      ? 'bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                    }
                  `}>
                    {getElementIcon(element.type)}
                    {isLocked && (
                      <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-amber-500 flex items-center justify-center">
                        <Lock className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className={`
                      text-sm font-medium truncate
                      ${isSelected
                        ? 'text-sky-700 dark:text-sky-300'
                        : isHidden
                          ? 'text-zinc-400 line-through'
                          : 'text-zinc-700 dark:text-zinc-200'
                      }
                    `}>
                      {getElementName(element)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className={`
                    flex items-center gap-1 transition-opacity
                    ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                  `}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleToggleVisibility(element)
                      }}
                      className={`
                        p-1.5 rounded-lg transition-colors
                        ${isHidden
                          ? 'text-zinc-400 bg-zinc-100 dark:bg-zinc-800'
                          : 'text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:text-zinc-300 dark:hover:bg-zinc-800'
                        }
                      `}
                      title={element.visible ? '隐藏' : '显示'}
                    >
                      {element.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleToggleLock(element)
                      }}
                      className={`
                        p-1.5 rounded-lg transition-colors
                        ${isLocked
                          ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20'
                          : 'text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:text-zinc-300 dark:hover:bg-zinc-800'
                        }
                      `}
                      title={element.locked ? '解锁' : '锁定'}
                    >
                      {element.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(element.id)
                      }}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
