import { NavLink } from 'react-router-dom'
import { useState } from 'react'

const navLinks = [
  { to: '/', label: 'HOME' },
  { to: '/essays', label: 'ESSAYS' },
  { to: '/projects', label: 'PROJECTS' },
  { to: '/about', label: 'ABOUT' },
  { to: '/pictures', label: 'GALLERY' },
  { to: '/live2d', label: 'LIVE2D' },
]

const socialLinks = [
  { href: 'https://github.com', label: 'GH' },
  { href: 'https://bilibili.com', label: 'BL' },
  { href: 'mailto:hello@example.com', label: '✉' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-4 left-0 right-0 z-50 flex items-center px-4 md:px-6">
        {/* Left: Logo */}
        <NavLink
          to="/"
          className="text-mono text-sm font-bold text-white px-2 py-1.5 rounded-full border border-transparent hover:bg-white hover:text-black transition-all duration-150 inline-flex items-center gap-2"
        >
          <img
            src="/blog-img/blog-img-020.webp"
            alt="AbstractChip logo"
            className="w-6 h-6 rounded-full object-cover border border-white/30"
          />
          ABSTRACT-CHIP
        </NavLink>

        {/* Center: Pill navigation - 仅桌面端显示，相对于视口真正居中 */}
        <div className="hidden md:flex fixed left-1/2 -translate-x-1/2 top-4 bg-black border border-white/20 rounded-full px-1 py-1 items-center gap-0.5">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `text-mono text-xs font-bold px-4 py-2 rounded-full transition-all duration-150 ${
                  isActive
                    ? 'bg-white text-black'
                    : 'text-white/80 hover:bg-white hover:text-black'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Right */}
        <div className="ml-auto flex items-center gap-2">
          {/* 社交链接 - 仅桌面端 */}
          <div className="hidden md:flex items-center gap-2">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-mono text-xs text-white/60 px-2 py-1.5 rounded hover:bg-white hover:!text-black transition-all duration-150"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* 汉堡菜单按钮 - 仅移动端 */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-full border border-white/20 bg-black hover:bg-white group transition-all duration-150"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <span className="w-4 h-0.5 bg-white group-hover:bg-black transition-colors" />
            <span className="w-4 h-0.5 bg-white group-hover:bg-black transition-colors" />
          </button>
        </div>
      </nav>

      {/* 全屏移动端导航遮罩 */}
      <div
        className={`fixed inset-0 z-[200] bg-black flex flex-col transition-all duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* 顶部关闭按钮 */}
        <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b border-white/10">
          <span className="text-mono text-sm font-bold text-white inline-flex items-center gap-2">
            <img
              src="/blog-img/blog-img-020.webp"
              alt="AbstractChip logo"
              className="w-6 h-6 rounded-full object-cover border border-white/30"
            />
            ABSTRACT-CHIP
          </span>
          <button
            className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-150"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* 导航链接列表 */}
        <nav className="flex-1 flex flex-col justify-center px-8 gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `text-display text-5xl font-black tracking-tight transition-all duration-150 py-2 ${
                  isActive ? 'text-brand' : 'text-white/80 hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* 底部社交链接 */}
        <div className="flex items-center gap-6 px-8 pb-10 pt-4 border-t border-white/10">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-mono text-sm font-bold text-white/60 hover:text-brand transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </>
  )
}
