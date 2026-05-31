import ProductCard from './ProductCard'
import LoadingSpinner from './LoadingSpinner'

export default function ProductsSection({ products, loading, error, onRefresh, onEdit, onDelete }) {
  return (
    <section className="products-section" id="explore">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Explore</p>
          <h2>Curated assets with a collector-shop feel.</h2>
        </div>
        <button className="text-link button-reset" type="button" onClick={onRefresh}>Refresh catalog</button>
      </div>

      {error && <div className="status-banner error">{error}</div>}

      <div className="product-grid">
        {loading ? (
          <LoadingSpinner />
        ) : products.length === 0 ? (
          <article className="empty-state product-card">
            <h3>No products match your current filters</h3>
            <p>Try a different search, switch categories, or add a new product.</p>
          </article>
        ) : products.map((product, index) => (
          <ProductCard
            key={product._id}
            product={product}
            index={index}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  )
}
