export default function LoadingSpinner() {
  return (
    <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
      <div style={{
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        border: '3px solid var(--line)',
        borderTopColor: 'var(--accent)',
        animation: 'spin 0.7s linear infinite'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
