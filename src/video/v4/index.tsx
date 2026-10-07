import { Card, TitleCard } from '../../components/shared/Cards'
import { ActionButton } from '../../components/shared/ActionButton'
import { flags } from '../../flags'
import { Player, type SceneProps, type Step } from '../../player/Player'
import { K1, K1b, K2, K2b, K3, Q1, Q2 } from './Checkin'
import { P1, P2, P3, P4, P6 } from './PosOrder'
import { Contact, Invoice, PriyaRecord } from './Records'

const all: (Step & { flag?: keyof typeof flags })[] = [
  { id: 'T0', label: 'Title card', view: 'title' },
  { id: 'Q1', label: 'Guest · check-in pass e-mail', view: 'q1', flag: 'qrCheckIn' },
  { id: 'Q2', label: 'Guest · my check-in pass', view: 'q2', flag: 'qrCheckIn' },
  { id: 'K1', label: 'POS · scan guest QR', view: 'k1', flag: 'qrCheckIn' },
  { id: 'K1c', label: 'POS · QR code not recognised (alternative)', view: 'k1', flag: 'qrCheckIn' },
  { id: 'K1b', label: 'POS · find reservation (alternative)', view: 'k1b', flag: 'qrCheckIn' },
  { id: 'K2', label: 'POS · confirm check-in', view: 'k2', flag: 'qrCheckIn' },
  { id: 'K2b', label: 'POS · stay waiver signature', view: 'k2b', flag: 'qrCheckIn' },
  { id: 'K2c', label: 'POS · checking in…', view: 'k3', flag: 'qrCheckIn' },
  { id: 'K3', label: 'POS · checked in', view: 'k3', flag: 'qrCheckIn' },
  { id: 'R0', label: 'Staff · reservation Checked in', view: 'rec', flag: 'qrCheckIn' },
  { id: 'P1', label: 'POS · reservations', view: 'p1' },
  { id: 'P2a', label: 'POS · add charges (coffee)', view: 'p2' },
  { id: 'P3a', label: 'POS · item options', view: 'p3' },
  { id: 'P3b', label: 'POS · Medium selected', view: 'p3' },
  { id: 'P2c', label: 'POS · steak added', view: 'p2' },
  { id: 'P4', label: 'POS · checkout', view: 'p4', flag: 'chargeToRoom' },
  { id: 'P5', label: 'POS · charged to room', view: 'p4', flag: 'chargeToRoom' },
  { id: 'R1', label: 'Staff · reservation with POS orders', view: 'rec', flag: 'chargeToRoom' },
  { id: 'R2', label: 'Staff · invoice (stay + POS)', view: 'inv', flag: 'combinedInvoice' },
  { id: 'R3', label: 'Staff · contact record', view: 'contact', flag: 'contactRecordSections' },
  { id: 'P6', label: 'POS · check-out', view: 'p6' },
  { id: 'P7', label: 'POS · checked out', view: 'p6' },
  { id: 'R2b', label: 'Staff · invoice paid', view: 'inv', flag: 'combinedInvoice' },
  { id: 'R4', label: 'Staff · reservation Checked out', view: 'rec' },
  { id: 'E1', label: 'End card', view: 'end' },
]
export const steps: Step[] = all.filter((s) => !s.flag || flags[s.flag]).map(({ id, label, view }) => ({ id, label, view }))

const Title = () => (
  <TitleCard
    title="One Stay. One Guest Record."
    sub="Connect check-in, POS charges, payments and checkout in one complete guest history."
  />
)

const parts: [string, string][] = [
  ['Request & Approval', 'Request, quote, BEO, e-signature and payment'],
  ['Rooms & Reservations', 'Assign rooms or let guests book with a group code'],
  ['Guest Access', 'Private links for organizers and every guest'],
  ['Stay & Payments', 'POS, payments, documents and history stay connected'],
]
function Final({ next }: SceneProps) {
  return (
    <Card>
      <p className="card-fine" style={{ letterSpacing: '.12em', fontWeight: 700 }}>
        ONE CONNECTED RETREAT SYSTEM
      </p>
      <h1 className="card-title" style={{ fontSize: '3cqw' }}>
        Run Your Entire Retreat Operation in One Connected System
      </h1>
      <div className="final-list">
        {parts.map(([a, b], i) => (
          <div key={a}>
            <span className="n">{i + 1}</span>
            <b>{a}</b>
            <span>{b}</span>
          </div>
        ))}
      </div>
      <ActionButton className="card-cta" instant onDone={next}>
        See Booking Ninjas for Your Retreat Center
      </ActionButton>
    </Card>
  )
}

const views = { title: Title, q1: Q1, q2: Q2, k1: K1, k1b: K1b, k2: K2, k2b: K2b, k3: K3, rec: PriyaRecord, p1: P1, p2: P2, p3: P3, p4: P4, p6: P6, inv: Invoice, contact: Contact, end: Final }

export default function V4() {
  return <Player title="V4 · POS & Guest Record" steps={steps} views={views} nextRoute="/" prevRoute="/v3" />
}
