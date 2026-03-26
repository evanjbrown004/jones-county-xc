import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const GREEN = '#16a34a'
const GOLD = '#F0C040'

export function useAdminAuth() {
  const navigate = useNavigate()
  const token = localStorage.getItem('admin_token')

  useEffect(() => {
    if (!token) { navigate('/admin/login'); return }
    fetch('/api/admin/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (!r.ok) { localStorage.removeItem('admin_token'); navigate('/admin/login') } })
      .catch(() => navigate('/admin/login'))
  }, [token, navigate])

  return token
}

export function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
  }
}

export function AdminLayout({ title, children }) {
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('admin_token')
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen" style={{ background: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ background: GREEN }} className="shadow-md">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="flex items-center gap-2 no-underline">
              <div
                className="flex items-center justify-center w-9 h-9 rounded-full font-black text-base"
                style={{ background: GOLD, color: GREEN, fontFamily: 'Georgia, serif' }}
                aria-hidden="true"
              >JC</div>
              <span className="font-black text-white text-sm tracking-wide hidden sm:block" style={{ fontFamily: 'Georgia, serif' }}>
                Admin
              </span>
            </Link>
            <span className="text-white opacity-40">/</span>
            <span className="font-bold text-white text-sm">{title}</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm font-semibold text-white opacity-70 hover:opacity-100 transition-opacity">
              ← Site
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-full text-xs font-bold border-0 cursor-pointer"
              style={{ background: GOLD, color: GREEN }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-10">{children}</main>
    </div>
  )
}
