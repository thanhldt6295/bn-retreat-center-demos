import { EndCard, TitleCard } from '../../components/shared/Cards'
import { Player, type SceneProps, type Step } from '../../player/Player'
import { RequestList, RequestRecord } from './AdminRequest'
import { AvailabilityCheck, AvailabilityReserved } from './AdminAvail'
import { BeoPreview } from './BeoPreview'
import { BgoConfirmed, BgoSent } from './Bgo'
import { G1 } from './G1'
import { G2 } from './G2'
import { G4 } from './G4'
import { G3, G4b, G4c } from './EmailViewers'
import { G5, G6, G7 } from './GuestPay'
import { Reservation } from './Reservation'
import { Wizard } from './Wizard'

export const steps: Step[] = [
  { id: 'T0', label: 'Title card', view: 'title' },
  { id: 'G1', label: 'Guest · request form', view: 'g1' },
  { id: 'G2', label: 'Guest · request received', view: 'g2' },
  { id: '1.1', label: 'Group Block Requests list', view: 'list' },
  { id: '1.2', label: 'GBR-008 · Pending', view: 'record' },
  { id: '1.3', label: 'GBR-008 · Confirmed', view: 'record' },
  { id: '1.4', label: 'Availability check', view: 'avail' },
  { id: '1.4b', label: 'Hover the requested stay', view: 'avail' },
  { id: '1.4c', label: 'Hover a Confirmed booking', view: 'avail' },
  { id: '1.4d', label: 'Hover an Out of Order tag', view: 'avail' },
  { id: '2.1', label: 'Wizard · Group Block Info', view: 'wizard' },
  { id: '2.2', label: 'Wizard · Space, rooms & add-ons', view: 'wizard' },
  { id: '2.2b', label: 'Wizard · Room types picker', view: 'wizard' },
  { id: '2.3', label: 'Wizard · Add-on picker', view: 'wizard' },
  { id: '2.4', label: 'Wizard · Billing', view: 'wizard' },
  { id: '2.5', label: 'Wizard · Review & send', view: 'wizard' },
  { id: '3.1', label: 'Group Block · Sent', view: 'bgoSent' },
  { id: '3.1b', label: 'BEO preview · send for e-signature', view: 'beo' },
  { id: 'G3', label: 'Guest · quote email', view: 'g3' },
  { id: 'G4', label: 'Guest · review quote, BEO, contract', view: 'g4' },
  { id: 'G4b', label: 'Guest · BEO viewer', view: 'g4b' },
  { id: 'G4c', label: 'Guest · contract viewer', view: 'g4c' },
  { id: 'G5', label: 'Guest · sign electronically', view: 'g5' },
  { id: 'G6', label: 'Guest · pay deposit', view: 'g6' },
  { id: 'G7', label: 'Guest · booking confirmed', view: 'g7' },
  { id: '3.2', label: 'Group Block · Confirmed (signed)', view: 'bgoConfirmed' },
  { id: '4.1', label: 'New Reservation · step 1', view: 'bgoConfirmed' },
  { id: '4.2', label: 'New Reservation · Review & Book', view: 'bgoConfirmed' },
  { id: '4.5', label: 'Availability · reservation on the grid', view: 'availRes' },
  { id: '4.5b', label: 'Availability · hover a booking', view: 'availRes' },
  { id: '4.5c', label: 'Availability · select cells', view: 'availRes' },
  { id: '4.3', label: 'Reservation · Pending Approval', view: 'reservation' },
  { id: '4.4', label: 'Reservation invoice · deposit paid', view: 'reservation' },
  { id: '4.3b', label: 'Reservation · Confirmed', view: 'reservation' },
  { id: 'E1', label: 'End card', view: 'end' },
]

const Title = () => (
  <TitleCard
    title="Turn Retreat Requests Into Confirmed Bookings"
    sub="From request to quote, e-signature and payment — all in one connected flow."
  />
)
const End = ({ goto }: SceneProps) => <EndCard line="Next: One Group. Every Guest. Every Room." onCta={() => goto('T0')} />

const views = {
  title: Title,
  g1: G1,
  g2: G2,
  list: RequestList,
  record: RequestRecord,
  avail: AvailabilityCheck,
  wizard: Wizard,
  bgoSent: BgoSent,
  beo: BeoPreview,
  g3: G3,
  g4: G4,
  g4b: G4b,
  g4c: G4c,
  g5: G5,
  g6: G6,
  g7: G7,
  bgoConfirmed: BgoConfirmed,
  availRes: AvailabilityReserved,
  reservation: Reservation,
  end: End,
}

export default function V1() {
  return <Player title="V1 · Group Block" steps={steps} views={views} />
}
