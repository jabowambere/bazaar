import { Trash2 } from 'lucide-react'

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value) || 0)
}

const API = import.meta.env.VITE_API_URL || ''
function imgUrl(src) { return src ? `${API}${src}` : '' }

export default function Cart({ cart = { items: [] }, onRemove }) {
  const items = cart.items || []
  const total = items.reduce((s, i) => s + ((i.product?.productprice || 0) * (i.quantity || 1)), 0)

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <p style={{ margin: '0 0 4px', color: '#9f3518', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Shopping</p>
        <h1 style={{ margin: 0, color: '#1a1815', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.04em', fontFamily: '"Instrument Serif", serif', fontWeight: 400 }}>My Cart</h1>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 24px', background: '#fff', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.08)' }}>
          <p style={{ color: '#6f665d', fontSize: '1rem', margin: 0 }}>Your cart is empty. Browse products and add some!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {items.map(item => (
              <div key={item._id} style={{
                display: 'flex', alignItems: 'center', gap: '16px', padding: '16px',
                borderRadius: '20px', background: '#fff', border: '1px solid rgba(0,0,0,0.08)',
              }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '14px', flexShrink: 0, overflow: 'hidden', background: 'linear-gradient(135deg, #d95f39, #9f3518)' }}>
                  {item.product?.productimage && <img src={imgUrl(item.product.productimage)} alt={item.product.productname} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 4px', color: '#1a1815', fontWeight: 600 }}>{item.product?.productname}</p>
                  <p style={{ margin: 0, color: '#6f665d', fontSize: '0.85rem' }}>{item.product?.productcategory}</p>
                  {item.quantity > 1 && <p style={{ margin: '4px 0 0', color: '#9f3518', fontSize: '0.82rem' }}>Qty: {item.quantity}</p>}
                </div>
                <strong style={{ color: '#9f3518', fontSize: '1.05rem' }}>{formatCurrency((item.product?.productprice || 0) * item.quantity)}</strong>
                <button onClick={() => onRemove(item.product?._id)} style={{
                  width: '36px', height: '36px', borderRadius: '10px', border: 'none',
                  background: 'rgba(143,39,22,0.1)', color: '#d95f39', cursor: 'pointer', display: 'grid', placeItems: 'center',
                }}><Trash2 size={15} /></button>
              </div>
            ))}
          </div>

          <div style={{ padding: '24px', borderRadius: '24px', background: '#fff', border: '1px solid rgba(0,0,0,0.08)', position: 'sticky', top: '24px' }}>
            <p style={{ margin: '0 0 20px', fontWeight: 700, color: '#1a1815', fontSize: '1rem' }}>Order Summary</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {items.map(item => (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6f665d', fontSize: '0.9rem' }}>{item.product?.productname}</span>
                  <span style={{ color: '#1a1815', fontSize: '0.9rem' }}>{formatCurrency((item.product?.productprice || 0) * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <strong style={{ color: '#1a1815' }}>Total</strong>
              <strong style={{ color: '#d95f39', fontSize: '1.2rem' }}>{formatCurrency(total)}</strong>
            </div>
            <button style={{
              width: '100%', padding: '14px', borderRadius: '999px', border: 'none',
              background: 'linear-gradient(135deg, #d95f39, #9f3518)',
              color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(159,53,24,0.25)',
            }}>Checkout</button>
          </div>
        </div>
      )}
    </div>
  )
}
