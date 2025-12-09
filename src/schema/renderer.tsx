import React from 'react'
import {
  SlideSchema,
  SlideVariables,
  SchemaElement,
  TextElement,
  ImageElement,
  QRCodeElement,
  ShapeElement,
  PhoneFrameElement,
  TagsElement,
  Position,
  Anchor,
} from './types'

// 生成二维码 URL
const getQRCodeUrl = (url: string, size: number = 200) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`

// 解析变量
const resolveVariable = (template: string, variables: SlideVariables): string => {
  if (!template) return ''

  return template.replace(/\{\{(\w+(?:\.\w+)?)\}\}/g, (_, key) => {
    const parts = key.split('.')
    let value: any = variables

    for (const part of parts) {
      if (value === null || value === undefined) return ''
      value = value[part]
    }

    return value ?? ''
  })
}

// 计算位置样式
const getPositionStyle = (
  position: Position,
  deviceWidth: number,
  deviceHeight: number,
  scale: number
): React.CSSProperties => {
  const parseValue = (val: string | number | undefined, base: number): number | undefined => {
    if (val === undefined) return undefined
    if (typeof val === 'number') return val * scale
    if (val.endsWith('%')) {
      return (parseFloat(val) / 100) * base
    }
    return parseFloat(val) * scale
  }

  const x = parseValue(position.x, deviceWidth * scale) ?? 0
  const y = parseValue(position.y, deviceHeight * scale) ?? 0
  const width = parseValue(position.width, deviceWidth * scale)
  const height = parseValue(position.height, deviceHeight * scale)

  // 根据锚点调整位置
  const anchor = position.anchor || 'top-left'
  let transform = ''

  switch (anchor) {
    case 'top-center':
      transform = 'translateX(-50%)'
      break
    case 'top-right':
      transform = 'translateX(-100%)'
      break
    case 'center-left':
      transform = 'translateY(-50%)'
      break
    case 'center':
      transform = 'translate(-50%, -50%)'
      break
    case 'center-right':
      transform = 'translate(-100%, -50%)'
      break
    case 'bottom-left':
      transform = 'translateY(-100%)'
      break
    case 'bottom-center':
      transform = 'translate(-50%, -100%)'
      break
    case 'bottom-right':
      transform = 'translate(-100%, -100%)'
      break
  }

  // 添加旋转
  if (position.rotation) {
    transform += ` rotate(${position.rotation}deg)`
  }

  return {
    position: 'absolute',
    left: x,
    top: y,
    width,
    height,
    transform: transform || undefined,
  }
}

// 文本元素渲染
const TextRenderer: React.FC<{
  element: TextElement
  variables: SlideVariables
  deviceWidth: number
  deviceHeight: number
  scale: number
}> = ({ element, variables, deviceWidth, deviceHeight, scale }) => {
  const content = resolveVariable(element.content, variables)
  const posStyle = getPositionStyle(element.position, deviceWidth, deviceHeight, scale)

  return (
    <div
      style={{
        ...posStyle,
        fontSize: element.style.fontSize * scale,
        fontWeight: element.style.fontWeight,
        color: element.style.color,
        textAlign: element.style.textAlign,
        letterSpacing: element.style.letterSpacing,
        textShadow: element.style.textShadow,
        lineHeight: element.style.lineHeight,
        whiteSpace: 'nowrap',
        zIndex: element.zIndex,
        opacity: element.opacity,
      }}
    >
      {content}
    </div>
  )
}

// 图片元素渲染
const ImageRenderer: React.FC<{
  element: ImageElement
  variables: SlideVariables
  deviceWidth: number
  deviceHeight: number
  scale: number
}> = ({ element, variables, deviceWidth, deviceHeight, scale }) => {
  const src = resolveVariable(element.src || '', variables)
  const posStyle = getPositionStyle(element.position, deviceWidth, deviceHeight, scale)

  if (!src) {
    // 渲染占位符
    return (
      <div
        style={{
          ...posStyle,
          background: 'rgba(255, 255, 255, 0.1)',
          border: '2px dashed rgba(255, 255, 255, 0.3)',
          borderRadius: (element.style.borderRadius || 0) * scale,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: 14 * scale,
          zIndex: element.zIndex,
          opacity: element.opacity,
        }}
      >
        {element.placeholder || '上传图片'}
      </div>
    )
  }

  return (
    <div
      style={{
        ...posStyle,
        borderRadius: (element.style.borderRadius || 0) * scale,
        boxShadow: element.style.boxShadow,
        overflow: 'hidden',
        zIndex: element.zIndex,
        opacity: element.opacity,
      }}
    >
      <img
        src={src}
        alt=""
        style={{
          width: '100%',
          height: '100%',
          objectFit: element.style.objectFit || 'cover',
          objectPosition: 'center top',
          display: 'block',
        }}
      />
    </div>
  )
}

// 二维码元素渲染
const QRCodeRenderer: React.FC<{
  element: QRCodeElement
  variables: SlideVariables
  deviceWidth: number
  deviceHeight: number
  scale: number
}> = ({ element, variables, deviceWidth, deviceHeight, scale }) => {
  const url = resolveVariable(element.url, variables)
  const label = resolveVariable(element.label || '', variables)
  const posStyle = getPositionStyle(element.position, deviceWidth, deviceHeight, scale)
  const size = element.style.size * scale
  const padding = (element.style.padding || 0) * scale

  if (!url) return null

  return (
    <div
      style={{
        ...posStyle,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: element.zIndex,
        opacity: element.opacity,
      }}
    >
      <div
        style={{
          padding,
          borderRadius: (element.style.borderRadius || 0) * scale,
          background: element.style.background || '#fff',
        }}
      >
        <img
          src={getQRCodeUrl(url, Math.round(size))}
          alt={label}
          style={{
            width: size,
            height: size,
            display: 'block',
          }}
        />
      </div>
      {label && element.labelStyle && (
        <span
          style={{
            marginTop: 10 * scale,
            fontSize: (element.labelStyle.fontSize || 16) * scale,
            fontWeight: element.labelStyle.fontWeight,
            color: element.labelStyle.color,
          }}
        >
          {label}
        </span>
      )}
    </div>
  )
}

// 形状元素渲染
const ShapeRenderer: React.FC<{
  element: ShapeElement
  deviceWidth: number
  deviceHeight: number
  scale: number
}> = ({ element, deviceWidth, deviceHeight, scale }) => {
  const posStyle = getPositionStyle(element.position, deviceWidth, deviceHeight, scale)

  // 处理渐变背景
  let background = element.style.fill
  if (background?.startsWith('radial-gradient') || background?.startsWith('linear-gradient')) {
    // 渐变样式保持不变
  }

  return (
    <div
      style={{
        ...posStyle,
        background,
        borderRadius: element.shape === 'circle' ? '50%' : (element.style.borderRadius || 0) * scale,
        border: element.style.stroke ? `${element.style.strokeWidth || 1}px solid ${element.style.stroke}` : undefined,
        backdropFilter: element.style.backdropFilter,
        zIndex: element.zIndex,
        opacity: element.opacity,
      }}
    />
  )
}

// 手机框元素渲染
const PhoneFrameRenderer: React.FC<{
  element: PhoneFrameElement
  variables: SlideVariables
  deviceWidth: number
  deviceHeight: number
  scale: number
}> = ({ element, variables, deviceWidth, deviceHeight, scale }) => {
  const src = resolveVariable(element.screenshotSrc || '', variables)
  const posStyle = getPositionStyle(element.position, deviceWidth, deviceHeight, scale)

  // 计算手机框尺寸
  const frameWidth = posStyle.width as number || deviceWidth * 0.65 * scale
  const frameHeight = frameWidth * 2.17
  const framePadding = frameWidth * 0.04
  const frameRadius = frameWidth * 0.14
  const notchWidth = frameWidth * 0.42
  const notchHeight = frameWidth * 0.1
  const screenRadius = (element.style.screenRadius || 40) * scale

  return (
    <div
      style={{
        ...posStyle,
        width: frameWidth,
        height: frameHeight,
        borderRadius: frameRadius,
        padding: framePadding,
        background: element.style.frameColor || '#000',
        boxShadow: `0 ${20 * scale}px ${50 * scale}px rgba(0, 0, 0, 0.3)`,
        zIndex: element.zIndex,
        opacity: element.opacity,
      }}
    >
      {/* 刘海 */}
      {element.style.showNotch !== false && (
        <div
          style={{
            position: 'absolute',
            width: notchWidth,
            height: notchHeight,
            borderRadius: `0 0 ${notchHeight * 0.7}px ${notchHeight * 0.7}px`,
            top: framePadding,
            left: '50%',
            transform: 'translateX(-50%)',
            background: element.style.frameColor || '#000',
            zIndex: 20,
          }}
        />
      )}
      {/* 屏幕 */}
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: screenRadius,
          overflow: 'hidden',
          background: '#1a1a1a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {src ? (
          <img
            src={src}
            alt="screenshot"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 * scale }}>上传截图</span>
        )}
      </div>
    </div>
  )
}

// 标签组元素渲染
const TagsRenderer: React.FC<{
  element: TagsElement
  variables: SlideVariables
  deviceWidth: number
  deviceHeight: number
  scale: number
}> = ({ element, variables, deviceWidth, deviceHeight, scale }) => {
  const posStyle = getPositionStyle(element.position, deviceWidth, deviceHeight, scale)

  // 解析标签
  let tags: string[] = []
  if (element.tags.length === 1 && element.tags[0] === '{{tags}}') {
    tags = variables.tags || []
  } else {
    tags = element.tags.map(t => resolveVariable(t, variables))
  }

  if (tags.length === 0) return null

  const gap = (element.gap || 12) * scale

  return (
    <div
      style={{
        ...posStyle,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap,
        zIndex: element.zIndex,
        opacity: element.opacity,
      }}
    >
      {tags.map((tag, index) => (
        <span
          key={index}
          style={{
            padding: `${8 * scale}px ${16 * scale}px`,
            background: element.style.fill,
            borderRadius: (element.style.borderRadius || 20) * scale,
            backdropFilter: element.style.backdropFilter,
            fontSize: (element.tagStyle?.fontSize || 14) * scale,
            fontWeight: element.tagStyle?.fontWeight,
            color: element.tagStyle?.color,
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  )
}

// 元素渲染分发
const ElementRenderer: React.FC<{
  element: SchemaElement
  variables: SlideVariables
  deviceWidth: number
  deviceHeight: number
  scale: number
}> = ({ element, variables, deviceWidth, deviceHeight, scale }) => {
  if (element.visible === false) return null

  switch (element.type) {
    case 'text':
      return <TextRenderer element={element} variables={variables} deviceWidth={deviceWidth} deviceHeight={deviceHeight} scale={scale} />
    case 'image':
      return <ImageRenderer element={element} variables={variables} deviceWidth={deviceWidth} deviceHeight={deviceHeight} scale={scale} />
    case 'qrcode':
      return <QRCodeRenderer element={element} variables={variables} deviceWidth={deviceWidth} deviceHeight={deviceHeight} scale={scale} />
    case 'shape':
      return <ShapeRenderer element={element} deviceWidth={deviceWidth} deviceHeight={deviceHeight} scale={scale} />
    case 'phone-frame':
      return <PhoneFrameRenderer element={element} variables={variables} deviceWidth={deviceWidth} deviceHeight={deviceHeight} scale={scale} />
    case 'tags':
      return <TagsRenderer element={element} variables={variables} deviceWidth={deviceWidth} deviceHeight={deviceHeight} scale={scale} />
    default:
      return null
  }
}

// 背景渲染
const BackgroundRenderer: React.FC<{
  background: SlideSchema['background']
}> = ({ background }) => {
  let style: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
  }

  if (background.type === 'gradient' && background.colors) {
    const angle = background.gradientAngle ?? 180
    style.background = `linear-gradient(${angle}deg, ${background.colors[0]} 0%, ${background.colors[1]} 50%, ${background.colors[2]} 100%)`
  } else if (background.type === 'solid' && background.color) {
    style.background = background.color
  } else if (background.type === 'image' && background.image) {
    style.backgroundImage = `url(${background.image})`
    style.backgroundSize = 'cover'
    style.backgroundPosition = 'center'
  }

  return <div style={style} />
}

// 主渲染器组件
export interface SchemaRendererProps {
  schema: SlideSchema
  variables: SlideVariables
  deviceWidth: number
  deviceHeight: number
  scale: number
}

export const SchemaRenderer: React.FC<SchemaRendererProps> = ({
  schema,
  variables,
  deviceWidth,
  deviceHeight,
  scale,
}) => {
  // 按 zIndex 排序元素
  const sortedElements = [...schema.elements].sort((a, b) => {
    const zA = a.zIndex ?? 0
    const zB = b.zIndex ?? 0
    return zA - zB
  })

  return (
    <>
      <BackgroundRenderer background={schema.background} />
      {sortedElements.map(element => (
        <ElementRenderer
          key={element.id}
          element={element}
          variables={variables}
          deviceWidth={deviceWidth}
          deviceHeight={deviceHeight}
          scale={scale}
        />
      ))}
    </>
  )
}

export default SchemaRenderer
