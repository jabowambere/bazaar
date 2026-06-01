const activities = [
  { icon: '＋', text: 'You listed a new product', time: '2m ago', color: '#d95f39' },
  { icon: '✎', text: 'Price updated on MacBook Pro', time: '14m ago', color: '#9f3518' },
  { icon: '🛒', text: 'Item added to cart', time: '1h ago', color: '#d95f39' },
  { icon: '💬', text: 'New message from Mike', time: '2h ago', color: '#9f3518' },
  { icon: '🗑', text: 'Product removed from listing', time: '5h ago', color: '#d95f39' },
]

export default function ActivityFeed() {
  return (
    <div style={{
      background: 'rgba(255,250,242,0.06)',
      backdropFilter: 'blur(18px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '24px',
      padding: '24px',
    }}>
      <p style={{ margin: '0 0 20px', fontWeight: 700, color: '#fff8ef', fontSize: '1rem' }}>Recent Activity</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {activities.map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: `${a.color}22`, display: 'grid', placeItems: 'center', fontSize: '1rem', flexShrink: 0
            }}>{a.icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, color: '#fff8ef', fontSize: '0.9rem' }}>{a.text}</p>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', flexShrink: 0 }}>{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
