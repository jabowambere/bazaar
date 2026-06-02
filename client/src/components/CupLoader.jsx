export default function CupLoader({ fullScreen = false }) {
  const wrapper = fullScreen ? {
    position: 'fixed', inset: 0, zIndex: 999,
    display: 'grid', placeItems: 'center',
    background: 'rgba(255,248,240,0.85)', backdropFilter: 'blur(6px)',
  } : {
    display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '48px 0'
  }

  return (
    <div style={wrapper}>
      <div className="cup-loader">
        <div className="cup">
          <div className="cup-handle"></div>
          <div className="smoke one"></div>
          <div className="smoke two"></div>
          <div className="smoke three"></div>
        </div>
        <div className="load">..........................</div>
      </div>
    </div>
  )
}
