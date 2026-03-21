export interface Essay {
  id: string
  title: string
  date: string
  content: string
  tags: string[]
  summary: string
  coverImage?: string
  isRead: boolean
}