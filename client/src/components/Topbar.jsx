import logo from '../assets/bazaar.png'

export default function Topbar({ onAddProduct, onLoginClick }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '18px 0' }}>
      <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}>
        <img src={logo} alt="Bazaar" style={{ width: '100px', height: '100px', borderRadius: '16px', objectFit: 'cover', flexShrink: 0 }} />
        <span style={{ fontFamily: '"Grand Hotel", cursive', fontSize: '2.2rem', color: '#9f3518', lineHeight: 1 }}>Bazaar</span>
      </a>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <a href="#explore" className="ghost-button">Explore</a>
        <a href="#newsletter" className="ghost-button">Updates</a>
        <button className="ghost-button" type="button" onClick={onLoginClick}>Sign In</button>
        <button className="solid-button" type="button" onClick={onLoginClick}>Get Started</button>
      </div>
    </div>
  )
}
