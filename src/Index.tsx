import { Link } from 'react-router-dom'
import './index-page.css'

const videos = [
  { to: '/v1', n: 'V1', title: 'Group Block Request → Confirmed Group Booking', len: '~2:55', ready: true },
  { to: '/v2', n: 'V2', title: 'Group Rooms → Individual Guest Reservations', len: '~2:45', ready: false },
  { to: '/v3', n: 'V3', title: 'Organizer & Guest Portal', len: '', ready: false },
  { to: '/v4', n: 'V4', title: 'POS → Connected Guest / Reservation Record', len: '', ready: false },
]

export default function Index() {
  return (
    <main className="idx">
      <h1>Retreat Center · video prototypes</h1>
      <p className="idx-sub">
        Clickable prototypes for the Booking Ninjas Retreat Center videos. Demo data only. Keys: <kbd>→</kbd> next step,{' '}
        <kbd>←</kbd> previous, <kbd>R</kbd> reset scene, <kbd>H</kbd> hide the helper overlay.
      </p>
      <div className="idx-list">
        {videos.map((v) => (
          <Link key={v.to} to={v.to} className={`idx-item ${v.ready ? '' : 'soon'}`}>
            <span className="idx-n">{v.n}</span>
            <span className="idx-t">
              {v.title}
              {v.len && <small> · {v.len}</small>}
            </span>
            <span className="idx-s">{v.ready ? 'Open' : 'Coming next'}</span>
          </Link>
        ))}
      </div>
    </main>
  )
}
