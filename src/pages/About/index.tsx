export default function About() {
  return (
    <div className="min-h-screen px-6 pt-20 pb-16">
      <div className="max-w-3xl mx-auto">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-dark mb-2">LVY NEKO</h1>
          <p className="text-dark-soft/40 text-sm">もしもし</p>
        </div>

        {/* Profile Card */}
        <div className="glass p-8 mb-6">
          <h2 className="text-xl font-bold text-dark mb-4"># Hi! ✨ I'm Ivy</h2>
          <div className="space-y-3 text-dark-soft/70 leading-relaxed text-[15px]">
            <p>一名 CS 本科生，热爱开源和编程。</p>
            <p>喜欢算法、C++、Rust，也喜欢探索 CS 世界里各种有趣的东西。</p>
            <p>这个网站是我的个人博客，记录学习、分享技术、整理项目。</p>
          </div>

          <div className="mt-6 border-l-4 border-brand bg-brand/5 rounded-r-xl px-5 py-3">
            <p className="text-dark-soft/60 italic">"Exploring the interesting 'X' in CS"</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="glass p-5">
            <p className="text-xs text-dark-soft/40 mb-1">NAME</p>
            <p className="font-semibold text-dark">ivy-neko</p>
          </div>
          <div className="glass p-5">
            <p className="text-xs text-dark-soft/40 mb-1">LOCATION</p>
            <p className="font-semibold text-dark">China 🇨🇳</p>
          </div>
          <div className="glass p-5">
            <p className="text-xs text-dark-soft/40 mb-1">SKILLS</p>
            <p className="font-semibold text-dark">C++ • Rust • React • Algo</p>
          </div>
          <div className="glass p-5">
            <p className="text-xs text-dark-soft/40 mb-1">STATUS</p>
            <p className="font-semibold text-brand">● Online</p>
          </div>
        </div>

        {/* Social */}
        <div className="flex gap-3">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer"
            className="flex-1 glass-hover flex items-center justify-center gap-2 py-3 text-sm font-medium text-dark-soft">
            ⬡ Github
          </a>
          <a href="https://bilibili.com" target="_blank" rel="noopener noreferrer"
            className="flex-1 glass-hover flex items-center justify-center gap-2 py-3 text-sm font-medium text-dark-soft">
            ▶ Bilibili
          </a>
          <a href="mailto:hello@example.com"
            className="flex-1 glass-hover flex items-center justify-center gap-2 py-3 text-sm font-medium text-dark-soft">
            ✉ Email
          </a>
        </div>
      </div>
    </div>
  )
}