export default function Essays() {
  return (
    <div className="min-h-screen bg-black px-6 pt-24 pb-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-display text-6xl text-white mb-2">ESSAYS</h1>
        <p className="text-mono text-sm text-white/60 mb-12">ALL WRITINGS — ARCHIVE</p>

        {/* Filter tabs placeholder */}
        <div className="flex gap-2 mb-12">
          {['DAY', 'WEEK', 'MONTH', 'YEAR', 'TAGS'].map((tab) => (
            <button
              key={tab}
              className={`pill text-mono text-xs font-bold border border-white/20 transition-all duration-150 ${
                tab === 'YEAR'
                  ? 'bg-white text-black'
                  : 'bg-transparent text-white/60 hover:bg-white hover:text-black'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Article list placeholder */}
        <div className="border-t border-white/20 pt-8">
          <p className="text-mono text-sm text-white/40">文章列表 — 待开发</p>
        </div>
      </div>
    </div>
  )
}