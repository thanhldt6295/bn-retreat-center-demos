import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { usePrimary } from '../../player/Player'
import './shared.css'

type Props = {
  children: ReactNode
  className?: string
  /** called after the loading spinner finishes */
  onDone?: () => void
  /** spinner duration (600–1200 ms looks natural) */
  loadingMs?: number
  /** the → key clicks this button */
  primary?: boolean
  /** skip the spinner and act instantly */
  instant?: boolean
  /** externally-driven loading (e.g. a scene that auto-plays the click) */
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit'
  title?: string
}

/** Button with hover/pressed styles (CSS), a loading spinner and a success callback. */
export function ActionButton({
  children,
  className = '',
  onDone,
  loadingMs = 900,
  primary,
  instant,
  loading,
  disabled,
  type = 'button',
  title,
}: Props) {
  const [busy, setBusy] = useState(false)
  const timer = useRef<number>(0)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const click = useCallback(() => {
    if (busy || disabled) return
    if (instant) {
      onDoneRef.current?.()
      return
    }
    setBusy(true)
    timer.current = window.setTimeout(() => {
      setBusy(false)
      onDoneRef.current?.()
    }, loadingMs)
  }, [busy, disabled, instant, loadingMs])

  usePrimary(primary && !busy && !disabled ? click : null)

  const isLoading = busy || loading
  return (
    <button
      type={type}
      title={title}
      className={`${className} ab ${isLoading ? 'ab-loading' : ''}`}
      disabled={disabled}
      onClick={click}
    >
      <span className="ab-label">{children}</span>
      {isLoading && <span className="ab-spinner" aria-hidden />}
    </button>
  )
}
