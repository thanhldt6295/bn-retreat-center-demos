import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ActionButton } from '../../components/shared/ActionButton'
import { afterGuestBookings, agenda, group, money, quote } from '../../data/demo'
import { usePrimary, type SceneProps } from '../../player/Player'
import { SecureEmail } from './Organizer'
import { Pill, Qr, SumLine } from './ui'
import './mobile.css'

/* Phone segment (390 wide): organizer MO0–MO7 (Figma 306:2879), guest M1–M4 (Figma 292:489). */
const ORG_TABS = ['Overview', 'Rooms', 'Guests', 'Documents', 'Invoices', 'Schedule & meals', 'Invite guests']
const ORG_STEP: Record<string, string> = { Overview: 'MO1', Rooms: 'MO2', Guests: 'MO3', Documents: 'MO4', Invoices: 'MO5', 'Schedule & meals': 'MO6', 'Invite guests': 'MO7' }
const G_TABS = ['My stay', 'Room', 'Payment', 'Schedule', 'Documents', 'Charges', 'Add-ons']
const G_STEP: Record<string, string> = { 'My stay': 'M1', 'Add-ons': 'M2', Charges: 'M3' }

function Phone({ tabs, active, onTab, children }: { tabs: string[]; active: string; onTab?: (t: string) => void; children: ReactNode }) {
  const bar = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = bar.current?.querySelector<HTMLElement>('.on')
    if (el && bar.current) bar.current.scrollLeft = Math.max(0, el.offsetLeft - 16)
  }, [active])
  return (
    <div className="mb">
      <div className="mb-top">
        <b>CEDAR VALLEY</b>
        <span className="g-pill">Secure link</span>
      </div>
      <div className="mb-tabs" ref={bar}>
        {tabs.map((t) => (
          <button key={t} className={t === active ? 'on' : ''} onClick={() => onTab?.(t)}>
            {t}
          </button>
        ))}
      </div>
      <div className="mb-body">{children}</div>
    </div>
  )
}
const Card = ({ title, right, children, flush }: { title?: string; right?: ReactNode; children: ReactNode; flush?: boolean }) => (
  <div className="g-card mb-card">
    {title && (
      <div className="h">
        <span>{title}</span>
        {right}
      </div>
    )}
    <div className={flush ? '' : 'b'}>{children}</div>
  </div>
)
const Stats = ({ items }: { items: [string, ReactNode, string, ReactNode?][] }) => (
  <div className="mb-stats">
    {items.map(([a, b, c, d]) => (
      <div className="g-card" key={a}>
        <b>{a}</b>
        <strong>{b}</strong>
        <span>{c}</span>
        {d}
      </div>
    ))}
  </div>
)
const H = ({ t, s }: { t: string; s?: string }) => (
  <div className="mb-h">
    <h1>{t}</h1>
    {s && <p>{s}</p>}
  </div>
)

/* ---- organizer ---- */
export const MO0 = ({ goto }: SceneProps) => (
  <div className="mb mb-email">
    <SecureEmail
      subject="Your event portal is open for rooms and guests"
      hi="Hi Maya,"
      lead="Your booking is confirmed. Use the same private link as before to assign rooms, invite guests and see invoices, documents and the schedule. No account or password is needed."
      cta="Open event portal"
      link="cedarvalley.example/portal/o/HZN-7Q4M-2K9X"
      can={['Group overview', 'Room allocation and guest list', 'BEO and contract', 'Invoices, deposit and balance', 'Schedule and meals', 'Share the group code and invite guests']}
      onOpen={() => goto('MO1')}
    />
  </div>
)

export function MOrg({ step, goto, next }: SceneProps) {
  const active = ORG_TABS.find((t) => ORG_STEP[t] === step) ?? 'Overview'
  usePrimary(step !== 'MO7' ? () => next() : null)
  const room = (r: string, n: string, e: string, pay: string, pill: string, tone: 'mint' | 'cream' | 'amber', act: string, dietary?: string) => (
    <div className="mb-li" key={n + r}>
      <div className="t">
        {dietary === undefined ? <small>{r}</small> : <b className="nm">{n}</b>}
        <Pill t={pill} tone={tone} />
      </div>
      {dietary === undefined && <b className="nm">{n}</b>}
      <span>{e}</span>
      {dietary !== undefined && <span className="d">{r} · {pay}</span>}
      <div className="f">
        <span>{dietary === undefined ? pay : `Dietary: ${dietary}`}</span>
        <i>{act}</i>
      </div>
    </div>
  )
  return (
    <Phone tabs={ORG_TABS} active={active} onTab={(t) => goto(ORG_STEP[t])}>
      {step === 'MO1' && (
        <>
          <H t={group.name} />
          <div className="mb-line">
            <Pill t="Confirmed" /> <span>GBR-008 · Nov 12 – 15, 2026</span>
          </div>
          <Stats
            items={[
              ['Dates', 'Nov 12 – 15', '3 nights'],
              ['Rooms', '22', '7 assigned (1 pending approval) · 15 open', <button key="b" className="g-btn small" onClick={() => goto('MO2')}>Assign rooms</button>],
              ['Balance due', money(afterGuestBookings.balance), 'Due Nov 05, 2026', <button key="c" className="g-btn small yellow" onClick={() => goto('MO5')}>Pay now</button>],
              ['Meals', '96', 'guest-days · 32 guests'],
            ]}
          />
          <Card title="To do" flush>
            {[
              ['Assign your remaining 15 rooms', 'Add guests, or share the group code so they can book and pay themselves.', 'Go to rooms'],
              ['Pay the balance by Nov 05', `INV-00031 · Balance ${money(afterGuestBookings.balance)}`, 'Pay now'],
              ['Confirm dietary needs for the group dinner', 'Fri, Nov 13 · 6:30 PM · Dining Hall', 'Add details'],
            ].map(([a, b, c], i) => (
              <div className="mb-todo" key={a}>
                <span className="c" />
                <div>
                  <b>{a}</b>
                  <span>{b}</span>
                  <button className={`g-btn small ${i === 1 ? 'yellow' : ''}`}>{c}</button>
                </div>
              </div>
            ))}
          </Card>
          <Card title="Next on the schedule" flush>
            {agenda.map((a) => (
              <div className="mb-sch" key={a.n}>
                <small>
                  {a.day} · {a.start.replace(/^0/, '')}
                </small>
                <b>{a.name}</b>
                <span>{a.location}</span>
              </div>
            ))}
          </Card>
        </>
      )}
      {step === 'MO2' && (
        <>
          <H t="Assign your rooms" s="Unassigned rooms are released on Oct 30, 2026." />
          <div className="mb-btns">
            <button className="g-btn small yellow">Add guest</button>
            <button className="g-btn small">Auto-assign</button>
            <button className="g-btn small">Import</button>
          </div>
          <Stats
            items={[
              ['Rooms in your block', '22', '12 single bed · 10 double bed'],
              ['Confirmed', '6', '3 paid by you · 3 paid by guests'],
              ['Waiting for guests', '1', 'Invitation sent'],
              ['Still open', '15', 'Add a guest or share the code'],
            ]}
          />
          <Card title="Rooms" flush>
            {room('Standard Single Room', 'Maya Thompson', 'maya.thompson@horizon.example', 'Organizer pays', 'Confirmed', 'mint', 'Change')}
            {room('Standard Single Room', 'Daniel Okafor', 'daniel.okafor@horizon.example', 'Organizer pays', 'Confirmed', 'mint', 'Change')}
            {room('Standard Single Room', 'Elena Rossi', 'elena.rossi@horizon.example', 'Guest pays', 'Paid', 'mint', 'View')}
            {room('Standard Single Room', 'Not assigned', '', '—', 'Open', 'cream', 'Add guest')}
            {room('Standard Double Room', 'Grace Liu', 'grace.liu@horizon.example', 'Guest pays', 'Paid', 'mint', 'View')}
          </Card>
        </>
      )}
      {step === 'MO3' && (
        <>
          <H t="Guest list" s="Everyone staying with your group and how they are paying." />
          <div className="mb-btns">
            <button className="g-btn small yellow">Add guest</button>
            <button className="g-btn small">Import list</button>
            <button className="g-btn small">Export</button>
          </div>
          <div className="mb-chips">
            {['All 7', 'Confirmed 3', 'Invited 1', 'Paid 3'].map((c, i) => (
              <button key={c} className={i === 0 ? 'on' : ''}>
                {c}
              </button>
            ))}
          </div>
          <Card flush>
            {room('Standard Single Room', 'Maya Thompson', 'maya.thompson@horizon.example · Organizer', 'Organizer pays', 'Confirmed', 'mint', 'Change', '—')}
            {room('Standard Single Room', 'Daniel Okafor', 'daniel.okafor@horizon.example', 'Organizer pays', 'Confirmed', 'mint', 'Change', '—')}
            {room('Standard Single Room', 'Elena Rossi', 'elena.rossi@horizon.example', 'Guest pays', 'Paid', 'mint', 'View', 'Vegetarian')}
            {room('Standard Double Room', 'Grace Liu', 'grace.liu@horizon.example', 'Guest pays', 'Paid', 'mint', 'View', 'Gluten-free')}
          </Card>
        </>
      )}
      {step === 'MO4' && (
        <>
          <H t="Documents" s="Everything signed or shared for the retreat." />
          {[
            ['Banquet Event Order (BEO)', 'Version 2 · Sep 12, 2026', 'Final', ['View', 'Download']],
            ['Contract', 'Signed electronically · Sep 22, 2026', 'Signed', ['View', 'Download']],
            ['Event agenda', 'Updated Oct 02, 2026', 'Shared', ['Download']],
            ['Group Block approval', 'GBR-008 · Quote and booking confirmation', 'Confirmed', ['View']],
          ].map(([a, b, c, d]) => (
            <div className="g-card mb-doc" key={a as string}>
              <div className="th">
                <i />
                <i />
                <i />
              </div>
              <div>
                <b>{a as string}</b>
                <span>{b as string}</span>
                <Pill t={c as string} />
                <div className="bt">
                  {(d as string[]).map((x, i) => (
                    <button key={x} className={`g-btn small ${i === 0 && x === 'View' ? 'yellow' : ''}`}>
                      {x}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </>
      )}
      {step === 'MO5' && (
        <>
          <H t="Invoices and payments" s="Payments for the venue, rooms and meals booked by the organizer." />
          <Card title="Summary">
            <SumLine k="Rooms" v={money(quote.roomsTotal)} />
            <SumLine k="Meeting Hall and catering" v={money(quote.addOnsTotal)} />
            <SumLine k="Taxes (10%)" v={money(quote.tax)} />
            <SumLine k="Credit: rooms paid by guests" v={`−${money(afterGuestBookings.credit)}`} />
            <SumLine k="Total" v={money(afterGuestBookings.total)} bold />
            <SumLine k="Paid" v={money(quote.deposit)} />
            <SumLine k="Balance due" v={money(afterGuestBookings.balance)} bold />
            <button className="g-btn yellow block">Pay balance {money(afterGuestBookings.balance)}</button>
          </Card>
          <Card title="Invoices" flush>
            <div className="mb-inv">
              <div className="t">
                <b>INV-00031 · Deposit (50%)</b>
                <Pill t="Paid" />
              </div>
              <strong>{money(quote.deposit)}</strong>
              <div className="f">
                <span>Sep 22, 2026</span>
                <button className="g-btn small">Receipt</button>
              </div>
            </div>
            <div className="mb-inv">
              <div className="t">
                <b>INV-00031 · Balance after credits</b>
                <Pill t="Due" tone="amber" />
              </div>
              <strong>{money(afterGuestBookings.balance)}</strong>
              <div className="f">
                <span>Due Nov 05, 2026</span>
                <button className="g-btn small yellow">Pay now</button>
              </div>
            </div>
          </Card>
          <Card title="Payment method">
            <b style={{ fontSize: 13 }}>Card · Visa ending 4242</b>
            <span style={{ fontSize: 12, color: '#69716c' }}>Used for the deposit on Sep 22, 2026</span>
            <div>
              <button className="g-btn small">Change card</button>
            </div>
          </Card>
        </>
      )}
      {step === 'MO6' && (
        <>
          <H t="Schedule and meals" s="What happens each day, and the meal counts for the venue team." />
          <button className="g-btn yellow block">Update meal counts</button>
          <Card title="Schedule" flush>
            {[
              ['Thu, Nov 12 · 3:00 – 5:00 PM', 'Arrival and check-in', 'Main Lodge Lobby · 32 guests'],
              ['Fri, Nov 13 · 9:00 AM – 5:00 PM', 'Leadership sessions', 'Meeting Hall · 32 guests'],
              ['Fri, Nov 13 · 6:30 – 8:30 PM', 'Group dinner', 'Dining Hall · 32 guests'],
              ['Sat, Nov 14 · 10:00 AM – 12:00 PM', 'Closing workshop', 'Meeting Hall · 32 guests'],
              ['Sun, Nov 15 · By 11:00 AM', 'Check-out', 'Main Lodge Lobby · 32 guests'],
            ].map(([a, b, c]) => (
              <div className="mb-sch" key={a}>
                <small>{a}</small>
                <b>{b}</b>
                <span>{c}</span>
              </div>
            ))}
          </Card>
          <Card title="Meals" flush>
            {[
              ['Breakfast', 'Fri, Nov 13 · 7:30 AM · 32 guests', 'Dietary: 2 gluten-free', 'Confirmed', 'mint'],
              ['Lunch', 'Fri, Nov 13 · 12:30 PM · 32 guests', 'Dietary: 4 vegetarian', 'Confirmed', 'mint'],
              ['Group dinner', 'Fri, Nov 13 · 6:30 PM · 32 guests', 'Dietary: 4 vegetarian, 2 gluten-free', 'Needs details', 'amber'],
            ].map(([a, b, c, d, t]) => (
              <div className="mb-li" key={a}>
                <div className="t">
                  <b className="nm">{a}</b>
                  <Pill t={d} tone={t as 'mint' | 'amber'} />
                </div>
                <span>{b}</span>
                <span>{c}</span>
              </div>
            ))}
          </Card>
        </>
      )}
      {step === 'MO7' && (
        <>
          <H t="Invite guests" s="Share the group code, or send invitations for rooms you already assigned." />
          <Card title="Share your group code">
            <p className="mb-p">Guests who prefer to book and pay for their own room enter this code on the booking page.</p>
            <div className="mb-code">{group.code}</div>
            <div className="mb-box">cedarvalley.example/book?code={group.code}</div>
            <button className="g-btn yellow block">Copy link</button>
            <button className="g-btn block">Copy code</button>
            <span style={{ fontSize: 12, color: '#06503f', fontWeight: 600 }}>7 of 22 rooms are taken · 15 still open</span>
          </Card>
          <Card title="Send invitations">
            <b style={{ fontSize: 12 }}>Recipients</b>
            <div className="mb-rec">
              <span>Elena Rossi</span>
              <span>Marcus Webb</span>
              <i>+ Add email</i>
            </div>
            <b style={{ fontSize: 12 }}>Message</b>
            <div className="mb-box">Hi! I reserved a room for you at the Horizon Foundation retreat. Use your private link to confirm the room and pay at the group rate.</div>
            <ActionButton className="g-btn yellow block" primary loadingMs={1000} onDone={() => next()}>
              Send 2 invitations
            </ActionButton>
            <button className="g-btn block">Preview e-mail</button>
          </Card>
        </>
      )}
    </Phone>
  )
}

/* ---- guest ---- */
export function MGuest({ step, goto, next }: SceneProps) {
  const active = step === 'M1' ? 'My stay' : step === 'M2' ? 'Add-ons' : step === 'M3' ? 'Charges' : 'My stay'
  const [added, setAdded] = useState(step === 'M2')
  usePrimary(step !== 'M2' && step !== 'M4' ? () => next() : null)
  return (
    <Phone tabs={G_TABS} active={active} onTab={(t) => G_STEP[t] && goto(G_STEP[t])}>
      {step === 'M1' && (
        <>
          <H t="Welcome, Priya" />
          <div className="mb-line">
            <Pill t="Confirmed" />
          </div>
          <span className="mb-sub">Standard Double Room · Nov 12 – 15, 2026</span>
          <Card>
            <SumLine k="Room" v="Standard Double" />
            <SumLine k="Check-in" v="Thu, Nov 12 · from 3:00 PM" />
            <SumLine k="Check-out" v="Sun, Nov 15 · by 11:00 AM" />
            <SumLine k="Reservation" v="#00032" />
          </Card>
          <Card>
            <div className="mb-pass">
              <div className="q">
                <Qr size={84} />
              </div>
              <div>
                <b>Check-in pass</b>
                <span>Show it at the front desk on Nov 12.</span>
                <button className="g-btn small" onClick={() => goto('M4')}>
                  Show pass
                </button>
              </div>
            </div>
          </Card>
          <Card>
            <b style={{ fontSize: 15 }}>Your charges</b>
            <SumLine k="Stay (paid at booking)" v={money(462)} />
            <SumLine k="Balance due" v="$0.00" bold />
          </Card>
        </>
      )}
      {step === 'M2' && (
        <>
          <H t="Add-ons" />
          <div className="mb-chips">
            {['Activities', 'Meals', 'Shuttle'].map((c, i) => (
              <button key={c} className={i === 0 ? 'on' : ''}>
                {c}
              </button>
            ))}
          </div>
          {[
            ['Guided Forest Walk', 'Fri, Nov 13 · 9:00 AM', 'Included', 'mint'],
            ['Evening Campfire', 'Sat, Nov 14 · 8:00 PM', 'Included', 'mint'],
            ['Spa massage', 'Sat, Nov 14 · 2:00 PM', '$80.00', 'cream'],
          ].map(([a, b, c, t], i) => (
            <div key={a} className={`g-card mb-add ${i === 0 && added ? 'on' : ''}`}>
              <div>
                <b>{a}</b>
                <span>{b}</span>
                <Pill t={c} tone={t as 'mint' | 'cream'} />
              </div>
              <button className={`g-btn small ${i === 0 && added ? 'yellow' : ''}`} onClick={() => i === 0 && setAdded((x) => !x)}>
                {i === 0 && added ? 'Added' : 'Add'}
              </button>
            </div>
          ))}
          <div className="g-card mb-cart">
            <div className="l">
              <span>Cart · {added ? 3 : 2} items</span>
              <span>Due today $0.00</span>
            </div>
            <ActionButton className="g-btn yellow block" primary loadingMs={1000} onDone={() => next()}>
              Send {added ? 3 : 2} requests
            </ActionButton>
          </div>
        </>
      )}
      {step === 'M3' && (
        <>
          <H t="Your charges" s="Items from your stay and what your group pays." />
          <Card flush>
            {[
              ['Standard Double Room · 3 nights', 'Stay', '$420.00', 'Paid', 'mint'],
              ['Tax on stay (10%)', 'Stay', '$42.00', 'Paid', 'mint'],
              ['Group meals and meeting hall', 'Group', 'Included', 'Paid by Horizon', 'cream'],
              ['Guided Forest Walk', 'Add-on', 'Included', 'Confirmed', 'mint'],
            ].map(([a, b, c, d, t]) => (
              <div className="mb-chg" key={a}>
                <div>
                  <b>{a}</b>
                  <span>{b}</span>
                </div>
                <div className="r">
                  <b>{c}</b>
                  <Pill t={d} tone={t as 'mint' | 'cream'} />
                </div>
              </div>
            ))}
          </Card>
          <Card>
            <SumLine k="Total" v={money(462)} bold />
            <SumLine k="Paid" v={money(462)} />
            <SumLine k="Balance due" v="$0.00" bold />
            <button className="g-btn yellow block">Download receipt</button>
          </Card>
        </>
      )}
      {step === 'M4' && (
        <div className="mb-qr">
          <h2>Show this at the front desk</h2>
          <div className="g-card">
            <Qr size={260} />
            <b>CV-0412</b>
          </div>
          <strong>Priya Nair</strong>
          <span>Standard Double Room · Nov 12 – 15, 2026</span>
          <ActionButton className="g-btn yellow" loadingMs={800} primary onDone={() => next()}>
            Add to wallet
          </ActionButton>
        </div>
      )}
    </Phone>
  )
}
