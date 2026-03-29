import { useEffect, useRef, useState } from 'react'
import * as PIXI from 'pixi.js'
import { Live2DModel } from 'pixi-live2d-display/cubism4'

declare global {
  interface Window {
    PIXI?: typeof PIXI
    Live2DCubismCore?: unknown
  }
}

const MODEL_URL = encodeURI('/live2d/model/兔兔-阿米娅.model3.json')
const MODEL_SCALE_FACTOR = 0.58
const MODEL_MIN_SCALE = 0.16
const EXPRESSION_NAMES = [
  'cloth off',
  'emote-angry',
  'emote-sad',
  'emote-shy',
  'emote-shy2',
  'emote-shy3',
  'face-sad',
  'face-shock',
  'hand-rice',
  'hand-trumpt',
  'mark-bang',
  'mark-exceting',
  'mark-flower',
  'mark-music',
  'mark-sweat',
  'mouth-hungry',
  'hand-pot',
  'mark-shock',
] as const
const MOTION_GROUP = ''
const MOTION_INDEXES = [0, 1, 2, 3, 4] as const

export default function Live2D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const modelRef = useRef<Live2DModel | null>(null)
  const [isModelReady, setIsModelReady] = useState(false)
  const [error, setError] = useState<string>('')

  const triggerExpression = (name: string) => {
    if (!modelRef.current) return
    void modelRef.current.expression(name)
  }

  const triggerMotion = (index: number) => {
    if (!modelRef.current) return
    void modelRef.current.motion(MOTION_GROUP, index)
  }

  const triggerRandomExpression = () => {
    if (!modelRef.current) return
    void modelRef.current.expression()
  }

  const resetToDefault = () => {
    if (!modelRef.current) return

    const modelAny = modelRef.current as unknown as {
      internalModel?: {
        motionManager?: {
          stopAllMotions?: () => void
          expressionManager?: {
            resetExpression?: () => void
          }
        }
      }
    }

    modelAny.internalModel?.motionManager?.stopAllMotions?.()
    modelAny.internalModel?.motionManager?.expressionManager?.resetExpression?.()
  }

  useEffect(() => {
    let mounted = true
    let app: PIXI.Application | null = null
    let model: Live2DModel | null = null

    const setup = async () => {
      const container = containerRef.current
      if (!container) return

      if (!window.Live2DCubismCore) {
        setError('Live2D Core 未加载：请确认 /live2dcubismcore.min.js 可访问')
        return
      }

      try {
        window.PIXI = PIXI

        app = new PIXI.Application({
          resizeTo: container,
          autoStart: true,
          antialias: true,
          backgroundAlpha: 0,
        })

        container.appendChild(app.view as HTMLCanvasElement)

        model = await Live2DModel.from(MODEL_URL)
        if (!mounted || !app) return
        modelRef.current = model
        setIsModelReady(true)

        app.stage.addChild(model)

        const fitModel = () => {
          if (!app || !model) return
          const baseScale = Math.min(app.screen.width / 1400, app.screen.height / 900)
          const scale = Math.max(MODEL_MIN_SCALE, baseScale * MODEL_SCALE_FACTOR)
          model.scale.set(scale)
          model.anchor.set(0.5, 0.5)
          model.position.set(app.screen.width * 0.5, app.screen.height * 0.42)
        }

        fitModel()
        window.addEventListener('resize', fitModel)

        ;(model as unknown as { _cleanupResize?: () => void })._cleanupResize = () => {
          window.removeEventListener('resize', fitModel)
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Live2D 模型加载失败')
      }
    }

    void setup()

    return () => {
      mounted = false
      setIsModelReady(false)
      modelRef.current = null

      const cleanupResize = model as unknown as { _cleanupResize?: () => void } | null
      cleanupResize?._cleanupResize?.()

      if (model) {
        model.destroy({ children: true })
        model = null
      }

      if (app) {
        app.destroy(true, { children: true, texture: true, baseTexture: true })
        app = null
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-black relative isolate">
      <div
        className="fixed inset-0 z-0 pointer-events-none bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/background.png)' }}
      />

      <div className="fixed inset-0 z-[1] pointer-events-none bg-black/80" />

      <div ref={containerRef} className="h-screen w-full relative z-10" />

      <div className="absolute left-4 top-20 z-20 w-[min(460px,92vw)] border border-white/20 bg-black/70 backdrop-blur-sm p-3 rounded-xl">
        <p className="text-white/80 text-xs font-mono mb-2">LIVE2D CONTROLS {isModelReady ? 'READY' : 'LOADING'}</p>

        <div className="mb-3">
          <p className="text-white/60 text-[11px] font-mono mb-2">Expressions</p>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
            {EXPRESSION_NAMES.map((name) => (
              <button
                key={name}
                type="button"
                disabled={!isModelReady}
                onClick={() => triggerExpression(name)}
                className="px-2.5 py-1.5 text-[11px] leading-none border border-white/30 text-white/85 rounded-md hover:bg-white hover:text-black disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center border-t border-white/10 pt-3">
          <button
            type="button"
            disabled={!isModelReady}
            onClick={resetToDefault}
            className="px-2.5 py-1.5 text-[11px] leading-none border border-[#FACC15] text-[#FACC15] rounded-md hover:bg-[#FACC15] hover:text-black disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            reset default
          </button>

          <button
            type="button"
            disabled={!isModelReady}
            onClick={triggerRandomExpression}
            className="px-2.5 py-1.5 text-[11px] leading-none border border-[#FF4D00] text-[#FF4D00] rounded-md hover:bg-[#FF4D00] hover:text-black disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            random expression
          </button>

          {MOTION_INDEXES.map((i) => (
            <button
              key={i}
              type="button"
              disabled={!isModelReady}
              onClick={() => triggerMotion(i)}
              className="px-2.5 py-1.5 text-[11px] leading-none border border-white/30 text-white/85 rounded-md hover:bg-white hover:text-black disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              motion {i}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="absolute left-4 bottom-4 border border-red-400/50 bg-black/80 text-red-300 text-xs px-3 py-2 font-mono max-w-[90vw]">
          {error}
        </div>
      )}
    </div>
  )
}
