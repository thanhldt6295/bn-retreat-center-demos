import { useEffect, useState } from 'react'
import { ActionButton } from '../../components/shared/ActionButton'
import { DatePicker } from '../../components/shared/DatePicker'
import { Badge, Field, GlobalNav, Modal } from '../../components/admin/Admin'
import { group, groupReservation, money, organizer, quote, timeline } from '../../data/demo'
import { usePlayer, type SceneProps } from '../../player/Player'

const th = { fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '.04em', fontWeight: 700 } as const

const DateBox = ({ value, onChange, min }: { value: string; onChange: (v: string) => void; min?: string }) => (
  <DatePicker theme="lds" value={value} onChange={onChange} min={min}>
    {(open) => (
      <div className="lds-input" style={{ width: 124, borderRadius: 4, borderColor: open ? '#0b5cff' : undefined }}>
        {value}
        <svg width="12" height="12" viewBox="0 0 14 14" fill="#0b5cff" style={{ marginLeft: 'auto' }}>
          <path d="M3 1h1.5v1.5h5V1H11v1.5h1.5V13h-11V2.5H3V1zm-.5 5v5.5h9V6h-9z" />
        </svg>
      </div>
    )}
  </DatePicker>
)

const ROOM_IMG = ['#a8714a', '#a8714a', '#a8714a', '#4a5560', '#4a5560', '#6d4a2e', '#6d4a2e']

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

  return (
    <div className="lds">
      <GlobalNav active="Reservations" />
      <div className="lds-page" style={{ paddingTop: 12 }}>
        <div className="lds-card" style={{ borderRadius: 8, padding: '14px 12px', display: 'flex', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, color: '#444' }}>
              Reservation <b style={{ color: '#0b5cff', fontSize: 22, marginLeft: 6, fontWeight: 500 }}>{groupReservation.number}</b>
            </div>
            <div style={{ fontSize: 12, color: '#444', marginTop: 4 }}>
              Group Block <a className="lds-link" style={{ marginLeft: 6 }}>{group.code}</a>
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button className="lds-btn outline" disabled={!confirmed}>Check-In</button>
            <button className="lds-btn outline" disabled={!confirmed}>Check-Out</button>
            {!confirmed && (
              <ActionButton
                className="lds-btn brand"
                primary={step === '4.4' && !modalOpen}
                loadingMs={1000}
                onDone={() => goto('4.3b')}
              >
                Confirm Reservation
              </ActionButton>
            )}
          </div>
        </div>

        <div className="lds-card" style={{ borderRadius: 8, margin: '12px 0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', textAlign: 'center', padding: '10px 0', fontSize: 12, fontWeight: 700 }}>
          <span>Cancelled</span>
          <span>{confirmed ? 'Pending Approval' : <Badge tone="warn">Pending Approval</Badge>}</span>
          <span>{confirmed ? <Badge tone="mint">Confirmed</Badge> : 'Confirmed'}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="lds-card" style={{ borderRadius: 8, padding: 12, minHeight: 210 }}>
            <div style={{ fontSize: 20, color: '#032d60', margin: '6px 0 12px' }}>Reservation Info</div>
            <div className="lds-card" style={{ borderRadius: 6, padding: 12, boxShadow: 'none' }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <Field label="Start Date"><DateBox value={start} onChange={setStart} /></Field>
                <Field label="End Date"><DateBox value={end} onChange={setEnd} min={start} /></Field>
              </div>
              <div style={{ display: 'flex', gap: 22, margin: '12px 0', fontSize: 12 }}>
                <div><div style={{ color: '#555' }}>Booked by</div><div style={{ marginTop: 3 }}>{organizer.name}</div></div>
                <div><div style={{ color: '#555' }}>Taxes enabled</div><b style={{ display: 'block', marginTop: 3 }}>True</b></div>
                <div><div style={{ color: '#555' }}>Taxes</div><div style={{ marginTop: 3 }}>{money(quote.tax)}</div></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button className="lds-btn outline" style={{ marginRight: 8 }}>Add room</button>
                <button className="lds-btn outline">Add item</button>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: '#555' }}>Grand Total</div>
                  <div style={{ fontSize: 24, color: '#032d60', fontWeight: 500 }}>{money(quote.total)}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="lds-card" style={{ borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 20, color: '#032d60', margin: '6px 0 12px' }}>Billing Info</div>
            <div className="lds-card" style={{ borderRadius: 6, padding: 12, boxShadow: 'none' }}>
              <div style={{ fontSize: 11.5, color: '#555' }}>Contact Name</div>
              <div style={{ display: 'flex', gap: 8, margin: '4px 0 12px' }}>
                <div className="lds-input" style={{ borderRadius: 4, flex: 1 }}>{organizer.name}</div>
                <button className="lds-btn outline">Change</button>
              </div>
              <div style={{ display: 'flex', gap: 30, fontSize: 12, paddingBottom: 12, borderBottom: '1px solid #ddd' }}>
                <div><div style={{ color: '#555' }}>Email</div><div style={{ marginTop: 3 }}>{organizer.email}</div></div>
                <div><div style={{ color: '#555' }}>Invoice</div><a className="lds-link ab" style={{ display: 'block', marginTop: 3 }} onClick={() => goto('4.4')}>{groupReservation.invoice}</a></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', marginTop: 10 }}>
                <button className="lds-btn outline ab" style={{ marginRight: 8 }} onClick={() => goto('4.4')}>Invoice</button>
                <button className="lds-btn outline">Payments</button>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: '#555' }}>Balance Due</div>
                  <div style={{ fontSize: 24, color: '#032d60', fontWeight: 500 }}>{money(quote.balance)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lds-card" style={{ borderRadius: 8, marginTop: 12, padding: '16px 24px 24px' }}>
          <div style={{ display: 'flex', gap: 22, fontSize: 13, borderBottom: '1px solid #ddd', paddingBottom: 8 }}>
            <b style={{ color: '#0b5cff', borderBottom: '2px solid #0b5cff', paddingBottom: 8 }}>Details</b>
            <span>Payments</span>
            <span>Files</span>
            <span>Activities</span>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#032d60', margin: '22px 0 10px' }}>Space <small style={{ fontWeight: 400, color: '#555' }}>1</small></div>
          <div className="lds-card" style={{ borderRadius: 6, overflow: 'hidden' }}>
            <table className="lds-table" style={{ fontSize: 12 }}>
              <thead>
                <tr>{['Space', 'Description', 'Start date', 'End date', 'Time', 'Days', 'Status', 'Amount'].map((h) => <th key={h} style={th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ height: 48 }}>Meeting Hall</td>
                  <td>Venue for workshops and leadership sessions</td>
                  <td>Nov 12, 2026</td>
                  <td>Nov 14, 2026</td>
                  <td>9:00 AM – 5:00 PM</td>
                  <td>3</td>
                  <td><Badge tone={confirmed ? 'mint' : 'warn'}>{confirmed ? 'Confirmed' : 'Pending'}</Badge></td>
                  <td><b>{money(quote.meeting.total)}</b><div style={{ color: '#666' }}>+Tax {money(quote.meeting.total / 10)}</div></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#032d60', margin: '22px 0 10px' }}>
            Reservation Rooms <small style={{ fontWeight: 400, color: '#555' }}>(22/22)</small>
          </div>
          <div className="lds-card" style={{ borderRadius: 6, overflow: 'hidden' }}>
            <table className="lds-table" style={{ fontSize: 12 }}>
              <thead>
                <tr>{['Room', 'Guest', 'Start date', 'End date', 'Guests', 'Status', 'Length', 'Room only', 'Total', 'Actions'].map((h) => <th key={h} style={th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {groupReservation.roomsShown.map((r, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #e5e5e5' }}>
                    <td style={{ height: 58 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ width: 46, height: 46, borderRadius: 3, background: ROOM_IMG[i], flex: 'none' }} />
                        <div>
                          <div style={{ fontSize: 10.5, color: '#555' }}>From Cedar Valley Retreat &amp; Conference Center</div>
                          <b style={{ color: '#032d60', fontSize: 12.5 }}>{r.type}</b>
                          <div><a className="lds-link">Assign Room</a></div>
                        </div>
                      </div>
                    </td>
                    <td><b>{organizer.name}</b></td>
                    <td>Nov 12, 2026</td>
                    <td>Nov 15, 2026</td>
                    <td>1 / 0</td>
                    <td>Pending Approval</td>
                    <td>3 nights</td>
                    <td><b>{money(r.amount)}</b><div style={{ color: '#666' }}>+Tax {money(r.tax)}</div></td>
                    <td><b>{money(r.amount)}</b><div style={{ color: '#666' }}>+Tax {money(r.tax)}</div></td>
                    <td><span style={{ color: '#0b5cff', fontSize: 18 }}>⌄</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '10px 12px', fontSize: 12 }}>Showing 7 of 22 rooms · <a className="lds-link">View all</a></div>
          </div>
          <div style={{ textAlign: 'center', margin: '16px 0' }}>
            <button className="lds-btn outline">Add</button>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#032d60', margin: '8px 0 10px' }}>Items <small style={{ fontWeight: 400, color: '#555' }}>(1)</small></div>
          <div className="lds-card" style={{ borderRadius: 6, overflow: 'hidden' }}>
            <table className="lds-table" style={{ fontSize: 12 }}>
              <thead>
                <tr>{['Item', 'Start date', 'End date', 'Calculation rule', 'Qty', 'Status', 'Amount', ''].map((h) => <th key={h} style={th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ height: 54 }}><b style={{ color: '#032d60' }}>{quote.catering.name}</b><div style={{ color: '#666' }}>Three daily meals for the group</div></td>
                  <td>Nov 12, 2026</td>
                  <td>Nov 14, 2026</td>
                  <td>Per Person</td>
                  <td>{quote.catering.qty}</td>
                  <td><Badge tone={confirmed ? 'mint' : 'warn'}>{confirmed ? 'Confirmed' : 'Pending'}</Badge></td>
                  <td><b>{money(quote.catering.total)}</b><div style={{ color: '#666' }}>+Tax {money(quote.catering.total / 10)}</div></td>
                  <td><a className="lds-link">Remove</a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modalOpen && (
        <Modal
          title="Reservation Invoice"
          width={800}
          footer={
            <>
              <ActionButton className="lds-btn outline" primary loadingMs={600} onDone={() => setInvoiceOpen(false)}>Close</ActionButton>
              <button className="lds-btn brand">Send</button>
            </>
          }
        >
          <div style={{ fontWeight: 700, color: '#032d60', fontSize: 16, marginBottom: 12 }}>{groupReservation.invoice}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Billed to"><div className="lds-input">{organizer.name}</div></Field>
            <Field label="Invoice Date"><div className="lds-input">{timeline.depositPaid}</div></Field>
            <Field label="Status"><div className="lds-input lds-select">Partially Paid</div></Field>
            <Field label="Due Date"><div className="lds-input">{timeline.balanceDue}</div></Field>
          </div>
          <Field label="Notes" style={{ marginTop: 12 }}>
            <div className="lds-input area" style={{ height: 58 }}>
              Annual Leadership Retreat · {group.code} · Deposit invoice {money(quote.deposit, 0)} paid Sep 22. Remaining balance {money(quote.balance, 0)} due Nov 05.
            </div>
          </Field>
          <table className="lds-table" style={{ marginTop: 14, fontSize: 12.5 }}>
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
          <div className="lds-card" style={{ borderRadius: 8, padding: 14, marginTop: 12, fontSize: 13 }}>
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
    </div>
  )
}
