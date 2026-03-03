import './App.css'

const PURPLE = '#3B1A69'
const GOLD = '#F0C040'

const navItems = [
  { label: 'Home' },
  { label: 'High School', dropdown: true },
  { label: 'Middle School', dropdown: true },
  { label: 'Runners' },
  { label: 'Top Hounds', dropdown: true },
  { label: 'Schedule' },
  { label: 'Practice' },
]

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
    icon: '🍎',
    title: 'Middle School Team',
    desc: 'Building the next generation of Greyhound champions.',
  },
  {
    icon: '❤️',
    title: 'Athlete Health',
    desc: 'Nutrition, recovery, and injury prevention resources for every runner.',
  },
]

function Logo() {
  return (
    <div
      className="flex items-center justify-center w-16 h-16 rounded-full font-black text-2xl"
      style={{ background: GOLD, color: PURPLE, fontFamily: 'Georgia, serif' }}
    >
      JC
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen" style={{ fontFamily: 'system-ui, sans-serif' }}>

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
          <a href="/" className="flex items-center gap-3 no-underline">
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
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                className="px-3 py-1.5 text-sm font-semibold text-white rounded transition-colors cursor-pointer border-0"
                style={{ background: 'transparent' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(240,192,64,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {item.label} {item.dropdown && <span className="opacity-60 text-xs">▾</span>}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative text-white text-center py-28 px-6 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${PURPLE} 0%, #6B2FA0 60%, #2D1050 100%)` }}
      >
        {/* Decorative circles */}
        <div className="absolute top-[-80px] right-[-80px] w-96 h-96 rounded-full opacity-10" style={{ background: GOLD }} />
        <div className="absolute bottom-[-60px] left-[-60px] w-64 h-64 rounded-full opacity-10" style={{ background: GOLD }} />

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
              className="px-8 py-3 rounded-full font-black text-sm tracking-wide transition-transform hover:scale-105 border-0 cursor-pointer"
              style={{ background: GOLD, color: PURPLE }}
            >
              MEET THE TEAM
            </button>
            <button
              className="px-8 py-3 rounded-full font-black text-sm tracking-wide transition-transform hover:scale-105 cursor-pointer"
              style={{ background: 'transparent', border: `2px solid ${GOLD}`, color: GOLD }}
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

      {/* Highlights grid */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-center text-3xl font-black mb-2" style={{ color: PURPLE, fontFamily: 'Georgia, serif' }}>
          About the Program
        </h2>
        <p className="text-center text-gray-500 mb-12 text-sm tracking-wide">Everything you need to know about Jones County XC</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((h) => (
            <div
              key={h.title}
              className="rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-4">{h.icon}</div>
              <h3 className="font-black text-lg mb-2" style={{ color: PURPLE }}>{h.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-16 px-6 text-center" style={{ background: `linear-gradient(135deg, ${PURPLE}, #5C2D8F)` }}>
        <h2 className="text-3xl font-black text-white mb-3" style={{ fontFamily: 'Georgia, serif' }}>
          Ready to Run with the Greyhounds?
        </h2>
        <p className="text-white opacity-75 mb-8 max-w-md mx-auto">
          Join the team, track your progress, and be part of a championship program.
        </p>
        <button
          className="px-10 py-3 rounded-full font-black text-sm tracking-wide transition-transform hover:scale-105 border-0 cursor-pointer"
          style={{ background: GOLD, color: PURPLE }}
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
        <p className="text-gray-600 text-xs mt-4">
          © {new Date().getFullYear()} Jones County Cross Country · jonescountyhounds.com
        </p>
      </footer>

    </div>
  )
}
