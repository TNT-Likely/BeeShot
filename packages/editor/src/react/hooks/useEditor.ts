import { useEditorContext } from '../context/EditorContext'

/**
 * 获取编辑器实例
 */
export function useEditor() {
  return useEditorContext()
}
