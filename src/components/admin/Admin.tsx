import type { CSSProperties, ReactNode } from 'react'
import { asset } from '../../lib/asset'
import './admin.css'

export const NAV = [
  'Reservations',
  'Contacts',
  'Properties',
  'Rate Controller',
  'Availability',
  'BN Invoices',
  'Request Manager',
  'Control Panel',
]


/** Salesforce global header (the Figma header image) + object nav bar. */
export function GlobalNav({ active }: { active?: string }) {
  return (
    <header className="lds-top">
      <img className="lds-hdr" src={asset('img/sf-header.png')} alt="" />
      <nav className="lds-nav">
        <span className="lds-waffle">
          <img src={asset('img/sf-waffle.svg')} width={20} height={20} alt="" />
        </span>
        <span className="lds-appname">Booking Ninjas</span>
        {NAV.map((n) => (
          <a key={n} className={n === active ? 'on' : ''}>
            {n}
          </a>
        ))}
        <img className="lds-pencil" src={asset('img/sf-pencil.svg')} width={14} height={14} alt="" />
      </nav>
    </header>
  )
}

/** Standard object icon from the Figma file (Standard Icons / M / macros). */
export const ObjectIcon = ({ size = 40 }: { size?: number }) => (
  <img src={asset('img/sf-object-macros.svg')} width={size} height={size} alt="" style={{ flex: 'none', display: 'block' }} />
)

type Tone = 'warn' | 'ok' | 'mint' | 'blue' | ''
export const toneFor = (status: string): Tone => {
  const s = status.toLowerCase()
  if (s.startsWith('pending') || s === 'sent' || s === 'draft' || s === 'partially paid') return 'warn'
  if (s === 'confirmed' || s === 'paid' || s === 'signed' || s === 'final' || s === 'checked in') return 'ok'
  return ''
}

export function Badge({ children, tone, className = '' }: { children: ReactNode; tone?: Tone; className?: string }) {
  const t = tone ?? (typeof children === 'string' ? toneFor(children) : '')
  return <span className={`lds-badge ${t} ${className}`}>{children}</span>
}

export function Check({ on }: { on?: boolean }) {
  return <span className={`lds-check ${on ? 'on' : ''}`}>{on ? '✓' : ''}</span>
}

export function Modal({
  title,
  children,
  footer,
  width,
}: {
  title: string
  children: ReactNode
  footer?: ReactNode
  width?: number
}) {
  return (
    <div className="lds-overlay">
      <div className="lds-modal" style={width ? { width } : undefined}>
        <span className="lds-modal-close">✕</span>
        <div className="lds-modal-h">{title}</div>
        <div className="lds-modal-b">{children}</div>
        {footer && <div className="lds-modal-f">{footer}</div>}
      </div>
    </div>
  )
}

export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="lds-steps">
      {steps.map((s, i) => {
        const cls = i + 1 < current ? 'done' : i + 1 === current ? 'on' : ''
        return (
          <span key={s} style={{ display: 'contents' }}>
            <span className={`st ${cls}`}>
              <span className="dot">{i + 1}</span>
              {s}
            </span>
            {i < steps.length - 1 && <span className="bar" />}
          </span>
        )
      })}
    </div>
  )
}

export const Section = ({ children }: { children: ReactNode }) => <div className="lds-section">{children}</div>

export function Field({ label, children, style }: { label: string; children: ReactNode; style?: CSSProperties }) {
  return (
    <div className="lds-field" style={style}>
      <label>{label}</label>
      {children}
    </div>
  )
}
