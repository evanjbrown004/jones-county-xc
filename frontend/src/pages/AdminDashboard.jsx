import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const GREEN = '#16a34a'
const GOLD = '#F0C040'

function useAdminAuth() {
  const navigate = useNavigate()
  const token = localStorage.getItem('admin_token')

  useEffect(() => {
    if (!token) {
      navigate('/admin/login')
      return
    }
    // Verify token is still valid
    fetch('/api/admin/me', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => {
      if (!r.ok) {
        localStorage.removeItem('admin_token')
        navigate('/admin/login')
      }
    }).catch(() => {
      navigate('/admin/login')
    })
  }, [token, navigate])

  return token
}

function StatCard({ label, value }) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      <div className="text-3xl font-black" style={{ color: GREEN, fontFamily: 'Georgia, serif' }}>
        {value ?? '—'}
      </div>
      <div className="text-xs font-bold tracking-widest uppercase text-gray-500 mt-1">{label}</div>
    </div>
  )
}

export default function AdminDashboard() {
  const token = useAdminAuth()
  const [athletes, setAthletes] = useState([])
  const [meets, setMeets] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) return
    fetch('/api/athletes').then(r => r.json()).then(setAthletes).catch(() => {})
    fetch('/api/meets').then(r => r.json()).then(setMeets).catch(() => {})
  }, [token])

  function handleLogout() {
    localStorage.removeItem('admin_token')
    navigate('/admin/login')
  }

  if (!token) return null

  return (
    <div className="min-h-screen" style={{ background: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <header style={{ background: GREEN }} className="shadow-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-full font-black text-lg"
              style={{ background: GOLD, color: GREEN, fontFamily: 'Georgia, serif' }}
              aria-hidden="true"
            >
              JC
            </div>
            <div>
              <div className="font-black text-white text-sm tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
                JONES COUNTY XC
              </div>
              <div className="text-xs font-semibold tracking-widest" style={{ color: GOLD }}>
                ADMIN DASHBOARD
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm font-semibold text-white opacity-75 hover:opacity-100 transition-opacity">
              ← View Site
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-1.5 rounded-full text-sm font-bold border-0 cursor-pointer"
              style={{ background: GOLD, color: GREEN }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-black" style={{ color: GREEN, fontFamily: 'Georgia, serif' }}>
            Welcome back, Coach
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage your team, meets, and results below.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Total Athletes" value={athletes.length || null} />
          <StatCard label="Upcoming Meets" value={meets.length || null} />
          <StatCard label="Region Titles" value="4x" />
          <StatCard label="Season" value="2025" />
        </div>

        {/* Quick links */}
        <h2 className="text-lg font-black mb-4" style={{ color: GREEN }}>Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Manage Athletes', desc: 'Add or remove runners', icon: '🏃', to: '/admin/athletes' },
            { label: 'Manage Meets', desc: 'Update the race schedule', icon: '📅', to: '/admin/meets' },
            { label: 'Enter Results', desc: 'Post times after a race', icon: '🏆', to: '/admin/results' },
          ].map(item => (
            <Link
              key={item.label}
              to={item.to}
              style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                cursor: 'pointer',
                transition: 'box-shadow 0.15s',
                textDecoration: 'none',
                display: 'block',
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.10)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'}
            >
              <div className="text-3xl mb-3" aria-hidden="true">{item.icon}</div>
              <div className="font-black text-base mb-1" style={{ color: GREEN }}>{item.label}</div>
              <div className="text-sm text-gray-500">{item.desc}</div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
