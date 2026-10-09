/* Column model of the availability grid: zoom levels, header rows and unit → pixel mapping. */

export type Mode = 'Nightly' | 'Hourly'
export type Level = 'Day' | 'Week' | 'Month' | 'Quarter' | '30 Min' | 'Hour'

/** finest → coarsest. [+] moves right (zoom out), [−] moves left (zoom in). */
export const LEVELS: Record<Mode, Level[]> = {
  Nightly: ['Day', 'Week', 'Month', 'Quarter'],
  Hourly: ['30 Min', 'Hour'],
}
export const DEFAULT_LEVEL: Record<Mode, Level> = { Nightly: 'Day', Hourly: '30 Min' }
export const DEFAULT_SLIDER = 0.4

export type Col = { from: number; span: number; top: string; bottom?: string; wk?: boolean; req?: boolean }
export type Group = { label: string; cols: number }
export type Model = {
  cols: Col[]
  groups: Group[]
  /** length of the visible range in base units (days for Nightly, hours for Hourly) */
  total: number
  /** bookings snap to this many base units while dragging */
  snap: number
  /** base-unit offset of the first column (Hourly start time) */
  origin: number
}

export const HOURLY_RANGES: Record<string, number> = { '1 Day': 24, '2 Days': 48, '3 Days': 72, '1 Week': 168 }
export const DURATIONS = Object.keys(HOURLY_RANGES)

/** Nightly range: 30 days from Mon Nov 9, 2026 (the first 16 days are the default view). */
export const NIGHT_START = new Date(2026, 10, 9)
export const NIGHT_DAYS = 30
const REQUESTED = [3, 4, 5]

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)

function isoWeek(d: Date) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const day = t.getUTCDay() || 7
  t.setUTCDate(t.getUTCDate() + 4 - day)
  const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1))
  return Math.ceil(((+t - +y0) / 86400000 + 1) / 7)
}

function runs(keys: string[]): Group[] {
  const out: Group[] = []
  keys.forEach((k) => {
    const last = out[out.length - 1]
    if (last && last.label === k) last.cols++
    else out.push({ label: k, cols: 1 })
  })
  return out
}

const h12 = (h: number) => `${h % 12 === 0 ? 12 : h % 12} ${h < 12 ? 'AM' : 'PM'}`
export const fmtHour = (d: Date) => h12(d.getHours())
export const fmtTime = (d: Date) => `${d.getHours() % 12 === 0 ? 12 : d.getHours() % 12}:${String(d.getMinutes()).padStart(2, '0')} ${d.getHours() < 12 ? 'AM' : 'PM'}`

export const TIMES = Array.from({ length: 48 }, (_, i) => fmtTime(new Date(2026, 0, 1, Math.floor(i / 2), (i % 2) * 30)))
export function parseTime(s: string) {
  const m = /^(\d+):(\d+) (AM|PM)$/.exec(s)
  if (!m) return 0
  return ((Number(m[1]) % 12) + (m[3] === 'PM' ? 12 : 0)) * 60 + Number(m[2])
}

type Hourly = { date: Date; startMin: number; hours: number }

export function buildModel(mode: Mode, level: Level, hourly: Hourly): Model {
  if (mode === 'Nightly') {
    const days = Array.from({ length: NIGHT_DAYS }, (_, i) => addDays(NIGHT_START, i))
    const monthKey = (d: Date) => `${MON[d.getMonth()]} ${d.getFullYear()}`
    if (level === 'Day') {
      return {
        cols: days.map((d, i) => ({ from: i, span: 1, top: DOW[d.getDay()], bottom: String(d.getDate()), wk: i % 7 >= 5, req: REQUESTED.includes(i) })),
        groups: runs(days.map(monthKey)),
        total: NIGHT_DAYS,
        snap: 1,
        origin: 0,
      }
    }
    if (level === 'Week') {
      const weeks = Array.from({ length: Math.ceil(NIGHT_DAYS / 7) }, (_, k) => k)
      return {
        cols: weeks.map((k) => ({ from: k * 7, span: Math.min(7, NIGHT_DAYS - k * 7), top: `W${isoWeek(days[k * 7])}` })),
        groups: runs(weeks.map((k) => monthKey(days[k * 7]))),
        total: NIGHT_DAYS,
        snap: 1,
        origin: 0,
      }
    }
    if (level === 'Month') {
      const cols: Col[] = []
      days.forEach((d, i) => {
        const key = `${MON[d.getMonth()]}`
        const last = cols[cols.length - 1]
        if (last && last.top === key) last.span++
        else cols.push({ from: i, span: 1, top: key })
      })
      return { cols, groups: [{ label: String(NIGHT_START.getFullYear()), cols: cols.length }], total: NIGHT_DAYS, snap: 1, origin: 0 }
    }
    return { cols: [{ from: 0, span: NIGHT_DAYS, top: 'Q4' }], groups: [{ label: String(NIGHT_START.getFullYear()), cols: 1 }], total: NIGHT_DAYS, snap: 1, origin: 0 }
  }

  const start = new Date(hourly.date.getFullYear(), hourly.date.getMonth(), hourly.date.getDate(), 0, hourly.startMin)
  const at = (minutes: number) => new Date(+start + minutes * 60000)
  const origin = hourly.startMin / 60
  if (level === '30 Min') {
    const n = hourly.hours * 2
    const cols = Array.from({ length: n }, (_, j) => ({ from: j * 0.5, span: 0.5, top: fmtTime(at(j * 30)) }))
    const groups = runs(Array.from({ length: n }, (_, j) => `${MON[at(j * 30).getMonth()]} ${at(j * 30).getDate()}, ${fmtHour(at(j * 30))}`))
    return { cols, groups, total: hourly.hours, snap: 0.5, origin }
  }
  const cols = Array.from({ length: hourly.hours }, (_, j) => ({ from: j, span: 1, top: fmtHour(at(j * 60)) }))
  const groups = runs(Array.from({ length: hourly.hours }, (_, j) => `${DOW[at(j * 60).getDay()]}, ${MON[at(j * 60).getMonth()]} ${at(j * 60).getDate()}`))
  return { cols, groups, total: hourly.hours, snap: 0.5, origin }
}

/** x (px from the first column) of a base-unit position; extrapolates outside the range. */
export function xOf(m: Model, u: number, w: number) {
  const { cols } = m
  let i = cols.length - 1
  if (u <= cols[0].from) i = 0
  else {
    for (let k = 0; k < cols.length; k++) {
      if (u < cols[k].from + cols[k].span) {
        i = k
        break
      }
    }
  }
  const c = cols[i]
  return i * w + ((u - c.from) / c.span) * w
}

/** base-unit position under x (px from the first column). */
export function unitAt(m: Model, x: number, w: number) {
  const i = Math.max(0, Math.min(m.cols.length - 1, Math.floor(x / w)))
  const c = m.cols[i]
  return c.from + ((x - i * w) / w) * c.span
}
