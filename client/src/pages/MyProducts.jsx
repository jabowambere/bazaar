import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'

export default function MyProducts({ products = [], loading, onAdd, onEdit, onDelete }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
        <div>
          <p style={{ margin: '0 0 4px', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>My Listings</p>
          <h1 style={{ margin: 0, color: '#fff8ef', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.04em', fontFamily: '"Instrument Serif", serif', fontWeight: 400 }}>My Products</h1>
        </div>
        <button onClick={onAdd} style={{
          padding: '12px 24px', borderRadius: '999px',
          background: 'linear-gradient(135deg, #d95f39, #9f3518)',
          color: '#fff8ef', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.92rem',
          boxShadow: '0 8px 24px rgba(159,53,24,0.3)',
        }}>＋ Add Product</button>
      </div>

      {products.length === 0 && !loading ? (
        <div style={{
          textAlign: 'center', padding: '64px 24px',
          background: 'rgba(255,250,242,0.06)', borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', margin: '0 0 16px' }}>You haven't listed any products yet.</p>
          <button onClick={onAdd} style={{
            padding: '12px 24px', borderRadius: '999px',
            background: 'linear-gradient(135deg, #d95f39, #9f3518)',
            color: '#fff8ef', border: 'none', cursor: 'pointer', fontWeight: 600,
          }}>List your first product</button>
        </div>
      ) : (
        <div className="product-grid">
          {loading ? <LoadingSpinner /> : products.map((p, i) => (
            <ProductCard key={p._id} product={p} index={i} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
