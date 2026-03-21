import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
      <h1 className="text-display text-[20vw] text-brand leading-none">404</h1>
      <p className="text-mono text-sm text-white/60 mt-4 mb-8">PAGE NOT FOUND — SYSTEM ERROR</p>
      <Link
        to="/"
        className="pill bg-white text-black text-mono text-xs font-bold hover:bg-brand hover:text-black transition-colors duration-150"
      >
        ← BACK TO HOME
      </Link>
    </div>
  )
}