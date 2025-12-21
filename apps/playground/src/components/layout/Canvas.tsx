import { forwardRef } from 'react'

interface CanvasProps {
  className?: string
}

export const Canvas = forwardRef<HTMLDivElement, CanvasProps>(
  function Canvas({ className }, ref) {
    return (
      <main
        ref={ref}
        className={`flex-1 overflow-hidden relative bg-canvas-light dark:bg-canvas-dark ${className ?? ''}`}
      >
        {/* Subtle grid pattern for dark mode */}
        <div
          className="absolute inset-0 opacity-0 dark:opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />
        {/* Subtle pattern for light mode */}
        <div
          className="absolute inset-0 opacity-[0.5] dark:opacity-0"
          style={{
            backgroundImage: `
              radial-gradient(circle, #d1d5db 1px, transparent 1px)
            `,
            backgroundSize: '16px 16px',
          }}
        />
      </main>
    )
  }
)
