import { createContext, useContext, type ReactNode } from 'react'
import type { Editor } from '../../Editor'

const EditorContext = createContext<Editor | null>(null)

interface EditorProviderProps {
  children: ReactNode
  editor: Editor | null
}

/**
 * 编辑器 Provider
 */
export function EditorProvider({ children, editor }: EditorProviderProps) {
  return (
    <EditorContext.Provider value={editor}>
      {children}
    </EditorContext.Provider>
  )
}

/**
 * 获取编辑器实例（可能为 null）
 */
export function useEditorContext(): Editor | null {
  return useContext(EditorContext)
}

/**
 * 获取编辑器实例（必须存在）
 */
export function useEditorContextStrict(): Editor {
  const editor = useContext(EditorContext)
  if (!editor) {
    throw new Error('useEditorContext must be used within EditorProvider with a valid editor')
  }
  return editor
}
