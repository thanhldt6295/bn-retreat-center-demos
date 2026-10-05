import { useState, type ReactNode } from 'react'
import { DatePicker } from '../shared/DatePicker'
import { AdminPage, Badge, Check, GlobalNav, Select } from './Admin'
import { Icon } from './Icon'
import './grid.css'

/* Availability grid used by V1 (1.4, 4.5) and V2 (C4, C7, C8). */

export type Kind = 'confirmed' | 'pending' | 'ooo'
export type Booking = {
  row: number
  start: number // day index (0 = Mon Nov 9)
  len: number
  kind: Kind
  name: string
  id?: string
  dates?: string
  room?: string
  group?: string
  total?: string
  sub?: string
}

export type HoverKey = { type: 'requested'; row: number } | { type: 'booking'; index: number } | null

export const DAYS = Array.from({ length: 16 }, (_, i) => {
  const date = 9 + i
  const dow = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i % 7]
  return { date, dow }
})
const REQUESTED = [3, 4, 5]
const WEEKEND = [5, 6, 12, 13]

export const UNITS = [
  { type: 'Standard Single Room', label: '101', dot: 'room' },
  { type: 'Standard Single Room', label: '102', dot: 'room' },
  { type: 'Standard Single Room', label: '103', dot: 'room' },
  { type: 'Standard Double Room', label: '201', dot: 'room' },
  { type: 'Standard Double Room', label: '202', dot: 'room' },
  { type: 'Standard Double Room', label: '203', dot: 'room' },
  { type: 'Cabin', label: 'Cabin 1', dot: 'room' },
  { type: 'Cabin', label: 'Cabin 2', dot: 'room' },
  { type: 'Cabin', label: 'Cabin 3', dot: 'room' },
  { type: 'Cabin', label: 'Cabin 4', dot: 'room' },
  ...[1, 2, 3, 4, 5, 6].map((n) => ({ type: 'Meeting Hall', label: `MH-${n}`, dot: 'space' })),
]

export const BASE_BOOKINGS: Booking[] = [
  { row: 1, start: 0, len: 3, kind: 'confirmed', name: 'L. Park', id: '#00027 · direct booking', dates: 'Nov 9 – 12, 2026 · 3 nights', room: 'Standard Single Room · 102', group: 'No group · direct booking', total: '$528.00 · balance $0.00' },
  { row: 2, start: 10, len: 3, kind: 'confirmed', name: 'S. Ortiz', id: '#00029 · direct booking', dates: 'Nov 19 – 22, 2026 · 3 nights', room: 'Standard Single Room · 103', group: 'No group · direct booking', total: '$462.00 · balance $0.00' },
  { row: 3, start: 10, len: 4, kind: 'confirmed', name: 'T. Nguyen', id: '#00030 · direct booking', dates: 'Nov 19 – 23, 2026 · 4 nights', room: 'Standard Double Room · 201', group: 'No group · direct booking', total: '$616.00 · balance $0.00' },
  { row: 5, start: 7, len: 3, kind: 'ooo', name: 'Out of Order', sub: 'Standard 203 · Nov 16 – 18' },
  { row: 9, start: 0, len: 3, kind: 'confirmed', name: 'R. Singh', id: '#00026 · direct booking', dates: 'Nov 9 – 12, 2026 · 3 nights', room: 'Cabin · Cabin 4', group: 'No group · direct booking', total: '$627.00 · balance $0.00' },
]

export function PopCard({ title, badge, badgeTone, sub, rows, actions }: {
  title: string
  badge: string
  badgeTone?: 'ok' | 'warn' | ''
  sub: string
  rows: [string, string][]
  actions: [string, boolean][]
}) {
  return (
    <div className="slds-popover ag-pop-card" role="dialog">
      <div className="ag-pop-h">
        <b>{title}</b>
        <Badge tone={badgeTone}>{badge}</Badge>
      </div>
      <div className="ag-pop-sub">{sub}</div>
      {rows.map(([k, v]) => (
        <div className="ag-pop-row" key={k}>
          <span>{k}</span>
          <b>{v}</b>
        </div>
      ))}
      <div className="ag-pop-actions">
        {actions.map(([t, brand]) => (
          <button key={t} className={`slds-button ${brand ? 'slds-button_brand' : 'slds-button_neutral'}`} style={{ flex: 1, margin: 0 }}>
            {t}
          </button>
        ))}
      </div>
    </div>
  )
}

function popFor(b: Booking, rowLabel: string, rowType: string): ReactNode {
  if (b.kind === 'ooo') {
    return (
      <PopCard
        title="Out of Order"
        badge="Out of Order"
        sub={b.sub ?? ''}
        rows={[['Reason', 'Plumbing repair'], ['Set by', 'Sam Patel · Oct 20'], ['Back in service', 'Nov 19, 2026']]}
        actions={[['Return to service', false], ['Edit', true]]}
      />
    )
  }
  return (
    <PopCard
      title={b.name}
      badge={b.kind === 'pending' ? 'Pending Approval' : 'Confirmed'}
      badgeTone={b.kind === 'pending' ? 'warn' : 'ok'}
      sub={b.id ?? ''}
      rows={[
        ['Dates', b.dates ?? ''],
        ['Room', b.room ?? `${rowType} · ${rowLabel}`],
        ['Group', b.group ?? ''],
        ['Total', b.total ?? ''],
      ]}
      actions={[['Change room', false], ['Open reservation', true]]}
    />
  )
}

type Props = {
  bookings: Booking[]
  /** forced hover (for scripted steps) */
  forced?: HoverKey
  /** show the requested-stay hover tooltip on the blue columns */
  requestedHover?: boolean
  legendRequested?: boolean
  /** preselected cells (row, from, to) with the context menu open */
  presetSelect?: { row: number; a: number; b: number } | null
  onOpenReservation?: () => void
}

export function AvailabilityPage(props: Props) {
  const [dates, setDates] = useState<Record<string, string>>({ 'Start Date': 'Nov 12, 2026', 'End Date': 'Nov 15, 2026' })
  return (
    <AdminPage>
      <GlobalNav active="Availability" />
      <div className="lds-page" style={{ paddingTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
          <button className="slds-button slds-button_brand">
            <Icon name="add" className="slds-button__icon slds-button__icon_left" />
            New Reservation
          </button>
        </div>
        <div className="ag-filters">
          {[
            ['Type', 'Nightly'],
            ['Start Date', 'Nov 12, 2026'],
            ['End Date', 'Nov 15, 2026'],
            ['Property', 'Cedar Valley'],
            ['Room Type', 'All'],
            ['Floor', 'All'],
          ].map(([l, v]) => (
            <div key={l} style={{ flex: 1 }}>
              <div className="lds-label" style={{ fontSize: 13 }}>
                {l}
              </div>
              {l in dates ? (
                <DatePicker theme="lds" value={dates[l]} onChange={(x) => setDates((d) => ({ ...d, [l]: x }))} min={l === 'End Date' ? dates['Start Date'] : undefined}>
                  {(open) => (
                    <div className={`slds-input-has-icon slds-input-has-icon_right ${open ? 'slds-has-focus' : ''}`}>
                      <Icon name="date_input" className="slds-input__icon slds-input__icon_right" color="#0b5cff" />
                      <input className="slds-input" readOnly value={dates[l]} aria-label={l} style={{ borderRadius: 6, cursor: 'pointer' }} />
                    </div>
                  )}
                </DatePicker>
              ) : (
                <Select value={v} style={{ borderRadius: 6 }} />
              )}
            </div>
          ))}
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, height: 32, color: '#444' }}>
            <Check label="Only Available" />
          </label>
          <button className="slds-button slds-button_brand">
            <Icon name="search" className="slds-button__icon slds-button__icon_left" />
            Search
          </button>
          <button className="slds-button slds-button_neutral">
            <Icon name="refresh" className="slds-button__icon slds-button__icon_left" />
            Reset all
          </button>
        </div>
        <AvailabilityGrid {...props} />
      </div>
    </AdminPage>
  )
}

export function AvailabilityGrid({ bookings, forced, requestedHover, legendRequested = true, presetSelect, onOpenReservation }: Props) {
  const [hover, setHover] = useState<HoverKey>(null)
  const [sel, setSel] = useState<{ row: number; a: number; b: number; done: boolean } | null>(
    presetSelect ? { ...presetSelect, done: true } : null,
  )
  const active = forced ?? hover

  const selRange = sel ? [Math.min(sel.a, sel.b), Math.max(sel.a, sel.b)] : null

  return (
    <div className="ag-card" onMouseLeave={() => setHover(null)}>
      <div className="ag-tools">
        <div className="ag-slider">
          <i />
        </div>
        <button className="slds-button slds-button_icon slds-button_icon-border-filled ag-circ" title="Zoom out" disabled>
          <Icon name="dash" />
        </button>
        <span style={{ color: '#444' }}>Day</span>
        <button className="slds-button slds-button_icon slds-button_icon-border-filled ag-circ on" title="Zoom in">
          <Icon name="add" color="#0b5cff" />
        </button>
        <span style={{ color: '#444', marginLeft: 8 }}>Sort by</span>
        <div style={{ width: 170 }}>
          <Select value="Property" style={{ borderRadius: 6 }} />
        </div>
        <button className="slds-button slds-button_icon slds-button_icon-border-filled ag-circ dark" title="Sort ascending">
          <Icon name="arrowup" color="#181818" />
        </button>
        <button className="slds-button slds-button_icon slds-button_icon-border-filled ag-circ on" style={{ marginLeft: 'auto' }} title="Undo">
          <Icon name="undo" color="#0b5cff" />
        </button>
      </div>
      <div className="ag-bar" />
      <div className="ag-table">
        <div className="ag-head">
          <div className="ag-lefthead">
            <span style={{ width: 91 }}>Property</span>
            <span style={{ width: 168 }}>Room Type</span>
            <span style={{ width: 111 }}>Unit</span>
          </div>
          <div className="ag-days">
            <div className="ag-month">Nov 2026</div>
            <div className="ag-dayrow">
              {DAYS.map((d, i) => (
                <div key={i} className={`ag-dh ${REQUESTED.includes(i) ? 'req' : WEEKEND.includes(i) ? 'wk' : ''}`}>
                  {d.dow}
                  <br />
                  {d.date}
                </div>
              ))}
            </div>
          </div>
        </div>
        {UNITS.map((u, r) => (
          <div className="ag-row" key={r}>
            <div className="ag-left">
              <span style={{ width: 91 }}>Cedar Valley</span>
              <span style={{ width: 168 }}>{u.type}</span>
              <span style={{ width: 111, display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className={`ag-dot ${u.dot}`} />
                {u.label}
              </span>
            </div>
            <div className="ag-cells">
              {DAYS.map((_, i) => {
                const inSel = sel && sel.row === r && selRange && i >= selRange[0] && i <= selRange[1]
                return (
                  <div
                    key={i}
                    className={`ag-cell ${REQUESTED.includes(i) && legendRequested ? 'req' : WEEKEND.includes(i) ? 'wk' : ''} ${inSel ? 'sel' : ''}`}
                    onMouseEnter={() => {
                      if (requestedHover && REQUESTED.includes(i)) setHover({ type: 'requested', row: r })
                      if (sel && !sel.done && sel.row === r) setSel({ ...sel, b: i })
                    }}
                    onMouseDown={() => setSel({ row: r, a: i, b: i, done: false })}
                    onMouseUp={() => sel && setSel({ ...sel, done: true })}
                  />
                )
              })}
              {bookings.map((b, bi) => {
                if (b.row !== r) return null
                return (
                  <div
                    key={bi}
                    className={`ag-bk ${b.kind} ${active && active.type === 'booking' && active.index === bi ? 'hot' : ''}`}
                    style={{ left: `calc(${(b.start / 16) * 100}% + 2px)`, width: `calc(${(b.len / 16) * 100}% - 4px)` }}
                    onMouseEnter={() => setHover({ type: 'booking', index: bi })}
                  >
                    <b>{b.name}</b>
                    {b.kind !== 'ooo' && <span>{b.kind === 'pending' ? 'Pending Approval' : 'Confirmed'}</span>}
                  </div>
                )
              })}
              {/* popovers */}
              {active && active.type === 'requested' && active.row === r && (
                <div className="slds-popover slds-popover_tooltip slds-nubbin_bottom-left ag-tip" role="tooltip" style={{ left: `calc(${(3 / 16) * 100}% + 14px)`, top: 22 }}>
                  <b>Requested stay · Nov 12 – 15</b>
                  <br />
                  22 rooms needed · all room types available
                </div>
              )}
              {active && active.type === 'booking' && bookings[active.index]?.row === r && (
                <div
                  className="ag-pop"
                  style={{
                    left: `calc(${(bookings[active.index].start / 16) * 100}% + ${bookings[active.index].kind === 'ooo' ? 20 : 18}px)`,
                    top: 34,
                    zIndex: 40,
                  }}
                  onClick={onOpenReservation}
                >
                  {popFor(bookings[active.index], u.label, u.type)}
                </div>
              )}
              {sel && sel.done && sel.row === r && selRange && (
                <div className="slds-dropdown slds-dropdown_left ag-menu" style={{ left: `calc(${((selRange[1] + 1) / 16) * 100}% + 14px)`, top: 30 }}>
                  <ul className="slds-dropdown__list" role="menu">
                    <li className="slds-dropdown__item" role="presentation">
                      <a role="menuitem">
                        <span className="slds-truncate">
                          <Icon name="add" className="slds-icon-text-default slds-m-right_x-small" color="#5c5c5c" />
                          New Reservation
                        </span>
                      </a>
                    </li>
                    <li className="slds-dropdown__item" role="presentation">
                      <a role="menuitem">
                        <span className="slds-truncate">
                          <Icon name="user" className="slds-icon-text-default slds-m-right_x-small" color="#5c5c5c" />
                          Out of Order
                        </span>
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="ag-legend">
        <span><i className="lg" /> Available</span>
        <span><i className="lg c" /> Confirmed</span>
        <span><i className="lg p" /> Pending Approval</span>
        <span><i className="lg o" /> Out of Order</span>
        <span><i className="lg w" /> Weekend</span>
        {legendRequested && <span><i className="lg r" /> Requested stay</span>}
        <span style={{ marginLeft: 'auto' }}>Showing 11 of 44 units</span>
      </div>
    </div>
  )
}
