import { EndCard, TitleCard } from '../../components/shared/Cards'
import { Player, type SceneProps, type Step } from '../../player/Player'
import { S1, S2, S4 } from './AdminReq'
import { U0, U1, U2, U3, U4, U5, U6, U7, U8 } from './GuestPortal'
import { MGuest, MO0, MOrg } from './Mobile'
import { O0, O1, O3, O4, O5, O6, O7 } from './Organizer'
import { Assign } from '../v2/Assign'

export const steps: Step[] = [
  { id: 'T0', label: 'Title card', view: 'title' },
  { id: 'O0', label: 'Organizer · secure link e-mail', view: 'o0' },
  { id: 'O1', label: 'Organizer · overview', view: 'o1' },
  { id: 'O2', label: 'Organizer · rooms', view: 'o2' },
  { id: 'O3', label: 'Organizer · guests', view: 'o3' },
  { id: 'O4', label: 'Organizer · documents', view: 'o4' },
  { id: 'O5', label: 'Organizer · invoices', view: 'o5' },
  { id: 'O6', label: 'Organizer · schedule & meals', view: 'o6' },
  { id: 'O7', label: 'Organizer · invite guests', view: 'o7' },
  { id: 'U0', label: 'Guest · secure link e-mail', view: 'u0' },
  { id: 'U1', label: 'Guest · my stay', view: 'u1' },
  { id: 'U2', label: 'Guest · room', view: 'u2' },
  { id: 'U3', label: 'Guest · payment', view: 'u3' },
  { id: 'U4', label: 'Guest · schedule', view: 'u4' },
  { id: 'U5', label: 'Guest · documents', view: 'u5' },
  { id: 'U6', label: 'Guest · charges', view: 'u6' },
  { id: 'U7', label: 'Guest · add-ons', view: 'u7' },
  { id: 'U7b', label: 'Guest · add-ons, one cart', view: 'u7' },
  { id: 'U8', label: 'Guest · requests sent', view: 'u8' },
  { id: 'S1', label: 'Staff · Request Manager (new request)', view: 's1' },
  { id: 'S2', label: 'Staff · request detail', view: 's2' },
  { id: 'S3', label: 'Staff · request confirmed', view: 's2' },
  { id: 'S4', label: 'Staff · portal activity', view: 's4' },
  { id: 'MO0', label: 'Phone · organizer secure link e-mail', view: 'mo0' },
  { id: 'MO1', label: 'Phone · organizer overview', view: 'morg' },
  { id: 'MO5', label: 'Phone · organizer invoices', view: 'morg' },
  { id: 'MO4', label: 'Phone · organizer documents', view: 'morg' },
  { id: 'MO6', label: 'Phone · organizer schedule & meals', view: 'morg' },
  { id: 'MO2', label: 'Phone · organizer rooms', view: 'morg' },
  { id: 'MO3', label: 'Phone · organizer guests', view: 'morg' },
  { id: 'MO7', label: 'Phone · organizer invite guests', view: 'morg' },
  { id: 'M1', label: 'Phone · guest my stay', view: 'mg' },
  { id: 'M2', label: 'Phone · guest add-ons', view: 'mg' },
  { id: 'M3', label: 'Phone · guest charges', view: 'mg' },
  { id: 'M4', label: 'Phone · guest check-in pass', view: 'mg' },
  { id: 'E1', label: 'End card', view: 'end' },
]

const Title = () => (
  <TitleCard
    title="Everything They Need. One Private Link."
    sub="Give organizers and guests instant access to rooms, schedules, documents, invoices and add-ons — no login required."
  />
)
const End = ({ next }: SceneProps) => <EndCard line="Next: One Stay. One Guest Record." onCta={next} />

const views = { title: Title, o0: O0, o1: O1, o2: Assign, o3: O3, o4: O4, o5: O5, o6: O6, o7: O7, u0: U0, u1: U1, u2: U2, u3: U3, u4: U4, u5: U5, u6: U6, u7: U7, u8: U8, s1: S1, s2: S2, s4: S4, mo0: MO0, morg: MOrg, mg: MGuest, end: End }

export default function V3() {
  return <Player title="V3 · Private Links" steps={steps} views={views} nextRoute="/v4" prevRoute="/v2" />
}
