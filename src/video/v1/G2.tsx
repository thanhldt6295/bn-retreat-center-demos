import { PublicShell } from '../../components/guest/Guest'
import { group, organizer } from '../../data/demo'
import { asset } from '../../lib/asset'
import type { SceneProps } from '../../player/Player'
import './g2.css'

const ROWS: [string, string][] = [
  ['Organization', group.org],
  ['Number of guests', String(group.guests)],
  ['Rooms requested', '22 · 12 single bed, 10 double bed'],
  ['Group type', group.type],
  ['Dates', 'Nov 12 – Nov 15, 2026 (3 nights)'],
]

/* G2 · request received (values from Figma frame 192:7702) */
export function G2({ goto }: SceneProps) {
  return (
    <PublicShell>
      <section className="g2-hero">
        <img className="g2-img" src={asset('img/venue-lake.png')} alt="" />
        <div className="g2-scrim" />
        <div className="g2-sub">
          <img src={asset('img/ic-success.svg')} width={28} height={28} alt="" />
          <span>SUBMITTED</span>
        </div>
        <h1>Request received</h1>
        <p>{group.name}</p>
      </section>
      <section className="g2-body">
        <div className="g2-card">
          <h2>Request details</h2>
          {ROWS.map(([k, v]) => (
            <div key={k} className="g2-row">
              <b>{k}</b>
              <span>{v}</span>
            </div>
          ))}
          <button className="g2-back ab" onClick={() => goto('G1')}>
            Back to form
          </button>
          <p className="g2-note">We will send your quote to {organizer.email}.</p>
        </div>
      </section>
    </PublicShell>
  )
}
