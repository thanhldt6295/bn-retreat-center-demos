import { useEffect, useRef, useState } from 'react'

type Opts = {
  /** start typing (default true) */
  run?: boolean
  /** ms between characters */
  speed?: number
  /** ms before the first character */
  startDelay?: number
  /** ms pause between fields */
  gap?: number
}

/**
 * Types several strings one after another, character by character.
 * Returns the current text of each field and whether all fields are done.
 */
export function useTypedFields(texts: string[], opts: Opts = {}) {
  const { run = true, speed = 26, startDelay = 450, gap = 160 } = opts
  const [values, setValues] = useState<string[]>(() => texts.map(() => ''))
  const [done, setDone] = useState(false)
  const key = texts.join('\u0001')

  useEffect(() => {
    if (!run) return
    let cancelled = false
    let timer: number
    let field = 0
    let ch = 0
    const all = key.split('\u0001')
    setValues(all.map(() => ''))
    setDone(false)

    const tick = () => {
      if (cancelled) return
      if (field >= all.length) {
        setDone(true)
        return
      }
      const target = all[field]
      if (ch < target.length) {
        ch++
        const f = field
        const c = ch
        setValues((v) => v.map((x, i) => (i === f ? target.slice(0, c) : x)))
        timer = window.setTimeout(tick, speed)
      } else {
        field++
        ch = 0
        timer = window.setTimeout(tick, gap)
      }
    }
    timer = window.setTimeout(tick, startDelay)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [key, run, speed, startDelay, gap])

  return { values, done }
}

export function useTyped(text: string, opts: Opts = {}) {
  const { values, done } = useTypedFields([text], opts)
  return { value: values[0], done }
}

/** Animates a number from its previous value to the target (live numbers). */
export function useCountTo(target: number, ms = 700) {
  const [val, setVal] = useState(target)
  const from = useRef(target)
  useEffect(() => {
    const start = performance.now()
    const a = from.current
    let raf = 0
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / ms)
      const eased = 1 - Math.pow(1 - p, 3)
      const v = a + (target - a) * eased
      setVal(v)
      if (p < 1) raf = requestAnimationFrame(step)
      else from.current = target
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, ms])
  return val
}
