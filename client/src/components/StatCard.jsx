export default function StatCard({ icon, label, value, accent }) {
  return (
    <div style={{
      padding: '24px', borderRadius: '24px',
      background: accent ? 'linear-gradient(135deg, #d95f39, #9f3518)' : 'rgba(255,250,242,0.08)',
      backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.1)',
      display: 'flex', flexDirection: 'column', gap: '12px',
    }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '14px',
        background: accent ? 'rgba(255,255,255,0.15)' : 'rgba(217,95,57,0.15)',
        display: 'grid', placeItems: 'center',
        color: accent ? '#fff8ef' : '#d95f39',
      }}>{icon}</div>
      <div>
        <p style={{ margin: 0, color: accent ? 'rgba(255,248,239,0.75)' : 'rgba(255,255,255,0.55)', fontSize: '0.85rem' }}>{label}</p>
        <strong style={{ fontSize: '2rem', color: '#fff8ef', letterSpacing: '-0.04em' }}>{value}</strong>
      </div>
    </div>
  )
}
