import { useState, useCallback } from 'react'
import { useEditorContext } from '../context/EditorContext'

/**
 * 历史记录 Hook
 */
export function useHistory() {
  const editor = useEditorContext()
  const [, forceUpdate] = useState({})

  const undo = useCallback(() => {
    editor?.undo()
    forceUpdate({})
  }, [editor])

  const redo = useCallback(() => {
    editor?.redo()
    forceUpdate({})
  }, [editor])

  return {
    undo,
    redo,
    canUndo: editor?.history.canUndo() ?? false,
    canRedo: editor?.history.canRedo() ?? false,
  }
}
