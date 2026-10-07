import { useEffect, useState } from 'react'

/** Dark venue toast under the portal header; slides in, auto-dismisses. Styles: video/v2/assign.css (.g-toast). */
export function GToast({ title, sub, ms = 3600 }: { title: string; sub?: string; ms?: number }) {
  const [out, setOut] = useState(false)
  const [gone, setGone] = useState(false)
  useEffect(() => {
    const a = window.setTimeout(() => setOut(true), ms)
    const b = window.setTimeout(() => setGone(true), ms + 300)
    return () => {
      window.clearTimeout(a)
      window.clearTimeout(b)
    }
  }, [ms])
  if (gone) return null
  return (
    <div className={`g-toast ${out ? 'out' : ''}`} role="status">
      <span className="ck">✓</span>
      <div>
        <b>{title}</b>
        {sub && <span>{sub}</span>}
      </div>
    </div>
  )
}
