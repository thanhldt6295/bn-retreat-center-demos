import { useEffect, useRef, useState, type ReactNode } from 'react'
import './datepicker.css'

const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
const same = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

type Props = {
  /** current value, e.g. "Nov 12, 2026" */
  value: string
  onChange: (v: string) => void
  /** "venue" (green, guest) or "lds" (blue, Salesforce) */
  theme?: 'venue' | 'lds'
  /** dates outside [min, max] (formatted like value) are disabled */
  min?: string
  max?: string
  /** the clickable field; receives open state for styling */
  children: (open: boolean) => ReactNode
  /** open on first render (e.g. when a scripted step wants to show it) */
  defaultOpen?: boolean
}

/** Calendar popover that opens when the date field is clicked. */
export function DatePicker({ value, onChange, theme = 'venue', min, max, children, defaultOpen }: Props) {
  const parsed = new Date(value)
  const base = Number.isNaN(parsed.getTime()) ? new Date(2026, 10, 12) : parsed
  const [open, setOpen] = useState(!!defaultOpen)
  const [month, setMonth] = useState(new Date(base.getFullYear(), base.getMonth(), 1))
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const lead = first.getDay()
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const cells: (Date | null)[] = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1))]
  const lo = min ? new Date(min) : null
  const hi = max ? new Date(max) : null
  const today = new Date(2026, 9, 5)

  return (
    <div className={`dp dp-${theme}`} ref={ref}>
      <div onClick={() => setOpen((o) => !o)} style={{ cursor: 'pointer' }}>
        {children(open)}
      </div>
      {open && (
        <div className="dp-pop" role="dialog" aria-label="Choose a date">
          <div className="dp-head">
            <button type="button" aria-label="Previous month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>
              ‹
            </button>
            <b>{month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</b>
            <button type="button" aria-label="Next month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>
              ›
            </button>
          </div>
          <div className="dp-grid">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <span key={d} className="dow">
                {d}
              </span>
            ))}
            {cells.map((d, i) =>
              d ? (
                <button
                  type="button"
                  key={i}
                  disabled={(lo && d < lo) || (hi && d > hi) || false}
                  className={`${same(d, base) ? 'sel' : ''} ${same(d, today) ? 'today' : ''}`}
                  onClick={() => {
                    onChange(fmt(d))
                    setOpen(false)
                  }}
                >
                  {d.getDate()}
                </button>
              ) : (
                <span key={i} />
              ),
            )}
          </div>
          <div className="dp-foot">
            <button type="button" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
