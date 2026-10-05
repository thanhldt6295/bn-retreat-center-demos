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
  { code: 'GBR-008', contact: 'Maya Thompson', name: group.name, type: 'Leadership retreat', dates: 'Nov 12 – Nov 15, 2026', rooms: 22, rate: '$140 – $190', status: 'Pending' },
  { code: 'GBR-009', contact: 'Ethan Brooks', name: 'Brightmoor Leadership Offsite', type: 'Corporate offsite', dates: 'Dec 03 – Dec 06, 2026', rooms: 18, rate: '$140 – $190', status: 'Pending' },
  { code: 'GBR-010', contact: 'Elise Park', name: 'Riverstone Wellness Weekend', type: 'Wellness retreat', dates: 'Dec 10 – Dec 13, 2026', rooms: 14, rate: '$140 – $210', status: 'Confirmed' },
  { code: 'GBR-011', contact: 'Nora Quinn', name: 'Calderwood Yoga Retreat', type: 'Yoga retreat', dates: 'Jan 14 – Jan 17, 2027', rooms: 16, rate: '$140 – $190', status: 'Converted' },
  { code: 'GBR-012', contact: 'Samir Khan', name: 'Summit Family Reunion', type: 'Family reunion', dates: 'Feb 11 – Feb 14, 2027', rooms: 22, rate: '$140 – $190', status: 'Converted' },
  { code: 'GBR-013', contact: 'Chloe Martin', name: 'Pinecrest Faculty Retreat', type: 'Education program', dates: 'Mar 04 – Mar 07, 2027', rooms: 12, rate: '$140 – $190', status: 'Confirmed' },
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
