import type { CSSProperties, ReactNode } from 'react'
import { organizer } from '../../data/demo'
import { asset } from '../../lib/asset'
import './guest.css'

export function Logo({ light }: { light?: boolean }) {
  if (!light) return <img src={asset('img/logo.svg')} width={213} height={48} alt="Booking Ninjas" style={{ display: 'block' }} />
  return (
    <span className={`g-logo ${light ? 'light' : ''}`}>
      <svg width="30" height="26" viewBox="0 0 30 26" fill="none" stroke={light ? '#fff' : '#000'} strokeWidth="3" strokeLinecap="round">
        <path d="M3 9l12-4-6 7 12-3M7 22l9-9 8 3" />
      </svg>
      BOOKING NINJAS<sup>®</sup>
    </span>
  )
}

export const PORTAL_TABS = ['Overview', 'Rooms', 'Guests', 'Documents', 'Invoices', 'Schedule & meals', 'Invite guests']

/** Public venue page: logo header + footer. */
export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="g">
      <div className="g-pub-head">
        <Logo />
      </div>
      <div className="g-main">{children}</div>
      <div className="g-pub-footer">
        <div className="div" />
        <div className="legal">
          <span>© 2026 Booking Ninjas. All rights reserved.</span>
          <span style={{ display: 'flex', gap: 24 }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </span>
        </div>
      </div>
    </div>
  )
}

/** Organizer portal: logo, tab bar with secure-link pill, footer. */
export function PortalShell({
  active,
  children,
  user = organizer.name,
  initials = organizer.initials,
}: {
  active: string
  children: ReactNode
  user?: string
  initials?: string
}) {
  return (
    <div className="g">
      <div className="g-portal-head">
        <div className="g-portal-top">
          <Logo />
        </div>
        <div className="g-portal-bar">
          <nav>
            {PORTAL_TABS.map((t) => (
              <a key={t} className={t === active ? 'on' : ''}>
                {t}
              </a>
            ))}
          </nav>
          <div className="g-portal-user">
            <span className="g-pill">Secure link</span>
            {user}
            <span className="g-avatar">{initials}</span>
          </div>
        </div>
      </div>
      <div className="g-main">{children}</div>
      <div className="g-footer">© 2026 Cedar Valley Retreat &amp; Conference Center. Powered by Booking Ninjas.</div>
    </div>
  )
}

export function Track({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="g-track">
      {steps.map((s, i) => {
        const cls = i + 1 < current ? 'done' : i + 1 === current ? 'on' : ''
        return (
          <span key={s} style={{ display: 'contents' }}>
            <span className={`st ${cls}`}>
              <span className="dot">{i + 1 < current ? '✓' : i + 1}</span>
              {s}
            </span>
            {i < steps.length - 1 && <span className="bar" />}
          </span>
        )
      })}
    </div>
  )
}

export function GCheck({ on }: { on?: boolean }) {
  return <span className={`g-check ${on ? 'on' : ''}`}>{on ? '✓' : ''}</span>
}

export function GInput({
  label,
  value,
  focus,
  area,
  style,
  caret,
}: {
  label?: string
  value: ReactNode
  focus?: boolean
  area?: boolean
  style?: CSSProperties
  caret?: boolean
}) {
  return (
    <div style={style}>
      {label && <label className="g-label">{label}</label>}
      <div className={`g-input ${focus ? 'focus' : ''} ${area ? 'area' : ''}`}>
        <span className={caret ? 'caret' : ''}>{value}</span>
      </div>
    </div>
  )
}
