import { useEffect, useState } from 'react'
import { ActionButton } from '../../components/shared/ActionButton'
import { Badge, Field, Input, Modal, Select, TextArea } from '../../components/admin/Admin'
import { ReservationRecord } from '../../components/admin/ReservationRecord'
import { group, groupReservation, money, organizer, quote, timeline } from '../../data/demo'
import { usePlayer, type SceneProps } from '../../player/Player'

const th = { fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '.04em', fontWeight: 700 } as const

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
  const badge = <Badge tone={confirmed ? 'mint' : 'warn'}>{st}</Badge>

  return (
    <ReservationRecord
      number={groupReservation.number}
      groupBlock={group.code}
      confirmed={confirmed}
      headActions={
        !confirmed && (
          <ActionButton className="slds-button slds-button_brand" primary={step === '4.4' && !modalOpen} loadingMs={1000} onDone={() => goto('4.3b')}>
            Confirm Reservation
          </ActionButton>
        )
      }
      start={start}
      end={end}
      onStart={setStart}
      onEnd={setEnd}
      bookedBy={organizer.name}
      tax={quote.tax}
      grandTotal={quote.total}
      contact={organizer.name}
      email={organizer.email}
      invoice={groupReservation.invoice}
      balance={quote.balance}
      onInvoice={() => goto('4.4')}
      space={{ amount: quote.meeting.total, tax: quote.meeting.total / 10, status: badge }}
      roomsTitle="(22/22)"
      rooms={groupReservation.roomsShown.map((r) => ({
        type: r.type,
        guest: organizer.name,
        amount: r.amount,
        tax: r.tax,
        status: 'Pending Approval',
        link: 'Assign Room',
      }))}
      roomsFooter={
        <div className="rv-showing">
          Showing 7 of 22 rooms · <a className="slds-text-link">View all</a>
        </div>
      }
      items={{ name: quote.catering.name, sub: 'Three daily meals for the group', qty: quote.catering.qty, amount: quote.catering.total, tax: quote.catering.total / 10, status: badge }}
    >
      {modalOpen && (
        <Modal
          title="Reservation Invoice"
          width={880}
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
          <table className="slds-table slds-table_bordered slds-table_cell-buffer" style={{ marginTop: 20, fontSize: 13 }}>
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
                  <td style={{ height: 40 }}>11/12/2026</td>
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
          <div className="slds-card" style={{ borderRadius: 8, padding: '16px 16px 12px', marginTop: 16, fontSize: 13 }}>
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
    </ReservationRecord>
  )
}
