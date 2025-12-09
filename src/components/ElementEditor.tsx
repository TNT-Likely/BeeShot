import React from 'react'
import { SchemaElement, TextElement, ImageElement, QRCodeElement, Position } from '../schema/types'

interface ElementEditorProps {
  element: SchemaElement
  onChange: (element: SchemaElement) => void
}

// 位置编辑器
const PositionEditor: React.FC<{
  position: Position
  onChange: (position: Position) => void
}> = ({ position, onChange }) => {
  const updatePosition = (key: keyof Position, value: string | number) => {
    onChange({ ...position, [key]: value })
  }

  return (
    <div className="position-editor">
      <div className="editor-row">
        <div className="editor-field">
          <label>X</label>
          <input
            type="text"
            value={position.x}
            onChange={(e) => updatePosition('x', e.target.value)}
            placeholder="50% 或 100"
          />
        </div>
        <div className="editor-field">
          <label>Y</label>
          <input
            type="text"
            value={position.y}
            onChange={(e) => updatePosition('y', e.target.value)}
            placeholder="50% 或 100"
          />
        </div>
      </div>
      <div className="editor-row">
        <div className="editor-field">
          <label>宽度</label>
          <input
            type="text"
            value={position.width || ''}
            onChange={(e) => updatePosition('width', e.target.value || undefined as any)}
            placeholder="auto"
          />
        </div>
        <div className="editor-field">
          <label>高度</label>
          <input
            type="text"
            value={position.height || ''}
            onChange={(e) => updatePosition('height', e.target.value || undefined as any)}
            placeholder="auto"
          />
        </div>
      </div>
      <div className="editor-row">
        <div className="editor-field">
          <label>锚点</label>
          <select
            value={position.anchor || 'top-left'}
            onChange={(e) => updatePosition('anchor', e.target.value as any)}
          >
            <option value="top-left">左上</option>
            <option value="top-center">上中</option>
            <option value="top-right">右上</option>
            <option value="center-left">左中</option>
            <option value="center">居中</option>
            <option value="center-right">右中</option>
            <option value="bottom-left">左下</option>
            <option value="bottom-center">下中</option>
            <option value="bottom-right">右下</option>
          </select>
        </div>
        <div className="editor-field">
          <label>旋转</label>
          <input
            type="number"
            value={position.rotation || 0}
            onChange={(e) => updatePosition('rotation', parseFloat(e.target.value) || 0)}
            placeholder="0"
          />
        </div>
      </div>
    </div>
  )
}

// 文本元素编辑器
const TextElementEditor: React.FC<{
  element: TextElement
  onChange: (element: TextElement) => void
}> = ({ element, onChange }) => {
  const updateStyle = (key: string, value: any) => {
    onChange({
      ...element,
      style: { ...element.style, [key]: value }
    })
  }

  return (
    <div className="element-editor-section">
      <h4>文本样式</h4>
      <div className="editor-row">
        <div className="editor-field">
          <label>字号</label>
          <input
            type="number"
            value={element.style.fontSize}
            onChange={(e) => updateStyle('fontSize', parseInt(e.target.value) || 14)}
          />
        </div>
        <div className="editor-field">
          <label>字重</label>
          <select
            value={element.style.fontWeight || 400}
            onChange={(e) => updateStyle('fontWeight', parseInt(e.target.value))}
          >
            <option value={300}>Light</option>
            <option value={400}>Regular</option>
            <option value={500}>Medium</option>
            <option value={600}>Semi Bold</option>
            <option value={700}>Bold</option>
          </select>
        </div>
      </div>
      <div className="editor-row">
        <div className="editor-field">
          <label>颜色</label>
          <input
            type="color"
            value={element.style.color.startsWith('#') ? element.style.color : '#ffffff'}
            onChange={(e) => updateStyle('color', e.target.value)}
          />
        </div>
        <div className="editor-field">
          <label>对齐</label>
          <select
            value={element.style.textAlign || 'left'}
            onChange={(e) => updateStyle('textAlign', e.target.value)}
          >
            <option value="left">左对齐</option>
            <option value="center">居中</option>
            <option value="right">右对齐</option>
          </select>
        </div>
      </div>
      <div className="editor-field full-width">
        <label>字间距</label>
        <input
          type="text"
          value={element.style.letterSpacing || ''}
          onChange={(e) => updateStyle('letterSpacing', e.target.value || undefined)}
          placeholder="0.1em"
        />
      </div>
      <div className="editor-field full-width">
        <label>文字阴影</label>
        <input
          type="text"
          value={element.style.textShadow || ''}
          onChange={(e) => updateStyle('textShadow', e.target.value || undefined)}
          placeholder="0 2px 10px rgba(0,0,0,0.2)"
        />
      </div>
    </div>
  )
}

// 图片元素编辑器
const ImageElementEditor: React.FC<{
  element: ImageElement
  onChange: (element: ImageElement) => void
}> = ({ element, onChange }) => {
  const updateStyle = (key: string, value: any) => {
    onChange({
      ...element,
      style: { ...element.style, [key]: value }
    })
  }

  return (
    <div className="element-editor-section">
      <h4>图片样式</h4>
      <div className="editor-row">
        <div className="editor-field">
          <label>圆角</label>
          <input
            type="number"
            value={element.style.borderRadius || 0}
            onChange={(e) => updateStyle('borderRadius', parseInt(e.target.value) || 0)}
          />
        </div>
        <div className="editor-field">
          <label>填充模式</label>
          <select
            value={element.style.objectFit || 'cover'}
            onChange={(e) => updateStyle('objectFit', e.target.value)}
          >
            <option value="cover">Cover</option>
            <option value="contain">Contain</option>
            <option value="fill">Fill</option>
          </select>
        </div>
      </div>
      <div className="editor-field full-width">
        <label>阴影</label>
        <input
          type="text"
          value={element.style.boxShadow || ''}
          onChange={(e) => updateStyle('boxShadow', e.target.value || undefined)}
          placeholder="0 20px 60px rgba(0,0,0,0.4)"
        />
      </div>
      <div className="editor-field full-width">
        <label>占位符文字</label>
        <input
          type="text"
          value={element.placeholder || ''}
          onChange={(e) => onChange({ ...element, placeholder: e.target.value || undefined })}
          placeholder="上传图片"
        />
      </div>
    </div>
  )
}

// 二维码元素编辑器
const QRCodeElementEditor: React.FC<{
  element: QRCodeElement
  onChange: (element: QRCodeElement) => void
}> = ({ element, onChange }) => {
  const updateStyle = (key: string, value: any) => {
    onChange({
      ...element,
      style: { ...element.style, [key]: value }
    })
  }

  return (
    <div className="element-editor-section">
      <h4>二维码样式</h4>
      <div className="editor-row">
        <div className="editor-field">
          <label>尺寸</label>
          <input
            type="number"
            value={element.style.size}
            onChange={(e) => updateStyle('size', parseInt(e.target.value) || 100)}
          />
        </div>
        <div className="editor-field">
          <label>内边距</label>
          <input
            type="number"
            value={element.style.padding || 0}
            onChange={(e) => updateStyle('padding', parseInt(e.target.value) || 0)}
          />
        </div>
      </div>
      <div className="editor-row">
        <div className="editor-field">
          <label>圆角</label>
          <input
            type="number"
            value={element.style.borderRadius || 0}
            onChange={(e) => updateStyle('borderRadius', parseInt(e.target.value) || 0)}
          />
        </div>
        <div className="editor-field">
          <label>背景色</label>
          <input
            type="color"
            value={element.style.background || '#ffffff'}
            onChange={(e) => updateStyle('background', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

// 主编辑器组件
export const ElementEditor: React.FC<ElementEditorProps> = ({ element, onChange }) => {
  const updatePosition = (position: Position) => {
    onChange({ ...element, position })
  }

  const updateBasic = (key: string, value: any) => {
    onChange({ ...element, [key]: value })
  }

  return (
    <div className="element-editor">
      {/* 基础属性 */}
      <div className="element-editor-section">
        <h4>基础属性</h4>
        <div className="editor-field full-width">
          <label>名称</label>
          <input
            type="text"
            value={element.name || ''}
            onChange={(e) => updateBasic('name', e.target.value)}
            placeholder="元素名称"
          />
        </div>
        <div className="editor-row">
          <div className="editor-field">
            <label>层级</label>
            <input
              type="number"
              value={element.zIndex || 0}
              onChange={(e) => updateBasic('zIndex', parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="editor-field">
            <label>透明度</label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.1"
              value={element.opacity ?? 1}
              onChange={(e) => updateBasic('opacity', parseFloat(e.target.value))}
            />
          </div>
        </div>
        <div className="editor-field full-width">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={element.visible !== false}
              onChange={(e) => updateBasic('visible', e.target.checked)}
            />
            <span>显示</span>
          </label>
        </div>
      </div>

      {/* 位置 */}
      <div className="element-editor-section">
        <h4>位置与尺寸</h4>
        <PositionEditor position={element.position} onChange={updatePosition} />
      </div>

      {/* 类型特定编辑器 */}
      {element.type === 'text' && (
        <TextElementEditor
          element={element as TextElement}
          onChange={onChange as (e: TextElement) => void}
        />
      )}
      {element.type === 'image' && (
        <ImageElementEditor
          element={element as ImageElement}
          onChange={onChange as (e: ImageElement) => void}
        />
      )}
      {element.type === 'qrcode' && (
        <QRCodeElementEditor
          element={element as QRCodeElement}
          onChange={onChange as (e: QRCodeElement) => void}
        />
      )}
    </div>
  )
}

export default ElementEditor
