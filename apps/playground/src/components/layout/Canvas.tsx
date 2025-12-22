import { forwardRef } from 'react'

interface CanvasProps {
  className?: string
}

export const Canvas = forwardRef<HTMLDivElement, CanvasProps>(
  function Canvas({ className }, ref) {
    return (
      <div
        ref={ref}
        className={className}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
    )
  }
)
