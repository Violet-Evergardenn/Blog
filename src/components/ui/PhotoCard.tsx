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

export default function PhotoCard({ src, alt, description, width, height, left, top, onClick, isActive = false }: PhotoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const scanlineRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  
  // Generate a random ID for the brutalist aesthetic
  const [photoId] = useState(() => `IMG-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`)

  const handleMouseEnter = () => {
    if (isActive) return
    setIsHovered(true)
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        scale: 1.05,
        duration: 0.5,
        ease: 'power3.out',
      })
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
    setIsHovered(false)
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        scale: 1,
        duration: 0.5,
        ease: 'power3.out',
      })
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
      className={`photo-item absolute cursor-pointer bg-black group ${isActive ? 'z-50' : 'z-10'}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        left: `${left}px`,
        top: `${top}px`,
        willChange: 'transform, box-shadow, border-color',
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
          style={{ 
            transformOrigin: 'center center',
          }}
        />
        
        {/* Noise Overlay */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Scanning Line */}
        <div 
          ref={scanlineRef}
          className={`absolute left-0 right-0 h-16 pointer-events-none z-10 ${isActive ? 'opacity-0' : 'opacity-0 group-hover:opacity-30'}`}
          style={{
            background: `linear-gradient(to bottom, transparent, ${THEME_ORANGE}, transparent)`,
          }}
        />
        
        {/* Brutalist Crosshairs */}
        <div className={`absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-white mix-blend-difference opacity-70 transition-all duration-300 ${isActive ? 'scale-125 border-orange-500' : 'group-hover:scale-125 group-hover:border-orange-500'}`} />
        <div className={`absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-white mix-blend-difference opacity-70 transition-all duration-300 ${isActive ? 'scale-125 border-orange-500' : 'group-hover:scale-125 group-hover:border-orange-500'}`} />
        <div className={`absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-white mix-blend-difference opacity-70 transition-all duration-300 ${isActive ? 'scale-125 border-orange-500' : 'group-hover:scale-125 group-hover:border-orange-500'}`} />
        <div className={`absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-white mix-blend-difference opacity-70 transition-all duration-300 ${isActive ? 'scale-125 border-orange-500' : 'group-hover:scale-125 group-hover:border-orange-500'}`} />

        {/* Corner Ribbon - Moved inside overflow-hidden container */}
        <div 
          className="absolute -right-10 top-6 w-32 py-1 text-center rotate-45 z-30 transition-transform duration-500 ease-out"
          style={{ 
            backgroundColor: THEME_ORANGE, 
            color: THEME_BLACK,
            transform: (isHovered || isActive) ? 'translateY(0) rotate(45deg)' : 'translateY(-250%) rotate(45deg)',
          }}
        >
          <span className="text-[10px] font-black font-mono uppercase tracking-widest">FOCUS</span>
        </div>
      </div>

      {/* Top Tech Bar */}
      <div 
        className="absolute top-0 left-0 right-0 px-3 py-2 flex justify-between items-center z-10 mix-blend-difference"
      >
        <span className="text-[10px] font-mono text-white font-bold tracking-widest">
          {photoId}
        </span>
        <div className="flex gap-1">
          <span className="w-1 h-3 bg-white inline-block animate-pulse" style={{ animationDelay: '0ms' }}></span>
          <span className="w-1 h-3 bg-white inline-block animate-pulse" style={{ animationDelay: '150ms' }}></span>
          <span className="w-1 h-3 bg-white inline-block animate-pulse" style={{ animationDelay: '300ms' }}></span>
        </div>
      </div>

      {/* Description overlay - Hidden when active */}
      <div
        ref={overlayRef}
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
          {/* Description is hidden in normal state, only shown when clicked */}
        </div>
      </div>

      {/* Expanded Article Description - Visible only when active, floating below image */}
      <div 
        className={`absolute top-full left-1/2 -translate-x-1/2 w-[200%] pt-8 flex flex-col items-center justify-center pointer-events-none`}
        style={{
          opacity: isActive ? 1 : 0,
          transform: isActive ? 'translateY(0)' : 'translateY(-10px)',
          transition: isActive ? 'all 0.5s ease-out 0.3s' : 'none', // Only animate when opening, instant hide when closing
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
