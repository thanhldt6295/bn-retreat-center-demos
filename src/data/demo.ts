// Canonical demo data (see CLAUDE.md). Screens never hard-code money values.

export const money = (n: number, decimals = 2) =>
  '$' +
  n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })

export const money0 = (n: number) => money(n, 0)

export const venue = {
  name: 'Cedar Valley Retreat & Conference Center',
  short: 'Cedar Valley',
  email: 'retreats@cedarvalley.example',
  eventsEmail: 'events@cedarvalley.example',
  rooms: 48,
  cabins: 6,
  meetingSpaces: 7,
}

export const staff = {
  sam: { name: 'Sam Patel', role: 'Front desk / events' },
  jordan: { name: 'Jordan Reyes', role: 'Events Manager' },
  alex: { name: 'Alex Rivera', role: 'Activities' },
}

export const organizer = {
  name: 'Maya Thompson',
  first: 'Maya',
  last: 'Thompson',
  initials: 'MT',
  email: 'maya.thompson@horizon.example',
  org: 'Horizon Foundation',
  address: '480 Alder Street, Portland, Oregon 97205',
}

export const group = {
  name: 'Horizon Foundation Annual Leadership Retreat',
  org: 'Horizon Foundation',
  guests: 32,
  code: 'GBR-008',
  type: 'Leadership retreat',
  start: 'Nov 12, 2026',
  end: 'Nov 15, 2026',
  nights: 3,
  requested: { rooms: 22, single: 12, double: 10 },
  special: 'Meeting hall for 3 days and group meals.',
  budget: '$150',
  portalLink: 'cedarvalley.example/portal/o/HZN-7Q4M-2K9X',
}

export const timeline = {
  request: 'Sep 08, 2026',
  quote: 'Sep 12, 2026',
  quoteValidTo: 'Sep 28, 2026',
  venueSigned: 'Sep 20, 2026',
  organizerSigned: 'Sep 22, 2026',
  depositPaid: 'Sep 22, 2026',
  balanceDue: 'Nov 05, 2026',
}

const NIGHTS = group.nights
export const roomTypes = [
  { key: 'single', name: 'Standard Single Room', short: 'Standard Single', bed: 'Single', qty: 12, available: 12, rate: 140, maxOcc: 1 },
  { key: 'double', name: 'Standard Double Room', short: 'Standard Double', bed: 'Double', qty: 6, available: 7, rate: 140, maxOcc: 2 },
  { key: 'cabin', name: 'Cabin', short: 'Cabin', bed: 'Double', qty: 4, available: 4, rate: 190, maxOcc: 4 },
] as const

export const roomLines = roomTypes.map((r) => ({ ...r, total: r.qty * NIGHTS * r.rate }))

const meeting = { name: 'Meeting Hall (per day)', days: 3, rate: 600 }
const catering = { name: 'Group Catering (per guest-day)', qty: 96, rate: 55 }

const roomsTotal = roomLines.reduce((s, l) => s + l.total, 0)
const meetingTotal = meeting.days * meeting.rate
const cateringTotal = catering.qty * catering.rate
const subtotal = roomsTotal + meetingTotal + cateringTotal
const tax = subtotal * 0.1
const total = subtotal + tax

export const quote = {
  nights: NIGHTS,
  roomLines,
  meeting: { ...meeting, total: meetingTotal },
  catering: { ...catering, total: cateringTotal },
  roomsTotal,
  addOnsTotal: meetingTotal + cateringTotal,
  roomCount: roomLines.reduce((s, l) => s + l.qty, 0),
  subtotal,
  tax,
  total,
  deposit: total / 2,
  balance: total / 2,
}

export const addOnCatalog = [
  { name: 'Group Catering', qty: 96, delivery: 'Every Day', base: '$55.00 Per Person', price: 5280, checked: true },
  { name: 'Airport Shuttle', qty: 1, delivery: 'Arrival day', base: '$35.00 Per Item', price: 35 },
  { name: 'Coffee and Tea Break', qty: 1, delivery: 'Every Day', base: '$6.50 Per Person', price: 6.5 },
  { name: 'Boxed Lunch', qty: 1, delivery: 'Every Day', base: '$11.50 Per Person', price: 11.5 },
  { name: 'Banquet Dinner', qty: 1, delivery: 'Every Day', base: '$28.00 Per Person', price: 28 },
  { name: 'AV and Livestream Package', qty: 1, delivery: 'Every Day', base: '$250.00 Per Item', price: 250 },
]

export const agenda = [
  { n: 1, name: 'Arrival and Check-in', guests: 32, start: '03:00 PM', end: '05:00 PM', location: 'Main Lodge Lobby', day: 'Thu, Nov 12', time: '3:00 – 5:00 PM' },
  { n: 2, name: 'Leadership Sessions', guests: 32, start: '09:00 AM', end: '05:00 PM', location: 'Meeting Hall', day: 'Fri, Nov 13', time: '9:00 AM – 5:00 PM' },
  { n: 3, name: 'Group Dinner', guests: 32, start: '06:30 PM', end: '08:30 PM', location: 'Dining Hall', day: 'Fri, Nov 13', time: '6:30 – 8:30 PM' },
]

export const gbrList = [
  { code: 'GBR-008', contact: 'Maya Thompson', start: '11/12/2026', end: '11/15/2026', created: '09/08/2026', type: 'Leadership retreat', max: 190, min: 140, rooms: 22, status: 'Pending' },
  { code: 'GBR-007', contact: 'Diego Alvarez', start: '10/16/2026', end: '10/18/2026', created: '08/25/2026', type: 'Conference', max: 190, min: 140, rooms: 26, status: 'Converted' },
  { code: 'GBR-006', contact: 'Ruth Okoye', start: '10/02/2026', end: '10/04/2026', created: '08/12/2026', type: 'Day of reflection', max: 165, min: 95, rooms: 10, status: 'Converted' },
  { code: 'GBR-005', contact: 'Paul Dubois', start: '09/18/2026', end: '09/20/2026', created: '07/29/2026', type: 'Retreat', max: 190, min: 140, rooms: 12, status: 'Converted' },
  { code: 'GBR-004', contact: 'Mina Sato', start: '09/04/2026', end: '09/06/2026', created: '07/15/2026', type: 'Family Day', max: 150, min: 100, rooms: 22, status: 'Converted' },
  { code: 'GBR-003', contact: 'Victor Hale', start: '08/27/2026', end: '08/29/2026', created: '07/01/2026', type: 'Youth camp', max: 150, min: 110, rooms: 9, status: 'Converted' },
  { code: 'GBR-002', contact: 'Hannah Cole', start: '08/13/2026', end: '08/15/2026', created: '06/18/2026', type: 'Wellness retreat', max: 210, min: 140, rooms: 14, status: 'Confirmed' },
  { code: 'GBR-001', contact: 'Lena Fischer', start: '07/24/2026', end: '07/26/2026', created: '06/03/2026', type: 'Team retreat', max: 210, min: 150, rooms: 18, status: 'Converted' },
] as const

export const groupReservation = {
  number: '#00031',
  invoice: 'INV-00031',
  // Reservation rooms table shows 7 of 22
  roomsShown: [
    { type: 'Standard Single Room', amount: 420, tax: 42 },
    { type: 'Standard Single Room', amount: 420, tax: 42 },
    { type: 'Standard Single Room', amount: 420, tax: 42 },
    { type: 'Standard Double Room', amount: 420, tax: 42 },
    { type: 'Standard Double Room', amount: 420, tax: 42 },
    { type: 'Cabin', amount: 570, tax: 57 },
    { type: 'Cabin', amount: 570, tax: 57 },
  ],
}

// ----- V2 -----
const guestStay = 140 * NIGHTS
const guestTotal = guestStay * 1.1
const cabinTotal = 190 * NIGHTS * 1.1

export const v2Reservations = [
  { no: '#00032', guest: 'Priya Nair', type: 'Standard Double', total: guestTotal, balance: 0, status: 'Confirmed', how: 'Group code, paid Sep 24' },
  { no: '#00033', guest: 'Grace Liu', type: 'Standard Double', total: guestTotal, balance: 0, status: 'Confirmed', how: 'Paid' },
  { no: '#00034', guest: 'Elena Rossi', type: 'Standard Single', total: guestTotal, balance: 0, status: 'Confirmed', how: 'Invitation from organizer' },
  { no: '#00035', guest: 'Marcus Webb', type: 'Cabin', total: cabinTotal, balance: cabinTotal, status: 'Pending Approval', how: 'Booked, not paid' },
  { no: '#00036', guest: 'Tom Becker', type: '—', total: 693, balance: 0, status: 'Confirmed', how: 'Not in group' },
] as const

export const afterGuestBookings = {
  rooms: 18,
  subtotal: 15090,
  tax: 1509,
  total: 16599,
  credit: 2013,
  balance: 7293,
}

// ----- V3 / V4 -----
export const priya = { name: 'Priya Nair', reservation: '#00032', room: 'Standard Double Room' }

export const pos = {
  order: 'POS-1058',
  when: 'Nov 12, 7:42 PM',
  subtotal: 34.5,
  tax: 3.45,
  total: 37.95,
  room: 'Standard 204',
  checkIn: 'Nov 12, 3:45 PM',
  waiverSigned: '3:40 PM',
  checkOut: 'Nov 15, 10:42 AM',
  stayTotal: 499.95,
  stayPaidAtBooking: 462,
}

export const card = { number: '4242 4242 4242 4242', expiry: '12 / 29', cvc: '•••' }
