import { useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

const TITLES: Record<number, string> = {
  2: 'Group Rooms → Individual Guest Reservations',
  3: 'Organizer & Guest Portal',
  4: 'POS → Connected Guest / Reservation Record',
}

/** Placeholder for a video that is not built yet. Arrow keys keep the flow going: → next video, ← previous video. */
export default function Soon({ n }: { n: number }) {
  const nav = useNavigate()
  const [params] = useSearchParams()
  const rec = params.get('rec') === '1' ? '?rec=1' : ''
  const next = n < 4 ? `/v${n + 1}` : '/'
  const prev = `/v${n - 1}`

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nav(next + rec)
      if (e.key === 'ArrowLeft') nav(prev + rec)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [nav, next, prev, rec])

  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '96px 24px', fontFamily: 'Inter, sans-serif' }}>
      <h1>V{n} · coming next</h1>
      <p style={{ color: '#5e625d' }}>{TITLES[n]} is not built yet.</p>
      <p style={{ display: 'flex', gap: 16 }}>
        <Link to={prev + rec}>← Previous video</Link>
        <Link to={next + rec}>{n < 4 ? 'Next video →' : 'Index →'}</Link>
        <Link to="/">Index</Link>
      </p>
    </main>
  )
}
