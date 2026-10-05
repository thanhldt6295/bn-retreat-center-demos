import { ActionButton } from '../../components/shared/ActionButton'
import { useTypedFields } from '../../components/shared/typing'
import { PublicShell } from '../../components/guest/Guest'
import { group, organizer } from '../../data/demo'
import { asset } from '../../lib/asset'
import type { SceneProps } from '../../player/Player'
import './g1.css'

const OCCASIONS = [
  ['Leadership & Team Retreats', 'Meeting space, rooms and group meals in one stay.', 'occ-leadership.png'],
  ['Wellness & Yoga Retreats', 'Quiet stays with space for classes and sessions.', 'occ-wellness.png'],
  ['Spiritual & Faith Retreats', 'Group lodging for your community.', 'occ-faith.png'],
  ['Education Programs', 'Cohorts, workshops and lodging.', 'occ-education.png'],
]

const BENEFITS = [
  ['Group rates', 'A special rate for your whole group, locked in with your quote.', 'ic-diamond.svg'],
  ['Dedicated support', 'Our team helps from your first request to arrival.', 'ic-headset.svg'],
  ['One simple quote', 'Rooms, meeting space and meals together in one place.', 'ic-file-text.svg'],
  ['Easy for your guests', 'Each guest books their own room from your group link.', 'ic-check-circle.svg'],
]

const HIGHLIGHTS = [
  ['ic-tag.svg', ['Rooms, meals &', 'meeting space']],
  ['ic-clock.svg', ['Quick', 'response']],
  ['ic-user.svg', ['Planning help', 'from our team']],
] as const

type FieldProps = { label: string; req?: boolean; value: string; active: boolean; icon?: string; area?: boolean }
function Field({ label, req, value, active, icon, area }: FieldProps) {
  return (
    <div className="g1f">
      <label>
        {label}
        {req && <span className="req"> *</span>}
      </label>
      <div className={`g1f-input ${area ? 'area' : ''} ${active ? 'focus' : ''}`}>
        <span className={`g1f-val ${active ? 'caret' : ''}`}>{value}</span>
        {icon && <img src={asset(`img/${icon}`)} width={12} height={12} alt="" />}
      </div>
    </div>
  )
}

/* G1 · public request form (typed on entry, Submit Request → G2) */
export function G1({ next }: SceneProps) {
  const texts = [
    group.name,
    group.start,
    group.end,
    group.type,
    '22 · 12 single, 10 double',
    group.budget,
    group.org,
    String(group.guests),
    organizer.first,
    organizer.last,
    organizer.email,
    group.special,
  ]
  const { values: v, done } = useTypedFields(texts, { speed: 22, startDelay: 700 })
  const cur = v.findIndex((x, i) => x.length < texts[i].length)
  const a = (i: number) => !done && cur === i

  return (
    <PublicShell>
      <section className="g1-hero">
        <img className="g1-hero-img" src={asset('img/venue-hero.png')} alt="" />
        <div className="g1-soft" />
        <div className="g1-copy">
          <p className="g1-eyebrow">CEDAR VALLEY RETREAT &amp; CONFERENCE CENTER</p>
          <h1 className="g1-h1">
            Plan your next
            <br />
            group retreat
          </h1>
          <p className="g1-lead">One quote for rooms, meeting space and group meals.</p>
          <div className="g1-highlights">
            {HIGHLIGHTS.map(([ic, lines]) => (
              <div key={ic} className="g1-hl">
                <img src={asset(`img/${ic}`)} width={32} height={32} alt="" />
                <div>
                  {lines[0]}
                  <br />
                  {lines[1]}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="g1-note">
          Great retreats
          <br />
          bring people together.
        </div>
        <form className="g1-form" onSubmit={(e) => e.preventDefault()}>
          <h2>Request a Group Quote</h2>
          <Field label="Retreat / Group Name" value={v[0]} active={a(0)} />
          <div className="g1-row">
            <Field label="Start Date" req value={v[1]} active={a(1)} icon="ic-calendar.svg" />
            <Field label="End Date" req value={v[2]} active={a(2)} icon="ic-calendar.svg" />
          </div>
          <Field label="Group Type" req value={v[3]} active={a(3)} icon="ic-chevron-down.svg" />
          <div className="g1-row">
            <Field label="Rooms Qty" req value={v[4]} active={a(4)} />
            <Field label="Ideal nightly budget" value={v[5]} active={a(5)} />
          </div>
          <div className="g1-row">
            <Field label="Organization" value={v[6]} active={a(6)} />
            <Field label="Number of guests" value={v[7]} active={a(7)} />
          </div>
          <div className="g1-row">
            <Field label="First Name" req value={v[8]} active={a(8)} />
            <Field label="Last Name" req value={v[9]} active={a(9)} />
          </div>
          <Field label="Where should we send quotes?" req value={v[10]} active={a(10)} />
          <Field label="Any additional requests?" value={v[11]} active={a(11)} area />
          <ActionButton className="g1-submit" primary loadingMs={1000} onDone={next}>
            Submit Request
          </ActionButton>
        </form>
      </section>

      <section className="g1-occ">
        <div>
          <p className="g1-eyebrow">BUILT FOR EVERY KIND OF RETREAT</p>
          <p className="g1-h2">Group rates for any kind of retreat</p>
        </div>
        <div className="g1-cards">
          {OCCASIONS.map(([t, d, img]) => (
            <div key={t} className="g1-card">
              <img src={asset(`img/${img}`)} alt="" />
              <div className="g1-card-b">
                <b>{t}</b>
                <span>{d}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="g1-benefits">
        {BENEFITS.map(([t, d, ic]) => (
          <div key={t} className="g1-benefit">
            <img src={asset(`img/${ic}`)} width={40} height={40} alt="" />
            <div>
              <b>{t}</b>
              <span>{d}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="g1-testi">
        <img src={asset('img/ballroom.png')} alt="" />
        <div className="g1-quote">
          <p className="mark">“</p>
          <p className="q">“Our leadership retreat came together in one quote, and our guests booked their own rooms in minutes.”</p>
          <p className="by">— Retreat organizer (illustrative)</p>
          <img src={asset('img/pagination.svg')} width={72} height={17} alt="" />
        </div>
      </section>
    </PublicShell>
  )
}
