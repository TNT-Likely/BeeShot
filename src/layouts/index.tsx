// 布局组件的通用 props
interface LayoutProps {
  title: string
  subtitle: string
  screenshot: string | null
  screenshot2?: string | null
  qrcode1?: { url: string; label: string }
  qrcode2?: { url: string; label: string }
  tags?: string[]
  scale: number
  deviceWidth: number
  deviceHeight: number
  showPhoneFrame?: boolean
  htmlCode?: string
}

// 生成二维码 URL
const getQRCodeUrl = (url: string, size: number = 200) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`

// 单截图布局
export function SingleLayout({ title, subtitle, screenshot, scale, deviceWidth, deviceHeight, showPhoneFrame }: LayoutProps) {
  const screenshotHeight = deviceHeight * 0.7
  const screenshotWidth = screenshotHeight / 2.17

  // 手机框尺寸
  const phoneFrameWidth = deviceWidth * 0.65
  const phoneFrameHeight = phoneFrameWidth * 2.17
  const phoneFramePadding = phoneFrameWidth * 0.04
  const phoneFrameRadius = phoneFrameWidth * 0.14
  const phoneNotchWidth = phoneFrameWidth * 0.42
  const phoneNotchHeight = phoneFrameWidth * 0.1
  const screenRadius = phoneFrameWidth * 0.11

  return (
    <div className="layout-content">
      <div className="layout-title" style={{ paddingTop: deviceHeight * scale * 0.05 }}>
        <h1 style={{ fontSize: deviceWidth * 0.07 * scale }}>{title}</h1>
        <p style={{ fontSize: deviceWidth * 0.032 * scale, marginTop: deviceHeight * 0.01 * scale }}>{subtitle}</p>
      </div>
      <div className="layout-screenshot-single" style={{ marginTop: deviceHeight * 0.03 * scale }}>
        {showPhoneFrame ? (
          <div
            className="phone-frame"
            style={{
              width: phoneFrameWidth * scale,
              height: phoneFrameHeight * scale,
              borderRadius: phoneFrameRadius * scale,
              padding: phoneFramePadding * scale,
              background: '#000',
              boxShadow: `0 ${20 * scale}px ${50 * scale}px rgba(0, 0, 0, 0.3)`,
              position: 'relative',
            }}
          >
            <div
              className="phone-notch"
              style={{
                width: phoneNotchWidth * scale,
                height: phoneNotchHeight * scale,
                borderRadius: `0 0 ${phoneNotchHeight * 0.7 * scale}px ${phoneNotchHeight * 0.7 * scale}px`,
                top: phoneFramePadding * scale,
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#000',
                zIndex: 20,
              }}
            />
            <div
              className="phone-screen"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: screenRadius * scale,
                overflow: 'hidden',
                background: '#1a1a1a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {screenshot ? (
                <img
                  src={screenshot}
                  alt="screenshot"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 * scale }}>上传截图</span>
              )}
            </div>
          </div>
        ) : (
          screenshot ? (
            <img
              src={screenshot}
              alt="screenshot"
              style={{
                height: screenshotHeight * scale,
                borderRadius: 24 * scale,
                boxShadow: `0 ${20 * scale}px ${60 * scale}px rgba(0,0,0,0.4)`,
              }}
            />
          ) : (
            <div
              className="screenshot-placeholder"
              style={{
                width: screenshotWidth * scale,
                height: screenshotHeight * scale,
                borderRadius: 24 * scale,
              }}
            >
              上传截图
            </div>
          )
        )}
      </div>
    </div>
  )
}

// 双截图布局
export function DualLayout({ title, subtitle, screenshot, screenshot2, scale, deviceWidth, deviceHeight }: LayoutProps) {
  const screenshotHeight = deviceHeight * 0.55
  const screenshotWidth = screenshotHeight / 2.17

  return (
    <div className="layout-content">
      <div className="layout-title" style={{ paddingTop: deviceHeight * scale * 0.05 }}>
        <h1 style={{ fontSize: deviceWidth * 0.07 * scale }}>{title}</h1>
        <p style={{ fontSize: deviceWidth * 0.032 * scale, marginTop: deviceHeight * 0.01 * scale }}>{subtitle}</p>
      </div>
      <div
        className="layout-screenshot-dual"
        style={{
          marginTop: deviceHeight * 0.04 * scale,
          gap: 30 * scale,
        }}
      >
        <div
          className="dual-phone"
          style={{
            transform: `rotate(-8deg)`,
          }}
        >
          {screenshot ? (
            <img
              src={screenshot}
              alt="screenshot1"
              style={{
                height: screenshotHeight * scale,
                borderRadius: 20 * scale,
                boxShadow: `0 ${20 * scale}px ${60 * scale}px rgba(0,0,0,0.5)`,
              }}
            />
          ) : (
            <div
              className="screenshot-placeholder"
              style={{
                width: screenshotWidth * scale,
                height: screenshotHeight * scale,
                borderRadius: 20 * scale,
              }}
            >
              截图1
            </div>
          )}
        </div>
        <div
          className="dual-phone"
          style={{
            transform: `rotate(8deg)`,
          }}
        >
          {screenshot2 ? (
            <img
              src={screenshot2}
              alt="screenshot2"
              style={{
                height: screenshotHeight * scale,
                borderRadius: 20 * scale,
                boxShadow: `0 ${20 * scale}px ${60 * scale}px rgba(0,0,0,0.5)`,
              }}
            />
          ) : (
            <div
              className="screenshot-placeholder"
              style={{
                width: screenshotWidth * scale,
                height: screenshotHeight * scale,
                borderRadius: 20 * scale,
              }}
            >
              截图2
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// 截图+二维码布局
export function DualQRCodeLayout({ title, subtitle, screenshot, qrcode1, qrcode2, scale, deviceWidth, deviceHeight }: LayoutProps) {
  const screenshotHeight = deviceHeight * 0.5
  const qrSize = 180

  return (
    <div className="layout-content">
      <div className="layout-title" style={{ paddingTop: deviceHeight * scale * 0.04 }}>
        <h1 style={{ fontSize: deviceWidth * 0.07 * scale }}>{title}</h1>
        <p style={{ fontSize: deviceWidth * 0.032 * scale, marginTop: deviceHeight * 0.01 * scale }}>{subtitle}</p>
      </div>
      <div className="layout-screenshot-single" style={{ marginTop: deviceHeight * 0.02 * scale }}>
        {screenshot ? (
          <img
            src={screenshot}
            alt="screenshot"
            style={{
              height: screenshotHeight * scale,
              borderRadius: 20 * scale,
              boxShadow: `0 ${20 * scale}px ${60 * scale}px rgba(0,0,0,0.4)`,
            }}
          />
        ) : (
          <div
            className="screenshot-placeholder"
            style={{
              width: (screenshotHeight / 2.17) * scale,
              height: screenshotHeight * scale,
              borderRadius: 20 * scale,
            }}
          >
            上传截图
          </div>
        )}
      </div>
      <div
        className="layout-qrcodes"
        style={{
          marginTop: deviceHeight * 0.03 * scale,
          gap: 40 * scale,
        }}
      >
        {qrcode1 && (
          <div className="qrcode-item">
            <div
              className="qrcode-box"
              style={{
                padding: 12 * scale,
                borderRadius: 16 * scale,
              }}
            >
              <img
                src={getQRCodeUrl(qrcode1.url, qrSize)}
                alt={qrcode1.label}
                style={{
                  width: qrSize * scale,
                  height: qrSize * scale,
                }}
              />
            </div>
            <span
              className="qrcode-label"
              style={{ fontSize: 20 * scale, marginTop: 10 * scale }}
            >
              {qrcode1.label}
            </span>
          </div>
        )}
        {qrcode2 && (
          <div className="qrcode-item">
            <div
              className="qrcode-box"
              style={{
                padding: 12 * scale,
                borderRadius: 16 * scale,
              }}
            >
              <img
                src={getQRCodeUrl(qrcode2.url, qrSize)}
                alt={qrcode2.label}
                style={{
                  width: qrSize * scale,
                  height: qrSize * scale,
                }}
              />
            </div>
            <span
              className="qrcode-label"
              style={{ fontSize: 20 * scale, marginTop: 10 * scale }}
            >
              {qrcode2.label}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// 综合展示布局
export function ShowcaseLayout({ title, subtitle, screenshot, screenshot2, qrcode1, qrcode2, tags, scale, deviceWidth, deviceHeight }: LayoutProps) {
  const screenshotHeight = deviceHeight * 0.38
  const screenshotWidth = screenshotHeight / 2.17
  const qrSize = 150

  return (
    <div className="layout-content showcase">
      <div className="layout-title" style={{ paddingTop: deviceHeight * scale * 0.03 }}>
        <h1 style={{ fontSize: deviceWidth * 0.065 * scale }}>{title}</h1>
        <p style={{ fontSize: deviceWidth * 0.028 * scale, marginTop: deviceHeight * 0.008 * scale }}>{subtitle}</p>
      </div>

      {/* 双截图 */}
      <div
        className="layout-screenshot-dual showcase-dual"
        style={{
          marginTop: deviceHeight * 0.02 * scale,
          height: screenshotHeight * scale * 1.1,
        }}
      >
        <div
          className="dual-phone"
          style={{
            transform: `rotate(-8deg) translateX(${20 * scale}px)`,
            position: 'absolute',
            left: '25%',
          }}
        >
          {screenshot ? (
            <img
              src={screenshot}
              alt="screenshot1"
              style={{
                height: screenshotHeight * scale,
                borderRadius: 16 * scale,
                boxShadow: `0 ${15 * scale}px ${40 * scale}px rgba(0,0,0,0.5)`,
              }}
            />
          ) : (
            <div
              className="screenshot-placeholder"
              style={{
                width: screenshotWidth * scale,
                height: screenshotHeight * scale,
                borderRadius: 16 * scale,
              }}
            >
              亮色
            </div>
          )}
        </div>
        <div
          className="dual-phone"
          style={{
            transform: `rotate(8deg) translateX(${-20 * scale}px)`,
            position: 'absolute',
            right: '25%',
          }}
        >
          {screenshot2 ? (
            <img
              src={screenshot2}
              alt="screenshot2"
              style={{
                height: screenshotHeight * scale,
                borderRadius: 16 * scale,
                boxShadow: `0 ${15 * scale}px ${40 * scale}px rgba(0,0,0,0.5)`,
              }}
            />
          ) : (
            <div
              className="screenshot-placeholder"
              style={{
                width: screenshotWidth * scale,
                height: screenshotHeight * scale,
                borderRadius: 16 * scale,
              }}
            >
              暗色
            </div>
          )}
        </div>
      </div>

      {/* 二维码 */}
      <div
        className="layout-qrcodes"
        style={{
          marginTop: deviceHeight * 0.02 * scale,
          gap: 30 * scale,
        }}
      >
        {qrcode1 && (
          <div className="qrcode-item">
            <div
              className="qrcode-box"
              style={{
                padding: 10 * scale,
                borderRadius: 14 * scale,
              }}
            >
              <img
                src={getQRCodeUrl(qrcode1.url, qrSize)}
                alt={qrcode1.label}
                style={{
                  width: qrSize * scale,
                  height: qrSize * scale,
                }}
              />
            </div>
            <span
              className="qrcode-label"
              style={{ fontSize: 16 * scale, marginTop: 8 * scale }}
            >
              {qrcode1.label}
            </span>
          </div>
        )}
        {qrcode2 && (
          <div className="qrcode-item">
            <div
              className="qrcode-box"
              style={{
                padding: 10 * scale,
                borderRadius: 14 * scale,
              }}
            >
              <img
                src={getQRCodeUrl(qrcode2.url, qrSize)}
                alt={qrcode2.label}
                style={{
                  width: qrSize * scale,
                  height: qrSize * scale,
                }}
              />
            </div>
            <span
              className="qrcode-label"
              style={{ fontSize: 16 * scale, marginTop: 8 * scale }}
            >
              {qrcode2.label}
            </span>
          </div>
        )}
      </div>

      {/* 标签 */}
      {tags && tags.length > 0 && (
        <div
          className="layout-tags"
          style={{
            marginTop: deviceHeight * 0.015 * scale,
            gap: 12 * scale,
          }}
        >
          {tags.map((tag, index) => (
            <span
              key={index}
              className="tag-item"
              style={{
                padding: `${8 * scale}px ${16 * scale}px`,
                borderRadius: 20 * scale,
                fontSize: 14 * scale,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// HTML 自定义布局
export function HtmlLayout({ title, subtitle, screenshot, htmlCode, scale, deviceWidth, deviceHeight }: LayoutProps) {
  // 处理模板变量替换
  const processHtml = (html: string) => {
    let processed = html
      .replace(/\{\{title\}\}/g, title)
      .replace(/\{\{subtitle\}\}/g, subtitle)

    // 处理 screenshot 条件渲染
    if (screenshot) {
      processed = processed
        .replace(/\{\{#if screenshot\}\}/g, '')
        .replace(/\{\{\/if\}\}/g, '')
        .replace(/\{\{else\}\}[\s\S]*?\{\{\/if\}\}/g, '')
        .replace(/\{\{screenshot\}\}/g, screenshot)
    } else {
      // 移除 screenshot 相关的条件块，保留 else 部分
      processed = processed.replace(
        /\{\{#if screenshot\}\}[\s\S]*?\{\{else\}\}([\s\S]*?)\{\{\/if\}\}/g,
        '$1'
      )
    }

    return processed
  }

  const processedHtml = htmlCode ? processHtml(htmlCode) : ''

  // 计算缩放后的尺寸
  const scaledWidth = deviceWidth * scale
  const scaledHeight = deviceHeight * scale

  return (
    <div
      className="layout-content html-layout"
      style={{
        width: scaledWidth,
        height: scaledHeight,
        position: 'absolute',
        top: 0,
        left: 0,
        overflow: 'hidden',
      }}
    >
      <iframe
        srcDoc={processedHtml}
        style={{
          width: deviceWidth,
          height: deviceHeight,
          border: 'none',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
        title="HTML Preview"
      />
    </div>
  )
}
