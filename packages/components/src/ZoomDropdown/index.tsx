import { useState, useRef, useEffect, type CSSProperties, useCallback } from 'react'
import { ChevronDown, Check } from 'lucide-react'

export interface ZoomDropdownProps {
  zoom: number
  onZoomChange: (zoom: number) => void
  onZoomToFit?: () => void
  onZoomToFill?: () => void
  minZoom?: number
  maxZoom?: number
  presets?: number[]
}

const DEFAULT_PRESETS = [300, 200, 150, 125, 100, 75, 50, 25, 10]

export function ZoomDropdown({
  zoom,
  onZoomChange,
  onZoomToFit,
  onZoomToFill,
  minZoom = 10,
  maxZoom = 300,
  presets = DEFAULT_PRESETS,
}: ZoomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [triggerHovered, setTriggerHovered] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const sliderTrackRef = useRef<HTMLDivElement>(null)
  const tooltipTimerRef = useRef<NodeJS.Timeout | null>(null)

  // 处理 tooltip 延迟显示
  const handleTriggerMouseEnter = () => {
    setTriggerHovered(true)
    tooltipTimerRef.current = setTimeout(() => {
      setShowTooltip(true)
    }, 500)
  }

  const handleTriggerMouseLeave = () => {
    setTriggerHovered(false)
    setShowTooltip(false)
    if (tooltipTimerRef.current) {
      clearTimeout(tooltipTimerRef.current)
    }
  }

  useEffect(() => {
    return () => {
      if (tooltipTimerRef.current) {
        clearTimeout(tooltipTimerRef.current)
      }
    }
  }, [])

  // 点击外部关闭
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // 计算 slider 位置 (0-1)
  const sliderPosition = Math.max(0, Math.min(1, (zoom - minZoom) / (maxZoom - minZoom)))

  // 从位置计算 zoom 值
  const positionToZoom = useCallback((position: number) => {
    return Math.round(minZoom + position * (maxZoom - minZoom))
  }, [minZoom, maxZoom])

  // Slider 拖拽处理
  const handleSliderMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    updateSliderPosition(e.clientX)
  }

  const updateSliderPosition = useCallback((clientX: number) => {
    if (!sliderTrackRef.current) return
    const rect = sliderTrackRef.current.getBoundingClientRect()
    const position = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    onZoomChange(positionToZoom(position))
  }, [onZoomChange, positionToZoom])

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      updateSliderPosition(e.clientX)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, updateSliderPosition])

  const handleZoomSelect = (value: number) => {
    onZoomChange(value)
    setIsOpen(false)
  }

  const handleFitToScreen = () => {
    onZoomToFit?.()
    setIsOpen(false)
  }

  const handleFillScreen = () => {
    onZoomToFill?.()
    setIsOpen(false)
  }

  const zoomPercent = Math.round(zoom)

  return (
    <div ref={containerRef} style={styles.container}>
      {/* Slider + Dropdown Trigger */}
      <div style={styles.controlWrapper}>
        {/* Slider */}
        <div
          ref={sliderTrackRef}
          style={styles.sliderTrack}
          onMouseDown={handleSliderMouseDown}
        >
          {/* Filled track */}
          <div
            style={{
              ...styles.sliderFilled,
              width: `${sliderPosition * 100}%`,
            }}
          />
          {/* Thumb */}
          <div
            style={{
              ...styles.sliderThumb,
              left: `${sliderPosition * 100}%`,
            }}
          />
        </div>

        {/* Zoom Value Dropdown Trigger */}
        <div style={styles.triggerWrapper}>
          <button
            onClick={() => {
              setIsOpen(!isOpen)
              setShowTooltip(false)
            }}
            onMouseEnter={handleTriggerMouseEnter}
            onMouseLeave={handleTriggerMouseLeave}
            style={{
              ...styles.trigger,
              ...(triggerHovered ? styles.triggerHover : {}),
            }}
          >
            <span style={styles.zoomText}>{zoomPercent}%</span>
            <ChevronDown
              size={12}
              style={{
                ...styles.chevron,
                ...(isOpen ? styles.chevronOpen : {}),
              }}
            />
          </button>
          {/* Tooltip */}
          {showTooltip && !isOpen && (
            <div style={styles.tooltip}>缩放</div>
          )}
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div style={styles.menu}>
          {/* Zoom Presets */}
          {presets.map((preset) => (
            <button
              key={preset}
              onClick={() => handleZoomSelect(preset)}
              onMouseEnter={() => setHoveredItem(`preset-${preset}`)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                ...styles.menuItem,
                ...(hoveredItem === `preset-${preset}` ? styles.menuItemHover : {}),
              }}
            >
              <span>{preset}%</span>
              {zoomPercent === preset && (
                <Check size={14} style={styles.checkIcon} />
              )}
            </button>
          ))}

          {/* Divider */}
          <div style={styles.divider} />

          {/* Fit to Screen */}
          <button
            onClick={handleFitToScreen}
            onMouseEnter={() => setHoveredItem('fit')}
            onMouseLeave={() => setHoveredItem(null)}
            style={{
              ...styles.menuItem,
              ...(hoveredItem === 'fit' ? styles.menuItemHover : {}),
            }}
          >
            <span>适合屏幕</span>
          </button>

          {/* Fill Screen */}
          <button
            onClick={handleFillScreen}
            onMouseEnter={() => setHoveredItem('fill')}
            onMouseLeave={() => setHoveredItem(null)}
            style={{
              ...styles.menuItem,
              ...(hoveredItem === 'fill' ? styles.menuItemHover : {}),
            }}
          >
            <span>填满屏幕</span>
          </button>
        </div>
      )}
    </div>
  )
}

// 样式定义 - 使用内联样式 + CSS Token
const styles: Record<string, CSSProperties> = {
  container: {
    position: 'relative',
  },
  controlWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '4px 4px 4px 12px',
    borderRadius: 8,
    backgroundColor: 'var(--color-bg-secondary, #f3f4f6)',
  },
  triggerWrapper: {
    position: 'relative',
  },
  tooltip: {
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    marginBottom: 8,
    padding: '6px 10px',
    fontSize: 12,
    fontWeight: 500,
    color: '#fff',
    backgroundColor: '#1f2937',
    borderRadius: 6,
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    zIndex: 60,
  },
  sliderTrack: {
    position: 'relative',
    width: 80,
    height: 4,
    backgroundColor: 'var(--color-border, #d1d5db)',
    borderRadius: 2,
    cursor: 'pointer',
  },
  sliderFilled: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    backgroundColor: 'var(--color-text-secondary, #6b7280)',
    borderRadius: 2,
    pointerEvents: 'none',
  },
  sliderThumb: {
    position: 'absolute',
    top: '50%',
    width: 12,
    height: 12,
    backgroundColor: '#fff',
    border: '2px solid var(--color-text-secondary, #6b7280)',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    cursor: 'grab',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  trigger: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    padding: '4px 8px',
    borderRadius: 6,
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--color-text-primary, #374151)',
    transition: 'background-color 0.15s',
  },
  triggerHover: {
    backgroundColor: 'var(--color-bg-tertiary, #e5e7eb)',
  },
  zoomText: {
    fontVariantNumeric: 'tabular-nums',
    minWidth: 36,
    textAlign: 'right',
  },
  chevron: {
    color: 'var(--color-text-tertiary, #9ca3af)',
    transition: 'transform 0.15s',
  },
  chevronOpen: {
    transform: 'rotate(180deg)',
  },
  menu: {
    position: 'absolute',
    bottom: '100%',
    right: 0,
    marginBottom: 8,
    width: 140,
    backgroundColor: 'var(--color-bg-primary, #ffffff)',
    borderRadius: 10,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    border: '1px solid var(--color-border, #e5e7eb)',
    padding: '6px 0',
    zIndex: 50,
    maxHeight: 320,
    overflowY: 'auto',
  },
  menuItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 14px',
    fontSize: 13,
    color: 'var(--color-text-primary, #374151)',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background-color 0.15s',
  },
  menuItemHover: {
    backgroundColor: 'var(--color-bg-secondary, #f3f4f6)',
  },
  divider: {
    height: 1,
    backgroundColor: 'var(--color-border, #e5e7eb)',
    margin: '6px 0',
  },
  checkIcon: {
    color: 'var(--color-accent, #0ea5e9)',
  },
}

export default ZoomDropdown
