import { useState, useEffect } from 'react'
import { AdminLayout, useAdminAuth, authHeaders } from './AdminLayout.jsx'

const GREEN = '#16a34a'

export default function EnterResults() {
  const token = useAdminAuth()
  const [athletes, setAthletes] = useState([])
  const [meets, setMeets] = useState([])
  const [form, setForm] = useState({ athleteId: '', meetId: '', time: '', place: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [results, setResults] = useState([])
  const [loadingResults, setLoadingResults] = useState(false)

  useEffect(() => {
    if (!token) return
    fetch('/api/athletes').then(r => r.json()).then(setAthletes).catch(() => {})
    fetch('/api/meets').then(r => r.json()).then(setMeets).catch(() => {})
  }, [token])

  useEffect(() => {
    if (!form.meetId) { setResults([]); return }
    setLoadingResults(true)
    fetch(`/api/meets/${form.meetId}/results`)
      .then(r => r.json())
      .then(data => { setResults(data); setLoadingResults(false) })
      .catch(() => setLoadingResults(false))
  }, [form.meetId])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setSuccess(''); setSaving(true)
    try {
      const res = await fetch('/api/results', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          athlete_id: Number(form.athleteId),
          meet_id: Number(form.meetId),
          time: form.time,
          place: Number(form.place),
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to save result.'); return }
      const athlete = athletes.find(a => a.id === Number(form.athleteId))
      setSuccess(`Result saved for ${athlete?.name || 'athlete'}!`)
      setForm(f => ({ ...f, athleteId: '', time: '', place: '' }))
      // Refresh results for this meet
      fetch(`/api/meets/${form.meetId}/results`).then(r => r.json()).then(setResults).catch(() => {})
    } catch { setError('Could not reach the server.') }
    finally { setSaving(false) }
  }

  if (!token) return null

  return (
    <AdminLayout title="Enter Results">
      <h1 className="text-2xl font-black mb-6" style={{ color: GREEN, fontFamily: 'Georgia, serif' }}>Enter Results</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Form */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h2 className="font-black text-lg mb-5" style={{ color: GREEN }}>Post a Result</h2>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 mb-4">

              <div>
                <label className="block text-sm font-bold mb-1" style={{ color: GREEN }}>Meet *</label>
                <select
                  required
                  value={form.meetId}
                  onChange={e => setForm(f => ({ ...f, meetId: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '0.9rem' }}
                >
                  <option value="">Select a meet</option>
                  {meets.map(m => <option key={m.id} value={m.id}>{m.name} — {m.date}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1" style={{ color: GREEN }}>Athlete *</label>
                <select
                  required
                  value={form.athleteId}
                  onChange={e => setForm(f => ({ ...f, athleteId: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '0.9rem' }}
                >
                  <option value="">Select an athlete</option>
                  {athletes.map(a => <option key={a.id} value={a.id}>{a.name} (Gr. {a.grade})</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1" style={{ color: GREEN }}>Finish Time *</label>
                  <input
                    required
                    type="text"
                    value={form.time}
                    onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                    placeholder="e.g. 17:42"
                    style={{ width: '100%', padding: '9px 12px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '0.9rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1" style={{ color: GREEN }}>Place</label>
                  <input
                    type="number"
                    value={form.place}
                    onChange={e => setForm(f => ({ ...f, place: e.target.value }))}
                    placeholder="e.g. 3"
                    min="1"
                    style={{ width: '100%', padding: '9px 12px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '0.9rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </div>

            {error && <Alert type="error">{error}</Alert>}
            {success && <Alert type="success">{success}</Alert>}

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 rounded-full font-black text-sm border-0 cursor-pointer"
              style={{ background: saving ? '#86efac' : GREEN, color: '#fff' }}
            >
              {saving ? 'Saving…' : 'Save Result'}
            </button>
          </form>
        </div>

        {/* Results for selected meet */}
        <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-black text-lg" style={{ color: GREEN }}>
              {form.meetId
                ? `Results — ${meets.find(m => m.id === Number(form.meetId))?.name || ''}`
                : 'Select a meet to see results'}
            </h2>
          </div>
          {!form.meetId ? (
            <p className="text-center py-10 text-gray-400 text-sm">Choose a meet on the left.</p>
          ) : loadingResults ? (
            <p className="text-center py-10 text-gray-400">Loading…</p>
          ) : results.length === 0 ? (
            <p className="text-center py-10 text-gray-400 text-sm">No results posted yet for this meet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-6 py-3 font-bold text-gray-500 text-xs uppercase tracking-wide">Place</th>
                  <th className="text-left px-6 py-3 font-bold text-gray-500 text-xs uppercase tracking-wide">Athlete</th>
                  <th className="text-left px-6 py-3 font-bold text-gray-500 text-xs uppercase tracking-wide">Time</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={r.id} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }} className="border-t border-gray-100">
                    <td className="px-6 py-3 font-bold text-gray-500">{r.place || '—'}</td>
                    <td className="px-6 py-3 font-semibold" style={{ color: GREEN }}>{r.athleteName}</td>
                    <td className="px-6 py-3 text-gray-600">{r.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

function Alert({ type, children }) {
  const styles = type === 'error'
    ? { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }
    : { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }
  return <div role={type === 'error' ? 'alert' : 'status'} className="mb-4 px-4 py-3 rounded-lg text-sm font-semibold" style={styles}>{children}</div>
}
