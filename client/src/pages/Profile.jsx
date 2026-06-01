export default function Profile() {
  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <p style={{ margin: '0 0 4px', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Account</p>
        <h1 style={{ margin: 0, color: '#fff8ef', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.04em', fontFamily: '"Instrument Serif", serif', fontWeight: 400 }}>My Profile</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', alignItems: 'start' }}>
        <div style={{
          padding: '28px', borderRadius: '24px', textAlign: 'center',
          background: 'rgba(255,250,242,0.07)', backdropFilter: 'blur(18px)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{
            width: '88px', height: '88px', borderRadius: '50%', margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #d95f39, #9f3518)',
            display: 'grid', placeItems: 'center', fontSize: '2rem', color: '#fff8ef',
          }}>U</div>
          <p style={{ margin: '0 0 4px', color: '#fff8ef', fontWeight: 700, fontSize: '1.1rem' }}>User Name</p>
          <p style={{ margin: '0 0 20px', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>user@email.com</p>
          <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            {[['12', 'Listings'], ['3', 'In Cart'], ['48', 'Views']].map(([val, label]) => (
              <div key={label}>
                <strong style={{ display: 'block', color: '#d95f39', fontSize: '1.3rem' }}>{val}</strong>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          padding: '28px', borderRadius: '24px',
          background: 'rgba(255,250,242,0.07)', backdropFilter: 'blur(18px)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <p style={{ margin: '0 0 20px', fontWeight: 700, color: '#fff8ef', fontSize: '1rem' }}>Edit Profile</p>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[['Full Name', 'text', 'User Name'], ['Email', 'email', 'user@email.com'], ['Phone', 'tel', '+1 234 567 890']].map(([label, type, placeholder]) => (
              <label key={label} style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem', fontWeight: 500 }}>
                {label}
                <input type={type} defaultValue={placeholder} style={{
                  padding: '12px 16px', borderRadius: '14px',
                  border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.07)',
                  color: '#fff8ef', outline: 'none', fontSize: '0.92rem',
                }} />
              </label>
            ))}
            <button style={{
              marginTop: '8px', padding: '14px', borderRadius: '999px', border: 'none',
              background: 'linear-gradient(135deg, #d95f39, #9f3518)',
              color: '#fff8ef', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem',
              boxShadow: '0 8px 24px rgba(159,53,24,0.3)',
            }}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  )
}
