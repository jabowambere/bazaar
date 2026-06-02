import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import CupLoader from './CupLoader'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()

  if (loading) return <CupLoader fullScreen />

  if (!user) return <Navigate to="/" replace />
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />

  return children
}
