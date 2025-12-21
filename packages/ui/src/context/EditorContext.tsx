import { createContext, useContext, type ReactNode } from 'react'
import type { Editor } from '@beeshot/editor'

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
 * 获取编辑器实例
 */
export function useEditorContext(): Editor {
  const editor = useContext(EditorContext)
  if (!editor) {
    throw new Error('useEditorContext must be used within EditorProvider')
  }
  return editor
}
