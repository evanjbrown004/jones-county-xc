import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import AthleteCard from './components/AthleteCard'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import './App.css'

const PURPLE = '#16a34a'
const GOLD = '#F0C040'

const navItems = [
  { label: 'Home', section: 'top' },
  { label: 'High School', section: 'athletes' },
  { label: 'Runners', section: 'athletes' },
  { label: 'Top Hounds', section: 'highlights' },
  { label: 'Schedule', section: 'schedule' },
]

function scrollTo(section) {
  if (section === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' })
  }
}

const stats = [
  { value: '4x', label: 'Region Champions' },
  { value: '2022–25', label: 'Consecutive Titles' },
  { value: '100+', label: 'Athletes' },
  { value: '#1', label: 'Jones County' },
]

const highlights = [
  {
    icon: '🏆',
    title: 'Region Champions',
    desc: 'Four consecutive region titles: 2022, 2023, 2024, and 2025.',
  },
  {
    icon: '🏃',
    title: 'High School Team',
    desc: 'Varsity and JV runners competing at the highest level in the region.',
  },
  {
    icon: '❤️',
    title: 'Athlete Health',
    desc: 'Nutrition, recovery, and injury prevention resources for every runner.',
  },
]

function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center py-16 gap-4" role="alert">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <p className="text-red-500 font-semibold">{message}</p>
      <p className="text-gray-500 text-sm">Make sure the backend is running.</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-1 px-5 py-2 rounded-full text-sm font-bold border-0 cursor-pointer"
        style={{ background: PURPLE, color: '#fff', transition: 'opacity 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        onFocus={e => e.currentTarget.style.opacity = '0.85'}
        onBlur={e => e.currentTarget.style.opacity = '1'}
      >
        Try again
      </button>
    </div>
  )
}

function RunnerSpinner({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center py-16 gap-4" role="status" aria-label={label}>
      <svg
        width="64"
        height="80"
        viewBox="0 0 64 80"
        fill="none"
        aria-hidden="true"
        style={{ animation: 'runnerBounce 0.45s ease-in-out infinite' }}
      >
        {/* Head */}
        <circle cx="32" cy="10" r="7" fill={PURPLE} />

        {/* Body */}
        <line x1="32" y1="17" x2="32" y2="40" stroke={PURPLE} strokeWidth="3.5" strokeLinecap="round" />

        {/* Right arm (swings forward) */}
        <line
          x1="32" y1="23" x2="48" y2="33"
          stroke={GOLD} strokeWidth="3" strokeLinecap="round"
          style={{ transformOrigin: '32px 23px', animation: 'armFwd 0.45s ease-in-out infinite alternate' }}
        />
        {/* Left arm (swings back) */}
        <line
          x1="32" y1="23" x2="16" y2="33"
          stroke={GOLD} strokeWidth="3" strokeLinecap="round"
          style={{ transformOrigin: '32px 23px', animation: 'armBack 0.45s ease-in-out infinite alternate' }}
        />

        {/* Right leg (swings forward) */}
        <line
          x1="32" y1="40" x2="48" y2="62"
          stroke={PURPLE} strokeWidth="3" strokeLinecap="round"
          style={{ transformOrigin: '32px 40px', animation: 'legFwd 0.45s ease-in-out infinite alternate' }}
        />
        {/* Left leg (swings back) */}
        <line
          x1="32" y1="40" x2="16" y2="62"
          stroke={PURPLE} strokeWidth="3" strokeLinecap="round"
          style={{ transformOrigin: '32px 40px', animation: 'legBack 0.45s ease-in-out infinite alternate' }}
        />
      </svg>
      <span className="text-sm font-semibold tracking-wide" style={{ color: PURPLE }}>{label}</span>
    </div>
  )
}

function TodayDate() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  return (
    <span className="text-xs font-normal opacity-70">{today}</span>
  )
}

function AthletesSection() {
  const [category, setCategory] = useState('all')
  const { data: athletes = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['athletes'],
    queryFn: () => fetch('/api/athletes').then(r => r.json()),
  })

  const filtered = category === 'all'
    ? athletes
    : athletes.filter(a => a.events && a.events.includes(category))

  return (
    <section className="max-w-6xl mx-auto px-4 py-20" aria-label="Athletes">
      <h2 className="text-center text-3xl font-black mb-2" style={{ color: PURPLE, fontFamily: 'Georgia, serif' }}>
        Athletes
      </h2>
      <p className="text-center text-gray-500 mb-8 text-sm tracking-wide">Meet the Greyhounds</p>

      <div className="flex justify-center mb-10">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-48" aria-label="Filter athletes by event">
            <SelectValue placeholder="Filter by event" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="5K">5K</SelectItem>
            <SelectItem value="4K">4K</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <RunnerSpinner label="Loading athletes…" />
      ) : isError ? (
        <ErrorMessage message="Failed to load athletes." onRetry={refetch} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(a => <AthleteCard key={a.id} athlete={a} />)}
        </div>
      )}
    </section>
  )
}

function MeetsSection() {
  const [meets, setMeets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchMeets = () => {
    setLoading(true)
    setError(false)
    fetch('/api/meets')
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(data => { setMeets(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }

  useEffect(() => {
    fetchMeets()

    const handleFocus = () => fetchMeets()
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  return (
    <section className="max-w-6xl mx-auto px-4 py-20" aria-label="Upcoming Meets">
      <h2 className="text-center text-3xl font-black mb-2" style={{ color: PURPLE, fontFamily: 'Georgia, serif' }}>
        Upcoming Meets
      </h2>
      <p className="text-center text-gray-500 mb-12 text-sm tracking-wide">Race schedule for the season</p>

      {loading ? (
        <RunnerSpinner label="Loading meets…" />
      ) : error ? (
        <ErrorMessage message="Failed to load meets." onRetry={fetchMeets} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full text-sm" aria-label="Upcoming meets schedule">
            <caption className="sr-only">Upcoming meets schedule for Jones County Cross Country</caption>
            <thead>
              <tr style={{ background: PURPLE }}>
                <th scope="col" className="text-left px-6 py-4 font-black tracking-widest text-xs uppercase" style={{ color: GOLD }}>Meet</th>
                <th scope="col" className="text-left px-6 py-4 font-black tracking-widest text-xs uppercase" style={{ color: GOLD }}>Date</th>
                <th scope="col" className="text-left px-6 py-4 font-black tracking-widest text-xs uppercase" style={{ color: GOLD }}>Location</th>
              </tr>
            </thead>
            <tbody>
              {meets.map((m, i) => (
                <tr
                  key={m.id}
                  className="border-t border-gray-100 transition-colors"
                  style={{ background: i % 2 === 0 ? '#fff' : '#faf9ff' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f3eeff'}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#faf9ff'}
                  onFocus={e => e.currentTarget.style.background = '#f3eeff'}
                  onBlur={e => e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#faf9ff'}
                >
                  <td className="px-6 py-4 font-semibold" style={{ color: PURPLE }}>{m.name}</td>
                  <td className="px-6 py-4 text-gray-600">{m.date}</td>
                  <td className="px-6 py-4 text-gray-600">{m.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function Logo() {
  return (
    <div
      className="flex items-center justify-center w-16 h-16 rounded-full font-black text-2xl"
      style={{ background: GOLD, color: PURPLE, fontFamily: 'Georgia, serif' }}
      aria-hidden="true"
    >
      JC
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen" style={{ fontFamily: 'system-ui, sans-serif' }}>

      {/* Welcome banner */}
      <div className="text-center py-3 px-4 text-sm font-semibold tracking-wide flex items-center justify-center gap-6" style={{ background: '#f5f0ff', color: PURPLE, borderBottom: '2px solid #e0d4f7' }}>
        <span>Welcome to Jones County Cross Country &mdash; Home of the Greyhounds</span>
        <TodayDate />
      </div>

      {/* Top ticker */}
      <div className="text-center py-1.5 text-xs font-semibold tracking-widest text-white" style={{ background: PURPLE }}>
        SPORTSY0U CODE:&nbsp;
        <span className="font-black px-2 py-0.5 rounded text-sm" style={{ background: GOLD, color: PURPLE }}>
          2RPP–VGP8
        </span>
      </div>

      {/* Header / Nav */}
      <header className="sticky top-0 z-50 shadow-md" style={{ background: PURPLE }}>
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
          {/* Brand */}
          <a href="/" className="flex items-center gap-3 no-underline" aria-label="Jones County Cross Country home">
            <Logo />
            <div className="leading-tight">
              <div className="font-black text-lg tracking-wide text-white" style={{ fontFamily: 'Georgia, serif' }}>
                JONES COUNTY
              </div>
              <div className="text-xs font-semibold tracking-widest" style={{ color: GOLD }}>
                CROSS COUNTRY
              </div>
            </div>
          </a>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                className="px-3 py-1.5 text-sm font-semibold text-white rounded transition-colors cursor-pointer border-0"
                style={{ background: 'transparent' }}
                onClick={() => scrollTo(item.section)}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(240,192,64,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                onFocus={e => e.currentTarget.style.background = 'rgba(240,192,64,0.15)'}
                onBlur={e => e.currentTarget.style.background = 'transparent'}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative text-white text-center py-28 px-6 overflow-hidden"
        style={{ background: `linear-gradient(135deg, #15803d 0%, #16a34a 60%, #14532d 100%)` }}
        aria-label="Jones County Greyhounds Cross Country"
      >
        {/* Decorative circles */}
        <div className="absolute top-[-80px] right-[-80px] w-96 h-96 rounded-full opacity-10" style={{ background: GOLD }} aria-hidden="true" />
        <div className="absolute bottom-[-60px] left-[-60px] w-64 h-64 rounded-full opacity-10" style={{ background: GOLD }} aria-hidden="true" />

        <div className="relative max-w-3xl mx-auto">
          <div className="inline-block text-xs font-black tracking-widest px-4 py-1.5 rounded-full mb-6" style={{ background: GOLD, color: PURPLE }}>
            2022 · 2023 · 2024 · 2025 REGION CHAMPIONS
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-4 leading-none" style={{ fontFamily: 'Georgia, serif' }}>
            Jones County<br />
            <span style={{ color: GOLD }}>Greyhounds</span>
          </h1>
          <p className="text-lg md:text-xl opacity-80 mb-10 max-w-xl mx-auto">
            Building champions on and off the track. Welcome to Jones County Cross Country.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              type="button"
              className="px-8 py-3 rounded-full font-black text-sm tracking-wide cursor-pointer border-0"
              style={{ background: '#fff', color: PURPLE, boxShadow: '0 4px 14px rgba(0,0,0,0.25)', transition: 'transform 0.15s, box-shadow 0.15s' }}
              onClick={() => scrollTo('athletes')}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.35)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.25)' }}
              onFocus={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.35)' }}
              onBlur={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.25)' }}
            >
              MEET THE TEAM
            </button>
            <button
              type="button"
              className="px-8 py-3 rounded-full font-black text-sm tracking-wide cursor-pointer"
              style={{ background: 'transparent', border: '2px solid #fff', color: '#fff', boxShadow: '0 4px 14px rgba(0,0,0,0.2)', transition: 'transform 0.15s, box-shadow 0.15s, background 0.15s' }}
              onClick={() => scrollTo('schedule')}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'transparent' }}
              onFocus={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
              onBlur={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'transparent' }}
            >
              VIEW SCHEDULE
            </button>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div style={{ background: GOLD }}>
        <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-black" style={{ color: PURPLE, fontFamily: 'Georgia, serif' }}>
                {s.value}
              </div>
              <div className="text-xs font-bold tracking-widest uppercase" style={{ color: PURPLE }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Announcement banner */}
      <div className="text-center py-3 px-4 text-sm font-bold tracking-wide text-white" style={{ background: '#1a1a1a' }}>
        BE HYDRATED · BE READY TO RUN · BE ON TIME
      </div>

      {/* Highlights */}
      <section id="highlights" className="max-w-2xl mx-auto px-4 py-20" aria-label="About the Program">
        <h2 className="text-3xl font-black mb-2" style={{ color: PURPLE, fontFamily: 'Georgia, serif' }}>
          About the Program
        </h2>
        <p className="text-gray-500 mb-10 text-sm tracking-wide">Everything you need to know about Jones County XC</p>
        <div className="flex flex-col gap-4">
          {highlights.map((h) => (
            <div
              key={h.title}
              className="flex items-start gap-5 rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              style={{ background: '#fff' }}
            >
              <div className="text-3xl mt-0.5" aria-hidden="true">{h.icon}</div>
              <div>
                <h3 className="font-black text-base mb-1" style={{ color: PURPLE }}>{h.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{h.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Athletes */}
      <div id="athletes"><AthletesSection /></div>

      {/* Meets */}
      <div id="schedule"><MeetsSection /></div>

      {/* CTA banner */}
      <section className="py-16 px-6 text-center" style={{ background: `linear-gradient(135deg, #15803d, #16a34a)` }} aria-label="Join the team">
        <h2 className="text-3xl font-black text-white mb-3" style={{ fontFamily: 'Georgia, serif' }}>
          Ready to Run with the Greyhounds?
        </h2>
        <p className="text-white opacity-75 mb-8 max-w-md mx-auto">
          Join the team, track your progress, and be part of a championship program.
        </p>
        <button
          type="button"
          className="px-10 py-3 rounded-full font-black text-sm tracking-wide border-0 cursor-pointer"
          style={{ background: '#fff', color: PURPLE, boxShadow: '0 4px 14px rgba(0,0,0,0.25)', transition: 'transform 0.15s, box-shadow 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.35)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.25)' }}
          onFocus={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.35)' }}
          onBlur={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.25)' }}
        >
          JOIN THE TEAM
        </button>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 text-center" style={{ background: '#111' }}>
        <div className="flex justify-center items-center gap-3 mb-3">
          <Logo />
          <div className="text-left">
            <div className="font-black text-white text-sm" style={{ fontFamily: 'Georgia, serif' }}>JONES COUNTY XC</div>
            <div className="text-xs" style={{ color: GOLD }}>GREYHOUNDS</div>
          </div>
        </div>
        <p className="text-gray-400 text-xs mt-4">
          © {new Date().getFullYear()} Jones County Cross Country · jonescountyhounds.com
        </p>
      </footer>

    </div>
  )
}
