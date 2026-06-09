import { Preview } from 'shaders/react'
import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Sidebar from './components/Sidebar'
import ProductModal from './components/ProductModal'
import AuthModal from './components/AuthModal'
import ConfirmModal from './components/ConfirmModal'
import ProtectedRoute from './components/ProtectedRoute'
import CupLoader from './components/CupLoader'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import BrowseProducts from './pages/BrowseProducts'
import MyProducts from './pages/MyProducts'
import Cart from './pages/Cart'
import Chat from './pages/Chat'
import Notifications from './pages/Notifications'
import Profile from './pages/Profile'

function getToken() { return localStorage.getItem('token') }
const API = import.meta.env.VITE_API_URL || ''

function AppInner() {
  const { user, logout, loading: authLoading } = useAuth()
  const [allProducts, setAllProducts] = useState([])
  const [myProducts, setMyProducts] = useState([])
  const [cart, setCart] = useState({ items: [] })
  const [notifications, setNotifications] = useState([])
  const socketRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [modalProduct, setModalProduct] = useState(undefined)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [confirm, setConfirm] = useState(null)
  const [pageLoading, setPageLoading] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)
  const [slowLoading, setSlowLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return;
    const token = getToken();
    const socket = io(API || window.location.origin, { auth: { token }, reconnection: true });
    socketRef.current = socket;
    const doJoin = () => socket.emit('join', token);
    socket.on('connect', doJoin);
    socket.on('productActivity', ({ action, productName, by }) => {
      const icons = { added: '＋', updated: '✎', deleted: '🗑' };
      setNotifications(prev => [{
        id: Date.now(),
        text: `${by} ${action} "${productName}"`,
        time: 'just now',
        read: false,
        icon: icons[action]
      }, ...prev]);
    });
    return () => socket.disconnect();
  }, [user])

  useEffect(() => {
    const timer = setTimeout(() => setSlowLoading(true), 5000)
    return () => clearTimeout(timer)
  }, [])

  async function fetchAllProducts() {
    try {
      const res = await fetch(`${API}/products`)
      const data = await res.json()
      setAllProducts(Array.isArray(data) ? data : [])
    } catch { }
  }

  async function fetchMyProducts() {
    if (!user) return
    try {
      const res = await fetch(`${API}/products/mine`, {
        headers: { Authorization: `Bearer ${getToken()}` },
        credentials: 'include'
      })
      const data = await res.json()
      setMyProducts(Array.isArray(data) ? data : [])
    } catch { }
  }

  async function fetchCart() {
    if (!user) return
    try {
      const res = await fetch(`${API}/cart`, {
        headers: { Authorization: `Bearer ${getToken()}` },
        credentials: 'include'
      })
      const data = await res.json()
      setCart(data || { items: [] })
    } catch { }
  }

  useEffect(() => {
    fetchAllProducts().finally(() => {
      setLoading(false)
      setTimeout(() => setInitialLoad(false), 800)
    })
  }, [])

  useEffect(() => {
    if (user) { fetchMyProducts(); fetchCart() }
  }, [user])

  async function handleAddToCart(product) {
    try {
      const res = await fetch(`${API}/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        credentials: 'include',
        body: JSON.stringify({ productId: product._id })
      })
      const data = await res.json()
      setCart(data)
      setSuccessMessage(`"${product.productname}" added to cart!`)
      navigate('/cart')
    } catch {
      setError('Failed to add to cart.')
    }
  }

  async function handleRemoveFromCart(productId) {
    try {
      const res = await fetch(`${API}/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
        credentials: 'include'
      })
      const data = await res.json()
      setCart(data)
      setSuccessMessage('Item removed from cart.')
    } catch {
      setError('Failed to remove from cart.')
    }
  }

  function handleDelete(product) {
    setConfirm({
      title: 'Delete Product',
      message: `Are you sure you want to delete "${product.productname}"? This cannot be undone.`,
      confirmLabel: 'Delete',
      type: 'danger',
      onConfirm: async () => {
        setConfirm(null)
        setPageLoading(true)
        try {
          const res = await fetch(`${API}/products/${product._id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${getToken()}` },
            credentials: 'include'
          })
          const data = await res.json()
          if (!res.ok) throw new Error(data.message)
          setSuccessMessage('Product deleted successfully.')
          fetchAllProducts()
          fetchMyProducts()
        } catch (err) {
          setError(err.message || 'Unable to delete product.')
        } finally {
          setPageLoading(false)
        }
      }
    })
  }

  async function handleLogout() {
    setPageLoading(true)
    await logout()
    setPageLoading(false)
  }

  function handleAuthSuccess() {
    setShowAuth(false)
    navigate('/dashboard')
  }

  const cartCount = cart?.items?.length || 0
  const unreadCount = notifications.filter(n => !n.read).length

  if (initialLoad || authLoading) {
    return (
      <>
        <CupLoader fullScreen />
        {slowLoading && (
          <div style={{ position: 'fixed', bottom: '40px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, textAlign: 'center' }}>
            <p style={{ color: '#9f3518', fontSize: '0.9rem', maxWidth: '280px', margin: 0 }}>
              Server is waking up... This may take 30-60 seconds on first load.
            </p>
          </div>
        )}
      </>
    )
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <Preview presetId="71aa34a1-e7db-4a5d-a6e8-03cec2d71771" />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Routes>
          <Route path="/" element={
            user ? <Navigate to="/dashboard" replace /> :
            <LandingPage products={allProducts} loading={loading} onLoginClick={() => { setAuthMode('login'); setShowAuth(true) }} onSignupClick={() => { setAuthMode('register'); setShowAuth(true) }} />
          } />

          <Route path="/*" element={
            <ProtectedRoute>
              <div style={{ display: 'flex', minHeight: '100vh' }}>
                <Sidebar unreadCount={unreadCount} cartCount={cartCount} onLogout={handleLogout} user={user} />
                <main style={{ marginLeft: '240px', flex: 1, padding: '40px', minHeight: '100vh', background: '#000000', boxSizing: 'border-box' }}>
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
                    <Route path="/dashboard" element={<Dashboard products={allProducts} myProducts={myProducts} user={user} onDeleteProduct={handleDelete} />} />
                    <Route path="/browse" element={<BrowseProducts products={allProducts} loading={loading} user={user} onAddToCart={handleAddToCart} onEdit={setModalProduct} onDelete={handleDelete} isAdmin={user?.role === 'admin'} />} />
                    <Route path="/my-products" element={<MyProducts products={myProducts} loading={loading} onAdd={() => setModalProduct(null)} onEdit={setModalProduct} onDelete={handleDelete} />} />
                    <Route path="/cart" element={<Cart cart={cart} onRemove={handleRemoveFromCart} />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/notifications" element={<Notifications notifications={notifications} setNotifications={setNotifications} />} />
                    <Route path="/profile" element={<Profile user={user} />} />
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </div>

      {showAuth && <AuthModal initialMode={authMode} onClose={() => setShowAuth(false)} onSuccess={handleAuthSuccess} />}

      {modalProduct !== undefined && (
        <ProductModal
          product={modalProduct}
          onClose={() => setModalProduct(undefined)}
          onSaved={(msg) => {
            setSuccessMessage(msg)
            fetchAllProducts()
            fetchMyProducts()
            setModalProduct(undefined)
          }}
        />
      )}

      {confirm && (
        <ConfirmModal
          title={confirm.title}
          message={confirm.message}
          confirmLabel={confirm.confirmLabel}
          type={confirm.type}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      {pageLoading && <CupLoader fullScreen />}
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
