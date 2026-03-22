import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useMemo } from 'react'
import { posts as mockEssays } from 'virtual:blog-posts'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function EssayDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const essay = useMemo(() => mockEssays.find(e => e.id === id), [id])
  const [showBackToTop, setShowBackToTop] = useState(false)
  
  // 用于存储动态获取的 Markdown 文本
  const [markdownContent, setMarkdownContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // 模拟生命周期：滚动监听
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 真正地去获取外部的 Markdown 文章
  useEffect(() => {
    let isMounted = true;
    if (!id) return;
    
    // 我们从 public/posts 目录下获取对应的 md 文件
    fetch(`/posts/${id}.md`)
      .then(res => {
        if (!res.ok) {
          return essay?.content || '## 404\n\nArticle source not found.';
        }
        return res.text();
      })
      .then(text => {
        if (isMounted) {
          setMarkdownContent(text);
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.error('Failed to fetch markdown', err);
        if (isMounted) {
          setMarkdownContent('## Error\n\nFailed to load content.');
          setIsLoading(false);
        }
      });
      
    return () => {
      isMounted = false;
    }
  }, [id, essay]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!essay) {
    return (
      <div className="min-h-screen bg-black pt-24 px-6 flex flex-col items-center justify-center">
        <h1 className="text-display text-4xl text-brand mb-4">404 NOT FOUND</h1>
        <p className="text-mono text-white/60 mb-8">The requested essay does not exist.</p>
        <button onClick={() => navigate('/essays')} className="text-brand hover:text-white transition-colors">
          ← BACK TO ESSAYS
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black px-4 md:px-8 pt-24 pb-20">
      {/* Background overlay */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-10 bg-cover bg-center bg-no-repeat w-full h-full"
        style={{ backgroundImage: 'url(/background.png)' }}
      />

      <div className="max-w-[1400px] mx-auto relative z-10 w-full flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        
        {/* 左侧主要内文区域 */}
        <div className="flex-1 w-full min-w-0 bg-white/5 border border-white/10 rounded-3xl p-6 md:p-12 lg:p-16 backdrop-blur-sm shadow-2xl relative overflow-hidden self-start">
          
          {/* 文章头部 */}
          <div className="mb-10 pb-8 border-b-2 border-white/10">
            <h1 className="text-display text-4xl md:text-5xl lg:text-5xl text-white mb-6 leading-tight tracking-tight">
              {essay.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-mono">
              <span className="text-black font-bold bg-brand border-2 border-brand px-3 py-1 rounded-[4px] shadow-[2px_2px_0px_#FFFFFF]">
                {essay.date}
              </span>
              <div className="flex gap-2">
                {essay.tags?.map(tag => (
                  <span key={tag} className="text-white/60 bg-white/5 border border-white/20 px-2 py-1 rounded-[4px] text-xs font-bold uppercase transition-colors hover:bg-white/20">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 首图 */}
          {essay.coverImage && (
             <div className="mb-10 rounded-2xl overflow-hidden border-2 border-white/20">
               <img src={essay.coverImage} alt="Cover" className="w-full min-h-[300px] object-cover hover:scale-105 transition-transform duration-700" />
             </div>
          )}

          {/* 内文 (真实加载，带加载动画与 Markdown 渲染) */}
          <div className="font-sans max-w-none text-white/90 selection:bg-brand selection:text-black min-h-[50vh]">
            {isLoading ? (
              <div className="flex flex-col gap-6 animate-pulse mt-8">
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                <div className="h-4 bg-white/10 rounded w-full"></div>
                <div className="h-4 bg-white/10 rounded w-5/6"></div>
                <div className="h-32 bg-white/10 rounded w-full mt-4"></div>
              </div>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({...props}) => <h1 className="text-4xl font-black text-white mt-16 mb-8 uppercase tracking-tight" {...props} />,
                  h2: ({...props}) => <h2 className="text-3xl font-black text-brand mt-14 mb-6 uppercase tracking-tight flex items-center gap-3 before:content-[''] before:block before:w-2 before:h-8 before:bg-brand" {...props} />,
                  h3: ({...props}) => <h3 className="text-2xl font-bold text-white mt-10 mb-4 pl-4 border-l-4 border-white/30" {...props} />,
                  p: ({...props}) => <p className="text-white/80 leading-relaxed text-lg mb-6 tracking-wide" {...props} />,
                  ul: ({...props}) => <ul className="list-disc list-inside text-white/80 ml-4 mb-6 space-y-2 text-lg marker:text-brand" {...props} />,
                  ol: ({...props}) => <ol className="list-decimal list-inside text-white/80 ml-4 mb-6 space-y-2 text-lg format-ol" {...props} />,
                  li: ({...props}) => <li className="pl-1" {...props} />,
                  a: ({...props}) => <a className="text-brand hover:text-white underline decoration-brand/50 hover:decoration-white underline-offset-4 font-bold transition-colors" target="_blank" {...props} />,
                  blockquote: ({...props}) => <blockquote className="border-l-4 border-brand bg-gradient-to-r from-brand/10 to-transparent p-6 my-8 italic text-white/70 rounded-r-2xl" {...props} />,
                  img: ({...props}) => <img className="rounded-2xl border-2 border-white/10 my-10 max-w-full h-auto hover:border-brand transition-colors" {...props} />,
                  hr: ({...props}) => <hr className="my-12 border-t-2 border-dashed border-white/20" {...props} />,
                  code: ({inline, className, children, ...props}: React.HTMLAttributes<HTMLElement> & { inline?: boolean, node?: unknown }) => {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <div className="my-10 border-2 border-white/10 rounded-2xl overflow-hidden shadow-[8px_8px_0_#000]">
                        <div className="bg-zinc-900 px-4 py-3 text-xs font-mono text-white/50 border-b border-white/10 flex items-center justify-between">
                          <span className="uppercase tracking-widest font-bold">{match[1]}</span>
                          <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-white/20 hover:bg-[#FF5F56] transition-colors" />
                            <div className="w-3 h-3 rounded-full bg-white/20 hover:bg-[#FFBD2E] transition-colors" />
                            <div className="w-3 h-3 rounded-full bg-white/20 hover:bg-[#27C93F] transition-colors" />
                          </div>
                        </div>
                        <SyntaxHighlighter
                          {...props}
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{ margin: 0, padding: '1.5rem', background: '#09090b', fontSize: '0.9rem' }}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className="bg-brand/20 text-brand px-2 py-1 rounded font-mono text-[0.9em] font-bold mx-1" {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {markdownContent}
              </ReactMarkdown>
            )}
          </div>

          {/* 底部导航 */}
          <div className="mt-24 pt-8 border-t-2 border-white/10 flex justify-between items-center">
            <button onClick={() => navigate('/essays')} className="text-mono font-bold text-white/50 hover:text-brand transition-colors uppercase tracking-widest flex items-center gap-2 group">
              <span className="group-hover:-translate-x-1 transition-transform">←</span> BACK TO ESSAYS
            </button>
            <div className="text-mono text-white/30 text-sm tracking-widest font-bold">
              // EOF
            </div>
          </div>
        </div>

        {/* 右侧 Sticky 侧边栏 */}
        <div className="w-full lg:w-[280px] shrink-0 sticky top-20 flex flex-col gap-6 self-start">
          
          {/* 用户名片 - 精简版正方形大头像，强制宽度和下方内容一致 */}
          <div className="w-full aspect-square bg-white border-[3px] border-black rounded-[2rem] shadow-[6px_6px_0_#FF4D00] transform transition-transform hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0_#FF4D00] p-2 group shrink-0">
            <div className="w-full h-full rounded-[1.5rem] overflow-hidden border-[3px] border-black relative bg-zinc-100 shadow-inner">
               <img src="/home-img/me.jpg" alt="Author" className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-out" />
            </div>
          </div>

          {/* 摘要与TOC容器 */}
          <div className="flex flex-col gap-4">
            {/* 摘要区块 */}
            <div className="bg-white/5 border-2 border-white/10 rounded-[2rem] p-6 hover:border-brand/50 transition-colors backdrop-blur-sm">
              <h4 className="text-mono font-bold text-white/40 mb-4 text-sm uppercase tracking-widest flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
                Summary
              </h4>
              <p className="text-white/80 text-sm leading-relaxed font-mono">
                {essay.summary || 'Fetching concepts and loading data structures... Stand by.'}
              </p>
            </div>

            {/* 目录 (TOC) 区块 */}
            <div className="bg-white/5 border-2 border-white/10 rounded-[2rem] p-6 hover:border-brand/50 transition-colors backdrop-blur-sm">
              <h4 className="text-mono font-bold text-white/40 mb-5 text-sm uppercase tracking-widest flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                Contents
              </h4>
              <div className="flex flex-col gap-3 font-mono text-sm leading-relaxed">
                <div className="text-brand font-bold pl-3 border-l-2 border-brand cursor-pointer">
                   {'>'} Introduction
                </div>
                <div className="text-white/50 hover:text-white pl-3 border-l-2 border-transparent cursor-pointer transition-colors">
                   {'>'} Architecture Data
                </div>
                <div className="text-white/50 hover:text-white pl-3 border-l-2 border-transparent cursor-pointer transition-colors">
                   {'>'} Concluding Remarks
                </div>
              </div>
            </div>
          </div>
          
          {/* 浮动点赞和数字 */}
          <div className="flex gap-4 mt-2 justify-end items-center mr-2">
            <div className="text-mono font-bold text-white/60 bg-white/5 rounded-full px-5 py-2.5 border border-white/10 shadow-inner">
               2661
            </div>
            <div className="w-12 h-12 rounded-full bg-white border border-transparent hover:border-brand hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_#FF4D00] group/heart">
               <span className="text-xl group-hover/heart:scale-110 transition-transform">❤️</span>
            </div>
          </div>
        </div>
      </div>

      {/* 滚动回顶按钮 */}
      <div 
        className={`fixed bottom-10 right-6 md:right-10 z-50 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          showBackToTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
        }`}
      >
        <button 
          onClick={scrollToTop}
          className="w-14 h-14 bg-black rounded-full border-2 border-brand flex items-center justify-center shadow-[0_0_15px_rgba(255,77,0,0.5)] hover:bg-brand hover:scale-110 active:scale-95 transition-all group overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-brand translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <span className="text-brand group-hover:text-black font-black text-2xl relative z-10 group-hover:-translate-y-1 transition-transform">↑</span>
        </button>
      </div>
    </div>
  )
}