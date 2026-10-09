import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icon'

/* Small controls used by the availability filter bar and grid toolbar. */

/** Dropdown: selected option has a check mark, hovered row is light blue, blue focus ring while open. */
export function Dropdown({
  value,
  options,
  onChange,
  ariaLabel,
  icon = 'chevrondown',
  width,
  listMax,
}: {
  value: string
  options: string[]
  onChange: (v: string) => void
  ariaLabel: string
  icon?: string
  width?: number
  listMax?: number
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const down = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false)
    const key = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', down)
    document.addEventListener('keydown', key)
    return () => {
      document.removeEventListener('mousedown', down)
      document.removeEventListener('keydown', key)
    }
  }, [open])
  useEffect(() => {
    if (open) ref.current?.querySelector('li.sel')?.scrollIntoView({ block: 'nearest' })
  }, [open])
  return (
    <div className="ag-dd" ref={ref} style={{ width }}>
      <button type="button" className={`ag-dd-in ${open ? 'open' : ''}`} aria-haspopup="listbox" aria-expanded={open} aria-label={ariaLabel} onClick={() => setOpen((o) => !o)}>
        <span>{value}</span>
        <Icon name={icon} color="#0b5cff" />
      </button>
      {open && (
        <ul className="ag-dd-list" role="listbox" aria-label={ariaLabel} style={{ maxHeight: listMax }}>
          {options.map((o) => (
            <li
              key={o}
              role="option"
              aria-selected={o === value}
              className={o === value ? 'sel' : ''}
              onClick={() => {
                setOpen(false)
                if (o !== value) onChange(o)
              }}
            >
              <span className="ck">{o === value && <Icon name="check" color="#0b5cff" />}</span>
              {o}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n))

/** Continuous zoom slider (column width): drag the handle or click the track; live while dragging. */
export function ZoomSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [drag, setDrag] = useState(false)
  const setFrom = (clientX: number) => {
    const r = ref.current?.getBoundingClientRect()
    if (r) onChange(clamp01((clientX - r.left) / r.width))
  }
  const down = (e: React.MouseEvent) => {
    e.preventDefault()
    setFrom(e.clientX)
    setDrag(true)
    const move = (ev: MouseEvent) => setFrom(ev.clientX)
    const up = () => {
      setDrag(false)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
  }
  return (
    <div
      className="ag-slider"
      ref={ref}
      role="slider"
      aria-label="Zoom"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      tabIndex={0}
      onMouseDown={down}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') onChange(clamp01(value + 0.05))
        if (e.key === 'ArrowLeft') onChange(clamp01(value - 0.05))
      }}
    >
      <i className={drag ? 'drag' : ''} style={{ left: `calc(${value * 100}% - 7.5px)` }} />
    </div>
  )
}

const CAP = 14

/** Blue horizontal scroll bar above the column headers (thumb = visible width / total width). */
export function HScrollBar({ viewW, total, scrollX, onScroll }: { viewW: number; total: number; scrollX: number; onScroll: (x: number) => void }) {
  const trackW = Math.max(0, viewW - CAP * 2)
  const maxS = Math.max(1, total - viewW)
  const thumbW = Math.max(36, (trackW * viewW) / total)
  const room = Math.max(1, trackW - thumbW)
  const thumbL = (scrollX / maxS) * room
  const [drag, setDrag] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const startThumb = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const x0 = e.clientX
    const s0 = scrollX
    setDrag(true)
    const move = (ev: MouseEvent) => onScroll(s0 + ((ev.clientX - x0) * maxS) / room)
    const up = () => {
      setDrag(false)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
  }
  const page = (e: React.MouseEvent) => {
    const r = trackRef.current?.getBoundingClientRect()
    if (!r) return
    const x = e.clientX - r.left
    onScroll(x < thumbL ? scrollX - viewW * 0.8 : scrollX + viewW * 0.8)
  }
  return (
    <div className="ag-hbar" style={{ width: viewW }} aria-label="Horizontal scroll">
      <button type="button" className="cap" aria-label="Scroll left" onClick={() => onScroll(scrollX - viewW * 0.25)}>
        <i className="l" />
      </button>
      <div className="track" ref={trackRef} onMouseDown={page}>
        <div className={`thumb ${drag ? 'drag' : ''}`} style={{ left: thumbL, width: thumbW }} onMouseDown={startThumb} />
      </div>
      <button type="button" className="cap" aria-label="Scroll right" onClick={() => onScroll(scrollX + viewW * 0.25)}>
        <i className="r" />
      </button>
    </div>
  )
}
