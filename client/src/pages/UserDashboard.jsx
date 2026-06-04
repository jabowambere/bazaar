import { Link } from 'react-router-dom'
import { Package, LayoutGrid, DollarSign, TrendingUp, Plus, ShoppingCart, MessagesSquare } from 'lucide-react'
import StatCard from '../components/StatCard'

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value) || 0)
}

const API = import.meta.env.VITE_API_URL || ''
function imgUrl(src) { return src ? `${API}${src}` : '' }

export default function UserDashboard({ products = [], user }) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const totalValue = products.reduce((s, p) => s + (Number(p.productprice) || 0), 0)
  const avgPrice = products.length ? totalValue / products.length : 0
  const categories = new Set(products.map(p => p.productcategory).filter(Boolean))
  const recent = products.slice(0, 5)

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <p style={{ margin: '0 0 6px', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Welcome back</p>
        <h1 style={{ margin: 0, color: '#fff8ef', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.04em', fontFamily: '"Instrument Serif", serif', fontWeight: 400 }}>
          {greeting}, {user?.name} 👋
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        <StatCard icon={<Package size={22} />} label="Total Products" value={products.length} accent />
        <StatCard icon={<LayoutGrid size={22} />} label="Categories" value={categories.size} />
        <StatCard icon={<DollarSign size={22} />} label="Avg. Price" value={formatCurrency(avgPrice)} />
        <StatCard icon={<TrendingUp size={22} />} label="Total Value" value={formatCurrency(totalValue)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
        <div style={{ background: 'rgba(255,250,242,0.06)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '24px' }}>
          <p style={{ margin: '0 0 20px', fontWeight: 700, color: '#fff8ef', fontSize: '1rem' }}>Quick Actions</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { to: '/my-products', label: <><Plus size={16} />  Add New Product</>, accent: true },
              { to: '/browse', label: <><Package size={16} />  Browse Marketplace</> },
              { to: '/cart', label: <><ShoppingCart size={16} />  View My Cart</> },
              { to: '/chat', label: <><MessagesSquare size={16} />  Open Live Chat</> },
            ].map(({ to, label, accent }) => (
              <Link key={to} to={to} style={{
                padding: '14px 18px', borderRadius: '14px',
                background: accent ? 'linear-gradient(135deg, #d95f39, #9f3518)' : 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)', color: '#fff8ef',
                fontSize: '0.92rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px',
              }}>{label}</Link>
            ))}
          </div>
        </div>

        <div style={{ background: 'rgba(255,250,242,0.06)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '24px' }}>
          <p style={{ margin: '0 0 16px', fontWeight: 700, color: '#fff8ef', fontSize: '1rem' }}>Recent Products</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recent.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem', margin: 0 }}>No products yet.</p>
            ) : recent.map(p => (
              <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', flexShrink: 0, overflow: 'hidden', background: 'linear-gradient(135deg, #d95f39, #9f3518)' }}>
                  {p.productimage && <img src={imgUrl(p.productimage)} alt={p.productname} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <p style={{ margin: 0, color: '#fff8ef', fontSize: '0.88rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.productname}</p>
                  <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>{p.productcategory}</p>
                </div>
                <span style={{ color: '#9f3518', fontWeight: 700, fontSize: '0.88rem', flexShrink: 0 }}>{formatCurrency(p.productprice)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <p style={{ margin: 0, fontWeight: 700, color: '#fff8ef', fontSize: '1rem' }}>Featured Products</p>
          <Link to="/browse" style={{ color: '#d95f39', fontSize: '0.88rem', textDecoration: 'none' }}>View all →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {products.slice(0, 4).map(p => (
            <div key={p._id} style={{ borderRadius: '20px', overflow: 'hidden', background: 'rgba(255,250,242,0.07)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ height: '140px', background: 'linear-gradient(135deg, #d95f39, #9f3518)', overflow: 'hidden' }}>
                {p.productimage && <img src={imgUrl(p.productimage)} alt={p.productname} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>
              <div style={{ padding: '14px' }}>
                <p style={{ margin: '0 0 4px', color: '#fff8ef', fontWeight: 600, fontSize: '0.92rem' }}>{p.productname}</p>
                <p style={{ margin: '0 0 8px', color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>{p.productcategory}</p>
                <p style={{ margin: 0, color: '#9f3518', fontWeight: 700, fontSize: '0.88rem' }}>{formatCurrency(p.productprice)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
