import logo from '../assets/bazaar.png'

export default function Footer() {
  return (
    <footer style={{
      marginTop: '60px',
      borderTop: '1px solid var(--line)',
      padding: '40px 0 28px',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '32px', marginBottom: '40px' }}>
        <div>
          <div className="brand" style={{ marginBottom: '14px' }}>
            <img src={logo} alt="Bazaar" style={{ width: '100px', height: '100px', borderRadius: '15px', objectFit: 'cover' }} />
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.7', maxWidth: '30ch', margin: 0 }}>
            A curated storefront for premium digital assets, built for collectors and creators.
          </p>
        </div>

        <div>
          <p style={{ color: '#9f3518',fontWeight: 700, marginBottom: '14px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Catalog</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {['Explore', 'Collections', 'New Arrivals', 'Featured'].map(item => (
              <li key={item}><a href="#" style={{ color: 'var(--muted)', fontSize: '0.95rem', transition: 'color 180ms' }}>{item}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <p style={{ color: '#9f3518',fontWeight: 700, marginBottom: '14px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Membership</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {['Starter', 'Pro', 'Studio', 'Activate License'].map(item => (
              <li key={item}><a href="#" style={{ color: 'var(--muted)', fontSize: '0.95rem', transition: 'color 180ms' }}>{item}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <p style={{ color: '#9f3518',fontWeight: 700, marginBottom: '14px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Company</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {['About', 'Blog', 'Careers', 'Contact'].map(item => (
              <li key={item}><a href="#" style={{ color: 'var(--muted)', fontSize: '0.95rem', transition: 'color 180ms' }}>{item}</a></li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '24px',
        borderTop: '1px solid var(--line)',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.88rem' }}>
          © {new Date().getFullYear()} Bazaar. All rights reserved.
        </p>
        <div style={{ display: 'flex', gap: '20px' }}>
          {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
            <a key={item} href="#" style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>{item}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}
