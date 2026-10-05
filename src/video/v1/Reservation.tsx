import { useEffect, useState } from 'react'
import { ActionButton } from '../../components/shared/ActionButton'
import './reservation.css'
import { DatePicker } from '../../components/shared/DatePicker'
import { AdminPage, Badge, Field, GlobalNav, Input, Modal, Select, TextArea } from '../../components/admin/Admin'
import { Icon } from '../../components/admin/Icon'
import { asset } from '../../lib/asset'
import { group, groupReservation, money, organizer, quote, timeline } from '../../data/demo'
import { usePlayer, type SceneProps } from '../../player/Player'

const th = { fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '.04em', fontWeight: 700 } as const

const DateBox = ({ value, onChange, min }: { value: string; onChange: (v: string) => void; min?: string }) => (
  <DatePicker theme="lds" value={value} onChange={onChange} min={min}>
    {(open) => (
      <div className={`slds-input-has-icon slds-input-has-icon_right ${open ? 'slds-has-focus' : ''}`} style={{ width: '100%' }}>
        <Icon name="date_input" className="slds-input__icon slds-input__icon_right" color="#0b5cff" />
        <input className="slds-input" readOnly value={value} aria-label="Date" style={{ cursor: 'pointer' }} />
      </div>
    )}
  </DatePicker>
)

const ROOM_IMG: Record<string, string> = {
  'Standard Single Room': 'img/room-single.png',
  'Standard Double Room': 'img/room-double.png',
  Cabin: 'img/room-cabin.png',
}

/** 4.3 Pending Approval, 4.4 invoice (modal), 4.3b Confirmed */
export function Reservation({ step, from, goto }: SceneProps) {
  const { toast } = usePlayer()
  const confirmed = step === '4.3b'
  const [invoiceOpen, setInvoiceOpen] = useState(step === '4.4')
  const [start, setStart] = useState('Nov 12, 2026')
  const [end, setEnd] = useState('Nov 15, 2026')

  useEffect(() => {
    setInvoiceOpen(step === '4.4')
  }, [step])

  useEffect(() => {
    if (step === '4.3b' && from === '4.4') toast('Reservation #00031 confirmed.')
    if (step === '4.3' && from?.startsWith('4.5')) toast('Reservation #00031 created. Waiting for approval.')
  }, [step, from, toast])

  const modalOpen = step === '4.4' && invoiceOpen

  const st = confirmed ? 'Confirmed' : 'Pending'
  const rooms = groupReservation.roomsShown
  const headRow = (cols: [string, number][]) => (
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
  const amount = (a: number, tax: number) => (
    <div className="rv-amt">
      <b>{money(a)}</b>
      <span>+Tax {money(tax)}</span>
    </div>
  )

  return (
    <AdminPage>
      <GlobalNav active="Reservations" />
      <div className="rv-page">
        <section className="slds-card rv-head">
          <div className="rv-head-t">
            <div className="rv-t1">
              <span>Reservation</span>
              <a className="slds-text-link rv-num">{groupReservation.number}</a>
            </div>
            <div className="rv-t2">
              <span>Group Block</span>
              <a className="slds-text-link">{group.code}</a>
            </div>
          </div>
          <div className="rv-head-a">
            <button className="slds-button slds-button_neutral" disabled={!confirmed}>
              Check-In
            </button>
            <button className="slds-button slds-button_neutral" disabled={!confirmed}>
              Check-Out
            </button>
            {!confirmed && (
              <ActionButton className="slds-button slds-button_brand" primary={step === '4.4' && !modalOpen} loadingMs={1000} onDone={() => goto('4.3b')}>
                Confirm Reservation
              </ActionButton>
            )}
          </div>
        </section>

        <section className="slds-card rv-path">
          <span>Cancelled</span>
          <span>{confirmed ? 'Pending Approval' : <Badge tone="warn">Pending Approval</Badge>}</span>
          <span>{confirmed ? <Badge tone="mint">Confirmed</Badge> : 'Confirmed'}</span>
        </section>

        <div className="rv-info">
          <section className="slds-card rv-icard">
            <h2>Reservation Info</h2>
            <div className="rv-inner">
              <div className="rv-dates">
                <Field label="Start Date">
                  <DateBox value={start} onChange={setStart} />
                </Field>
                <Field label="End Date">
                  <DateBox value={end} onChange={setEnd} min={start} />
                </Field>
              </div>
              <div className="rv-meta">
                <div>
                  <div className="lds-lbl">Booked by</div>
                  <div>{organizer.name}</div>
                </div>
                <div>
                  <div className="lds-lbl">Taxes enabled</div>
                  <b>True</b>
                </div>
                <div>
                  <div className="lds-lbl">Taxes</div>
                  <div>{money(quote.tax)}</div>
                </div>
              </div>
              <div className="rv-foot">
                <div className="rv-btns">
                  <button className="slds-button slds-button_neutral">Add room</button>
                  <button className="slds-button slds-button_neutral">Add item</button>
                </div>
                <div className="rv-total">
                  <span>Grand Total</span>
                  <b>{money(quote.total)}</b>
                </div>
              </div>
            </div>
          </section>
          <section className="slds-card rv-icard">
            <h2>Billing Info</h2>
            <div className="rv-inner">
              <div className="rv-contact">
                <Field label="Contact Name" style={{ flex: 1 }}>
                  <Input value={organizer.name} />
                </Field>
                <button className="slds-button slds-button_neutral">Change</button>
              </div>
              <div className="rv-meta">
                <div>
                  <div className="lds-lbl">Email</div>
                  <div>{organizer.email}</div>
                </div>
                <div>
                  <div className="lds-lbl">Invoice</div>
                  <a className="slds-text-link ab" onClick={() => goto('4.4')}>
                    {groupReservation.invoice}
                  </a>
                </div>
              </div>
              <div className="rv-foot">
                <div className="rv-btns">
                  <button className="slds-button slds-button_neutral ab" onClick={() => goto('4.4')}>
                    Invoice
                  </button>
                  <button className="slds-button slds-button_neutral">Payments</button>
                </div>
                <div className="rv-total">
                  <span>Balance Due</span>
                  <b>{money(quote.balance)}</b>
                </div>
              </div>
            </div>
          </section>
        </div>

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

          <h3 className="rv-sec">
            Space <small>1</small>
          </h3>
          <div className="rv-tbl">
            <table className="slds-table slds-table_fixed-layout">
              {headRow([['Space', 260], ['Description', 360], ['Start date', 110], ['End date', 110], ['Time', 150], ['Days', 70], ['Status', 150], ['Amount', 150]])}
              <tbody>
                <tr style={{ height: 64 }}>
                  <td>Meeting Hall</td>
                  <td>Venue for workshops and leadership sessions</td>
                  <td>Nov 12, 2026</td>
                  <td>Nov 14, 2026</td>
                  <td>9:00 AM – 5:00 PM</td>
                  <td>3</td>
                  <td>
                    <Badge tone={confirmed ? 'mint' : 'warn'}>{st}</Badge>
                  </td>
                  <td>{amount(quote.meeting.total, quote.meeting.total / 10)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="rv-sec">
            Reservation Rooms <small>(22/22)</small>
          </h3>
          <div className="rv-tbl">
            <table className="slds-table slds-table_fixed-layout">
              {headRow([['Room', 360], ['Guest', 190], ['Start date', 100], ['End date', 100], ['Guests', 90], ['Status', 150], ['Length', 80], ['Room only', 100], ['Total', 100], ['Actions', 88]])}
              <tbody>
                {rooms.map((r, i) => (
                  <tr key={i} style={{ height: 80 }}>
                    <td>
                      <div className="rv-room">
                        <img src={asset(ROOM_IMG[r.type])} width={64} height={64} alt="" />
                        <div>
                          <div className="from">From Cedar Valley Retreat &amp; Conference Center</div>
                          <b>{r.type}</b>
                          <a className="slds-text-link">Assign Room</a>
                        </div>
                      </div>
                    </td>
                    <td>
                      <b>{organizer.name}</b>
                    </td>
                    <td>Nov 12, 2026</td>
                    <td>Nov 15, 2026</td>
                    <td>1 / 0</td>
                    <td>Pending Approval</td>
                    <td>3 nights</td>
                    <td>{amount(r.amount, r.tax)}</td>
                    <td>{amount(r.amount, r.tax)}</td>
                    <td>
                      <button className="slds-button slds-button_icon slds-button_icon-border-filled" title="Show actions">
                        <Icon name="chevrondown" size="x-small" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="rv-showing">
              Showing 7 of 22 rooms · <a className="slds-text-link">View all</a>
            </div>
          </div>
          <div className="rv-add">
            <button className="slds-button slds-button_neutral">Add</button>
          </div>

          <h3 className="rv-sec">
            Items <small>(1)</small>
          </h3>
          <div className="rv-tbl">
            <table className="slds-table slds-table_fixed-layout">
              {headRow([['Item', 460], ['Start date', 110], ['End date', 110], ['Calculation rule', 150], ['Qty', 70], ['Status', 150], ['Amount', 150], ['', 158]])}
              <tbody>
                <tr style={{ height: 72 }}>
                  <td>
                    <div className="rv-room item">
                      <span className="ph" />
                      <div>
                        <b>{quote.catering.name}</b>
                        <div className="from">Three daily meals for the group</div>
                      </div>
                    </div>
                  </td>
                  <td>Nov 12, 2026</td>
                  <td>Nov 14, 2026</td>
                  <td>Per Person</td>
                  <td>{quote.catering.qty}</td>
                  <td>
                    <Badge tone={confirmed ? 'mint' : 'warn'}>{st}</Badge>
                  </td>
                  <td>{amount(quote.catering.total, quote.catering.total / 10)}</td>
                  <td>
                    <a className="slds-text-link">Remove</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
      {modalOpen && (
        <Modal
          title="Reservation Invoice"
          width={800}
          footer={
            <>
              <ActionButton className="slds-button slds-button_neutral" primary loadingMs={600} onDone={() => setInvoiceOpen(false)}>Close</ActionButton>
              <button className="slds-button slds-button_brand">Send</button>
            </>
          }
        >
          <div style={{ fontWeight: 700, color: '#032d60', fontSize: 16, marginBottom: 12 }}>{groupReservation.invoice}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Billed to"><Input value={organizer.name} /></Field>
            <Field label="Invoice Date"><Input value={timeline.depositPaid} /></Field>
            <Field label="Status"><Select value="Partially Paid" /></Field>
            <Field label="Due Date"><Input value={timeline.balanceDue} /></Field>
          </div>
          <Field label="Notes" style={{ marginTop: 12 }}>
            <TextArea rows={2} value={`Annual Leadership Retreat · ${group.code} · Deposit invoice ${money(quote.deposit, 0)} paid Sep 22. Remaining balance ${money(quote.balance, 0)} due Nov 05.`} />
          </Field>
          <table className="slds-table slds-table_bordered slds-table_cell-buffer" style={{ marginTop: 14, fontSize: 12.5 }}>
            <thead>
              <tr>{['Date', 'Code', 'Description', 'Qty', 'Measure', 'Rate', 'Total'].map((h) => <th key={h} style={{ ...th, fontSize: 12 }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {[
                ['11010', 'Room charge: Standard Single Room', quote.roomLines[0].qty * 3, 'Night', quote.roomLines[0].rate, quote.roomLines[0].total],
                ['11010', 'Room charge: Standard Double Room', quote.roomLines[1].qty * 3, 'Night', quote.roomLines[1].rate, quote.roomLines[1].total],
                ['11020', 'Room charge: Cabin', quote.roomLines[2].qty * 3, 'Night', quote.roomLines[2].rate, quote.roomLines[2].total],
                ['21010', 'Space: Meeting Hall', quote.meeting.days, 'Day', quote.meeting.rate, quote.meeting.total],
                ['21020', 'Add-on: Group Catering', quote.catering.qty, 'Guest-day', quote.catering.rate, quote.catering.total],
              ].map(([code, d, qty, m, rate, tot]) => (
                <tr key={d as string}>
                  <td style={{ height: 36 }}>11/12/2026</td>
                  <td>{code}</td>
                  <td>{d}</td>
                  <td>{qty}</td>
                  <td>{m}</td>
                  <td>{money(rate as number)}</td>
                  <td>{money(tot as number)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="slds-card" style={{ borderRadius: 8, padding: 14, marginTop: 12, fontSize: 13 }}>
            {[
              ['Subtotal', money(quote.subtotal)],
              ['Tax', money(quote.tax)],
              ['Total', money(quote.total)],
              ['Amount Paid', money(quote.deposit)],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                <span>{k}</span>
                <span>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <b style={{ color: '#032d60' }}>Balance Due</b>
              <b style={{ color: '#032d60', fontSize: 22 }}>{money(quote.balance)}</b>
            </div>
          </div>
        </Modal>
      )}
    </AdminPage>
  )
}
