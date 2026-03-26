import { Button } from '@/components/ui/button'

const GREEN = '#16a34a'
const GOLD = '#F0C040'

export default function AthleteCard({ athlete }) {
  return (
    <article
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'transform 0.15s, box-shadow 0.15s',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'
      }}
      onFocus={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
      }}
      onBlur={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'
      }}
    >
      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: GREEN, marginBottom: '4px', fontFamily: 'Georgia, serif' }}>
        {athlete.name}
      </div>
      <div style={{ fontSize: '0.8rem', color: '#4b5563', marginBottom: '16px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Grade {athlete.grade} · {athlete.events}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280' }}>PR</span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke={GOLD}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-label="Personal record time"
          role="img"
        >
          <title>Personal record time</title>
          <circle cx="12" cy="13" r="8" />
          <path d="M12 9v4l2.5 2.5" />
          <path d="M9.5 2.5h5" />
          <path d="M12 2.5V5" />
        </svg>
        <span style={{ fontSize: '1.5rem', fontWeight: 900, color: GOLD, fontFamily: 'Georgia, serif', textShadow: '0 1px 2px rgba(0,0,0,0.08)' }}>
          {athlete.prTime}
        </span>
      </div>
      <div style={{ marginTop: '20px' }}>
        <Button type="button" variant="outline" size="sm" className="w-full">View Details</Button>
      </div>
    </article>
  )
}
