import './App.css'

const navItems = [
  { label: 'HIGH SCHOOL', icon: '🏫', dropdown: true },
  { label: 'RUNNERS', icon: '👤', dropdown: false },
  { label: 'TOP HOUNDS', icon: '🏆', dropdown: true },
  { label: 'HEALTH', icon: '❤️', dropdown: false },
  { label: 'HOME MEET', icon: '🏃', dropdown: false },
  { label: 'PRACTICE', icon: '📋', dropdown: false },
  { label: 'RACE', icon: '🏁', dropdown: false },
  { label: 'MIDDLE SCHOOL', icon: '🍎', dropdown: true },
]

function GreyhoundLogo() {
  return (
    <svg viewBox="0 0 100 80" className="w-24 h-20" xmlns="http://www.w3.org/2000/svg">
      <text x="5" y="62" fontSize="58" fontWeight="900" fill="#5C2D8F" fontFamily="Georgia, serif">JC</text>
      <text x="5" y="62" fontSize="58" fontWeight="900" fill="none" stroke="#F0C040" strokeWidth="1.5" fontFamily="Georgia, serif">JC</text>
    </svg>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-white">

      {/* Top bar – SportsYou code */}
      <div className="bg-[#3B1A69] text-white text-center py-1.5 text-sm tracking-wide">
        SportsYou Code:{' '}
        <span className="bg-[#F0C040] text-[#3B1A69] font-bold px-2 py-0.5 rounded ml-1">
          2RPP–VGP8
        </span>
      </div>

      {/* Announcement banner */}
      <div className="bg-[#F0C040] text-[#3B1A69] text-center py-2 font-extrabold text-sm tracking-wide">
        BE HYDRATED! BE READY TO RUN! BE ON TIME! – 2022, 2023, 2024, 2025 REGION CHAMPIONS
      </div>

      {/* Header */}
      <header className="flex justify-center items-center gap-5 py-8">
        <GreyhoundLogo />
        <div className="leading-tight">
          <div className="text-[#5C2D8F] font-black text-5xl tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
            JONES COUNTY
          </div>
          <div className="text-[#5C2D8F] font-bold text-3xl italic" style={{ fontFamily: 'Georgia, serif' }}>
            Cross Country
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-t border-b border-gray-200">
        <ul className="flex flex-wrap justify-center gap-1 py-2 px-4">
          {navItems.map((item) => (
            <li key={item.label}>
              <button className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-gray-700 hover:text-[#5C2D8F] hover:bg-gray-50 rounded transition-colors cursor-pointer">
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {item.dropdown && <span className="text-gray-400 ml-0.5">▾</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Hero section */}
      <section
        className="py-20 text-center"
        style={{ background: 'linear-gradient(135deg, #3B1A69 0%, #7B3FA8 100%)' }}
      >
        <h1 className="text-white text-5xl font-black mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          Jones County Cross Country
        </h1>
        <p className="text-[#F0C040] text-xl font-semibold">
          Building champions on and off the track
        </p>
        <p className="text-white text-sm mt-3 opacity-75">
          2022 · 2023 · 2024 · 2025 Region Champions
        </p>
      </section>

    </div>
  )
}

export default App
