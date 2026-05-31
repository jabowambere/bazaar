function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value) || 0)
}

export default function ProductCard({ product, index, onEdit, onDelete }) {
  return (
    <article className="product-card">
      {index === 0 && <span className="product-badge">Featured</span>}
      <div className="product-image">
        {product.productimage && (
          <img src={product.productimage} alt={product.productname} />
        )}
      </div>
      <div className="product-content" style={{ color: '#000' }}>
        <p className="product-tool" style={{ color: '#000' }}>{product.productcategory || 'Uncategorized'}</p>
        <h3 style={{ color: '#9f3518' }}>{product.productname}</h3>
        <p className="product-description" style={{ color: '#000' }}>{product.productdescription || 'No description added yet.'}</p>
        <div className="product-meta">
          <span style={{ color: '#000' }}>Catalog item</span>
          <strong style={{ color: '#000' }}>{formatCurrency(product.productprice)}</strong>
        </div>
        <div className="product-actions">
          <button className="product-action" type="button" onClick={() => onEdit(product)}>Edit</button>
          <button className="product-action danger" type="button" onClick={() => onDelete(product)}>Delete</button>
        </div>
      </div>
    </article>
  )
}
