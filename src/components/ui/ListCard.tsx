import React from 'react'

interface ListCardProps {
  title: string
  description: string
  url: string
  tags?: string[]
  icon?: string
  avatar?: string
  badge?: string | number
}

export default function ListCard({
  title,
  description,
  url,
  tags,
  icon,
  avatar,
  badge
}: ListCardProps) {
  const isImageIcon = Boolean(icon) && /^(https?:\/\/|\/|\.\/|\.\.\/)/.test(icon ?? '')

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block border-[4px] border-black bg-white rounded-[1.5rem] p-5 md:p-6 shadow-[8px_8px_0_#000] hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[16px_16px_0_#FF4D00] active:translate-y-0 active:translate-x-0 active:shadow-[0_0_0_#000] transition-all flex flex-col h-full group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4 gap-4">
        <div className="flex items-center gap-4">
          {/* Avatar (for Blogroll) */}
          {avatar && (
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-[1rem] border-[3px] border-black overflow-hidden shrink-0 shadow-[4px_4px_0_#000]">
              <img src={avatar} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
          )}
          {/* Icon (for Projects) */}
          {icon && !avatar && (
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-[1rem] border-[3px] border-black bg-brand flex items-center justify-center text-3xl md:text-4xl shrink-0 shadow-[4px_4px_0_#000] group-hover:rotate-12 group-hover:bg-[#FACC15] transition-all">
              {isImageIcon ? (
                <img
                  src={icon}
                  alt={`${title} icon`}
                  className="w-full h-full object-cover rounded-[0.65rem]"
                />
              ) : (
                icon
              )}
            </div>
          )}
          
          <h3 className="text-xl md:text-2xl font-black text-black group-hover:text-brand transition-colors line-clamp-2">
            {title}
          </h3>
        </div>
        
        {/* Top Right Badge (Year / Status) */}
        {badge && (
          <span className="border-[3px] border-black rounded-lg px-2 py-1 text-sm font-black bg-[#FACC15] text-black shadow-[2px_2px_0_#000] shrink-0 rotate-2 group-hover:-rotate-2 transition-transform">
            {badge}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-black font-bold text-sm md:text-base leading-relaxed flex-1 mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
        {description}
      </p>

      {/* Tags Footer */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t-[3px] border-black border-dashed">
          {tags.map((tag, idx) => (
            <span key={idx} className="border-2 border-black bg-[#f0f0f0] group-hover:bg-[#FACC15] px-2 py-1 text-xs font-black text-black rounded-md shadow-[2px_2px_0_#000]">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </a>
  )
}
