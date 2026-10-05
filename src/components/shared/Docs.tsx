import type { ReactNode } from 'react'
import { agenda, group, money, organizer, quote, timeline, venue } from '../../data/demo'
import './docs.css'

/* The Banquet Event Order and Contract paper pages, shared by admin preview (3.1b) and guest viewers (G4b/G4c). */

function Head({ kind }: { kind: string }) {
  return (
    <div className="doc-head">
      <div>
        <div className="doc-brand">CEDAR VALLEY</div>
        <div className="doc-sub">Retreat &amp; Conference Center</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div className="doc-kind">{kind}</div>
        <div className="doc-code">{group.code}</div>
      </div>
    </div>
  )
}

const Sec = ({ children }: { children: ReactNode }) => <div className="doc-sec">{children}</div>

function Table({ head, rows, right = [] }: { head: string[]; rows: (string | number)[][]; right?: number[] }) {
  return (
    <table className="doc-table">
      <thead>
        <tr>
          {head.map((h, i) => (
            <th key={h} style={{ textAlign: i === 0 ? 'left' : right.includes(i) ? 'right' : 'left' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => (
              <td key={j} style={{ textAlign: j === 0 ? 'left' : right.includes(j) ? 'right' : 'left' }}>{c}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const Sigs = ({ pending }: { pending?: boolean }) => (
  <div className="doc-sigs">
    <div>
      <div className="line" />
      <b>Client signature{pending ? ' · pending' : ''}</b>
      <span>{organizer.name} · {group.org}</span>
      {!pending && <span>Date: ___ / ___ / _____</span>}
    </div>
    <div>
      <div className="line" />
      <b>Venue signature{pending ? ' · pending' : ''}</b>
      <span>{pending ? 'Jordan Reyes · Events Manager' : venue.name}</span>
      {!pending && <span>Date: ___ / ___ / _____</span>}
    </div>
  </div>
)

/** variant "admin" = preview as seen by staff (3.1b), "guest" = full BEO (G4b) */
export function BeoDoc({ variant }: { variant: 'admin' | 'guest' }) {
  const guest = variant === 'guest'
  return (
    <div className="doc">
      <Head kind="BANQUET EVENT ORDER" />
      <div className="doc-grid">
        <div><small>GROUP</small><b>{group.name}</b></div>
        <div><small>ORGANIZER</small><b>{organizer.name}</b></div>
        <div><small>DATES</small><b>Nov 12 – Nov 15, 2026 · 3 nights</b></div>
        <div><small>ROOMS</small><b>22 rooms · 12 single bed, 10 double bed</b></div>
      </div>
      {guest && (
        <>
          <Sec>AGENDA</Sec>
          <Table
            head={['Session', 'Day', 'Time', 'Location', 'Guests']}
            rows={agenda.map((a) => [a.name, a.day, a.time.replace(' – ', ' – '), a.location, a.guests])}
            right={[4]}
          />
        </>
      )}
      <Sec>{guest ? 'ROOM SETUP' : 'ROOM SETUP'}</Sec>
      <Table
        head={['Room type', 'Qty', 'Rate', 'Total']}
        rows={quote.roomLines.map((l) => [`${l.name} (3 nights)`, l.qty, money(l.rate), money(l.total)])}
        right={[1, 2, 3]}
      />
      <Sec>{guest ? 'ADD-ONS' : 'SPACE AND ADD-ONS'}</Sec>
      <Table
        head={[guest ? 'Add-on' : 'Item', 'Qty', 'Rate', 'Total']}
        rows={[
          [quote.meeting.name, quote.meeting.days, money(quote.meeting.rate), money(quote.meeting.total)],
          [quote.catering.name, quote.catering.qty, money(quote.catering.rate), money(quote.catering.total)],
        ]}
        right={[1, 2, 3]}
      />
      <div className="doc-totals">
        <div><span>Rooms</span><b>{money(quote.roomsTotal)}</b></div>
        <div><span>{guest ? 'Add-ons' : 'Space and add-ons'}</span><b>{money(quote.addOnsTotal)}</b></div>
        <div><span>Taxes (10%)</span><b>{money(quote.tax)}</b></div>
        <div className="grand"><span>Total</span><b>{money(quote.total)}</b></div>
        {guest && (
          <>
            <div><span>Deposit due on signing (50%)</span><b>{money(quote.deposit)}</b></div>
            <div><span>Balance due {timeline.balanceDue.replace(', 2026', ', 2026')}</span><b>{money(quote.balance)}</b></div>
          </>
        )}
      </div>
      <Sigs pending={!guest} />
    </div>
  )
}

export function ContractDoc() {
  const clause = (n: string, h: string, t: string) => (
    <div className="doc-clause">
      <b>{n}. {h}</b>
      <p>{t}</p>
    </div>
  )
  return (
    <div className="doc">
      <Head kind="GROUP BOOKING CONTRACT" />
      <div className="doc-grid">
        <div><small>CLIENT</small><b>{group.org} · {organizer.name}</b></div>
        <div><small>VENUE</small><b>{venue.name}</b></div>
        <div><small>EVENT</small><b>Annual Leadership Retreat</b></div>
        <div><small>DATES</small><b>Nov 12 – Nov 15, 2026</b></div>
      </div>
      {clause('1', 'Event', `${venue.name} will host the ${group.name} from Nov 12 to Nov 15, 2026, including 22 rooms (12 single bed, 10 double bed), the Meeting Hall for 3 days and group catering for ${group.guests} guests, as listed in BEO ${group.code}.`)}
      {clause('2', 'Payment', `The total is ${money(quote.total)} including taxes. A 50% deposit (${money(quote.deposit)}) is due when this contract is signed. The remaining 50% (${money(quote.balance)}) is due seven days before arrival (${timeline.balanceDue}).`)}
      {clause('3', 'Changes', 'Room counts and add-ons can be adjusted until Oct 30, 2026. Changes after that date depend on availability and may change the total.')}
      {clause('4', 'Cancellation', 'Cancellations after Oct 30, 2026 are charged according to the venue cancellation policy attached to this booking.')}
      {clause('5', 'Billing', `All rooms and add-ons are billed to the organizer on one invoice. Guests who prefer to pay separately may book with the group code ${group.code}.`)}
      {clause('6', 'Electronic signature', 'By signing electronically, both parties agree that the signature has the same effect as a handwritten signature.')}
      <Sigs />
    </div>
  )
}
