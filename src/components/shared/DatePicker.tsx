import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Icon } from '../admin/Icon'
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
  /** scripted demo: force the popover open/closed (leave undefined for normal clicking) */
  forceOpen?: boolean
  /** scripted demo: day of the shown month that looks hovered */
  hoverDay?: number
}

/** Calendar popover that opens when the date field is clicked. */
export function DatePicker({ value, onChange, theme = 'venue', min, max, children, defaultOpen, forceOpen, hoverDay }: Props) {
  const parsed = new Date(value)
  const hasValue = !Number.isNaN(parsed.getTime())
  const base = hasValue ? parsed : new Date(2026, 10, 12)
  const [openState, setOpen] = useState(!!defaultOpen)
  const open = forceOpen ?? openState
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
      <div onClick={() => forceOpen === undefined && setOpen((o) => !o)} style={{ cursor: 'pointer' }}>
        {children(open)}
      </div>
      {open && theme === 'lds' && (
        <div className="slds-datepicker slds-dropdown slds-dropdown_left" style={{ display: 'block', top: 'calc(100% + 4px)', left: 0, zIndex: 300 }} role="dialog" aria-label="Choose a date">
          <div className="slds-datepicker__filter slds-grid">
            <div className="slds-datepicker__filter_month slds-grid slds-grid_align-spread slds-grow">
              <div className="slds-align-middle">
                <button type="button" className="slds-button slds-button_icon slds-button_icon-container" title="Previous Month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>
                  <Icon name="left" />
                </button>
              </div>
              <h2 className="slds-align-middle" aria-live="assertive" aria-atomic="true">
                {month.toLocaleDateString('en-US', { month: 'long' })}
              </h2>
              <div className="slds-align-middle">
                <button type="button" className="slds-button slds-button_icon slds-button_icon-container" title="Next Month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>
                  <Icon name="right" />
                </button>
              </div>
            </div>
            <div className="slds-shrink-none">
              <span className="slds-align-middle" style={{ padding: '0 0.5rem' }}>
                {month.getFullYear()}
              </span>
            </div>
          </div>
          <table className="slds-datepicker__month" role="grid">
            <thead>
              <tr>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                  <th key={d} scope="col">
                    <abbr title={d}>{d}</abbr>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.ceil(cells.length / 7) }).map((_, w) => (
                <tr key={w}>
                  {cells.slice(w * 7, w * 7 + 7).map((d, i) => {
                    const off = d ? ((lo && d < lo) || (hi && d > hi) || false) : false
                    return (
                      <td
                        key={i}
                        className={`${d && same(d, today) ? 'slds-is-today' : ''} ${d && same(d, base) ? 'slds-is-selected' : ''} ${off ? 'slds-disabled-text' : ''}`}
                        aria-selected={d ? same(d, base) : undefined}
                        role="gridcell"
                      >
                        {d && (
                          <span
                            className="slds-day"
                            style={off ? { cursor: 'not-allowed' } : { cursor: 'pointer' }}
                            onClick={() => {
                              if (off) return
                              onChange(fmt(d))
                              setOpen(false)
                            }}
                          >
                            {d.getDate()}
                          </span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className="slds-button slds-align_absolute-center slds-text-link" onClick={() => { onChange(fmt(today)); setOpen(false) }}>
            Today
          </button>
        </div>
      )}      {open && theme !== 'lds' && (
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
                  className={`${hasValue && same(d, base) ? 'sel' : ''} ${same(d, today) ? 'today' : ''} ${hoverDay === d.getDate() ? 'hov' : ''}`}
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
