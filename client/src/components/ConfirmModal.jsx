import { TriangleAlert, Trash2, CheckCircle } from 'lucide-react'

export default function ConfirmModal({ title, message, confirmLabel = 'Confirm', type = 'danger', onConfirm, onCancel }) {
  const colors = {
    danger: { bg: 'rgba(143,39,22,0.15)', border: 'rgba(159,53,24,0.3)', icon: '#d95f39', button: 'linear-gradient(135deg, #d95f39, #9f3518)' },
    warning: { bg: 'rgba(234,179,8,0.12)', border: 'rgba(234,179,8,0.3)', icon: '#eab308', button: 'linear-gradient(135deg, #eab308, #ca8a04)' },
    success: { bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)', icon: '#22c55e', button: 'linear-gradient(135deg, #22c55e, #16a34a)' },
  }
  const c = colors[type]

  const Icon = type === 'success' ? CheckCircle : TriangleAlert

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'grid', placeItems: 'center', padding: '20px',
      background: 'rgba(26,24,21,0.75)', backdropFilter: 'blur(10px)',
    }} onClick={e => e.target === e.currentTarget && onCancel()}>
      <div style={{
        width: 'min(100%, 420px)', padding: '32px', borderRadius: '28px',
        background: '#FFF8F0', boxShadow: '0 32px 80px rgba(0,0,0,0.3)',
        border: '1px solid rgba(0,0,0,0.06)',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: c.bg, border: `1px solid ${c.border}`, display: 'grid', placeItems: 'center' }}>
            <Icon size={28} color={c.icon} />
          </div>

          <div>
            <h3 style={{ margin: '0 0 8px', color: '#1a1815', fontSize: '1.15rem', fontWeight: 700 }}>{title}</h3>
            <p style={{ margin: 0, color: '#6f665d', fontSize: '0.92rem', lineHeight: 1.6 }}>{message}</p>
          </div>

          <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '8px' }}>
            <button onClick={onCancel} style={{
              flex: 1, padding: '13px', borderRadius: '14px',
              border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(0,0,0,0.04)',
              color: '#6f665d', cursor: 'pointer', fontWeight: 600, fontSize: '0.92rem',
            }}>Cancel</button>
            <button onClick={onConfirm} style={{
              flex: 1, padding: '13px', borderRadius: '14px', border: 'none',
              background: c.button, color: '#fff', cursor: 'pointer',
              fontWeight: 700, fontSize: '0.92rem',
              boxShadow: '0 4px 16px rgba(159,53,24,0.25)',
            }}>{confirmLabel}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
