import { Preview } from 'shaders/react'
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Sidebar from './components/Sidebar'
import ProductModal from './components/ProductModal'
import AuthModal from './components/AuthModal'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import BrowseProducts from './pages/BrowseProducts'
import MyProducts from './pages/MyProducts'
import Cart from './pages/Cart'
import Chat from './pages/Chat'
import Notifications from './pages/Notifications'
import Profile from './pages/Profile'

function AppInner() {
  const { user, logout } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [modalProduct, setModalProduct] = useState(undefined)
  const [showAuth, setShowAuth] = useState(false)
  const navigate = useNavigate()

  async function fetchProducts() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/products')
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Fetching products failed')
      setProducts(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Unable to fetch products.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

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

  function handleAuthSuccess() {
    setShowAuth(false)
    navigate('/dashboard')
  }

  const unreadCount = 3

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <Preview presetId="71aa34a1-e7db-4a5d-a6e8-03cec2d71771" />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Routes>
          {/* Public landing page */}
          <Route path="/" element={
            user ? <Navigate to="/dashboard" replace /> :
            <LandingPage products={products} loading={loading} onLoginClick={() => setShowAuth(true)} />
          } />

          {/* Protected dashboard layout */}
          <Route path="/*" element={
            <ProtectedRoute>
              <div style={{ display: 'flex' }}>
                <Sidebar unreadCount={unreadCount} onLogout={logout} user={user} />
                <main style={{ marginLeft: '240px', flex: 1, padding: '40px', minHeight: '100vh' }}>
                  {successMessage && (
                    <div style={{ marginBottom: '16px', padding: '14px 18px', borderRadius: '18px', background: 'rgba(221,242,226,0.9)', color: '#9f3518', border: '1px solid rgba(159,53,24,0.2)' }}>
                      {successMessage}
                    </div>
                  )}
                  {error && (
                    <div style={{ marginBottom: '16px', padding: '14px 18px', borderRadius: '18px', background: 'rgba(248,223,218,0.9)', color: '#9f3518', border: '1px solid rgba(159,53,24,0.2)' }}>
                      {error}
                    </div>
                  )}
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard products={products} user={user} onDeleteProduct={handleDelete} />} />
                    <Route path="/browse" element={<BrowseProducts products={products} loading={loading} onEdit={setModalProduct} onDelete={handleDelete} />} />
                    <Route path="/my-products" element={<MyProducts products={products} loading={loading} onAdd={() => setModalProduct(null)} onEdit={setModalProduct} onDelete={handleDelete} />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/profile" element={<Profile user={user} />} />
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={handleAuthSuccess} />}

      {modalProduct !== undefined && (
        <ProductModal
          product={modalProduct}
          onClose={() => setModalProduct(undefined)}
          onSaved={(msg) => { setSuccessMessage(msg); fetchProducts(); setModalProduct(undefined) }}
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </BrowserRouter>
  )
}
