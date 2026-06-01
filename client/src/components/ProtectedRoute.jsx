import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()

  if (loading) return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
      <div style={{ width: '42px', height: '42px', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#d95f39', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (!user) return <Navigate to="/" replace />
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />

  return children
}
