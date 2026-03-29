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

export default function BootScreen() {
  const [isBooting, setIsBooting] = useState(() => {
    if (typeof window === 'undefined') return false
    return !sessionStorage.getItem('site_booted')
  })
  const [lines, setLines] = useState<string[]>([])
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    if (!isBooting) return

    // Prevent scrolling while boot screen is active
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
        // Randomize delay to simulate real loading behavior
        timeoutId = setTimeout(typeNextLine, Math.random() * 150 + 100)
      } else {
        timeoutId = setTimeout(() => {
          if (!active) return
          setShowWelcome(true)
        }, 200)
        finishTimeoutId = setTimeout(() => {
          if (!active) return
          setIsBooting(false)
          sessionStorage.setItem('site_booted', '1')
          setTimeout(() => {
            useGlobalStore.getState().setBootComplete(true)
          }, 800) // matches framer-motion exit duration
        }, 1600)
      }
    }

    const startTimeout = setTimeout(() => {
      typeNextLine()
    }, 300)

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
          className="fixed inset-0 z-[99999] flex flex-col justify-center bg-black px-6 md:px-12 isolate overflow-hidden"
          exit={{ 
            y: '-100%', 
            opacity: 0, 
            filter: 'blur(10px)', 
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
          }}
        >
          {/* Terminal Background Layer */}
          <FaultyTerminalBackground
            scale={2.5}
            scanlineIntensity={0.8}
            glitchAmount={1.2}
            tint="#FF4D00"
            mouseReact={false}
            brightness={0.4}
            className="absolute inset-0 z-0 pointer-events-none opacity-50 mix-blend-screen"
          />

          <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-transparent via-black/40 to-black" />

          {/* Foreground Text Content */}
          <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-start min-h-[50vh]">
            <div className="space-y-2 md:space-y-3 w-full">
              {lines.map((line, i) => {
                const isOk = line.includes('[OK]')
                const cleanLine = line.replace('[OK]', '')
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[11px] md:text-sm tracking-[0.1em] md:tracking-[0.2em] font-mono uppercase"
                  >
                    <span className="text-white/40 mr-3 md:mr-5">[{String(i * 127 + 1024).padStart(4, '0')}]</span>
                    <span className={isOk ? 'text-white/80' : 'text-brand'}>
                      {cleanLine}
                    </span>
                    {isOk && <span className="text-[#FACC15] ml-2">[OK]</span>}
                  </motion.div>
                )
              })}
              
              {/* Blinking Cursor */}
              {!showWelcome && lines.length < 8 && (
                <div className="w-3 md:w-4 h-4 md:h-5 bg-brand animate-pulse mt-2" />
              )}
            </div>

            {/* Welcome Granted Block */}
            {showWelcome && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="mt-12 border-[3px] border-brand bg-brand/10 p-6 md:p-8 backdrop-blur-sm self-start inline-block"
              >
                <h2 className="text-display text-4xl md:text-6xl text-white tracking-tighter leading-none mb-2">
                  <span className="text-brand">ACCESS</span> GRANTED
                </h2>
                <p className="text-mono text-xs md:text-sm text-brand uppercase tracking-widest">
                  Welcome to the Kinetic Environment
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
