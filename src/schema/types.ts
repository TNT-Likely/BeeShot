// Schema 类型定义

// 位置锚点
export type Anchor =
  | 'top-left' | 'top-center' | 'top-right'
  | 'center-left' | 'center' | 'center-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right'

// 位置定义（支持百分比和像素）
export interface Position {
  x: string | number      // '50%' 或 100
  y: string | number
  width?: string | number
  height?: string | number
  anchor?: Anchor         // 锚点，默认 top-left
  rotation?: number       // 旋转角度
}

// 文本样式
export interface TextStyle {
  fontSize: number
  fontWeight?: number
  color: string
  textAlign?: 'left' | 'center' | 'right'
  letterSpacing?: string
  textShadow?: string
  lineHeight?: number
}

// 图片样式
export interface ImageStyle {
  borderRadius?: number
  boxShadow?: string
  objectFit?: 'cover' | 'contain' | 'fill'
  border?: string
}

// 二维码样式
export interface QRCodeStyle {
  size: number
  padding?: number
  borderRadius?: number
  background?: string
}

// 形状样式
export interface ShapeStyle {
  fill?: string
  stroke?: string
  strokeWidth?: number
  borderRadius?: number
  backdropFilter?: string
}

// 基础元素
interface BaseElement {
  id: string
  position: Position
  zIndex?: number      // 层级，默认按数组顺序
  visible?: boolean    // 是否显示
  opacity?: number     // 透明度 0-1
  name?: string        // 元素名称（用于编辑器显示）
}

// 文本元素
export interface TextElement extends BaseElement {
  type: 'text'
  content: string  // 支持变量 {{title}}, {{subtitle}}
  style: TextStyle
}

// 图片元素
export interface ImageElement extends BaseElement {
  type: 'image'
  src: string | null  // 支持变量 {{screenshot}}, {{screenshot2}}
  placeholder?: string
  style: ImageStyle
}

// 二维码元素
export interface QRCodeElement extends BaseElement {
  type: 'qrcode'
  url: string  // 支持变量 {{qrcode1.url}}
  label?: string
  style: QRCodeStyle
  labelStyle?: TextStyle
}

// 形状元素（矩形、容器等）
export interface ShapeElement extends BaseElement {
  type: 'shape'
  shape: 'rect' | 'circle' | 'line'
  style: ShapeStyle
}

// 手机框元素
export interface PhoneFrameElement extends BaseElement {
  type: 'phone-frame'
  screenshotSrc: string | null  // {{screenshot}}
  style: {
    frameColor?: string
    screenRadius?: number
    showNotch?: boolean
  }
}

// 标签组元素
export interface TagsElement extends BaseElement {
  type: 'tags'
  tags: string[]  // 支持变量 {{tags}}
  style: ShapeStyle
  tagStyle?: TextStyle
  gap?: number
}

// 所有元素类型
export type SchemaElement =
  | TextElement
  | ImageElement
  | QRCodeElement
  | ShapeElement
  | PhoneFrameElement
  | TagsElement

// 背景定义
export interface Background {
  type: 'gradient' | 'solid' | 'image'
  colors?: [string, string, string]  // 渐变色
  color?: string                      // 纯色
  image?: string                      // 背景图
  gradientAngle?: number              // 渐变角度，默认 180
}

// Slide Schema
export interface SlideSchema {
  id: string
  name: string
  description?: string
  background: Background
  elements: SchemaElement[]
}

// 变量数据
export interface SlideVariables {
  title: string
  subtitle: string
  screenshot: string | null
  screenshot2: string | null
  qrcode1?: { url: string; label: string }
  qrcode2?: { url: string; label: string }
  tags?: string[]
}

// Slide 完整数据
export interface Slide {
  id: number
  schemaId: string        // 使用的 schema ID
  schema: SlideSchema     // schema 定义（可以基于预设修改）
  variables: SlideVariables  // 变量数据
}
