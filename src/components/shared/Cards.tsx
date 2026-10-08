import type { ReactNode } from 'react'
import { asset } from '../../lib/asset'
import { ActionButton } from './ActionButton'
import '../guest/guest.css'
import './cards.css'

const A = (f: string) => asset(`img/card/${f}`)
const ARCS: [string, number, number, number][] = [
  ['8354c.svg', 1352.5, -427.5, 995],
  ['688a2.svg', 1400, -380, 900],
  ['5e60f.svg', 1447.5, -332.5, 805],
  ['cad1a.svg', 1495, -285, 710],
  ['a6416.svg', 1542.5, -237.5, 615],
  ['5644f.svg', 1590, -190, 520],
]
const u = (n: number) => `${(n / 19.2).toFixed(4)}cqw`
const v = (n: number) => `${(n / 10.8).toFixed(4)}cqh`

/* Cover art from Figma 296:13580: official ninja mark, halftone dots, rings and brand arcs. */
function Backdrop() {
  return (
    <>
      <div className="card-cover">
        <img className="card-logo" src={A('fb043.svg')} alt="" />
        <img className="card-dots" src={A('1b0fa.png')} alt="" />
        <img className="card-ring" style={{ left: u(-683), top: v(-641) }} src={A('a30ab.svg')} alt="" />
        <img className="card-ring" style={{ left: u(-252), top: v(575) }} src={A('a30ab.svg')} alt="" />
      </div>
      {ARCS.map(([f, x, y, w]) => (
        <img key={f} className="card-arc" style={{ left: u(x), top: v(y), width: u(w), height: u(w) }} src={A(f)} alt="" />
      ))}
    </>
  )
}

function Brand() {
  return (
    <div className="card-brand">
      <img src={A('55e9b.svg')} alt="Booking Ninjas" />
      <i />
      <span className="rc">RETREAT CENTER</span>
    </div>
  )
}

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="card-wrap">
      <div className="card">
        <Backdrop />
        <div className="card-body">
          <Brand />
          {children}
        </div>
      </div>
    </div>
  )
}

export function TitleCard({ title, sub }: { title: string; sub: string }) {
  return (
    <Card>
      <h1 className="card-title">{title}</h1>
      <p className="card-sub">{sub}</p>
      <p className="card-fine">Demo data. All names, dates and amounts are fictional.</p>
    </Card>
  )
}

export function EndCard({ line, onCta, eyebrow }: { line: string; onCta?: () => void; eyebrow?: string }) {
  return (
    <Card>
      {eyebrow && <p className="card-fine" style={{ letterSpacing: '.12em', fontWeight: 700, opacity: 0.9 }}>{eyebrow}</p>}
      <h1 className="card-title" style={{ fontSize: '3.3cqw' }}>{line}</h1>
      <ActionButton className="card-cta" instant onDone={onCta}>
        Schedule a call
      </ActionButton>
    </Card>
  )
}
