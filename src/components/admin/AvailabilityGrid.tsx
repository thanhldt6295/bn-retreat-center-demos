import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { DatePicker } from '../shared/DatePicker'
import { AdminPage, Badge, Check, GlobalNav } from './Admin'
import { Icon } from './Icon'
import { Dropdown, HScrollBar, ZoomSlider } from './AgControls'
import { buildModel, DEFAULT_LEVEL, DEFAULT_SLIDER, DURATIONS, HOURLY_RANGES, LEVELS, parseTime, TIMES, unitAt, xOf, type Level, type Mode } from './agModel'
import './grid.css'

/* Availability grid used by V1 (1.4, 4.5) and V2 (C4, C7, C8). */

export type Kind = 'confirmed' | 'pending' | 'ooo' | 'held' | 'checkedin' | 'checkedout'
export type Booking = {
  row: number
  start: number // day index (0 = Mon Nov 9); Hourly: hours since midnight of the start date
  len: number
  kind: Kind
  name: string
  id?: string
  dates?: string
  room?: string
  group?: string
  total?: string
  sub?: string
  selected?: boolean
}

export type HoverKey = { type: 'requested'; row: number } | { type: 'booking'; index: number } | null

export const DAYS = Array.from({ length: 16 }, (_, i) => {
  const date = 9 + i
  const dow = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i % 7]
  return { date, dow }
})

export type Unit = { type: string; label: string; dot: string }
export const UNITS: Unit[] = [
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


/* Hourly mode: spaces instead of rooms, bookings in hours since midnight of Oct 9, 2026. */
export const HOURLY_UNITS: Unit[] = [
  { type: 'Meeting Hall', label: 'MH-1', dot: 'space' },
  { type: 'Meeting Hall', label: 'MH-2', dot: 'space' },
  { type: 'Meeting Hall', label: 'MH-3', dot: 'space' },
  { type: 'Dining Hall', label: 'DH-1', dot: 'space' },
]
const hb = (row: number, start: number, len: number, kind: Kind, name: string, sub: string, window: string, extra: Partial<Booking> = {}): Booking => ({
  row,
  start,
  len,
  kind,
  name,
  sub,
  id: kind === 'ooo' ? undefined : '#00031 · GBR-008',
  dates: window,
  group: 'Organizer: Maya Thompson',
  total: '$600.00',
  ...extra,
})
export const HOURLY_BOOKINGS: Booking[] = [
  hb(0, 9, 8, 'confirmed', 'Horizon Foundation', 'Leadership Sessions', 'Oct 9, 2026 · 9:00 AM – 5:00 PM'),
  hb(0, 33, 3, 'confirmed', 'Board meeting', 'Confirmed', 'Oct 10, 2026 · 9:00 AM – 12:00 PM', { id: '#00041 · direct booking', group: 'No group · direct booking', total: '$225.00' }),
  hb(1, 6, 2, 'checkedin', 'Sunrise Yoga', 'Checked In', 'Oct 9, 2026 · 6:00 – 8:00 AM', { id: '#00038 · direct booking', group: 'No group · direct booking', total: '$150.00' }),
  hb(2, 5, 1.5, 'checkedout', 'Shift briefing', 'Checked Out', 'Oct 9, 2026 · 5:00 – 6:30 AM', { id: '#00036 · direct booking', group: 'No group · direct booking', total: '$112.50' }),
  hb(2, 14, 4, 'ooo', 'Out of Order', '', '', { sub: 'MH-3 · Oct 9, 2:00 – 6:00 PM' }),
  hb(3, 18.5, 2, 'confirmed', 'Group dinner', 'Confirmed', 'Oct 9, 2026 · 6:30 – 8:30 PM'),
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
  /** rows to show (default: the V1 list) */
  units?: Unit[]
  /** colour the requested-stay columns in the header (V1 only) */
  requestedHead?: boolean
  legendPending?: string
  /** drag a booking to another unit */
  onMove?: (index: number, row: number) => void
  /** drag the right edge of a booking to change its length */
  onResize?: (index: number, len: number) => void
  /** text for the tooltip shown while resizing */
  resizeTip?: (index: number, len: number) => string
  /** scripted drag (the → key plays it) */
  demo?: Demo | null
  onDemoDone?: () => void
  /** Nightly (rooms, days) or Hourly (spaces, hours) */
  mode?: Mode
  /** applied Hourly filters (start date, start time, duration) */
  hourly?: HourlyFilters
  /** loading state: the grid fades */
  loading?: boolean
  onRefresh?: () => void
}
export type HourlyFilters = { date: string; time: string; duration: string }
export type Demo = { kind: 'move'; index: number; toRow: number } | { kind: 'resize'; index: number; toLen: number }
type Drag = { index: number; mode: 'move' | 'resize'; row: number; len: number }

const NIGHT_DEFAULT = { 'Start Date': 'Nov 12, 2026', 'End Date': 'Nov 15, 2026' }
const HOUR_DEFAULT: HourlyFilters = { date: 'Oct 9, 2026', time: '12:00 AM', duration: '1 Day' }
const LEFT = 370
const RELOAD_MS = 520

const Label = ({ children, info }: { children: ReactNode; info?: boolean }) => (
  <div className="lds-label" style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
    {children}
    {info && <Icon name="info" size="x-small" color="#5c5c5c" title="Dates are shown in the property time zone" />}
  </div>
)

export function AvailabilityPage(props: Props) {
  const [type, setType] = useState<Mode>('Nightly') // what the filter bar shows
  const [gridMode, setGridMode] = useState<Mode>('Nightly') // what the grid shows (swaps after the reload)
  const [loading, setLoading] = useState(false)
  const [dates, setDates] = useState<Record<string, string>>(NIGHT_DEFAULT)
  const [hf, setHf] = useState<HourlyFilters>(HOUR_DEFAULT) // Hourly form
  const [applied, setApplied] = useState<HourlyFilters>(HOUR_DEFAULT) // Hourly filters in use by the grid
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const reload = (after?: () => void) => {
    setLoading(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      after?.()
      setLoading(false)
    }, RELOAD_MS)
  }
  const changeType = (t: Mode) => {
    setType(t)
    reload(() => {
      setGridMode(t)
      setApplied(hf)
    })
  }
  const show = () => reload(() => setApplied(hf))
  const resetAll = () => {
    if (type === 'Nightly') setDates(NIGHT_DEFAULT)
    else setHf(HOUR_DEFAULT)
    reload(() => type === 'Hourly' && setApplied(HOUR_DEFAULT))
  }

  const dateField = (l: 'Start Date' | 'End Date') => (
    <div key={l} style={{ flex: 1 }}>
      <Label info>{l}</Label>
      <DatePicker theme="lds" value={dates[l]} onChange={(x) => setDates((d) => ({ ...d, [l]: x }))} min={l === 'End Date' ? dates['Start Date'] : undefined}>
        {(open) => (
          <div className={`slds-input-has-icon slds-input-has-icon_right ${open ? 'slds-has-focus' : ''}`}>
            <Icon name="date_input" className="slds-input__icon slds-input__icon_right" color="#0b5cff" />
            <input className="slds-input" readOnly value={dates[l]} aria-label={l} style={{ cursor: 'pointer' }} />
          </div>
        )}
      </DatePicker>
    </div>
  )
  const plain = (l: string, v: string) => (
    <div key={l} style={{ flex: 1 }}>
      <Label>{l}</Label>
      <input className="slds-input" readOnly value={v} aria-label={l} />
    </div>
  )

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
          <div style={{ flex: 1 }}>
            <Label>Type</Label>
            <Dropdown value={type} options={['Hourly', 'Nightly']} onChange={(v) => changeType(v as Mode)} ariaLabel="Type" />
          </div>
          {type === 'Nightly' ? (
            <>
              {dateField('Start Date')}
              {dateField('End Date')}
            </>
          ) : (
            <>
              <div style={{ flex: 1 }}>
                <Label>Start Date</Label>
                <DatePicker theme="lds" value={hf.date} onChange={(x) => setHf((f) => ({ ...f, date: x }))}>
                  {(open) => (
                    <div className={`slds-input-has-icon slds-input-has-icon_right ${open ? 'slds-has-focus' : ''}`}>
                      <Icon name="date_input" className="slds-input__icon slds-input__icon_right" color="#0b5cff" />
                      <input className="slds-input" readOnly value={hf.date} aria-label="Start Date" style={{ cursor: 'pointer' }} />
                    </div>
                  )}
                </DatePicker>
              </div>
              <div style={{ flex: 1 }}>
                <Label>Start Time</Label>
                <Dropdown value={hf.time} options={TIMES} onChange={(v) => setHf((f) => ({ ...f, time: v }))} ariaLabel="Start Time" icon="clock" listMax={220} />
              </div>
              <div style={{ flex: 1 }}>
                <Label>Duration</Label>
                <Dropdown value={hf.duration} options={DURATIONS} onChange={(v) => setHf((f) => ({ ...f, duration: v }))} ariaLabel="Duration" />
              </div>
            </>
          )}
          {plain('Property', 'Cedar Valley')}
          {plain('Room Type', 'All')}
          {plain('Floor', 'All')}
          {type === 'Nightly' && (
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, height: 32, color: '#444' }}>
              <Check label="Only Available" />
            </label>
          )}
          <button className="slds-button slds-button_brand" disabled={loading} onClick={show}>
            <Icon name="search" className="slds-button__icon slds-button__icon_left" />
            Show
          </button>
          <button className="slds-button slds-button_neutral" onClick={resetAll}>
            <Icon name="refresh" className="slds-button__icon slds-button__icon_left" />
            Reset all
          </button>
        </div>
        <AvailabilityGrid {...props} key={gridMode} mode={gridMode} hourly={applied} loading={loading} onRefresh={() => reload()} />
      </div>
    </AdminPage>
  )
}

const FONT = (w: number) => (w < 34 ? 9 : w < 46 ? 10 : 12)

export function AvailabilityGrid({
  bookings: bookingsProp,
  forced,
  requestedHover,
  legendRequested = true,
  presetSelect,
  onOpenReservation,
  units: unitsProp = UNITS,
  requestedHead = true,
  legendPending = 'Pending Approval',
  onMove,
  onResize,
  resizeTip,
  demo,
  onDemoDone,
  mode = 'Nightly',
  hourly = HOUR_DEFAULT,
  loading = false,
  onRefresh,
}: Props) {
  const hourlyMode = mode === 'Hourly'
  const units = hourlyMode ? HOURLY_UNITS : unitsProp
  const bookings = hourlyMode ? HOURLY_BOOKINGS : bookingsProp
  const canDrag = !hourlyMode

  /* zoom: discrete level + continuous column width (slider) */
  const [level, setLevel] = useState<Level>(DEFAULT_LEVEL[mode])
  const [slider, setSlider] = useState(DEFAULT_SLIDER)
  const [sx, setSx] = useState(0)
  const [viewW, setViewW] = useState(0)
  const vpRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const el = vpRef.current
    if (!el) return
    const measure = () => setViewW(el.clientWidth)
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    measure()
    const raf = requestAnimationFrame(measure)
    const late = window.setTimeout(measure, 300)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      cancelAnimationFrame(raf)
      window.clearTimeout(late)
      window.removeEventListener('resize', measure)
    }
  }, [])
  const vw = viewW || 1000

  const model = useMemo(
    () => buildModel(mode, level, { date: new Date(hourly.date), startMin: parseTime(hourly.time), hours: HOURLY_RANGES[hourly.duration] ?? 24 }),
    [mode, level, hourly.date, hourly.time, hourly.duration],
  )
  const N = model.cols.length
  const colW0 = mode === 'Nightly' && level === 'Day' ? vw / 16 : ({ Week: 80, Month: 80, Quarter: 80, '30 Min': 64, Hour: 80, Day: 64 } as Record<Level, number>)[level]
  const minW = Math.min(colW0 * 0.6, Math.max(14, Math.min(30, Math.floor(vw / N) - 1)))
  const colW = minW * Math.pow(colW0 / minW, slider / DEFAULT_SLIDER)
  const total = N * colW
  const maxScroll = Math.max(0, total - vw)
  const overflow = maxScroll > 1
  const scrollX = Math.max(0, Math.min(sx, maxScroll))
  const setScroll = (x: number) => setSx(Math.max(0, Math.min(x, maxScroll)))
  const X = (u: number) => xOf(model, u, colW)
  const ux = (u: number) => u - model.origin

  const levels = LEVELS[mode]
  const li = levels.indexOf(level)

  // trackpad / shift+wheel scrolls the grid sideways
  const tableRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = tableRef.current
    if (!el) return
    const wheel = (e: WheelEvent) => {
      if (!overflow) return
      const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0
      if (!dx) return
      e.preventDefault()
      setSx((v) => Math.max(0, Math.min(v + dx, maxScroll)))
    }
    el.addEventListener('wheel', wheel, { passive: false })
    return () => el.removeEventListener('wheel', wheel)
  }, [overflow, maxScroll])

  /* sort rows (display order → data row) */
  const [sortKey, setSortKey] = useState('Property')
  const [desc, setDesc] = useState(false)
  const order = useMemo(() => {
    const val = (i: number) => (sortKey === 'Room Type' ? units[i].type : sortKey === 'Unit' ? units[i].label : 'Cedar Valley')
    const idx = units.map((_, i) => i).sort((a, b) => val(a).localeCompare(val(b), undefined, { numeric: true }) || a - b)
    return desc ? idx.reverse() : idx
  }, [units, sortKey, desc])

  const [hover, setHover] = useState<HoverKey>(null)
  const [drag, setDrag] = useState<Drag | null>(null)
  const dragRef = useRef<Drag | null>(null)
  dragRef.current = drag
  const geom = useCallback(() => {
    const t = tableRef.current
    if (!t) return null
    const rows = Array.from(t.querySelectorAll<HTMLElement>('.ag-row'))
    if (!rows.length) return null
    return { rowTops: rows.map((r) => r.offsetTop), rowH: rows[0].offsetHeight }
  }, [])

  const begin = (e: React.MouseEvent, index: number, dragMode: 'move' | 'resize') => {
    if (!canDrag || (dragMode === 'move' && !onMove) || (dragMode === 'resize' && !onResize)) return
    e.preventDefault()
    e.stopPropagation()
    const b = bookings[index]
    setHover(null)
    setDrag({ index, mode: dragMode, row: b.row, len: b.len })
    const move = (ev: MouseEvent) => {
      const g = geom()
      const t = tableRef.current
      if (!g || !t) return
      const rect = t.getBoundingClientRect()
      const cur = dragRef.current
      if (!cur) return
      if (dragMode === 'move') {
        const y = ev.clientY - rect.top
        const disp = g.rowTops.findIndex((top) => y >= top && y < top + g.rowH)
        setDrag({ ...cur, row: disp < 0 ? cur.row : order[disp] })
      } else {
        const x = ev.clientX - rect.left - LEFT + scrollX
        const u = Math.round(unitAt(model, x, colW) / model.snap) * model.snap
        setDrag({ ...cur, len: Math.max(model.snap, Math.min(model.total - b.start, u - b.start)) })
      }
    }
    const up = () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
      const cur = dragRef.current
      setDrag(null)
      if (!cur) return
      if (cur.mode === 'move' && cur.row !== b.row) onMove?.(cur.index, cur.row)
      if (cur.mode === 'resize' && cur.len !== b.len) onResize?.(cur.index, cur.len)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
  }

  // scripted drag for the → key
  useEffect(() => {
    if (!demo) return
    const b = bookings[demo.index]
    const timers: number[] = []
    setHover(null)
    setDrag({ index: demo.index, mode: demo.kind, row: b.row, len: b.len })
    if (demo.kind === 'move') {
      timers.push(window.setTimeout(() => setDrag({ index: demo.index, mode: 'move', row: demo.toRow, len: b.len }), 450))
    } else {
      for (let n = b.len + 1; n <= demo.toLen; n++) {
        timers.push(window.setTimeout(() => setDrag({ index: demo.index, mode: 'resize', row: b.row, len: n }), 450 + (n - b.len) * 450))
      }
    }
    const end = 450 + (demo.kind === 'move' ? 700 : (demo.toLen - b.len) * 450 + 500)
    timers.push(
      window.setTimeout(() => {
        setDrag(null)
        if (demo.kind === 'move') onMove?.(demo.index, demo.toRow)
        else onResize?.(demo.index, demo.toLen)
        onDemoDone?.()
      }, end),
    )
    return () => timers.forEach((t) => window.clearTimeout(t))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demo])
  const [sel, setSel] = useState<{ row: number; a: number; b: number; done: boolean } | null>(
    presetSelect ? { ...presetSelect, done: true } : null,
  )
  const active = forced ?? hover
  const selRange = sel ? [Math.min(sel.a, sel.b), Math.max(sel.a, sel.b)] : null
  const clampLeft = (x: number, w: number) => Math.max(scrollX + 8, Math.min(x, scrollX + vw - w - 16))
  const dayLevel = mode === 'Nightly' && level === 'Day'
  const gridCols = `repeat(${N}, ${colW}px)`
  const shift = { transform: `translateX(${-scrollX}px)` }

  return (
    <div className={`ag-card ${hourlyMode ? 'ag-hourly' : ''}`} onMouseLeave={() => setHover(null)}>
      <div className="ag-tools">
        <ZoomSlider value={slider} onChange={setSlider} />
        <button
          className={`slds-button slds-button_icon slds-button_icon-border-filled ag-circ ${li > 0 ? 'on' : ''}`}
          title="Zoom in"
          aria-label="Zoom in"
          disabled={li <= 0}
          onClick={() => setLevel(levels[li - 1])}
        >
          <Icon name="dash" color={li > 0 ? '#0b5cff' : undefined} />
        </button>
        <span className="ag-zl" style={{ color: '#444' }}>
          {level}
        </span>
        <button
          className={`slds-button slds-button_icon slds-button_icon-border-filled ag-circ ${li < levels.length - 1 ? 'on' : ''}`}
          title="Zoom out"
          aria-label="Zoom out"
          disabled={li >= levels.length - 1}
          onClick={() => setLevel(levels[li + 1])}
        >
          <Icon name="add" color={li < levels.length - 1 ? '#0b5cff' : undefined} />
        </button>
        <span style={{ color: '#444', marginLeft: 8 }}>Sort by</span>
        <Dropdown value={sortKey} options={['Property', 'Room Type', 'Unit']} onChange={setSortKey} width={170} ariaLabel="Sort by" />
        <button
          className="slds-button slds-button_icon slds-button_icon-border-filled ag-circ dark"
          title={desc ? 'Descending' : 'Ascending'}
          aria-label={desc ? 'Descending' : 'Ascending'}
          onClick={() => setDesc((d) => !d)}
        >
          <Icon name="arrowup" color="#181818" style={{ transform: desc ? 'rotate(180deg)' : undefined, transition: 'transform .2s' }} />
        </button>
        <button className="slds-button slds-button_icon slds-button_icon-border-filled ag-circ on refresh" style={{ marginLeft: 'auto' }} title="Refresh" aria-label="Refresh" onClick={onRefresh}>
          <Icon name="refresh" color="#0b5cff" />
        </button>
      </div>
      <div className={`ag-area ${loading ? 'loading' : ''}`}>
        <div className="ag-hbarwrap" style={{ paddingLeft: LEFT }}>
          {overflow && <HScrollBar viewW={vw} total={total} scrollX={scrollX} onScroll={setScroll} />}
        </div>
        <div className={`ag-table ${drag ? 'dragging' : ''}`} ref={tableRef}>
          <div className="ag-head">
            <div className="ag-lefthead">
              <span style={{ width: 91 }}>Property</span>
              <span style={{ width: 168 }}>Room Type</span>
              <span style={{ width: 111 }}>Unit</span>
            </div>
            <div className="ag-daysvp" ref={vpRef}>
              <div className="ag-days" style={{ width: total, ...shift }}>
                <div className="ag-groups" style={{ gridTemplateColumns: model.groups.map((g) => `${g.cols * colW}px`).join(' ') }}>
                  {model.groups.map((g, i) => (
                    <div key={i} className={`ag-month ${i > 0 ? 'bl' : ''}`} title={g.label}>
                      {g.label}
                    </div>
                  ))}
                </div>
                <div className="ag-dayrow" style={{ gridTemplateColumns: gridCols, fontSize: FONT(colW) }}>
                  {model.cols.map((c, i) => (
                    <div key={i} className={`ag-dh ${c.req && requestedHead ? 'req' : c.wk ? 'wk' : ''}`} title={c.bottom ? `${c.top} ${c.bottom}` : c.top}>
                      {c.top}
                      {c.bottom && (
                        <>
                          <br />
                          {c.bottom}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {order.map((dataRow, r) => {
            const u = units[dataRow]
            // a row with an open popover / menu must paint above the rows below it (each row's cells are their own stacking context)
            const raised =
              (active?.type === 'booking' && bookings[active.index]?.row === dataRow) ||
              (active?.type === 'requested' && active.row === r) ||
              (!!sel && sel.done && sel.row === r)
            return (
              <div className={`ag-row ${raised ? 'raised' : ''}`} key={dataRow}>
                <div className="ag-left">
                  <span style={{ width: 91 }}>Cedar Valley</span>
                  <span style={{ width: 168 }}>{u.type}</span>
                  <span style={{ width: 111, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <i className={`ag-dot ${u.dot}`} />
                    {u.label}
                  </span>
                </div>
                <div className="ag-cellsvp">
                  <div className="ag-cells" style={{ width: total, gridTemplateColumns: gridCols, ...shift }}>
                    {model.cols.map((c, i) => {
                      const inSel = sel && sel.row === r && selRange && i >= selRange[0] && i <= selRange[1]
                      return (
                        <div
                          key={i}
                          className={`ag-cell ${c.req && legendRequested ? 'req' : c.wk ? 'wk' : ''} ${inSel ? 'sel' : ''}`}
                          onMouseEnter={() => {
                            if (requestedHover && dayLevel && c.req) setHover({ type: 'requested', row: r })
                            if (sel && !sel.done && sel.row === r) setSel({ ...sel, b: i })
                          }}
                          onMouseDown={() => setSel({ row: r, a: i, b: i, done: false })}
                          onMouseUp={() => sel && setSel({ ...sel, done: true })}
                        />
                      )
                    })}
                    {bookings.map((b, bi) => {
                      if (b.row !== dataRow) return null
                      const x0 = X(ux(b.start))
                      const x1 = X(ux(b.start + b.len))
                      if (x1 < -4 || x0 > total + 4) return null
                      return (
                        <div
                          key={bi}
                          className={`ag-bk ${b.kind} ${(active && active.type === 'booking' && active.index === bi) || b.selected ? 'hot' : ''} ${drag && drag.index === bi ? 'ghosted' : ''} ${canDrag && onMove && b.kind !== 'ooo' && b.kind !== 'held' ? 'movable' : ''}`}
                          style={{ left: x0 + 2, width: Math.max(4, x1 - x0 - 4) }}
                          onMouseEnter={() => setHover({ type: 'booking', index: bi })}
                          onMouseDown={(e) => b.kind !== 'ooo' && b.kind !== 'held' && begin(e, bi, 'move')}
                        >
                          <b>{b.name}</b>
                          {b.kind !== 'ooo' && <span>{b.sub ?? (b.kind === 'pending' ? 'Pending Approval' : 'Confirmed')}</span>}
                          {canDrag && onResize && b.kind === 'confirmed' && <i className="ag-handle" title="Drag to extend the stay" onMouseDown={(e) => begin(e, bi, 'resize')} />}
                        </div>
                      )
                    })}
                    {/* popovers */}
                    {active && active.type === 'requested' && active.row === r && dayLevel && (
                      <div className="slds-popover slds-popover_tooltip slds-nubbin_bottom-left ag-tip" role="tooltip" style={{ left: X(3) + 14, top: 22 }}>
                        <b>Requested stay · Nov 12 – 15</b>
                        <br />
                        22 rooms needed · all room types available
                      </div>
                    )}
                    {active && active.type === 'booking' && bookings[active.index]?.row === dataRow && (
                      <div
                        className="ag-pop"
                        style={{ left: clampLeft(X(ux(bookings[active.index].start)) + (bookings[active.index].kind === 'ooo' ? 20 : 18), 300), top: 34, zIndex: 40 }}
                        onClick={onOpenReservation}
                      >
                        {popFor(bookings[active.index], u.label, u.type)}
                      </div>
                    )}
                    {sel && sel.done && sel.row === r && selRange && (
                      <div className="slds-dropdown slds-dropdown_left ag-menu" style={{ left: clampLeft((selRange[1] + 1) * colW + 14, 170), top: 30 }}>
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
              </div>
            )
          })}
          {drag && <DragGhost drag={drag} b={bookings[drag.index]} row={Math.max(0, order.indexOf(drag.row))} geom={geom()} X={(v) => X(ux(v)) + LEFT - scrollX} tip={drag.mode === 'resize' ? resizeTip?.(drag.index, drag.len) : undefined} />}
        </div>
      </div>
      {hourlyMode ? (
        <div className="ag-legend">
          <span><i className="lg h-c" /> Confirmed</span>
          <span><i className="lg h-i" /> Checked In</span>
          <span><i className="lg h-o" /> Checked Out</span>
          <span><i className="lg ban red" /> Out of Order</span>
          <span><i className="lg ban" /> Unavailable</span>
          <span><i className="lg h-m" /> Management Contracts</span>
          <span style={{ marginLeft: 'auto' }}>Showing {units.length} of {units.length} spaces</span>
        </div>
      ) : (
        <div className="ag-legend">
          <span><i className="lg" /> Available</span>
          <span><i className="lg c" /> Confirmed</span>
          <span><i className="lg p" /> {legendPending}</span>
          <span><i className="lg o" /> Out of Order</span>
          <span><i className="lg w" /> Weekend</span>
          {legendRequested && <span><i className="lg r" /> Requested stay</span>}
          <span style={{ marginLeft: 'auto' }}>Showing 11 of 44 units</span>
        </div>
      )}
    </div>
  )
}

function DragGhost({ drag, b, row, geom, X, tip }: { drag: Drag; b: Booking; row: number; geom: { rowTops: number[]; rowH: number } | null; X: (u: number) => number; tip?: string }) {
  if (!geom) return null
  const top = (geom.rowTops[row] ?? 0) + 4
  const left = X(b.start) + 2
  const width = X(b.start + drag.len) - X(b.start) - 4
  return (
    <>
      <div className={`ag-bk ${b.kind} ag-ghost`} style={{ top, left, width, height: geom.rowH - 8, bottom: 'auto' }}>
        <b>{b.name}</b>
        <span>{b.sub ?? (b.kind === 'pending' ? 'Pending Approval' : 'Confirmed')}</span>
      </div>
      {tip && (
        <div className="slds-popover slds-popover_tooltip ag-tip" role="tooltip" style={{ top: top - 40, left: left + width - 70, transition: 'left .3s' }}>
          {tip}
        </div>
      )}
    </>
  )
}
