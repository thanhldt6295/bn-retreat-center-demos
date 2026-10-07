import { EndCard, TitleCard } from '../../components/shared/Cards'
import { Player, type SceneProps, type Step } from '../../player/Player'
import { Assign } from './Assign'
import { GroupRes, PriyaRes, ResList, V2Avail } from './AdminV2'
import { B1, B2, B3, B4, I1, I2, I3, I4 } from './GuestFlow'

export const steps: Step[] = [
  { id: 'T0', label: 'Title card', view: 'title' },
  { id: 'A1a', label: 'Organizer · assign rooms (before invites)', view: 'assign' },
  { id: 'A2', label: 'Organizer · send room invitations', view: 'assign' },
  { id: 'A1', label: 'Organizer · invitations sent', view: 'assign' },
  { id: 'A1d', label: 'Organizer · booking link copied', view: 'assign' },
  { id: 'I1', label: 'Guest · room invitation email', view: 'i1' },
  { id: 'I2', label: 'Guest · your room is held', view: 'i2' },
  { id: 'I3', label: 'Guest · details and payment (Elena)', view: 'i3' },
  { id: 'I4', label: 'Guest · booking confirmed #00034', view: 'i4' },
  { id: 'B1', label: 'Guest · enter group code', view: 'b1' },
  { id: 'B2', label: 'Guest · choose your room', view: 'b2' },
  { id: 'B3', label: 'Guest · details and payment (Priya)', view: 'b3' },
  { id: 'B4', label: 'Guest · booking confirmed #00032', view: 'b4' },
  { id: 'A1e', label: 'Organizer · guests booked', view: 'assign' },
  { id: 'C1', label: 'Staff · Reservations list', view: 'list' },
  { id: 'C5', label: 'Staff · group reservation #00031 · block usage', view: 'group' },
  { id: 'C6', label: 'Staff · Assign Room', view: 'group' },
  { id: 'C5b', label: 'Staff · room assigned', view: 'group' },
  { id: 'C2', label: 'Staff · reservation #00032', view: 'priya' },
  { id: 'C3', label: 'Staff · Change room', view: 'priya' },
  { id: 'C2b', label: 'Staff · room changed', view: 'priya' },
  { id: 'C4b', label: 'Staff · availability after room change', view: 'avail' },
  { id: 'C7', label: 'Staff · drag a booking to another unit', view: 'avail' },
  { id: 'C8', label: 'Staff · drag to extend a stay', view: 'avail' },
  { id: 'E1', label: 'End card', view: 'end' },
]

const Title = () => (
  <TitleCard
    title="One Group. Every Guest. Every Room."
    sub="Assign rooms or let guests book with a group code — every reservation stays connected."
  />
)
const End = ({ next }: SceneProps) => <EndCard line="Next: Everything They Need. One Private Link." onCta={next} />

const views = { title: Title, assign: Assign, i1: I1, i2: I2, i3: I3, i4: I4, b1: B1, b2: B2, b3: B3, b4: B4, list: ResList, group: GroupRes, priya: PriyaRes, avail: V2Avail, end: End }

export default function V2() {
  return <Player title="V2 · Group Rooms" steps={steps} views={views} nextRoute="/v3" prevRoute="/v1" />
}
