function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value) || 0)
}

const mockCart = [
  { _id: '1', productname: 'Wireless Headphones', productprice: 89.99, productcategory: 'Electronics', productimage: null },
  { _id: '2', productname: 'Running Shoes', productprice: 129.99, productcategory: 'Shoes', productimage: null },
  { _id: '3', productname: 'Leather Jacket', productprice: 249.99, productcategory: 'Clothing', productimage: null },
]

export default function Cart() {
  const total = mockCart.reduce((s, i) => s + i.productprice, 0)

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <p style={{ margin: '0 0 4px', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Shopping</p>
        <h1 style={{ margin: 0, color: '#fff8ef', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.04em', fontFamily: '"Instrument Serif", serif', fontWeight: 400 }}>My Cart</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {mockCart.map(item => (
            <div key={item._id} style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              padding: '16px', borderRadius: '20px',
              background: 'rgba(255,250,242,0.07)', backdropFilter: 'blur(18px)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '14px', flexShrink: 0,
                background: 'linear-gradient(135deg, #d95f39, #9f3518)', overflow: 'hidden',
              }}>
                {item.productimage && <img src={item.productimage} alt={item.productname} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 4px', color: '#fff8ef', fontWeight: 600 }}>{item.productname}</p>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>{item.productcategory}</p>
              </div>
              <strong style={{ color: '#9f3518', fontSize: '1.1rem' }}>{formatCurrency(item.productprice)}</strong>
              <button style={{
                width: '36px', height: '36px', borderRadius: '10px', border: 'none',
                background: 'rgba(143,39,22,0.15)', color: '#d95f39', cursor: 'pointer', fontSize: '1rem',
              }}>✕</button>
            </div>
          ))}
        </div>

        <div style={{
          padding: '24px', borderRadius: '24px',
          background: 'rgba(255,250,242,0.07)', backdropFilter: 'blur(18px)',
          border: '1px solid rgba(255,255,255,0.1)',
          position: 'sticky', top: '24px',
        }}>
          <p style={{ margin: '0 0 20px', fontWeight: 700, color: '#fff8ef', fontSize: '1rem' }}>Order Summary</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            {mockCart.map(item => (
              <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem' }}>{item.productname}</span>
                <span style={{ color: '#fff8ef', fontSize: '0.9rem' }}>{formatCurrency(item.productprice)}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <strong style={{ color: '#fff8ef' }}>Total</strong>
            <strong style={{ color: '#d95f39', fontSize: '1.2rem' }}>{formatCurrency(total)}</strong>
          </div>
          <button style={{
            width: '100%', padding: '14px', borderRadius: '999px', border: 'none',
            background: 'linear-gradient(135deg, #d95f39, #9f3518)',
            color: '#fff8ef', fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(159,53,24,0.3)',
          }}>Checkout</button>
        </div>
      </div>
    </div>
  )
}
