import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { mockEssays } from '@/data'

function useCurrentTime() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])
  return time
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 6) return 'LATE NIGHT'
  if (hour < 12) return 'GOOD MORNING'
  if (hour < 18) return 'GOOD AFTERNOON'
  return 'GOOD EVENING'
}

function DigitalClock() {
  const time = useCurrentTime()
  const h = String(time.getHours()).padStart(2, '0')
  const m = String(time.getMinutes()).padStart(2, '0')

  return (
    <div className="border-2 border-white/20 p-6 flex items-center justify-center">
      <span className="text-display text-5xl text-brand tracking-widest">
        {h}<span className="animate-pulse">:</span>{m}
      </span>
    </div>
  )
}

function CalendarWidget() {
  const now = useCurrentTime()
  const year = now.getFullYear()
  const month = now.getMonth()
  const today = now.getDate()
  const weekDay = ['日', '一', '二', '三', '四', '五', '六']

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = Array(firstDay).fill(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="border-2 border-white/20 p-5">
      <p className="text-mono text-xs text-white/40 mb-3">
        {year}/{month + 1}/{today} {weekDay[now.getDay()]}
      </p>
      <div className="grid grid-cols-7 gap-1 text-center text-mono text-xs">
        {['一', '二', '三', '四', '五', '六', '日'].map((d) => (
          <span key={d} className={`pb-1 ${d === '六' || d === '日' ? 'text-brand' : 'text-white/40'}`}>{d}</span>
        ))}
        {cells.map((d, i) => (
          <span
            key={i}
            className={`py-0.5 ${
              d === today
                ? 'bg-brand text-black font-bold'
                : d
                  ? 'text-white/70'
                  : ''
            }`}
          >
            {d ?? ''}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* ===== Hero Section ===== */}
      <section className="min-h-screen bg-brand flex flex-col justify-between px-6 pt-20 pb-8 relative overflow-hidden">
        <div className="flex-1 flex items-center">
          <h1 className="text-display text-[16vw] text-black leading-[0.85] select-none">
            IVY<br />NEKO
          </h1>
        </div>

        <div className="border-t-2 border-black pt-6 flex items-end justify-between">
          <div className="text-mono text-xs text-black/80 space-y-1">
            <p>BASED IN CHINA</p>
            <p>CS UNDERGRADUATE</p>
            <p className="text-black font-bold">● SYSTEM ONLINE</p>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-36 h-36 relative">
              <div className="absolute inset-0 rounded-full bg-[#4a4a4a]" />
              <div className="absolute inset-0 animate-spin-slow">
                <svg viewBox="0 0 144 144" className="w-full h-full">
                  <defs>
                    <path id="circlePath" d="M 72,72 m -52,0 a 52,52 0 1,1 104,0 a 52,52 0 1,1 -104,0" />
                  </defs>
                  <text fill="white" style={{ fontSize: '12px', fontFamily: 'Space Mono', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.25em' }}>
                    <textPath href="#circlePath">• SCROLL DOWN • SCROLL DOWN&nbsp;</textPath>
                  </text>
                </svg>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <polyline points="19 12 12 19 5 12" />
                </svg>
              </div>
            </div>
          </div>

          <div className="text-mono text-xs text-black/80 text-right space-y-1">
            <p>CODER</p>
            <p>OPEN SOURCE</p>
            <p>ACG ENTHUSIAST</p>
          </div>
        </div>
      </section>

      {/* ===== Skewed Marquee Section ===== */}
      <section className="bg-black py-12" style={{ transform: 'skewY(-3deg)', margin: '-2rem 0' }}>
        <div>
          <div className="overflow-hidden whitespace-nowrap mb-2">
            <div className="animate-marquee inline-flex">
              <span className="text-display text-[10vw] text-brand leading-none">WELCOME TO MY WORLD • CREATIVE CODER • OPEN SOURCE LOVER •&nbsp;</span>
              <span className="text-display text-[10vw] text-brand leading-none">WELCOME TO MY WORLD • CREATIVE CODER • OPEN SOURCE LOVER •&nbsp;</span>
            </div>
          </div>
          <div className="overflow-hidden whitespace-nowrap">
            <div className="animate-marquee-reverse inline-flex">
              <span className="text-display text-[10vw] text-white/80 leading-none">BLOG • CODE • ANIME • EXPLORE • SHARE • BUILD •&nbsp;</span>
              <span className="text-display text-[10vw] text-white/80 leading-none">BLOG • CODE • ANIME • EXPLORE • SHARE • BUILD •&nbsp;</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Content Below ===== */}
      <section className="bg-black px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="border-t border-white/20 pt-8 mb-16">
            <h2 className="text-display text-4xl text-white mb-8">LATEST</h2>
            <p className="text-mono text-sm text-white/60">文章区块 — 待开发</p>
          </div>
          <div className="border-t border-white/20 pt-8">
            <h2 className="text-display text-4xl text-white mb-8">FEATURED</h2>
            <p className="text-mono text-sm text-white/60">推荐区块 — 待开发</p>
          </div>
        </div>
      </section>
    </div>
  )
}
