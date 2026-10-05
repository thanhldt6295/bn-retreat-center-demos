import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ActionButton } from '../../components/shared/ActionButton'
import { useTypedFields } from '../../components/shared/typing'
import { BeoDoc, ContractDoc } from '../../components/shared/Docs'
import { GCheck, GInput, PortalShell, Track } from '../../components/guest/Guest'
import { card, group, money, organizer, quote, timeline, venue } from '../../data/demo'
import { usePlayer, type SceneProps } from '../../player/Player'

/* ---------------- G3 quote email ---------------- */
export function G3({ next }: SceneProps) {
  return (
    <div className="g" style={{ background: '#f4f0e8', alignItems: 'center', padding: '28px 0 80px' }}>
      <div style={{ width: 640, fontSize: 12, color: '#777', marginBottom: 12 }}>
        <b style={{ color: '#0f4a38', fontSize: 13 }}>Group Rate Quote · your private link inside</b> · from {venue.name} · {timeline.quote}
      </div>
      <div className="g-card" style={{ width: 640, borderRadius: 28, overflow: 'hidden' }}>
        <div style={{ background: '#1f2a26', color: '#fff', padding: '26px 32px 22px', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>GROUP BOOKING QUOTE</div>
            <div style={{ fontSize: 22, fontWeight: 700, maxWidth: 380, marginTop: 6, lineHeight: 1.2 }}>{group.name}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, opacity: 0.8 }}>UNIQUE ID</div>
            <div style={{ fontSize: 34, fontWeight: 800 }}>{group.code}</div>
          </div>
        </div>
        <div style={{ padding: '18px 32px 30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <div>
              <small style={{ color: '#777' }}>TO</small>
              <div style={{ fontWeight: 700, fontSize: 15, marginTop: 4 }}>{organizer.name}</div>
              <div style={{ color: '#555' }}>{organizer.email}</div>
            </div>
            <div style={{ width: 275 }}>
              <small style={{ color: '#777' }}>FROM</small>
              <div style={{ fontWeight: 700, fontSize: 15, marginTop: 4 }}>{venue.name}</div>
              <div style={{ color: '#555' }}>{venue.email}</div>
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 26, fontSize: 13 }}>
            <thead>
              <tr style={{ color: '#666', textAlign: 'right' }}>
                <th style={{ textAlign: 'left', padding: '8px 0', fontWeight: 500 }}>Description</th>
                <th style={{ fontWeight: 500 }}>Qty</th>
                <th style={{ fontWeight: 500 }}>Nights</th>
                <th style={{ fontWeight: 500 }}>Price</th>
                <th style={{ fontWeight: 500 }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {[
                ...quote.roomLines.map((l) => [l.name, l.qty, 3, l.rate, l.total] as const),
                ['Meeting Hall (per day)', quote.meeting.days, '—', quote.meeting.rate, quote.meeting.total] as const,
                ['Group Catering (per guest-day)', quote.catering.qty, '—', quote.catering.rate, quote.catering.total] as const,
              ].map((r) => (
                <tr key={r[0]} style={{ borderTop: '1px solid #e5e5e5', textAlign: 'right' }}>
                  <td style={{ textAlign: 'left', height: 35 }}>{r[0]}</td>
                  <td>{r[1]}</td>
                  <td>{r[2]}</td>
                  <td>{money(r[3], 0)}</td>
                  <td>{money(r[4], 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 22, fontSize: 14, color: '#777' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Amount total</span><span>{money(quote.subtotal)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}><span>Tax (10%)</span><span>{money(quote.tax)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, color: '#101d17', alignItems: 'center' }}>
              <b style={{ fontSize: 16 }}>Grand Total</b>
              <b style={{ fontSize: 24 }}>{money(quote.total)}</b>
            </div>
          </div>
          <div style={{ textAlign: 'center', margin: '18px 0 14px' }}>
            <ActionButton className="g-btn yellow" primary loadingMs={900} onDone={next}>
              Open your event portal
            </ActionButton>
          </div>
          <p style={{ fontSize: 12, color: '#777', margin: '0 0 18px' }}>
            50% deposit ({money(quote.deposit)}) is due when you sign. This link is private to you, so there is no login. The quote is
            valid until {timeline.quoteValidTo}.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#666' }}>
            <span className="g-pill">Secure link</span> {group.portalLink}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------------- G4 review + viewers ---------------- */
function Thumb({ kind }: { kind: 'beo' | 'contract' }) {
  return (
    <div style={{ background: '#f1eee6', borderRadius: 10, padding: '12px 0', display: 'flex', justifyContent: 'center', height: 200, overflow: 'hidden' }}>
      <div style={{ width: 220, background: '#fff', boxShadow: '0 1px 6px rgba(0,0,0,.2)', padding: '12px 14px', fontSize: 7, lineHeight: 1.7, color: '#555' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <b style={{ color: '#0f4a38' }}>CEDAR VALLEY</b>
          <span>{kind === 'beo' ? 'BEO' : 'CONTRACT'} · {group.code}</span>
        </div>
        <b style={{ fontSize: 10, color: '#111', display: 'block', margin: '5px 0 3px' }}>{kind === 'beo' ? 'Banquet Event Order' : 'Group Booking Contract'}</b>
        <div>{group.name}</div>
        {(kind === 'beo'
          ? [['Dates', 'Nov 12 – Nov 15, 2026'], ['Rooms', '22 rooms · 3 nights'], ['Meeting Hall', '3 days, 9:00 – 17:00'], ['Catering', '96 guest-days'], ['Total', money(quote.total)]]
          : [['Deposit', `50% · ${money(quote.deposit)}`], ['Balance', `Due ${timeline.balanceDue}`], ['Billed to', organizer.name], ['Payment', 'Card']]
        ).map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee' }}><span>{k}</span><b style={{ color: '#111' }}>{v}</b></div>
        ))}
      </div>
    </div>
  )
}

export function G4({ goto }: SceneProps) {
  const [checked, setChecked] = useState(false)
  useEffect(() => {
    const t = window.setTimeout(() => setChecked(true), 900)
    return () => window.clearTimeout(t)
  }, [])
  return (
    <PortalShell active="Overview">
      <div className="g-wrap" style={{ paddingTop: 40 }}>
        <h1 className="g-h1">Review your group booking</h1>
        <p className="g-lead">Check the quote, the Banquet Event Order and the contract before you sign.</p>
        <Track steps={['Review', 'Sign', 'Pay deposit']} current={1} />
        <div style={{ display: 'grid', gridTemplateColumns: '640px 400px', gap: 24 }}>
          <div className="g-card" style={{ alignSelf: 'start' }}>
            <div className="g-card-h">Your quote</div>
            <div className="g-card-b" style={{ fontSize: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12, color: '#666', marginBottom: 14 }}>
                <div>Group<b style={{ display: 'block', color: '#101d17', fontSize: 14, marginTop: 3 }}>{group.name}</b></div>
                <div>Rooms<b style={{ display: 'block', color: '#101d17', fontSize: 14, marginTop: 3 }}>22 rooms · 12 single bed, 10 double bed</b>
                  <div style={{ marginTop: 14 }}>Billed to<b style={{ display: 'block', color: '#101d17', fontSize: 14, marginTop: 3 }}>{organizer.name}</b></div></div>
              </div>
              <div style={{ fontSize: 12, color: '#666' }}>Dates<b style={{ display: 'block', color: '#101d17', fontSize: 14, margin: '3px 0 14px' }}>Nov 12 – Nov 15, 2026 · 3 nights</b></div>
              {[
                ...quote.roomLines.map((l) => [`${l.name} × ${l.qty}`, l.total] as const),
                [`Meeting Hall × ${quote.meeting.days} days`, quote.meeting.total] as const,
                [`Group Catering × ${quote.catering.qty} guest-days`, quote.catering.total] as const,
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0' }}><span>{k}</span><span>{money(v)}</span></div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', color: '#777' }}><span>Taxes (10%)</span><span>{money(quote.tax)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 }}>
                <b style={{ fontSize: 16 }}>Grand Total</b><b style={{ fontSize: 24 }}>{money(quote.total)}</b>
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gap: 24 }}>
            {(['beo', 'contract'] as const).map((k) => (
              <div className="g-card" key={k} style={{ padding: 24 }}>
                <b style={{ fontSize: 18 }}>{k === 'beo' ? 'Banquet Event Order (BEO)' : 'Contract'}</b>
                <div style={{ color: '#666', fontSize: 13, margin: '10px 0 14px' }}>
                  {k === 'beo' ? 'BEO_GBR-008.pdf · Version 2' : 'Contract_GBR-008.pdf · Needs your signature'}
                </div>
                <Thumb kind={k} />
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12 }}>
                  <button className="g-btn small ab" onClick={() => goto(k === 'beo' ? 'G4b' : 'G4c')}>Open file</button>
                  <button className="g-btn small">Download</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 24 }}>
          <span onClick={() => setChecked((c) => !c)} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <GCheck on={checked} /> I have reviewed the quote, the BEO and the contract.
          </span>
          <button className="g-btn yellow ab" disabled={!checked} onClick={() => goto('G5')}>Continue to sign</button>
        </div>
      </div>
    </PortalShell>
  )
}

function Viewer({ file, meta, children, back, cta }: { file: string; meta: string; children: ReactNode; back: () => void; cta?: { label: string; onDone: () => void } }) {
  return (
    <div style={{ minHeight: '100vh', background: '#e8eae6', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ background: '#1c2723', color: '#fff', height: 64, display: 'flex', alignItems: 'center', padding: '0 32px', gap: 18, fontSize: 14 }}>
        <span style={{ cursor: 'pointer', fontWeight: 600, fontSize: 13 }} onClick={back}>← Back to review</span>
        <span style={{ width: 1, height: 22, background: '#555' }} />
        <b>{file}</b>
        <span style={{ color: '#aaa', fontSize: 13 }}>{meta}</span>
        <span style={{ marginLeft: 'auto', color: '#aaa', fontSize: 12 }}>Page 1 of 1</span>
        <button className="g-btn small" style={{ background: 'transparent', color: '#fff', borderColor: '#fff' }}>Download</button>
        <button className="g-btn small" style={{ background: 'transparent', color: '#fff', borderColor: '#fff' }}>Print</button>
        {cta && (
          <ActionButton className="g-btn small yellow" primary loadingMs={700} onDone={cta.onDone}>
            {cta.label}
          </ActionButton>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '28px 0 60px' }}>
        <div style={{ transform: 'scale(1.18)', transformOrigin: 'top center', marginBottom: 130 }}>{children}</div>
      </div>
    </div>
  )
}

export const G4b = ({ goto }: SceneProps) => (
  <Viewer file="BEO_GBR-008.pdf" meta="Version 2 · Sep 12, 2026" back={() => goto('G4')}>
    <BeoDoc variant="guest" />
  </Viewer>
)

export const G4c = ({ goto }: SceneProps) => (
  <Viewer file="Contract_GBR-008.pdf" meta="Needs your signature" back={() => goto('G4')} cta={{ label: 'Continue to sign', onDone: () => goto('G5') }}>
    <ContractDoc />
  </Viewer>
)

/* ---------------- G5 sign ---------------- */
export function G5({ next }: SceneProps) {
  const { values, done } = useTypedFields([organizer.name], { speed: 55, startDelay: 700 })
  return (
    <PortalShell active="Documents">
      <div className="g-wrap" style={{ paddingTop: 40 }}>
        <h1 className="g-h1">Sign your contract</h1>
        <p className="g-lead">Read the contract, then add your signature to confirm the group booking.</p>
        <Track steps={['Review', 'Sign', 'Pay deposit']} current={2} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
          <div className="g-card" style={{ alignSelf: 'start' }}>
            <div className="g-card-h">Contract · {group.code}</div>
            <div className="g-card-b" style={{ fontSize: 14, color: '#555', lineHeight: 1.6, minHeight: 330 }}>
              {[
                ['1. Event', `${group.name}, Nov 12 – Nov 15, 2026, with 22 rooms, the Meeting Hall for 3 days and group catering for ${group.guests} guests.`],
                ['2. Payment', `50% deposit (${money(quote.deposit)}) is due when the contract is signed. The remaining 50% (${money(quote.balance)}) is due seven days before arrival (${timeline.balanceDue.replace(', 2026', ', 2026')}).`],
                ['3. Changes and cancellation', 'Room counts can be adjusted until Oct 30, 2026. Cancellations after that date are charged according to the venue policy.'],
                ['4. Billing', 'All rooms and add-ons are billed to the organizer on one invoice. Guests who prefer to pay separately may book with the group code.'],
              ].map(([h, t]) => (
                <div key={h} style={{ marginBottom: 16 }}><b style={{ color: '#101d17' }}>{h}</b><div>{t}</div></div>
              ))}
            </div>
          </div>
          <div className="g-card" style={{ alignSelf: 'start' }}>
            <div className="g-card-h">Sign here</div>
            <div className="g-card-b">
              <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
                <span className="g-btn small yellow" style={{ height: 32 }}>Type</span>
                <span className="g-btn small" style={{ height: 32 }}>Draw</span>
              </div>
              <GInput label="Full name" value={values[0]} focus={!done} caret={!done} style={{ marginBottom: 16 }} />
              <div style={{ background: '#f3f0e8', borderRadius: 10, padding: '16px 18px 10px', marginBottom: 16, minHeight: 90 }}>
                <div style={{ fontSize: 34, fontWeight: 300, borderBottom: '1px solid #666', minHeight: 48, letterSpacing: '.01em' }}>{values[0]}</div>
                <div style={{ fontSize: 11, color: '#666', marginTop: 8 }}>Signed electronically · {timeline.organizerSigned}</div>
              </div>
              <label style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 14, marginBottom: 14 }}>
                <GCheck on={done} /> I agree to the terms and to sign electronically.
              </label>
              <ActionButton className="g-btn yellow block" primary loadingMs={1000} onDone={next}>Sign and continue</ActionButton>
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  )
}

/* ---------------- G6 pay deposit ---------------- */
export function G6({ next }: SceneProps) {
  const { toast } = usePlayer()
  const { values: v } = useTypedFields([organizer.name, card.number, card.expiry, card.cvc], { speed: 45, startDelay: 700, gap: 220 })
  const cur = v.findIndex((x, i) => x.length < [organizer.name, card.number, card.expiry, card.cvc][i].length)
  const line = (k: string, val: string, sub?: boolean) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', color: sub ? '#777' : '#101d17', fontSize: 14 }}>
      <span>{k}</span><span>{val}</span>
    </div>
  )
  return (
    <PortalShell active="Invoices">
      <div className="g-wrap" style={{ paddingTop: 40 }}>
        <h1 className="g-h1">Pay your deposit</h1>
        <p className="g-lead">Your contract is signed. Pay the 50% deposit to confirm the group booking.</p>
        <Track steps={['Review', 'Sign', 'Pay deposit']} current={3} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
          <div style={{ display: 'grid', gap: 20, alignSelf: 'start' }}>
            <div className="g-card">
              <div className="g-card-h">Billing Details</div>
              <div className="g-card-b" style={{ display: 'grid', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <GInput label="First Name" value={organizer.first} />
                  <GInput label="Last Name" value={organizer.last} />
                </div>
                <GInput label="Email" value={organizer.email} />
              </div>
            </div>
            <div className="g-card">
              <div className="g-card-h">Payment Method</div>
              <div className="g-card-b" style={{ display: 'grid', gap: 14 }}>
                <GInput label="Card Holder" value={v[0]} focus={cur === 0} caret={cur === 0} />
                <GInput label="Card number" value={v[1]} focus={cur === 1} caret={cur === 1} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <GInput label="Expiry" value={v[2]} focus={cur === 2} caret={cur === 2} />
                  <GInput label="CVC" value={v[3]} focus={cur === 3} caret={cur === 3} />
                </div>
                <div style={{ fontSize: 12, color: '#666' }}>Your card is stored securely with the payment gateway. We never keep the card number.</div>
              </div>
            </div>
          </div>
          <div className="g-card" style={{ alignSelf: 'start' }}>
            <div className="g-card-h">Summary</div>
            <div className="g-card-b">
              {line('Start Date', group.start)}
              {line('End Date', group.end)}
              <b style={{ fontSize: 13, display: 'block', margin: '6px 0 2px' }}>Accommodations</b>
              {quote.roomLines.map((l) => line(`${l.name} × ${l.qty}`, money(l.total), true))}
              <b style={{ fontSize: 13, display: 'block', margin: '6px 0 2px' }}>Add-ons</b>
              {line(`Meeting Hall × ${quote.meeting.days}`, money(quote.meeting.total), true)}
              {line(`Group Catering × ${quote.catering.qty}`, money(quote.catering.total), true)}
              {line('Subtotal', money(quote.subtotal))}
              {line('Taxes', money(quote.tax))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0 14px' }}>
                <b style={{ fontSize: 16 }}>Total</b><b style={{ fontSize: 24 }}>{money(quote.total)}</b>
              </div>
              <div style={{ background: '#c6f0e0', borderRadius: 12, padding: '12px 14px', marginBottom: 16, color: '#0a4a37' }}>
                <div style={{ fontSize: 12, fontWeight: 600 }}>Due today · 50% deposit</div>
                <div style={{ fontSize: 28, fontWeight: 700, margin: '2px 0' }}>{money(quote.deposit)}</div>
                <div style={{ fontSize: 12 }}>Balance {money(quote.balance)} due {timeline.balanceDue}</div>
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

/* ---------------- G7 booking confirmed ---------------- */
export function G7(_: SceneProps) {
  const nav = useNavigate()
  return (
    <PortalShell active="Overview">
      <div className="g-wrap" style={{ paddingTop: 40 }}>
        <div style={{ textAlign: 'center' }}>
          <span className="g7-check">✓</span>
          <h1 className="g-h1" style={{ marginTop: 16 }}>Your group booking is confirmed</h1>
          <p className="g-lead">Confirmation {group.code} · A receipt was sent to {organizer.email}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 28 }}>
          <div className="g-card">
            <div className="g-card-h">Booking details</div>
            <div className="g-card-b" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <dl className="g-kv" style={{ margin: 0 }}>
                <dt>Group</dt><dd>{group.name}</dd>
                <dt>Dates</dt><dd>Nov 12 – Nov 15, 2026 · 3 nights</dd>
                <dt>Rooms</dt><dd>22 rooms · Meeting Hall · Group catering</dd>
              </dl>
              <dl className="g-kv" style={{ margin: 0 }}>
                <dt>Paid today</dt><dd>{money(quote.deposit)} (deposit)</dd>
                <dt>Balance</dt><dd>{money(quote.balance)} due {timeline.balanceDue}</dd>
                <dt>Group code</dt><dd>{group.code}</dd>
              </dl>
            </div>
          </div>
          <div className="g-card">
            <div className="g-card-h">What happens next</div>
            <div className="g-card-b" style={{ display: 'grid', gap: 14, fontSize: 14 }}>
              {['The venue team approves your reservation.', 'Assign guests to your rooms, or share the group code so guests can book and pay for themselves.', 'You will receive your final invoice and arrival details before Nov 12.'].map((t, i) => (
                <div key={t} style={{ display: 'flex', gap: 12 }}>
                  <span className="g7-n">{i + 1}</span>
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
          <button className="g-btn">View booking</button>
          <button className="g-btn">Add to calendar</button>
          <button className="g-btn yellow ab" onClick={() => nav('/v2')}>Assign rooms</button>
        </div>
      </div>
    </PortalShell>
  )
}

