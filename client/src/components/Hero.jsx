import { useState, useEffect } from 'react'
import { imgUrl } from '../utils/imgUrl'
import logo from '../assets/bazaar.png'
import useReveal from './FadeIn'

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value) || 0)
}

function WordReveal({ text, baseDelay = 0 }) {
  const [ref, visible] = useReveal(0.05)
  const words = text.split(' ')
  return (
    <h1 ref={ref}>
      {words.map((word, i) => (
        <span key={i} className="lp-word">
          <span style={visible ? { animationDelay: `${baseDelay + i * 0.11}s` } : { opacity: 0 }}>
            {word}{i < words.length - 1 ? '\u00a0' : ''}
          </span>
        </span>
      ))}
    </h1>
  )
}

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
  const [copyRef, copyVisible] = useReveal(0.05)
  const [asideRef, asideVisible] = useReveal(0.05)

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
      <div className="hero-copy" ref={copyRef}>
        {/* eyebrow slides in from left */}
        <p className="eyebrow lp-slide-left" style={copyVisible ? { animationDelay: '0s' } : { opacity: 0, animation: 'none' }}>
          The new standard
        </p>

        {/* h1 words reveal upward one by one */}
        <WordReveal text="Meet the new home for your digital goods." baseDelay={0.05} />

        {/* body text slides in from left */}
        <p
          className={`hero-text${copyVisible ? ' lp-slide-left' : ''}`}
          style={copyVisible ? { animationDelay: '0.55s' } : { opacity: 0 }}
        >
          Sell premium assets, build a collector community, and turn every release into
          an event with a storefront that feels editorial instead of ordinary.
        </p>

        {/* search scales in */}
        <form
          className={`search-card${copyVisible ? ' lp-scale-in' : ''}`}
          style={copyVisible ? { animationDelay: '0.7s' } : { opacity: 0 }}
          role="search"
          onSubmit={handleSearch}
        >
          <label className="sr-only" htmlFor="search">Search assets</label>
          <img src={logo} alt="Bazaar" style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0, margin: '0 4px 0 2px' }} />
          <input
            id="search"
            type="search"
            placeholder="Discover rare finds, premium drops & collector pieces..."
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        {/* filter pills pop in one by one */}
        <div className="filter-row" aria-label="Category filters">
          {['all', ...categories].map((cat, i) => (
            <button
              key={cat}
              className={`filter-pill${activeCategory === (cat === 'all' ? 'all' : cat.toLowerCase()) ? ' active' : ''}${copyVisible ? ' lp-pop' : ''}`}
              style={copyVisible ? { animationDelay: `${0.85 + i * 0.08}s`, color: cat !== 'all' ? '#9f3518' : undefined } : { opacity: 0 }}
              type="button"
              onClick={() => onCategoryChange(cat === 'all' ? 'all' : cat.toLowerCase())}
            >{cat === 'all' ? 'All' : cat}</button>
          ))}
        </div>

        {/* stats slide in from left, staggered */}
        <div className="hero-stats">
          {[
            { value: products.length, label: 'Products loaded' },
            { value: uniqueCategories.size, label: 'Categories in catalog' },
            { value: formatCurrency(avgPrice), label: 'Average price' },
          ].map(({ value, label }, i) => (
            <article
              key={label}
              className={copyVisible ? 'lp-slide-left' : ''}
              style={copyVisible ? { animationDelay: `${1.0 + i * 0.13}s` } : { opacity: 0 }}
            >
              <strong style={{color: '#9f3518'}}>{value}</strong>
              <span>{label}</span>
            </article>
          ))}
        </div>
      </div>

      {/* featured panel slides in from the right */}
      <aside
        ref={asideRef}
        className={`hero-feature hero-feature-aside${asideVisible ? ' lp-slide-right' : ''}`}
        style={asideVisible
          ? { animationDelay: '0.3s', opacity: fade ? undefined : 0, transition: 'opacity 0.4s ease' }
          : { opacity: 0 }
        }
      >
        <FeaturedPanel product={products[featuredIndex] || null} />
      </aside>
    </section>
  )
}
