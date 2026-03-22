import { useState, useRef, useCallback, useEffect, memo, useMemo } from 'react'
import { mockPictures } from '@/data'
import InfinitePhotoWall from './InfinitePhotoWall'

interface DetailPhoto {
  id: string
  src: string
  title: string
  date: string
  description: string
}

// ===== 详情页组件，带进入和退出动画 =====
function DetailView({ photo, onClose }: { photo: DetailPhoto; onClose: () => void }) {
  const [isClosing, setIsClosing] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // 延迟显示内容，营造层次感
    const timer = setTimeout(() => setShowContent(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    if (isClosing) return
    setIsClosing(true)
    // 等待退出动画完成后再真正关闭
    setTimeout(() => {
      onClose()
    }, 400)
  }

  return (
    <div 
      className="fixed inset-0 z-[100]"
      style={{ 
        background: 'rgba(0,0,0,0)',
        cursor: 'default',
      }}
      onClick={handleClose}
    >
      {/* 背景遮罩 - 带淡入淡出 */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'rgba(0,0,0,0.92)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          animation: isClosing ? 'fadeOut 0.35s ease-out forwards' : 'fadeIn 0.35s ease-out',
        }}
      />
      
      {/* 放大的照片容器 */}
      <div 
        className="absolute"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 照片卡片 - 酷炫风格 */}
        <div 
          className="relative overflow-hidden"
          style={{ 
            width: 'min(85vw, 1200px)',
            animation: isClosing 
              ? 'scaleDown 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards' 
              : 'scaleUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both',
          }}
        >
          {/* 外层装饰边框 */}
          <div className="absolute inset-0 border-2 border-white/20 pointer-events-none z-20" />
          
          {/* 四角装饰 - 白色 */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white z-20" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white z-20" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white z-20" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white z-20" />

          {/* 顶部信息栏 - 黑色背景 */}
          <div 
            className="relative flex justify-between items-center px-5 py-4 bg-black"
            style={{
              opacity: showContent ? 1 : 0,
              transform: showContent ? 'translateY(0)' : 'translateY(-20px)',
              transition: 'opacity 0.4s ease-out 0.2s, transform 0.4s ease-out 0.2s',
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-[#FF4D00] font-mono font-bold text-sm tracking-wider">
                #{photo.id.padStart(3, '0')}
              </span>
              <div className="h-4 w-px bg-white/30" />
              <span className="text-white/60 font-mono text-xs tracking-widest">
                {photo.date}
              </span>
            </div>
            <div className="flex gap-1.5">
              <span className="w-2 h-4 bg-[#FF4D00] inline-block" />
              <span className="w-2 h-4 bg-white/40 inline-block" />
              <span className="w-2 h-4 bg-white/20 inline-block" />
            </div>
          </div>

          {/* 图片容器 */}
          <div className="relative overflow-hidden bg-zinc-900 flex items-center justify-center">
            {/* 加载占位符 */}
            <div className="absolute inset-0 bg-zinc-800 animate-pulse z-0" />
            
            <img 
              src={photo.src} 
              alt={photo.title} 
              onLoad={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.opacity = '1';
              }}
              className="w-full object-cover relative z-10"
              style={{ 
                height: 'min(65vh, 700px)',
                opacity: 0,
                transform: showContent ? 'scale(1)' : 'scale(1.1)',
                transition: 'opacity 0.6s ease-out, transform 0.8s ease-out',
              }}
            />
            
            {/* 渐变遮罩 - 底部 */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
            
            {/* 噪点纹理 - 使用预生成 Canvas 噪点 */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: NOISE_TEXTURE_URL,
                backgroundRepeat: 'repeat',
              }}
            />

            {/* 图片上的标题 */}
            <div 
              className="absolute bottom-6 left-6 right-6"
              style={{
                opacity: showContent ? 1 : 0,
                transform: showContent ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.5s ease-out 0.4s, transform 0.5s ease-out 0.4s',
              }}
            >
              <h2 className="text-4xl font-black text-white tracking-tight drop-shadow-lg" style={{ fontFamily: 'Archivo Black, sans-serif' }}>
                {photo.title}
              </h2>
            </div>
          </div>

          {/* 底部描述栏 - 深色背景 */}
          <div 
            className="relative px-6 py-5 bg-zinc-900"
            style={{
              opacity: isClosing ? 0 : showContent ? 1 : 0,
              transform: isClosing ? 'translateY(10px)' : showContent ? 'translateY(0)' : 'translateY(20px)',
              transition: isClosing 
                ? 'opacity 0.15s ease-out, transform 0.15s ease-out' 
                : 'opacity 0.5s ease-out 0.5s, transform 0.5s ease-out 0.5s',
            }}
          >
            {/* 从左往右填充的橙色线 */}
            <div 
              className="absolute top-0 left-0 h-0.5 bg-[#FF4D00]"
              style={{
                width: showContent ? '100%' : '0%',
                transition: 'width 0.8s ease-out 0.6s',
              }}
            />
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-1 h-full min-h-[40px] bg-[#FF4D00] rounded-full" />
              <p className="text-white/80 text-base leading-relaxed">
                {photo.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 动画样式 */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes scaleUp {
          from {
            opacity: 0;
            transform: scale(0.7) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes scaleDown {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.85);
          }
        }
      `}</style>
    </div>
  )
}

interface PhotoPosition {
  x: number
  y: number
  rotate: number
  size: number
  z: number
}

// 为20张照片生成随机布局
const generateLayouts = (count: number): PhotoPosition[] => {
  const layouts: PhotoPosition[] = []
  const usedPositions: Set<string> = new Set()
  
  for (let i = 0; i < count; i++) {
    let attempts = 0
    let x, y, key
    
    // 尝试找到一个不重叠的位置
    do {
      x = Math.floor(Math.random() * 75) + 12 // 12% - 87%
      y = Math.floor(Math.random() * 55) + 18 // 18% - 73%
      key = `${Math.floor(x / 8)}-${Math.floor(y / 10)}`
      attempts++
    } while (usedPositions.has(key) && attempts < 50)
    
    usedPositions.add(key)
    
    layouts.push({
      x,
      y,
      rotate: Math.floor(Math.random() * 30) - 15, // -15 到 15 度
      size: Math.floor(Math.random() * 40) + 130, // 130-170px
      z: i + 1,
    })
  }
  
  return layouts
}

const STORAGE_KEY = 'photo-wall-positions'
const photos = mockPictures // 使用全部20张照片
const INITIAL_LAYOUTS = generateLayouts(photos.length)

const loadInitialLayouts = (): PhotoPosition[] => {
  if (!STORAGE_KEY) return INITIAL_LAYOUTS
  // 已按需求临时注释本地位置恢复逻辑；恢复时取消下方注释即可。
  // if (typeof window === 'undefined') return INITIAL_LAYOUTS
  //
  // const saved = window.localStorage.getItem(STORAGE_KEY)
  // if (!saved) return INITIAL_LAYOUTS
  //
  // try {
  //   const parsed = JSON.parse(saved)
  //   if (Array.isArray(parsed) && parsed.length === INITIAL_LAYOUTS.length) {
  //     return parsed as PhotoPosition[]
  //   }
  // } catch {
  //   // 解析失败使用默认位置
  // }
  return INITIAL_LAYOUTS
}

// 用 Canvas 预生成静态噪点纹理（只计算一次），替代昂贵的 feTurbulence SVG 滤镜
const NOISE_TEXTURE_URL = (() => {
  if (typeof document === 'undefined') return ''
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  const imageData = ctx.createImageData(128, 128)
  for (let i = 0; i < imageData.data.length; i += 4) {
    const v = (Math.random() * 255) | 0
    imageData.data[i] = v
    imageData.data[i + 1] = v
    imageData.data[i + 2] = v
    imageData.data[i + 3] = 30
  }
  ctx.putImageData(imageData, 0, 0)
  return `url(${canvas.toDataURL('image/png')})`
})()

// ===== 独立 memo 化的照片卡片组件，自带本地 hover 状态 =====
interface PhotoCardProps {
  photo: (typeof photos)[0]
  index: number
  pos: PhotoPosition
  isDragging: boolean
  isVisible: boolean
  onMouseDown: (e: React.MouseEvent, index: number) => void
  onClickPhoto: (id: string) => void
  hasDraggedRef: React.MutableRefObject<boolean>
  photoRefSetter: (index: number, el: HTMLDivElement | null) => void
}

const PhotoCard = memo(function PhotoCard({
  photo, index, pos, isDragging, isVisible, onMouseDown, onClickPhoto, hasDraggedRef, photoRefSetter,
}: PhotoCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  void onMouseDown

  return (
    <div
      key={`${photo.id}-${index}`}
      ref={(el) => { photoRefSetter(index, el) }}
      className="absolute"
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        translate: isDragging ? 'var(--drag-x, 0px) var(--drag-y, 0px)' : '0px 0px',
        transform: `rotate(${pos.rotate}deg) scale(${isDragging ? 1.08 : isHovered ? 1.05 : isVisible ? 1 : 0.3})`,
        zIndex: isDragging ? 100 : pos.z,
        opacity: isVisible ? 1 : 0,
        contain: 'layout style paint',
        willChange: isDragging ? 'transform' : 'auto',
        transition: isDragging
          ? 'none'
          : isVisible
            ? 'opacity 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
            : 'none',
        cursor: isDragging ? 'grabbing' : 'grab',
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
      // 已按需求临时注释拖拽入口；恢复时取消下一行注释即可。
      // onMouseDown={(e) => onMouseDown(e, index)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (!hasDraggedRef.current) {
          onClickPhoto(photo.id)
        }
      }}
    >
      <div
        className="bg-white relative"
        style={{
          width: pos.size,
          padding: '6px',
          paddingBottom: '28px',
          border: isHovered || isDragging ? '2px solid #FF4D00' : '2px solid #000',
          boxShadow: isDragging
            ? '8px 8px 0px #FF4D00'
            : isHovered
              ? '6px 6px 0px #FF4D00'
              : '4px 4px 0px #000',
          transition: 'all 0.3s ease-out',
        }}
      >
        {/* 照片ID标签 */}
        <div
          className="absolute top-0 left-0 right-0 px-2 py-1 flex justify-between items-center z-10"
          style={{ mixBlendMode: 'difference' }}
        >
          <span className="text-[8px] font-mono text-white font-bold tracking-wider">
            IMG-{String(index + 1).padStart(3, '0')}
          </span>
          <div className="flex gap-0.5">
            <span className="w-0.5 h-2 bg-white inline-block" />
            <span className="w-0.5 h-2 bg-white inline-block" />
            <span className="w-0.5 h-2 bg-white inline-block" />
          </div>
        </div>

        {/* 十字准星 */}
        <div className={`absolute top-[4px] left-[4px] w-2.5 h-2.5 border-t-[2px] border-l-[2px] border-black transition-all duration-300 ${isHovered || isDragging ? 'border-[#FF4D00] scale-125' : ''}`}
          style={{ zIndex: 20 }} />
        <div className={`absolute top-[4px] right-[4px] w-2.5 h-2.5 border-t-[2px] border-r-[2px] border-black transition-all duration-300 ${isHovered || isDragging ? 'border-[#FF4D00] scale-125' : ''}`}
          style={{ zIndex: 20 }} />
        <div className={`absolute bottom-[24px] left-[4px] w-2.5 h-2.5 border-b-[2px] border-l-[2px] border-black transition-all duration-300 ${isHovered || isDragging ? 'border-[#FF4D00] scale-125' : ''}`}
          style={{ zIndex: 20 }} />
        <div className={`absolute bottom-[24px] right-[4px] w-2.5 h-2.5 border-b-[2px] border-r-[2px] border-black transition-all duration-300 ${isHovered || isDragging ? 'border-[#FF4D00] scale-125' : ''}`}
          style={{ zIndex: 20 }} />

        {/* 图片容器 */}
        <div
          className="overflow-hidden bg-zinc-900 relative"
          style={{ height: pos.size * 0.65 }}
        >
          <img
            src={photo.src}
            alt={photo.title}
            className="w-full h-full object-cover pointer-events-none"
            draggable={false}
            loading="lazy"
            style={{
              transform: 'scale(1)',
            }}
          />

          {/* 噪点纹理 - 合并为单层，使用预生成的 Canvas 噪点 */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: NOISE_TEXTURE_URL,
              backgroundRepeat: 'repeat',
            }}
          />
        </div>

        {/* 底部标题 */}
        <p
          className="text-[9px] text-center truncate px-1 mt-2 font-mono font-bold tracking-wider uppercase"
          style={{ color: isHovered || isDragging ? '#FF4D00' : '#666' }}
        >
          {photo.title}
        </p>
      </div>
    </div>
  )
})

export default function Pictures() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mode, setMode] = useState<'wall' | 'infinite'>('wall')
  // 已按需求临时注释 localStorage 读写；loadInitialLayouts 当前固定返回默认布局。
  const [positions, setPositions] = useState<PhotoPosition[]>(() => loadInitialLayouts())
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
  const [visibleCount, setVisibleCount] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragStartRef = useRef({ x: 0, y: 0, photoX: 0, photoY: 0, containerW: 0, containerH: 0 })
  const hasDraggedRef = useRef(false)
  const draggingPosRef = useRef<{ x: number; y: number } | null>(null)
  const latestMouseRef = useRef<{ x: number; y: number } | null>(null)
  const activeDragElRef = useRef<HTMLDivElement | null>(null)
  const photoRefs = useRef<(HTMLDivElement | null)[]>([])
  // 使用 ref 持有最新 positions，让 handleMouseDown 不依赖 positions state
  const positionsRef = useRef(positions)
  const selectedPhoto = useMemo(() => photos.find((p) => p.id === selectedId), [selectedId])

  // 在渲染后同步最新 positions，避免在 render 阶段写入 ref
  useEffect(() => {
    positionsRef.current = positions
  }, [positions])

  // 空闲时预热一次 rAF 管线，减少第一次拖拽时的启动抖动
  useEffect(() => {
    let idleId: number | null = null
    let timeoutId: number | null = null
    const g = globalThis as typeof globalThis & {
      requestIdleCallback?: (cb: IdleRequestCallback) => number
      cancelIdleCallback?: (id: number) => void
    }

    const warmup = () => {
      requestAnimationFrame(() => {
        // no-op: 仅用于预热浏览器动画帧调度链路
      })
    }

    if (g.requestIdleCallback) {
      idleId = g.requestIdleCallback(() => warmup())
    } else {
      timeoutId = setTimeout(warmup, 120)
    }

    return () => {
      if (idleId !== null && g.cancelIdleCallback) {
        g.cancelIdleCallback(idleId)
      }
      if (timeoutId !== null) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  // 已按需求临时注释位置持久化到 localStorage；恢复时取消整段注释即可。
  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     localStorage.setItem(STORAGE_KEY, JSON.stringify(positions))
  //   }, 500) // 延迟 500ms 保存
  //
  //   return () => clearTimeout(timeoutId)
  // }, [positions])

  // 照片逐个出现动画 - 使用单个 interval 代替 N 个 setTimeout
  useEffect(() => {
    let count = 0
    const interval = setInterval(() => {
      count++
      setVisibleCount(count)
      if (count >= photos.length) clearInterval(interval)
    }, 80)
    return () => clearInterval(interval)
  }, [])

  // 将百分比转换为像素（以左上角为基准）
  const percentToPx = useCallback((xPercent: number, yPercent: number) => {
    if (!containerRef.current) return { x: 0, y: 0 }
    const rect = containerRef.current.getBoundingClientRect()
    return {
      x: (xPercent / 100) * rect.width,
      y: (yPercent / 100) * rect.height,
    }
  }, [])

  // 处理拖拽开始 - 通过 positionsRef 读取位置，消除对 positions state 的依赖
  // 使回调引用稳定，避免所有 PhotoCard 因 onMouseDown 变化而重渲染
  const handleMouseDown = useCallback((e: React.MouseEvent, index: number) => {
    e.preventDefault()
    e.stopPropagation()
    
    const pos = positionsRef.current[index]
    const pxPos = percentToPx(pos.x, pos.y)
    const rect = containerRef.current?.getBoundingClientRect()
    const photoEl = photoRefs.current[index]
    if (photoEl) {
      activeDragElRef.current = photoEl
      photoEl.style.willChange = 'transform'
      photoEl.style.setProperty('--drag-x', '0px')
      photoEl.style.setProperty('--drag-y', '0px')
    }
    
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      photoX: pxPos.x,
      photoY: pxPos.y,
      containerW: rect?.width || window.innerWidth,
      containerH: rect?.height || window.innerHeight,
    }
    hasDraggedRef.current = false
    latestMouseRef.current = null
    draggingPosRef.current = null
    
    setDraggingIndex(index)
  }, [percentToPx])

  // photoRef setter 回调，稳定引用
  const photoRefSetter = useCallback((index: number, el: HTMLDivElement | null) => {
    photoRefs.current[index] = el
  }, [])

  // 选择照片回调
  const handleClickPhoto = useCallback((id: string) => {
    setSelectedId(id)
  }, [])

  // 全局鼠标事件 - 拖拽时只用 requestAnimationFrame + 直接 DOM 操作，不更新 React state
  useEffect(() => {
    if (draggingIndex === null) return
    
    const photoEl = photoRefs.current[draggingIndex]
    if (!photoEl || !containerRef.current) return
    
    let rafId: number | null = null

    const updateDragPosition = (mouseX: number, mouseY: number) => {
      const deltaX = mouseX - dragStartRef.current.x
      const deltaY = mouseY - dragStartRef.current.y

      // 如果移动超过 5px，认为是拖拽而非点击
      if (!hasDraggedRef.current && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
        hasDraggedRef.current = true
      }

      const newXPx = dragStartRef.current.photoX + deltaX
      const newYPx = dragStartRef.current.photoY + deltaY
      const containerW = dragStartRef.current.containerW || window.innerWidth
      const containerH = dragStartRef.current.containerH || window.innerHeight
      const clampedXPx = Math.max(0, Math.min(containerW * 0.95, newXPx))
      const clampedYPx = Math.max(0, Math.min(containerH * 0.9, newYPx))
      const nextX = (clampedXPx / containerW) * 100
      const nextY = (clampedYPx / containerH) * 100
      const offsetXPx = clampedXPx - dragStartRef.current.photoX
      const offsetYPx = clampedYPx - dragStartRef.current.photoY

      // 每帧只更新 transform 位移，尽量交给合成线程处理
      photoEl.style.setProperty('--drag-x', `${offsetXPx}px`)
      photoEl.style.setProperty('--drag-y', `${offsetYPx}px`)
      draggingPosRef.current = { x: nextX, y: nextY }
    }

    const dragTick = () => {
      const latestMouse = latestMouseRef.current
      if (latestMouse) {
        updateDragPosition(latestMouse.x, latestMouse.y)
      }
      rafId = requestAnimationFrame(dragTick)
    }

    // 事件只负责采样最新鼠标坐标，真正计算与写入放到 rAF 帧中
    const handleGlobalMouseMove = (e: MouseEvent) => {
      latestMouseRef.current = { x: e.clientX, y: e.clientY }
    }
    
    const handleGlobalMouseUp = () => {
      // 取消未执行的动画帧
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }

      const latestMouse = latestMouseRef.current
      if (latestMouse) {
        updateDragPosition(latestMouse.x, latestMouse.y)
      }
      
      // 拖拽结束，仅在实际拖动过时更新 positions state
      const finalPos = draggingPosRef.current
      if (finalPos) {
        setPositions(prev => {
          const next = [...prev]
          next[draggingIndex] = {
            ...next[draggingIndex],
            x: finalPos.x,
            y: finalPos.y,
            z: INITIAL_LAYOUTS[draggingIndex].z,
          }
          return next
        })
      }
      // 没有移动过则不需要更新 positions，避免不必要的 re-render
      draggingPosRef.current = null
      latestMouseRef.current = null
      setDraggingIndex(null)

      // 等待位置 state 提交并完成下一帧绘制后再清理偏移，避免松手回弹
      const activeDragEl = activeDragElRef.current
      if (activeDragEl) {
        requestAnimationFrame(() => {
          activeDragEl.style.setProperty('--drag-x', '0px')
          activeDragEl.style.setProperty('--drag-y', '0px')
          activeDragEl.style.willChange = 'auto'
          if (activeDragElRef.current === activeDragEl) {
            activeDragElRef.current = null
          }
        })
      }
    }

    rafId = requestAnimationFrame(dragTick)
    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true })
    window.addEventListener('mouseup', handleGlobalMouseUp)
    
    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
      photoEl.style.setProperty('--drag-x', '0px')
      photoEl.style.setProperty('--drag-y', '0px')
      photoEl.style.willChange = 'auto'
      if (activeDragElRef.current === photoEl) {
        activeDragElRef.current = null
      }
      window.removeEventListener('mousemove', handleGlobalMouseMove)
      window.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [draggingIndex])

  if (mode === 'infinite') {
    return (
      <div className="relative">
        <InfinitePhotoWall />
        <button
          className="fixed bottom-8 right-8 z-[200] px-5 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all duration-300 shadow-lg hover:scale-105 active:scale-95 backdrop-blur-sm"
          style={{
            background: 'rgba(255,77,0,0.9)',
            color: '#fff',
            border: '2px solid #fff',
          }}
          onClick={() => setMode('wall')}
        >
          ✦ GALLERY MODE
        </button>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className="h-screen w-screen overflow-hidden relative select-none"
      style={{ background: '#1c1c1c', cursor: draggingIndex !== null ? 'grabbing' : 'default' }}
    >
      {/* Mode toggle button */}
      <button
        className="fixed bottom-8 right-8 z-[200] px-5 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all duration-300 shadow-lg hover:scale-105 active:scale-95 backdrop-blur-sm"
        style={{
          background: 'rgba(255,77,0,0.9)',
          color: '#fff',
          border: '2px solid #fff',
        }}
        onClick={() => setMode('infinite')}
      >
        ∞ INFINITE SCROLL
      </button>

      {/* 背景 - 大面积橙色斜切块 */}
      <div className="absolute pointer-events-none"
        style={{
          top: '-20%',
          left: '-10%',
          width: '70%',
          height: '140%',
          background: 'linear-gradient(135deg, #FF4D00 0%, #FF6B2B 100%)',
          transform: 'skewX(-12deg)',
        }}
      />

      {/* 背景 - 橙色块上的纹理条纹 */}
      <div className="absolute pointer-events-none opacity-[0.08]"
        style={{
          top: '-20%',
          left: '-10%',
          width: '70%',
          height: '140%',
          transform: 'skewX(-12deg)',
          backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0,0,0,0.15) 40px, rgba(0,0,0,0.15) 41px)',
        }}
      />

      {/* GALLERY 水印 */}
      <div className="absolute bottom-6 right-8 pointer-events-none select-none">
        <span className="text-[8vw] font-bold tracking-tight text-white/[0.06]" style={{ fontFamily: 'Archivo Black' }}>
          GALLERY
        </span>
      </div>

      {/* 照片墙 - 使用 memo 化的 PhotoCard 组件 */}
      {photos.map((photo, i) => (
        <PhotoCard
          key={`${photo.id}-${i}`}
          photo={photo}
          index={i}
          pos={positions[i]}
          isDragging={draggingIndex === i}
          isVisible={i < visibleCount}
          onMouseDown={handleMouseDown}
          onClickPhoto={handleClickPhoto}
          hasDraggedRef={hasDraggedRef}
          photoRefSetter={photoRefSetter}
        />
      ))}

      {/* 详情查看 - 酷炫照片飞入效果 */}
      {selectedPhoto && (
        <DetailView 
          photo={selectedPhoto} 
          onClose={() => setSelectedId(null)} 
        />
      )}
    </div>
  )
}
