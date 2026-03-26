import { useState, useEffect } from 'react'
import { AdminLayout, useAdminAuth, authHeaders } from './AdminLayout.jsx'

const GREEN = '#16a34a'

export default function ManageMeets() {
  const token = useAdminAuth()
  const [meets, setMeets] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', date: '', location: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function loadMeets() {
    setLoading(true)
    fetch('/api/meets').then(r => r.json()).then(data => { setMeets(data); setLoading(false) })
  }

  useEffect(() => { if (token) loadMeets() }, [token])

  async function handleAdd(e) {
    e.preventDefault()
    setError(''); setSuccess(''); setSaving(true)
    try {
      const res = await fetch('/api/meets/create', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to add meet.'); return }
      setSuccess(`${form.name} added!`)
      setForm({ name: '', date: '', location: '' })
      loadMeets()
    } catch { setError('Could not reach the server.') }
    finally { setSaving(false) }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Remove "${name}"?`)) return
    try {
      const res = await fetch(`/api/meets/delete/${id}`, { method: 'DELETE', headers: authHeaders() })
      if (!res.ok) { setError('Failed to delete meet.'); return }
      setMeets(prev => prev.filter(m => m.id !== id))
    } catch { setError('Could not reach the server.') }
  }

  if (!token) return null

  return (
    <AdminLayout title="Manage Meets">
      <h1 className="text-2xl font-black mb-6" style={{ color: GREEN, fontFamily: 'Georgia, serif' }}>Manage Meets</h1>

      {/* Add form */}
      <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '32px' }}>
        <h2 className="font-black text-lg mb-5" style={{ color: GREEN }}>Add New Meet</h2>
        <form onSubmit={handleAdd}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <Field label="Meet Name *" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="e.g. Region Championship" required />
            <Field label="Date *" value={form.date} onChange={v => setForm(f => ({ ...f, date: v }))} type="date" required />
            <Field label="Location" value={form.location} onChange={v => setForm(f => ({ ...f, location: v }))} placeholder="e.g. Gray, GA" />
          </div>

          {error && <Alert type="error">{error}</Alert>}
          {success && <Alert type="success">{success}</Alert>}

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-full font-black text-sm border-0 cursor-pointer"
            style={{ background: saving ? '#86efac' : GREEN, color: '#fff' }}
          >
            {saving ? 'Adding…' : 'Add Meet'}
          </button>
        </form>
      </div>

      {/* Meets list */}
      <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-black text-lg" style={{ color: GREEN }}>Scheduled Meets ({meets.length})</h2>
        </div>
        {loading ? (
          <p className="text-center py-10 text-gray-400">Loading…</p>
        ) : meets.length === 0 ? (
          <p className="text-center py-10 text-gray-400">No meets scheduled yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-6 py-3 font-bold text-gray-500 text-xs uppercase tracking-wide">Meet</th>
                <th className="text-left px-6 py-3 font-bold text-gray-500 text-xs uppercase tracking-wide">Date</th>
                <th className="text-left px-6 py-3 font-bold text-gray-500 text-xs uppercase tracking-wide">Location</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {meets.map((m, i) => (
                <tr key={m.id} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }} className="border-t border-gray-100">
                  <td className="px-6 py-3 font-semibold" style={{ color: GREEN }}>{m.name}</td>
                  <td className="px-6 py-3 text-gray-600">{m.date}</td>
                  <td className="px-6 py-3 text-gray-600">{m.location || '—'}</td>
                  <td className="px-6 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(m.id, m.name)}
                      className="text-xs font-bold px-3 py-1 rounded-full border-0 cursor-pointer"
                      style={{ background: '#fef2f2', color: '#dc2626' }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text', required }) {
  return (
    <div>
      <label className="block text-sm font-bold mb-1" style={{ color: '#16a34a' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        style={{ width: '100%', padding: '9px 12px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '0.9rem', boxSizing: 'border-box' }}
      />
    </div>
  )
}

function Alert({ type, children }) {
  const styles = type === 'error'
    ? { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }
    : { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }
  return <div role={type === 'error' ? 'alert' : 'status'} className="mb-4 px-4 py-3 rounded-lg text-sm font-semibold" style={styles}>{children}</div>
}
