import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ActionButton } from '../../components/shared/ActionButton'
import { useTypedFields } from '../../components/shared/typing'
import { GCheck, PortalShell, Track } from '../../components/guest/Guest'
import { card, group, money, organizer, quote, timeline } from '../../data/demo'
import { asset } from '../../lib/asset'
import { usePlayer, type SceneProps } from '../../player/Player'
import './g4.css'
import './guest-pay.css'

const Input = ({ value, focus }: { value: string; focus?: boolean }) => (
  <div className={`gp-input ${focus ? 'focus' : ''}`}>
    <span className={focus ? 'caret' : ''}>{value}</span>
  </div>
)
const Labeled = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="gp-lab">
    <label>{label}</label>
    {children}
  </div>
)
const Line = ({ k, v, kind }: { k: string; v: string; kind?: 'muted' | 'bold' }) => (
  <div className={`g4-line ${kind ?? ''}`}>
    <span>{k}</span>
    <span>{v}</span>
  </div>
)
const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="g4-field">
    <span>{label}</span>
    <b>{value}</b>
  </div>
)

/* ---------------- G5 sign electronically (Figma 192:7946) ---------------- */
export function G5({ next }: SceneProps) {
  const { values, done } = useTypedFields([organizer.name], { speed: 55, startDelay: 700 })
  const sections = [
    ['1. Event', `${group.name}, Nov 12 – Nov 15, 2026, with 22 rooms, the Meeting Hall for 3 days and group catering for ${group.guests} guests.`],
    ['2. Payment', `50% deposit (${money(quote.deposit)}) is due when the contract is signed. The remaining 50% (${money(quote.balance)}) is due seven days before arrival (${timeline.balanceDue}).`],
    ['3. Changes and cancellation', 'Room counts can be adjusted until Oct 30, 2026. Cancellations after that date are charged according to the venue policy.'],
    ['4. Billing', 'All rooms and add-ons are billed to the organizer on one invoice. Guests who prefer to pay separately may book with the group code.'],
  ]
  return (
    <PortalShell active="Documents">
      <div className="g-wrap">
        <div>
          <h1 className="g-h1">Sign your contract</h1>
          <p className="g-lead">Read the contract, then add your signature to confirm the group booking.</p>
        </div>
        <Track steps={['Review', 'Sign', 'Pay deposit']} current={2} />
        <div className="gp-cols">
          <div className="g-card gp-contract">
            <div className="g-card-h">Contract · {group.code}</div>
            <div className="gp-clauses">
              {sections.map(([h, t]) => (
                <div key={h} className="gp-clause">
                  <b>{h}</b>
                  <p>{t}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="g-card gp-side">
            <div className="g-card-h">Sign here</div>
            <div className="gp-sbody">
              <div style={{ display: 'flex', gap: 8 }}>
                <span className="g-btn small yellow">Type</span>
                <span className="g-btn small">Draw</span>
              </div>
              <Labeled label="Full name">
                <Input value={values[0]} focus={!done} />
              </Labeled>
              <div className="gp-sig">
                <p>{values[0]}</p>
                <i />
                <span>Signed electronically · {timeline.organizerSigned}</span>
              </div>
              <label className="gp-agree">
                <GCheck on={done} />I agree to the terms and to sign electronically.
              </label>
              <ActionButton className="g-btn yellow block" primary loadingMs={1000} onDone={next}>
                Sign and continue
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  )
}

/* ---------------- G6 payment (Figma 192:8006) ---------------- */
export function G6({ next }: SceneProps) {
  const { toast } = usePlayer()
  const texts = [organizer.name, card.number, card.expiry, card.cvc]
  const { values: v } = useTypedFields(texts, { speed: 45, startDelay: 700, gap: 220 })
  const cur = v.findIndex((x, i) => x.length < texts[i].length)
  return (
    <PortalShell active="Invoices">
      <div className="g-wrap">
        <div>
          <h1 className="g-h1">Pay your deposit</h1>
          <p className="g-lead">Your contract is signed. Pay the 50% deposit to confirm the group booking.</p>
        </div>
        <Track steps={['Review', 'Sign', 'Pay deposit']} current={3} />
        <div className="gp-cols">
          <div className="gp-forms">
            <div className="g-card">
              <div className="g-card-h">Billing Details</div>
              <div className="gp-sbody">
                <div className="gp-two">
                  <Labeled label="First Name">
                    <Input value={organizer.first} />
                  </Labeled>
                  <Labeled label="Last Name">
                    <Input value={organizer.last} />
                  </Labeled>
                </div>
                <Labeled label="Email">
                  <Input value={organizer.email} />
                </Labeled>
              </div>
            </div>
            <div className="g-card">
              <div className="g-card-h">Payment Method</div>
              <div className="gp-sbody">
                <Labeled label="Card Holder">
                  <Input value={v[0]} focus={cur === 0} />
                </Labeled>
                <Labeled label="Card number">
                  <Input value={v[1]} focus={cur === 1} />
                </Labeled>
                <div className="gp-two">
                  <Labeled label="Expiry">
                    <Input value={v[2]} focus={cur === 2} />
                  </Labeled>
                  <Labeled label="CVC">
                    <Input value={v[3]} focus={cur === 3} />
                  </Labeled>
                </div>
                <p className="gp-note">Your card is stored securely with the payment gateway. We never keep the card number.</p>
              </div>
            </div>
          </div>
          <div className="g-card gp-side">
            <div className="g-card-h">Summary</div>
            <div className="gp-summary">
              <Line k="Start Date" v={group.start} />
              <Line k="End Date" v={group.end} />
              <b className="gp-h">Accommodations</b>
              {quote.roomLines.map((l) => (
                <Line key={l.key} k={`${l.name} × ${l.qty}`} v={money(l.total)} kind="muted" />
              ))}
              <b className="gp-h">Add-ons</b>
              <Line k={`Meeting Hall × ${quote.meeting.days}`} v={money(quote.meeting.total)} kind="muted" />
              <Line k={`Group Catering × ${quote.catering.qty}`} v={money(quote.catering.total)} kind="muted" />
              <Line k="Subtotal" v={money(quote.subtotal)} />
              <Line k="Taxes" v={money(quote.tax)} />
              <Line k="Total" v={money(quote.total)} kind="bold" />
              <div className="gp-due">
                <span>Due today · 50% deposit</span>
                <b>{money(quote.deposit)}</b>
                <span>
                  Balance {money(quote.balance)} due {timeline.balanceDue}
                </span>
              </div>
              <ActionButton
                className="g-btn yellow block"
                primary
                loadingMs={1400}
                onDone={() => {
                  next()
                  toast(`Payment received · ${money(quote.deposit)}`, 'guest')
                }}
              >
                Pay {money(quote.deposit)}
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  )
}

/* ---------------- G7 booking confirmed (Figma 192:8109) ---------------- */
export function G7(_: SceneProps) {
  const nav = useNavigate()
  const steps = [
    'The venue team approves your reservation.',
    'Assign guests to your rooms, or share the group code so guests can book and pay for themselves.',
    'You will receive your final invoice and arrival details before Nov 12.',
  ]
  return (
    <PortalShell active="Overview">
      <div className="g-wrap">
        <div className="gp-hero">
          <img src={asset('img/ic-success-lg.svg')} width={56} height={56} alt="" className="g7-check" />
          <h1 className="g-h1">Your group booking is confirmed</h1>
          <p className="g-lead" style={{ margin: 0 }}>
            Confirmation {group.code} · A receipt was sent to {organizer.email}
          </p>
        </div>
        <div className="gp-cols">
          <div className="g-card" style={{ flex: 1 }}>
            <div className="g-card-h">Booking details</div>
            <div className="gp-grid">
              <div>
                <Field label="Group" value={group.name} />
                <Field label="Dates" value="Nov 12 – Nov 15, 2026 · 3 nights" />
                <Field label="Rooms" value="22 rooms · Meeting Hall · Group catering" />
              </div>
              <div>
                <Field label="Paid today" value={`${money(quote.deposit)} (deposit)`} />
                <Field label="Balance" value={`${money(quote.balance)} due ${timeline.balanceDue}`} />
                <Field label="Group code" value={group.code} />
              </div>
            </div>
          </div>
          <div className="g-card gp-next">
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
          <button className="g-btn">View booking</button>
          <button className="g-btn">Add to calendar</button>
          <button className="g-btn yellow ab" onClick={() => nav('/v2')}>
            Assign rooms
          </button>
        </div>
      </div>
    </PortalShell>
  )
}
