import { NavLink } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'HOME' },
  { to: '/essays', label: 'ESSAYS' },
  { to: '/projects', label: 'PROJECTS' },
  { to: '/about', label: 'ABOUT' },
  { to: '/pictures', label: 'GALLERY' },
  { to: '/blogroll', label: 'LINKS' },
]

const socialLinks = [
  { href: 'https://github.com', label: 'GH' },
  { href: 'https://bilibili.com', label: 'BL' },
  { href: 'mailto:hello@example.com', label: '✉' },
]

export default function Navbar() {
  return (
    <nav className="fixed top-4 left-0 right-0 z-50 flex items-center justify-between px-6">
      {/* Left: Logo */}
      <NavLink to="/" className="text-mono text-sm font-bold text-white hover:text-brand transition-colors duration-150">
        IVY-NEKO
      </NavLink>

      {/* Center: Pill navigation */}
      <div className="bg-black border border-white/20 rounded-full px-1 py-1 flex items-center gap-0.5">
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

      {/* Right: Social links */}
      <div className="flex items-center gap-3">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-mono text-xs text-white/60 hover:text-brand transition-colors duration-150"
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  )
}