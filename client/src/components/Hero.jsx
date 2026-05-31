import { useState } from 'react'

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value) || 0)
}

function FeaturedPanel({ product }) {
  if (!product) {
    return (
      <div className="feature-panel">
        <div className="feature-glow"></div>
        <p className="panel-label">Featured Drop</p>
        <h2>Your next hero product</h2>
        <p className="panel-text">Add a product and it will automatically appear as the featured item here.</p>
        <div className="feature-art">
          <span className="art-orb art-orb-one"></span>
          <span className="art-orb art-orb-two"></span>
          <span className="art-card">Catalog</span>
        </div>
        <div className="panel-meta">
          <div><span>Category</span><strong>No category yet</strong></div>
          <div><span>Value</span><strong>$0.00</strong></div>
        </div>
      </div>
    )
  }

  return (
    <div className="feature-panel">
      <div className="feature-glow"></div>
      <p className="panel-label">Featured Drop</p>
      <h2>{product.productname}</h2>
      <p className="panel-text">{product.productdescription || 'No description yet for this product.'}</p>
      <div className={`feature-art${product.productimage ? ' has-image' : ''}`}>
        {product.productimage ? (
          <>
            <span className="art-card">{product.productcategory || 'Category'}</span>
            <img src={product.productimage} alt={product.productname} />
          </>
        ) : (
          <>
            <span className="art-orb art-orb-one"></span>
            <span className="art-orb art-orb-two"></span>
            <span className="art-card">{product.productcategory || 'Category'}</span>
          </>
        )}
      </div>
      <div className="panel-meta">
        <div><span>Category</span><strong>{product.productcategory || 'Uncategorized'}</strong></div>
        <div><span>Value</span><strong>{formatCurrency(product.productprice)}</strong></div>
      </div>
    </div>
  )
}

export default function Hero({ products, activeCategory, onCategoryChange, onSearch }) {
  const [searchValue, setSearchValue] = useState('')

  const categories = [...new Set(
    products.map(p => (p.productcategory || '').trim()).filter(Boolean)
  )].sort((a, b) => a.localeCompare(b))

  const avgPrice = products.length
    ? products.reduce((sum, p) => sum + (Number(p.productprice) || 0), 0) / products.length
    : 0

  const uniqueCategories = new Set(products.map(p => (p.productcategory || '').trim()).filter(Boolean))

  function handleSearch(e) {
    e.preventDefault()
    onSearch(searchValue.trim().toLowerCase())
  }

  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">Membership Template</p>
        <h1>Meet the new home for your digital goods.</h1>
        <p className="hero-text">
          Sell premium assets, build a collector community, and turn every release into
          an event with a storefront that feels editorial instead of ordinary.
        </p>

        <form className="search-card" role="search" onSubmit={handleSearch}>
          <label className="sr-only" htmlFor="search">Search assets</label>
          <input
            id="search"
            type="search"
            placeholder="Search products by name, category, or description..."
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <div className="filter-row" aria-label="Category filters">
          <button
            className={`filter-pill${activeCategory === 'all' ? ' active' : ''}`}
            type="button"
            onClick={() => onCategoryChange('all')}
          >All</button>
          {categories.map(cat => (
            <button
              style={{color: '#9f3518'}}
              key={cat}
              className={`filter-pill${activeCategory === cat.toLowerCase() ? ' active' : ''}`}
              type="button"
              onClick={() => onCategoryChange(cat.toLowerCase())}
            >{cat}</button>
          ))}
        </div>

        <div className="hero-stats">
          <article>
            <strong style={{color: '#9f3518'}}>{products.length}</strong>
            <span>Products loaded</span>
          </article>
          <article>
            <strong style={{color: '#9f3518'}}>{uniqueCategories.size}</strong>
            <span>Categories in catalog</span>
          </article>
          <article>
            <strong style={{color: '#9f3518'}}>{formatCurrency(avgPrice)}</strong>
            <span>Average price</span>
          </article>
        </div>
      </div>

      <aside className="hero-feature">
        <FeaturedPanel product={products[0] || null} />
      </aside>
    </section>
  )
}
