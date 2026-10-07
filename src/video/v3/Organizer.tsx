import { useState } from 'react'
import { MailShell, type MailMeta } from '../../components/mail/Mail'
import { ActionButton } from '../../components/shared/ActionButton'
import { PortalShell, GUEST_TABS } from '../../components/guest/Guest'
import { afterGuestBookings, agenda, group, money, quote, venue } from '../../data/demo'
import { usePlayer, usePrimary, type SceneProps } from '../../player/Player'
import '../v1/email-viewer.css'
import '../v2/guest-flow.css'
import { Card, Head, Link, Page, Pill, Stat, SumLine, Table } from './ui'

export const ORG_TAB: Record<string, string> = {
  Overview: 'O1',
  Rooms: 'O2',
  Guests: 'O3',
  Documents: 'O4',
  Invoices: 'O5',
  'Schedule & meals': 'O6',
  'Invite guests': 'O7',
}
export const GUEST_TAB: Record<string, string> = {
  'My stay': 'U1',
  Room: 'U2',
  Payment: 'U3',
  Schedule: 'U4',
  Documents: 'U5',
  Charges: 'U6',
  'Add-ons': 'U7',
}
export const tabNav = (map: Record<string, string>, goto: (id: string) => void) => (t: string) => map[t] && goto(map[t])

/** Organizer portal shell with clickable tabs. */
export function OrgShell({ active, goto, wide, children }: { active: string; goto: (id: string) => void; wide?: boolean; children: React.ReactNode }) {
  return (
    <PortalShell active={active} wide={wide} onTab={tabNav(ORG_TAB, goto)}>
      {children}
    </PortalShell>
  )
}
export function GuestShell({ active, goto, wide, children }: { active: string; goto: (id: string) => void; wide?: boolean; children: React.ReactNode }) {
  return (
    <PortalShell active={active} wide={wide} tabs={GUEST_TABS} user="Priya Nair" initials="PN" onTab={tabNav(GUEST_TAB, goto)}>
      {children}
    </PortalShell>
  )
}

/* ---------- email shell (O0 / U0) ---------- */
export function SecureEmail({
  mail,
  subject,
  hi,
  lead,
  cta,
  link,
  can,
  onOpen,
}: {
  mail: MailMeta
  subject: string
  hi: string
  lead: string
  cta: string
  link: string
  can: string[]
  onOpen: () => void
}) {
  return (
    <MailShell meta={mail}>
    <div className="em">
      <div className="em-subject">
        <b>{subject}</b>
        <span>· {venue.name}</span>
      </div>
      <div className="em-card gf-email">
        <div className="em-head">
          <div>
            <p className="k">SECURE LINK</p>
            <p className="t">{group.name}</p>
          </div>
        </div>
        <div className="gf-ebody" style={{ gap: 14 }}>
          <h2>{hi}</h2>
          <p className="lead">{lead}</p>
          <div>
            <ActionButton className="g-btn yellow" primary loadingMs={800} onDone={onOpen}>
              {cta}
            </ActionButton>
          </div>
          <div className="em-link">{link}</div>
          <b style={{ fontSize: 12 }}>What you can do</b>
          <ul className="em-can">
            {can.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <p style={{ margin: 0, fontSize: 11, color: '#69716c' }}>This link is private to you, so there is nothing to log in to. Please do not forward it.</p>
        </div>
      </div>
    </div>
    </MailShell>
  )
}

export const O0 = ({ goto }: SceneProps) => (
  <SecureEmail
    mail={{ box: { name: 'Maya Thompson', role: 'Organizer', email: 'maya.thompson@horizon.example' }, subject: 'Your event portal is open for rooms and guests', from: { name: venue.name, email: venue.email }, date: 'Sep 22, 2026', snippet: 'Use the same private link as before to assign rooms and invite guests.' }}
    subject="Your event portal is open for rooms and guests"
    hi="Hi Maya,"
    lead="Your booking is confirmed. Use the same private link as before to assign rooms, invite guests and see invoices, documents and the schedule. No account or password is needed."
    cta="Open event portal"
    link="cedarvalley.example/portal/o/HZN-7Q4M-2K9X"
    can={['Group overview', 'Room allocation and guest list', 'BEO and contract', 'Invoices, deposit and balance', 'Schedule and meals', 'Share the group code and invite guests']}
    onOpen={() => goto('O1')}
  />
)

/* ---------- O1 overview (Figma 272:272) ---------- */
export function O1({ goto }: SceneProps) {
  const [done, setDone] = useState<number[]>([])
  usePrimary(() => goto('O2'))
  const todo: [string, string, string, () => void][] = [
    ['Assign your remaining 15 rooms', 'Add guests, or share the group code so they can book and pay themselves.', 'Go to rooms', () => goto('O2')],
    ['Pay the balance by Nov 05', `INV-00031 · Balance ${money(afterGuestBookings.balance)}`, 'Pay now', () => goto('O5')],
    ['Confirm dietary needs for the group dinner', 'Fri, Nov 13 · 6:30 PM · Dining Hall', 'Add details', () => goto('O6')],
  ]
  return (
    <OrgShell active="Overview" goto={goto}>
      <Page>
        <Head
          title={group.name}
          sub={`${group.code} · Nov 12 – Nov 15, 2026 · ${venue.name}`}
          right={<Pill t="Confirmed" className="pt-pill-r" />}
          rightBottom
        />
        <div className="pt-stats">
          <Stat label="Dates" value="Nov 12 – 15" sub="3 nights" />
          <Stat
            label="Rooms"
            value="22"
            sub="7 assigned (1 pending approval) · 15 open"
            action={
              <button className="g-btn" onClick={() => goto('O2')}>
                Assign rooms
              </button>
            }
          />
          <Stat
            label="Balance due"
            value={money(afterGuestBookings.balance)}
            sub="Due Nov 05, 2026"
            action={
              <button className="g-btn yellow" onClick={() => goto('O5')}>
                Pay now
              </button>
            }
          />
          <Stat label="Meals" value="96" sub="guest-days · 32 guests" />
        </div>
        <div className="pt-cards">
          <Card title="To do" flush style={{ flex: 1 }}>
            {todo.map(([t, s, b, fn], i) => (
              <div className="pt-todo" key={t}>
                <span className={`c ${done.includes(i) ? 'on' : ''}`}>{done.includes(i) ? '✓' : ''}</span>
                <div>
                  <b>{t}</b>
                  <span className="s">{s}</span>
                </div>
                <button
                  className={`g-btn ${i === 1 ? 'yellow' : ''}`}
                  onClick={() => {
                    setDone((d) => [...d, i])
                    fn()
                  }}
                >
                  {b}
                </button>
              </div>
            ))}
          </Card>
          <Card title="Next on the schedule" flush style={{ width: 444, flex: 'none' }}>
            {agenda.map((a) => (
              <div className="pt-sched" key={a.n}>
                <small>
                  {a.day} · {a.start.replace(/^0/, '')}
                </small>
                <b>{a.name === 'Leadership Sessions' ? 'Leadership sessions' : a.name === 'Group Dinner' ? 'Group dinner' : a.name}</b>
                <span>{a.location}</span>
              </div>
            ))}
          </Card>
        </div>
      </Page>
    </OrgShell>
  )
}

/* ---------- O3 guest list (Figma 280:384) ---------- */
const guests: [string, string, string, string, string, 'mint' | 'amber', string, string][] = [
  ['Maya Thompson', 'maya.thompson@horizon.example · Organizer', 'Standard Single Room', 'Organizer', 'Confirmed', 'mint', '—', 'Change'],
  ['Daniel Okafor', 'daniel.okafor@horizon.example', 'Standard Single Room', 'Organizer', 'Confirmed', 'mint', '—', 'Change'],
  ['Elena Rossi', 'elena.rossi@horizon.example', 'Standard Single Room', 'Guest', 'Paid', 'mint', 'Vegetarian', 'View'],
  ['Grace Liu', 'grace.liu@horizon.example', 'Standard Double Room', 'Guest', 'Paid', 'mint', 'Gluten-free', 'View'],
  ['Omar Haddad', 'omar.haddad@horizon.example', 'Standard Double Room', 'Organizer', 'Confirmed', 'mint', '—', 'Change'],
  ['Priya Nair', 'priya@horizon.example · joined with the group code', 'Standard Double Room', 'Guest', 'Paid', 'mint', '—', 'View'],
  ['Marcus Webb', 'marcus.webb@horizon.example', 'Cabin', 'Guest', 'Invited', 'amber', 'Vegetarian', 'Resend'],
]
export function O3({ goto }: SceneProps) {
  const [f, setF] = useState('All 7')
  const shown = guests.filter((g) => f === 'All 7' || (f === 'Confirmed 3' && g[4] === 'Confirmed') || (f === 'Invited 1' && g[4] === 'Invited') || (f === 'Paid 3' && g[4] === 'Paid'))
  return (
    <OrgShell active="Guests" goto={goto} wide>
      <Page wide>
        <Head
          title="Guest list"
          sub="Everyone staying with your group and how they are paying."
          right={
            <div className="as-btns" style={{ alignSelf: 'flex-start' }}>
              <button className="g-btn small">Import list</button>
              <button className="g-btn small">Export</button>
              <button className="g-btn small yellow">Add guest</button>
            </div>
          }
        />
        <div className="pt-chips">
          {['All 7', 'Confirmed 3', 'Invited 1', 'Paid 3'].map((c) => (
            <button key={c} className={`pt-chip ${f === c ? 'on' : ''}`} onClick={() => setF(c)}>
              {c}
            </button>
          ))}
        </div>
        <Card flush style={{ borderRadius: 20 }}>
          <Table
            rowH={60}
            cols={[{ h: 'Guest' }, { h: 'Room', w: 190 }, { h: 'Who pays', w: 120 }, { h: 'Status', w: 130 }, { h: 'Dietary', w: 180 }, { h: '', w: 120 }]}
            rows={shown.map((g) => [
              <span className="pt-g" key="a">
                <b>{g[0]}</b>
                <span>{g[1]}</span>
              </span>,
              g[2],
              g[3],
              <Pill key="p" t={g[4]} tone={g[5]} />,
              g[6],
              <Link key="l">{g[7]}</Link>,
            ])}
          />
        </Card>
      </Page>
    </OrgShell>
  )
}

/* ---------- O4 documents (Figma 272:511) ---------- */
const Doc = ({ title, sub, pill, buttons }: { title: string; sub: string; pill: [string, 'mint' | 'amber']; buttons: [string, boolean][] }) => (
  <div className="g-card pt-doc">
    <div className="th">
      <i />
      <i />
      <i />
      <i />
    </div>
    <div className="tx">
      <b>{title}</b>
      <span>{sub}</span>
      <Pill t={pill[0]} tone={pill[1]} />
      <div className="bt">
        {buttons.map(([t, y]) => (
          <button key={t} className={`g-btn ${y ? 'yellow' : ''}`}>
            {t}
          </button>
        ))}
      </div>
    </div>
  </div>
)
export const DocGrid = ({ items }: { items: Parameters<typeof Doc>[0][] }) => (
  <div className="pt-docs">
    {items.map((d) => (
      <Doc key={d.title} {...d} />
    ))}
  </div>
)
export function O4({ goto }: SceneProps) {
  return (
    <OrgShell active="Documents" goto={goto}>
      <Page>
        <Head title="Documents" sub="Everything signed or shared for the retreat." />
        <DocGrid
          items={[
            { title: 'Banquet Event Order (BEO)', sub: 'Version 2 · Sep 12, 2026', pill: ['Final', 'mint'], buttons: [['View', true], ['Download', false]] },
            { title: 'Contract', sub: 'Signed electronically · Sep 22, 2026', pill: ['Signed', 'mint'], buttons: [['View', true], ['Download', false]] },
            { title: 'Event agenda', sub: 'Updated Oct 02, 2026', pill: ['Shared', 'mint'], buttons: [['Download', false]] },
            { title: 'Group Block approval', sub: 'GBR-008 · Quote and booking confirmation', pill: ['Confirmed', 'mint'], buttons: [['View', true]] },
          ]}
        />
      </Page>
    </OrgShell>
  )
}

/* ---------- O5 invoices (Figma 272:386) ---------- */
export function O5({ goto }: SceneProps) {
  const { toast } = usePlayer()
  const [paid, setPaid] = useState(false)
  const bal = afterGuestBookings.balance
  return (
    <OrgShell active="Invoices" goto={goto}>
      <Page>
        <Head title="Invoices and payments" sub="Payments for the venue, rooms and meals booked by the organizer." />
        <div className="pt-cards">
          <Card title="Invoices" flush style={{ width: 764, flex: 'none', minHeight: 508 }}>
            <Table
              rowH={43}
              cols={[{ h: 'Invoice', w: 78 }, { h: 'Description', w: 130 }, { h: 'Due', w: 130 }, { h: 'Amount', w: 100 }, { h: 'Status', w: 110 }, { h: '' }]}
              rows={[
                ['INV-00031', 'Deposit (50%)', 'Sep 22, 2026', money(quote.deposit), <Pill key="a" t="Paid" />, <Link key="b">Receipt</Link>],
                [
                  'INV-00031',
                  'Balance after credits',
                  'Nov 05, 2026',
                  money(bal),
                  <Pill key="c" t={paid ? 'Paid' : 'Due'} tone={paid ? 'mint' : 'amber'} />,
                  paid ? (
                    <Link key="d">Receipt</Link>
                  ) : (
                    <ActionButton key="d" className="g-btn small yellow" primary loadingMs={1100} onDone={() => { setPaid(true); toast(`Payment received · ${money(bal)}`, 'guest') }}>
                      Pay now
                    </ActionButton>
                  ),
                ],
              ]}
            />
          </Card>
          <div style={{ width: 320, flex: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Card title="Summary" flush>
              <div className="pt-card-b" style={{ gap: 8 }}>
                <SumLine k="Rooms" v={money(quote.roomsTotal)} />
                <SumLine k="Meeting Hall and catering" v={money(quote.addOnsTotal)} />
                <SumLine k="Taxes (10%)" v={money(quote.tax)} />
                <SumLine k="Credit: rooms paid by guests" v={`−${money(afterGuestBookings.credit)}`} />
                <SumLine k="Total" v={money(afterGuestBookings.total)} bold />
                <SumLine k="Paid" v={money(paid ? afterGuestBookings.total : quote.deposit)} />
                <SumLine k="Balance due" v={money(paid ? 0 : bal)} bold />
              </div>
            </Card>
            <Card title="Payment method" flush>
              <div className="pt-card-b">
                <b style={{ fontSize: 13 }}>Card · Visa ending 4242</b>
                <span style={{ fontSize: 12, color: '#69716c' }}>Used for the deposit on Sep 22, 2026</span>
                <div>
                  <button className="g-btn small">Change card</button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Page>
    </OrgShell>
  )
}

/* ---------- O6 schedule and meals (Figma 272:625) ---------- */
export function O6({ goto }: SceneProps) {
  const { toast } = usePlayer()
  const sched = [
    ['Thu, Nov 12', '3:00 – 5:00 PM', 'Arrival and check-in', 'Main Lodge Lobby', '32'],
    ['Fri, Nov 13', '9:00 AM – 5:00 PM', 'Leadership sessions', 'Meeting Hall', '32'],
    ['Fri, Nov 13', '6:30 – 8:30 PM', 'Group dinner', 'Dining Hall', '32'],
    ['Sat, Nov 14', '10:00 AM – 12:00 PM', 'Closing workshop', 'Meeting Hall', '32'],
    ['Sun, Nov 15', 'By 11:00 AM', 'Check-out', 'Main Lodge Lobby', '32'],
  ]
  const meals: [string, string, string, string, string, 'mint' | 'amber'][] = [
    ['Breakfast', 'Fri, Nov 13 · 7:30 AM', '32', '2 gluten-free', 'Confirmed', 'mint'],
    ['Lunch', 'Fri, Nov 13 · 12:30 PM', '32', '4 vegetarian', 'Confirmed', 'mint'],
    ['Group dinner', 'Fri, Nov 13 · 6:30 PM', '32', '4 vegetarian, 2 gluten-free', 'Needs details', 'amber'],
    ['Breakfast', 'Sat, Nov 14 · 7:30 AM', '32', '—', 'Confirmed', 'mint'],
  ]
  return (
    <OrgShell active="Schedule & meals" goto={goto}>
      <Page>
        <Head
          title="Schedule and meals"
          sub="What happens each day, and the meal counts for the venue team."
          right={
            <ActionButton className="g-btn yellow" primary loadingMs={900} onDone={() => { toast('Meal counts updated', 'guest'); goto('O7') }}>
              Update meal counts
            </ActionButton>
          }
        />
        <Card title="Schedule" flush>
          <Table
            rowH={36}
            cols={[{ h: 'Day', w: 100 }, { h: 'Time', w: 142 }, { h: 'Session', w: 311 }, { h: 'Location', w: 157 }, { h: 'Guests' }]}
            rows={sched}
          />
        </Card>
        <Card title="Meals" flush>
          <Table
            rowH={40}
            cols={[{ h: 'Meal', w: 170 }, { h: 'When', w: 157 }, { h: 'Guests', w: 71 }, { h: 'Dietary needs', w: 290 }, { h: 'Status', align: 'right' }]}
            rows={meals.map((m) => [m[0], m[1], m[2], m[3], <Pill key="s" t={m[4]} tone={m[5]} />])}
          />
        </Card>
      </Page>
    </OrgShell>
  )
}

/* ---------- O7 invite guests (Figma 280:580) ---------- */
export function O7({ goto, next }: SceneProps) {
  const { toast } = usePlayer()
  const [sent, setSent] = useState(false)
  return (
    <OrgShell active="Invite guests" goto={goto} wide>
      <Page wide>
        <Head title="Invite guests" sub="Two ways to fill your rooms: share the group code, or send invitations for rooms you already assigned." />
        <div className="pt-cards">
          <Card title="Share your group code" style={{ width: 481, flex: 'none' }} flush>
            <div className="pt-card-b" style={{ gap: 12 }}>
              <p style={{ margin: 0, fontSize: 13, color: '#69716c' }}>Guests who prefer to book and pay for their own room enter this code on the booking page.</p>
              <div className="pt-code">{group.code}</div>
              <div className="pt-box" style={{ color: '#69716c', fontSize: 12 }}>cedarvalley.example/book?code={group.code}</div>
              <ActionButton className="g-btn yellow block" instant onDone={() => toast('Booking link copied', 'guest')}>
                Copy link
              </ActionButton>
              <button className="g-btn block">Copy code</button>
              <span style={{ fontSize: 12, color: '#06503f', fontWeight: 600 }}>7 of 22 rooms are taken · 15 still open</span>
            </div>
          </Card>
          <Card title="Send invitations" style={{ flex: 1 }} flush>
            <div className="pt-card-b" style={{ gap: 14 }}>
              <div className="pt-form">
                <label>Recipients</label>
                <div className="pt-recips">
                  <span className="rc">Elena Rossi</span>
                  <span className="rc">Marcus Webb</span>
                  <Link>+ Add email</Link>
                </div>
              </div>
              <div className="pt-form">
                <label>Message</label>
                <div className="pt-box">Hi! I reserved a room for you at the Horizon Foundation retreat. Use your private link to confirm the room and pay at the group rate.</div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <ActionButton
                  className="g-btn yellow"
                  primary
                  loadingMs={1000}
                  onDone={() => {
                    setSent(true)
                    toast('2 invitations sent', 'guest')
                    window.setTimeout(next, 1400)
                  }}
                >
                  {sent ? 'Invitations sent' : 'Send 2 invitations'}
                </ActionButton>
                <button className="g-btn">Preview e-mail</button>
              </div>
            </div>
          </Card>
        </div>
      </Page>
    </OrgShell>
  )
}

