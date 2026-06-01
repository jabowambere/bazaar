import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { setLoading(false); return }
    fetch('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include'
    })
      .then(r => r.json())
      .then(data => { if (data.user) setUser(data.user) })
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false))
  }, [])

  async function login(email, password) {
    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    localStorage.setItem('token', data.token)
    setUser(data.user)
    return data.user
  }

  async function register(name, email, password) {
    const res = await fetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, password })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    localStorage.setItem('token', data.token)
    setUser(data.user)
    return data.user
  }

  async function logout() {
    await fetch('/auth/logout', { method: 'POST', credentials: 'include' })
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
