import Hero from '../components/Hero'
import MembershipSection from '../components/MembershipSection'
import NewsletterSection from '../components/NewsletterSection'
import FAQSection from '../components/FAQSection'
import Footer from '../components/Footer'
import Topbar from '../components/Topbar'
import LoadingSpinner from '../components/LoadingSpinner'
import useReveal from '../components/FadeIn'
import { ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { imgUrl } from '../utils/imgUrl'

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value) || 0)
}

function PublicProductCard({ product, onCartClick, animClass, animDelay }) {
  const [ref, visible] = useReveal()
  return (
    <article
      ref={ref}
      className={`product-card${visible ? ` ${animClass}` : ''}`}
      style={visible ? { animationDelay: animDelay } : { opacity: 0 }}
    >
      <div className="product-image">
        {product.productimage && <img src={imgUrl(product.productimage)} alt={product.productname} />}
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
          <button className="solid-button" type="button" onClick={onCartClick} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <ShoppingCart size={16} /> Add to Cart
          </button>
        </div>
      </div>
    </article>
  )
}

export default function LandingPage({ products, loading, onLoginClick, onSignupClick }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [headingRef, headingVisible] = useReveal()

  const filtered = products.filter(p => {
    const matchCat = activeCategory === 'all' || (p.productcategory || '').trim().toLowerCase() === activeCategory
    const haystack = [p.productname, p.productcategory, p.productdescription].filter(Boolean).join(' ').toLowerCase()
    return matchCat && (!searchTerm || haystack.includes(searchTerm))
  })

  return (
    <div className="page-shell">
      <Topbar onAddProduct={onLoginClick} onLoginClick={onLoginClick} onSignupClick={onSignupClick} />
      <main>
        <Hero
          products={products}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          onSearch={setSearchTerm}
        />

        <section className="products-section" id="explore">
          <div
            ref={headingRef}
            className={`section-heading${headingVisible ? ' lp-slide-left' : ''}`}
            style={headingVisible ? { animationDelay: '0s' } : { opacity: 0 }}
          >
            <div>
              <p className="eyebrow">Explore</p>
              <h2>Curated assets with a collector-shop feel.</h2>
            </div>
          </div>
          <div className="product-grid">
            {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
              <article className="empty-state product-card">
                <h3>No products yet</h3>
                <p>Check back soon.</p>
              </article>
            ) : filtered.map((p, i) => (
              <PublicProductCard
                key={p._id}
                product={p}
                onCartClick={onLoginClick}
                animClass="lp-card-reveal"
                animDelay={`${(i % 4) * 0.13}s`}
              />
            ))}
          </div>
        </section>

        <MembershipSection />
        <NewsletterSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  )
}
