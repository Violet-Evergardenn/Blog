import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FaultyTerminalBackground from './FaultyTerminalBackground'
import { useGlobalStore } from '@/stores/global'

const generateBootLines = () => [
  'kernel: initializing ACG-KINETIC_ENGINE v3.1.4...',
  'system: mounting root filesystem...... [OK]',
  'memory: 1048576K allocated............ [OK]',
  'network: establishing neural node..... [OK]',
  'live2d: preloading textures & meshes.. [OK]',
  'security: bypassing proxy protocols... [OK]',
  'render: activating WebGL shaders...... [OK]',
  'status: SYSTEM BOOT COMPLETE.',
]

const ORANGE = '#FF6600'
const ORANGE_DIM = '#FF6600BB'

export default function BootScreen() {
  const [isBooting, setIsBooting] = useState(() => {
    if (typeof window === 'undefined') return false
    return !sessionStorage.getItem('site_booted')
  })
  const [lines, setLines] = useState<string[]>([])
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    if (!isBooting) return
    document.body.style.overflow = 'hidden'

    const bootLines = generateBootLines()
    let currentLine = 0
    let active = true
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    let finishTimeoutId: ReturnType<typeof setTimeout> | undefined

    const typeNextLine = () => {
      if (!active) return
      if (currentLine < bootLines.length) {
        const nextLine = bootLines[currentLine]
        setLines(prev => {
          if (!nextLine || prev.includes(nextLine)) return prev
          return [...prev, nextLine]
        })
        currentLine++
        timeoutId = setTimeout(typeNextLine, Math.random() * 150 + 100)
      } else {
        timeoutId = setTimeout(() => { if (active) setShowWelcome(true) }, 200)
        finishTimeoutId = setTimeout(() => {
          if (!active) return
          setIsBooting(false)
          sessionStorage.setItem('site_booted', '1')
          setTimeout(() => useGlobalStore.getState().setBootComplete(true), 800)
        }, 1600)
      }
    }

    const startTimeout = setTimeout(typeNextLine, 300)
    return () => {
      active = false
      clearTimeout(startTimeout)
      if (timeoutId) clearTimeout(timeoutId)
      if (finishTimeoutId) clearTimeout(finishTimeoutId)
      document.body.style.overflow = ''
    }
  }, [isBooting])

  return (
    <AnimatePresence>
      {isBooting && (
        <motion.div
          key="bootscreen"
          className="fixed inset-0 z-[99999] bg-black overflow-hidden"
          exit={{
            y: '-100%',
            opacity: 0,
            filter: 'blur(10px)',
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
          }}
        >
          {/* ══════════════════════════════════════════════
              右侧 2/3：点阵波纹背景，仅覆盖右边区域
          ══════════════════════════════════════════════ */}
          <div className="absolute right-0 top-0 bottom-0 w-2/3 z-0">
            <FaultyTerminalBackground
              scale={2.5}
              scanlineIntensity={0.8}
              glitchAmount={1.2}
              tint="#FF6600"
              mouseReact={false}
              brightness={0.8}
              className="absolute inset-0 pointer-events-none opacity-50 mix-blend-screen"
            />
            {/* 右侧区域本身也是黑底 */}
            <div className="absolute inset-0 bg-black -z-10" />
          </div>

          {/* ══════════════════════════════════════════════
              主布局：左 1/3 log区  |  竖线  |  右 2/3 标题区
          ══════════════════════════════════════════════ */}
          <div className="relative z-10 flex h-full w-full">

            {/* ── 左栏 1/3：纯黑 + log 文字，整体居中 ── */}
            <div className="w-1/3 shrink-0 flex flex-col justify-center items-center bg-black px-4">
              {/* 内容块：固定宽度，保证文字左对齐且整体在左栏居中 */}
              <div className="w-full max-w-[260px]">

              {/* 顶部小标签 */}
              <div className="mb-8 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: ORANGE }} />
                <span className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: ORANGE }}>
                  SYSTEM BOOT
                </span>
              </div>

              {/* Log 行 */}
              <div className="space-y-2 md:space-y-3">
                {lines.map((line, i) => {
                  const isOk = line.includes('[OK]')
                  const cleanLine = line.replace('[OK]', '')
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-baseline gap-2 font-mono uppercase"
                      style={{ fontSize: 'clamp(9px, 1vw, 12px)', letterSpacing: '0.15em' }}
                    >
                      <span className="shrink-0" style={{ color: 'rgba(255,255,255,0.25)' }}>
                        [{String(i * 127 + 1024).padStart(4, '0')}]
                      </span>
                      <span style={{ color: isOk ? 'rgba(255,255,255,0.7)' : ORANGE }}>
                        {cleanLine}
                      </span>
                      {isOk && (
                        <span className="font-black shrink-0" style={{ color: '#FFD700' }}>
                          [OK]
                        </span>
                      )}
                    </motion.div>
                  )
                })}

                {/* 闪烁光标 */}
                {!showWelcome && lines.length < 8 && (
                  <motion.div
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-2 h-3 md:h-4 mt-1"
                    style={{ backgroundColor: ORANGE }}
                  />
                )}
              </div>

              {/* 底部版本信息 */}
              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="font-mono text-[9px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  ACG-KINETIC ENGINE v3.1.4
                </p>
              </div>

              </div> {/* end max-w 内容块 */}
            </div> {/* end 左栏 */}

            {/* ── 竖线分割 ── */}
            <div
              className="w-px shrink-0 self-stretch"
              style={{ backgroundColor: ORANGE, opacity: 0.6 }}
            />

            {/* ── 右栏 2/3：ACCESS GRANTED 大字，叠在点阵上 ── */}
            <div className="flex-1 flex flex-col justify-center px-10 md:px-16">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={showWelcome ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="w-12 h-[2px] mb-6" style={{ backgroundColor: ORANGE }} />

                <h2 className="text-display leading-[0.88] tracking-tighter select-none">
                  <span
                    className="block font-black"
                    style={{
                      fontSize: 'clamp(4rem, 10vw, 10rem)',
                      color: ORANGE,
                      textShadow: showWelcome
                        ? `0 0 40px ${ORANGE_DIM}, 0 0 80px ${ORANGE}44`
                        : 'none',
                    }}
                  >
                    ACCESS
                  </span>
                  <span
                    className="block font-black text-white"
                    style={{ fontSize: 'clamp(4rem, 10vw, 10rem)' }}
                  >
                    GRANTED
                  </span>
                </h2>

                <p
                  className="mt-6 font-mono text-xs md:text-sm uppercase tracking-[0.3em]"
                  style={{ color: ORANGE }}
                >
                  Welcome to the Kinetic Environment
                </p>

                <div className="mt-6 border-l-2 pl-4" style={{ borderColor: ORANGE }}>
                  <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    SYSTEM NOMINAL · ALL MODULES ACTIVE
                  </span>
                </div>
              </motion.div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}