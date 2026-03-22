import { mockBlogLinks } from '@/data/bloglinks'
import ListCard from '@/components/ui/ListCard'

export default function Blogroll() {
  return (
    <div className="min-h-screen bg-black px-6 pt-24 pb-20 relative">
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/background.png)' }}
      />
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Banner Title */}
        <div className="mb-12 border-[4px] border-black p-8 md:p-12 bg-white rounded-[2rem] shadow-[16px_16px_0_#FF4D00] md:shadow-[24px_24px_0_#FF4D00]">
          <h1 className="text-display text-5xl md:text-7xl text-black mb-4 uppercase">LINKS</h1>
          <p className="text-black font-black text-xl md:text-2xl bg-[#FACC15] inline-block px-4 py-1 border-[3px] border-black rounded-lg shadow-[4px_4px_0_#000] rotate-1">
            FRIENDS & INSPIRATIONS 🔗
          </p>
        </div>

        {/* Blogroll Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {mockBlogLinks.map(link => (
            <ListCard 
              key={link.id}
              title={link.name}
              description={link.description}
              url={link.url}
              avatar={link.avatar}
            />
          ))}
        </div>
        
      </div>
    </div>
  )
}