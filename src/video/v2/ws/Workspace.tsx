import { createContext, useContext, useState, type ReactNode } from 'react'
import { AdminPage, Badge, GlobalNav, ObjectIcon } from '../../../components/admin/Admin'
import { Icon } from '../../../components/admin/Icon'
import { ActionButton } from '../../../components/shared/ActionButton'
import { useTypedFields } from '../../../components/shared/typing'
import { money } from '../../../data/demo'
import { asset } from '../../../lib/asset'
import { balance, derive, posTotal, type Spec, type View } from './model'
import './ws.css'

/* V2 · Reservations workspace (Figma 1047:8605): list W0, group #00031 (W14–W16) and the individual reservation (W1…W31). */

export type Act =
  | 'bc'
  | 'rateLink'
  | 'editRate'
  | 'changeRoom'
  | 'addNote'
  | 'addGuest'
  | 'addRoom'
  | 'addItem'
  | 'checkIn'
  | 'checkOut'
  | 'createInv'
  | 'takePay'
  | 'inv32'
  | 'inv33'
  | 'payPart'
  | 'payFirst'
  | 'assign'
  | 'cancel'
  | 'submit'
  | 'open31'
  | 'open32'

export type PanelKey = null | 'rate' | 'changeRoom' | 'addItem' | 'addGuest' | 'addRoom' | 'checkIn' | 'checkOut' | 'createInv' | 'pay' | 'inv32' | 'inv33' | 'assign'
export type Go = (a: Act) => void

/* ---------------------------------------------------------------- shell */
export function WsShell({ children, panel }: { children: ReactNode; panel?: ReactNode }) {
  return (
    <AdminPage>
      <GlobalNav active="Reservations" />
      <div className="ws-body">
        {children}
        {panel}
      </div>
    </AdminPage>
  )
}

const L = ({ children, onClick }: { children: ReactNode; onClick?: () => void }) => (
  <button type="button" className="ws-link" onClick={onClick}>
    {children}
  </button>
)
const Pill = ({ children, brand, onClick, disabled }: { children: ReactNode; brand?: boolean; onClick?: () => void; disabled?: boolean }) => (
  <button type="button" className={`slds-button ${brand ? 'slds-button_brand' : 'slds-button_neutral'}`} onClick={onClick} disabled={disabled}>
    {children}
  </button>
)
const StatusBadge = ({ s }: { s: string }) => <Badge tone="mint">{s}</Badge>

/* ---------------------------------------------------------------- shared page parts */
function Journey({ v }: { v: View }) {
  const st = v.journey.steps
  return (
    <section className="ws-card ws-jr">
      <div className="hd">
        <h2>Guest journey</h2>
        <span className="ws-muted">{v.journey.next}</span>
      </div>
      <div className="ws-steps">
        {st.map((s, i) => (
          <JrStep key={s.n} s={s} last={i === st.length - 1} prevDone={i > 0 && st[i - 1].state === 'done'} />
        ))}
      </div>
    </section>
  )
}
function JrStep({ s, last, prevDone }: { s: View['journey']['steps'][number]; last: boolean; prevDone: boolean }) {
  return (
    <>
      {s.n > 1 && <div className={`ws-conn ${prevDone && s.state !== 'todo' ? 'done' : prevDone ? 'done' : ''}`} />}
      <div className={`ws-step ${s.state === 'todo' ? 'todo' : ''}`}>
        <div className={`ws-mk ${s.state === 'done' ? 'done' : s.state === 'cur' ? 'cur' : ''}`}>{s.state === 'done' ? '✓' : s.n}</div>
        <div>
          <b>{s.label}</b>
          <span>{s.sub}</span>
        </div>
      </div>
      {last ? null : null}
    </>
  )
}

function Strip({ cells }: { cells: [string, string, string, ReactNode?, boolean?][] }) {
  return (
    <section className="ws-card ws-sum">
      {cells.map(([l, v, s, extra, amber]) => (
        <div key={l}>
          <span className="l">{l}</span>
          <span className={`v fx ${amber ? 'amber' : ''}`} key={v}>
            {v}
          </span>
          {extra ?? <span className="s">{s}</span>}
        </div>
      ))}
    </section>
  )
}

function Activity({ events, note, onNote, composing, onPost, onCancel, typed }: { events: View['events']; note?: string; onNote?: (t: string) => void; composing?: boolean; onPost?: () => void; onCancel?: () => void; typed?: string }) {
  const [vis, setVis] = useState<'internal' | 'guest'>('internal')
  const t = useTypedFields([typed ?? ''], { run: !!typed, speed: 26, startDelay: 600 })
  const text = typed !== undefined ? t.values[0] : (note ?? '')
  return (
    <section className="ws-card ws-act">
      <div className="ws-sec">
        <div className="hd">
          <h2>Activity</h2>
          <button type="button" className="ws-link" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            All activity <Icon name="chevrondown" size="x-small" color="#0250d9" />
          </button>
        </div>
      </div>
      <div className="ws-act-body">
        <textarea className="ws-note" placeholder="Add a note for your team…" value={text} onChange={(e) => onNote?.(e.target.value)} readOnly={typed !== undefined} />
        {composing && (
          <>
            <div className="ws-vis">
              <span className={vis === 'internal' ? 'on' : ''} onClick={() => setVis('internal')} role="button">
                Internal note
              </span>
              <span className={vis === 'guest' ? 'on' : ''} onClick={() => setVis('guest')} role="button">
                Visible to guest
              </span>
            </div>
            <div className="ws-acts" style={{ justifyContent: 'flex-end', marginTop: -8 }}>
              <Pill onClick={onCancel}>Cancel</Pill>
              <Pill brand onClick={onPost}>
                Post note
              </Pill>
            </div>
          </>
        )}
        {events.map((e, i) => (
          <div className={`ws-ev ${i === 0 ? 'new' : ''}`} key={e.title + i}>
            <div className="dw">
              <i className={`dot ${e.dot === 'grey' ? '' : e.dot}`} />
            </div>
            <div className="tx">
              <b>{e.title}</b>
              <span>{e.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- individual reservation (W1…W31) */
export function ResPage({ spec, go, panel, composing, typedNote }: { spec: Spec; go: Go; panel?: ReactNode; composing?: boolean; typedNote?: string }) {
  const v = derive(spec)
  const out = spec.checkedOut
  const cs = v.strip
  return (
    <WsShell panel={panel}>
      <section className="ws-card ws-head">
        <div className="col">
          <div className="bc">
            <L onClick={() => go('bc')}>Reservations</L>
            <Icon name="chevronright" size="xx-small" />
          </div>
          <div className="tr">
            <h1>#00032</h1>
            <StatusBadge s={v.status} />
          </div>
          <div className="sm">
            <L>Priya Nair</L>
            <span>{v.summaryLine}</span>
            <L>GBR-008</L>
          </div>
        </div>
        <div className="ws-acts">
          <Pill onClick={() => go('addNote')}>Add note</Pill>
          <Pill onClick={() => go('createInv')}>Create invoice</Pill>
          {!out && (
            <Pill brand onClick={() => go(spec.checkedIn ? 'checkOut' : 'checkIn')}>
              {spec.checkedIn ? 'Check out' : 'Check in'}
            </Pill>
          )}
        </div>
      </section>
      <Journey v={v} />
      <Strip
        cells={[
          ['Grand total', cs.grand.v, cs.grand.s],
          ['Paid', cs.paid.v, cs.paid.s],
          ['Balance due', cs.bal.v, cs.bal.s, cs.bal.link ? <L onClick={() => go('takePay')}>Take payment</L> : undefined, cs.bal.amber],
          ['Invoices', cs.inv.v, cs.inv.s, cs.inv.link ? <L onClick={() => go(cs.inv.link === 'create' ? 'createInv' : 'inv33')}>{cs.inv.s}</L> : undefined],
        ]}
      />
      <div className="ws-main">
        <div className="ws-left">
          <section className="ws-card ws-sec">
            <div className="hd">
              <h2>Room and guests</h2>
              <div className="ws-acts">
                <Pill onClick={() => go('changeRoom')}>Change room</Pill>
                <Pill onClick={() => go('addRoom')}>Add room</Pill>
              </div>
            </div>
            <div className="bd">
              {v.rooms.map((r, i) => (
                <div className="ws-row" key={i}>
                  <div className="ws-room">
                    <img src={asset(`img/${r.img}`)} alt="" />
                    <div className="tx">
                      <span className="t">{r.type}</span>
                      <span className="ws-muted">{r.line}</span>
                      <L onClick={() => go('rateLink')}>{r.plan}</L>
                    </div>
                  </div>
                  <div className="ws-price">
                    <b>{money(r.net)}</b>
                    <span>+Tax {money(r.tax)}</span>
                  </div>
                </div>
              ))}
              <div className="ws-row tight">
                <div className="ws-guest">
                  <div className="ws-av">PN</div>
                  <div className="tx">
                    <b>Priya Nair</b>
                    <span>Primary guest · priya@horizon.example</span>
                  </div>
                </div>
                <L onClick={() => go('addGuest')}>Add guest</L>
              </div>
            </div>
          </section>
          <section className="ws-card ws-sec">
            <div className="hd">
              <h2>Add-ons and charges</h2>
              <Pill onClick={() => go('addItem')}>Add item</Pill>
            </div>
            <div className="bd">
              {v.addons.map((a) => (
                <div className="ws-row" key={a.title}>
                  <div className="it">
                    <span className="t">{a.title}</span>
                    <span className="ws-muted">{a.sub}</span>
                  </div>
                  <div className="ws-price">
                    <b>{a.price}</b>
                    <span>{a.priceSub}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="ws-card ws-sec">
            <div className="hd">
              <h2>Billing</h2>
              <Pill onClick={() => go('takePay')}>Take payment</Pill>
            </div>
            <div className="bd">
              <div className="ws-bill">
                <div className="c">
                  <div className="k">
                    <span className="l">Contact</span>
                    <L>Priya Nair</L>
                  </div>
                  <div className="k">
                    <span className="l">Email</span>
                    <span>priya@horizon.example</span>
                  </div>
                  <L>Change contact</L>
                </div>
                <div className="c">
                  <div className="k">
                    <span className="l">Invoice</span>
                    <L onClick={() => go(v.billing.invoices[0].no === 'INV-00032' ? 'inv32' : 'inv33')}>{v.billing.invoices[0].no}</L>
                    <span className="s">{v.billing.invoices[0].sub}</span>
                  </div>
                  {v.billing.notCreated && (
                    <div className="k">
                      <span className="l">Invoice</span>
                      <span className="ws-chip">Not created for POS-1058</span>
                      <L onClick={() => go('createInv')}>Create invoice</L>
                    </div>
                  )}
                  {v.billing.invoices.slice(1).map((iv) => (
                    <div className="k" key={iv.no}>
                      <span className="l">Invoice</span>
                      <L onClick={() => go('inv33')}>{iv.no}</L>
                      <span className="s">{iv.sub}</span>
                    </div>
                  ))}
                </div>
                <div className="c">
                  <div className="k">
                    <span className="l">Payments</span>
                    <span>{v.billing.payments.v}</span>
                    <span className="s">{v.billing.payments.s}</span>
                  </div>
                  {v.billing.balance && (
                    <div className="k">
                      <span className="l">Balance</span>
                      <span>{v.billing.balance.v}</span>
                      <span className="s">{v.billing.balance.s}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
        <Activity events={v.events} composing={composing} typed={typedNote} onPost={() => go('submit')} onCancel={() => go('cancel')} />
      </div>
    </WsShell>
  )
}

/* ---------------------------------------------------------------- panels */
function PanelFrame({ title, sub, onClose, children, footer }: { title: string; sub: string; onClose: () => void; children: ReactNode; footer: ReactNode }) {
  return (
    <aside className="ws-panel" role="dialog" aria-label={title}>
      <div className="ph">
        <h2>{title}</h2>
        <p>{sub}</p>
        <button type="button" className="x" aria-label="Close" onClick={onClose}>
          <Icon name="close" size="x-small" color="#0250d9" />
        </button>
      </div>
      <div className="pb">{children}</div>
      <div className="pf">{footer}</div>
    </aside>
  )
}
const Box = ({ t, s }: { t: string; s: string }) => (
  <div className="ws-box">
    <b>{t}</b>
    <span>{s}</span>
  </div>
)
const Sum = ({ l, r }: { l: ReactNode; r: ReactNode }) => (
  <div className="ws-box sum">
    <span>{l}</span>
    <b>{r}</b>
  </div>
)
const F = ({ l, children, hint }: { l: string; children: ReactNode; hint?: string }) => (
  <div className="ws-f">
    <label>{l}</label>
    {children}
    {hint && <span className="ws-hint">{hint}</span>}
  </div>
)
function Sel({ value, options, disabled, onChange }: { value: string; options?: string[]; disabled?: boolean; onChange?: (v: string) => void }) {
  const opts = options ?? [value]
  return (
    <select className="ws-sel" value={value} disabled={disabled} onChange={(e) => onChange?.(e.target.value)} aria-label={value}>
      {opts.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  )
}
const Dis = ({ value }: { value: string }) => <input className="ws-in" value={value} disabled readOnly aria-label={value} />
const DateIn = ({ value }: { value: string }) => (
  <div className="ws-ic">
    <input className="ws-in" defaultValue={value} aria-label={value} />
    <Icon name="date_input" size="x-small" />
  </div>
)
function Cb({ label, on: init = true }: { label: string; on?: boolean }) {
  const [on, setOn] = useState(init)
  return (
    <div className={`ws-cb ${on ? 'on' : ''}`} onClick={() => setOn((o) => !o)} role="checkbox" aria-checked={on}>
      <i />
      <span>{label}</span>
    </div>
  )
}
const Cancel = ({ go }: { go: Go }) => <Pill onClick={() => go('cancel')}>Cancel</Pill>
/** whether the → key should "click" the panel's brand button (set per scene) */
export const PrimaryCtx = createContext(false)
const Submit = ({ go, children, ms = 700 }: { go: Go; children: ReactNode; ms?: number }) => {
  const primary = useContext(PrimaryCtx)
  return (
    <ActionButton className="slds-button slds-button_brand" primary={primary} loadingMs={ms} onDone={() => go('submit')}>
      {children}
    </ActionButton>
  )
}

/** Rate details (W17) / Edit rate (W28) */
export function RatePanel({ go, edit }: { go: Go; edit: boolean }) {
  const { values } = useTypedFields(['150'], { run: edit, speed: 90, startDelay: 500 })
  const typed = edit ? values[0] : '140'
  const n = Number(typed || 0)
  const net = n * 3
  const tax = net * 0.1
  const delta = (net + tax) - 462
  return (
    <PanelFrame title="Rate details" sub="Reservation #00032 · Priya Nair" onClose={() => go('cancel')} footer={<><Cancel go={go} /><Submit go={go}>Save rate</Submit></>}>
      <Box t="Standard Double Room · Room 201" s="Nov 12 – 15, 2026 · 3 nights · Group Block GBR-008" />
      <F l="Rate plan"><Sel value="Group rate · GBR-008" options={['Group rate · GBR-008', 'Custom rate']} /></F>
      <F l="Stay"><Dis value="Nov 12 – 15, 2026 · 3 nights" /></F>
      <F l="Nightly rate">
        <input className="ws-in" value={`$${typed}${typed && !typed.includes('.') ? '.00' : ''}`} readOnly={!edit} onClick={() => !edit && go('editRate')} aria-label="Nightly rate" style={{ cursor: edit ? 'text' : 'pointer' }} />
      </F>
      <F l="Tax"><Dis value={`10% · ${money(tax)}`} /></F>
      <Sum l={edit ? 'New room total' : 'Room total'} r={`${money(net)} + tax ${money(tax)}`} />
      {edit && n !== 140 && <Sum l="Price impact" r={`${delta >= 0 ? '+' : '−'}${money(Math.abs(delta))} · balance due ${money(Math.max(delta, 0))}`} />}
    </PanelFrame>
  )
}

export function ChangeRoomPanel({ go }: { go: Go }) {
  const [room, setRoom] = useState('Standard 204')
  return (
    <PanelFrame title="Change room" sub="The reservation stays visible behind this panel" onClose={() => go('cancel')} footer={<><Cancel go={go} /><Submit go={go}>Change room</Submit></>}>
      <Box t="Priya Nair · Reservation #00032" s="Nov 12 – Nov 15, 2026 · 3 nights · Group Block GBR-008" />
      <F l="Current room"><Dis value="Standard Double Room · Standard 201" /></F>
      <F l="New room type"><Sel value="Standard Double Room" options={['Standard Double Room', 'Standard Single Room']} /></F>
      <F l="New room" hint={`${room} is free Nov 12 – 15 · same rate, no price change`}>
        <Sel value={room} options={['Standard 204', 'Standard 205', 'Standard 206']} onChange={setRoom} />
      </F>
      <F l="Reason"><Sel value="Guest request" options={['Guest request', 'Maintenance', 'Upgrade']} /></F>
      <F l="Rate"><Dis value="Group rate · $140.00 per night" /></F>
      <F l="Note">
        <textarea className="ws-ta" defaultValue="Prefers a room close to the meeting hall." aria-label="Note" />
      </F>
      <Cb label="Send an updated confirmation to the guest" />
      <Sum l="Price impact" r="$0.00 · total stays $462.00" />
    </PanelFrame>
  )
}

const ITEMS: [string, string, number, 'stay' | 'night' | 'person'][] = [
  ['Late check-out (1:00 PM)', '$25.00 per stay', 25, 'stay'],
  ['Extra bed', '$30.00 per night', 30, 'night'],
  ['Airport shuttle seat', '$18.00 per person', 18, 'person'],
  ['Group catering (per guest-day)', '$55.00 per person', 55, 'person'],
]
export function AddItemPanel({ go }: { go: Go }) {
  const [sel, setSel] = useState(0)
  const [qty, setQty] = useState('1')
  const [q, setQ] = useState('')
  const price = ITEMS[sel][2] * (Number(qty) || 0)
  return (
    <PanelFrame title="Add item" sub="Reservation #00032 · Priya Nair" onClose={() => go('cancel')} footer={<><Cancel go={go} /><Submit go={go}>Add item</Submit></>}>
      <div className="ws-ic">
        <input className="ws-in" style={{ paddingLeft: 32 }} placeholder="Search items…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search items" />
        <Icon name="search" size="x-small" className="" style={{ left: 10, right: 'auto', fill: '#5c5c5c' }} />
      </div>
      <div className="ws-set" style={{ gap: 8 }}>
        {ITEMS.map(([t, s], i) =>
          t.toLowerCase().includes(q.toLowerCase()) ? (
            <div key={t} className={`ws-opt ${sel === i ? 'on' : ''}`} onClick={() => setSel(i)} role="radio" aria-checked={sel === i}>
              <i />
              <div>
                <b>{t}</b>
                <span>{s}</span>
              </div>
            </div>
          ) : null,
        )}
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ width: 118 }}>
          <F l="Quantity">
            <input className="ws-in" value={qty} onChange={(e) => setQty(e.target.value.replace(/\D/g, ''))} aria-label="Quantity" />
          </F>
        </div>
        <div style={{ flex: 1 }}>
          <F l="Date"><DateIn value="Nov 15, 2026" /></F>
        </div>
      </div>
      <Sum l="Adds to this reservation" r={`${money(price)} + tax ${money(price * 0.1)}`} />
    </PanelFrame>
  )
}

export function AddGuestPanel({ go }: { go: Go }) {
  return (
    <PanelFrame title="Add guest" sub="Reservation #00032 · Priya Nair" onClose={() => go('cancel')} footer={<><Cancel go={go} /><Submit go={go}>Add guest</Submit></>}>
      <Box t="Priya Nair · Reservation #00032" s="Nov 12 – Nov 15, 2026 · 3 nights · Group Block GBR-008" />
      <F l="Guest"><input className="ws-in" placeholder="Search or add a guest…" aria-label="Guest" /></F>
      <F l="Role"><Sel value="Adult" options={['Adult', 'Child']} /></F>
      <F l="Email"><input className="ws-in" defaultValue="guest@horizon.example" aria-label="Email" /></F>
      <Cb label="Send the guest portal link by email" />
      <Sum l="Guests on this room" r="1 of 2 assigned" />
    </PanelFrame>
  )
}

export function AddRoomPanel({ go }: { go: Go }) {
  return (
    <PanelFrame title="Add room" sub="Group block GBR-008 · Priya Nair" onClose={() => go('cancel')} footer={<><Cancel go={go} /><Submit go={go}>Add room</Submit></>}>
      <Box t="Priya Nair · Reservation #00032" s="Nov 12 – Nov 15, 2026 · 3 nights · Group Block GBR-008" />
      <F l="Room type"><Sel value="Standard Double Room" options={['Standard Double Room', 'Standard Single Room', 'Cabin']} /></F>
      <F l="Room"><Sel value="Standard 205" options={['Standard 205', 'Standard 206']} /></F>
      <F l="Check-in"><DateIn value="Nov 12, 2026" /></F>
      <F l="Check-out"><DateIn value="Nov 15, 2026" /></F>
      <F l="Rate"><Dis value="Group rate · $140.00 per night" /></F>
      <Sum l="Adds to this reservation" r="$420.00 + tax $42.00" />
    </PanelFrame>
  )
}

export function CheckInPanel({ go, spec }: { go: Go; spec: Spec }) {
  return (
    <PanelFrame title="Check in" sub="Reservation #00032 · Priya Nair" onClose={() => go('cancel')} footer={<><Cancel go={go} /><Submit go={go}>Check in</Submit></>}>
      <Box t="Priya Nair · Reservation #00032" s="Nov 12 – Nov 15, 2026 · 3 nights · Group Block GBR-008" />
      <F l="Room"><Dis value={`Standard ${spec.room} · Clean and ready`} /></F>
      <F l="Arrival"><DateIn value="Nov 12, 2026" /></F>
      <F l="Arrival time"><Sel value="3:00 PM" options={['3:00 PM', '3:30 PM', '4:00 PM', '4:10 PM']} /></F>
      <F l="Front desk note"><textarea className="ws-ta" defaultValue="Guest asked for a quiet room near the meeting hall." aria-label="Front desk note" /></F>
      <Cb label="ID verified at the desk" />
      <Cb label="Send the guest portal link by email" />
      <Sum l="Balance at check-in" r="$0.00 · deposit paid" />
    </PanelFrame>
  )
}

export function CheckOutPanel({ go, spec, onTakePay }: { go: Go; spec: Spec; onTakePay: () => void }) {
  const b = balance(spec)
  const due = b > 0
  const g = derive(spec).strip
  return (
    <PanelFrame
      title="Check out"
      sub="Reservation #00032 · Priya Nair"
      onClose={() => go('cancel')}
      footer={
        <>
          <Cancel go={go} />
          <Submit go={go}>{due ? 'Check out with balance due' : 'Check out'}</Submit>
        </>
      }
    >
      <div className="ws-box warn">
        <span className="l">Balance due</span>
        <span className="big">{money(b)}</span>
        <span className="l">{due ? 'Partially paid · INV-00033' : 'Paid in full'}</span>
      </div>
      {due && <span className="ws-muted">Checking out now leaves {money(b)} open on INV-00033. You can still collect it later from this reservation.</span>}
      <div className="ws-set">
        <h3>Settlement</h3>
        <div className="ws-ln">
          <span>
            Grand total<span className="s">{g.grand.s}</span>
          </span>
          <span>{g.grand.v}</span>
        </div>
        <div className="ws-ln">
          <span>
            Paid<span className="s">{g.paid.s}</span>
          </span>
          <span>{g.paid.v}</span>
        </div>
        <hr className="ws-hr" />
        <div className="ws-ln b">
          <span>Balance due</span>
          <span>{money(b)}</span>
        </div>
        <h3>Departure</h3>
        <div className="ws-ln">
          <span>Check-out</span>
          <span>{due ? 'Nov 15, 2026 · 11:00 AM' : 'Nov 15, 2026 · 11:00 AM'}</span>
        </div>
        <div className="ws-ln">
          <span>Room</span>
          <span>
            {spec.room} → ready for housekeeping
          </span>
        </div>
        {due && <L onClick={onTakePay}>Take payment first</L>}
        <Cb label="Email a receipt to priya@horizon.example" />
      </div>
    </PanelFrame>
  )
}

export function CreateInvPanel({ go }: { go: Go }) {
  return (
    <PanelFrame title="Create invoice" sub="Reservation #00032 · Priya Nair" onClose={() => go('cancel')} footer={<><Cancel go={go} /><Submit go={go}>Create and send</Submit></>}>
      <Box t="INV-00033 · Draft" s="For the POS charge on reservation #00032" />
      <F l="Bill to"><Sel value="Priya Nair · priya@horizon.example" /></F>
      <div className="ws-box" style={{ background: '#fff', border: '1px solid #e5e5e5', gap: 8 }}>
        <div className="ws-ln"><span>POS-1058 · Coffee, Grilled Beef Steak</span><span>$34.50</span></div>
        <div className="ws-ln"><span>Tax (10%)</span><span>$3.45</span></div>
        <hr className="ws-hr" />
        <div className="ws-ln b"><span>Total due</span><span>$37.95</span></div>
      </div>
      <F l="Due date"><DateIn value="Nov 15, 2026" /></F>
      <Cb label="Email the invoice to the guest" />
      <Cb label="Attach to the reservation record" />
    </PanelFrame>
  )
}

/** Take payment: full balance (W8), a partial amount (W19), the remainder (W22) or after check-out (W31) */
export function PayPanel({ go, mode, spec }: { go: Go; mode: 'full' | 'partial' | 'rest' | 'late'; spec: Spec }) {
  const total = Math.round(balance(spec) * 100) / 100
  const target = mode === 'partial' ? 20 : total
  const { values } = useTypedFields([target.toFixed(2)], { run: mode === 'partial', speed: 110, startDelay: 500 })
  const typed = mode === 'partial' ? values[0] : target.toFixed(2)
  const amt = Number(typed) || 0
  const sub =
    mode === 'full' ? 'POS-1058 · charged to room Nov 12' : mode === 'partial' ? `After this payment: ${money(Math.max(total - amt, 0))} still due on INV-00033` : mode === 'rest' ? 'INV-00033 · after $20.00 paid Nov 13' : 'INV-00033 · left open at check-out'
  return (
    <PanelFrame title="Take payment" sub="Reservation #00032 · Priya Nair" onClose={() => go('cancel')} footer={<><Cancel go={go} /><Submit go={go}>{`Take payment ${money(amt)}`}</Submit></>}>
      <div className="ws-box warn">
        <span className="l">Balance due</span>
        <span className="big">{money(total)}</span>
        <span className="l">{sub}</span>
      </div>
      <F l="Amount">
        <input className="ws-in" value={`$ ${typed}`} readOnly aria-label="Amount" />
      </F>
      {mode === 'full' && <L onClick={() => go('payPart')}>Pay part of the balance</L>}
      <F l="Payment method"><Sel value="Card on file · ending 4242" options={['Card on file · ending 4242', 'Cash', 'Bank transfer']} /></F>
      <F l="Reference (optional)"><input className="ws-in" placeholder="Add a reference…" aria-label="Reference" /></F>
      <Cb label="Email a receipt to priya@horizon.example" />
    </PanelFrame>
  )
}

export function InvoicePanel({ go, which, spec }: { go: Go; which: '32' | '33'; spec: Spec }) {
  const is33 = which === '33'
  const partial = spec.pays.length > 0 && balance(spec) > 0
  const bal = is33 ? posTotal - spec.pays.reduce((a, p) => a + p.amt, 0) : 0
  return (
    <PanelFrame
      title={`INV-000${which}`}
      sub="Reservation #00032 · Priya Nair"
      onClose={() => go('cancel')}
      footer={
        <>
          <Pill onClick={() => go('cancel')}>Close</Pill>
          {is33 && bal > 0 ? <Pill brand onClick={() => go('submit')}>{`Take payment ${money(bal)}`}</Pill> : <Pill brand>Download PDF</Pill>}
        </>
      }
    >
      <div className="ws-box warn">
        <span className="l">{is33 ? 'Balance due' : 'Balance'}</span>
        <span className="big">{money(is33 ? bal : 0)}</span>
        <span className="l">{is33 ? (partial ? `Partially paid · ${money(posTotal - bal)} of ${money(posTotal)} received` : `Unpaid · ${money(posTotal)}`) : 'Paid in full · Sep 24, 2026'}</span>
      </div>
      <div className="ws-set">
        <h3>Invoice</h3>
        <div className="ws-ln"><span className="ws-muted">Status</span><span className={`ws-badge ${is33 ? 'grey' : ''}`}>{is33 ? (partial ? 'Partially paid' : 'Sent') : 'Paid'}</span></div>
        <div className="ws-ln"><span>Bill to</span><span>Priya Nair</span></div>
        <div className="ws-ln"><span>Issued</span><span>{is33 ? 'Nov 13, 2026' : 'Sep 24, 2026'}</span></div>
        <div className="ws-ln"><span>{is33 ? 'Source' : 'Stay'}</span><span>{is33 ? 'POS-1058 · Nov 12, 2026' : 'Nov 12 – 15, 2026 · 3 nights'}</span></div>
        <h3>Charges</h3>
        <div className="ws-ln">
          <span>
            {is33 ? 'POS-1058 · Coffee, Grilled Beef Steak' : 'Standard Double Room'}
            <span className="s">{is33 ? 'Charged to room · Nov 12, 2026' : '3 nights × $140.00 · Group rate GBR-008'}</span>
          </span>
          <span>{is33 ? '$34.50' : '$420.00'}</span>
        </div>
        <div className="ws-ln">
          <span>
            Tax<span className="s">{is33 ? '10% on POS order' : '10% on room'}</span>
          </span>
          <span>{is33 ? '$3.45' : '$42.00'}</span>
        </div>
        <hr className="ws-hr" />
        <div className="ws-ln b"><span>Invoice total</span><span>{is33 ? money(posTotal) : '$462.00'}</span></div>
        <h3>Payments</h3>
        {is33 ? (
          partial ? (
            <div className="ws-ln">
              <span>
                Card ending 4242<span className="s">Nov 13, 2026 · 9:30 AM · Partial payment</span>
              </span>
              <span>$20.00</span>
            </div>
          ) : (
            <span className="ws-muted">No payments yet</span>
          )
        ) : (
          <div className="ws-ln">
            <span>
              Card ending 4242<span className="s">Sep 24, 2026 · Payment received</span>
            </span>
            <span>$462.00</span>
          </div>
        )}
        <hr className="ws-hr" />
        <div className="ws-ln"><span>Paid</span><span>{is33 ? (partial ? '$20.00' : '$0.00') : '$462.00'}</span></div>
        <div className="ws-ln b"><span>{is33 ? 'Balance due' : 'Balance'}</span><span>{money(is33 ? bal : 0)}</span></div>
      </div>
    </PanelFrame>
  )
}

/* ---------------------------------------------------------------- list (W0) */
const LIST: { no: string; contact: string; group: string; rooms: number; total: number; bal: number; status: string; warn?: boolean }[] = [
  { no: '#00036', contact: 'Tom Becker', group: '—', rooms: 1, total: 693, bal: 0, status: 'Confirmed' },
  { no: '#00035', contact: 'Marcus Webb', group: 'GBR-008', rooms: 1, total: 627, bal: 627, status: 'Pending Approval', warn: true },
  { no: '#00034', contact: 'Elena Rossi', group: 'GBR-008', rooms: 1, total: 462, bal: 0, status: 'Confirmed' },
  { no: '#00033', contact: 'Grace Liu', group: 'GBR-008', rooms: 1, total: 462, bal: 0, status: 'Confirmed' },
  { no: '#00032', contact: 'Priya Nair', group: 'GBR-008', rooms: 1, total: 462, bal: 0, status: 'Confirmed' },
  { no: '#00031', contact: 'Maya Thompson', group: 'GBR-008', rooms: 18, total: 16599, bal: 7293, status: 'Confirmed' },
]
const COLS: [string, number][] = [['Reservation', 130], ['Contact', 336], ['Group Block', 150], ['Start Date', 130], ['End Date', 130], ['Rooms', 80], ['Total', 130], ['Balance', 130], ['Status', 174]]

export function ReservationsList({ go }: { go: Go }) {
  return (
    <AdminPage>
      <GlobalNav active="Reservations" />
      <div className="lds-list-head">
        <div className="lds-record-title">
          <ObjectIcon size={40} color="#1b96ff" round name="log_event" sprite="action" />
          <div className="tx">
            <div style={{ fontSize: 13, color: '#5c5c5c' }}>Reservations</div>
            <div className="lds-view">
              <h1>All Reservations</h1>
            </div>
          </div>
        </div>
        <button className="slds-button slds-button_brand lds-btn-ic">
          <img src={asset('img/ic-add-white.svg')} width={14} height={14} alt="" />
          New Reservation
        </button>
      </div>
      <div className="lds-list-meta">6 items · Sorted by Reservation # · Updated a few seconds ago</div>
      <div className="slds-card lds-list-card">
        <div className="lds-list-tools">
          <div className="slds-form-element__control slds-input-has-icon slds-input-has-icon_left" style={{ width: 320 }}>
            <Icon name="search" className="slds-input__icon slds-input__icon_left" color="#2e2e2e" />
            <input className="slds-input" placeholder="Search this list..." aria-label="Search this list" />
          </div>
          <button className="slds-button slds-button_icon slds-button_icon-border-filled lds-tool" title="Refresh" style={{ marginLeft: 'auto' }}>
            <Icon name="refresh" size="x-small" color="#0250d9" />
          </button>
          <button className="slds-button slds-button_neutral lds-btn-ic">
            <img src={asset('img/ic-filters.svg')} width={14} height={14} alt="" />
            Filter
            <img src={asset('img/ic-caret-down.svg')} width={14} height={14} alt="" />
          </button>
        </div>
        <table className="slds-table slds-table_fixed-layout lds-list-table ws-list-tbl">
          <colgroup>
            {COLS.map(([, w]) => (
              <col key={w + COLS[0][0]} style={{ width: w }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {COLS.map(([h]) => (
                <th key={h} scope="col" style={{ textTransform: 'uppercase' }}>
                  <div className="slds-truncate">{h}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {LIST.map((r) => (
              <tr key={r.no} style={{ height: 48, cursor: r.no === '#00031' || r.no === '#00032' ? 'pointer' : 'default' }} onClick={r.no === '#00031' ? () => go('open31') : r.no === '#00032' ? () => go('open32') : undefined}>
                <td>
                  <a className="slds-text-link">{r.no}</a>
                </td>
                <td>{r.contact}</td>
                <td>{r.group === '—' ? '—' : <a className="slds-text-link">{r.group}</a>}</td>
                <td>Nov 12, 2026</td>
                <td>Nov 15, 2026</td>
                <td>{r.rooms}</td>
                <td>{money(r.total)}</td>
                <td>{money(r.bal)}</td>
                <td>
                  <Badge tone={r.warn ? 'warn' : 'mint'}>{r.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminPage>
  )
}

/* ---------------------------------------------------------------- group reservation #00031 (W14–W16) */
type GRoom = { type: string; img: string; guests: string[]; cap: number; net: number; tax: number; rate: string }
const G_ROOMS: GRoom[] = [
  { type: 'Standard Single Room', img: 'ws-room-single.png', guests: ['Maya Thompson'], cap: 1, net: 420, tax: 42, rate: '$140.00' },
  { type: 'Standard Single Room', img: 'ws-room-single.png', guests: ['Daniel Okafor'], cap: 1, net: 420, tax: 42, rate: '$140.00' },
  { type: 'Standard Single Room', img: 'ws-room-single.png', guests: [], cap: 1, net: 420, tax: 42, rate: '$140.00' },
  { type: 'Standard Double Room', img: 'ws-room-double.png', guests: ['Priya Nair · #00032'], cap: 2, net: 420, tax: 42, rate: '$140.00' },
  { type: 'Standard Double Room', img: 'ws-room-double.png', guests: ['Elena Rossi', 'Tom Becker'], cap: 2, net: 420, tax: 42, rate: '$140.00' },
  { type: 'Cabin', img: 'ws-room-cabin.png', guests: ['Aiko Tanaka', 'Luis Moreno'], cap: 2, net: 570, tax: 57, rate: '$190.00' },
  { type: 'Cabin', img: 'ws-room-cabin.png', guests: [], cap: 2, net: 570, tax: 57, rate: '$190.00' },
]
const G_EVENTS: View['events'] = [
  { dot: 'grey', title: 'Room assignments updated', sub: 'Oct 29, 2026 · 9:14 AM · Maya Thompson · 20 of 32 guests assigned' },
  { dot: 'grey', title: 'Guests invited · 12 secure links sent', sub: 'Oct 28, 2026 · 8:05 PM · Organizer portal' },
  { dot: 'grey', title: 'Secure link sent to Maya Thompson', sub: 'Sep 24, 2026 · Organizer portal' },
  { dot: 'teal', title: 'Deposit received · $9,306.00', sub: 'Sep 24, 2026 · Card ending 4242' },
  { dot: 'grey', title: 'Group reservation created from block GBR-008', sub: 'Sep 24, 2026 · 22 rooms for 32 guests' },
]

export function GroupPage({ go, panel, assigned }: { go: Go; panel?: ReactNode; assigned: boolean }) {
  const rooms = G_ROOMS.map((r, i) => (assigned && i === 3 ? { ...r, guests: [...r.guests, 'Noah Williams'] } : r))
  const n = assigned ? 21 : 20
  const jr = derive({ room: '201', rate: 140, room2: false, checkedIn: false, checkedOut: false, pos: false, inv: 'none', pays: [], roomChanged: false, rateChanged: false })
  const steps = jr.journey.steps.map((s) => (s.n === 2 ? { ...s, sub: '$9,306.00 · Sep 24' } : s))
  return (
    <WsShell panel={panel}>
      <section className="ws-card ws-head">
        <div className="col">
          <div className="bc">
            <L onClick={() => go('bc')}>Reservations</L>
            <Icon name="chevronright" size="xx-small" />
          </div>
          <div className="tr">
            <h1>#00031</h1>
            <StatusBadge s="Confirmed" />
          </div>
          <div className="sm">
            <L>Maya Thompson</L>
            <span>· 22 rooms · 32 guests · Nov 12 – 15, 2026 · 3 nights · Group Block</span>
            <L>GBR-008</L>
          </div>
        </div>
        <div className="ws-acts">
          <Pill>Add note</Pill>
          <Pill>Create invoice</Pill>
          <Pill brand>Check in</Pill>
        </div>
      </section>
      <Journey v={{ ...jr, journey: { next: 'Next step: assign 32 guests to 22 rooms', steps } }} />
      <Strip
        cells={[
          ['Grand total', '$18,612.00', 'Rooms and add-ons $16,920.00 + tax $1,692.00'],
          ['Paid', '$9,306.00', 'Deposit 50% · Sep 24'],
          ['Balance due', '$9,306.00', 'Due Nov 12, 2026'],
          ['Invoices', 'INV-00031', 'Sent Sep 24, 2026'],
        ]}
      />
      <div className="ws-main">
        <div className="ws-left">
          <section className="ws-card ws-sec">
            <div className="hd">
              <h2>Rooms and guests (22)</h2>
              <Pill>Add room</Pill>
            </div>
            <div className="bd">
              <div className="ws-muted" style={{ marginTop: -4 }}>
                32 guests · 22 rooms · <span className="fx" key={n}>{n} assigned · {32 - n} still to assign</span> <L onClick={() => go('assign')}>Assign guests</L>
              </div>
              {rooms.map((r, i) => (
                <div className="ws-row" key={i}>
                  <div className="ws-room">
                    <img src={asset(`img/${r.img}`)} alt="" />
                    <div className="tx">
                      <span className="t">{r.type}</span>
                      <span className="ws-muted">
                        Nov 12 – 15, 2026 · 3 nights · Guests {r.guests.length} / {r.cap}
                      </span>
                      {r.guests.length === 0 ? <span className="ws-muted">Group rate · {r.rate} per night</span> : <span className="ws-muted">Guests: {r.guests.join(', ')}</span>}
                      {r.guests.length < r.cap && <L onClick={() => go('assign')}>Assign guest</L>}
                    </div>
                  </div>
                  <div className="ws-price">
                    <b>{money(r.net)}</b>
                    <span>+Tax {money(r.tax)}</span>
                  </div>
                </div>
              ))}
              <div className="ws-muted">
                Showing 7 of 22 rooms · <L>View all</L>
              </div>
            </div>
          </section>
          <section className="ws-card ws-sec">
            <div className="hd">
              <h2>Add-ons and charges</h2>
              <Pill>Add item</Pill>
            </div>
            <div className="bd">
              <div className="ws-row">
                <div className="ws-room">
                  <img src={asset('img/food-1.png')} alt="" style={{ width: 48, height: 48 }} />
                  <div className="tx">
                    <span className="t">Group Catering (per guest-day)</span>
                    <span className="ws-muted">Nov 12 – 14, 2026 · 96 guest-days · Per person</span>
                  </div>
                </div>
                <div className="ws-price">
                  <b>$5,280.00</b>
                  <span>+Tax $528.00</span>
                </div>
              </div>
            </div>
          </section>
          <section className="ws-card ws-sec">
            <div className="hd">
              <h2>Billing</h2>
              <Pill>Take payment</Pill>
            </div>
            <div className="bd">
              <div className="ws-bill">
                <div className="c">
                  <div className="k">
                    <span className="l">Contact</span>
                    <L>Maya Thompson</L>
                  </div>
                  <div className="k">
                    <span className="l">Email</span>
                    <span>maya.thompson@horizon.example</span>
                  </div>
                  <L>Change contact</L>
                </div>
                <div className="c">
                  <div className="k">
                    <span className="l">Invoice</span>
                    <L>INV-00031</L>
                    <span className="s">Sent Sep 24, 2026</span>
                  </div>
                </div>
                <div className="c">
                  <div className="k">
                    <span className="l">Payments</span>
                    <span>$9,306.00 paid</span>
                    <span className="s">Deposit 50% · Sep 24, 2026</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <Activity events={G_EVENTS} />
      </div>
    </WsShell>
  )
}

export function AssignPanel({ go }: { go: Go }) {
  const { values } = useTypedFields(['Noah Williams'], { speed: 70, startDelay: 600 })
  return (
    <PanelFrame title="Assign guests" sub="Standard Double Room · 2 guests max" onClose={() => go('cancel')} footer={<><Cancel go={go} /><Submit go={go}>Assign guest</Submit></>}>
      <Box t="Group reservation #00031 · Maya Thompson" s="32 guests · 22 rooms · 20 assigned" />
      <F l="Room"><Dis value="Standard Double Room · 1 of 2 guests assigned" /></F>
      <F l="Guest 1"><Sel value="Priya Nair · #00032" /></F>
      <F l="Guest 2">
        <input className="ws-in" value={values[0]} placeholder="Search or add a guest…" readOnly aria-label="Guest 2" />
      </F>
      <Cb label="Send the guest portal link by email" />
      <Sum l="Room occupancy" r="2 of 2 guests after saving" />
    </PanelFrame>
  )
}
