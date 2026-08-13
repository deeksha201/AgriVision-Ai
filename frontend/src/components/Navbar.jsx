import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { HiMenu, HiX } from 'react-icons/hi'
import { PiLeafFill, PiShareFatFill } from 'react-icons/pi'
import ShareModal from './ShareModal'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  const isActive = (path) => location.pathname === path

  return (
    <nav
      className={`animate-fade-in-down`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: scrolled ? '12px 32px' : '16px 32px',
        background: scrolled ? 'rgba(255,255,255,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(6,95,70,0.08)' : '1px solid transparent',
        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.04)' : 'none',
      }}
    >
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            textDecoration: 'none',
            fontWeight: 800,
            fontSize: '1.35rem',
            color: 'var(--color-primary)',
          }}
        >
          <PiLeafFill style={{ fontSize: '1.6rem', color: 'var(--color-primary-light)' }} />
          AgriVision<span style={{ color: 'var(--color-primary-light)', fontWeight: 600 }}>AI</span>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
        className="nav-desktop"
        >
          <NavLink to="/" label="Home" active={isActive('/')} />
          <button
            onClick={() => setShareOpen(true)}
            className="btn btn-ghost"
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}
          >
            <PiShareFatFill style={{ color: 'var(--color-primary)' }} /> Share
          </button>
          <NavLink to="/login" label="Login" active={isActive('/login')} />
          <Link
            to="/register"
            className="btn btn-primary btn-sm"
            style={{ marginLeft: 8 }}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="nav-mobile-toggle"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            color: 'var(--color-primary)',
            cursor: 'pointer',
            padding: 8,
          }}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="animate-fade-in-down"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--color-border)',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <Link to="/" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>Home</Link>
          <button onClick={() => setShareOpen(true)} className="btn btn-ghost" style={{ justifyContent: 'flex-start', gap: 8 }}>
            <PiShareFatFill style={{ color: 'var(--color-primary)' }} /> Share Website
          </button>
          <Link to="/login" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>Login</Link>
          <Link to="/register" className="btn btn-primary" style={{ marginTop: 8 }}>Get Started</Link>
        </div>
      )}

      <ShareModal isOpen={shareOpen} onClose={() => setShareOpen(false)} />

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  )
}

function NavLink({ to, label, active }) {
  return (
    <Link
      to={to}
      style={{
        padding: '8px 16px',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.9rem',
        fontWeight: active ? 600 : 500,
        color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)',
        textDecoration: 'none',
        background: active ? 'rgba(16,185,129,0.08)' : 'transparent',
        transition: 'all 200ms',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.target.style.background = 'rgba(6,95,70,0.06)'
          e.target.style.color = 'var(--color-primary)'
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.target.style.background = 'transparent'
          e.target.style.color = 'var(--color-text-secondary)'
        }
      }}
    >
      {label}
    </Link>
  )
}

export default Navbar
