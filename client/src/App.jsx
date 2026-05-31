import { Preview } from 'shaders/react'
import { useState, useEffect } from 'react'
import Topbar from './components/Topbar'
import Hero from './components/Hero'
import ProductsSection from './components/ProductsSection'
import MembershipSection from './components/MembershipSection'
import NewsletterSection from './components/NewsletterSection'
import ProductModal from './components/ProductModal'
import Footer from './components/Footer'

export default function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [modalProduct, setModalProduct] = useState(undefined)
  const [successMessage, setSuccessMessage] = useState(null)

  async function fetchProducts() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/products')
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Fetching products failed')
      setProducts(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Unable to fetch products. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  const filteredProducts = products.filter(p => {
    const matchCat = activeCategory === 'all' ||
      (p.productcategory || '').trim().toLowerCase() === activeCategory
    const haystack = [p.productname, p.productcategory, p.productdescription]
      .filter(Boolean).join(' ').toLowerCase()
    return matchCat && (!searchTerm || haystack.includes(searchTerm))
  })

  async function handleDelete(product) {
    if (!window.confirm(`Delete "${product.productname}"?`)) return
    try {
      const res = await fetch(`/products/${product._id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setSuccessMessage('Product deleted successfully.')
      fetchProducts()
    } catch (err) {
      setError(err.message || 'Unable to delete product.')
    }
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <Preview presetId="71aa34a1-e7db-4a5d-a6e8-03cec2d71771" />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="page-shell">
          <Topbar onAddProduct={() => setModalProduct(null)} />
          {successMessage && (
            <div style={{ margin: '12px 0', padding: '14px 18px', borderRadius: '18px', background: 'rgba(221, 242, 226, 0.9)', color: '#9f3518', border: '1px solid rgba(159,53,24,0.2)' }}>
              {successMessage}
            </div>
          )}
          {error && (
            <div style={{ margin: '12px 0', padding: '14px 18px', borderRadius: '18px', background: 'rgba(248, 223, 218, 0.9)', color: '#9f3518', border: '1px solid rgba(159,53,24,0.2)' }}>
              {error}
            </div>
          )}
          <main>
            <Hero
              products={products}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              onSearch={setSearchTerm}
            />
            <ProductsSection
              products={filteredProducts}
              loading={loading}
              error={error}
              onRefresh={fetchProducts}
              onEdit={setModalProduct}
              onDelete={handleDelete}
            />
            <MembershipSection />
            <NewsletterSection />
          </main>
          <Footer />
          {modalProduct !== undefined && (
            <ProductModal
              product={modalProduct}
              onClose={() => setModalProduct(undefined)}
              onSaved={(msg) => { setSuccessMessage(msg); fetchProducts() }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
