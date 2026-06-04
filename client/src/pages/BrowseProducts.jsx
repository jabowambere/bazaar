import { useState } from 'react'
import { ShoppingCart, Pencil, Trash2 } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value) || 0)
}

const API = import.meta.env.VITE_API_URL || ''
function imgUrl(src) { return src ? `${API}${src}` : '' }

const categories = ['All', 'Electronics', 'Clothing', 'Shoes', 'Books', 'Furniture']

export default function BrowseProducts({ products = [], loading, user, onAddToCart, onEdit, onDelete, isAdmin }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('newest')

  const filtered = products
    .filter(p => {
      const ownerId = p.owner?._id ? String(p.owner._id) : String(p.owner)
      return isAdmin || ownerId !== String(user?._id)
    })
    .filter(p => category === 'All' || (p.productcategory || '').toLowerCase() === category.toLowerCase())
    .filter(p => !search || [p.productname, p.productcategory, p.productdescription].filter(Boolean).join(' ').toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === 'price-asc' ? a.productprice - b.productprice
      : sort === 'price-desc' ? b.productprice - a.productprice
      : new Date(b.createdAt) - new Date(a.createdAt))

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <p style={{ margin: '0 0 4px', color: '#9f3518', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Marketplace</p>
        <h1 style={{ margin: 0, color: '#1a1815', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.04em', fontFamily: '"Instrument Serif", serif', fontWeight: 400 }}>Browse Products</h1>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input type="search" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} style={{
          flex: 1, minWidth: '200px', padding: '12px 18px', borderRadius: '999px',
          border: '1px solid rgba(0,0,0,0.12)', background: '#fff', color: '#1a1815', outline: 'none', fontSize: '0.92rem',
        }} />
        <select value={sort} onChange={e => setSort(e.target.value)} style={{
          padding: '12px 18px', borderRadius: '999px', border: '1px solid rgba(0,0,0,0.12)',
          background: '#fff', color: '#1a1815', outline: 'none', fontSize: '0.92rem',
        }}>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} style={{
            padding: '8px 18px', borderRadius: '999px', border: '1px solid rgba(0,0,0,0.12)',
            background: category === cat ? 'linear-gradient(135deg, #d95f39, #9f3518)' : '#fff',
            color: category === cat ? '#fff' : '#1a1815',
            cursor: 'pointer', fontSize: '0.88rem', fontWeight: category === cat ? 600 : 400,
          }}>{cat}</button>
        ))}
      </div>

      <div className="product-grid">
        {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '48px', color: '#6f665d' }}>No products found.</div>
        ) : filtered.map(p => (
          <article key={p._id} className="product-card">
            <div className="product-image">
              {p.productimage && <img src={imgUrl(p.productimage)} alt={p.productname} />}
            </div>
            <div className="product-content" style={{ color: '#1a1815' }}>
              <p className="product-tool" style={{ color: '#9f3518', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{p.productcategory}</p>
              <h3 style={{ color: '#1a1815', margin: '4px 0 8px' }}>{p.productname}</h3>
              <p className="product-description" style={{ color: '#6f665d' }}>{p.productdescription || 'No description.'}</p>
              <div className="product-meta" style={{ marginBottom: '14px' }}>
                <span style={{ color: '#6f665d', fontSize: '0.82rem' }}>by <strong style={{ color: '#9f3518' }}>{p.owner?.name || 'Seller'}</strong></span>
                <strong style={{ color: '#9f3518', fontSize: '1.05rem' }}>{formatCurrency(p.productprice)}</strong>
              </div>
              {isAdmin ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => onEdit(p)} style={{
                    flex: 1, padding: '10px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.1)',
                    background: '#fff', color: '#1a1815', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  }}><Pencil size={14} /> Edit</button>
                  <button onClick={() => onDelete(p)} style={{
                    flex: 1, padding: '10px', borderRadius: '14px', border: 'none',
                    background: 'rgba(143,39,22,0.1)', color: '#d95f39', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  }}><Trash2 size={14} /> Delete</button>
                </div>
              ) : (
                <button onClick={() => onAddToCart(p)} style={{
                  width: '100%', padding: '11px', borderRadius: '14px', border: 'none',
                  background: 'linear-gradient(135deg, #d95f39, #9f3518)',
                  color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: '0 4px 14px rgba(159,53,24,0.25)',
                }}><ShoppingCart size={16} /> Add to Cart</button>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
