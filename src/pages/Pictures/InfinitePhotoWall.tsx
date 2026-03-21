import { useEffect, useRef, useCallback } from 'react'
import { mockPictures } from '@/data'
import gsap from 'gsap'

interface ImgData {
  node: HTMLDivElement
  x: number
  y: number
  movx: number
  movy: number
  ani: gsap.core.Tween | null
}

/* =========== Layout constants (design coord system, base = 1440px) =========== */
const PHOTO_W = 280
const PHOTO_H = 350
const GAP = 60
const COLS = 8       // viewport ≈ 4.2 photos wide → need 8 cols (余量充足)
const ROWS = 5       // viewport ≈ 2.2 photos tall → need 5 rows (余量充足)
const STANDARD_WIDTH = 1440

// ★ Grid period = COLS × (PHOTO_W + GAP), 保证首尾衔接处也有 GAP 间距
const GRID_W = COLS * (PHOTO_W + GAP)   // 8 × 340 = 2720
const GRID_H = ROWS * (PHOTO_H + GAP)   // 5 × 410 = 2050
// 验证: 2720 >= 1440 + 280 = 1720 ✓  |  2050 >= 900 + 350 = 1250 ✓

// Pre-compute each photo's initial position (absolute positioning)
const photoPositions = Array.from({ length: ROWS * COLS }, (_, i) => {
  const col = i % COLS
  const row = Math.floor(i / COLS)
  return {
    left: col * (PHOTO_W + GAP),
    top: row * (PHOTO_H + GAP),
  }
})

// Repeat mock photos to fill 40 slots
const allPhotos = (() => {
  const r: typeof mockPictures = []
  while (r.length < ROWS * COLS) r.push(...mockPictures)
  return r.slice(0, ROWS * COLS)
})()

/* =========== Marquee helpers =========== */
const repeat = (t: string, n: number) => Array(n).fill(t).join('')
const H_TEXT = repeat('→  DRAG  ', 40)
const H_TEXT_REV = repeat('←  DRAG  ', 40)
const V_TEXT = repeat('↓  DRAG  ', 30)
const V_TEXT_REV = repeat('↑  DRAG  ', 30)

const BORDER_SIZE = 40

export default function InfinitePhotoWall() {
  const containerRef = useRef<HTMLDivElement>(null)
  const zoomRef = useRef<HTMLDivElement>(null)      // zoom wrapper for drag scale effect
  const photosRef = useRef<HTMLDivElement>(null)     // inner grid (gets responsive scale)
  const borderRef = useRef<HTMLDivElement>(null)     // drag border overlay
  const imgDataRef = useRef<ImgData[]>([])
  const isDraggingRef = useRef(false)
  const mouseRef = useRef({ x: 0, y: 0 })
  const scaleRef = useRef(1)

  /* ---- Resize: responsive scale + center grid in viewport ---- */
  const resize = useCallback(() => {
    const photos = photosRef.current
    if (!photos) return

    const scale = document.body.offsetWidth / STANDARD_WIDTH
    scaleRef.current = scale
    photos.style.transform = `scale(${scale})`
    photos.style.transformOrigin = 'top left'

    // ★ Center the grid: shift the container so the grid center = viewport center
    // offsetX/Y are in screen px (CSS layout coords, before the scale transform)
    const offsetX = window.innerWidth / 2 - (GRID_W / 2) * scale
    const offsetY = window.innerHeight / 2 - (GRID_H / 2) * scale
    photos.style.left = `${offsetX}px`
    photos.style.top = `${offsetY}px`

    // Collect DOM nodes & assign known positions (in design coords within the grid)
    const items = photos.querySelectorAll<HTMLDivElement>('.photo-item')
    imgDataRef.current = Array.from(items).map((node, i) => ({
      node,
      x: photoPositions[i].left,
      y: photoPositions[i].top,
      movx: 0,
      movy: 0,
      ani: null,
    }))

    // Reset all photo transforms
    imgDataRef.current.forEach(img => {
      gsap.set(img.node, { x: 0, y: 0 })
    })
  }, [])

  /* ---- Core move logic with teleportation ---- */
  const move = useCallback((clientX: number, clientY: number) => {
    const dx = (clientX - mouseRef.current.x) / scaleRef.current
    const dy = (clientY - mouseRef.current.y) / scaleRef.current
    mouseRef.current = { x: clientX, y: clientY }

    imgDataRef.current.forEach(img => {
      let duration = 1
      img.movx += dx
      img.movy += dy

      // Horizontal teleport
      if (img.movx + img.x > GRID_W) {
        img.movx -= GRID_W
        duration = 0
      }
      if (img.movx + img.x < -PHOTO_W) {
        img.movx += GRID_W
        duration = 0
      }
      // Vertical teleport
      if (img.movy + img.y > GRID_H) {
        img.movy -= GRID_H
        duration = 0
      }
      if (img.movy + img.y < -PHOTO_H) {
        img.movy += GRID_H
        duration = 0
      }

      if (img.ani) img.ani.kill()
      img.ani = gsap.to(img.node, {
        x: img.movx,
        y: img.movy,
        duration,
        ease: 'power4.out',
      })
    })
  }, [])

  /* ---- Show DRAG border + zoom out (spring animation) ---- */
  const showDragBorder = useCallback(() => {
    const border = borderRef.current
    const zoom = zoomRef.current
    if (!border || !zoom) return

    // Make border visible
    gsap.set(border, { display: 'block' })

    // Animate each strip IN with a spring-like bounce
    const strips = border.querySelectorAll<HTMLDivElement>('.drag-strip')
    strips.forEach(strip => {
      const isHorizontal = strip.dataset.dir === 'h'
      gsap.fromTo(strip,
        { [isHorizontal ? 'scaleY' : 'scaleX']: 0, opacity: 0 },
        { [isHorizontal ? 'scaleY' : 'scaleX']: 1, opacity: 1, duration: 0.45, ease: 'back.out(2.5)' }
      )
    })

    // Animate corner badges
    const corners = border.querySelectorAll<HTMLDivElement>('.drag-corner')
    gsap.fromTo(corners, { scale: 0 }, { scale: 1, duration: 0.35, ease: 'back.out(3)', stagger: 0.04 })

    // Zoom out content
    gsap.to(zoom, { scale: 0.92, duration: 0.5, ease: 'power3.out' })
  }, [])

  /* ---- Hide DRAG border + zoom back ---- */
  const hideDragBorder = useCallback(() => {
    const border = borderRef.current
    const zoom = zoomRef.current
    if (!border || !zoom) return

    const strips = border.querySelectorAll<HTMLDivElement>('.drag-strip')
    strips.forEach(strip => {
      const isHorizontal = strip.dataset.dir === 'h'
      gsap.to(strip, {
        [isHorizontal ? 'scaleY' : 'scaleX']: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      })
    })

    const corners = border.querySelectorAll<HTMLDivElement>('.drag-corner')
    gsap.to(corners, { scale: 0, duration: 0.25, ease: 'power2.in' })

    // Zoom content back
    gsap.to(zoom, { scale: 1, duration: 0.4, ease: 'power2.out' })

    // Hide border container after animation
    gsap.delayedCall(0.35, () => gsap.set(border, { display: 'none' }))
  }, [])

  /* ---- Lifecycle ---- */
  useEffect(() => {
    const timer = setTimeout(resize, 100)
    window.addEventListener('resize', resize)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', resize)
    }
  }, [resize])

  /* ---- Mouse Events ---- */
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDraggingRef.current = true
    mouseRef.current = { x: e.clientX, y: e.clientY }
    if (containerRef.current) containerRef.current.style.cursor = 'grabbing'
    showDragBorder()
  }, [showDragBorder])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingRef.current) return
    move(e.clientX, e.clientY)
  }, [move])

  const handleMouseUp = useCallback(() => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    if (containerRef.current) containerRef.current.style.cursor = 'grab'
    hideDragBorder()
  }, [hideDragBorder])

  /* ---- Touch Events ---- */
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    isDraggingRef.current = true
    const t = e.touches[0]
    mouseRef.current = { x: t.clientX, y: t.clientY }
    showDragBorder()
  }, [showDragBorder])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDraggingRef.current) return
    const t = e.touches[0]
    move(t.clientX, t.clientY)
  }, [move])

  const handleTouchEnd = useCallback(() => {
    isDraggingRef.current = false
    hideDragBorder()
  }, [hideDragBorder])

  return (
    <div
      ref={containerRef}
      className="h-screen w-screen overflow-hidden relative select-none"
      style={{ background: '#1c1c1c', cursor: 'grab' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ===== Zoom wrapper — scales down on drag ===== */}
      <div
        ref={zoomRef}
        className="w-full h-full"
        style={{ transformOrigin: 'center center' }}
      >
        {/* ===== Photos grid (responsive scale + centered via JS) ===== */}
        <div
          ref={photosRef}
          className="absolute"
          style={{ width: `${GRID_W}px`, height: `${GRID_H}px` }}
        >
          {allPhotos.map((photo, i) => (
            <div
              key={i}
              className="photo-item absolute rounded-2xl overflow-hidden"
              style={{
                width: `${PHOTO_W}px`,
                height: `${PHOTO_H}px`,
                left: `${photoPositions[i].left}px`,
                top: `${photoPositions[i].top}px`,
                willChange: 'transform',
              }}
            >
              <img
                src={photo.src}
                alt={photo.title}
                className="w-full h-full object-cover pointer-events-none"
                draggable={false}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ===== DRAG Border Overlay (hidden by default, animated by GSAP) ===== */}
      <div ref={borderRef} className="absolute inset-0 pointer-events-none z-50" style={{ display: 'none' }}>

        {/* Top strip */}
        <div
          className="drag-strip absolute top-0 left-0 right-0 overflow-hidden flex items-center"
          data-dir="h"
          style={{ height: BORDER_SIZE, background: '#7FFF00', transformOrigin: 'top center' }}
        >
          <div
            className="whitespace-nowrap font-black text-base tracking-widest"
            style={{ color: '#000', animation: 'marquee-left 10s linear infinite' }}
          >
            {H_TEXT_REV}
          </div>
        </div>

        {/* Bottom strip */}
        <div
          className="drag-strip absolute bottom-0 left-0 right-0 overflow-hidden flex items-center"
          data-dir="h"
          style={{ height: BORDER_SIZE, background: '#7FFF00', transformOrigin: 'bottom center' }}
        >
          <div
            className="whitespace-nowrap font-black text-base tracking-widest"
            style={{ color: '#000', animation: 'marquee-right 10s linear infinite' }}
          >
            {H_TEXT}
          </div>
        </div>

        {/* Left strip */}
        <div
          className="drag-strip absolute top-0 left-0 bottom-0 overflow-hidden flex justify-center"
          data-dir="v"
          style={{ width: BORDER_SIZE, background: '#7FFF00', transformOrigin: 'center left' }}
        >
          <div
            className="font-black text-base tracking-widest"
            style={{
              color: '#000',
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              whiteSpace: 'nowrap',
              animation: 'marquee-up 10s linear infinite',
            }}
          >
            {V_TEXT_REV}
          </div>
        </div>

        {/* Right strip */}
        <div
          className="drag-strip absolute top-0 right-0 bottom-0 overflow-hidden flex justify-center"
          data-dir="v"
          style={{ width: BORDER_SIZE, background: '#7FFF00', transformOrigin: 'center right' }}
        >
          <div
            className="font-black text-base tracking-widest"
            style={{
              color: '#000',
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              whiteSpace: 'nowrap',
              animation: 'marquee-down 10s linear infinite',
            }}
          >
            {V_TEXT}
          </div>
        </div>

        {/* Corner badges */}
        {([
          { top: 0, left: 0, label: '↖' },
          { top: 0, right: 0, label: '↗' },
          { bottom: 0, left: 0, label: '↙' },
          { bottom: 0, right: 0, label: '↘' },
        ] as const).map((c, i) => (
          <div
            key={i}
            className="drag-corner absolute flex items-center justify-center font-black text-sm"
            style={{
              width: BORDER_SIZE,
              height: BORDER_SIZE,
              background: '#7FFF00',
              color: '#000',
              zIndex: 10,
              top: 'top' in c ? c.top : undefined,
              bottom: 'bottom' in c ? c.bottom : undefined,
              left: 'left' in c ? c.left : undefined,
              right: 'right' in c ? c.right : undefined,
            }}
          >
            {c.label}
          </div>
        ))}
      </div>

      {/* ===== Keyframes ===== */}
      <style>{`
        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @keyframes marquee-up {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes marquee-down {
          0%   { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}