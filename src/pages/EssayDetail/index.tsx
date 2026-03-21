import { useParams } from 'react-router-dom'

export default function EssayDetail() {
  const { id } = useParams()

  return (
    <div className="min-h-screen bg-black px-6 pt-24 pb-16">
      <div className="max-w-4xl mx-auto">
        {/* Title bar */}
        <div className="bg-brand border-2 border-black px-6 py-4 mb-8">
          <h1 className="text-display text-3xl text-black">ARTICLE #{id}</h1>
        </div>

        <div className="flex gap-8">
          {/* Main content */}
          <div className="flex-1 border-t border-white/20 pt-8">
            <p className="text-mono text-sm text-white/40">文章详情 — 待开发</p>
          </div>

          {/* Sidebar TOC */}
          <aside className="w-64 border-2 border-white/20 p-4 shrink-0">
            <h3 className="text-mono text-xs font-bold text-brand mb-4">TABLE OF CONTENTS</h3>
            <p className="text-mono text-xs text-white/40">TOC — 待开发</p>
          </aside>
        </div>
      </div>
    </div>
  )
}