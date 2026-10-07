import { useEffect } from 'react'
import { AdminPage, Badge, Field, GlobalNav, Select, TextArea } from '../../components/admin/Admin'
import { ActionButton } from '../../components/shared/ActionButton'
import { usePlayer, usePrimary, type SceneProps } from '../../player/Player'
import './req.css'

const rows: [string, string, string, string, string, string, string, string, boolean][] = [
  ['Guided Forest Walk', 'Priya Nair', '#00032', 'Fri, Nov 13 · 9:00 AM', 'Activity', 'New', 'Unassigned', 'Review', true],
  ['Vegetarian dinner · Fri', 'Priya Nair', '#00032', 'Fri, Nov 13 · 6:30 PM', 'Meals', 'New', 'Chef team', 'Review', false],
  ['Airport shuttle seat', 'Priya Nair', '#00032', 'Thu, Nov 12 · 1:30 PM', 'Shuttle', 'New', 'Unassigned', 'Review', false],
  ['Late check-out', 'Tom Becker', '#00036', 'Sun, Nov 15 · 1:00 PM', 'Request', 'Confirmed', 'Sam Patel', 'View', false],
  ['Extra towels', 'Grace Liu', '#00033', 'Thu, Nov 12 · 6:00 PM', 'Housekeeping', 'Done', 'Alex Rivera', 'View', false],
  ['Dietary update · group dinner', 'Maya Thompson', '#00031', 'Fri, Nov 13 · 6:30 PM', 'Meals', 'In review', 'Chef team', 'Review', false],
]
const COLS: [string, number][] = [['Request', 410], ['Guest', 160], ['Reservation', 130], ['When', 200], ['Type', 120], ['Status', 130], ['Assigned to', 140], ['', 0]]
const tone = (s: string) => (s === 'Confirmed' || s === 'Done' ? 'mint' : 'warn')

/* S1 · Request Manager (Figma 275:272) */
export function S1({ goto, from }: SceneProps) {
  const { toast } = usePlayer()
  usePrimary(() => goto('S2'))
  useEffect(() => {
    toast('New request: Guided Forest Walk · Priya Nair', 'admin', 4200)
  }, [toast, from])
  return (
    <AdminPage>
      <GlobalNav active="Request Manager" />
      <div className="rq-page">
        <div className="rq-head">
          <div>
            <div className="s">Request Manager</div>
            <h1>Open requests</h1>
          </div>
          <div className="rq-act">
            <button className="slds-button slds-button_neutral">List view</button>
            <button className="slds-button slds-button_brand">New request</button>
          </div>
        </div>
        <div className="slds-card rq-list">
          <table className="slds-table slds-table_fixed-layout lds-list-table">
            <colgroup>
              {COLS.map(([, w], i) => (
                <col key={i} style={{ width: w || undefined }} />
              ))}
            </colgroup>
            <thead>
              <tr>
                {COLS.map(([h], i) => (
                  <th key={i} style={{ textTransform: 'uppercase' }}>
                    <div className="slds-truncate">{h}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r[0]} className={r[8] ? 'rq-new' : ''} style={{ height: 56, cursor: r[8] ? 'pointer' : 'default' }} onClick={r[8] ? () => goto('S2') : undefined}>
                  <td>{r[0]}</td>
                  <td>{r[1]}</td>
                  <td>
                    <a className="slds-text-link">{r[2]}</a>
                  </td>
                  <td>{r[3]}</td>
                  <td>{r[4]}</td>
                  <td>
                    <Badge tone={tone(r[5])}>{r[5]}</Badge>
                  </td>
                  <td>{r[6]}</td>
                  <td>
                    <a className="slds-text-link">{r[7]}</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPage>
  )
}

/* S2 request detail · S3 confirmed (Figma 275:1185, 275:1448) */
export function S2({ step, from, goto }: SceneProps) {
  const { toast } = usePlayer()
  const done = step === 'S3'
  useEffect(() => {
    if (step === 'S3' && from === 'S2') toast('Request confirmed. Priya Nair was notified.', 'admin', 4200)
  }, [step, from, toast])
  usePrimary(done ? () => goto('S4') : null)

  const events: [string, string][] = done
    ? [
        ['Request confirmed', 'Oct 29, 2026 · 9:14 AM · Sam Patel · Priya Nair was notified'],
        ['Assigned to Alex Rivera', 'Oct 29, 2026 · 9:10 AM'],
        ['Request received', 'Oct 28, 2026 · 8:05 PM · Guest portal'],
      ]
    : [
        ['Request received', 'Oct 28, 2026 · 8:05 PM · Guest portal'],
        ['Staff notified', 'Oct 28, 2026 · 8:05 PM · Request Manager'],
      ]
  return (
    <AdminPage>
      <GlobalNav active="Request Manager" />
      <div className="rq-page">
        <section className="slds-card rq-rec">
          <div>
            <div className="s">Request REQ-0127</div>
            <div className="t">
              <a className="slds-text-link">Guided Forest Walk</a>
              <Badge tone={done ? 'mint' : 'warn'}>{done ? 'Confirmed' : 'New'}</Badge>
            </div>
            <div className="s">Requested in the guest portal · Oct 28, 2026 · 8:05 PM</div>
          </div>
          <div className="rq-act">
            {done ? (
              <button className="slds-button slds-button_neutral">Message guest</button>
            ) : (
              <>
                <button className="slds-button slds-button_neutral">Decline</button>
                <ActionButton className="slds-button slds-button_brand" primary loadingMs={1000} onDone={() => goto('S3')}>
                  Confirm request
                </ActionButton>
              </>
            )}
          </div>
        </section>
        <div className="rq-cols">
          <div className="rq-main">
            <section className="slds-card rq-c">
              <h2>Request details</h2>
              <div className="rq-grid">
                <div>
                  <div className="k">Guest</div>
                  <a className="slds-text-link">Priya Nair</a>
                  <div className="k" style={{ marginTop: 16 }}>Reservation</div>
                  <a className="slds-text-link">#00032 · Standard Double Room</a>
                  <div className="k" style={{ marginTop: 16 }}>Group</div>
                  <b>Horizon Foundation</b>
                </div>
                <div>
                  <div className="k">Activity</div>
                  <b>Guided Forest Walk · 90 minutes</b>
                  <div className="k" style={{ marginTop: 16 }}>Date and time</div>
                  <b>Fri, Nov 13, 2026 · 9:00 AM</b>
                  <div className="k" style={{ marginTop: 16 }}>Guests / price</div>
                  <b>1 guest · Included in the group booking</b>
                </div>
              </div>
            </section>
            <section className="slds-card rq-c">
              <h2>Activity</h2>
              <ul className="rq-tl">
                {events.map(([a, b]) => (
                  <li key={a}>
                    <i />
                    <div>
                      <b>{a}</b>
                      <span>{b}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
          <div className="rq-side">
            <section className="slds-card rq-c">
              <h2>{done ? 'Handled' : 'Next step'}</h2>
              <Field label="Assigned to">
                <Select value="Alex Rivera" />
              </Field>
              <Field label="Message to the guest" style={{ marginTop: 12 }}>
                <TextArea rows={3} value={done ? 'Your forest walk is confirmed. Meet at the Main Lodge Lobby at 8:50 AM.' : 'Meet at the Main Lodge Lobby at 8:50 AM.'} />
              </Field>
              {done ? (
                <div style={{ marginTop: 14 }}>
                  <Badge tone="mint">Guest notified</Badge>
                </div>
              ) : (
                <div className="rq-btns">
                  <ActionButton className="slds-button slds-button_brand" loadingMs={1000} onDone={() => goto('S3')}>
                    Confirm request
                  </ActionButton>
                  <button className="slds-button slds-button_neutral">Decline</button>
                </div>
              )}
            </section>
            <section className="slds-card rq-c">
              <h2>Capacity</h2>
              <div className="s">Forest Walk · Fri, Nov 13 · 9:00 AM</div>
              <div className="rq-cap" key={done ? 13 : 12}>
                {done ? 13 : 12} of 20 spots booked
              </div>
            </section>
          </div>
        </div>
      </div>
    </AdminPage>
  )
}

/* S4 · Portal activity (Figma 294:1823) */
export function S4(_: SceneProps) {
  const people: [string, string, string, string, string, string, string][] = [
    ['Maya Thompson', 'Organizer', 'Sep 22, 2026', 'Oct 28, 8:20 PM', 'Overview, Rooms, Guests, Invoices', 'Updated meal counts', 'Active'],
    ['Priya Nair', 'Guest', 'Sep 24, 2026', 'Oct 28, 8:05 PM', 'My stay, Room, Add-ons', 'Sent 3 requests', 'Active'],
    ['Grace Liu', 'Guest', 'Sep 25, 2026', 'Oct 27, 6:41 PM', 'My stay, Payment', 'Downloaded receipt', 'Active'],
    ['Omar Haddad', 'Guest', 'Sep 25, 2026', 'Oct 22, 7:40 PM', 'My stay', 'Viewed documents', 'Active'],
    ['Daniel Okafor', 'Guest', 'Sep 25, 2026', 'Oct 20, 6:15 PM', 'My stay, Room', 'Viewed schedule', 'Active'],
    ['Elena Rossi', 'Guest', 'Sep 26, 2026', 'Oct 26, 9:02 AM', 'Room', 'Paid $462.00', 'Active'],
    ['Marcus Webb', 'Guest', 'Sep 26, 2026', 'Never opened', '—', '—', 'Needs follow-up'],
  ]
  const cols: [string, number][] = [['Person', 180], ['Role', 110], ['Link sent', 130], ['Last opened', 170], ['Pages viewed', 410], ['Actions', 260], ['Status', 0]]
  return (
    <AdminPage>
      <GlobalNav active="Request Manager" />
      <div className="rq-page">
        <div className="rq-head">
          <div>
            <div className="s">Group Block GBR-008</div>
            <h1>Portal activity</h1>
          </div>
          <div className="rq-act">
            <button className="slds-button slds-button_neutral">Export</button>
            <button className="slds-button slds-button_brand">Resend links</button>
          </div>
        </div>
        <div className="rq-sum">
          {[
            ['Secure links sent', '7', '1 organizer · 6 guests'],
            ['Opened', '6', '86% of links'],
            ['Requests from guests', '3', 'from 1 guest'],
            ['Last opened', '2 min ago', 'Priya Nair'],
          ].map(([a, b, c]) => (
            <div className="slds-card" key={a}>
              <span>{a}</span>
              <strong>{b}</strong>
              <small>{c}</small>
            </div>
          ))}
        </div>
        <div className="slds-card rq-list">
          <table className="slds-table slds-table_fixed-layout lds-list-table">
            <colgroup>
              {cols.map(([, w], i) => (
                <col key={i} style={{ width: w || undefined }} />
              ))}
            </colgroup>
            <thead>
              <tr>
                {cols.map(([h]) => (
                  <th key={h} style={{ textTransform: 'uppercase' }}>
                    <div className="slds-truncate">{h}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {people.map((p) => (
                <tr key={p[0]} style={{ height: 56 }}>
                  {p.slice(0, 6).map((c, i) => (
                    <td key={i}>{c}</td>
                  ))}
                  <td>
                    <Badge tone={p[6] === 'Active' ? 'mint' : 'warn'}>{p[6]}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPage>
  )
}

