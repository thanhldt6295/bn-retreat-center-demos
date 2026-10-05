import {
  AvailabilityPage,
  BASE_BOOKINGS,
  UNITS,
  type Booking,
  type HoverKey,
} from '../../components/admin/AvailabilityGrid'
import type { SceneProps } from '../../player/Player'

const PENDING: Booking[] = UNITS.map((u, row) => ({
  row,
  start: 3,
  len: 3,
  kind: 'pending',
  name: 'Horizon Foundation',
  id: '#00031 · GBR-008',
  dates: 'Nov 12 – 15, 2026 · 3 nights',
  room: `${u.type} · ${u.label}`,
  group: 'Organizer: Maya Thompson',
  total: '$18,612.00 · balance $9,306.00',
}))

/* 1.4, 1.4b, 1.4c, 1.4d */
export function AvailabilityCheck({ step }: SceneProps) {
  const forced: HoverKey =
    step === '1.4b'
      ? { type: 'requested', row: 0 }
      : step === '1.4c'
        ? { type: 'booking', index: 0 }
        : step === '1.4d'
          ? { type: 'booking', index: 3 }
          : null
  return <AvailabilityPage bookings={BASE_BOOKINGS} forced={forced} requestedHover />
}

/* 4.5, 4.5b, 4.5c */
export function AvailabilityReserved({ step, goto }: SceneProps) {
  const bookings = [...BASE_BOOKINGS, ...PENDING]
  const forced: HoverKey = step === '4.5b' ? { type: 'booking', index: BASE_BOOKINGS.length } : null
  return (
    <AvailabilityPage
      key={step}
      bookings={bookings}
      forced={forced}
      legendRequested={false}
      presetSelect={step === '4.5c' ? { row: 0, a: 7, b: 9 } : null}
      onOpenReservation={() => goto('4.3')}
    />
  )
}
