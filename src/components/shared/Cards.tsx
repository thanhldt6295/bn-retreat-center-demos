import type { ReactNode } from 'react'
import { ActionButton } from './ActionButton'
import '../guest/guest.css'
import './cards.css'

const Ninja = () => (
  <svg className="card-ninja" viewBox="0 0 200 200" fill="currentColor" aria-hidden>
    <path d="M118 12c16 0 28 12 28 27 0 8-4 15-9 20l32-23 8 8-40 30 10 26 30-6 3 11-38 10-13-25-20 24 24 36-10 10-35-34-14 46-12-4 14-52-28-12 4-12 33 12 22-27-13-22-36 20-6-10 46-26c-3-4-5-9-5-15 0-15 12-27 28-27z" />
  </svg>
)

function Rings() {
  return (
    <>
      <svg className="card-rings tr" viewBox="0 0 400 400" fill="none" stroke="rgba(255,255,255,.12)">
        {[120, 150, 180, 210, 240, 270].map((r) => (
          <circle key={r} cx="360" cy="40" r={r} />
        ))}
      </svg>
      <svg className="card-rings bl" viewBox="0 0 400 400" fill="none" stroke="rgba(255,255,255,.1)">
        {[120, 150, 180, 210, 240].map((r) => (
          <circle key={r} cx="40" cy="360" r={r} />
        ))}
      </svg>
    </>
  )
}

function Brand() {
  return (
    <div className="card-brand">
      <span className="g-logo light" style={{ fontSize: '1.9cqw' }}>
        BOOKING NINJAS<sup>®</sup>
      </span>
      <i />
      <span className="rc">RETREAT CENTER</span>
    </div>
  )
}

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="card-wrap">
      <div className="card">
        <Ninja />
        <Rings />
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

export function EndCard({ line, onCta }: { line: string; onCta?: () => void }) {
  return (
    <Card>
      <h1 className="card-title" style={{ fontSize: '3.3cqw' }}>{line}</h1>
      <ActionButton className="card-cta" instant onDone={onCta}>
        Schedule a call
      </ActionButton>
    </Card>
  )
}
