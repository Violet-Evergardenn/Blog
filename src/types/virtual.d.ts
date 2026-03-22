declare module 'virtual:blog-posts' {
  export const posts: Array<{
    id: string
    title: string
    date: string
    summary: string
    tags: string[]
    readTime: number
    views: number
    content?: string
    coverImage?: string
  }>
}