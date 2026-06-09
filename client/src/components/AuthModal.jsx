import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import CupLoader from './CupLoader'

export default function AuthModal({ onClose, onSuccess, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(form.email, form.password)
      } else {
        await register(form.name, form.email, form.password)
      }
      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {loading && <CupLoader fullScreen />}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'grid', placeItems: 'center', padding: '20px',
        background: 'rgba(26,24,21,0.7)', backdropFilter: 'blur(10px)',
      }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        width: 'min(100%, 440px)', padding: '36px',
        borderRadius: '28px', background: 'rgba(255,250,242,0.09)',
        backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <p style={{ margin: '0 0 4px', color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {mode === 'login' ? 'Welcome back' : 'Join Bazaar'}
            </p>
            <h2 style={{ margin: 0, color: '#fff8ef', fontFamily: '"Instrument Serif", serif', fontWeight: 400, fontSize: '1.9rem', letterSpacing: '-0.03em' }}>
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </h2>
          </div>
          <button onClick={onClose} style={{
            width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)',
            background: 'rgba(255,255,255,0.07)', color: '#fff8ef', cursor: 'pointer', fontSize: '1.2rem',
          }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {mode === 'register' && (
            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
              Full Name
              <input name="name" type="text" value={form.name} onChange={handleChange} required placeholder="Your name"
                style={{ padding: '13px 16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.07)', color: '#fff8ef', outline: 'none', fontSize: '0.95rem' }} />
            </label>
          )}
          <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@email.com"
              style={{ padding: '13px 16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.07)', color: '#fff8ef', outline: 'none', fontSize: '0.95rem' }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
            Password
            <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="••••••••"
              style={{ padding: '13px 16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.07)', color: '#fff8ef', outline: 'none', fontSize: '0.95rem' }} />
          </label>

          {error && (
            <p style={{ margin: 0, padding: '12px 14px', borderRadius: '12px', background: 'rgba(143,39,22,0.2)', color: '#9f3518', fontSize: '0.88rem', border: '1px solid rgba(159,53,24,0.3)' }}>{error}</p>
          )}

          <button type="submit" disabled={loading} style={{
            marginTop: '6px', padding: '14px', borderRadius: '999px', border: 'none',
            background: 'linear-gradient(135deg, #d95f39, #9f3518)',
            color: '#fff8ef', fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(159,53,24,0.35)', opacity: loading ? 0.7 : 1,
          }}>
            {loading ? '...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p style={{ margin: '20px 0 0', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.88rem' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }} style={{
            background: 'none', border: 'none', color: '#d95f39', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem',
          }}>{mode === 'login' ? 'Register' : 'Sign in'}</button>
        </p>
      </div>
      </div>
    </>
  )
}
