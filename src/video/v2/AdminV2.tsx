import { useEffect, useState } from 'react'
import {
  AvailabilityPage,
  UNITS,
  type Booking,
  type Demo,
  type Unit,
} from '../../components/admin/AvailabilityGrid'
import { AdminPage, Badge, Check, Field, GlobalNav, Input, Modal, ObjectIcon, Select, TextArea } from '../../components/admin/Admin'
import { ReservationRecord, type RvRoom } from '../../components/admin/ReservationRecord'
import { ActionButton } from '../../components/shared/ActionButton'
import { afterGuestBookings, group, money, organizer, v2Reservations } from '../../data/demo'
import { usePlayer, usePrimary, type SceneProps } from '../../player/Player'

/* ---------------- C1 · Reservations list (Figma 239:13379) ---------------- */
const LIST_COLS: [string, number][] = [
  ['Reservation', 129],
  ['Contact', 336],
  ['Group Block', 149],
  ['Start Date', 131],
  ['End Date', 129],
  ['Rooms', 82],
  ['Total', 129],
  ['Balance', 130],
  ['Status', 0],
]

const listRows = [
  { no: '#00036', contact: 'Tom Becker', block: '—', rooms: 1, total: 693, balance: 0, status: 'Confirmed' },
  { no: '#00035', contact: 'Marcus Webb', block: group.code, rooms: 1, total: 627, balance: 627, status: 'Pending Approval' },
  { no: '#00034', contact: 'Elena Rossi', block: group.code, rooms: 1, total: 462, balance: 0, status: 'Confirmed' },
  { no: '#00033', contact: 'Grace Liu', block: group.code, rooms: 1, total: 462, balance: 0, status: 'Confirmed' },
  { no: '#00032', contact: 'Priya Nair', block: group.code, rooms: 1, total: 462, balance: 0, status: 'Confirmed' },
  { no: '#00031', contact: organizer.name, block: group.code, rooms: afterGuestBookings.rooms, total: afterGuestBookings.total, balance: afterGuestBookings.balance, status: 'Confirmed' },
]

export function ResList({ goto }: SceneProps) {
  usePrimary(() => goto('C5'))
  return (
    <AdminPage>
      <GlobalNav active="Reservations" />
      <div className="lds-list-head">
        <div className="lds-record-title">
          <ObjectIcon size={40} color="#04a58f" />
          <div className="tx">
            <div style={{ fontSize: 13, color: '#5c5c5c' }}>Reservations</div>
            <div className="lds-view">
              <h1>All reservations</h1>
            </div>
          </div>
        </div>
        <div className="slds-button-group" role="group">
          <button className="slds-button slds-button_neutral">New</button>
        </div>
      </div>
      <div className="lds-list-meta">{listRows.length} items · Sorted by Reservation # · Updated a few seconds ago</div>
      <div className="slds-card lds-list-card">
        <div className="lds-list-tools" style={{ alignItems: 'flex-end' }}>
          <div className="slds-form-element" style={{ width: 228 }}>
            <label className="slds-form-element__label" style={{ display: 'block' }}>
              Search
            </label>
            <input className="slds-input" placeholder="Search this list..." aria-label="Search this list" />
          </div>
          <button className="slds-button slds-button_neutral" style={{ marginLeft: 'auto' }}>
            List view
          </button>
        </div>
        <table className="slds-table slds-table_fixed-layout lds-list-table">
          <colgroup>
            {LIST_COLS.map(([, w], i) => (
              <col key={i} style={{ width: w || undefined }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {LIST_COLS.map(([h]) => (
                <th key={h} scope="col" style={{ textTransform: 'uppercase' }}>
                  <div className="slds-truncate">{h}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {listRows.map((r) => (
              <tr key={r.no} style={{ height: 48, cursor: r.no === '#00031' ? 'pointer' : 'default' }} onClick={r.no === '#00031' ? () => goto('C5') : r.no === '#00032' ? () => goto('C2') : undefined}>
                <td>
                  <a className="slds-text-link">{r.no}</a>
                </td>
                <td>{r.contact}</td>
                <td>{r.block === '—' ? '—' : <a className="slds-text-link">{r.block}</a>}</td>
                <td>Nov 12, 2026</td>
                <td>Nov 15, 2026</td>
                <td>{r.rooms}</td>
                <td>{money(r.total)}</td>
                <td>{money(r.balance)}</td>
                <td>
                  <Badge tone={r.status === 'Confirmed' ? 'mint' : 'warn'}>{r.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminPage>
  )
}

/* ---------------- shared record pieces ---------------- */
const Avail = ({ ok, text }: { ok: boolean; text: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '16px 0' }}>
    <Badge tone={ok ? 'mint' : 'warn'}>{ok ? 'Available' : 'Not available'}</Badge>
    <span style={{ fontSize: 13, color: '#2e2e2e' }}>{text}</span>
  </div>
)

function BlockUsage({ assigned }: { assigned: number }) {
  const single = assigned === 8 ? 4 : 3
  const open = 22 - assigned
  const bars: [string, number, number][] = [
    ['Standard Single Room', single, 12],
    ['Standard Double Room', 3, 6],
    ['Cabin', 1, 4],
  ]
  return (
    <section className="slds-card rv-block">
      <div className="rv-block-h">
        <h2>Room block usage</h2>
        <span>
          {group.code} · Nov 12 – Nov 15, 2026
        </span>
      </div>
      <div className="rv-stats">
        <div>
          <span>Rooms in block</span>
          <b>22</b>
        </div>
        <div>
          <span>Assigned (1 pending approval)</span>
          <b key={assigned} className="bump">
            {assigned}
          </b>
        </div>
        <div>
          <span>Open</span>
          <b key={open} className="bump">
            {open}
          </b>
        </div>
      </div>
      <div className="rv-bars">
        {bars.map(([n, a, t]) => (
          <div key={n}>
            <div className="l">
              <span>{n}</span>
              <span>
                {a} of {t}
              </span>
            </div>
            <div className="p">
              <i style={{ width: `${(a / t) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ---------------- C5 / C6 / C5b · group reservation #00031 ---------------- */
export function GroupRes({ step, from, goto }: SceneProps) {
  const { toast } = usePlayer()
  const assigned = step === 'C5b' ? 8 : 7
  const [start, setStart] = useState('Nov 12, 2026')
  const [end, setEnd] = useState('Nov 15, 2026')

  useEffect(() => {
    if (step === 'C5b' && from === 'C6') toast('Room 102 assigned to Daniel Okafor', 'admin', 4200, { sub: 'Room details sent to the guest.', link: 'View on the grid →' })
  }, [step, from, toast])

  const base: RvRoom[] = [
    ...[0, 1, 2].map((i) => ({ type: 'Standard Single Room', amount: 420, tax: 42, i })),
    ...[3, 4].map((i) => ({ type: 'Standard Double Room', amount: 420, tax: 42, i })),
    ...[5, 6].map((i) => ({ type: 'Cabin', amount: 570, tax: 57, i })),
  ].map((r) => ({
    type: r.type,
    guest: organizer.name,
    amount: r.amount,
    tax: r.tax,
    status: 'Confirmed',
    link: 'Assign Room',
    onLink: r.i === 0 ? () => goto('C6') : undefined,
  }))
  const rooms: RvRoom[] =
    step === 'C5b' ? base.map((r, i) => (i === 0 ? { ...r, guest: 'Daniel Okafor', link: 'Room 102', onLink: undefined, flash: true } : r)) : base

  return (
    <ReservationRecord
      number="#00031"
      groupBlock={group.code}
      confirmed
      start={start}
      end={end}
      onStart={setStart}
      onEnd={setEnd}
      bookedBy={organizer.name}
      tax={afterGuestBookings.tax}
      grandTotal={afterGuestBookings.total}
      contact={organizer.name}
      email={organizer.email}
      invoice="INV-00031"
      balance={afterGuestBookings.balance}
      between={<BlockUsage assigned={assigned} />}
      space={{ amount: 1800, tax: 180, status: <Badge tone="mint">Confirmed</Badge> }}
      roomsTitle="(18/18)"
      rooms={rooms}
      roomsFooter={
        <div className="rv-showing">
          Showing 7 of 18 rooms · <a className="slds-text-link">View all</a>
        </div>
      }
      items={{ name: 'Group Catering (per guest-day)', sub: 'Three daily meals for the group', qty: 96, amount: 5280, tax: 528, status: <Badge tone="mint">Confirmed</Badge> }}
    >
      {step === 'C6' && <AssignRoomModal onCancel={() => goto('C5')} onAssign={() => goto('C5b')} />}
    </ReservationRecord>
  )
}

function AssignRoomModal({ onCancel, onAssign }: { onCancel: () => void; onAssign: () => void }) {
  return (
    <Modal
      title="Assign Room"
      width={640}
      footer={
        <>
          <button className="slds-button slds-button_neutral" onClick={onCancel}>
            Cancel
          </button>
          <ActionButton className="slds-button slds-button_brand" primary loadingMs={900} onDone={onAssign}>
            Assign room
          </ActionButton>
        </>
      }
    >
      <div className="rv-mt">Group reservation #00031 · Horizon Foundation</div>
      <div className="rv-ms">Nov 12 – Nov 15, 2026 · 3 nights</div>
      <div className="rv-2">
        <Field label="Room type">
          <Select value="Standard Single Room" />
        </Field>
        <Field label="Room">
          <Select value="Room 102" />
        </Field>
      </div>
      <Field label="Guest" style={{ marginTop: 16 }}>
        <Input value="Daniel Okafor" />
      </Field>
      <Avail ok text="Room 102 is free Nov 12 – 15 · 9 Standard Single rooms left in the block" />
      <Check on label="Send the guest their room details" />
    </Modal>
  )
}

/* ---------------- C2 / C3 / C2b · individual reservation #00032 ---------------- */
export function PriyaRes({ step, from, goto }: SceneProps) {
  const { toast } = usePlayer()
  const changed = step === 'C2b'
  const [start, setStart] = useState('Nov 12, 2026')
  const [end, setEnd] = useState('Nov 15, 2026')
  const r = v2Reservations[0]

  useEffect(() => {
    if (step === 'C2b' && from === 'C3')
      toast('Room changed to Standard 204', 'admin', 4200, { sub: 'Updated confirmation sent to priya@horizon.example', link: 'View on the grid →', onLink: () => goto('C4b') })
  }, [step, from, toast, goto])

  return (
    <ReservationRecord
      number={r.no}
      groupBlock={group.code}
      confirmed
      start={start}
      end={end}
      onStart={setStart}
      onEnd={setEnd}
      bookedBy={r.guest}
      tax={42}
      grandTotal={r.total}
      contact={r.guest}
      email="priya@horizon.example"
      invoice="INV-00032"
      balance={0}
      roomsTitle="(1/1)"
      rooms={[
        {
          type: 'Standard Double Room',
          guest: r.guest,
          amount: 420,
          tax: 42,
          status: 'Confirmed',
          link: changed ? 'Room 204' : 'Room 201',
          flash: changed,
          onLink: !changed ? () => goto('C3') : undefined,
        },
      ]}
    >
      {step === 'C3' && <ChangeRoomModal onCancel={() => goto('C2')} onChange={() => goto('C2b')} />}
    </ReservationRecord>
  )
}

function ChangeRoomModal({ onCancel, onChange }: { onCancel: () => void; onChange: () => void }) {
  return (
    <Modal
      title="Change room"
      width={640}
      footer={
        <>
          <button className="slds-button slds-button_neutral" onClick={onCancel}>
            Cancel
          </button>
          <ActionButton className="slds-button slds-button_brand" primary loadingMs={900} onDone={onChange}>
            Change room
          </ActionButton>
        </>
      }
    >
      <div className="rv-mt">Priya Nair · Reservation #00032</div>
      <div className="rv-ms">Nov 12 – Nov 15, 2026 · 3 nights · Group Block {group.code}</div>
      <div className="rv-cur">
        <b>Current room</b>
        <span>Standard Double Room · Standard 201</span>
      </div>
      <div className="rv-2">
        <Field label="New room type">
          <Select value="Standard Double Room" />
        </Field>
        <Field label="New room">
          <Select value="Standard 204" />
        </Field>
      </div>
      <Avail ok text="Standard 204 is free Nov 12 – 15 · same rate, no price change" />
      <div className="rv-2">
        <Field label="Reason">
          <Select value="Guest request" />
        </Field>
        <Field label="Rate">
          <Select value="Group rate · $140.00 per night" />
        </Field>
      </div>
      <Field label="Note" style={{ marginTop: 16 }}>
        <TextArea rows={2} value="Prefers a room close to the meeting hall." />
      </Field>
      <div style={{ marginTop: 16 }}>
        <Check on label="Send an updated confirmation to the guest" />
      </div>
    </Modal>
  )
}

/* ---------------- C4b / C7 / C8 · availability grid ---------------- */
const UNITS_V2: Unit[] = [
  ...UNITS.slice(0, 6),
  { type: 'Standard Double Room', label: '204', dot: 'room' },
  ...UNITS.slice(6),
]
const R = { r101: 0, r102: 1, r103: 2, r201: 3, r202: 4, r203: 5, r204: 6, c1: 7, c2: 8, c3: 9, c4: 10, mh1: 11 }

const bk = (row: number, start: number, len: number, kind: Booking['kind'], name: string, extra: Partial<Booking> = {}): Booking => ({
  row,
  start,
  len,
  kind,
  name,
  ...extra,
})
const held = (row: number) => bk(row, 3, 3, 'held', 'Held for Horizon Foundation', { sub: 'Open · not assigned', id: 'Held for the group · GBR-008', dates: 'Nov 12 – 15, 2026 · 3 nights', group: 'Organizer: Maya Thompson', total: 'Not assigned yet' })
const guestBk = (row: number, name: string, id: string, price: string, extra: Partial<Booking> = {}) =>
  bk(row, 3, 3, 'confirmed', name, { id, dates: 'Nov 12 – 15, 2026 · 3 nights', group: 'Group Block GBR-008', total: price, ...extra })

function initialBookings(step: string): Booking[] {
  const marcusMoved = step === 'C8'
  return [
    guestBk(R.r101, 'Maya Thompson', '#00031 · GBR-008', 'Paid by Horizon'),
    bk(R.r102, 0, 3, 'confirmed', 'L. Park', { id: '#00027 · direct booking', dates: 'Nov 9 – 12, 2026 · 3 nights', group: 'No group · direct booking', total: '$528.00 · balance $0.00' }),
    guestBk(R.r102, 'Daniel Okafor', '#00031 · GBR-008', 'Paid by Horizon'),
    guestBk(R.r103, 'Elena Rossi', '#00034 · GBR-008', '$462.00 · balance $0.00'),
    bk(R.r103, 10, 3, 'confirmed', 'S. Ortiz', { id: '#00029 · direct booking', dates: 'Nov 19 – 22, 2026 · 3 nights', group: 'No group · direct booking', total: '$462.00 · balance $0.00' }),
    held(R.r201),
    bk(R.r201, 10, 4, 'confirmed', 'T. Nguyen', { id: '#00030 · direct booking', dates: 'Nov 19 – 23, 2026 · 4 nights', group: 'No group · direct booking', total: '$616.00 · balance $0.00' }),
    guestBk(R.r202, 'Grace Liu', '#00033 · GBR-008', '$462.00 · balance $0.00'),
    guestBk(R.r203, 'Omar Haddad', '#00031 · GBR-008', 'Paid by Horizon'),
    bk(R.r203, 7, 3, 'ooo', 'Out of Order', { sub: 'Standard 203 · Nov 16 – 18' }),
    guestBk(R.r204, 'Priya Nair', '#00032 · GBR-008', '$462.00 · balance $0.00', { selected: step === 'C4b' }),
    marcusMoved ? held(R.c1) : bk(R.c1, 3, 3, 'pending', 'Marcus Webb', { id: '#00035 · GBR-008', dates: 'Nov 12 – 15, 2026 · 3 nights', group: 'Group Block GBR-008', total: '$627.00 · balance $627.00' }),
    held(R.c2),
    marcusMoved ? bk(R.c3, 3, 3, 'pending', 'Marcus Webb', { id: '#00035 · GBR-008', dates: 'Nov 12 – 15, 2026 · 3 nights', group: 'Group Block GBR-008', total: '$627.00 · balance $627.00' }) : held(R.c3),
    bk(R.c4, 0, 3, 'confirmed', 'R. Singh', { id: '#00026 · direct booking', dates: 'Nov 9 – 12, 2026 · 3 nights', group: 'No group · direct booking', total: '$627.00 · balance $0.00' }),
    held(R.c4),
    bk(R.mh1, 3, 3, 'confirmed', 'Horizon Foundation', { sub: 'Meeting Hall', id: '#00031 · GBR-008', dates: 'Nov 12 – 14, 2026 · 3 days', group: 'Organizer: Maya Thompson', total: '$1,800.00' }),
  ]
}

const overlaps = (a: Booking, b: Booking) => a.row === b.row && a.start < b.start + b.len && b.start < a.start + a.len

export function V2Avail({ step, from }: SceneProps) {
  const { toast } = usePlayer()
  const [bookings, setBookings] = useState(() => initialBookings(step))
  const [demo, setDemo] = useState<Demo | null>(null)
  const [done, setDone] = useState(false)
  const idx = (name: string) => bookings.findIndex((b) => b.name === name)

  useEffect(() => {
    if (step === 'C4b' && from === 'C2b') toast('Priya Nair moved to Standard 204', 'admin', 4200, { sub: 'The group’s held room moved to 201.' })
  }, [step, from, toast])

  const onMove = (i: number, row: number) => {
    const b = bookings[i]
    const clash = bookings.filter((o, oi) => oi !== i && overlaps({ ...b, row }, o))
    if (clash.some((o) => o.kind !== 'held')) return
    const moved = { ...b, row }
    const next = bookings.map((o, oi) => (oi === i ? moved : clash.includes(o) ? { ...o, row: b.row } : o))
    setBookings(next)
    const to = UNITS_V2[row]
    const heldBack = clash.length ? `The group’s held room moved to ${UNITS_V2[b.row].label}.` : undefined
    toast(`${b.name} moved to ${to.type === 'Cabin' ? to.label : `Standard ${to.label}`}`, 'admin', 4200, { sub: heldBack })
  }
  const onResize = (i: number, len: number) => {
    const b = bookings[i]
    if (bookings.some((o, oi) => oi !== i && overlaps({ ...b, len }, o))) return
    setBookings(bookings.map((o, oi) => (oi === i ? { ...o, len, dates: `Nov 12 – ${9 + b.start + len}, 2026 · ${len} nights`, total: `${money(len * 154)} · balance ${money(len * 154 - 462)}` } : o)))
    toast(`Stay extended to Nov ${9 + b.start + len}`, 'admin', 4200, { sub: `${b.name} · ${len} nights · ${money(len * 154)} including taxes` })
  }

  const play = () => {
    if (step === 'C7') setDemo({ kind: 'move', index: idx('Marcus Webb'), toRow: R.c3 })
    if (step === 'C8') setDemo({ kind: 'resize', index: idx('Priya Nair'), toLen: 4 })
  }
  usePrimary(step !== 'C4b' && !demo && !done ? play : null)

  return (
    <AvailabilityPage
      bookings={bookings}
      units={UNITS_V2}
      legendRequested={false}
      requestedHead={false}
      legendPending="Pending / held for the group"
      onMove={onMove}
      onResize={onResize}
      resizeTip={(i, len) => `Extend to Nov ${9 + bookings[i].start + len} · ${len} nights · ${money(len * 154)}`}
      demo={demo}
      onDemoDone={() => {
        setDemo(null)
        setDone(true)
      }}
    />
  )
}
