import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const API = import.meta.env.VITE_API_URL || ''

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', password: '' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)
  const [error, setError] = useState(null)

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setMsg(null)
    setError(null)
    try {
      const body = { name: form.name, email: form.email }
      if (form.password) body.password = form.password
      const res = await fetch(`${API}/users/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        credentials: 'include',
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      updateUser(data.user)
      setForm(f => ({ ...f, password: '' }))
      setMsg('Profile updated successfully.')
    } catch (err) {
      setError(err.message || 'Update failed.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <p style={{ margin: '0 0 4px', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Account</p>
        <h1 style={{ margin: 0, color: '#fff8ef', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.04em', fontFamily: '"Instrument Serif", serif', fontWeight: 400 }}>My Profile</h1>
      </div>

      <div className="profile-grid">
        <div style={{ padding: '28px', borderRadius: '24px', textAlign: 'center', background: 'rgba(255,250,242,0.07)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ width: '88px', height: '88px', borderRadius: '50%', margin: '0 auto 16px', background: 'linear-gradient(135deg, #d95f39, #9f3518)', display: 'grid', placeItems: 'center', fontSize: '2rem', color: '#fff8ef' }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <p style={{ margin: '0 0 4px', color: '#fff8ef', fontWeight: 700, fontSize: '1.1rem' }}>{user?.name}</p>
          <p style={{ margin: '0 0 8px', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>{user?.email}</p>
          <span style={{ display: 'inline-block', padding: '4px 14px', borderRadius: '999px', background: 'rgba(217,95,57,0.15)', border: '1px solid rgba(217,95,57,0.3)', color: '#d95f39', fontSize: '0.78rem', textTransform: 'capitalize' }}>{user?.role}</span>
        </div>

        <div style={{ padding: '28px', borderRadius: '24px', background: 'rgba(255,250,242,0.07)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ margin: '0 0 20px', fontWeight: 700, color: '#fff8ef', fontSize: '1rem' }}>Edit Profile</p>

          {msg && <div style={{ marginBottom: '16px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(221,242,226,0.15)', border: '1px solid rgba(100,200,100,0.3)', color: '#a8f0b0', fontSize: '0.88rem' }}>{msg}</div>}
          {error && <div style={{ marginBottom: '16px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(217,95,57,0.1)', border: '1px solid rgba(217,95,57,0.3)', color: '#f4a07a', fontSize: '0.88rem' }}>{error}</div>}

          <form onSubmit={handleSave} style={{ display: 'grid', gap: '16px' }}>
            {[['Full Name', 'name', 'text'], ['Email', 'email', 'email'], ['New Password', 'password', 'password']].map(([label, field, type]) => (
              <label key={field} style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem', fontWeight: 500 }}>
                {label}
                <input
                  type={type}
                  value={form[field]}
                  placeholder={field === 'password' ? 'Leave blank to keep current' : ''}
                  onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                  style={{ padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(0,0,0,0.25)', color: '#fff8ef', outline: 'none', fontSize: '0.92rem' }}
                />
              </label>
            ))}
            <button type="submit" disabled={saving} style={{ marginTop: '8px', padding: '14px', borderRadius: '999px', border: 'none', background: 'linear-gradient(135deg, #d95f39, #9f3518)', color: '#fff8ef', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: '0.95rem', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
