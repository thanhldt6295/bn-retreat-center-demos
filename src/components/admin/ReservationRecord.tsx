import type { ReactNode } from 'react'
import { DatePicker } from '../shared/DatePicker'
import { asset } from '../../lib/asset'
import { money } from '../../data/demo'
import { AdminPage, Badge, Field, GlobalNav, Input } from './Admin'
import { Icon } from './Icon'
import './reservation.css'

export const ROOM_IMG: Record<string, string> = {
  'Standard Single Room': 'img/room-single.png',
  'Standard Double Room': 'img/room-double.png',
  Cabin: 'img/room-cabin.png',
}

export const DateBox = ({ value, onChange, min }: { value: string; onChange: (v: string) => void; min?: string }) => (
  <DatePicker theme="lds" value={value} onChange={onChange} min={min}>
    {(open) => (
      <div className={`slds-input-has-icon slds-input-has-icon_right ${open ? 'slds-has-focus' : ''}`} style={{ width: '100%' }}>
        <Icon name="date_input" className="slds-input__icon slds-input__icon_right" color="#0b5cff" />
        <input className="slds-input" readOnly value={value} aria-label="Date" style={{ cursor: 'pointer' }} />
      </div>
    )}
  </DatePicker>
)

export const Amount = ({ a, tax }: { a: number; tax: number }) => (
  <div className="rv-amt">
    <b>{money(a)}</b>
    <span>+Tax {money(tax)}</span>
  </div>
)

const HeadRow = ({ cols }: { cols: [string, number][] }) => (
  <>
    <colgroup>
      {cols.map(([, w], i) => (
        <col key={i} style={{ width: w || undefined }} />
      ))}
    </colgroup>
    <thead>
      <tr>
        {cols.map(([h], i) => (
          <th key={i} scope="col">
            <div className="slds-truncate">{h}</div>
          </th>
        ))}
      </tr>
    </thead>
  </>
)

export type RvRoom = {
  type: string
  guest: string
  amount: number
  tax: number
  status: string
  /** link under the room name, e.g. "Assign Room" or "Room 201" */
  link: string
  onLink?: () => void
  /** brief highlight after a change */
  flash?: boolean
}

export type RvProps = {
  number: string
  groupBlock?: string
  confirmed: boolean
  /** extra header buttons (e.g. Confirm Reservation) */
  headActions?: ReactNode
  start: string
  end: string
  onStart: (v: string) => void
  onEnd: (v: string) => void
  bookedBy: string
  tax: number
  grandTotal: number
  contact: string
  email: string
  invoice: string
  balance: number
  onInvoice?: () => void
  /** rendered between the info cards and the details card (e.g. "Room block usage") */
  between?: ReactNode
  space?: { amount: number; tax: number; status: ReactNode } | null
  roomsTitle: string
  rooms: RvRoom[]
  roomsFooter?: ReactNode
  items?: { name: string; sub: string; qty: number; amount: number; tax: number; status: ReactNode } | null
  /** modals, overlays */
  children?: ReactNode
  /** which header link the Invoice buttons use */
}

/** Staff reservation record (Figma 235:13410 / 239:13485 / 268:13379), shared by V1 and V2. */
export function ReservationRecord(p: RvProps) {
  return (
    <AdminPage>
      <GlobalNav active="Reservations" />
      <div className="rv-page">
        <section className="slds-card rv-head">
          <div className="rv-head-t">
            <div className="rv-t1">
              <span>Reservation</span>
              <a className="slds-text-link rv-num">{p.number}</a>
            </div>
            {p.groupBlock && (
              <div className="rv-t2">
                <span>Group Block</span>
                <a className="slds-text-link">{p.groupBlock}</a>
              </div>
            )}
          </div>
          <div className="rv-head-a">
            <button className="slds-button slds-button_neutral" disabled={!p.confirmed}>
              Check-In
            </button>
            <button className="slds-button slds-button_neutral" disabled={!p.confirmed}>
              Check-Out
            </button>
            {p.headActions}
          </div>
        </section>

        <section className="slds-card rv-path">
          <span>Cancelled</span>
          <span>{p.confirmed ? 'Pending Approval' : <Badge tone="warn">Pending Approval</Badge>}</span>
          <span>{p.confirmed ? <Badge tone="mint">Confirmed</Badge> : 'Confirmed'}</span>
        </section>

        <div className="rv-info">
          <section className="slds-card rv-icard">
            <h2>Reservation Info</h2>
            <div className="rv-inner">
              <div className="rv-dates">
                <Field label="Start Date">
                  <DateBox value={p.start} onChange={p.onStart} />
                </Field>
                <Field label="End Date">
                  <DateBox value={p.end} onChange={p.onEnd} min={p.start} />
                </Field>
              </div>
              <div className="rv-meta">
                <div>
                  <div className="lds-lbl">Booked by</div>
                  <div>{p.bookedBy}</div>
                </div>
                <div>
                  <div className="lds-lbl">Taxes enabled</div>
                  <b>True</b>
                </div>
                <div>
                  <div className="lds-lbl">Taxes</div>
                  <div>{money(p.tax)}</div>
                </div>
              </div>
              <div className="rv-foot">
                <div className="rv-btns">
                  <button className="slds-button slds-button_neutral">Add room</button>
                  <button className="slds-button slds-button_neutral">Add item</button>
                </div>
                <div className="rv-total">
                  <span>Grand Total</span>
                  <b>{money(p.grandTotal)}</b>
                </div>
              </div>
            </div>
          </section>
          <section className="slds-card rv-icard">
            <h2>Billing Info</h2>
            <div className="rv-inner">
              <div className="rv-contact">
                <Field label="Contact Name" style={{ flex: 1 }}>
                  <Input value={p.contact} />
                </Field>
                <button className="slds-button slds-button_neutral">Change</button>
              </div>
              <div className="rv-meta">
                <div>
                  <div className="lds-lbl">Email</div>
                  <div>{p.email}</div>
                </div>
                <div>
                  <div className="lds-lbl">Invoice</div>
                  <a className="slds-text-link ab" onClick={p.onInvoice}>
                    {p.invoice}
                  </a>
                </div>
              </div>
              <div className="rv-foot">
                <div className="rv-btns">
                  <button className="slds-button slds-button_neutral ab" onClick={p.onInvoice}>
                    Invoice
                  </button>
                  <button className="slds-button slds-button_neutral">Payments</button>
                </div>
                <div className="rv-total">
                  <span>Balance Due</span>
                  <b>{money(p.balance)}</b>
                </div>
              </div>
            </div>
          </section>
        </div>

        {p.between}

        <section className="slds-card rv-details">
          <div className="slds-tabs_default">
            <ul className="slds-tabs_default__nav" role="tablist">
              {['Details', 'Payments', 'Files', 'Activities'].map((n, i) => (
                <li key={n} className={`slds-tabs_default__item ${i === 0 ? 'slds-is-active' : ''}`} role="presentation">
                  <a className="slds-tabs_default__link" role="tab">
                    {n}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {p.space && (
            <>
              <h3 className="rv-sec">
                Space <small>1</small>
              </h3>
              <div className="rv-tbl">
                <table className="slds-table slds-table_fixed-layout">
                  <HeadRow cols={[['Space', 260], ['Description', 360], ['Start date', 110], ['End date', 110], ['Time', 150], ['Days', 70], ['Status', 150], ['Amount', 150]]} />
                  <tbody>
                    <tr style={{ height: 64 }}>
                      <td>Meeting Hall</td>
                      <td>Venue for workshops and leadership sessions</td>
                      <td>Nov 12, 2026</td>
                      <td>Nov 14, 2026</td>
                      <td>9:00 AM – 5:00 PM</td>
                      <td>3</td>
                      <td>{p.space.status}</td>
                      <td>
                        <Amount a={p.space.amount} tax={p.space.tax} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}

          <h3 className="rv-sec">
            Reservation Rooms <small>{p.roomsTitle}</small>
          </h3>
          <div className="rv-tbl">
            <table className="slds-table slds-table_fixed-layout">
              <HeadRow cols={[['Room', 360], ['Guest', 190], ['Start date', 100], ['End date', 100], ['Guests', 90], ['Status', 150], ['Length', 80], ['Room only', 100], ['Total', 100], ['Actions', 88]]} />
              <tbody>
                {p.rooms.map((r, i) => (
                  <tr key={i} style={{ height: 80 }} className={r.flash ? 'rv-flash' : ''}>
                    <td>
                      <div className="rv-room">
                        <img src={asset(ROOM_IMG[r.type])} width={64} height={64} alt="" />
                        <div>
                          <div className="from">From Cedar Valley Retreat &amp; Conference Center</div>
                          <b>{r.type}</b>
                          <a className="slds-text-link ab" onClick={r.onLink}>
                            {r.link}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td>
                      <b>{r.guest}</b>
                    </td>
                    <td>Nov 12, 2026</td>
                    <td>Nov 15, 2026</td>
                    <td>1 / 0</td>
                    <td>{r.status}</td>
                    <td>3 nights</td>
                    <td>
                      <Amount a={r.amount} tax={r.tax} />
                    </td>
                    <td>
                      <Amount a={r.amount} tax={r.tax} />
                    </td>
                    <td>
                      <button className="slds-button slds-button_icon slds-button_icon-border-filled" title="Show actions">
                        <Icon name="chevrondown" size="x-small" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {p.roomsFooter}
          </div>
          <div className="rv-add">
            <button className="slds-button slds-button_neutral">Add</button>
          </div>

          {p.items && (
            <>
              <h3 className="rv-sec">
                Items <small>(1)</small>
              </h3>
              <div className="rv-tbl">
                <table className="slds-table slds-table_fixed-layout">
                  <HeadRow cols={[['Item', 460], ['Start date', 110], ['End date', 110], ['Calculation rule', 150], ['Qty', 70], ['Status', 150], ['Amount', 150], ['', 158]]} />
                  <tbody>
                    <tr style={{ height: 72 }}>
                      <td>
                        <div className="rv-room item">
                          <span className="ph" />
                          <div>
                            <b>{p.items.name}</b>
                            <div className="from">{p.items.sub}</div>
                          </div>
                        </div>
                      </td>
                      <td>Nov 12, 2026</td>
                      <td>Nov 14, 2026</td>
                      <td>Per Person</td>
                      <td>{p.items.qty}</td>
                      <td>{p.items.status}</td>
                      <td>
                        <Amount a={p.items.amount} tax={p.items.tax} />
                      </td>
                      <td>
                        <a className="slds-text-link">Remove</a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </div>
      {p.children}
    </AdminPage>
  )
}
