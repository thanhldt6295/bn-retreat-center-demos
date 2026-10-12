import { useEffect, useRef, type ReactNode } from 'react'
import { usePlayer, type SceneProps } from '../../../player/Player'
import { PARTIAL, POS, POSPAY, REST, S, T1, type Spec } from './model'
import {
  AddGuestPanel,
  AddItemPanel,
  AddRoomPanel,
  AssignPanel,
  ChangeRoomPanel,
  CheckInPanel,
  CheckOutPanel,
  CreateInvPanel,
  GroupPage,
  InvoicePanel,
  PayPanel,
  PrimaryCtx,
  RatePanel,
  ReservationsList,
  ResPage,
  type Act,
  type Go,
  type PanelKey,
} from './Workspace'

/* One scene per Figma frame (W0 … W31). Each frame is a state of the same page: spec = reservation state, panel = open side panel. */
type Cfg = {
  page: 'list' | 'group' | 'res'
  spec?: Spec
  panel?: PanelKey
  /** rate panel in edit mode (W28) / payment panel mode / invoice panel */
  variant?: string
  toast?: [string, string]
  compose?: boolean
  /** the → key clicks the panel's brand button */
  primary?: boolean
  assigned?: boolean
  nav: Partial<Record<Act, string>>
}

const PAID: Spec = S({ ...POS, checkedOut: true, inv: 'nov15', pays: [POSPAY] })
const PARTIAL_STATE: Spec = S({ ...POS, inv: 'nov13', pays: [PARTIAL] })
const FINAL: Spec = S({ ...POS, checkedOut: true, inv: 'nov13', pays: [PARTIAL, REST] })
const DUE: Spec = S({ ...POS, checkedOut: true, inv: 'nov13', pays: [PARTIAL] })
const RECEIPT: [string, string] = ['Checked out', 'A receipt was emailed to priya@horizon.example.']

export const CFG: Record<string, Cfg> = {
  W0: { page: 'list', nav: { open31: 'W14', open32: 'W1' } },
  W14: { page: 'group', nav: { assign: 'W15', bc: 'W0' } },
  W15: { page: 'group', panel: 'assign', primary: true, nav: { cancel: 'W14', submit: 'W16', bc: 'W0' } },
  W16: { page: 'group', assigned: true, toast: ['Noah Williams added to Standard Double Room', 'Updated confirmation sent to priya@horizon.example'], nav: { assign: 'W15', bc: 'W0' } },
  W1: { page: 'res', spec: S({}), nav: { bc: 'W0', rateLink: 'W17', changeRoom: 'W2', addNote: 'W5', addGuest: 'W11', addRoom: 'W12', checkIn: 'W10', inv32: 'W18' } },
  W17: { page: 'res', spec: S({}), panel: 'rate', nav: { cancel: 'W1', submit: 'W1', editRate: 'W28', bc: 'W0' } },
  W28: { page: 'res', spec: S({}), panel: 'rate', variant: 'edit', primary: true, nav: { cancel: 'W1', submit: 'W29' } },
  W29: { page: 'res', spec: S({ rate: 150, rateChanged: true }), nav: { bc: 'W0' } },
  W18: { page: 'res', spec: S({}), panel: 'inv32', nav: { cancel: 'W1', submit: 'W1' } },
  W2: { page: 'res', spec: S({}), panel: 'changeRoom', primary: true, nav: { cancel: 'W1', submit: 'W3' } },
  W3: { page: 'res', spec: S(T1), toast: ['Room changed to Standard 204.', 'Updated confirmation sent to priya@horizon.example'], nav: { bc: 'W0', addItem: 'W4', addNote: 'W5' } },
  W4: { page: 'res', spec: S(T1), panel: 'addItem', nav: { cancel: 'W3', submit: 'W6' } },
  W5: { page: 'res', spec: S(T1), compose: true, nav: { submit: 'W1', cancel: 'W1', bc: 'W0' } },
  W11: { page: 'res', spec: S({}), panel: 'addGuest', nav: { cancel: 'W1', submit: 'W1' } },
  W12: { page: 'res', spec: S({}), panel: 'addRoom', primary: true, nav: { cancel: 'W1', submit: 'W30' } },
  W30: { page: 'res', spec: S({ room2: true }), nav: { bc: 'W0' } },
  W10: { page: 'res', spec: S({}), panel: 'checkIn', primary: true, nav: { cancel: 'W1', submit: 'W13' } },
  W13: { page: 'res', spec: S({ checkedIn: true }), nav: { checkOut: 'W26', bc: 'W0' } },
  W26: { page: 'res', spec: S({ checkedIn: true }), panel: 'checkOut', primary: true, nav: { cancel: 'W13', submit: 'W27' } },
  W27: { page: 'res', spec: S({ checkedIn: true, checkedOut: true }), toast: RECEIPT, nav: { bc: 'W0' } },
  W6: { page: 'res', spec: S(POS), nav: { createInv: 'W7', takePay: 'W8', checkOut: 'W8', bc: 'W0' } },
  W7: { page: 'res', spec: S(POS), panel: 'createInv', primary: true, nav: { cancel: 'W6', submit: 'W8' } },
  W8: { page: 'res', spec: S(POS), panel: 'pay', variant: 'full', primary: true, nav: { cancel: 'W6', submit: 'W9', payPart: 'W19' } },
  W9: { page: 'res', spec: PAID, toast: RECEIPT, nav: { bc: 'W0' } },
  W19: { page: 'res', spec: S(POS), panel: 'pay', variant: 'partial', primary: true, nav: { cancel: 'W6', submit: 'W20' } },
  W20: { page: 'res', spec: PARTIAL_STATE, nav: { inv33: 'W21', takePay: 'W22', checkOut: 'W24', bc: 'W0' } },
  W21: { page: 'res', spec: PARTIAL_STATE, panel: 'inv33', nav: { cancel: 'W20', submit: 'W22' } },
  W22: { page: 'res', spec: PARTIAL_STATE, panel: 'pay', variant: 'rest', primary: true, nav: { cancel: 'W20', submit: 'W23' } },
  W23: { page: 'res', spec: FINAL, toast: RECEIPT, nav: { bc: 'W0' } },
  W24: { page: 'res', spec: PARTIAL_STATE, panel: 'checkOut', primary: true, nav: { cancel: 'W20', submit: 'W25', payFirst: 'W22' } },
  W25: { page: 'res', spec: DUE, toast: ['Checked out with $17.95 still due.', 'The balance stays open on INV-00033.'], nav: { takePay: 'W31', bc: 'W0' } },
  W31: { page: 'res', spec: DUE, panel: 'pay', variant: 'late', nav: { cancel: 'W25', submit: 'W23' } },
}

export const WS_STEPS: { id: string; label: string }[] = [
  { id: 'W0', label: 'Admin · Reservations list' },
  { id: 'W14', label: 'Admin · Group workspace #00031' },
  { id: 'W15', label: 'Admin · Assign guests (panel)' },
  { id: 'W16', label: 'Admin · Guests assigned' },
  { id: 'W1', label: 'Admin · Reservation workspace #00032' },
  { id: 'W17', label: 'Admin · Rate details (panel)' },
  { id: 'W28', label: 'Admin · Edit rate (panel)' },
  { id: 'W29', label: 'Admin · Rate updated' },
  { id: 'W18', label: 'Admin · Invoice INV-00032 (panel)' },
  { id: 'W2', label: 'Admin · Change room (panel)' },
  { id: 'W3', label: 'Admin · Room changed' },
  { id: 'W4', label: 'Admin · Add item (panel)' },
  { id: 'W5', label: 'Admin · Add note (inline)' },
  { id: 'W11', label: 'Admin · Add guest (panel)' },
  { id: 'W12', label: 'Admin · Add room (panel)' },
  { id: 'W30', label: 'Admin · Room added' },
  { id: 'W10', label: 'Admin · Check in (panel)' },
  { id: 'W13', label: 'Admin · Checked in' },
  { id: 'W26', label: 'Admin · Check out (panel)' },
  { id: 'W27', label: 'Admin · Checked out' },
  { id: 'W6', label: 'Admin · After POS charge' },
  { id: 'W7', label: 'Admin · Create invoice (panel)' },
  { id: 'W8', label: 'Admin · Take payment (panel)' },
  { id: 'W9', label: 'Admin · Checked out, paid' },
  { id: 'W19', label: 'Admin · Take payment · partial (panel)' },
  { id: 'W20', label: 'Admin · Partially paid' },
  { id: 'W21', label: 'Admin · Invoice INV-00033 (panel)' },
  { id: 'W22', label: 'Admin · Take payment · remaining (panel)' },
  { id: 'W23', label: 'Admin · Checked out, paid after partial payment' },
  { id: 'W24', label: 'Admin · Check out with balance due (panel)' },
  { id: 'W25', label: 'Admin · Checked out, balance due' },
  { id: 'W31', label: 'Admin · Take payment after check-out (panel)' },
]

function renderPanel(c: Cfg, go: Go): ReactNode {
  const spec = c.spec ?? S({})
  switch (c.panel) {
    case 'rate':
      return <RatePanel go={go} edit={c.variant === 'edit'} />
    case 'changeRoom':
      return <ChangeRoomPanel go={go} />
    case 'addItem':
      return <AddItemPanel go={go} />
    case 'addGuest':
      return <AddGuestPanel go={go} />
    case 'addRoom':
      return <AddRoomPanel go={go} />
    case 'checkIn':
      return <CheckInPanel go={go} spec={spec} />
    case 'checkOut':
      return <CheckOutPanel go={go} spec={spec} onTakePay={() => go('payFirst')} />
    case 'createInv':
      return <CreateInvPanel go={go} />
    case 'pay':
      return <PayPanel go={go} spec={spec} mode={(c.variant ?? 'full') as 'full' | 'partial' | 'rest' | 'late'} />
    case 'inv32':
      return <InvoicePanel go={go} which="32" spec={spec} />
    case 'inv33':
      return <InvoicePanel go={go} which="33" spec={spec} />
    case 'assign':
      return <AssignPanel go={go} />
    default:
      return null
  }
}

/** Scene for every W-frame. */
export function WsScene({ step, goto }: SceneProps) {
  const c = CFG[step]
  const { toast } = usePlayer()
  const shown = useRef('')
  useEffect(() => {
    if (!c?.toast || shown.current === step) return
    shown.current = step
    toast(c.toast[0], 'admin', 4600, { sub: c.toast[1] })
  }, [step, c, toast])
  if (!c) return null
  const go: Go = (a) => {
    const t = c.nav[a]
    if (t) goto(t)
  }
  const panel = renderPanel(c, go)
  const wrapped = panel ? <PrimaryCtx.Provider value={!!c.primary}>{panel}</PrimaryCtx.Provider> : null
  if (c.page === 'list') return <ReservationsList go={go} />
  if (c.page === 'group') return <GroupPage go={go} panel={wrapped} assigned={!!c.assigned} />
  return <ResPage key={step} spec={c.spec ?? S({})} go={go} panel={wrapped} composing={c.compose} typedNote={c.compose ? 'Guest asked for a quiet room near the meeting hall. Moved from 201 to 204.' : undefined} />
}
