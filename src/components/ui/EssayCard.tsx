import { Link } from 'react-router-dom'

interface EssayCardProps {
  id: string
  title: string
  date: string
  summary: string
  tags?: string[]
  isRead?: boolean
  coverImage?: string
}

export default function EssayCard({
  id,
  title,
  date,
  summary,
  isRead,
  index = 1
}: EssayCardProps & { index?: number }) {
  const formattedIndex = index.toString().padStart(2, '0')

  return (
    <Link 
      to={`/essays/${id}`} 
      className="group block w-full border-t border-white/20 last:border-b py-8 px-4 md:px-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 z-10"
    >
      {/* 从左往右的填充背景 */}
      <div className="absolute inset-0 bg-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out -z-10"></div>

      <div className="flex flex-row items-center gap-6 md:gap-10 flex-1 min-w-0">
        {/* 序号 - 使用普通的无填充文字，hover时填满主题色 */}
        <div className="text-5xl md:text-6xl font-display leading-none shrink-0 border-none">
          <span className="text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.6)] group-hover:[-webkit-text-stroke:0px] group-hover:text-brand transition-all duration-500 inline-block">
            {formattedIndex}
          </span>
        </div>

        {/* 标题 & 摘要 */}
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <h2 className="text-2xl md:text-3xl font-bold text-white group-hover:text-black transition-colors duration-500 truncate w-full">
            {title}
          </h2>
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-white/60 group-hover:text-black/70 font-mono text-sm transition-colors duration-500 truncate w-full md:w-auto">
              + {(summary || '').substring(0, 50)}{(summary || '').length > 50 ? '...' : ''} +
            </p>
            {!isRead && (
              <span className="bg-brand text-black text-[10px] font-black px-2 py-0.5 rounded-sm shrink-0">
                NEW
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 日期 */}
      <div className="shrink-0 text-white/60 group-hover:text-black/80 font-mono text-sm md:text-base transition-colors duration-500 self-end md:self-center ml-20 md:ml-0">
        {date}
      </div>
    </Link>
  )
}
