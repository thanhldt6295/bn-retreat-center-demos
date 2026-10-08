import { ActionButton } from '../../components/shared/ActionButton'
import { useTypedFields } from '../../components/shared/typing'
import { useEffect, useState } from 'react'
import { DatePicker } from '../../components/shared/DatePicker'
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

type Ctl = { open: boolean; hover?: number }
type FieldProps = { ctl?: Ctl; ph?: string; label: string; req?: boolean; value: string; active: boolean; icon?: string; area?: boolean; onPick?: (v: string) => void; min?: string }
function Field({ ctl, ph, label, req, value, active, icon, area, onPick, min }: FieldProps) {
  return (
    <div className="g1f">
      <label>
        {label}
        {req && <span className="req"> *</span>}
      </label>
      {onPick ? (
        <DatePicker value={value} onChange={onPick} min={min} forceOpen={ctl?.open} hoverDay={ctl?.hover}>
          {(open) => (
            <div className={`g1f-input ${open || active ? 'focus' : ''}`}>
              <span className={`g1f-val ${active ? 'caret' : ''} ${!value && !active ? 'ph' : ''}`}>{value || (active ? '' : ph)}</span>
              {icon && <img src={asset(`img/${icon}`)} width={12} height={12} alt="" />}
            </div>
          )}
        </DatePicker>
      ) : (
        <div className={`g1f-input ${area ? 'area' : ''} ${active ? 'focus' : ''}`}>
          <span className={`g1f-val ${active ? 'caret' : ''} ${!value && !active ? 'ph' : ''}`}>{value || (active ? '' : ph)}</span>
          {icon && <img src={asset(`img/${icon}`)} width={12} height={12} alt="" />}
        </div>
      )}
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
  /* name is typed first, then the date pickers open and a day is picked like a real user, then the rest is typed */
  const head = useTypedFields([texts[0]], { speed: 22, startDelay: 700 })
  const [dates, setDates] = useState<{ phase: number; hover?: number; start: string; end: string }>({ phase: 0, start: '', end: '' })
  useEffect(() => {
    if (!head.done) return
    const timers: number[] = []
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms))
    at(300, () => setDates((d) => ({ ...d, phase: 1 })))
    at(1000, () => setDates((d) => ({ ...d, hover: 9 })))
    at(1500, () => setDates((d) => ({ ...d, hover: 12 })))
    at(2100, () => setDates((d) => ({ ...d, phase: 2, hover: undefined, start: group.start })))
    at(2700, () => setDates((d) => ({ ...d, phase: 3 })))
    at(3400, () => setDates((d) => ({ ...d, hover: 13 })))
    at(3900, () => setDates((d) => ({ ...d, hover: 15 })))
    at(4500, () => setDates((d) => ({ ...d, phase: 4, hover: undefined, end: group.end })))
    return () => timers.forEach(window.clearTimeout)
  }, [head.done])
  const rest = useTypedFields(texts.slice(3), { run: dates.phase === 4, speed: 22, startDelay: 500 })
  const v = [head.values[0], dates.start, dates.end, ...rest.values]
  const done = rest.done
  const restCur = rest.values.findIndex((x, i) => x.length < texts[i + 3].length)
  const a = (i: number) => {
    if (i === 0) return !head.done && head.values[0].length < texts[0].length
    if (i === 1 || i === 2) return false
    return dates.phase === 4 && !done && restCur === i - 3
  }
  const ctl = (i: 1 | 2): Ctl | undefined => {
    if (dates.phase === 4) return undefined
    const mine = i === 1 ? dates.phase === 1 : dates.phase === 3
    return { open: mine, hover: mine ? dates.hover : undefined }
  }
  /* the form stays fixed on screen; on short windows it scales down to fit instead of scrolling away */
  useEffect(() => {
    const fit = () => document.documentElement.style.setProperty('--g1-scale', String(Math.min(1, (window.innerHeight - 24) / 840)))
    fit()
    window.addEventListener('resize', fit)
    return () => {
      window.removeEventListener('resize', fit)
      document.documentElement.style.removeProperty('--g1-scale')
    }
  }, [])
  const [picked, setPicked] = useState<Record<number, string>>({})
  const pick = (i: number) => (x: string) => setPicked((p) => ({ ...p, [i]: x }))

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
          <Field ph="e.g. Annual Leadership Retreat" label="Retreat / Group Name" value={v[0]} active={a(0)} />
          <div className="g1-row">
            <Field ctl={ctl(1)} ph="Select date" label="Start Date" req value={picked[1] ?? v[1]} active={a(1)} icon="ic-calendar.svg" onPick={pick(1)} />
            <Field ctl={ctl(2)} ph="Select date" label="End Date" req value={picked[2] ?? v[2]} active={a(2)} icon="ic-calendar.svg" onPick={pick(2)} min={picked[1] ?? v[1]} />
          </div>
          <Field ph="Select a group type" label="Group Type" req value={v[3]} active={a(3)} icon="ic-chevron-down.svg" />
          <div className="g1-row">
            <Field ph="e.g. 20 rooms" label="Rooms Qty" req value={v[4]} active={a(4)} />
            <Field ph="$ per room / night" label="Ideal nightly budget" value={v[5]} active={a(5)} />
          </div>
          <div className="g1-row">
            <Field ph="Organization name" label="Organization" value={v[6]} active={a(6)} />
            <Field ph="e.g. 30" label="Number of guests" value={v[7]} active={a(7)} />
          </div>
          <div className="g1-row">
            <Field ph="First name" label="First Name" req value={v[8]} active={a(8)} />
            <Field ph="Last name" label="Last Name" req value={v[9]} active={a(9)} />
          </div>
          <Field ph="name@company.com" label="Where should we send quotes?" req value={v[10]} active={a(10)} />
          <Field ph="Meeting space, meals, accessibility needs…" label="Any additional requests?" value={v[11]} active={a(11)} area />
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
