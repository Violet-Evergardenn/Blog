import { useState, useMemo } from 'react'
import { posts as mockEssays } from 'virtual:blog-posts'
import EssayCard from '@/components/ui/EssayCard'

export default function Essays() {
  const [activeTab, setActiveTab] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const tabs = ['ALL', 'TECH', 'LIFE', 'ALGORITHM']

  // Filter and search logic
  const filteredEssays = useMemo(() => {
    return mockEssays.filter(essay => {
      // 1. Tag filtering
      const matchesTab = activeTab === 'ALL' || (essay.tags && essay.tags.some(tag => tag.toUpperCase() === activeTab))
      // 2. Search filtering (check title and summary)
      const query = searchQuery.toLowerCase().trim()
      const matchesSearch = !query || 
                            essay.title.toLowerCase().includes(query) || 
                            essay.summary.toLowerCase().includes(query)
                            
      return matchesTab && matchesSearch
    })
  }, [activeTab, searchQuery])

  return (
    <div className="min-h-screen bg-black px-6 pt-24 pb-20 relative">
      {/* Background Image Overlay */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-15 bg-cover bg-center bg-no-repeat w-full h-full"
        style={{ backgroundImage: 'url(/background.png)' }}
      />
      
      <div className="max-w-4xl mx-auto relative z-10 w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/20 pb-8 flex-wrap">
          <div>
            <h1 className="text-display text-5xl md:text-7xl text-white mb-2 tracking-tight">ESSAYS</h1>
          </div>

          {/* Search Box - Cyberpunk Style */}
          <div className="relative w-full md:w-72 mt-4 md:mt-0 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-brand transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="Search essays..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border-2 border-white/20 text-white placeholder-white/40 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand focus:bg-white/10 transition-all font-mono"
            />
            {/* Blinking cursor effect fake element */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-4 bg-brand animate-pulse opacity-0 group-focus-within:opacity-100"></div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-mono text-xs md:text-sm font-bold px-5 py-2.5 rounded-full transition-all duration-300 border-2 ${
                activeTab === tab
                  ? 'border-brand bg-brand text-black shadow-[0_0_15px_rgb(255,77,0,0.4)]'
                  : 'border-white/20 bg-transparent text-white/60 hover:text-white hover:border-white/50 hover:bg-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Article list */}
        <div className="flex flex-col relative">
           {/* Results count */}
           <div className="text-white/40 font-mono text-xs mb-4 text-right">
             Found {filteredEssays.length} results
           </div>

           {filteredEssays.length > 0 ? (
             filteredEssays.map((essay, index) => (
               <EssayCard 
                 key={essay.id}
                 index={index + 1}
                 {...essay}
               />
             ))
           ) : (
             <div className="py-20 text-center border-2 border-dashed border-white/20 rounded-2xl bg-white/5">
                <div className="text-4xl mb-4">📭</div>
                <p className="text-white/60 font-mono text-lg">No essays found matching "{searchQuery}"</p>
                <button 
                  onClick={() => {setSearchQuery(''); setActiveTab('ALL')}}
                  className="mt-4 text-brand hover:text-white hover:underline underline-offset-4 transition-colors font-mono"
                >
                  Clear filters
                </button>
             </div>
           )}
        </div>
        
      </div>
    </div>
  )
}