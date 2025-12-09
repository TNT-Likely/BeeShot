import { useState, useRef, useCallback, useEffect } from 'react'
import html2canvas from 'html2canvas'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import {
  Slide,
  SlideVariables,
  SchemaRenderer,
  TEMPLATE_PACKS,
  TemplatePack,
  PRESET_SCHEMAS,
  cloneSchema,
} from './schema'
import './App.css'

// 设备尺寸配置
const DEVICE_SIZES = {
  'iphone_6.7': { width: 1290, height: 2796, name: '6.7" iPhone', category: 'appstore' },
  'iphone_6.5': { width: 1284, height: 2778, name: '6.5" iPhone', category: 'appstore' },
  'iphone_5.5': { width: 1242, height: 2208, name: '5.5" iPhone', category: 'appstore' },
  'social_1080': { width: 1080, height: 1920, name: '1080×1920', category: 'social' },
  'social_1242': { width: 1242, height: 2208, name: '1242×2208', category: 'social' },
} as const

type DeviceSize = keyof typeof DEVICE_SIZES

// 默认变量
const DEFAULT_VARIABLES: SlideVariables = {
  title: '标题',
  subtitle: '副标题',
  screenshot: null,
  screenshot2: null,
  qrcode1: { url: 'https://apps.apple.com/app/id6754611670', label: 'iOS' },
  qrcode2: { url: 'https://github.com/TNT-Likely/BeeCount/releases', label: 'Android' },
  tags: ['开源', '隐私', '免费', '无广告'],
}

// 从模板套装创建 slides
const createSlidesFromPack = (pack: TemplatePack): Slide[] => {
  return pack.slides.map((packSlide, index) => ({
    id: Date.now() + index,
    schemaId: packSlide.schema.id,
    schema: cloneSchema(packSlide.schema),
    variables: { ...DEFAULT_VARIABLES, ...packSlide.defaultVariables },
  }))
}

// 从预设创建单个 slide
const createSlideFromPreset = (presetId: string): Slide => {
  const schema = PRESET_SCHEMAS[presetId] || PRESET_SCHEMAS.single
  return {
    id: Date.now(),
    schemaId: schema.id,
    schema: cloneSchema(schema),
    variables: { ...DEFAULT_VARIABLES },
  }
}

function App() {
  const [deviceSize, setDeviceSize] = useState<DeviceSize>('iphone_6.7')
  const [currentPack, setCurrentPack] = useState<TemplatePack | null>(null)
  // 默认创建一张使用 single 布局的图片
  const [slides, setSlides] = useState<Slide[]>([createSlideFromPreset('single')])
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState('')

  // HTML 模板模式
  const [htmlMode, setHtmlMode] = useState(false)
  const [htmlTemplate, setHtmlTemplate] = useState(`<div style="width: 100%; height: 100%; background: linear-gradient(180deg, #667eea 0%, #764ba2 50%, #f093fb 100%); display: flex; flex-direction: column; align-items: center; padding: 80px 40px; box-sizing: border-box;">
  <h1 style="color: white; font-size: 90px; font-weight: 700; margin: 0; text-shadow: 0 2px 10px rgba(0,0,0,0.2);">标题</h1>
  <p style="color: rgba(255,255,255,0.9); font-size: 40px; margin: 20px 0 60px 0;">副标题</p>
  <img id="screenshot" src="" style="width: 32%; border-radius: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.4);" />
</div>`)
  const [htmlScreenshot, setHtmlScreenshot] = useState<string | null>(null)
  const htmlPreviewRef = useRef<HTMLDivElement>(null)
  const htmlFileInputRef = useRef<HTMLInputElement>(null)

  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef2 = useRef<HTMLInputElement>(null)
  const previewContainerRef = useRef<HTMLDivElement>(null)
  const [previewScale, setPreviewScale] = useState(0.2)

  const currentSlide = slides[currentSlideIndex]
  const device = DEVICE_SIZES[deviceSize]

  // 自适应计算预览缩放比例
  useEffect(() => {
    const updateScale = () => {
      const container = previewContainerRef.current
      if (!container) return

      const containerHeight = container.clientHeight
      const containerWidth = container.clientWidth

      const scaleH = (containerHeight - 20) / device.height
      const scaleW = (containerWidth - 20) / device.width
      const newScale = Math.min(scaleH, scaleW, 0.4)

      setPreviewScale(Math.max(newScale, 0.1))
    }

    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [device.width, device.height])

  // 选择模板套装，一键加载整套 schema
  const selectPack = (pack: TemplatePack) => {
    setCurrentPack(pack)
    setSlides(createSlidesFromPack(pack))
    setCurrentSlideIndex(0)
  }

  // 重置为空白（快速模式）
  const resetToQuickMode = () => {
    setCurrentPack(null)
    setSlides([createSlideFromPreset('single')])
    setCurrentSlideIndex(0)
  }

  // 添加新 slide
  const addSlide = () => {
    const newSlide = createSlideFromPreset('single')
    setSlides(prev => [...prev, newSlide])
    setCurrentSlideIndex(slides.length)
  }

  // 删除当前 slide
  const deleteSlide = () => {
    if (slides.length <= 1) return
    setSlides(prev => prev.filter((_, i) => i !== currentSlideIndex))
    setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))
  }

  // 更新当前 slide 的变量
  const updateVariables = useCallback((updates: Partial<SlideVariables>) => {
    setSlides(prev => prev.map((slide, i) =>
      i === currentSlideIndex
        ? { ...slide, variables: { ...slide.variables, ...updates } }
        : slide
    ))
  }, [currentSlideIndex])

  // 更新当前 slide 的布局
  const changeLayout = useCallback((presetId: string) => {
    const schema = PRESET_SCHEMAS[presetId]
    if (!schema) return
    setSlides(prev => prev.map((slide, i) =>
      i === currentSlideIndex
        ? { ...slide, schemaId: schema.id, schema: cloneSchema(schema) }
        : slide
    ))
  }, [currentSlideIndex])

  // 更新当前 slide 的背景
  const updateBackground = useCallback((updates: Partial<typeof currentSlide.schema.background>) => {
    setSlides(prev => prev.map((slide, i) =>
      i === currentSlideIndex
        ? {
            ...slide,
            schema: {
              ...slide.schema,
              background: { ...slide.schema.background, ...updates }
            }
          }
        : slide
    ))
  }, [currentSlideIndex])

  // 处理截图上传
  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      updateVariables({ screenshot: event.target?.result as string })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  // 处理第二张截图上传
  const handleScreenshot2Upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      updateVariables({ screenshot2: event.target?.result as string })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  // 导出单张图片
  const exportSingle = async () => {
    const slideEl = slideRefs.current[currentSlideIndex]
    if (!slideEl) return

    setIsExporting(true)
    setExportProgress('正在生成...')

    try {
      const canvas = await html2canvas(slideEl, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      })

      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `beeshot-${currentSlideIndex + 1}.png`)
        }
        setIsExporting(false)
        setExportProgress('')
      }, 'image/png')
    } catch (error) {
      console.error('Export failed:', error)
      setIsExporting(false)
      setExportProgress('导出失败')
    }
  }

  // HTML 模式导出
  const exportHtml = async () => {
    if (!htmlPreviewRef.current) return

    setIsExporting(true)
    setExportProgress('正在生成...')

    try {
      const canvas = await html2canvas(htmlPreviewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      })

      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `beeshot-html-${Date.now()}.png`)
        }
        setIsExporting(false)
        setExportProgress('')
      }, 'image/png')
    } catch (error) {
      console.error('Export failed:', error)
      setIsExporting(false)
      setExportProgress('导出失败')
    }
  }

  // HTML 模式截图上传
  const handleHtmlScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setHtmlScreenshot(event.target?.result as string)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  // 获取处理后的 HTML（替换截图）
  const getProcessedHtml = () => {
    if (!htmlScreenshot) return htmlTemplate
    return htmlTemplate.replace(/src="[^"]*"/, `src="${htmlScreenshot}"`)
  }

  // 批量导出 ZIP
  const exportAll = async () => {
    if (slides.length === 0) return

    setIsExporting(true)
    const zip = new JSZip()

    try {
      for (let i = 0; i < slides.length; i++) {
        setExportProgress(`正在生成 ${i + 1}/${slides.length}...`)

        const slideEl = slideRefs.current[i]
        if (!slideEl) continue

        const canvas = await html2canvas(slideEl, {
          scale: 2,
          useCORS: true,
          backgroundColor: null,
        })

        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, 'image/png')
        })

        if (blob) {
          zip.file(`beeshot-${i + 1}.png`, blob)
        }
      }

      setExportProgress('正在打包...')
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      saveAs(zipBlob, `beeshot-${currentPack?.id || 'custom'}-${deviceSize}.zip`)
    } catch (error) {
      console.error('Export failed:', error)
      setExportProgress('导出失败')
    }

    setIsExporting(false)
    setExportProgress('')
  }

  // 判断当前 slide 是否需要某些字段
  const hasElement = (type: string) => {
    if (!currentSlide) return false
    return currentSlide.schema.elements.some(e =>
      e.type === type || (type === 'screenshot2' && e.type === 'image' && e.id.includes('2'))
    )
  }

  const needsScreenshot2 = currentSlide?.schema.elements.some(e =>
    e.type === 'image' && (e.id === 'screenshot2' || e.id === 'screenshot1')
  )
  const needsQRCodes = currentSlide?.schema.elements.some(e => e.type === 'qrcode')
  const needsTags = currentSlide?.schema.elements.some(e => e.type === 'tags')

  // 快速编辑视图（默认）
  return (
    <div className="app">
      {/* 顶部导航 */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">📸</span>
            <span className="logo-text">BeeShot</span>
          </div>
          <div className="header-actions">
            <span className="export-status">{exportProgress}</span>
            <button
              className={`header-btn ${htmlMode ? 'active' : ''}`}
              onClick={() => setHtmlMode(!htmlMode)}
              title="HTML 模板模式"
            >
              {htmlMode ? '返回普通模式' : 'HTML 模板'}
            </button>
            {htmlMode ? (
              <button
                className="header-btn primary"
                onClick={exportHtml}
                disabled={isExporting}
              >
                导出
              </button>
            ) : (
              <>
                <button
                  className="header-btn"
                  onClick={exportSingle}
                  disabled={isExporting || !currentSlide}
                  title="导出当前"
                >
                  导出当前
                </button>
                <button
                  className="header-btn primary"
                  onClick={exportAll}
                  disabled={isExporting || slides.length === 0}
                  title={`批量导出 ${slides.length} 张`}
                >
                  批量导出 ({slides.length})
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="main">
        {htmlMode ? (
          /* HTML 模板模式 - 直接嵌入 beecount.html */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <iframe
              src="/templates/beecount.html"
              style={{
                flex: 1,
                width: '100%',
                border: 'none',
                background: '#1a1a1a',
              }}
              title="蜜蜂记账宣传图生成器"
            />
          </div>
        ) : (
        /* 普通模式 */
        <>
        {/* 左侧：模板套装 + Slide 列表 */}
        <aside className="sidebar-left">
          {/* 模板套装选择 */}
          <div className="panel">
            <h3 className="panel-title">模板套装</h3>
            <div className="pack-selector">
              {TEMPLATE_PACKS.map(pack => (
                <div
                  key={pack.id}
                  className={`pack-option ${currentPack?.id === pack.id ? 'active' : ''}`}
                  onClick={() => selectPack(pack)}
                >
                  <div
                    className="pack-option-preview"
                    style={{
                      background: pack.slides[0]?.schema.background.colors
                        ? `linear-gradient(180deg, ${pack.slides[0].schema.background.colors[0]}, ${pack.slides[0].schema.background.colors[1]})`
                        : pack.slides[0]?.schema.background.color || '#333',
                    }}
                  />
                  <div className="pack-option-info">
                    <span className="pack-option-name">{pack.name}</span>
                    <span className="pack-option-count">{pack.slides.length} 张</span>
                  </div>
                </div>
              ))}
              {/* 重置选项 */}
              {currentPack && (
                <div
                  className="pack-option reset-option"
                  onClick={resetToQuickMode}
                >
                  <div className="pack-option-preview reset-preview">↺</div>
                  <div className="pack-option-info">
                    <span className="pack-option-name">重置</span>
                    <span className="pack-option-count">清空重来</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 设备选择 */}
          <div className="panel">
            <h3 className="panel-title">设备尺寸</h3>
            <div className="device-category">
              <span className="category-label">App Store</span>
              <div className="device-selector">
                {Object.entries(DEVICE_SIZES)
                  .filter(([_, v]) => v.category === 'appstore')
                  .map(([key, value]) => (
                    <button
                      key={key}
                      className={`device-btn ${deviceSize === key ? 'active' : ''}`}
                      onClick={() => setDeviceSize(key as DeviceSize)}
                    >
                      {value.name}
                    </button>
                  ))}
              </div>
            </div>
            <div className="device-category">
              <span className="category-label">社交媒体</span>
              <div className="device-selector">
                {Object.entries(DEVICE_SIZES)
                  .filter(([_, v]) => v.category === 'social')
                  .map(([key, value]) => (
                    <button
                      key={key}
                      className={`device-btn ${deviceSize === key ? 'active' : ''}`}
                      onClick={() => setDeviceSize(key as DeviceSize)}
                    >
                      {value.name}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </aside>

        {/* 中间：预览区域 */}
        <section className="preview-area">
          {/* 顶部：套装名称 */}
          <div className="preview-header">
            <span className="preview-title">
              {currentPack ? currentPack.name : '快速模式'}
            </span>
            <span className="preview-info">
              {currentSlideIndex + 1} / {slides.length}
            </span>
          </div>

          {/* 中间：预览容器 */}
          <div className="preview-container" ref={previewContainerRef}>
            {currentSlide && (
              <div
                className="preview-slide"
                style={{
                  width: device.width * previewScale,
                  height: device.height * previewScale,
                }}
              >
                <SchemaRenderer
                  schema={currentSlide.schema}
                  variables={currentSlide.variables}
                  deviceWidth={device.width}
                  deviceHeight={device.height}
                  scale={previewScale}
                />
              </div>
            )}
          </div>

          {/* 底部：缩略图导航 */}
          <div className="thumbnail-strip">
            <div className="thumbnail-list">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`thumbnail-item ${index === currentSlideIndex ? 'active' : ''}`}
                  onClick={() => setCurrentSlideIndex(index)}
                >
                  <div
                    className="thumbnail-preview"
                    style={{
                      background: slide.schema.background.colors
                        ? `linear-gradient(180deg, ${slide.schema.background.colors[0]}, ${slide.schema.background.colors[1]})`
                        : slide.schema.background.color || '#333',
                    }}
                  >
                    <span className="thumbnail-number">{index + 1}</span>
                  </div>
                </div>
              ))}
              {/* 添加按钮 */}
              <div className="thumbnail-item add-item" onClick={addSlide}>
                <div className="thumbnail-preview add-preview">
                  <span>+</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 右侧：属性面板 */}
        <aside className="sidebar-right">
          {currentSlide && (
            <>
              {/* 布局选择 */}
              <div className="panel">
                <h3 className="panel-title">布局</h3>
                <div className="layout-buttons">
                  <button
                    className={`layout-btn ${currentSlide.schemaId === 'single' ? 'active' : ''}`}
                    onClick={() => changeLayout('single')}
                  >
                    单截图
                  </button>
                  <button
                    className={`layout-btn ${currentSlide.schemaId === 'single-phone' ? 'active' : ''}`}
                    onClick={() => changeLayout('single-phone')}
                  >
                    手机框
                  </button>
                  <button
                    className={`layout-btn ${currentSlide.schemaId === 'dual' ? 'active' : ''}`}
                    onClick={() => changeLayout('dual')}
                  >
                    双截图
                  </button>
                </div>
              </div>

              {/* 背景设置 */}
              <div className="panel">
                <h3 className="panel-title">背景</h3>
                {/* 背景类型选择 */}
                <div className="layout-buttons" style={{ marginBottom: 12 }}>
                  <button
                    className={`layout-btn ${currentSlide.schema.background.type === 'solid' ? 'active' : ''}`}
                    onClick={() => updateBackground({ type: 'solid', color: currentSlide.schema.background.color || '#667eea' })}
                  >
                    纯色
                  </button>
                  <button
                    className={`layout-btn ${currentSlide.schema.background.type === 'gradient' ? 'active' : ''}`}
                    onClick={() => updateBackground({ type: 'gradient', colors: currentSlide.schema.background.colors || ['#667eea', '#764ba2', '#f093fb'] })}
                  >
                    渐变
                  </button>
                  <button
                    className={`layout-btn ${currentSlide.schema.background.type === 'image' ? 'active' : ''}`}
                    onClick={() => updateBackground({ type: 'image' })}
                  >
                    图片
                  </button>
                </div>

                {/* 纯色背景 */}
                {currentSlide.schema.background.type === 'solid' && (
                  <div className="form-group">
                    <label>背景颜色</label>
                    <input
                      type="color"
                      value={currentSlide.schema.background.color || '#667eea'}
                      onChange={(e) => updateBackground({ color: e.target.value })}
                      style={{ width: '100%', height: 40 }}
                    />
                  </div>
                )}

                {/* 渐变背景 */}
                {currentSlide.schema.background.type === 'gradient' && (
                  <>
                    {/* 渐变预设 */}
                    <div className="gradient-presets">
                      {[
                        { name: '紫粉', colors: ['#667eea', '#764ba2', '#f093fb'] },
                        { name: '蜜蜂', colors: ['#0a0a0a', '#111111', '#0a0a0a'] },
                        { name: '海洋', colors: ['#0093E9', '#80D0C7', '#a8edea'] },
                        { name: '玫瑰', colors: ['#ff9a9e', '#fecfef', '#fad0c4'] },
                        { name: '森林', colors: ['#134E5E', '#71B280', '#c1dfc4'] },
                        { name: '日落', colors: ['#fa709a', '#fee140', '#ffecd2'] },
                      ].map((preset) => (
                        <div
                          key={preset.name}
                          className="gradient-preset"
                          title={preset.name}
                          style={{
                            background: `linear-gradient(180deg, ${preset.colors[0]}, ${preset.colors[1]}, ${preset.colors[2]})`,
                          }}
                          onClick={() => updateBackground({ colors: preset.colors })}
                        />
                      ))}
                    </div>
                    {/* 自定义颜色 */}
                    <div className="color-row">
                      <div className="form-group">
                        <label>顶部</label>
                        <input
                          type="color"
                          value={currentSlide.schema.background.colors?.[0] || '#667eea'}
                          onChange={(e) => {
                            const colors = currentSlide.schema.background.colors || ['#667eea', '#764ba2', '#f093fb']
                            updateBackground({ colors: [e.target.value, colors[1], colors[2]] })
                          }}
                        />
                      </div>
                      <div className="form-group">
                        <label>中间</label>
                        <input
                          type="color"
                          value={currentSlide.schema.background.colors?.[1] || '#764ba2'}
                          onChange={(e) => {
                            const colors = currentSlide.schema.background.colors || ['#667eea', '#764ba2', '#f093fb']
                            updateBackground({ colors: [colors[0], e.target.value, colors[2]] })
                          }}
                        />
                      </div>
                      <div className="form-group">
                        <label>底部</label>
                        <input
                          type="color"
                          value={currentSlide.schema.background.colors?.[2] || '#f093fb'}
                          onChange={(e) => {
                            const colors = currentSlide.schema.background.colors || ['#667eea', '#764ba2', '#f093fb']
                            updateBackground({ colors: [colors[0], colors[1], e.target.value] })
                          }}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* 图片背景 */}
                {currentSlide.schema.background.type === 'image' && (
                  <div
                    className="upload-area"
                    onClick={() => {
                      const input = document.createElement('input')
                      input.type = 'file'
                      input.accept = 'image/*'
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onload = (ev) => {
                            updateBackground({ image: ev.target?.result as string })
                          }
                          reader.readAsDataURL(file)
                        }
                      }
                      input.click()
                    }}
                  >
                    {currentSlide.schema.background.image ? (
                      <span>点击更换背景图</span>
                    ) : (
                      <span>点击上传背景图</span>
                    )}
                  </div>
                )}
              </div>

              {/* 文字设置 */}
              <div className="panel">
                <h3 className="panel-title">文字设置</h3>
                <div className="form-group">
                  <label>标题</label>
                  <input
                    type="text"
                    value={currentSlide.variables.title}
                    onChange={(e) => updateVariables({ title: e.target.value })}
                    placeholder="输入标题"
                  />
                </div>
                <div className="form-group">
                  <label>副标题</label>
                  <input
                    type="text"
                    value={currentSlide.variables.subtitle}
                    onChange={(e) => updateVariables({ subtitle: e.target.value })}
                    placeholder="输入副标题"
                  />
                </div>
              </div>

              {/* 截图设置 */}
              <div className="panel">
                <h3 className="panel-title">截图</h3>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotUpload}
                  style={{ display: 'none' }}
                />
                <input
                  ref={fileInputRef2}
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshot2Upload}
                  style={{ display: 'none' }}
                />
                <div
                  className="upload-area"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {currentSlide.variables.screenshot ? (
                    <span>点击更换截图{needsScreenshot2 ? ' 1' : ''}</span>
                  ) : (
                    <span>点击上传截图{needsScreenshot2 ? ' 1' : ''}</span>
                  )}
                </div>
                {needsScreenshot2 && (
                  <div
                    className="upload-area"
                    style={{ marginTop: 8 }}
                    onClick={() => fileInputRef2.current?.click()}
                  >
                    {currentSlide.variables.screenshot2 ? (
                      <span>点击更换截图 2</span>
                    ) : (
                      <span>点击上传截图 2</span>
                    )}
                  </div>
                )}
              </div>

              {/* 二维码设置 */}
              {needsQRCodes && (
                <div className="panel">
                  <h3 className="panel-title">二维码</h3>
                  <div className="form-group">
                    <label>二维码 1 链接</label>
                    <input
                      type="text"
                      value={currentSlide.variables.qrcode1?.url || ''}
                      onChange={(e) => updateVariables({
                        qrcode1: { ...currentSlide.variables.qrcode1!, url: e.target.value }
                      })}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="form-group">
                    <label>二维码 1 标签</label>
                    <input
                      type="text"
                      value={currentSlide.variables.qrcode1?.label || ''}
                      onChange={(e) => updateVariables({
                        qrcode1: { ...currentSlide.variables.qrcode1!, label: e.target.value }
                      })}
                      placeholder="iOS"
                    />
                  </div>
                  <div className="form-group">
                    <label>二维码 2 链接</label>
                    <input
                      type="text"
                      value={currentSlide.variables.qrcode2?.url || ''}
                      onChange={(e) => updateVariables({
                        qrcode2: { ...currentSlide.variables.qrcode2!, url: e.target.value }
                      })}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="form-group">
                    <label>二维码 2 标签</label>
                    <input
                      type="text"
                      value={currentSlide.variables.qrcode2?.label || ''}
                      onChange={(e) => updateVariables({
                        qrcode2: { ...currentSlide.variables.qrcode2!, label: e.target.value }
                      })}
                      placeholder="Android"
                    />
                  </div>
                </div>
              )}

              {/* 标签设置 */}
              {needsTags && (
                <div className="panel">
                  <h3 className="panel-title">标签</h3>
                  <div className="form-group">
                    <label>标签（逗号分隔）</label>
                    <input
                      type="text"
                      value={currentSlide.variables.tags?.join(', ') || ''}
                      onChange={(e) => updateVariables({
                        tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                      })}
                      placeholder="开源, 免费, 无广告"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </aside>
        </>
      )}
      </main>

      {/* 隐藏的导出用 slides */}
      <div className="export-slides" aria-hidden="true">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            ref={(el) => { slideRefs.current[index] = el }}
            className="export-slide"
            style={{
              width: device.width,
              height: device.height,
            }}
          >
            <SchemaRenderer
              schema={slide.schema}
              variables={slide.variables}
              deviceWidth={device.width}
              deviceHeight={device.height}
              scale={1}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default App

