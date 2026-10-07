import type { ReactNode } from 'react'
import { Icon } from '../admin/Icon'
import './pos.css'

/* Tablet POS style (Figma 264:270, 251:270): Inter, navy bottom navigation, 1366 × 1024 canvas. */
export const POS_NAV: [string, string][] = [
  ['Availability Grid', 'event'],
  ['Reservations', 'identity'],
  ['Completed', 'task'],
  ['Invoices', 'currency'],
  ['Check-in', 'scan'],
  ['Settings', 'settings'],
]

export function PosShell({ active, onNav, children }: { active: string; onNav?: (n: string) => void; children: ReactNode }) {
  return (
    <div className="pos">
      <div className="pos-main">{children}</div>
      <nav className="pos-nav">
        {POS_NAV.map(([n, ic]) => (
          <button key={n} className={n === active ? 'on' : ''} onClick={() => onNav?.(n)}>
            <Icon name={ic} size="small" />
            {n}
          </button>
        ))}
      </nav>
    </div>
  )
}

/** Grey top bar of POS sheets: optional back arrow, centred title, close. */
export function PosBar({ title, back, onBack, onClose }: { title: string; back?: boolean; onBack?: () => void; onClose?: () => void }) {
  return (
    <div className="pos-bar">
      <button className="l" onClick={onBack} aria-label="Back" style={{ visibility: back ? 'visible' : 'hidden' }}>
        <Icon name="back" size="small" />
      </button>
      <b>{title}</b>
      <button className="r" onClick={onClose} aria-label="Close">
        <Icon name="close" size="small" />
      </button>
    </div>
  )
}

export function PosPill({ tone, children }: { tone: 'green' | 'blue'; children: ReactNode }) {
  return <span className={`pos-pill ${tone}`}>{children}</span>
}

/** Page header used by the Check-in flow. */
export function PosHead({ title, sub, search = 'Search reservation' }: { title: string; sub?: string; search?: string }) {
  return (
    <div className="pos-head">
      <div>
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
      <div className="pos-search">
        <span>{search}</span>
        <Icon name="search" size="small" />
      </div>
    </div>
  )
}

/** Pseudo QR code used by the scan screens (grey-blue like the Figma scanner). */
export function PosQr({ color }: { color: string }) {
  const cells = 21
  const rects: ReactNode[] = []
  const fin = (x: number, y: number) => {
    for (let i = 0; i < 7; i++)
      for (let j = 0; j < 7; j++) {
        const edge = i === 0 || j === 0 || i === 6 || j === 6
        const core = i >= 2 && i <= 4 && j >= 2 && j <= 4
        if (edge || core) rects.push(<rect key={`f${x}${y}${i}${j}`} x={x + i} y={y + j} width={1} height={1} />)
      }
  }
  fin(0, 0)
  fin(cells - 7, 0)
  fin(0, cells - 7)
  let s = 11
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
  for (let y = 0; y < cells; y++)
    for (let x = 0; x < cells; x++) {
      const inF = (x < 8 && y < 8) || (x >= cells - 8 && y < 8) || (x < 8 && y >= cells - 8)
      if (!inF && rnd() > 0.5) rects.push(<rect key={`d${x}-${y}`} x={x} y={y} width={1} height={1} />)
    }
  return (
    <svg viewBox={`0 0 ${cells} ${cells}`} width={222} height={222} fill={color} shapeRendering="crispEdges">
      {rects}
    </svg>
  )
}
