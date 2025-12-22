import { useState, useEffect, useCallback } from 'react'
import { useEditorContext } from '../context/EditorContext'

/**
 * 缩放控制 Hook
 */
export function useZoom() {
  const editor = useEditorContext()
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    if (!editor) return

    // 初始获取缩放值
    setZoom(editor.renderer.getZoom())

    // 监听缩放变化
    const unsubscribe = editor.renderer.on('zoom:changed', (newZoom) => {
      setZoom(newZoom)
    })

    return unsubscribe
  }, [editor])

  const zoomIn = useCallback(() => {
    const newZoom = Math.min(zoom * 1.2, 5)
    editor?.renderer.setZoom(newZoom)
  }, [editor, zoom])

  const zoomOut = useCallback(() => {
    const newZoom = Math.max(zoom / 1.2, 0.1)
    editor?.renderer.setZoom(newZoom)
  }, [editor, zoom])

  const zoomToFit = useCallback(() => {
    editor?.renderer.zoomToFit()
  }, [editor])

  const setZoomLevel = useCallback((level: number) => {
    editor?.renderer.setZoom(level)
  }, [editor])

  return {
    zoom,
    zoomPercent: Math.round(zoom * 100),
    zoomIn,
    zoomOut,
    zoomToFit,
    setZoom: setZoomLevel,
  }
}
