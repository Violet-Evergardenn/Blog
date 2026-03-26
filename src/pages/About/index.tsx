export default function About() {
  return (
    <div className="min-h-screen w-full px-4 md:px-6 bg-black relative flex items-center justify-center py-20 md:py-0">
      {/* Background */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/background.png)' }}
      />
      
      <div className="max-w-4xl mx-auto relative z-10 w-full">
        
        {/* ========= THE BIG BRUTALIST CARD ========= */}
        <div className="border-[4px] border-black rounded-[2rem] bg-white shadow-[16px_16px_0_#FF4D00] md:shadow-[24px_24px_0_#FF4D00] p-6 md:p-8 flex flex-col gap-6 max-h-[85vh] overflow-y-auto [&::-webkit-scrollbar]:hidden">
          
          {/* Header Section: Avatar & Intro */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b-[4px] border-black pb-6 border-dashed">
            {/* Avatar */}
            <div className="w-32 h-32 md:w-40 md:h-40 border-[4px] border-black rounded-[2rem] overflow-hidden shrink-0 shadow-[8px_8px_0_#000] bg-brand rotate-3 hover:-rotate-3 transition-transform duration-300">
              <img src="/home-img/me.jpg" alt="Abstract Chip" className="w-full h-full object-cover" />
            </div>
            
            {/* Title & Short Bio */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-display text-4xl md:text-6xl text-black leading-none mb-3 uppercase">Abstract Chip</h1>
              <div className="inline-block bg-black text-brand px-3 py-1 font-black text-xs md:text-sm tracking-widest uppercase mb-4 rounded-lg border-2 border-black rotate-1">
                ポテトチップ • System Online
              </div>
              
              <div className="space-y-2 text-black font-bold text-base md:text-lg leading-relaxed">
                <p># Hi! ✨ 我是一名 <span className="bg-brand px-2 py-0.5 rounded border-2 border-black shadow-[2px_2px_0_#000]">CS 本科生</span>，热爱开源和编程。</p>
                <p>喜欢探索算法、C++、Rust 的底层奥秘，也热衷于捕捉 Web 世界里那些极其有趣的<span className="bg-[#FACC15] text-black px-2 py-0.5 rounded border-2 border-black shadow-[2px_2px_0_#000]">粗野主义 'X'</span>。</p>
              </div>
            </div>
          </div>

          {/* Info Bento Set Inside the Big Card */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
             {/* Name Box */}
            <div className="border-[4px] border-black p-3 md:p-4 rounded-2xl bg-white shadow-[4px_4px_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_#000] transition-all">
              <p className="text-[10px] md:text-xs font-black text-black/40 mb-1 tracking-widest">NAME</p>
              <p className="font-black text-black text-lg md:text-xl">abstract-chip</p>
            </div>
            {/* Location Box */}
            <div className="border-[4px] border-black p-3 md:p-4 rounded-2xl bg-white shadow-[4px_4px_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_#000] transition-all">
              <p className="text-[10px] md:text-xs font-black text-black/40 mb-1 tracking-widest">LOCATION</p>
              <p className="font-black text-black text-lg md:text-xl">China 🇨🇳</p>
            </div>
             {/* Skills Box */}
            <div className="border-[4px] border-black p-3 md:p-4 rounded-2xl bg-white shadow-[4px_4px_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_#000] transition-all flex flex-col justify-center">
              <p className="text-[10px] md:text-xs font-black text-black/40 mb-1 tracking-widest">SKILLS</p>
              <p className="font-black text-black text-xs md:text-sm uppercase leading-tight">C++ • Rust • React</p>
            </div>
            {/* Status Box */}
            <div className="border-[4px] border-black p-3 md:p-4 rounded-2xl bg-brand shadow-[4px_4px_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_#000] transition-all">
              <p className="text-[10px] md:text-xs font-black text-black/60 mb-1 tracking-widest">STATUS</p>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-black rounded-full animate-pulse"></div>
                <p className="font-black text-black text-lg md:text-xl uppercase">Online</p>
              </div>
            </div>
          </div>

          {/* Description Quote Box */}
          <div className="border-[4px] border-black rounded-2xl p-4 md:p-6 bg-black text-white relative overflow-hidden group">
            {/* Decor dots */}
            <div className="absolute top-4 right-4 flex gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
               <div className="w-2 h-2 bg-[#FACC15] rounded-full"></div>
               <div className="w-2 h-2 bg-brand rounded-full"></div>
            </div>
            <p className="font-bold text-base md:text-lg leading-relaxed tracking-wide z-10 relative">
              "这个网站是我的个人博客。<br/>记录学习轨迹，分享硬核技术，整理造过的各种轮子和项目。<br/>
              <span className="text-brand">Welcome to my Cyber Playground, let's build something cool! 🚀</span>"
            </p>
          </div>

          {/* Action Links */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-0">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"
              className="flex-1 border-[4px] border-black rounded-[1.25rem] bg-white hover:bg-[#FACC15] hover:text-black py-3 flex items-center justify-center gap-2 font-black text-black text-lg shadow-[6px_6px_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0_#000] active:translate-y-0 active:translate-x-0 active:shadow-[0_0_0_#000] transition-all">
              ⬡ GITHUB
            </a>
            <a href="https://bilibili.com" target="_blank" rel="noopener noreferrer"
              className="flex-1 border-[4px] border-black rounded-[1.25rem] bg-white hover:bg-[#FACC15] hover:text-black py-3 flex items-center justify-center gap-2 font-black text-black text-lg shadow-[6px_6px_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0_#000] active:translate-y-0 active:translate-x-0 active:shadow-[0_0_0_#000] transition-all">
              ▶ BILIBILI
            </a>
            <a href="mailto:hello@example.com"
              className="flex-1 border-[4px] border-black rounded-[1.25rem] bg-brand hover:bg-[#FF4D00] hover:text-white py-3 flex items-center justify-center gap-2 font-black text-black text-lg shadow-[6px_6px_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0_#000] active:translate-y-0 active:translate-x-0 active:shadow-[0_0_0_#000] transition-all group">
              ✉ <span className="group-hover:scale-110 transition-transform">EMAIL ME</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  )
}