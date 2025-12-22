import { X, Type, Image, Square, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import { useSelection, useEditorContext } from '@beeshot/ui'
import type { Element, TextElement, ImageElement, ShapeElement } from '@beeshot/core'
import { useState, useEffect } from 'react'

interface PropertyPanelProps {
  isOpen?: boolean
  onClose?: () => void
}

export function PropertyPanel({ onClose }: PropertyPanelProps) {
  const selection = useSelection()
  const editor = useEditorContext()
  const [element, setElement] = useState<Element | null>(null)

  useEffect(() => {
    if (selection.length === 1 && editor) {
      const el = editor.renderer.getElement(selection[0])
      setElement(el)
    } else {
      setElement(null)
    }
  }, [selection, editor])

  if (!element) return null

  const getTypeInfo = () => {
    switch (element.type) {
      case 'text':
        return { icon: Type, label: '文本', color: '#3b82f6', bg: '#eff6ff' }
      case 'image':
        return { icon: Image, label: '图片', color: '#22c55e', bg: '#f0fdf4' }
      case 'shape':
        return { icon: Square, label: '形状', color: '#a855f7', bg: '#faf5ff' }
      default:
        return { icon: Square, label: '元素', color: '#71717a', bg: '#f4f4f5' }
    }
  }

  const typeInfo = getTypeInfo()
  const TypeIcon = typeInfo.icon

  return (
    <div
      style={{
        position: 'absolute',
        right: 16,
        top: 16,
        width: 280,
        maxHeight: 'calc(100% - 32px)',
        backgroundColor: '#fff',
        borderRadius: 12,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
        border: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 20,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid #f3f4f6',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: typeInfo.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TypeIcon style={{ width: 16, height: 16, color: typeInfo.color }} />
          </div>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#18181b' }}>
            {typeInfo.label}
          </h3>
        </div>
        <button
          onClick={onClose}
          style={{
            padding: 6,
            borderRadius: 6,
            border: 'none',
            backgroundColor: 'transparent',
            color: '#a1a1aa',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f4f4f5'
            e.currentTarget.style.color = '#52525b'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#a1a1aa'
          }}
        >
          <X style={{ width: 16, height: 16 }} />
        </button>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 16,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Position & Size */}
          <Section title="位置与尺寸">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <InputField
                label="X"
                value={Math.round(element.x)}
                onChange={(v) => editor?.updateElement(element.id, { x: v })}
              />
              <InputField
                label="Y"
                value={Math.round(element.y)}
                onChange={(v) => editor?.updateElement(element.id, { y: v })}
              />
              <InputField
                label="宽度"
                value={Math.round(element.width)}
                onChange={(v) => editor?.updateElement(element.id, { width: v })}
              />
              <InputField
                label="高度"
                value={Math.round(element.height)}
                onChange={(v) => editor?.updateElement(element.id, { height: v })}
              />
            </div>
          </Section>

          {/* Transform */}
          <Section title="变换">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <InputField
                label="旋转"
                value={Math.round(element.rotation)}
                suffix="°"
                onChange={(v) => editor?.updateElement(element.id, { rotation: v })}
              />
              <InputField
                label="透明度"
                value={Math.round(element.opacity * 100)}
                suffix="%"
                min={0}
                max={100}
                onChange={(v) => editor?.updateElement(element.id, { opacity: v / 100 })}
              />
            </div>
          </Section>

          {/* Type-specific */}
          {element.type === 'text' && (
            <TextProperties element={element as TextElement} editor={editor} />
          )}
          {element.type === 'image' && (
            <ImageProperties element={element as ImageElement} editor={editor} />
          )}
          {element.type === 'shape' && (
            <ShapeProperties element={element as ShapeElement} editor={editor} />
          )}
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4
        style={{
          margin: '0 0 8px',
          fontSize: 11,
          fontWeight: 500,
          color: '#a1a1aa',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {title}
      </h4>
      {children}
    </div>
  )
}

function InputField({
  label,
  value,
  suffix,
  min,
  max,
  onChange,
}: {
  label: string
  value: number
  suffix?: string
  min?: number
  max?: number
  onChange: (value: number) => void
}) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontSize: 11,
          fontWeight: 500,
          color: '#71717a',
          marginBottom: 4,
        }}
      >
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            width: '100%',
            padding: '8px 10px',
            paddingRight: suffix ? 28 : 10,
            fontSize: 13,
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: 6,
            color: '#18181b',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#3b82f6'
            e.currentTarget.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.1)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb'
            e.currentTarget.style.boxShadow = 'none'
          }}
        />
        {suffix && (
          <span
            style={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 11,
              color: '#a1a1aa',
            }}
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontSize: 11,
          fontWeight: 500,
          color: '#71717a',
          marginBottom: 4,
        }}
      >
        {label}
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              backgroundColor: value,
              border: '1px solid #e5e7eb',
              cursor: 'pointer',
            }}
          />
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0,
              cursor: 'pointer',
            }}
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1,
            padding: '8px 10px',
            fontSize: 12,
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: 6,
            color: '#18181b',
            textTransform: 'uppercase',
            fontFamily: 'monospace',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#3b82f6'
            e.currentTarget.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.1)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb'
            e.currentTarget.style.boxShadow = 'none'
          }}
        />
      </div>
    </div>
  )
}

function TextProperties({ element, editor }: { element: TextElement; editor: any }) {
  return (
    <>
      <Section title="字体">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 11,
                fontWeight: 500,
                color: '#71717a',
                marginBottom: 4,
              }}
            >
              字体
            </label>
            <select
              value={element.fontFamily}
              onChange={(e) => editor?.updateElement(element.id, { fontFamily: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 10px',
                fontSize: 13,
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: 6,
                color: '#18181b',
                cursor: 'pointer',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            >
              <option value="Inter">Inter</option>
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <InputField
              label="字号"
              value={element.fontSize}
              onChange={(v) => editor?.updateElement(element.id, { fontSize: v })}
            />
            <InputField
              label="字重"
              value={element.fontWeight}
              onChange={(v) => editor?.updateElement(element.id, { fontWeight: v })}
            />
          </div>
        </div>
      </Section>

      <Section title="对齐">
        <div
          style={{
            display: 'flex',
            gap: 4,
            padding: 4,
            backgroundColor: '#f4f4f5',
            borderRadius: 6,
          }}
        >
          {[
            { value: 'left', icon: AlignLeft, label: '左对齐' },
            { value: 'center', icon: AlignCenter, label: '居中' },
            { value: 'right', icon: AlignRight, label: '右对齐' },
          ].map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              onClick={() => editor?.updateElement(element.id, { align: value })}
              title={label}
              style={{
                flex: 1,
                padding: '6px 0',
                border: 'none',
                borderRadius: 4,
                backgroundColor: element.align === value ? '#fff' : 'transparent',
                color: element.align === value ? '#18181b' : '#71717a',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: element.align === value ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon style={{ width: 16, height: 16 }} />
            </button>
          ))}
        </div>
      </Section>

      <Section title="颜色">
        <ColorField
          label="文字颜色"
          value={element.color}
          onChange={(v) => editor?.updateElement(element.id, { color: v })}
        />
      </Section>
    </>
  )
}

function ImageProperties({ element, editor }: { element: ImageElement; editor: any }) {
  return (
    <Section title="样式">
      <InputField
        label="圆角半径"
        value={element.borderRadius}
        onChange={(v) => editor?.updateElement(element.id, { borderRadius: v })}
      />
    </Section>
  )
}

function ShapeProperties({ element, editor }: { element: ShapeElement; editor: any }) {
  return (
    <>
      <Section title="填充">
        <ColorField
          label="填充颜色"
          value={element.fill.type === 'solid' ? element.fill.color || '#000000' : '#000000'}
          onChange={(v) => editor?.updateElement(element.id, { fill: { type: 'solid', color: v } })}
        />
      </Section>

      <Section title="描边">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <ColorField
            label="描边颜色"
            value={element.stroke.color}
            onChange={(v) =>
              editor?.updateElement(element.id, {
                stroke: { ...element.stroke, color: v },
              })
            }
          />
          <InputField
            label="描边宽度"
            value={element.stroke.width}
            onChange={(v) =>
              editor?.updateElement(element.id, {
                stroke: { ...element.stroke, width: v },
              })
            }
          />
        </div>
      </Section>

      {element.shapeType === 'rect' && (
        <Section title="圆角">
          <InputField
            label="圆角半径"
            value={element.borderRadius ?? 0}
            onChange={(v) => editor?.updateElement(element.id, { borderRadius: v })}
          />
        </Section>
      )}
    </>
  )
}
