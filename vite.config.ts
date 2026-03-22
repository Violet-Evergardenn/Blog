import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'
import fm from 'front-matter'

// Virtual module plugin to generate blog post list from /public/posts/*.md
function generateBlogIndex() {
  return {
    name: 'generate-blog-index',
    resolveId(id: string) {
      if (id === 'virtual:blog-posts') {
        return '\0virtual:blog-posts'
      }
    },
    load(id: string) {
      if (id === '\0virtual:blog-posts') {
        const postsDir = path.resolve(__dirname, 'public/posts')
        if (!fs.existsSync(postsDir)) {
          return `export const posts = []`
        }
        
        const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'))
        const posts = files.map(file => {
          const filePath = path.join(postsDir, file)
          this.addWatchFile(filePath) // 让 Vite 监听该文件的变化
          const content = fs.readFileSync(filePath, 'utf-8')
          const parsed = fm(content)
          return {
            id: file.replace('.md', ''),
            ...(parsed.attributes as any)
          }
        })
        
        // Sort by date DESC
        posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        
        return `export const posts = ${JSON.stringify(posts)}`
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), generateBlogIndex()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})