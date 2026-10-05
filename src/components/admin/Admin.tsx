import { useId, type CSSProperties, type ReactNode } from 'react'
import { Icon } from './Icon'
import './slds.css'
import './slds2-theme.css'
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

/** Page frame for every staff screen: the SLDS scope + Figma "SLDS 2" theme. */
export function AdminPage({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`slds-scope lds ${className}`}>{children}</div>
}

/** Salesforce global header (Figma header image) + SLDS context bar (object navigation). */
export function GlobalNav({ active }: { active?: string }) {
  return (
    <header>
      <img className="lds-hdr" src={`${import.meta.env.BASE_URL}img/sf-header.png`} alt="" />
      <div className="slds-context-bar">
        <div className="slds-context-bar__primary">
          <div className="slds-context-bar__item slds-no-hover">
            <div className="slds-context-bar__icon-action">
              <span className="slds-icon-waffle_container">
                <span className="slds-icon-waffle">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <span key={i} className={`slds-r${i + 1}`} />
                  ))}
                </span>
              </span>
            </div>
            <span className="slds-context-bar__label-action slds-context-bar__app-name">
              <span className="slds-truncate" title="Booking Ninjas">
                Booking Ninjas
              </span>
            </span>
          </div>
        </div>
        <nav className="slds-context-bar__secondary" aria-label="Context Bar">
          <ul className="slds-grid">
            {NAV.map((n) => (
              <li key={n} className={`slds-context-bar__item ${n === active ? 'slds-is-active' : ''}`}>
                <a className="slds-context-bar__label-action" title={n}>
                  <span className="slds-truncate">{n}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div style={{ marginLeft: 'auto', paddingRight: 14, alignSelf: 'center', display: 'flex' }}>
          <Icon name="edit" size="x-small" color="#0b5cff" />
        </div>
      </div>
    </header>
  )
}

/** Standard object icon (SLDS standard sprite: macros) as in the Figma record headers. */
export const ObjectIcon = ({ size = 40 }: { size?: number }) => (
  <span
    className="slds-icon_container slds-icon-standard-macros"
    style={{ width: size, height: size, borderRadius: 4, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}
  >
    <Icon name="macros" sprite="standard" size="large" style={{ width: size * 0.62, height: size * 0.62 }} />
  </span>
)

type Tone = 'warn' | 'ok' | 'mint' | 'blue' | ''
export const toneFor = (status: string): Tone => {
  const s = status.toLowerCase()
  if (s.startsWith('pending') || s === 'sent' || s === 'draft' || s === 'partially paid') return 'warn'
  if (s === 'confirmed' || s === 'paid' || s === 'signed' || s === 'final' || s === 'checked in') return 'ok'
  return ''
}

/** SLDS badge (Warning / Success / neutral). */
export function Badge({ children, tone, className = '' }: { children: ReactNode; tone?: Tone; className?: string }) {
  const t = tone ?? (typeof children === 'string' ? toneFor(children) : '')
  const theme = t === 'warn' ? 'slds-theme_warning' : t === 'ok' || t === 'mint' ? 'slds-theme_success' : t === 'blue' ? 'slds-badge_lightest lds-badge-info' : ''
  return <span className={`slds-badge ${theme} ${className}`}>{children}</span>
}

/** SLDS checkbox (read-only display of a checked / unchecked state). */
export function Check({ on, label }: { on?: boolean; label?: ReactNode }) {
  const id = useId()
  return (
    <span className="slds-checkbox">
      <input type="checkbox" id={id} checked={!!on} readOnly />
      <label className="slds-checkbox__label" htmlFor={id}>
        <span className="slds-checkbox_faux" />
        {label && <span className="slds-form-element__label">{label}</span>}
      </label>
    </span>
  )
}

/** SLDS modal with backdrop. */
export function Modal({
  title,
  children,
  footer,
  width,
  stacked,
}: {
  title: string
  children: ReactNode
  footer?: ReactNode
  width?: number
  /** modal stacked over another modal (higher layer, lighter backdrop) */
  stacked?: boolean
}) {
  return (
    <>
      <section role="dialog" tabIndex={-1} aria-modal="true" aria-label={title} className="slds-modal slds-fade-in-open" style={stacked ? { zIndex: 9101 } : undefined}>
        <div className="slds-modal__container" style={{ width: width ?? 760, maxWidth: 'calc(100vw - 48px)', margin: '0 auto' }}>
          <button className="slds-button slds-button_icon slds-modal__close slds-button_icon-inverse" title="Close" style={{ background: '#fff', borderRadius: '50%' }}>
            <Icon name="close" size="small" color="#0b5cff" />
          </button>
          <div className="slds-modal__header slds-text-align_center">
            <h1 className="slds-modal__title">{title}</h1>
          </div>
          <div className="slds-modal__content slds-p-around_medium">
            {children}
          </div>
          {footer && <div className="slds-modal__footer">{footer}</div>}
        </div>
      </section>
      <div className="slds-backdrop slds-backdrop_open" style={stacked ? { background: 'rgba(8,7,7,0.35)', zIndex: 9100 } : undefined} />
    </>
  )
}

/** Wizard steps (numbered path used by the New Group Booking wizard). */
export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="lds-steps">
      {steps.map((s, i) => {
        const cls = i + 1 < current ? 'done' : i + 1 === current ? 'on' : ''
        return (
          <li key={s} className={`st ${cls}`}>
            <span className="dot">{i + 1}</span>
            {s}
            {i < steps.length - 1 && <span className="bar" />}
          </li>
        )
      })}
    </ol>
  )
}

export const Section = ({ children }: { children: ReactNode }) => <div className="lds-section">{children}</div>

/** SLDS form element (label + control). */
export function Field({ label, children, style }: { label: string; children: ReactNode; style?: CSSProperties }) {
  return (
    <div className="slds-form-element" style={style}>
      <label className="slds-form-element__label" style={{ display: 'block' }}>
        {label}
      </label>
      <div className="slds-form-element__control">{children}</div>
    </div>
  )
}

/** SLDS text input showing a fixed value. `icon` adds a right-hand SLDS utility icon (e.g. date_input). */
export function Input({
  value,
  disabled,
  icon,
  style,
}: {
  value: ReactNode
  disabled?: boolean
  icon?: string
  style?: CSSProperties
}) {
  const text = typeof value === 'string' || typeof value === 'number' ? String(value) : ''
  const input = <input className="slds-input" readOnly disabled={disabled} value={text} style={style} aria-label={text} />
  if (!icon) return input
  return (
    <div className="slds-input-has-icon slds-input-has-icon_right">
      <Icon name={icon} size="x-small" className="slds-input__icon slds-input__icon_right" color="#0b5cff" />
      {input}
    </div>
  )
}

/** SLDS select showing a fixed value. */
export function Select({ value, style }: { value: string; style?: CSSProperties }) {
  return (
    <div className="slds-select_container">
      <select className="slds-select" value={value} onChange={() => {}} style={style} aria-label={value}>
        <option>{value}</option>
      </select>
    </div>
  )
}

/** SLDS textarea showing a fixed value. */
export function TextArea({ value, rows = 3 }: { value: string; rows?: number }) {
  return <textarea className="slds-textarea" readOnly rows={rows} value={value} aria-label={value} />
}
