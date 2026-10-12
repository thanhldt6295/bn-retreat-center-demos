import { money } from '../../../data/demo'

/* V2 reservation workspace: one reservation (#00032 Priya Nair) described by a small spec; every number on the page is derived from it. */

export type Pay = { amt: number; kind: 'partial' | 'rest' | 'pos'; date: string; time: string }

export type Spec = {
  room: '201' | '204'
  /** nightly rate of the first room (group rate $140) */
  rate: number
  /** a second room (205) was added */
  room2: boolean
  checkedIn: boolean
  checkedOut: boolean
  /** POS-1058 ($34.50 + tax) charged to the room */
  pos: boolean
  /** INV-00033 for the POS order: not created, created Nov 13 or Nov 15 */
  inv: 'none' | 'nov13' | 'nov15'
  /** payments after the deposit/booking payment */
  pays: Pay[]
  /** the room change (201 → 204) happened */
  roomChanged: boolean
  /** the rate change ($140 → $150) happened */
  rateChanged: boolean
}

export const BASE: Spec = { room: '201', rate: 140, room2: false, checkedIn: false, checkedOut: false, pos: false, inv: 'none', pays: [], roomChanged: false, rateChanged: false }
export const S = (p: Partial<Spec>): Spec => ({ ...BASE, ...p })

export const NIGHTS = 3
export const BOOKED_PAID = 462
export const POS_NET = 34.5
export const POS_TAX = 3.45

const roomNet = (s: Spec) => s.rate * NIGHTS + (s.room2 ? 140 * NIGHTS : 0)
export const grand = (s: Spec) => roomNet(s) * 1.1 + (s.pos ? POS_NET + POS_TAX : 0)
export const paid = (s: Spec) => BOOKED_PAID + s.pays.reduce((a, p) => a + p.amt, 0)
export const balance = (s: Spec) => Math.round((grand(s) - paid(s)) * 100) / 100

const posTotal = POS_NET + POS_TAX

export type Step = { n: number; label: string; sub: string; state: 'done' | 'cur' | 'todo' }
export type Ev = { dot: 'grey' | 'teal' | 'blue' | 'amber'; title: string; sub: string }

export type View = {
  status: 'Confirmed' | 'Checked In' | 'Checked Out'
  summaryLine: string
  rooms: { type: string; line: string; plan: string; net: number; tax: number; img: string }[]
  addons: { title: string; sub: string; price: string; priceSub: string }[]
  journey: { next: string; steps: Step[] }
  strip: { grand: { v: string; s: string }; paid: { v: string; s: string }; bal: { v: string; s: string; amber: boolean; link?: 'pay' }; inv: { v: string; s: string; link?: 'create' | 'inv33' } }
  billing: {
    invoices: { no: string; sub: string; link?: boolean }[]
    notCreated: boolean
    payments: { v: string; s: string }
    balance?: { v: string; s: string }
  }
  events: Ev[]
  checkedInAt: string
}

const d = (n: number) => money(n)

export function derive(s: Spec): View {
  const g = grand(s)
  const p = paid(s)
  const b = balance(s)
  const net = roomNet(s)
  const status = s.checkedOut ? 'Checked Out' : s.checkedIn ? 'Checked In' : 'Confirmed'
  const roomNo = s.room
  const partial = s.pays.find((x) => x.kind === 'partial')
  const restPay = s.pays.find((x) => x.kind === 'rest')
  const posPay = s.pays.find((x) => x.kind === 'pos')
  const lastDate = s.pays.length ? s.pays[s.pays.length - 1].date : 'Sep 24'

  const rooms = [
    { type: 'Standard Double Room', line: `Room ${roomNo} · Nov 12 – 15, 2026 · ${NIGHTS} nights · 1 adult, 0 children`, plan: s.rate === 140 ? `Group rate · ${d(140)} per night` : `Custom rate · ${d(s.rate)} per night`, net: s.rate * NIGHTS, tax: s.rate * NIGHTS * 0.1, img: 'ws-room-double.png' },
  ]
  if (s.room2) rooms.push({ type: 'Standard Double Room', line: `Room 205 · Nov 12 – 15, 2026 · ${NIGHTS} nights · 1 adult, 0 children`, plan: `Group rate · ${d(140)} per night`, net: 140 * NIGHTS, tax: 42, img: 'ws-room-double.png' })

  const addons = [{ title: 'Guided Forest Walk', sub: 'Fri, Nov 13 · 9:00 AM · Guest request confirmed Oct 29', price: 'Included', priceSub: 'In the group booking' }]
  if (s.pos) addons.push({ title: 'POS-1058 · Coffee, Grilled Beef Steak', sub: 'Charged to room · Nov 12, 2026 · 7:42 PM', price: d(POS_NET), priceSub: `+Tax ${d(POS_TAX)}` })

  /* ---- guest journey ---- */
  const paidFull = b <= 0
  const posOrder = s.pos ? '1 POS order' : 'No extra charges'
  const steps: Step[] = [
    { n: 1, label: 'Booked', sub: 'Sep 24, 2026', state: 'done' },
    { n: 2, label: 'Paid', sub: s.checkedOut && paidFull ? `${d(p)} in full` : s.pays.length && b > 0 ? `${d(p)} of ${d(g)}` : `${d(BOOKED_PAID)} · Sep 24`, state: 'done' },
    { n: 3, label: 'Checked in', sub: s.checkedIn ? 'Nov 12 · 4:10 PM' : 'Expected Nov 12', state: s.checkedIn ? 'done' : 'cur' },
    { n: 4, label: 'Charges', sub: s.checkedOut ? posOrder : s.pos ? '1 POS order' : 'POS and add-ons', state: s.checkedOut ? 'done' : s.checkedIn && s.pos ? 'cur' : s.checkedIn ? 'todo' : 'todo' },
    { n: 5, label: 'Checked out', sub: s.checkedOut ? 'Nov 15 · 11:05 AM' : s.pos ? 'Due Nov 15, 2026' : 'Nov 15, 2026', state: s.checkedOut ? 'done' : 'todo' },
  ]
  let next = 'Next step: check in on Nov 12'
  if (s.checkedOut) next = paidFull ? (partial ? 'Stay complete · paid in full after a partial payment' : 'Stay complete · everything is paid') : `Stay complete · ${d(b)} still due`
  else if (s.checkedIn && s.pos && b > 0 && partial) next = `Next step: collect the remaining ${d(b)}, then check out`
  else if (s.checkedIn && s.pos && b > 0) next = 'Next step: collect the balance, then check out'
  else if (s.checkedIn) next = 'Next step: check out on Nov 15, 2026'
  else if (b > 0) next = `Next step: collect the ${d(b)} ${s.room2 ? 'balance' : 'balance'}, then check in on Nov 12`

  /* ---- summary strip ---- */
  const roomPart = s.room2 ? `2 rooms · Room ${d(net)}` : `Room ${d(net)}`
  const gs = `${roomPart}${s.pos ? ` + POS ${d(POS_NET)}` : ''} + tax ${d(net * 0.1 + (s.pos ? POS_TAX : 0))}`
  const nPay = 1 + s.pays.length
  let ps = 'Card ending 4242 · Sep 24'
  if (s.pays.length) ps = posPay && s.pays.length === 1 ? `Card ending 4242 · ${posPay.date}` : `${nPay} payments · last ${lastDate}`
  const bal = {
    v: d(b),
    s: b <= 0 ? 'Paid in full' : s.rateChanged && !s.pos ? `+${d(b)} from the rate change` : s.room2 && !s.pos ? 'Second room added' : s.pos ? 'Take payment' : 'Balance due',
    amber: b > 0 && s.pos,
    link: b > 0 && s.pos ? ('pay' as const) : undefined,
  }
  let inv: View['strip']['inv'] = { v: 'INV-00032', s: 'Sent Sep 24, 2026' }
  if (s.pos && s.inv === 'none') inv = { v: '1 of 2 created', s: 'Create invoice', link: 'create' }
  if (s.inv === 'nov13') inv = s.checkedOut ? (b > 0 ? { v: 'INV-00033', s: `Sent Nov 13 · ${d(b)} unpaid` } : { v: 'INV-00033', s: 'Sent Nov 13, 2026' }) : { v: '2 of 2 created', s: 'INV-00033', link: 'inv33' }
  if (s.inv === 'nov15') inv = { v: 'INV-00033', s: 'Sent Nov 15, 2026' }

  /* ---- billing card ---- */
  const invoices: View['billing']['invoices'] = [{ no: 'INV-00032', sub: 'Sent Sep 24, 2026', link: true }]
  if (s.inv === 'nov13') invoices.push({ no: 'INV-00033', sub: s.checkedOut && b <= 0 ? 'Sent Nov 13, 2026' : 'Sent Nov 13, 2026 · Partially paid', link: true })
  if (s.inv === 'nov15') invoices.push({ no: 'INV-00033', sub: 'Sent Nov 15, 2026', link: true })
  const payments = s.pays.length
    ? { v: `${d(p)} paid`, s: posPay && s.pays.length === 1 ? `Card ending 4242 · last payment ${posPay.date}` : `${nPay} payments · last ${lastDate}, 2026` }
    : { v: `${d(BOOKED_PAID)} paid`, s: 'Card ending 4242 · Sep 24, 2026' }
  let balanceBlock: View['billing']['balance']
  if (s.pos || b > 0 || s.pays.length) {
    balanceBlock = {
      v: b > 0 ? `${d(b)} due` : `${d(0)} due`,
      s: b <= 0 ? 'Paid in full' : s.checkedOut ? 'Left open at check-out' : s.inv === 'nov13' ? 'INV-00033 partially paid' : s.pos ? 'POS-1058 · charged to room' : s.rateChanged ? `+${d(b)} from the rate change` : 'Second room added',
    }
  }

  /* ---- activity (newest first) ---- */
  const ev: Ev[] = []
  const cin = s.pos || s.pays.length ? 'teal' : 'grey'
  ev.push({ dot: 'grey', title: 'Reservation created from group block GBR-008', sub: 'Sep 24, 2026 · Assigned by Maya Thompson' })
  ev.push({ dot: 'teal', title: 'Payment received · $462.00', sub: 'Sep 24, 2026 · Card ending 4242' })
  ev.push({ dot: 'grey', title: 'Secure link sent to Priya Nair', sub: 'Sep 24, 2026 · Guest portal' })
  ev.push({ dot: 'grey', title: 'Request received · Guided Forest Walk', sub: 'Oct 28, 2026 · 8:05 PM · Guest portal' })
  ev.push({ dot: 'grey', title: 'Request confirmed · Guided Forest Walk', sub: 'Oct 29, 2026 · 9:14 AM · Sam Patel · Priya Nair was notified' })
  if (s.roomChanged) ev.push({ dot: 'blue', title: 'Room changed · Standard 201 → Standard 204', sub: 'Oct 30, 2026 · Sam Patel · Updated confirmation sent to Priya Nair' })
  if (s.rateChanged) ev.push({ dot: 'grey', title: `Rate updated · ${d(140)} → ${d(s.rate)} per night`, sub: `Oct 31, 2026 · Sam Patel · Total ${d(462)} → ${d(g)} · balance ${d(b)} due` })
  if (s.room2) ev.push({ dot: 'grey', title: 'Room added · Standard Double Room 205', sub: `Oct 31, 2026 · Sam Patel · Total ${d(462)} → ${d(g)} · balance ${d(b)} due` })
  if (s.checkedIn) ev.push({ dot: cin === 'teal' ? 'teal' : 'grey', title: `Checked in · Room ${roomNo}`, sub: 'Nov 12, 2026 · 4:10 PM · QR check-in' })
  if (s.pos) ev.push({ dot: 'amber', title: `POS-1058 charged to room · ${d(posTotal)}`, sub: 'Nov 12, 2026 · 7:42 PM · Coffee, Grilled Beef Steak' })
  if (s.inv === 'nov13') ev.push({ dot: 'amber', title: 'Invoice INV-00033 created · POS-1058', sub: 'Nov 13, 2026 · 9:24 AM · Sam Patel · Sent to priya@horizon.example' })
  if (partial) ev.push({ dot: s.checkedOut ? 'teal' : 'amber', title: `Partial payment received · ${d(partial.amt)}`, sub: `Nov 13, 2026 · 9:30 AM · Card ending 4242${s.checkedOut ? '' : ` · ${d(posTotal - partial.amt)} still due`}` })
  if (restPay) ev.push({ dot: 'teal', title: `Payment received · ${d(restPay.amt)}`, sub: 'Nov 15, 2026 · 10:58 AM · Card ending 4242' })
  if (posPay) ev.push({ dot: 'teal', title: `Payment received · ${d(posPay.amt)}`, sub: 'Nov 15, 2026 · 10:58 AM · Card ending 4242' })
  if (s.checkedOut) ev.push({ dot: s.pos ? 'teal' : 'grey', title: `Checked out · Room ${roomNo}`, sub: 'Nov 15, 2026 · 11:05 AM · Sam Patel' })
  if (s.checkedOut && b > 0) ev.push({ dot: 'grey', title: `Balance of ${d(b)} left open on INV-00033`, sub: 'Nov 15, 2026 · 11:05 AM · Sam Patel' })
  if (s.checkedOut && b <= 0) ev.push({ dot: 'grey', title: 'Receipt emailed to priya@horizon.example', sub: 'Nov 15, 2026 · 11:05 AM' })
  ev.reverse()
  // the W3 room change is the newest "blue" entry before check-in; keep Figma's order (newest first)

  return {
    status,
    summaryLine: `· Standard Double Room · Room ${roomNo} · Nov 12 – 15, 2026 · ${NIGHTS} nights · Group Block`,
    rooms,
    addons,
    journey: { next, steps },
    strip: { grand: { v: d(g), s: gs }, paid: { v: d(p), s: ps }, bal, inv },
    billing: { invoices, notCreated: s.pos && s.inv === 'none', payments, balance: balanceBlock },
    events: ev,
    checkedInAt: '4:10 PM',
  }
}

/* Presets: the state shown by each Figma frame (W-number). */
export const T1: Partial<Spec> = { room: '204', roomChanged: true }
export const POS: Partial<Spec> = { ...T1, checkedIn: true, pos: true }
export const PARTIAL: Pay = { amt: 20, kind: 'partial', date: 'Nov 13', time: '9:30 AM' }
export const REST: Pay = { amt: posTotal - 20, kind: 'rest', date: 'Nov 15', time: '10:58 AM' }
export const POSPAY: Pay = { amt: posTotal, kind: 'pos', date: 'Nov 15', time: '10:58 AM' }
export { posTotal }
