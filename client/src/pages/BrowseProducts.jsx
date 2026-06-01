import { useState } from 'react'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'

const categories = ['All', 'Electronics', 'Clothing', 'Shoes', 'Books', 'Furniture']

export default function BrowseProducts({ products = [], loading, onEdit, onDelete }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('newest')

  const filtered = products
    .filter(p => category === 'All' || (p.productcategory || '').toLowerCase() === category.toLowerCase())
    .filter(p => !search || [p.productname, p.productcategory, p.productdescription].filter(Boolean).join(' ').toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === 'price-asc' ? a.productprice - b.productprice
      : sort === 'price-desc' ? b.productprice - a.productprice
      : new Date(b.createdAt) - new Date(a.createdAt))

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <p style={{ margin: '0 0 4px', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Marketplace</p>
        <h1 style={{ margin: 0, color: '#fff8ef', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.04em', fontFamily: '"Instrument Serif", serif', fontWeight: 400 }}>Browse Products</h1>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: '200px', padding: '12px 18px', borderRadius: '999px',
            border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.08)',
            color: '#fff8ef', outline: 'none', fontSize: '0.92rem',
          }}
        />
        <select value={sort} onChange={e => setSort(e.target.value)} style={{
          padding: '12px 18px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.15)',
          background: 'rgba(255,255,255,0.08)', color: '#fff8ef', outline: 'none', fontSize: '0.92rem',
        }}>
          <option value="newest" style={{ background: '#1a1815' }}>Newest</option>
          <option value="price-asc" style={{ background: '#1a1815' }}>Price: Low to High</option>
          <option value="price-desc" style={{ background: '#1a1815' }}>Price: High to Low</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} style={{
            padding: '8px 18px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.15)',
            background: category === cat ? 'linear-gradient(135deg, #d95f39, #9f3518)' : 'rgba(255,255,255,0.07)',
            color: '#fff8ef', cursor: 'pointer', fontSize: '0.88rem', fontWeight: category === cat ? 600 : 400,
          }}>{cat}</button>
        ))}
      </div>

      <div className="product-grid">
        {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '48px', color: 'rgba(255,255,255,0.4)' }}>
            No products found.
          </div>
        ) : filtered.map((p, i) => (
          <ProductCard key={p._id} product={p} index={i} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </div>
  )
}
