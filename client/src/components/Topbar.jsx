import logo from '../assets/bazaar.png'

export default function Topbar({ onAddProduct }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '18px 0' }}>
      <a href="#">
        <img src={logo} alt="Bazaar" style={{ width: '100px', height: '100px', borderRadius: '16px', objectFit: 'cover', flexShrink: 0 }} />
      </a>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <a href="#explore" className="ghost-button">Explore</a>
        <a href="#newsletter" className="ghost-button">Updates</a>
        <button className="ghost-button" type="button" onClick={onAddProduct}>Add Product</button>
        <a className="solid-button" href="#">Become a Member</a>
      </div>
    </div>
  )
}
