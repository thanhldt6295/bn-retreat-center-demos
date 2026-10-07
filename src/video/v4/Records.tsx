import { useEffect, useState, type ReactNode } from 'react'
import { AdminPage, Badge, GlobalNav } from '../../components/admin/Admin'
import { Amount, ReservationRecord, type RvRoom } from '../../components/admin/ReservationRecord'
import { money, pos } from '../../data/demo'
import { usePlayer, usePrimary, type SceneProps } from '../../player/Player'
import '../v3/req.css'
import './records.css'

/* Admin record screens of V4 (Figma 265:1819 R0, 259:2615 R1, 260:1084 R2, 260:1848 R3, 283:11449 R2b, 271:2600 R4). */
const room = (flash = false, onLink?: () => void): RvRoom => ({ type: 'Standard Double Room', guest: 'Priya Nair', amount: 420, tax: 42, status: 'Confirmed', link: 'Room 204', flash, onLink })

function Tbl({ cols, rows, className = '' }: { cols: [string, number][]; rows: ReactNode[][]; className?: string }) {
  return (
    <div className={`rv-tbl ${className}`}>
      <table className="slds-table slds-table_fixed-layout">
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
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} style={{ height: 52 }}>
              {r.map((c, i) => (
                <td key={i}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const PosOrders = () => (
  <>
    <h3 className="rv-sec">
      POS orders <small>(1)</small>
    </h3>
    <Tbl
      cols={[['Order', 100], ['Date & time', 140], ['Items', 380], ['Staff', 150], ['Status', 160], ['Amount', 130], ['', 0]]}
      rows={[
        [
          pos.order,
          'Nov 12, 2026 · 7:42 PM',
          '1x Coffee, 1x Grilled Beef Steak',
          'Sam Patel',
          <Badge key="s" tone="mint">Charged to room</Badge>,
          <Amount key="a" a={pos.total} tax={pos.tax} />,
          <a key="l" className="slds-text-link">View order</a>,
        ],
      ]}
    />
  </>
)
const ServicesTbl = () => (
  <>
    <h3 className="rv-sec">
      Services <small>(3)</small>
    </h3>
    <Tbl
      cols={[['Service', 270], ['Date & time', 250], ['Source', 250], ['Status', 140], ['Amount', 230], ['', 0]]}
      rows={[
        ['Guided Forest Walk', 'Nov 13, 2026 · 9:00 AM'],
        ['Vegetarian dinner', 'Fri, Nov 13, 2026 · 6:30 PM'],
        ['Airport shuttle seat', 'Thu, Nov 12, 2026 · 1:30 PM'],
      ].map(([a, b]) => [
        a,
        b,
        'Added in the guest portal',
        <Badge key="s" tone="mint">Confirmed</Badge>,
        <div key="p" className="rv-amt">
          <b>$0.00</b>
          <span>Included in the group booking</span>
        </div>,
        <a key="l" className="slds-text-link">View request</a>,
      ])}
    />
  </>
)

/* R0 checked in · R1 with POS orders · R4 checked out */
export function PriyaRecord({ step, from, goto }: SceneProps) {
  const { toast } = usePlayer()
  const [start, setStart] = useState('Nov 12, 2026')
  const [end, setEnd] = useState('Nov 15, 2026')
  const out = step === 'R4'
  const withPos = step !== 'R0'
  useEffect(() => {
    if (step === 'R0' && from === 'K3') toast('Priya Nair checked in with the QR pass.', 'admin', 4200)
    if (step === 'R4' && from === 'R2b') toast('Priya Nair checked out. Balance paid by card ($37.95).', 'admin', 4200)
  }, [step, from, toast])
  usePrimary(step === 'R0' ? () => goto('P1') : step === 'R1' ? () => goto('R2') : null)
  return (
    <ReservationRecord
      number="#00032"
      groupBlock="GBR-008"
      confirmed
      headBadge={<Badge tone="mint">{out ? 'Checked out' : 'Checked in'}</Badge>}
      headNote={out ? 'Checked in Nov 12, 3:45 PM · Checked out Nov 15, 10:42 AM · Sam Patel' : 'Checked in Nov 12, 2026 · 3:45 PM · Sam Patel · QR scan at POS'}
      checkInDisabled
      checkOutDisabled={out}
      start={start}
      end={end}
      onStart={setStart}
      onEnd={setEnd}
      bookedBy="Priya Nair"
      tax={withPos ? 45.45 : 42}
      grandTotal={withPos ? pos.stayTotal : 462}
      contact="Priya Nair"
      email="priya@horizon.example"
      invoice="INV-00032"
      balance={withPos && !out ? pos.total : 0}
      onInvoice={() => goto(out ? 'R2b' : 'R2')}
      roomsTitle="(1/1)"
      rooms={[room(false)]}
      afterRooms={
        withPos && (
          <>
            <PosOrders />
            <ServicesTbl />
          </>
        )
      }
    />
  )
}

/* R2 invoice (stay + POS) · R2b paid */
export function Invoice({ step, goto }: SceneProps) {
  const paid = step === 'R2b'
  usePrimary(step === 'R2' ? () => goto('R3') : paid ? () => goto('R4') : null)
  const src = (t: 'Stay' | 'POS') => <Badge tone={t === 'POS' ? 'mint' : undefined} className={t === 'Stay' ? 'rv-stay' : ''}>{t}</Badge>
  return (
    <AdminPage>
      <GlobalNav active="BN Invoices" />
      <div className="rc-page">
        <section className="slds-card rc-head">
          <div>
            <div className="s">Invoice</div>
            <div className="t">
              <a className="slds-text-link">INV-00032</a>
              <Badge tone={paid ? 'mint' : 'warn'}>{paid ? 'Paid' : 'Partially paid'}</Badge>
            </div>
            <div className="s">
              Reservation <a className="slds-text-link">#00032</a> · Priya Nair · Nov 12 – 15, 2026
            </div>
          </div>
          <div className="rc-act">
            <button className="slds-button slds-button_neutral">Print</button>
            <button className="slds-button slds-button_neutral">Send to guest</button>
            <button className="slds-button slds-button_brand">Take payment</button>
          </div>
        </section>
        <div className="rc-cols">
          <section className="slds-card rc-main">
            <h2>Charges</h2>
            <Tbl
              cols={[['Date', 78], ['Description', 320], ['Source', 100], ['Qty', 70], ['Rate', 100], ['Total', 100]]}
              rows={[
                ['Nov 12', 'Room charge: Standard Double Room (3 nights)', src('Stay'), '3', '$140.00', '$420.00'],
                ['Nov 12', 'Tax on room (10%)', src('Stay'), '—', '—', '$42.00'],
                ['Nov 12', 'Coffee', src('POS'), '1', '$6.50', '$6.50'],
                ['Nov 12', 'Grilled Beef Steak (Medium)', src('POS'), '1', '$28.00', '$28.00'],
                ['Nov 12', 'Tax on POS order (10%)', src('POS'), '—', '—', '$3.45'],
              ]}
            />
          </section>
          <div className="rc-side">
            <section className="slds-card rc-c">
              <h2>Summary</h2>
              <div className="sl"><span>Subtotal</span><span>$454.50</span></div>
              <div className="sl"><span>Tax</span><span>$45.45</span></div>
              <div className="sl b"><span>Total</span><span>{money(pos.stayTotal)}</span></div>
              <div className="sl"><span>Paid</span><span key={String(paid)}>{money(paid ? pos.stayTotal : pos.stayPaidAtBooking)}</span></div>
              <div className="sl b"><span>Balance due</span><span key={String(paid)}>{money(paid ? 0 : pos.total)}</span></div>
            </section>
            <section className="slds-card rc-c">
              <h2>Payments</h2>
              <b className="pm">Card · Visa ending 4242</b>
              <span className="pd">Sep 24, 2026 · Paid at booking · $462.00</span>
              {paid ? (
                <>
                  <b className="pm" style={{ marginTop: 12 }}>Card · Visa ending 4242</b>
                  <span className="pd">Nov 15, 2026 · Paid at check-out · $37.95</span>
                </>
              ) : (
                <>
                  <b className="pm" style={{ marginTop: 12 }}>Balance $37.95</b>
                  <span className="pd">POS order charged to the room · collected at check-out</span>
                </>
              )}
            </section>
          </div>
        </div>
      </div>
    </AdminPage>
  )
}

/* R3 contact record (Figma 260:1848) */
export function Contact({ goto }: SceneProps) {
  usePrimary(() => goto('P6'))
  return (
    <AdminPage>
      <GlobalNav active="Contacts" />
      <div className="rc-page">
        <section className="slds-card rc-head">
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <span className="rc-av">PN</span>
            <div>
              <div className="s">Contact</div>
              <div className="t">
                <a className="slds-text-link">Priya Nair</a>
                <Badge tone="mint">In house</Badge>
              </div>
              <div className="s">Horizon Foundation · priya@horizon.example · +1 415 555 0142</div>
            </div>
          </div>
          <div className="rc-act">
            <button className="slds-button slds-button_neutral">Edit</button>
            <button className="slds-button slds-button_neutral">New reservation</button>
          </div>
        </section>
        <div className="rc-cols">
          <div className="rc-lcol">
            <section className="slds-card rc-main">
              <h2>
                Reservations <small>(1)</small>
              </h2>
              <Tbl
                cols={[['Reservation', 100], ['Dates', 140], ['Room', 190], ['Status', 100], ['Total', 100], ['Balance', 0]]}
                rows={[[<a key="a" className="slds-text-link">#00032</a>, 'Nov 12 – 15, 2026', 'Standard Double Room · 204 · Group…', <Badge key="b" tone="mint">Confirmed</Badge>, '$499.95', '$37.95']]}
              />
            </section>
            <section className="slds-card rc-main">
              <h2>
                POS orders <small>(1)</small>
              </h2>
              <Tbl cols={[['Order', 90], ['Date & time', 150], ['Items', 240], ['Staff', 110], ['Amount', 0]]} rows={[[pos.order, 'Nov 12, 2026 · 7:42 PM', '1x Coffee, 1x Grilled Beef Steak', 'Sam Patel', '$37.95']]} />
            </section>
            <section className="slds-card rc-main">
              <h2>
                Services <small>(3)</small>
              </h2>
              <Tbl
                cols={[['Service', 140], ['Date & time', 150], ['Source', 190], ['Status', 100], ['Amount', 0]]}
                rows={[
                  ['Guided Forest W…', 'Nov 13, 2026 · 9:00 AM', 'Added in the guest portal', 'Confirmed', '$0.00 · includ…'],
                  ['Vegetarian dinner', 'Fri, Nov 13, 2026 · 6:30 PM', 'Added in the guest portal', 'Confirmed', '$0.00 · includ…'],
                  ['Airport shuttle s…', 'Thu, Nov 12, 2026 · 1:30 PM', 'Added in the guest portal', 'Confirmed', '$0.00 · includ…'],
                ]}
              />
            </section>
            <section className="slds-card rc-main">
              <h2>
                Payments <small>(2)</small>
              </h2>
              <Tbl
                cols={[['Date', 110], ['Method', 200], ['For', 220], ['Amount', 0]]}
                rows={[
                  ['Sep 24, 2026', 'Card · Visa ending 4242', 'Stay (paid at booking)', '$462.00'],
                  ['Nov 12, 2026', 'Charged to room', 'POS-1058 · due at check-out', '$37.95'],
                ]}
              />
            </section>
          </div>
          <div className="rc-rcol">
            <section className="slds-card rc-c">
              <h2>
                Documents &amp; signatures <small>(2)</small>
              </h2>
              {[
                ['Stay waiver', 'Signed by Priya Nair · Nov 12, 3:40 PM'],
                ['Group contract GBR-008', 'Signed by the organizer, Maya Thompson · Sep 22, 2026'],
              ].map(([a, b]) => (
                <div className="doc" key={a}>
                  <div>
                    <b>{a}</b>
                    <span>{b}</span>
                  </div>
                  <Badge tone="mint">Signed</Badge>
                </div>
              ))}
            </section>
            <section className="slds-card rc-c">
              <h2>History</h2>
              <ul className="rq-tl">
                {[
                  ['Booked with group code GBR-008', 'Sep 24, 2026 · Guest booking page'],
                  ['Paid $462.00 by card', 'Sep 24, 2026 · Booking payment'],
                  ['Checked in with the QR pass', 'Nov 12, 2026 · 3:45 PM · Sam Patel · QR scan at POS'],
                  ['POS order POS-1058 charged to room', 'Nov 12, 2026 · 7:42 PM · Sam Patel · $37.95'],
                  ['Checked out · balance $37.95 paid by card', 'Nov 15, 2026 · 10:42 AM · Sam Patel'],
                ].map(([a, b]) => (
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
        </div>
      </div>
    </AdminPage>
  )
}

