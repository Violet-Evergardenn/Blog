import { useRef, useState } from 'react'
import gsap from 'gsap'

interface PhotoCardProps {
  src: string
  alt: string
  description: string
  width: number
  height: number
  left: number
  top: number
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
  isActive?: boolean
}

// Theme colors
const THEME_ORANGE = '#FF4D00'
const THEME_BLACK = '#000000'
const THEME_WHITE = '#FFFFFF'

// ─── 预生成静态 Canvas 噪点（模块级别，只算一次）─────────────────────────────
// 替换掉每张卡片上的 feTurbulence SVG 滤镜（每帧都要重算，是卡顿最大元凶）
const NOISE_BG = (() => {
  if (typeof document === 'undefined') return ''
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  const imageData = ctx.createImageData(size, size)
  for (let i = 0; i < imageData.data.length; i += 4) {
    const v = (Math.random() * 255) | 0
    imageData.data[i] = v
    imageData.data[i + 1] = v
    imageData.data[i + 2] = v
    imageData.data[i + 3] = 28  // 低不透明度，只是纹理感
  }
  ctx.putImageData(imageData, 0, 0)
  return `url(${canvas.toDataURL('image/png')})`
})()

export default function PhotoCard({ src, alt, description, width, height, left, top, onClick, isActive = false }: PhotoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const scanlineRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  
  // Generate a random ID for the brutalist aesthetic
  const [photoId] = useState(() => `IMG-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`)

  const handleMouseEnter = () => {
    if (isActive) return
    // 图片缩放 & 卡片阴影全部用 GSAP 驱动，不再需要 isHovered state
    if (imageRef.current) {
      gsap.to(imageRef.current, { scale: 1.05, duration: 0.5, ease: 'power3.out' })
    }
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        boxShadow: `12px 12px 0px ${THEME_ORANGE}`,
        borderColor: THEME_ORANGE,
        duration: 0.4,
        ease: 'back.out(1.5)'
      })
    }
    if (scanlineRef.current) {
      gsap.fromTo(scanlineRef.current,
        { y: -height },
        { y: height, duration: 1.5, repeat: -1, ease: 'linear' }
      )
    }
  }

  const handleMouseLeave = () => {
    if (isActive) return
    if (imageRef.current) {
      gsap.to(imageRef.current, { scale: 1, duration: 0.5, ease: 'power3.out' })
    }
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        boxShadow: `4px 4px 0px ${THEME_BLACK}`,
        borderColor: THEME_BLACK,
        duration: 0.4,
        ease: 'power3.out'
      })
    }
    if (scanlineRef.current) {
      gsap.killTweensOf(scanlineRef.current)
    }
  }

  return (
    <div
      ref={cardRef}
      // group/photo 用于 CSS hover 控制 ribbon 和 crosshair，不再需要 isHovered state
      className={`photo-item absolute cursor-pointer bg-black group/photo ${isActive ? 'z-50' : 'z-10'}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        left: `${left}px`,
        top: `${top}px`,
        // 只保留 transform，其余非可合成属性移出 will-change（否则反而占用 GPU 显存且无效）
        willChange: 'transform',
        border: `2px solid ${isActive ? THEME_ORANGE : THEME_BLACK}`,
        boxShadow: isActive ? `16px 16px 0px ${THEME_ORANGE}` : `4px 4px 0px ${THEME_BLACK}`,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Image container */}
      <div className="w-full h-full relative bg-zinc-900/50 overflow-hidden">
        {/* Placeholder before load */}
        <div 
          className={`absolute inset-0 bg-zinc-800 animate-pulse transition-opacity duration-700 z-0 ${isLoaded ? 'opacity-0 invisible' : 'opacity-100'}`}
        />
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover pointer-events-none transition-opacity duration-700 ease-in-out z-10 relative ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          draggable={false}
          style={{ transformOrigin: 'center center' }}
        />
        
        {/* 噪点纹理 ─ 使用预生成 Canvas 静态纹理，替换掉每帧重算的 feTurbulence SVG 滤镜 */}
        {/* 同时去掉 mix-blend-overlay（会强制创建额外合成层） */}
        <div 
          className="absolute inset-0 opacity-[0.12] pointer-events-none"
          style={{
            backgroundImage: NOISE_BG,
            backgroundRepeat: 'repeat',
          }}
        />

        {/* Scanning Line */}
        <div 
          ref={scanlineRef}
          className={`absolute left-0 right-0 h-16 pointer-events-none z-10 ${isActive ? 'opacity-0' : 'opacity-0 group-hover/photo:opacity-30'}`}
          style={{
            background: `linear-gradient(to bottom, transparent, ${THEME_ORANGE}, transparent)`,
          }}
        />
        
        {/* Brutalist Crosshairs ─ CSS group-hover 驱动，无 React re-render */}
        <div className={`absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-white mix-blend-difference opacity-70 transition-all duration-300 ${isActive ? 'scale-125 border-orange-500' : 'group-hover/photo:scale-125 group-hover/photo:border-orange-500'}`} />
        <div className={`absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-white mix-blend-difference opacity-70 transition-all duration-300 ${isActive ? 'scale-125 border-orange-500' : 'group-hover/photo:scale-125 group-hover/photo:border-orange-500'}`} />
        <div className={`absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-white mix-blend-difference opacity-70 transition-all duration-300 ${isActive ? 'scale-125 border-orange-500' : 'group-hover/photo:scale-125 group-hover/photo:border-orange-500'}`} />
        <div className={`absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-white mix-blend-difference opacity-70 transition-all duration-300 ${isActive ? 'scale-125 border-orange-500' : 'group-hover/photo:scale-125 group-hover/photo:border-orange-500'}`} />

        {/* Corner Ribbon ─ CSS group-hover 驱动，移除 isHovered state 依赖 */}
        <div 
          className={`absolute -right-10 top-6 w-32 py-1 text-center rotate-45 z-30 transition-transform duration-500 ease-out ${isActive ? '[transform:translateY(0)_rotate(45deg)]' : '[transform:translateY(-250%)_rotate(45deg)] group-hover/photo:[transform:translateY(0)_rotate(45deg)]'}`}
          style={{ backgroundColor: THEME_ORANGE, color: THEME_BLACK }}
        >
          <span className="text-[10px] font-black font-mono uppercase tracking-widest">FOCUS</span>
        </div>
      </div>

      {/* Top Tech Bar */}
      <div className="absolute top-0 left-0 right-0 px-3 py-2 flex justify-between items-center z-10 mix-blend-difference">
        <span className="text-[10px] font-mono text-white font-bold tracking-widest">
          {photoId}
        </span>
        <div className="flex gap-1">
          <span className="w-1 h-3 bg-white inline-block animate-pulse" style={{ animationDelay: '0ms' }}></span>
          <span className="w-1 h-3 bg-white inline-block animate-pulse" style={{ animationDelay: '150ms' }}></span>
          <span className="w-1 h-3 bg-white inline-block animate-pulse" style={{ animationDelay: '300ms' }}></span>
        </div>
      </div>

      {/* Description overlay */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-5 z-20 transition-opacity duration-300 ${isActive ? 'opacity-0' : 'opacity-100'}`}
        style={{
          background: `linear-gradient(to top, ${THEME_BLACK} 0%, ${THEME_BLACK}E6 70%, transparent 100%)`,
        }}
      >
        <div className="border-l-4 pl-4" style={{ borderColor: THEME_ORANGE }}>
          <h3 
            className="uppercase tracking-tighter mb-2 text-xl line-clamp-1"
            style={{ 
              color: THEME_WHITE,
              fontFamily: 'var(--font-display, "Archivo Black", sans-serif)',
              textShadow: `2px 2px 0px ${THEME_ORANGE}`,
            }}
          >
            {alt || 'UNTITLED'}
          </h3>
        </div>
      </div>

      {/* Expanded Description - active only */}
      <div 
        className="absolute top-full left-1/2 -translate-x-1/2 w-[200%] pt-8 flex flex-col items-center justify-center pointer-events-none"
        style={{
          opacity: isActive ? 1 : 0,
          transform: isActive ? 'translateY(0)' : 'translateY(-10px)',
          transition: isActive ? 'all 0.5s ease-out 0.3s' : 'none',
        }}
      >
        <h3 
          className="text-4xl uppercase tracking-widest mb-4 text-center whitespace-nowrap"
          style={{ 
            color: THEME_ORANGE,
            fontFamily: 'var(--font-display, "Archivo Black", sans-serif)',
            textShadow: `0 0 10px ${THEME_ORANGE}40`,
          }}
        >
          {alt || 'UNTITLED'}
        </h3>
        <div 
          className="font-mono text-sm tracking-widest text-center whitespace-nowrap"
          style={{ color: THEME_WHITE }}
        >
          + {description} +
        </div>
      </div>
    </div>
  )
}