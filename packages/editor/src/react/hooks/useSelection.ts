import { useState, useEffect } from 'react'
import { useEditorContext } from '../context/EditorContext'

/**
 * 获取当前选中的元素 ID
 */
export function useSelection(): string[] {
  const editor = useEditorContext()
  const [selection, setSelection] = useState<string[]>([])

  useEffect(() => {
    if (!editor) return

    const unsubscribe = editor.renderer.on('selection:changed', (ids) => {
      setSelection(ids)
    })

    return unsubscribe
  }, [editor])

  return selection
}
