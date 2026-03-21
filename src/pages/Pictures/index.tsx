import { useState } from 'react'
import { mockPictures } from '@/data'
import InfinitePhotoWall from './InfinitePhotoWall'

const photoLayouts = [
  { top: '15%', left: '32%', rotate: -12, size: 155, z: 3 },
  { top: '13%', left: '50%', rotate: 8, size: 145, z: 5 },
  { top: '17%', left: '66%', rotate: -4, size: 135, z: 4 },
  { top: '23%', left: '18%', rotate: -18, size: 150, z: 2 },
  { top: '27%', left: '38%', rotate: 6, size: 170, z: 8 },
  { top: '25%', left: '55%', rotate: -9, size: 145, z: 6 },
  { top: '21%', left: '76%', rotate: 14, size: 140, z: 7 },
  { top: '39%', left: '8%', rotate: 10, size: 155, z: 1 },
  { top: '43%', left: '28%', rotate: -7, size: 175, z: 10 },
  { top: '41%', left: '48%', rotate: 12, size: 150, z: 9 },
  { top: '37%', left: '68%', rotate: -15, size: 160, z: 11 },
  { top: '55%', left: '15%', rotate: 5, size: 150, z: 12 },
  { top: '59%', left: '35%', rotate: -10, size: 165, z: 14 },
  { top: '57%', left: '55%', rotate: 8, size: 145, z: 13 },
  { top: '53%', left: '74%', rotate: -6, size: 155, z: 15 },
  { top: '69%', left: '24%', rotate: 14, size: 150, z: 16 },
  { top: '71%', left: '46%', rotate: -11, size: 160, z: 17 },
  { top: '67%', left: '65%', rotate: 7, size: 145, z: 18 },
]

const photos = [...mockPictures, ...mockPictures, ...mockPictures, ...mockPictures].slice(0, photoLayouts.length)

export default function Pictures() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mode, setMode] = useState<'wall' | 'infinite'>('wall')
  const selectedPhoto = photos.find((p) => p.id === selectedId)

  if (mode === 'infinite') {
    return (
      <div className="relative">
        <InfinitePhotoWall />
        {/* Mode toggle button — bottom-right corner */}
        <button
          className="fixed bottom-8 right-8 z-[200] px-5 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all duration-300 shadow-lg hover:scale-105 active:scale-95 backdrop-blur-sm"
          style={{
            background: 'rgba(127,255,0,0.9)',
            color: '#000',
            border: '2px solid #000',
          }}
          onClick={() => setMode('wall')}
        >
          ✦ GALLERY MODE
        </button>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen overflow-hidden relative"
      style={{ background: '#1c1c1c' }}>

      {/* Mode toggle button — bottom-right corner */}
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

      {photos.map((photo, i) => {
        const l = photoLayouts[i]
        return (
          <div
            key={`${photo.id}-${i}`}
            className="absolute cursor-pointer transition-all duration-300 hover:!z-50 hover:scale-110"
            style={{
              top: l.top,
              left: l.left,
              transform: `rotate(${l.rotate}deg)`,
              zIndex: l.z,
            }}
            onClick={() => setSelectedId(photo.id)}
          >
            <div className="bg-white p-1.5 pb-5 shadow-md hover:shadow-2xl transition-shadow" style={{ width: l.size }}>
              <img
                src={photo.src}
                alt={photo.title}
                className="w-full object-cover"
                style={{ height: l.size * 0.65 }}
                loading="lazy"
              />
              <p className="text-[9px] text-dark-soft/30 mt-1.5 text-center truncate px-1">{photo.title}</p>
            </div>
          </div>
        )
      })}

      {selectedPhoto && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setSelectedId(null)}>
          <div className="bg-white p-3 pb-8 shadow-2xl max-w-[600px] w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <img src={selectedPhoto.src} alt={selectedPhoto.title} className="w-full object-cover max-h-[60vh]" />
            <div className="mt-3 px-1">
              <p className="font-semibold text-dark">{selectedPhoto.title}</p>
              <p className="text-xs text-dark-soft/50 mt-1">{selectedPhoto.date} — {selectedPhoto.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}