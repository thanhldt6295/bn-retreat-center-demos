import type { ReactNode } from 'react'
import './portal.css'
import '../v1/g4.css'

/* Shared pieces of the V3 portal pages (Figma 272:270 organizer, 273:270 guest). */

export type Tone = 'mint' | 'cream' | 'amber'
export const Pill = ({ t, tone = 'mint', className = '' }: { t: string; tone?: Tone; className?: string }) => (
  <span className={`g-pill ${tone === 'mint' ? '' : tone} ${className}`}>{t}</span>
)

/** Page frame: 1100 px column (or 1200 px when `wide`). */
export function Page({ children, wide, className = '' }: { children: ReactNode; wide?: boolean; className?: string }) {
  return <div className={`pt-page ${wide ? 'wide' : ''} ${className}`}>{children}</div>
}

export function Head({ title, sub, right, rightBottom }: { title: string; sub?: ReactNode; right?: ReactNode; rightBottom?: boolean }) {
  return (
    <div className="pt-head" style={{ alignItems: rightBottom ? 'flex-end' : 'center' }}>
      <div>
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
      {right}
    </div>
  )
}

export function Card({ title, right, children, className = '', style, flush }: { title?: string; right?: ReactNode; children?: ReactNode; className?: string; style?: React.CSSProperties; flush?: boolean }) {
  return (
    <div className={`g-card pt-card ${className}`} style={style}>
      {title && (
        <div className="pt-card-h">
          <span>{title}</span>
          {right}
        </div>
      )}
      <div className={flush ? '' : 'pt-card-b'}>{children}</div>
    </div>
  )
}

export function Stat({ label, value, sub, action }: { label: string; value: ReactNode; sub?: ReactNode; action?: ReactNode }) {
  return (
    <div className="pt-stat">
      <b>{label}</b>
      <strong>{value}</strong>
      {sub && <span>{sub}</span>}
      {action}
    </div>
  )
}

export type Col = { h: string; w?: number; align?: 'right' }
export function Table({ cols, rows, rowH = 44, className = '' }: { cols: Col[]; rows: ReactNode[][]; rowH?: number; className?: string }) {
  return (
    <div className={`pt-table ${className}`}>
      <div className="r head">
        {cols.map((c, i) => (
          <div key={i} style={{ width: c.w, flex: c.w ? 'none' : 1, textAlign: c.align }}>
            {c.h}
          </div>
        ))}
      </div>
      {rows.map((r, ri) => (
        <div key={ri} className="r" style={{ minHeight: rowH }}>
          {r.map((cell, i) => (
            <div key={i} style={{ width: cols[i].w, flex: cols[i].w ? 'none' : 1, textAlign: cols[i].align }}>
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export const Link = ({ children, onClick }: { children: ReactNode; onClick?: () => void }) => (
  <span className="as-link" onClick={onClick}>
    {children}
  </span>
)

export const KV = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="g4-field">
    <span>{label}</span>
    <b>{children}</b>
  </div>
)

export const SumLine = ({ k, v, bold }: { k: string; v: string; bold?: boolean }) => (
  <div className={`pt-sl ${bold ? 'bold' : ''}`}>
    <span>{k}</span>
    <span>{v}</span>
  </div>
)

/** A pseudo QR code (placeholder, deterministic). */
export function Qr({ size = 84, cells = 21 }: { size?: number; cells?: number }) {
  const rects: ReactNode[] = []
  const finder = (x: number, y: number) =>
    [0, 1, 2, 3, 4, 5, 6].flatMap((i) =>
      [0, 1, 2, 3, 4, 5, 6].map((j) => {
        const edge = i === 0 || j === 0 || i === 6 || j === 6
        const core = i >= 2 && i <= 4 && j >= 2 && j <= 4
        return edge || core ? <rect key={`f${x}${y}${i}${j}`} x={x + i} y={y + j} width={1} height={1} /> : null
      }),
    )
  rects.push(...finder(0, 0), ...finder(cells - 7, 0), ...finder(0, cells - 7))
  let s = 7
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
  for (let y = 0; y < cells; y++)
    for (let x = 0; x < cells; x++) {
      const inFinder = (x < 8 && y < 8) || (x >= cells - 8 && y < 8) || (x < 8 && y >= cells - 8)
      if (!inFinder && rnd() > 0.52) rects.push(<rect key={`d${x}-${y}`} x={x} y={y} width={1} height={1} />)
    }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${cells} ${cells}`} fill="#0b1f17" shapeRendering="crispEdges" aria-label="QR code">
      {rects}
    </svg>
  )
}
