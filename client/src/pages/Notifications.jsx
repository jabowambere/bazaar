import { useState } from 'react'

const mockNotifications = [
  { id: 1, text: 'John added a new product: Wireless Headphones', time: '2m ago', read: false, icon: '＋' },
  { id: 2, text: 'Sarah updated the price of MacBook Pro', time: '14m ago', read: false, icon: '✎' },
  { id: 3, text: 'Admin deleted product: Old Smartphone', time: '1h ago', read: false, icon: '🗑' },
  { id: 4, text: 'New message from Mike in Live Chat', time: '2h ago', read: true, icon: '💬' },
  { id: 5, text: 'Your product "Leather Jacket" got 3 views', time: '3h ago', read: true, icon: '👁' },
  { id: 6, text: 'Alex added a new product: Gaming Chair', time: '5h ago', read: true, icon: '＋' },
]

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications)

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const unread = notifications.filter(n => !n.read).length

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
        <div>
          <p style={{ margin: '0 0 4px', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Updates</p>
          <h1 style={{ margin: 0, color: '#fff8ef', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.04em', fontFamily: '"Instrument Serif", serif', fontWeight: 400 }}>
            Notifications {unread > 0 && <span style={{ fontSize: '1rem', background: '#d95f39', color: '#fff', borderRadius: '999px', padding: '2px 10px', verticalAlign: 'middle', fontFamily: 'Space Grotesk' }}>{unread}</span>}
          </h1>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} style={{
            padding: '10px 20px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.15)',
            background: 'transparent', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.88rem',
          }}>Mark all as read</button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {notifications.map(n => (
          <div key={n.id} onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))} style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            padding: '16px 20px', borderRadius: '18px', cursor: 'pointer',
            background: n.read ? 'rgba(255,250,242,0.04)' : 'rgba(217,95,57,0.1)',
            border: `1px solid ${n.read ? 'rgba(255,255,255,0.08)' : 'rgba(217,95,57,0.25)'}`,
            transition: 'all 180ms',
          }}>
            <span style={{
              width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
              background: n.read ? 'rgba(255,255,255,0.06)' : 'rgba(217,95,57,0.2)',
              display: 'grid', placeItems: 'center', fontSize: '1rem',
            }}>{n.icon}</span>
            <p style={{ margin: 0, flex: 1, color: n.read ? 'rgba(255,255,255,0.55)' : '#fff8ef', fontSize: '0.92rem' }}>{n.text}</p>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', flexShrink: 0 }}>{n.time}</span>
            {!n.read && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d95f39', flexShrink: 0 }} />}
          </div>
        ))}
      </div>
    </div>
  )
}
