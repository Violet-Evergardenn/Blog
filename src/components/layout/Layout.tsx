import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './Navbar'
import BootScreen from '../ui/BootScreen'
import { mockPictures } from '@/data'

export default function Layout() {
  // 全局后台预加载图片以避免闪烁
  useEffect(() => {
    // 将要在应用中使用的重要图片预加载请求放入空闲回调中
    // 避免阻塞主线程和首屏渲染
    const preloadImportantImages = () => {
      // 需要预加载的图片列表
      const imagesToPreload = [
        '/home-img/me.jpg',
        '/background.png',
        ...mockPictures.map(p => p.src)
      ]

      imagesToPreload.forEach(src => {
        const img = new Image()
        img.src = src
      })
    }

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(preloadImportantImages)
    } else {
      setTimeout(preloadImportantImages, 1000)
    }
  }, [])

  return (
    <div className="min-h-screen bg-black">
      <BootScreen />
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}