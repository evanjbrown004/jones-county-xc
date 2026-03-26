import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const GREEN = '#16a34a'
const GOLD = '#F0C040'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login failed.')
        return
      }

      localStorage.setItem('admin_token', data.token)
      navigate('/admin')
    } catch {
      setError('Could not reach the server. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: `linear-gradient(135deg, #15803d 0%, #16a34a 60%, #14532d 100%)` }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '40px 36px',
          width: '100%',
          maxWidth: '380px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="flex items-center justify-center w-16 h-16 rounded-full font-black text-2xl mb-3"
            style={{ background: GOLD, color: GREEN, fontFamily: 'Georgia, serif' }}
            aria-hidden="true"
          >
            JC
          </div>
          <h1 className="font-black text-xl tracking-wide" style={{ color: GREEN, fontFamily: 'Georgia, serif' }}>
            Admin Login
          </h1>
          <p className="text-gray-500 text-sm mt-1">Jones County Cross Country</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block text-sm font-bold mb-2"
              style={{ color: GREEN }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              autoComplete="current-password"
              style={{
                width: '100%',
                padding: '10px 14px',
                border: error ? '2px solid #ef4444' : '2px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.15s',
                boxSizing: 'border-box',
              }}
              onFocus={e => { if (!error) e.target.style.borderColor = GREEN }}
              onBlur={e => { if (!error) e.target.style.borderColor = '#e5e7eb' }}
            />
          </div>

          {error && (
            <div
              role="alert"
              className="mb-4 px-4 py-3 rounded-lg text-sm font-semibold"
              style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full font-black text-sm tracking-wide border-0 cursor-pointer"
            style={{
              background: loading ? '#86efac' : GREEN,
              color: '#fff',
              transition: 'background 0.15s, opacity 0.15s',
              opacity: loading ? 0.8 : 1,
            }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-6 text-xs text-gray-400">
          <a href="/" style={{ color: GREEN }}>← Back to site</a>
        </p>
      </div>
    </div>
  )
}
