import { useState, useEffect } from 'react'
import { Package, Users, LayoutGrid, DollarSign, Trash2 } from 'lucide-react'
import StatCard from '../components/StatCard'
import ConfirmModal from '../components/ConfirmModal'

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value) || 0)
}

const API = import.meta.env.VITE_API_URL || ''
function imgUrl(src) { return src ? `${API}${src}` : '' }

function getToken() {
  return localStorage.getItem('token')
}

export default function AdminDashboard({ products = [], onDeleteProduct }) {
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  const [confirm, setConfirm] = useState(null)

  useEffect(() => {
    fetch(`${API}/users`, { headers: { Authorization: `Bearer ${getToken()}` }, credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setUsers(data)
        else console.error('Users fetch error:', data)
      })
      .catch(err => console.error('Users fetch failed:', err))
      .finally(() => setUsersLoading(false))
  }, [])

  async function handleDeleteUser(user) {
    setConfirm({
      title: 'Delete User',
      message: `Are you sure you want to delete "${user.name}"? This will permanently remove their account.`,
      confirmLabel: 'Delete User',
      type: 'danger',
      onConfirm: async () => {
        setConfirm(null)
        try {
          const res = await fetch(`${API}/users/${user._id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${getToken()}` },
            credentials: 'include'
          })
          const data = await res.json()
          if (!res.ok) throw new Error(data.message)
          setUsers(prev => prev.filter(u => u._id !== user._id))
        } catch (err) {
          alert(err.message)
        }
      }
    })
  }

  const totalValue = products.reduce((s, p) => s + (Number(p.productprice) || 0), 0)
  const categories = new Set(products.map(p => p.productcategory).filter(Boolean))

  const tabs = ['overview', 'products', 'users']

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <p style={{ margin: '0 0 4px', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admin Panel</p>
        <h1 style={{ margin: 0, color: '#fff8ef', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.04em', fontFamily: '"Instrument Serif", serif', fontWeight: 400 }}>
          Control Center
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        <StatCard icon={<Package size={22} />} label="Total Products" value={products.length} accent />
        <StatCard icon={<Users size={22} />} label="Total Users" value={users.length} />
        <StatCard icon={<LayoutGrid size={22} />} label="Categories" value={categories.size} />
        <StatCard icon={<DollarSign size={22} />} label="Catalog Value" value={formatCurrency(totalValue)} />
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '10px 22px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.15)',
            background: activeTab === tab ? 'linear-gradient(135deg, #d95f39, #9f3518)' : 'rgba(255,255,255,0.07)',
            color: '#fff8ef', cursor: 'pointer', fontWeight: activeTab === tab ? 700 : 400,
            fontSize: '0.88rem', textTransform: 'capitalize',
          }}>{tab}</button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: 'rgba(255,250,242,0.06)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '24px' }}>
            <p style={{ margin: '0 0 16px', fontWeight: 700, color: '#fff8ef', fontSize: '1rem' }}>Latest Products</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {products.slice(0, 6).map(p => (
                <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0, overflow: 'hidden', background: 'linear-gradient(135deg, #d95f39, #9f3518)' }}>
                    {p.productimage && <img src={imgUrl(p.productimage)} alt={p.productname} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <p style={{ margin: 0, color: '#fff8ef', fontSize: '0.88rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.productname}</p>
                    <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{p.productcategory}</p>
                  </div>
                  <span style={{ color: '#9f3518', fontWeight: 700, fontSize: '0.85rem' }}>{formatCurrency(p.productprice)}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'rgba(255,250,242,0.06)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '24px' }}>
            <p style={{ margin: '0 0 16px', fontWeight: 700, color: '#fff8ef', fontSize: '1rem' }}>Latest Users</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {usersLoading ? <p style={{ color: 'rgba(255,255,255,0.35)', margin: 0 }}>Loading...</p>
                : users.slice(0, 6).map(u => (
                <div key={u._id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #d95f39, #9f3518)', display: 'grid', placeItems: 'center', color: '#fff8ef', fontWeight: 700, fontSize: '0.85rem' }}>
                    {u.name?.[0]?.toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, color: '#fff8ef', fontSize: '0.88rem', fontWeight: 600 }}>{u.name}</p>
                    <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{u.email}</p>
                  </div>
                  <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, background: u.role === 'admin' ? 'rgba(217,95,57,0.2)' : 'rgba(255,255,255,0.08)', color: u.role === 'admin' ? '#d95f39' : 'rgba(255,255,255,0.5)' }}>{u.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div style={{ background: 'rgba(255,250,242,0.06)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['Product', 'Category', 'Price', 'Action'].map(h => (
                  <th key={h} style={{ padding: '16px 20px', textAlign: 'left', color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0, overflow: 'hidden', background: 'linear-gradient(135deg, #d95f39, #9f3518)' }}>
                        {p.productimage && <img src={imgUrl(p.productimage)} alt={p.productname} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                      </div>
                      <span style={{ color: '#fff8ef', fontSize: '0.9rem', fontWeight: 600 }}>{p.productname}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem' }}>{p.productcategory}</td>
                  <td style={{ padding: '14px 20px', color: '#9f3518', fontWeight: 700, fontSize: '0.88rem' }}>{formatCurrency(p.productprice)}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <button onClick={() => setConfirm({
                      title: 'Delete Product',
                      message: `Are you sure you want to delete "${p.productname}"? This cannot be undone.`,
                      confirmLabel: 'Delete',
                      type: 'danger',
                      onConfirm: () => { setConfirm(null); onDeleteProduct(p) }
                    })} style={{ padding: '7px 12px', borderRadius: '999px', border: 'none', background: 'rgba(143,39,22,0.2)', color: '#d95f39', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600 }}><Trash2 size={14} /> Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'users' && (
        <div style={{ background: 'rgba(255,250,242,0.06)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['User', 'Email', 'Role', 'Joined', 'Action'].map(h => (
                  <th key={h} style={{ padding: '16px 20px', textAlign: 'left', color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {usersLoading ? (
                <tr><td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.35)' }}>Loading users...</td></tr>
              ) : users.map(u => (
                <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #d95f39, #9f3518)', display: 'grid', placeItems: 'center', color: '#fff8ef', fontWeight: 700, fontSize: '0.82rem', flexShrink: 0 }}>
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <span style={{ color: '#fff8ef', fontSize: '0.9rem', fontWeight: 600 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem' }}>{u.email}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, background: u.role === 'admin' ? 'rgba(217,95,57,0.2)' : 'rgba(255,255,255,0.08)', color: u.role === 'admin' ? '#d95f39' : 'rgba(255,255,255,0.5)' }}>{u.role}</span>
                  </td>
                  <td style={{ padding: '14px 20px', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '14px 20px' }}>
                    {u.role !== 'admin' && (
                      <button onClick={() => handleDeleteUser(u)} style={{ padding: '7px 12px', borderRadius: '999px', border: 'none', background: 'rgba(143,39,22,0.2)', color: '#d95f39', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600 }}><Trash2 size={14} /> Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
    </div>
  )
}
