import { useState } from 'react'
import { ActionButton } from '../../components/shared/ActionButton'
import { group, money } from '../../data/demo'
import { asset } from '../../lib/asset'
import { usePrimary, type SceneProps } from '../../player/Player'
import { DocGrid, GuestShell, SecureEmail } from './Organizer'
import { Card, Head, KV, Page, Pill, Qr, Stat, SumLine, Table, Link } from './ui'

export const U0 = ({ goto }: SceneProps) => (
  <SecureEmail
    mail={{ box: { name: 'Priya Nair', role: 'Guest', email: 'priya@horizon.example' }, subject: 'Your stay portal is ready', from: { name: 'Cedar Valley Retreat & Conference Center', email: 'retreats@cedarvalley.example' }, date: 'Sep 24, 2026', snippet: 'Use this private link to see your room, schedule and charges.' }}
    subject="Your stay portal is ready"
    hi="Hi Priya,"
    lead="Use this private link to see your room, schedule, documents and charges, and to add activities. No account or password is needed: the link is unique to you."
    cta="Open my stay"
    link="cedarvalley.example/portal/g/PN-3C8F-91AB"
    can={['My stay and room', 'Payment and receipt', 'Schedule and documents', 'Charges', 'Activities, meals, shuttle and extras']}
    onOpen={() => goto('U1')}
  />
)

/* ---------- U1 my stay (Figma 273:272) ---------- */
export function U1({ goto }: SceneProps) {
  usePrimary(() => goto('U2'))
  return (
    <GuestShell active="My stay" goto={goto}>
      <Page>
        <Head title="Welcome, Priya" sub={`Standard Double Room · Nov 12 – Nov 15, 2026 · ${group.org}`} right={<Pill t="Confirmed" />} rightBottom />
        <div className="pt-stats">
          <Stat label="Room" value="Standard Double" sub="Room number at check-in" />
          <Stat label="Check-in" value="Thu, Nov 12" sub="From 3:00 PM" />
          <Stat label="Check-out" value="Sun, Nov 15" sub="By 11:00 AM" />
          <Stat label="Reservation" value="#00032" sub="Group GBR-008" />
        </div>
        <div className="pt-cards">
          <Card title="Your charges" right={<Pill t="Paid in full" />} style={{ flex: 1 }} flush>
            <div className="pt-card-b" style={{ gap: 8, alignItems: 'flex-start' }}>
              <SumLine k="Stay (paid at booking)" v={money(462)} />
              <SumLine k="Group meals and meeting hall" v="Included" />
              <div className="pt-sl bold" style={{ width: '100%', margin: '4px 0' }}>
                <span style={{ fontSize: 14 }}>Balance due</span>
                <span style={{ fontSize: 20 }}>$0.00</span>
              </div>
              <button className="g-btn small" onClick={() => goto('U6')}>
                View charges
              </button>
            </div>
          </Card>
          <Card title="Your check-in pass" style={{ width: 444, flex: 'none' }} flush>
            <div className="pt-card-b" style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
              <div className="pt-qr">
                <Qr size={72} />
                CV-0412
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 12, color: '#69716c' }}>Show this pass at the front desk on Nov 12 to check in.</span>
                <button className="g-btn small">Show pass</button>
              </div>
            </div>
          </Card>
        </div>
      </Page>
    </GuestShell>
  )
}

/* ---------- U2 room (Figma 280:819) ---------- */
export function U2({ goto }: SceneProps) {
  return (
    <GuestShell active="Room" goto={goto} wide>
      <Page wide>
        <Head title="Your room" sub="Your room is confirmed. The room number is assigned at check-in." right={<Pill t="Confirmed" className="pt-pill-r" />} rightBottom />
        <div className="pt-cards">
          <div className="g-card" style={{ width: 640, flex: 'none' }}>
            <img src={asset('img/room-double.png')} alt="" style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }} />
            <div className="pt-card-b" style={{ gap: 14, padding: '20px 24px 22px' }}>
              <b style={{ fontSize: 20 }}>Standard Double Room</b>
              <div className="gf-grid">
                <KV label="Dates">Nov 12 – Nov 15, 2026 · 3 nights</KV>
                <KV label="Bed">1 double bed · up to 2 guests</KV>
                <KV label="Room number">Assigned at check-in</KV>
                <KV label="Group">Horizon Foundation · GBR-008</KV>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="g-btn small">Ask for a room change</button>
                <button className="g-btn small" onClick={() => goto('U1')}>
                  Show my check-in pass
                </button>
              </div>
            </div>
          </div>
          <Card title="About your room" style={{ width: 444, flex: 'none' }} flush>
            <div className="pt-card-b" style={{ gap: 12 }}>
              <KV label="Who reserved it">
                <span style={{ fontWeight: 400, color: '#69716c', fontSize: 12 }}>You booked with the group code GBR-008.</span>
              </KV>
              <KV label="Check-in">
                <span style={{ fontWeight: 400, color: '#69716c', fontSize: 12 }}>Thu, Nov 12 from 3:00 PM at the Main Lodge Lobby.</span>
              </KV>
              <KV label="Need something else?">
                <span style={{ fontWeight: 400, color: '#69716c', fontSize: 12 }}>Ask for a room change and the venue team will reply.</span>
              </KV>
            </div>
          </Card>
        </div>
      </Page>
    </GuestShell>
  )
}

/* ---------- U3 payment (Figma 280:912) ---------- */
export function U3({ goto }: SceneProps) {
  return (
    <GuestShell active="Payment" goto={goto} wide>
      <Page wide>
        <Head title="Payment" sub="Your room is paid in full." right={<Pill t="Paid" className="pt-pill-r" />} rightBottom />
        <div className="pt-cards">
          <Card title="Payments" flush style={{ width: 804, flex: 'none' }}>
            <Table
              rowH={56}
              cols={[{ h: 'Date', w: 100 }, { h: 'Method', w: 144 }, { h: 'For', w: 156 }, { h: 'Amount', w: 85 }, { h: '' }]}
              rows={[
                [
                  'Sep 24, 2026',
                  'Card · Visa ending 4242',
                  'Standard Double Room · 3 nights',
                  money(462),
                  <span key="a" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Link>Download</Link>
                    <Link>Receipt</Link>
                  </span>,
                ],
              ]}
            />
          </Card>
          <div style={{ width: 380, flex: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Card title="Summary" flush>
              <div className="pt-card-b" style={{ gap: 8 }}>
                <SumLine k="$140.00 × 3 nights" v={money(420)} />
                <SumLine k="Taxes (10%)" v={money(42)} />
                <SumLine k="Total" v={money(462)} bold />
                <SumLine k="Paid" v={money(462)} />
                <SumLine k="Balance due" v="$0.00" bold />
              </div>
            </Card>
            <Card title="Payment method" flush>
              <div className="pt-card-b">
                <b style={{ fontSize: 13 }}>Card · Visa ending 4242</b>
                <span style={{ fontSize: 12, color: '#69716c' }}>Charges made during your stay can be settled at check-out.</span>
              </div>
            </Card>
          </div>
        </div>
      </Page>
    </GuestShell>
  )
}

/* ---------- U4 schedule (Figma 273:371) ---------- */
export function U4({ goto }: SceneProps) {
  return (
    <GuestShell active="Schedule" goto={goto}>
      <Page>
        <Head title="Schedule" sub="The group’s plan for each day." right={<button className="g-btn">Add to calendar</button>} />
        <Card title={group.name} flush>
          <Table
            rowH={36}
            cols={[{ h: 'Day', w: 107 }, { h: 'Time', w: 150 }, { h: 'Session', w: 354 }, { h: 'Location' }]}
            rows={[
              ['Thu, Nov 12', '3:00 – 5:00 PM', 'Arrival and check-in', 'Main Lodge Lobby'],
              ['Fri, Nov 13', '7:30 AM', 'Breakfast', 'Dining Hall'],
              ['Fri, Nov 13', '9:00 AM – 5:00 PM', 'Leadership sessions', 'Meeting Hall'],
              ['Fri, Nov 13', '6:30 – 8:30 PM', 'Group dinner', 'Dining Hall'],
              ['Sat, Nov 14', '10:00 AM – 12:00 PM', 'Closing workshop', 'Meeting Hall'],
              ['Sun, Nov 15', 'By 11:00 AM', 'Check-out', 'Main Lodge Lobby'],
            ]}
          />
        </Card>
      </Page>
    </GuestShell>
  )
}

/* ---------- U5 documents (Figma 273:487) ---------- */
export function U5({ goto }: SceneProps) {
  return (
    <GuestShell active="Documents" goto={goto}>
      <Page>
        <Head title="Documents" sub="Your confirmation, receipt and signed forms." />
        <DocGrid
          items={[
            { title: 'Booking confirmation', sub: 'Reservation #00032', pill: ['Ready', 'mint'], buttons: [['View', true], ['Download', false]] },
            { title: 'Receipt', sub: 'Paid $462.00 · Sep 24, 2026', pill: ['Paid', 'mint'], buttons: [['Download', false]] },
            { title: 'Stay waiver', sub: 'Sign at check-in on Nov 12', pill: ['At check-in', 'amber'], buttons: [['View', true]] },
            { title: 'Retreat information', sub: 'Schedule and house rules from your organizer', pill: ['Shared', 'mint'], buttons: [['View', true]] },
          ]}
        />
      </Page>
    </GuestShell>
  )
}

/* ---------- U6 charges (Figma 273:599) ---------- */
export function U6({ goto }: SceneProps) {
  return (
    <GuestShell active="Charges" goto={goto}>
      <Page>
        <Head title="Your charges" sub="What is on your stay, and what is paid by your group." right={<button className="g-btn yellow">Download receipt</button>} />
        <div className="pt-cards">
          <Card title="Charges" flush style={{ width: 724, flex: 'none' }}>
            <Table
              rowH={44}
              cols={[{ h: 'Date', w: 78 }, { h: 'Description', w: 115 }, { h: 'From', w: 107 }, { h: 'Amount', w: 92 }, { h: 'Status' }]}
              rows={[
                ['Nov 12', 'Standard Double Room · 3 nights', 'Stay', money(420), <Pill key="a" t="Paid" />],
                ['Nov 12', 'Tax on stay (10%)', 'Stay', money(42), <Pill key="b" t="Paid" />],
                ['Nov 12', 'Group meals and meeting hall', 'Group', 'Included', <Pill key="c" t="Paid by Horizon" tone="cream" />],
                ['Oct 28', 'Guided Forest Walk (activity)', 'Add-ons', 'Included', <Pill key="d" t="Confirmed" tone="cream" />],
              ]}
            />
          </Card>
          <Card title="Summary" flush style={{ flex: 1 }}>
            <div className="pt-card-b" style={{ gap: 8 }}>
              <SumLine k="Stay" v={money(462)} />
              <SumLine k="Add-ons" v="$0.00" />
              <SumLine k="Total" v={money(462)} bold />
              <SumLine k="Paid" v={money(462)} />
              <SumLine k="Balance due" v="$0.00" bold />
              <span style={{ fontSize: 11, color: '#69716c' }}>Charges made during your stay will appear here.</span>
            </div>
          </Card>
        </div>
      </Page>
    </GuestShell>
  )
}

/* ---------- U7 / U7b add-ons (Figma 273:746, 292:273) ---------- */
const CATS = ['Activities', 'Meals', 'Shuttle', 'Extras']
const acts: [string, string, string, string, string, boolean][] = [
  ['Guided Forest Walk', 'Fri, Nov 13 · 9:00 AM · 90 minutes', 'img/act-forest.png', 'Included in your group booking', 'Add', true],
  ['Evening Campfire', 'Sat, Nov 14 · 8:00 PM', 'img/act-campfire.png', 'Included in your group booking', 'Add', true],
  ['Spa massage', 'Sat, Nov 14 · 2:00 PM · 60 minutes', 'img/act-spa.png', '$80.00 per person', 'Request', false],
  ['Canoe rental', 'Any day · 9:00 AM to 5:00 PM', 'img/act-canoe.png', '$30.00 per hour', 'Request', false],
]
export function U7({ step, goto }: SceneProps) {
  const cart = step === 'U7b'
  const [cat, setCat] = useState(cart ? 'Meals' : 'Activities')
  usePrimary(!cart ? () => goto('U7b') : null)
  const chips = (
    <div className="pt-chips">
      {CATS.map((c) => (
        <button
          key={c}
          className={`pt-chip ${(cart ? 'Meals' : cat) === c ? 'on' : ''}`}
          onClick={() => {
            setCat(c)
            if (c === 'Meals' && !cart) goto('U7b')
          }}
        >
          {c}
        </button>
      ))}
    </div>
  )
  return (
    <GuestShell active="Add-ons" goto={goto}>
      <Page>
        <Head
          title="Add-ons"
          sub={cart ? 'Pick activities, meals, a shuttle seat or extras. They go in one cart and the venue team is notified once.' : 'Add activities, meals, a shuttle or extras to your stay. The venue team is notified.'}
        />
        {chips}
        {!cart ? (
          <div className="pt-cards">
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {acts.map(([n, w, img, pill, btn, inc], i) => (
                <div key={n} className={`g-card pt-add ${i === 0 ? 'on' : ''}`}>
                  <img src={asset(img)} alt="" />
                  <div className="tx">
                    <b>{n}</b>
                    <span>{w}</span>
                    <Pill t={pill} tone={inc ? 'mint' : 'cream'} />
                  </div>
                  <button className={`g-btn small ${i === 0 ? 'yellow' : ''}`}>{i === 0 ? 'Selected' : btn}</button>
                </div>
              ))}
            </div>
            <Card title="Your request" flush style={{ width: 380, flex: 'none' }}>
              <div className="pt-card-b">
                <KV label="Activity">Guided Forest Walk</KV>
                <KV label="Date and time">Fri, Nov 13, 2026 · 9:00 AM</KV>
                <KV label="Guests">1 guest (Priya Nair)</KV>
                <KV label="Price">Included in your group booking</KV>
                <p style={{ margin: 0, fontSize: 13, color: '#69716c' }}>The venue team receives your request and confirms it by message.</p>
                <ActionButton className="g-btn yellow block" loadingMs={1000} onDone={() => goto('U8')}>
                  Request activity
                </ActionButton>
              </div>
            </Card>
          </div>
        ) : (
          <CartView goto={goto} />
        )}
      </Page>
    </GuestShell>
  )
}

function CartView({ goto }: { goto: (id: string) => void }) {
  const [added, setAdded] = useState({ dinner: true, shuttle: true })
  const n = 1 + Number(added.dinner) + Number(added.shuttle)
  const row = (name: string, sub: string, pill: string, tone: 'mint' | 'cream', on: boolean | null, toggle?: () => void, label = 'Add') => (
    <div className="pt-row" key={name}>
      <div className="tx">
        <b>{name}</b>
        <span>{sub}</span>
      </div>
      <Pill t={pill} tone={tone} />
      <button className={`g-btn small ${on ? 'yellow' : ''}`} onClick={toggle}>
        {on ? 'Added' : label}
      </button>
    </div>
  )
  return (
    <div className="pt-cards">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Card title="Meals" flush>
          {row('Vegetarian dinner', 'Fri, Nov 13 · 6:30 PM · Dining Hall', 'Included in the group dinner', 'mint', added.dinner, () => setAdded((a) => ({ ...a, dinner: !a.dinner })))}
          {row('Gluten-free breakfast', 'Sat, Nov 14 · 7:30 AM · Dining Hall', 'Included in your group booking', 'mint', false)}
          {row('Boxed lunch for the trail', 'Sat, Nov 14 · pick up at 11:30 AM', 'Included in your group booking', 'mint', false)}
        </Card>
        <Card title="Shuttle" flush>
          {row('Airport shuttle seat', 'Thu, Nov 12 · 1:30 PM · SeaTac to Cedar Valley', 'Included for the group', 'mint', added.shuttle, () => setAdded((a) => ({ ...a, shuttle: !a.shuttle })))}
        </Card>
        <Card title="Extras" flush>
          {row('Late check-out until 1:00 PM', 'Sun, Nov 15 · subject to availability', 'Request', 'cream', false)}
          {row('Cedar candle (gift shop)', 'Pick up at the gift shop', '$12.00', 'cream', false)}
        </Card>
      </div>
      <Card title="Your add-ons" right={<Pill t={`${n} items`} tone="cream" />} flush style={{ width: 380, flex: 'none' }}>
        <div className="pt-card-b" style={{ gap: 10 }}>
          <div className="pt-cart-i">
            <small>Activity</small>
            <b>Guided Forest Walk</b>
            Fri, Nov 13 · 9:00 AM · Included
          </div>
          {added.dinner && (
            <div className="pt-cart-i">
              <small>Meal</small>
              <b>Vegetarian dinner</b>
              Fri, Nov 13 · 6:30 PM · Included
            </div>
          )}
          {added.shuttle && (
            <div className="pt-cart-i">
              <small>Shuttle</small>
              <b>Airport shuttle seat</b>
              Thu, Nov 12 · 1:30 PM · Included
            </div>
          )}
          <div className="pt-sl bold" style={{ borderTop: '1px solid #d9ddd8', paddingTop: 12 }}>
            <span style={{ fontSize: 15 }}>Due today</span>
            <span style={{ fontSize: 22 }}>$0.00</span>
          </div>
          <p style={{ margin: 0, fontSize: 11, color: '#69716c' }}>Everything here is included in your group booking. Paid extras (like the candle) are added to your stay and settled at check-out.</p>
          <ActionButton className="g-btn yellow block" primary loadingMs={1200} onDone={() => goto('U8')}>
            Send {n} requests
          </ActionButton>
        </div>
      </Card>
    </div>
  )
}

/* ---------- U8 requests sent (Figma 273:854) ---------- */
export function U8({ goto }: SceneProps) {
  const steps: [string, string, boolean][] = [
    ['Requested', 'Oct 28, 2026 · 8:05 PM', true],
    ['Venue team notified', 'Request Manager · Oct 28, 8:05 PM', true],
    ['Confirmed', 'You will get a message', false],
  ]
  return (
    <GuestShell active="Add-ons" goto={goto}>
      <Page>
        <div className="pt-hero">
          <img src={asset('img/ic-success-lg.svg')} width={40} height={40} alt="" className="g7-check" />
          <h1>Requests sent</h1>
          <p>The venue team has been notified once and will confirm each request by message.</p>
        </div>
        <div className="pt-cards">
          <Card title="Your requests" right={<Pill t="Requested" tone="amber" />} flush style={{ flex: 1 }}>
            <div className="pt-card-b" style={{ flexDirection: 'row', gap: 24 }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <KV label="Requests">Forest Walk, vegetarian dinner, airport shuttle seat</KV>
                <KV label="Date and time">Nov 12 · 1:30 PM, Nov 13 · 9:00 AM and 6:30 PM</KV>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <KV label="Guest">Priya Nair · Standard Double Room</KV>
                <KV label="Price">Included in your group booking</KV>
              </div>
            </div>
          </Card>
          <Card title="What happens next" flush style={{ width: 444, flex: 'none' }}>
            <div className="pt-card-b pt-steps">
              {steps.map(([a, b, on]) => (
                <div className="pt-step" key={a}>
                  <span className={`d ${on ? 'on' : ''}`}>{on ? '✓' : ''}</span>
                  <div>
                    <b>{a}</b>
                    <span>{b}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button className="g-btn" onClick={() => goto('U7')}>
            Back to activities
          </button>
          <ActionButton className="g-btn yellow" primary loadingMs={600} onDone={() => goto('S1')}>
            View my stay
          </ActionButton>
        </div>
      </Page>
    </GuestShell>
  )
}
