import { useLayoutEffect, useRef } from 'react'
import React from 'react'
import gsap from 'gsap'
import { useGlobalStore } from '@/stores/global'

export default function Home() {
  const homeRootRef = useRef<HTMLDivElement>(null)
  const bootComplete = useGlobalStore(state => state.bootComplete)
  // 如果是刚刚完成 boot，给一个小延迟让过渡更平滑；如果早就完成了，直接执行
  const introBaseDelay = typeof window !== 'undefined' && !sessionStorage.getItem('site_booted') ? 0.4 : 0.1

  useLayoutEffect(() => {
    if (!homeRootRef.current) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const chars = gsap.utils.toArray<HTMLElement>('.hero-char')
    if (!chars.length) return

    // 如果 Boot 还没完成，先重置英雄文字的初始隐藏状态，但不播放动画
    if (!bootComplete) {
      gsap.set(chars, { y: 280, opacity: 0 })
      return
    }

    const ctx = gsap.context(() => {
      // 确保从正确的初始状态开始，防止由于热更新或者其他重渲染导致的偏差
      gsap.set(chars, { y: 280, opacity: 0 })

      gsap.to(chars, {
        y: 0,
        opacity: 1,
        duration: 0.44,
        stagger: 0.032,
        ease: 'expo.out',
        delay: introBaseDelay,
        clearProps: 'transform,opacity'
      })
    }, homeRootRef)

    return () => ctx.revert()
  }, [bootComplete, introBaseDelay])

  // 将文字拆分成单个字符
  const renderAnimatedText = (text: string) => {
    return text.split('').map((char, index) => (
      <span 
        key={index} 
        className="hero-char inline-block will-change-transform"
        style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ))
  }

  // 控制 CSS 卡片入场动画，只有 boot 完成才开始播放
  const cardStyle = (index: number): React.CSSProperties => {
    if (!bootComplete) {
      return {
        opacity: 0,
        transform: 'scale(0)'
      }
    }
    
    return {
      animation: `card-pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both`,
      animationDelay: `${introBaseDelay + index * 0.08}s`,
    }
  }

  return (
    <div ref={homeRootRef} className="bg-brand relative">
      {/* ===== Hero Section ===== */}

      {/* ---- 桌面端：原始 h-screen 单屏布局 ---- */}
      <section className="hidden md:flex h-screen flex-col justify-between px-6 pt-20 pb-8 relative z-10">
        <div className="flex-1 flex items-center justify-between w-full max-w-[1600px] mx-auto">
          {/* Headline */}
          <div className="shrink-0 pointer-events-none mt-10" style={{ perspective: '1000px' }}>
            <h1 className="text-display text-[13vw] text-black leading-[0.85] select-none">
              <span className="hero-line block overflow-hidden">{renderAnimatedText('ART')}</span>
              <span className="hero-line block overflow-hidden">{renderAnimatedText('CHIP')}</span>
            </h1>
            <p className="text-mono text-sm md:text-base text-black/70 mt-4 tracking-wider text-center">
              CREATIVE DEVELOPER & BLOGGER
            </p>
          </div>

          {/* Right Bento - Scattered Waterfall Layout */}
          <div className="flex justify-between gap-5 w-[55vw] max-w-[800px] mr-2 md:mr-8 xl:mr-16 relative z-10 shrink-0 items-start">
            {/* Col 1 */}
            <div className="flex-[1] flex flex-col gap-6 pt-20">
              <div style={cardStyle(0)} className="h-[300px] border-[4px] border-black rounded-[2rem] bg-white shadow-[8px_8px_0_#000] hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[16px_16px_0_#000] active:translate-y-0 active:translate-x-0 active:shadow-[0_0_0_#000] transition-all cursor-pointer flex flex-col items-center justify-between py-6 px-4 group overflow-hidden relative">
                <div className="absolute inset-0 bg-cover bg-center transition-all duration-500 saturate-[0.8] contrast-125 sepia-[0.3] group-hover:saturate-100 group-hover:contrast-100 group-hover:sepia-0" style={{ backgroundImage: 'url(/home-img/live2d.jpg)' }}></div>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500"></div>
                <div className="w-full flex justify-end z-10"><div className="w-5 h-5 bg-brand border-2 border-black rounded-full animate-pulse"></div></div>
                <div className="flex-1 flex items-end justify-center w-full z-10 pb-4">
                  <div className="bg-white/90 border-[3px] border-black rounded-xl px-3 py-2 transform group-hover:-rotate-3 transition-transform">
                    <span className="text-black font-black text-3xl tracking-wide uppercase">LIVE2D</span>
                  </div>
                </div>
              </div>
              <div style={cardStyle(1)} className="h-[140px] border-[4px] border-black rounded-[2rem] bg-black shadow-[8px_8px_0_#000] hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[16px_16px_0_#000] active:translate-y-0 active:translate-x-0 active:shadow-[0_0_0_#000] transition-all flex justify-center items-center cursor-pointer group -rotate-2">
                <span className="text-white font-black text-2xl tracking-widest group-hover:text-brand transition-colors">PROJ</span>
              </div>
            </div>
            {/* Col 2 */}
            <div className="flex-[2.2] flex flex-col gap-6">
              <div style={cardStyle(2)} className="h-[110px] border-[4px] border-black rounded-[2rem] bg-black shadow-[8px_8px_0_#000] hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[16px_16px_0_#000] active:translate-y-0 active:translate-x-0 active:shadow-[0_0_0_#000] transition-all cursor-pointer flex items-center justify-between px-6 group overflow-hidden relative rotate-1 z-10">
                <div className="absolute inset-0 bg-cover opacity-80 group-hover:opacity-100 transition-all duration-500 bg-[center_10%]" style={{ backgroundImage: 'url(/home-img/gallery.jpg)' }}></div>
                <div className="absolute inset-0 bg-[#FACC15] mix-blend-multiply group-hover:opacity-0 transition-opacity duration-500"></div>
                <span className="text-white font-black text-3xl z-10 drop-shadow-[2px_2px_0_#000] tracking-wider">GALLERY</span>
                <div className="w-12 h-12 border-[3px] border-black rounded-full flex items-center justify-center z-10 bg-white group-hover:bg-brand transition-colors shrink-0">
                  <svg className="w-6 h-6 text-black group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </div>
              </div>
              <div style={cardStyle(3)} className="h-[350px] border-[4px] border-black rounded-[2rem] bg-white shadow-[8px_8px_0_#000] hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[16px_16px_0_#000] active:translate-y-0 active:translate-x-0 active:shadow-[0_0_0_#000] transition-all cursor-pointer flex flex-col items-center justify-center group overflow-hidden relative">
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(black 2.5px, transparent 2.5px)', backgroundSize: '20px 20px' }}></div>
                <div className="w-36 h-36 border-[4px] border-black rounded-full mb-6 bg-brand flex items-center justify-center overflow-hidden z-10 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-[4px_4px_0_#000]">
                  <img src="/home-img/me.jpg" alt="Ivy Neko" className="w-full h-full object-cover transition-all duration-500" />
                </div>
                <span className="text-black font-black text-4xl uppercase tracking-wider z-10 bg-white px-3 py-1 border-[3px] border-black rounded-xl">ABOUT ME</span>
              </div>
              <div style={cardStyle(4)} className="h-[110px] border-[4px] border-black rounded-[2rem] bg-white shadow-[8px_8px_0_#000] hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[16px_16px_0_#000] active:translate-y-0 active:translate-x-0 active:shadow-[0_0_0_#000] transition-all cursor-pointer flex items-center justify-between px-6 overflow-hidden -rotate-1 z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 border-[3px] border-black rounded-full flex items-center justify-center bg-brand pl-1 shrink-0">
                    <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-black font-black text-lg whitespace-nowrap">NOW PLAYING</span>
                    <span className="text-black/60 font-bold text-xs uppercase">BGM - Track 01</span>
                  </div>
                </div>
                <div className="flex items-end gap-1.5 h-6 shrink-0">
                  <div className="w-2 h-full bg-black animate-pulse"></div>
                  <div className="w-2 h-2/3 bg-black animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-4/5 bg-black animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-1/2 bg-black animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                  <div className="w-2 h-full bg-brand animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
            {/* Col 3 */}
            <div className="flex-[1] flex flex-col gap-6 pt-10">
              <div style={cardStyle(5)} className="h-[280px] border-[4px] border-black rounded-[2rem] bg-black shadow-[8px_8px_0_#000] hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[16px_16px_0_#000] active:translate-y-0 active:translate-x-0 active:shadow-[0_0_0_#000] transition-all cursor-pointer flex flex-col items-center justify-center gap-6 py-6 rotate-2 z-10">
                <div className="text-brand font-black text-xl mb-1 tracking-wider" style={{ writingMode: 'vertical-rl' }}>LINKS</div>
                <div className="w-14 h-14 border-[3px] border-black rounded-full flex items-center justify-center bg-white hover:bg-brand hover:scale-110 hover:-rotate-12 transition-all text-black font-black text-lg shrink-0">GH</div>
                <div className="w-14 h-14 border-[3px] border-black rounded-full flex items-center justify-center bg-white hover:bg-brand hover:scale-110 hover:rotate-12 transition-all text-black font-black text-lg shrink-0">BL</div>
              </div>
              <div style={cardStyle(6)} className="h-[140px] border-[4px] border-black rounded-[2rem] bg-brand shadow-[8px_8px_0_#000] hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[16px_16px_0_#000] active:translate-y-0 active:translate-x-0 active:shadow-[0_0_0_#000] transition-all cursor-pointer flex items-center justify-center group overflow-hidden relative -rotate-3 z-10">
                <svg className="w-14 h-14 text-black group-hover:scale-125 group-hover:text-white transition-transform z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-black pt-6 flex items-end justify-between">
          <div className="text-mono text-xs text-black/80 space-y-1">
            <p>BASED IN CHINA</p>
            <p>CS UNDERGRADUATE</p>
            <p className="text-black font-bold">🟢 SYSTEM ONLINE</p>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-36 h-36 relative">
              <div className="absolute inset-0 rounded-full bg-[#4a4a4a]" />
              <div className="absolute inset-0 animate-spin-slow">
                <svg viewBox="0 0 144 144" className="w-full h-full">
                  <defs><path id="circlePath" d="M 72,72 m -52,0 a 52,52 0 1,1 104,0 a 52,52 0 1,1 -104,0" /></defs>
                  <text fill="white" style={{ fontSize: '12px', fontFamily: 'Space Mono', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.25em' }}>
                    <textPath href="#circlePath">✦ SCROLL DOWN ✦ SCROLL DOWN&nbsp;</textPath>
                  </text>
                </svg>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
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

      {/* ---- 移动端：单列垂直布局 ---- */}
      <section className="md:hidden flex flex-col px-4 pt-20 pb-10 gap-5 relative z-10">
        {/* 标题区 */}
        <div className="pointer-events-none" style={{ perspective: '1000px' }}>
          <h1 className="text-display text-[22vw] text-black leading-[0.85] select-none">
            <span className="hero-line block overflow-hidden">{renderAnimatedText('ART')}</span>
            <span className="hero-line block overflow-hidden">{renderAnimatedText('CHIP')}</span>
          </h1>
          <p className="text-mono text-xs text-black/70 mt-3 tracking-wider">
            CREATIVE DEVELOPER & BLOGGER
          </p>
        </div>

        {/* About Me Card */}
        <div style={cardStyle(3)} className="h-[220px] border-[4px] border-black rounded-[2rem] bg-white shadow-[8px_8px_0_#000] cursor-pointer flex flex-col items-center justify-center group overflow-hidden relative">
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(black 2.5px, transparent 2.5px)', backgroundSize: '20px 20px' }}></div>
          <div className="w-24 h-24 border-[4px] border-black rounded-full mb-4 bg-brand flex items-center justify-center overflow-hidden z-10 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-[4px_4px_0_#000]">
            <img src="/home-img/me.jpg" alt="Ivy Neko" className="w-full h-full object-cover" />
          </div>
          <span className="text-black font-black text-2xl uppercase tracking-wider z-10 bg-white px-3 py-1 border-[3px] border-black rounded-xl">ABOUT ME</span>
        </div>

        {/* 2-col grid: Gallery + Live2D */}
        <div className="grid grid-cols-2 gap-4">
          <div style={cardStyle(2)} className="h-[140px] border-[4px] border-black rounded-[2rem] bg-black shadow-[8px_8px_0_#000] cursor-pointer flex items-center justify-between px-4 group overflow-hidden relative">
            <div className="absolute inset-0 bg-cover opacity-80 group-hover:opacity-100 transition-all duration-500 bg-[center_10%]" style={{ backgroundImage: 'url(/home-img/gallery.jpg)' }}></div>
            <div className="absolute inset-0 bg-[#FACC15] mix-blend-multiply group-hover:opacity-0 transition-opacity duration-500"></div>
            <span className="text-white font-black text-xl z-10 drop-shadow-[2px_2px_0_#000] tracking-wider">GALLERY</span>
          </div>
          <div style={cardStyle(0)} className="h-[140px] border-[4px] border-black rounded-[2rem] bg-white shadow-[8px_8px_0_#000] cursor-pointer flex flex-col items-center justify-end pb-4 group overflow-hidden relative">
            <div className="absolute inset-0 bg-cover bg-center transition-all duration-500 saturate-[0.8] group-hover:saturate-100" style={{ backgroundImage: 'url(/home-img/live2d.jpg)' }}></div>
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500"></div>
            <div className="bg-white/90 border-[3px] border-black rounded-xl px-2 py-1 z-10">
              <span className="text-black font-black text-lg tracking-wide uppercase">LIVE2D</span>
            </div>
          </div>
        </div>

        {/* Music Card */}
        <div style={cardStyle(4)} className="h-[90px] border-[4px] border-black rounded-[2rem] bg-white shadow-[8px_8px_0_#000] cursor-pointer flex items-center justify-between px-5 overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-[3px] border-black rounded-full flex items-center justify-center bg-brand pl-0.5 shrink-0">
              <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
            </div>
            <div className="flex flex-col">
              <span className="text-black font-black text-base whitespace-nowrap">NOW PLAYING</span>
              <span className="text-black/60 font-bold text-xs uppercase">BGM - Track 01</span>
            </div>
          </div>
          <div className="flex items-end gap-1 h-5 shrink-0">
            <div className="w-1.5 h-full bg-black animate-pulse"></div>
            <div className="w-1.5 h-2/3 bg-black animate-pulse" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1.5 h-4/5 bg-black animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1.5 h-1/2 bg-black animate-pulse" style={{ animationDelay: '0.3s' }}></div>
            <div className="w-1.5 h-full bg-brand animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>

        {/* 2-col grid: PROJ + Heart */}
        <div className="grid grid-cols-2 gap-4">
          <div style={cardStyle(1)} className="h-[100px] border-[4px] border-black rounded-[2rem] bg-black shadow-[8px_8px_0_#000] flex justify-center items-center cursor-pointer group -rotate-1">
            <span className="text-white font-black text-xl tracking-widest group-hover:text-brand transition-colors">PROJ</span>
          </div>
          <div style={cardStyle(6)} className="h-[100px] border-[4px] border-black rounded-[2rem] bg-brand shadow-[8px_8px_0_#000] cursor-pointer flex items-center justify-center group rotate-1">
            <svg className="w-10 h-10 text-black group-hover:scale-125 group-hover:text-white transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
          </div>
        </div>

        {/* Links Card */}
        <div style={cardStyle(5)} className="h-[90px] border-[4px] border-black rounded-[2rem] bg-black shadow-[8px_8px_0_#000] cursor-pointer flex items-center justify-between px-6">
          <span className="text-brand font-black text-lg tracking-wider">LINKS</span>
          <div className="flex gap-3">
            <div className="w-10 h-10 border-[3px] border-black rounded-full flex items-center justify-center bg-white hover:bg-brand hover:scale-110 transition-all text-black font-black text-sm">GH</div>
            <div className="w-10 h-10 border-[3px] border-black rounded-full flex items-center justify-center bg-white hover:bg-brand hover:scale-110 transition-all text-black font-black text-sm">BL</div>
          </div>
        </div>

        {/* 底部状态栏 */}
        <div className="border-t-2 border-black pt-4 flex items-center justify-between mt-2">
          <div className="text-mono text-[10px] text-black/80 space-y-0.5">
            <p>BASED IN CHINA</p>
            <p>CS UNDERGRADUATE</p>
            <p className="font-bold">🟢 SYSTEM ONLINE</p>
          </div>
          <div className="text-mono text-[10px] text-black/80 text-right space-y-0.5">
            <p>CODER</p>
            <p>OPEN SOURCE</p>
            <p>ACG ENTHUSIAST</p>
          </div>
        </div>
      </section>

      {/* ===== Skewed Marquee Section (Absolute overlay, 仅桌面端) ===== */}
      <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none z-20">
        <section
          className="absolute left-[-2%] right-[-2%] w-[104%] bg-black pointer-events-auto"
          style={{
            top: 'calc(100vh + 1rem)',
            height: '100vh',
            transform: 'skewY(-6deg)',
            transformOrigin: 'top left'
          }}
        >
          <div className="w-full pt-1 pb-4">
            <div className="overflow-hidden whitespace-nowrap">
              <div className="animate-marquee inline-flex">
                <span className="text-display text-[6.5vw] font-black text-brand leading-none tracking-widest hover:text-white transition-colors duration-300">WELCOME TO MY WORLD ✦ CREATIVE CODER ✦ OPEN SOURCE LOVER ✦ BLOG ✦ CODE ✦ ANIME ✦ EXPLORE ✦ SHARE ✦ BUILD ✦&nbsp;</span>
                <span className="text-display text-[6.5vw] font-black text-brand leading-none tracking-widest hover:text-white transition-colors duration-300">WELCOME TO MY WORLD ✦ CREATIVE CODER ✦ OPEN SOURCE LOVER ✦ BLOG ✦ CODE ✦ ANIME ✦ EXPLORE ✦ SHARE ✦ BUILD ✦&nbsp;</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}