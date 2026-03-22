import { useEffect, useRef, useCallback, useState } from 'react'
import { mockPictures } from '@/data'
import gsap from 'gsap'
import PhotoCard from '@/components/ui/PhotoCard'

interface ImgData {
  node: HTMLDivElement
  x: number
  y: number
  movx: number
  movy: number
  ani: gsap.core.Tween | null
}

// Theme colors
const THEME_ORANGE = '#FF4D00'
const THEME_BLACK = '#000000'

/* =========== Layout constants (design coord system, base = 1440px) =========== */
const PHOTO_W = 350
const PHOTO_H = 450
const GAP = 100
const COLS = 5       // 横向5个
const ROWS = 4       // 竖向4个
const STANDARD_WIDTH = 1440

// ★ Grid period = COLS × (PHOTO_W + GAP), 保证首尾衔接处也有 GAP 间距
const GRID_W = COLS * (PHOTO_W + GAP)   // 5 × 340 = 1700
const GRID_H = ROWS * (PHOTO_H + GAP)   // 4 × 420 = 1680
// 验证: 1700 >= 1440 + 280 = 1720 (接近)  |  1680 >= 900 + 360 = 1260 ✓

// Pre-compute each photo's initial position (absolute positioning)
const photoPositions = Array.from({ length: ROWS * COLS }, (_, i) => {
  const col = i % COLS
  const row = Math.floor(i / COLS)
  return {
    left: col * (PHOTO_W + GAP),
    top: row * (PHOTO_H + GAP),
  }
})

// Use exactly 20 photos for 5x4 grid
const allPhotos = mockPictures.slice(0, ROWS * COLS)

/* =========== Marquee helpers =========== */
const repeat = (t: string, n: number) => Array(n).fill(t).join('')
const H_TEXT = repeat('→  DRAG  ', 40)
const H_TEXT_REV = repeat('←  DRAG  ', 40)
const V_TEXT = repeat('↓  DRAG  ', 30)
const V_TEXT_REV = repeat('↑  DRAG  ', 30)

const BORDER_SIZE = 60

export default function InfinitePhotoWall() {
  const containerRef = useRef<HTMLDivElement>(null)
  const zoomRef = useRef<HTMLDivElement>(null)      // zoom wrapper for drag scale effect
  const photosRef = useRef<HTMLDivElement>(null)     // inner grid (gets responsive scale)
  const borderRef = useRef<HTMLDivElement>(null)     // drag border overlay
  const imgDataRef = useRef<ImgData[]>([])
  const isDraggingRef = useRef(false)
  const mouseRef = useRef({ x: 0, y: 0 })
  const dragStartRef = useRef({ x: 0, y: 0 }) // Track drag distance to prevent accidental clicks
  const scaleRef = useRef(1)
  
  // State for active photo
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const activeIndexRef = useRef<number | null>(null)
  const activePhotoRef = useRef<HTMLDivElement | null>(null)
  
  // Ref to track if exit animation is in progress
  const exitAnimatingRef = useRef(false)
  
  // Sync activeIndex with ref for latest value access
  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  /* ---- Resize: responsive scale + center grid in viewport ---- */
  const resize = useCallback(() => {
    const photos = photosRef.current
    if (!photos) return

    const scale = document.body.offsetWidth / STANDARD_WIDTH
    scaleRef.current = scale

    // ★ Center the grid using transform (single property change to prevent flicker)
    const offsetX = window.innerWidth / 2 - (GRID_W / 2) * scale
    const offsetY = window.innerHeight / 2 - (GRID_H / 2) * scale
    photos.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`
    photos.style.transformOrigin = 'top left'

    // Collect DOM nodes & assign known positions (in design coords within the grid)
    const items = photos.querySelectorAll<HTMLDivElement>('.photo-item')
    
    // Only initialize positions if it's the first time
    if (imgDataRef.current.length === 0) {
      imgDataRef.current = Array.from(items).map((node, i) => ({
        node,
        x: photoPositions[i].left,
        y: photoPositions[i].top,
        movx: 0,
        movy: 0,
        ani: null,
      }))
      
      // Reset all photo transforms initially
      imgDataRef.current.forEach(img => {
        gsap.set(img.node, { x: 0, y: 0 })
      })
    } else {
      // Just update the DOM nodes in case they changed, but keep movx/movy
      Array.from(items).forEach((node, i) => {
        if (imgDataRef.current[i]) {
          imgDataRef.current[i].node = node
        }
      })
    }
  }, []) // Removed activeIndex dependency so it doesn't reset on click

  /* ---- Core move logic with teleportation ---- */
  const move = useCallback((clientX: number, clientY: number) => {
    if (activeIndex !== null) return // Disable move when a photo is active
    if (exitAnimatingRef.current) return // Disable move during exit animation
    
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
  }, [activeIndex])

  /* ---- Show DRAG border + zoom out (spring animation) ---- */
  const showDragBorder = useCallback(() => {
    if (activeIndex !== null) return // Disable drag border when a photo is active
    
    const border = borderRef.current
    const zoom = zoomRef.current
    if (!border || !zoom) return

    // Make border visible if not already
    if (border.style.display !== 'block') {
      gsap.set(border, { display: 'block' })
    }

    // Kill any ongoing exit animations to prevent conflict
    const strips = border.querySelectorAll<HTMLDivElement>('.drag-strip')
    strips.forEach(strip => gsap.killTweensOf(strip))
    const corners = border.querySelectorAll<HTMLDivElement>('.drag-corner')
    corners.forEach(corner => gsap.killTweensOf(corner))
    gsap.killTweensOf(zoom)

    // Animate each strip IN with a spring-like bounce (delay 0.1s)
    strips.forEach(strip => {
      const isHorizontal = strip.dataset.dir === 'h'
      gsap.fromTo(strip,
        { [isHorizontal ? 'scaleY' : 'scaleX']: 0, opacity: 0 },
        { [isHorizontal ? 'scaleY' : 'scaleX']: 1, opacity: 1, duration: 0.45, delay: 0.1, ease: 'back.out(2.5)' }
      )
    })

    // Animate corner badges (delay 0.1s)
    gsap.fromTo(corners, { scale: 0 }, { scale: 1, duration: 0.35, delay: 0.1, ease: 'back.out(3)', stagger: 0.04 })

    // Zoom out content (delay 0.1s)
    gsap.to(zoom, { scale: 0.85, duration: 0.5, delay: 0.1, ease: 'power3.out' })
  }, [activeIndex])

  /* ---- Hide DRAG border + zoom back ---- */
  const hideDragBorder = useCallback(() => {
    if (activeIndex !== null) return // Disable drag border when a photo is active
    
    const border = borderRef.current
    const zoom = zoomRef.current
    if (!border || !zoom) return

    // Kill any ongoing animations to allow smooth exit
    const strips = border.querySelectorAll<HTMLDivElement>('.drag-strip')
    strips.forEach(strip => gsap.killTweensOf(strip))
    const corners = border.querySelectorAll<HTMLDivElement>('.drag-corner')
    corners.forEach(corner => gsap.killTweensOf(corner))
    gsap.killTweensOf(zoom)

    // Animate strips OUT smoothly
    strips.forEach(strip => {
      const isHorizontal = strip.dataset.dir === 'h'
      gsap.to(strip, {
        [isHorizontal ? 'scaleY' : 'scaleX']: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      })
    })

    // Animate corners OUT
    gsap.to(corners, { scale: 0, duration: 0.25, ease: 'power2.in' })

    // Zoom content back smoothly
    gsap.to(zoom, { scale: 1, duration: 0.4, ease: 'power2.out' })

    // Hide border container after animation completes
    gsap.delayedCall(0.35, () => {
      gsap.set(border, { display: 'none' })
    })
  }, [activeIndex])

  /* ---- Handle Container Click (Close Active Photo) ---- */
  const handleContainerClick = useCallback(() => {
    // When active, ANY click should close the detail view (including clicking on photo)
    if (activeIndex === null) return
    
    // Prevent closing if already animating exit
    if (exitAnimatingRef.current) return

    const photos = photosRef.current
    if (!photos) return

    const items = photos.querySelectorAll<HTMLDivElement>('.photo-item')
    const targetNode = items[activeIndex]
    const imgData = imgDataRef.current[activeIndex]

    if (!targetNode || !imgData) return

    // Get return position (original position before opening detail)
    const returnX = parseFloat(targetNode.dataset.returnX || '0')
    const returnY = parseFloat(targetNode.dataset.returnY || '0')

    // IMMEDIATELY clear active index so text disappears instantly
    setActiveIndex(null)
    activePhotoRef.current = null
    
    // Mark exit animation as in progress
    exitAnimatingRef.current = true

    // Animate target photo back to original position
    if (imgData.ani) imgData.ani.kill()
    gsap.to(targetNode, {
      x: returnX,
      y: returnY,
      scale: 1,
      zIndex: 10,
      duration: 0.6,
      ease: 'power4.out',
      onComplete: () => {
        // Reset imgData to original position so drag works correctly
        imgData.movx = returnX
        imgData.movy = returnY
        // Allow drag after exit animation completes
        exitAnimatingRef.current = false
      }
    })

    // Animate other photos back in
    imgDataRef.current.forEach((img, i) => {
      if (i !== activeIndex) {
        if (img.ani) img.ani.kill()
        gsap.to(img.node, {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          delay: 0.1,
          ease: 'power3.out'
        })
      }
    })
  }, [activeIndex])

  /* ---- Handle Photo Click ---- */
  const handlePhotoClick = useCallback((index: number, _e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent click if user was dragging
    const dx = Math.abs(_e.clientX - dragStartRef.current.x)
    const dy = Math.abs(_e.clientY - dragStartRef.current.y)
    if (dx > 5 || dy > 5) return

    // Prevent opening new photo during exit animation
    if (exitAnimatingRef.current) return

    // If any photo is active, clicking anywhere should close it (handled by container click)
    // We don't need special handling here anymore
    if (activeIndex !== null) {
      return
    }

    const photos = photosRef.current
    if (!photos) return

    const items = photos.querySelectorAll<HTMLDivElement>('.photo-item')
    const targetNode = items[index]
    const imgData = imgDataRef.current[index]
    
    if (!targetNode || !imgData) return

    setActiveIndex(index)
    activePhotoRef.current = targetNode

    // Calculate center position relative to the grid
    // We need to find the center of the viewport in the grid's coordinate system
    const scale = scaleRef.current
    const offsetX = window.innerWidth / 2 - (GRID_W / 2) * scale
    const offsetY = window.innerHeight / 2 - (GRID_H / 2) * scale
    
    const viewportCenterX = (window.innerWidth / 2 - offsetX) / scale
    const viewportCenterY = (window.innerHeight / 2 - offsetY) / scale

    // Calculate the target x/y to move the photo to the center
    // We need to account for the photo's original position (imgData.x, imgData.y)
    // Shift the target Y up slightly to make room for the text below
    const targetX = viewportCenterX - imgData.x - (PHOTO_W / 2)
    const targetY = viewportCenterY - imgData.y - (PHOTO_H / 2) - 60 // Shift up by 60px

    // Animate other photos out
    imgDataRef.current.forEach((img, i) => {
      if (i !== index) {
        if (img.ani) img.ani.kill()
        gsap.to(img.node, {
          opacity: 0,
          scale: 0.8,
          duration: 0.4,
          ease: 'power3.inOut'
        })
      }
    })

    // Animate target photo to center and scale up
    if (imgData.ani) imgData.ani.kill()
    
    // Save current position for returning later (before any animation changes it)
    // This ensures we return to the exact position where the photo was before opening
    const currentX = imgData.movx
    const currentY = imgData.movy
    targetNode.dataset.returnX = currentX.toString()
    targetNode.dataset.returnY = currentY.toString()

    gsap.to(targetNode, {
      x: targetX,
      y: targetY,
      scale: 1.2, // Scale up the active photo
      zIndex: 50,
      duration: 0.6,
      ease: 'power4.out',
      onComplete: () => {
        // Update imgData to reflect new position so it doesn't jump if we drag later
        imgData.movx = targetX
        imgData.movy = targetY
      }
    })
  }, [activeIndex])

  /* ---- Lifecycle ---- */
  useEffect(() => {
    // Call resize immediately to set initial position without delay
    resize()
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [resize])

  /* ---- Mouse Events ---- */
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (activeIndex !== null) {
      // When photo is active, just record mouse position for next drag
      // Don't start dragging
      mouseRef.current = { x: e.clientX, y: e.clientY }
      dragStartRef.current = { x: e.clientX, y: e.clientY }
      return
    }
    isDraggingRef.current = true
    mouseRef.current = { x: e.clientX, y: e.clientY }
    dragStartRef.current = { x: e.clientX, y: e.clientY }
    if (containerRef.current) containerRef.current.style.cursor = 'grabbing'
    showDragBorder()
  }, [showDragBorder, activeIndex])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingRef.current || activeIndex !== null) return
    move(e.clientX, e.clientY)
  }, [move, activeIndex])

  const handleMouseUp = useCallback(() => {
    // Always reset cursor and hide border, even if not dragging
    if (containerRef.current) containerRef.current.style.cursor = activeIndex !== null ? 'default' : 'grab'
    hideDragBorder()
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
  }, [hideDragBorder, activeIndex])

  /* ---- Touch Events ---- */
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (activeIndex !== null) return
    isDraggingRef.current = true
    const t = e.touches[0]
    mouseRef.current = { x: t.clientX, y: t.clientY }
    dragStartRef.current = { x: t.clientX, y: t.clientY }
    showDragBorder()
  }, [showDragBorder, activeIndex])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDraggingRef.current || activeIndex !== null) return
    const t = e.touches[0]
    move(t.clientX, t.clientY)
  }, [move, activeIndex])

  const handleTouchEnd = useCallback(() => {
    isDraggingRef.current = false
    hideDragBorder()
  }, [hideDragBorder])

  return (
    <div
      ref={containerRef}
      className="h-screen w-screen overflow-hidden relative select-none"
      style={{ background: THEME_BLACK, cursor: activeIndex !== null ? 'default' : 'grab' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleContainerClick}
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
            <PhotoCard
              key={i}
              src={photo.src}
              alt={photo.title}
              description={photo.description}
              width={PHOTO_W}
              height={PHOTO_H}
              left={photoPositions[i].left}
              top={photoPositions[i].top}
              onClick={(e) => handlePhotoClick(i, e)}
              isActive={activeIndex === i}
            />
          ))}
        </div>
      </div>

      {/* ===== DRAG Border Overlay (hidden by default, animated by GSAP) ===== */}
      <div ref={borderRef} className="absolute inset-0 pointer-events-none z-50" style={{ display: 'none' }}>

        {/* Top strip */}
        <div
          className="drag-strip absolute top-0 left-0 right-0 overflow-hidden flex items-center"
          data-dir="h"
          style={{ height: BORDER_SIZE, background: THEME_ORANGE, transformOrigin: 'top center' }}
        >
          <div
            className="whitespace-nowrap font-black text-2xl tracking-widest"
            style={{ color: THEME_BLACK, animation: 'marquee-left 10s linear infinite', fontFamily: 'Archivo Black, sans-serif' }}
          >
            {H_TEXT_REV}
          </div>
        </div>

        {/* Bottom strip */}
        <div
          className="drag-strip absolute bottom-0 left-0 right-0 overflow-hidden flex items-center"
          data-dir="h"
          style={{ height: BORDER_SIZE, background: THEME_ORANGE, transformOrigin: 'bottom center' }}
        >
          <div
            className="whitespace-nowrap font-black text-2xl tracking-widest"
            style={{ color: THEME_BLACK, animation: 'marquee-right 10s linear infinite', fontFamily: 'Archivo Black, sans-serif' }}
          >
            {H_TEXT}
          </div>
        </div>

        {/* Left strip */}
        <div
          className="drag-strip absolute top-0 left-0 bottom-0 overflow-hidden flex justify-center"
          data-dir="v"
          style={{ width: BORDER_SIZE, background: THEME_ORANGE, transformOrigin: 'center left' }}
        >
          <div
            className="font-black text-2xl tracking-widest"
            style={{
              color: THEME_BLACK,
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              whiteSpace: 'nowrap',
              animation: 'marquee-up 10s linear infinite',
              fontFamily: 'Archivo Black, sans-serif',
            }}
          >
            {V_TEXT_REV}
          </div>
        </div>

        {/* Right strip */}
        <div
          className="drag-strip absolute top-0 right-0 bottom-0 overflow-hidden flex justify-center"
          data-dir="v"
          style={{ width: BORDER_SIZE, background: THEME_ORANGE, transformOrigin: 'center right' }}
        >
          <div
            className="font-black text-2xl tracking-widest"
            style={{
              color: THEME_BLACK,
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              whiteSpace: 'nowrap',
              animation: 'marquee-down 10s linear infinite',
              fontFamily: 'Archivo Black, sans-serif',
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
            className="drag-corner absolute flex items-center justify-center font-black text-lg"
            style={{
              width: BORDER_SIZE,
              height: BORDER_SIZE,
              background: THEME_ORANGE,
              color: THEME_BLACK,
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