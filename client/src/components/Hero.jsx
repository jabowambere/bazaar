import { useState, useEffect } from 'react'

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value) || 0)
}

const API = import.meta.env.VITE_API_URL || ''
function imgUrl(src) { return src ? `${API}${src}` : '' }

function FeaturedPanel({ product }) {
  const [expanded, setExpanded] = useState(false)

  if (!product) {
    return (
      <div className="feature-panel">
        <div className="feature-glow"></div>
        <p className="panel-label">Featured Drop</p>
        <h2>Your next hero product</h2>
        <p style={{color:'#9f3518'}} className="panel-text">Add a product and it will automatically appear as the featured item here.</p>
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

  const description = product.productdescription || ''
  const isLong = description.length > 80
  const displayDesc = isLong && !expanded ? description.slice(0, 80) + '...' : description

  return (
    <div className="feature-panel" style={{ minHeight: 'auto', padding: '22px' }}>
      <div className="feature-glow"></div>
      <p className="panel-label">Featured Drop</p>
      <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', marginBottom: '8px' }}>{product.productname}</h2>
      <p className="panel-text" style={{ color: '#9f3518', fontSize: '0.88rem', maxWidth: '100%', marginBottom: '4px' }}>
        {displayDesc || 'No description yet.'}
        {isLong && (
          <button onClick={() => setExpanded(!expanded)} style={{
            background: 'none', border: 'none', color: '#d95f39', cursor: 'pointer',
            fontWeight: 700, fontSize: '0.85rem', padding: '0 4px'
          }}>{expanded ? 'less' : 'more'}</button>
        )}
      </p>
      <div className={`feature-art${product.productimage ? ' has-image' : ''}`} style={{ minHeight: '140px', margin: '16px 0' }}>
        {product.productimage ? (
          <>
            <span className="art-card">{product.productcategory || 'Category'}</span>
            <img src={imgUrl(product.productimage)} alt={product.productname} />
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
        <div><span style={{color:'#9f3518'}}>Category</span><strong style={{color:'#9f3518'}}>{product.productcategory || 'Uncategorized'}</strong></div>
        <div><span style={{color:'#9f3518'}}>Value</span><strong style={{color:'#9f3518'}}>{formatCurrency(product.productprice)}</strong></div>
      </div>
    </div>
  )
}

export default function Hero({ products, activeCategory, onCategoryChange, onSearch }) {
  const [searchValue, setSearchValue] = useState('')
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    if (products.length <= 1) return
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setFeaturedIndex(prev => (prev + 1) % products.length)
        setFade(true)
      }, 400)
    }, 3000)
    return () => clearInterval(interval)
  }, [products.length])

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

      <aside className="hero-feature" style={{ transition: 'opacity 0.4s ease', opacity: fade ? 1 : 0 }}>
        <FeaturedPanel product={products[featuredIndex] || null} />
      </aside>
    </section>
  )
}
