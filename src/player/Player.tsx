import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Icon } from '../components/admin/Icon'
import '../components/admin/slds.css'
import './player.css'

export type Step = { id: string; label: string; view: string }

export type SceneProps = {
  /** id of the current step, e.g. "1.3" */
  step: string
  /** id of the step we came from (null on first render) */
  from: string | null
  next: () => void
  prev: () => void
  goto: (id: string) => void
}

type Toast = { id: number; text: string; kind: 'admin' | 'guest' }

type PlayerCtx = {
  setPrimary: (fn: (() => void) | null) => void
  toast: (text: string, kind?: Toast['kind'], ms?: number) => void
}

const Ctx = createContext<PlayerCtx>({ setPrimary: () => {}, toast: () => {} })
export const usePlayer = () => useContext(Ctx)

/** Register the scene's primary button: the → key will "click" it instead of just skipping ahead. */
export function usePrimary(fn: (() => void) | null) {
  const { setPrimary } = usePlayer()
  const ref = useRef(fn)
  ref.current = fn
  const has = fn !== null
  useEffect(() => {
    if (!has) return
    setPrimary(() => ref.current?.())
    return () => setPrimary(null)
  }, [has, setPrimary])
}

type Props = {
  title: string
  steps: Step[]
  views: Record<string, ComponentType<SceneProps>>
  /** wrapper providing route-wide shared state (optional) */
  Provider?: ComponentType<{ children: ReactNode }>
}

const HIDE_KEY = 'bn-helper-hidden'
const Passthrough = ({ children }: { children: ReactNode }) => <>{children}</>

export function Player({ title, steps, views, Provider }: Props) {
  const [params, setParams] = useSearchParams()
  const idFromUrl = params.get('step')
  const index = Math.max(0, steps.findIndex((s) => s.id === idFromUrl))
  const step = steps[index]
  const [from, setFrom] = useState<string | null>(null)
  const [resetKey, setResetKey] = useState(0)
  const [hidden, setHidden] = useState(() => {
    try {
      return params.get('rec') === '1' || localStorage.getItem(HIDE_KEY) === '1'
    } catch {
      return params.get('rec') === '1'
    }
  })
  const [toasts, setToasts] = useState<Toast[]>([])
  const primary = useRef<(() => void) | null>(null)
  const toastId = useRef(0)

  const goto = useCallback(
    (id: string) => {
      const target = steps.find((s) => s.id === id)
      if (!target) return
      setFrom(step.id)
      setToasts([])
      setParams(
        (p) => {
          const n = new URLSearchParams(p)
          n.set('step', id)
          return n
        },
        { replace: true },
      )
    },
    [steps, step.id, setParams],
  )

  const go = useCallback(
    (delta: number) => {
      const t = steps[Math.min(steps.length - 1, Math.max(0, index + delta))]
      if (t.id !== step.id) goto(t.id)
    },
    [steps, index, step.id, goto],
  )

  const toast = useCallback((text: string, kind: Toast['kind'] = 'admin', ms = 3600) => {
    const id = ++toastId.current
    setToasts((t) => [...t, { id, text, kind }])
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), ms)
  }, [])

  const setPrimary = useCallback((fn: (() => void) | null) => {
    primary.current = fn
  }, [])

  const toggleHidden = useCallback(() => {
    setHidden((h) => {
      try {
        localStorage.setItem(HIDE_KEY, h ? '0' : '1')
      } catch {
        /* ignore */
      }
      return !h
    })
  }, [])

  const reset = useCallback(() => {
    // jump back to the first step of the current scene run, then remount it
    let i = index
    while (i > 0 && steps[i - 1].view === step.view) i--
    setToasts([])
    setFrom(null)
    setResetKey((k) => k + 1)
    if (steps[i].id !== step.id) goto(steps[i].id)
  }, [index, steps, step, goto])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable)) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        if (primary.current) primary.current()
        else go(1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        go(-1)
      } else if (e.key === 'r' || e.key === 'R') {
        reset()
      } else if (e.key === 'h' || e.key === 'H') {
        toggleHidden()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, reset, toggleHidden])

  const View = views[step.view]
  const ctx = useMemo(() => ({ setPrimary, toast }), [setPrimary, toast])
  const Wrap = Provider ?? Passthrough

  return (
    <Ctx.Provider value={ctx}>
      <Wrap>
        <div className="player-stage" data-step={step.id}>
          {View ? (
            <View
              key={`${step.view}-${resetKey}`}
              step={step.id}
              from={from}
              next={() => go(1)}
              prev={() => go(-1)}
              goto={goto}
            />
          ) : (
            <div style={{ padding: 40 }}>Missing view “{step.view}”</div>
          )}
        </div>
        <div className="toast-layer" aria-live="polite">
          {toasts.map((t) => (
            t.kind === 'admin' ? (
              <div key={t.id} className="toast toast-admin slds-notify slds-notify_toast slds-theme_success" role="status">
                <span className="slds-icon_container slds-icon-utility-success slds-m-right_small slds-no-flex">
                  <Icon name="success" size="small" color="#0b7a55" />
                </span>
                <div className="slds-notify__content">
                  <h2 className="slds-text-heading_small">{t.text}</h2>
                </div>
                <Icon name="close" size="x-small" color="#0b4a35" className="slds-m-left_medium" />
              </div>
            ) : (
              <div key={t.id} className={`toast toast-${t.kind}`}>
                <span className="toast-check">✓</span>
                <span>{t.text}</span>
              </div>
            )
          ))}
        </div>
        {!hidden && (
          <Helper title={title} steps={steps} index={index} onGoto={goto} onReset={reset} onHide={toggleHidden} />
        )}
      </Wrap>
    </Ctx.Provider>
  )
}

function Helper({
  title,
  steps,
  index,
  onGoto,
  onReset,
  onHide,
}: {
  title: string
  steps: Step[]
  index: number
  onGoto: (id: string) => void
  onReset: () => void
  onHide: () => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="helper" data-helper>
      <div className="helper-row">
        <Link to="/" className="helper-home" title="Index">
          ⌂
        </Link>
        <strong>{title}</strong>
        <span className="helper-count">
          {index + 1}/{steps.length}
        </span>
      </div>
      <div className="helper-step">
        <b>{steps[index].id}</b> {steps[index].label}
      </div>
      <div className="helper-keys">
        <kbd>←</kbd>
        <kbd>→</kbd> step · <kbd>R</kbd> reset scene · <kbd>H</kbd> hide
      </div>
      <div className="helper-btns">
        <button onClick={() => setOpen((o) => !o)}>{open ? 'Hide steps' : 'Steps'}</button>
        <button onClick={onReset}>Reset</button>
        <button onClick={onHide}>Hide (H)</button>
      </div>
      {open && (
        <ol className="helper-list">
          {steps.map((s, i) => (
            <li key={s.id}>
              <button className={i === index ? 'on' : ''} onClick={() => onGoto(s.id)}>
                <b>{s.id}</b> {s.label}
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
