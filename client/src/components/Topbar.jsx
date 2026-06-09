import { useState } from 'react'
import logo from '../assets/bazaar.png'

export default function Topbar({ onAddProduct, onLoginClick, onSignupClick }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '18px 0', position: 'relative' }}>
      <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}>
        <img src={logo} alt="Bazaar" className="topbar-logo" style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }} />
        <span style={{ fontFamily: '"Grand Hotel", cursive', fontSize: '2rem', color: '#9f3518', lineHeight: 1 }}>Bazaar</span>
      </a>

      {/* Desktop nav */}
      <div className="topbar-nav" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <a href="#explore" className="ghost-button">Explore</a>
        <a href="#faq" className="ghost-button">FAQ</a>
        <a href="#newsletter" className="ghost-button">Updates</a>
        <button className="ghost-button" type="button" onClick={onLoginClick}>Sign In</button>
        <button className="solid-button" type="button" onClick={onSignupClick}>Get Started</button>
      </div>

      {/* Mobile hamburger */}
      <button
        className="topbar-hamburger"
        onClick={() => setMenuOpen(o => !o)}
        style={{ display: 'none', background: 'transparent', border: '1px solid rgba(159,53,24,0.3)', borderRadius: '10px', padding: '8px 12px', cursor: 'pointer', fontSize: '1.2rem', color: '#9f3518' }}
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="topbar-dropdown" style={{
          position: 'absolute', top: '100%', right: 0, zIndex: 100,
          background: 'rgba(255,250,244,0.97)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(159,53,24,0.15)', borderRadius: '18px',
          padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px',
          minWidth: '200px', boxShadow: '0 12px 40px rgba(48,31,12,0.15)'
        }}>
          <a href="#explore" className="ghost-button" onClick={() => setMenuOpen(false)} style={{ textAlign: 'center' }}>Explore</a>
          <a href="#faq" className="ghost-button" onClick={() => setMenuOpen(false)} style={{ textAlign: 'center' }}>FAQ</a>
          <a href="#newsletter" className="ghost-button" onClick={() => setMenuOpen(false)} style={{ textAlign: 'center' }}>Updates</a>
          <button className="ghost-button" type="button" onClick={() => { setMenuOpen(false); onLoginClick() }} style={{ width: '100%' }}>Sign In</button>
          <button className="solid-button" type="button" onClick={() => { setMenuOpen(false); onSignupClick() }} style={{ width: '100%' }}>Get Started</button>
        </div>
      )}
    </div>
  )
}
