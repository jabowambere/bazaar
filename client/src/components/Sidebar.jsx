import { NavLink } from 'react-router-dom'
import { Home, Grid, Package, ShoppingCart, MessagesSquare, Bell, User, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

const userLinks = [
  { to: '/dashboard', icon: <Home size={18} />, label: 'Dashboard' },
  { to: '/browse', icon: <Grid size={18} />, label: 'Browse Products' },
  { to: '/my-products', icon: <Package size={18} />, label: 'My Products' },
  { to: '/cart', icon: <ShoppingCart size={18} />, label: 'My Cart' },
  { to: '/chat', icon: <MessagesSquare size={18} />, label: 'Live Chat' },
  { to: '/notifications', icon: <Bell size={18} />, label: 'Notifications' },
  { to: '/profile', icon: <User size={18} />, label: 'Profile' },
]

const adminLinks = [
  { to: '/dashboard', icon: <Home size={18} />, label: 'Dashboard' },
  { to: '/browse', icon: <Grid size={18} />, label: 'Browse Products' },
  { to: '/chat', icon: <MessagesSquare size={18} />, label: 'Live Chat' },
  { to: '/notifications', icon: <Bell size={18} />, label: 'Notifications' },
  { to: '/profile', icon: <User size={18} />, label: 'Profile' },
]

export default function Sidebar({ unreadCount = 0, cartCount = 0, onLogout, user }) {
  const links = user?.role === 'admin' ? adminLinks : userLinks
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mobile-menu-btn"
        style={{
          display: 'none',
          position: 'fixed',
          top: '16px',
          left: '16px',
          zIndex: 1001,
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          border: 'none',
          background: 'linear-gradient(135deg, #d95f39, #9f3518)',
          color: '#fff8ef',
          cursor: 'pointer',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(159,53,24,0.3)',
        }}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 999,
            display: 'none',
          }}
          className="mobile-overlay"
        />
      )}

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`} style={{
      width: '240px', minHeight: '100vh',
      background: 'rgba(255,250,242,0.08)', backdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(255,255,255,0.1)',
      display: 'flex', flexDirection: 'column',
      padding: '28px 0', position: 'fixed', top: 0, left: 0, zIndex: 10,
    }}>
      <div style={{ padding: '0 24px 28px' }}>
        <img src="/src/assets/bazaar.png" alt="Bazaar" style={{ width: '52px', borderRadius: '12px' }} />
      </div>

      {user && (
        <div style={{ padding: '0 16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '14px', background: 'rgba(255,255,255,0.06)' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #d95f39, #9f3518)', display: 'grid', placeItems: 'center', color: '#fff8ef', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ margin: 0, color: '#fff8ef', fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</p>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', textTransform: 'capitalize' }}>{user.role}</p>
            </div>
          </div>
        </div>
      )}

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 12px' }}>
        {links.map(({ to, icon, label }) => (
          <NavLink key={to} to={to} onClick={() => setIsOpen(false)} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 16px', borderRadius: '14px',
            color: isActive ? '#fff8ef' : 'rgba(255,248,239,0.55)',
            background: isActive ? 'linear-gradient(135deg, #d95f39, #9f3518)' : 'transparent',
            fontWeight: isActive ? 600 : 400, fontSize: '0.95rem',
            textDecoration: 'none', transition: 'all 180ms', position: 'relative',
          })}>
            <span style={{ fontSize: '1.1rem' }}>{icon}</span>
            {label}
            {label === 'Notifications' && unreadCount > 0 && (
              <span style={{ marginLeft: 'auto', background: '#d95f39', color: '#fff', borderRadius: '999px', padding: '2px 8px', fontSize: '0.72rem', fontWeight: 700 }}>{unreadCount}</span>
            )}
            {label === 'My Cart' && cartCount > 0 && (
              <span style={{ marginLeft: 'auto', background: '#d95f39', color: '#fff', borderRadius: '999px', padding: '2px 8px', fontSize: '0.72rem', fontWeight: 700 }}>{cartCount}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '16px 12px 0', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '12px' }}>
        <button onClick={onLogout} style={{
          width: '100%', padding: '11px 16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(143,39,22,0.12)', color: '#d95f39', cursor: 'pointer', fontSize: '0.9rem',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}><LogOut size={16} /> Sign out</button>
      </div>
    </aside>
    </>
  )
}
