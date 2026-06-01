import UserDashboard from './UserDashboard'
import AdminDashboard from './AdminDashboard'

export default function Dashboard({ products, user, onDeleteProduct }) {
  if (user?.role === 'admin') {
    return <AdminDashboard products={products} onDeleteProduct={onDeleteProduct} />
  }
  return <UserDashboard products={products} user={user} />
}
