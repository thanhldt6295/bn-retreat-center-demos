import { useState, type ReactNode } from 'react'
import { MailShell } from '../../components/mail/Mail'
import { ActionButton } from '../../components/shared/ActionButton'
import { useTypedFields } from '../../components/shared/typing'
import { GUEST_TABS, PlainShell, PortalShell } from '../../components/guest/Guest'
import { card, group, money, roomTypes, venue } from '../../data/demo'
import { asset } from '../../lib/asset'
import { usePrimary, type SceneProps } from '../../player/Player'
import '../v1/g4.css'
import '../v1/email-viewer.css'
import '../v1/guest-pay.css'
import './assign.css'
import './guest-flow.css'

/* ---------- shared bits ---------- */
const NIGHTS = group.nights
const RATE = 140
const STAY = RATE * NIGHTS // $420
const TAX = STAY * 0.1 // $42
const TOTAL = STAY + TAX // $462

type Who = { first: string; last: string; email: string; phone: string; reservation: string }
const elena: Who = { first: 'Elena', last: 'Rossi', email: 'elena.rossi@horizon.example', phone: '+1 503 555 0142', reservation: '#00034' }
const priya: Who = { first: 'Priya', last: 'Nair', email: 'priya@horizon.example', phone: '+1 503 555 0188', reservation: '#00032' }

const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="g4-field">
    <span>{label}</span>
    <b>{value}</b>
  </div>
)
const Line = ({ k, v, kind }: { k: string; v: string; kind?: 'muted' | 'bold' }) => (
  <div className={`g4-line ${kind ?? ''}`}>
    <span>{k}</span>
    <span>{v}</span>
  </div>
)
const Title = ({ h, p }: { h: string; p: string }) => (
  <div>
    <h1 className="g-h1">{h}</h1>
    <p className="g-lead">{p}</p>
  </div>
)
const Inp = ({ value, ph, focus }: { value: string; ph: string; focus?: boolean }) => (
  <div className={`gp-input ${focus ? 'focus' : ''}`}>
    {value ? <span className={focus ? 'caret' : ''}>{value}</span> : <span className="ph">{ph}</span>}
  </div>
)
const Lab = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="gp-lab">
    <label>{label}</label>
    {children}
  </div>
)
const SaveNote = ({ tail }: { tail: string }) => (
  <div className="gf-save">
    <b>Group rate applied</b>
    <span>You save $20 per night with {tail}</span>
  </div>
)

/* ---------- I1 · room invitation email (Figma 267:274) ---------- */
export function I1({ goto }: SceneProps) {
  return (
    <MailShell
      meta={{
        box: { name: 'Elena Rossi', role: 'Guest', email: 'elena.rossi@horizon.example' },
        subject: 'Maya Thompson reserved a room for you',
        from: { name: 'Maya Thompson', email: 'retreats@cedarvalley.example', color: '#0b5d49' },
        date: 'Sep 26, 2026',
        snippet: 'Confirm it and pay for your own room at the group rate.',
      }}
    >
    <div className="em">
      <div className="em-subject">
        <b>Maya Thompson reserved a room for you</b>
        <span>· {venue.name} · Sep 26, 2026</span>
      </div>
      <div className="em-card gf-email">
        <div className="em-head">
          <div>
            <p className="k">ROOM INVITATION</p>
            <p className="t">{group.name}</p>
          </div>
        </div>
        <div className="gf-ebody">
          <h2>Hi Elena,</h2>
          <p className="lead">Maya Thompson reserved a room for you at the Horizon Foundation retreat. Confirm it and pay for your own room at the group rate.</p>
          <div className="gf-2">
            <Field label="Room" value="Standard Single Room" />
            <Field label="Group rate" value={`${money(RATE)} per night`} />
            <Field label="Stay" value="Nov 12 – Nov 15, 2026 · 3 nights" />
            <Field label="Total to pay" value={`${money(TOTAL)} including taxes`} />
          </div>
          <div className="gf-hold">
            <b>Your room is held until Oct 30, 2026</b>
            <span>After that date it returns to the group.</span>
          </div>
          <div className="gf-act">
            <button className="g-btn">I can’t attend</button>
            <ActionButton className="g-btn yellow" primary loadingMs={800} onDone={() => goto('I2')}>
              Confirm and pay
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
    </MailShell>
  )
}

/* ---------- I2 · your room is held (Figma 267:309) ---------- */
export function I2({ goto }: SceneProps) {
  return (
    <PortalShell active="Room" tabs={GUEST_TABS} user="Elena Rossi" initials="ER">
      <div className="g-wrap gf-narrow">
        <Title h="Your room is held for you" p="Confirm it and pay for your own room at the group rate." />
        <div className="gp-cols">
          <div className="g-card gf-stay">
            <div className="g-card-h">Your stay</div>
            <div className="gf-body">
              <div className="gf-grid">
                <Field label="Guest" value="Elena Rossi" />
                <Field label="Group" value={group.org} />
                <Field label="Room" value="Standard Single Room" />
                <Field label="Organizer" value="Maya Thompson" />
                <Field label="Dates" value="Nov 12 – Nov 15, 2026 · 3 nights" />
                <Field label="Room number" value="Assigned at check-in" />
              </div>
              <div className="gf-hold flat">
                <b>Held until Oct 30, 2026 · after that the room returns to the group</b>
              </div>
            </div>
          </div>
          <div className="g-card gf-side">
            <div className="g-card-h">Your booking</div>
            <div className="gf-body col">
              <Line k={`${money(RATE)} × ${NIGHTS} nights`} v={money(STAY)} kind="muted" />
              <Line k="Taxes (10%)" v={money(TAX)} kind="muted" />
              <Line k="Total" v={money(TOTAL)} kind="bold" />
              <SaveNote tail="the group" />
              <ActionButton className="g-btn yellow block" primary loadingMs={800} onDone={() => goto('I3')}>
                Confirm and pay {money(TOTAL)}
              </ActionButton>
              <button className="g-btn block">I can’t attend</button>
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  )
}

/* ---------- I3 / B3 · details and payment (Figma 281:626, 237:442) ---------- */
function Pay({ who, room, tail, next }: { who: Who; room: string; tail: string; next: () => void }) {
  const texts = [who.first, who.last, who.email, who.phone, `${who.first} ${who.last}`, card.number, card.expiry, card.cvc]
  const { values: v, done } = useTypedFields(texts, { speed: 38, startDelay: 700, gap: 180 })
  const cur = done ? -1 : v.findIndex((x, i) => x.length < texts[i].length)
  return (
    <PlainShell>
      <div className="g-wrap gf-narrow">
        <Title h="Your details and payment" p="Pay for your own room. Your booking is counted in the Horizon Foundation block." />
        <div className="gp-cols">
          <div className="gp-forms" style={{ width: 696 }}>
            <div className="g-card">
              <div className="g-card-h">Guest details</div>
              <div className="gp-sbody" style={{ gap: 16 }}>
                <div className="gp-two">
                  <Lab label="First name">
                    <Inp value={v[0]} ph="First name" focus={cur === 0} />
                  </Lab>
                  <Lab label="Last name">
                    <Inp value={v[1]} ph="Last name" focus={cur === 1} />
                  </Lab>
                </div>
                <div className="gp-two">
                  <Lab label="Email">
                    <Inp value={v[2]} ph="you@example.com" focus={cur === 2} />
                  </Lab>
                  <Lab label="Phone">
                    <Inp value={v[3]} ph="Phone number" focus={cur === 3} />
                  </Lab>
                </div>
              </div>
            </div>
            <div className="g-card">
              <div className="g-card-h">Payment method</div>
              <div className="gp-sbody" style={{ gap: 16 }}>
                <Lab label="Card holder">
                  <Inp value={v[4]} ph="Name on card" focus={cur === 4} />
                </Lab>
                <Lab label="Card number">
                  <Inp value={v[5]} ph="1234 1234 1234 1234" focus={cur === 5} />
                </Lab>
                <div className="gp-two">
                  <Lab label="Expiry">
                    <Inp value={v[6]} ph="MM / YY" focus={cur === 6} />
                  </Lab>
                  <Lab label="CVC">
                    <Inp value={v[7]} ph="CVC" focus={cur === 7} />
                  </Lab>
                </div>
                <p className="gp-note">Your card is stored securely with the payment gateway. We never keep the card number.</p>
              </div>
            </div>
          </div>
          <div className="g-card gp-side" style={{ width: 380 }}>
            <div className="g-card-h">Summary</div>
            <div className="gp-summary">
              <Line k="Check-in" v={group.start} />
              <Line k="Check-out" v={group.end} />
              <b className="gp-h">Accommodation</b>
              <Line k={`${room} × ${NIGHTS} nights`} v={money(STAY)} kind="muted" />
              <Line k="Taxes (10%)" v={money(TAX)} kind="muted" />
              <Line k="Total" v={money(TOTAL)} kind="bold" />
              <SaveNote tail={tail} />
              <ActionButton className="g-btn yellow block" primary loadingMs={1400} onDone={next}>
                Pay {money(TOTAL)}
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
    </PlainShell>
  )
}
export const I3 = ({ goto }: SceneProps) => <Pay who={elena} room="Standard Single Room" tail="the group" next={() => goto('I4')} />
export const B3 = ({ goto }: SceneProps) => <Pay who={priya} room="Standard Double Room" tail={`code ${group.code}`} next={() => goto('B4')} />

/* ---------- I4 / B4 · booking confirmed (Figma 281:727, 237:543) ---------- */
function Booked({ who, room, next }: { who: Who; room: string; next: () => void }) {
  const steps = [
    'Your room is counted in the Horizon Foundation block.',
    'The venue assigns your room number before you arrive.',
    'Check in on Thu, Nov 12 from 3:00 PM.',
  ]
  return (
    <PlainShell>
      <div className="g-wrap gf-narrow">
        <div className="gp-hero">
          <img src={asset('img/ic-success-lg.svg')} width={56} height={56} alt="" className="g7-check" />
          <h1 className="g-h1">Your room is booked</h1>
          <p className="g-lead" style={{ margin: 0 }}>
            Reservation {who.reservation} · A receipt was sent to {who.email}
          </p>
        </div>
        <div className="gp-cols">
          <div className="g-card gf-stay" style={{ flex: 1 }}>
            <div className="g-card-h">Stay details</div>
            <div className="gf-body">
              <div className="gf-grid">
                <Field label="Guest" value={`${who.first} ${who.last}`} />
                <Field label="Paid" value={money(TOTAL)} />
                <Field label="Room" value={room} />
                <Field label="Group" value={group.org} />
                <Field label="Dates" value="Nov 12 – Nov 15, 2026 · 3 nights" />
                <Field label="Room number" value="Assigned at check-in" />
              </div>
            </div>
          </div>
          <div className="g-card gf-next">
            <div className="g-card-h">What happens next</div>
            <div className="gp-steps">
              {steps.map((t, i) => (
                <div key={t} className="gp-step">
                  <span>{i + 1}</span>
                  <p>{t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="gp-actions">
          <button className="g-btn">View my booking</button>
          <ActionButton className="g-btn yellow" primary loadingMs={600} onDone={next}>
            Add to calendar
          </ActionButton>
        </div>
      </div>
    </PlainShell>
  )
}
export const I4 = ({ next }: SceneProps) => <Booked who={elena} room="Standard Single Room" next={next} />
export const B4 = ({ next }: SceneProps) => <Booked who={priya} room="Standard Double Room" next={next} />

/* ---------- B1 · enter group code (Figma 237:272) ---------- */
export function B1({ goto }: SceneProps) {
  const { value, done } = useTypedFieldsOne(group.code)
  const [applied, setApplied] = useState(false)
  return (
    <PlainShell>
      <div className="g-wrap gf-narrow">
        <Title h="Book your room" p="Enter the group code from your organizer to see your group rate." />
        <div className="g-card" style={{ width: 560 }}>
          <div className="g-card-h">Group code</div>
          <div className="gp-sbody">
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <Lab label="Group code">
                  <Inp value={value} ph="Enter code" focus={!done} />
                </Lab>
              </div>
              <ActionButton className="g-btn" primary={done && !applied} loadingMs={900} disabled={!done} onDone={() => setApplied(true)}>
                Apply code
              </ActionButton>
            </div>
            {applied && (
              <div className="gf-applied">
                <div>
                  <img src={asset('img/ic-success.svg')} width={22} height={22} alt="" />
                  <b>Code applied · group rates unlocked</b>
                </div>
                <b className="n">{group.name}</b>
                <span>
                  Nov 12 – Nov 15, 2026 · 3 nights · {venue.name}
                </span>
              </div>
            )}
            {applied && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <ActionButton className="g-btn yellow" primary loadingMs={700} onDone={() => goto('B2')}>
                  Continue
                </ActionButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </PlainShell>
  )
}
function useTypedFieldsOne(t: string) {
  const { values, done } = useTypedFields([t], { speed: 90, startDelay: 700 })
  return { value: values[0], done }
}

/* ---------- B2 · choose your room (Figma 237:324) ---------- */
const left0 = { single: 9, double: 4, cabin: 3 }
export function B2({ goto }: SceneProps) {
  const [sel, setSel] = useState<'single' | 'double' | 'cabin' | null>(null)
  const room = sel ? roomTypes.find((r) => r.key === sel)! : null
  const types: { key: 'single' | 'double' | 'cabin'; name: string; sub: string; list: number; rate: number }[] = [
    { key: 'single', name: 'Standard Single Room', sub: '1 single bed · up to 1 guest', list: 160, rate: 140 },
    { key: 'double', name: 'Standard Double Room', sub: '1 double bed · up to 2 guests', list: 160, rate: 140 },
    { key: 'cabin', name: 'Cabin', sub: 'Cabin with a double bed · up to 4 guests', list: 210, rate: 190 },
  ]
  const stay = room ? room.rate * NIGHTS : 0
  return (
    <PlainShell>
      <div className="g-wrap gf-narrow">
        <Title h="Choose your room" p="Your group rate applies to every room in the Horizon Foundation block." />
        <div className="gp-cols">
          <div style={{ width: 700, flex: 'none', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="g-card gf-3">
              <Field label="Check-in" value="Thu, Nov 12, 2026" />
              <Field label="Check-out" value="Sun, Nov 15, 2026" />
              <Field label="Guests" value="1 guest" />
            </div>
            {types.map((t) => {
              const on = sel === t.key
              return (
                <div key={t.key} className={`g-card gf-room ${on ? 'on' : ''}`} onClick={() => setSel(t.key)}>
                  <img src={asset('img/venue-lake.png')} alt="" />
                  <div className="tx">
                    <b>{t.name}</b>
                    <span>{t.sub}</span>
                    <div>
                      <span className="g-pill">Group rate</span>
                      <span className="g-pill cream">
                        {left0[t.key]} left in your block
                      </span>
                    </div>
                  </div>
                  <div className="pr">
                    <div>
                      <s>{money(t.list, 0)}</s>
                      <strong>{money(t.rate, 0)}</strong>
                      <em>/ night</em>
                    </div>
                    <button className={`g-btn small ${on ? 'yellow' : ''}`}>{on ? 'Selected' : 'Select room'}</button>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="g-card gf-bk">
            <div className="g-card-h">Your booking</div>
            <div className="gf-body col">
              {room ? (
                <>
                  <Field label="Group" value={group.name} />
                  <Field label="Room" value={room.name} />
                  <Line k={`${money(room.rate)} × ${NIGHTS} nights`} v={money(stay)} kind="muted" />
                  <Line k="Taxes (10%)" v={money(stay * 0.1)} kind="muted" />
                  <Line k="Total" v={money(stay * 1.1)} kind="bold" />
                </>
              ) : (
                <p className="gp-note" style={{ fontSize: 13 }}>
                  Select a room to see your price.
                </p>
              )}
              <ActionButton className="g-btn yellow block" primary={!!room} disabled={!room} loadingMs={800} onDone={() => goto('B3')}>
                Continue to payment
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
      {!sel && <AutoPick onPick={() => setSel('double')} />}
    </PlainShell>
  )
}
/** → on "nothing selected" picks the Standard Double Room (the video's choice). */
function AutoPick({ onPick }: { onPick: () => void }) {
  usePrimary(onPick)
  return null
}
