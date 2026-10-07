import { useEffect, useRef, useState } from 'react'
import { MailShell } from '../../components/mail/Mail'
import { ActionButton } from '../../components/shared/ActionButton'
import { PlainShell } from '../../components/guest/Guest'
import { PosHead, PosPill, PosQr, PosShell } from '../../components/pos/Pos'
import { Icon } from '../../components/admin/Icon'
import { group, pos, venue } from '../../data/demo'
import { usePrimary, type SceneProps } from '../../player/Player'
import { Qr } from '../v3/ui'
import '../v1/email-viewer.css'
import '../v1/g4.css'
import '../v1/guest-pay.css'
import '../v2/guest-flow.css'
import './v4.css'

/* ---------------- Q1 check-in e-mail (Figma 263:272) ---------------- */
export function Q1({ goto }: SceneProps) {
  return (
    <MailShell
      meta={{
        box: { name: 'Priya Nair', role: 'Guest', email: 'priya@horizon.example' },
        subject: 'Your check-in pass',
        from: { name: venue.name, email: venue.email },
        date: 'Sep 24, 2026',
        snippet: 'Show this QR code at the front desk when you arrive on Thu, Nov 12.',
      }}
    >
    <div className="em">
      <div className="em-subject">
        <b>Your check-in pass</b>
        <span>· {venue.name} · Sep 24, 2026</span>
      </div>
      <div className="em-card gf-email">
        <div className="em-head">
          <div>
            <p className="k">CHECK-IN PASS</p>
            <p className="t">{group.name}</p>
          </div>
        </div>
        <div className="gf-ebody" style={{ alignItems: 'center', textAlign: 'center' }}>
          <h2>Hi Priya, your room is booked.</h2>
          <p className="lead">Show this QR code at the front desk when you arrive on Thu, Nov 12. Staff scan it to check you in.</p>
          <div className="q-card">
            <Qr size={220} />
            <b>CV-0412</b>
          </div>
          <div className="gf-2" style={{ width: '100%', textAlign: 'left' }}>
            <div className="g4-field">
              <span>Guest</span>
              <b>Priya Nair</b>
            </div>
            <div className="g4-field">
              <span>Room</span>
              <b>Standard Double Room (number assigned at check-in)</b>
            </div>
            <div className="g4-field">
              <span>Reservation</span>
              <b>#00032</b>
            </div>
            <div className="g4-field">
              <span>Stay</span>
              <b>Nov 12 – Nov 15, 2026 · from 3:00 PM</b>
            </div>
          </div>
          <div className="gf-act" style={{ justifyContent: 'center' }}>
            <button className="g-btn yellow">Add to wallet</button>
            <ActionButton className="g-btn" primary loadingMs={700} onDone={() => goto('Q2')}>
              View my pass
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
    </MailShell>
  )
}

/* ---------------- Q2 my check-in pass (Figma 263:307) ---------------- */
export function Q2({ next }: SceneProps) {
  usePrimary(() => next())
  const how: [string, string][] = [
    ['Show your pass', 'Open this page or the e-mail and show the QR code at the front desk.'],
    ['Staff scan it', 'The team scans the code with the POS tablet and confirms your room.'],
    ['You are checked in', 'Your reservation is updated and your room is ready.'],
  ]
  return (
    <PlainShell>
      <div className="g-wrap gf-narrow">
        <div>
          <h1 className="g-h1">Check in at the front desk</h1>
          <p className="g-lead">Show this pass when you arrive. You can also keep it on your phone.</p>
        </div>
        <div className="gp-cols">
          <div className="g-card" style={{ width: 520, flex: 'none' }}>
            <div className="g-card-h">Your check-in pass</div>
            <div className="gf-body" style={{ alignItems: 'center', gap: 14 }}>
              <div className="q-card big">
                <Qr size={260} />
                <b>CV-0412</b>
              </div>
              <div style={{ textAlign: 'center' }}>
                <b style={{ fontSize: 18 }}>Priya Nair</b>
                <div style={{ fontSize: 12, color: '#69716c', marginTop: 2 }}>Standard Double Room · Nov 12 – 15, 2026</div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="g-btn small yellow">Add to wallet</button>
                <button className="g-btn small">Download</button>
              </div>
            </div>
          </div>
          <div className="g-card" style={{ width: 556, flex: 'none' }}>
            <div className="g-card-h">How it works</div>
            <div className="q2-steps">
              {how.map(([a, b], i) => (
                <div className="q2-step" key={a}>
                  <span>{i + 1}</span>
                  <div>
                    <b>{a}</b>
                    <p>{b}</p>
                  </div>
                </div>
              ))}
              <div className="gf-save" style={{ marginTop: 0 }}>
                <b>Reservation #00032 · Group Horizon Foundation</b>
                <span style={{ fontSize: 12 }}>Check-in opens Thu, Nov 12 at 3:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PlainShell>
  )
}

/* ---------------- how-it-works panel ---------------- */
export function How({ step }: { step: 1 | 2 | 3 }) {
  const rows: [string, string][] = [
    ['Scan guest QR', 'Scan the QR pass from the guest’s e-mail or phone'],
    ['Confirm stay and room', 'Check the guest, the reservation and the room'],
    ['Checked in', 'The reservation is updated for the whole team'],
  ]
  return (
    <div className="pos-how">
      <h2>How it works</h2>
      {rows.map(([a, b], i) => (
        <div key={a} className={`pos-step ${i + 1 === step ? 'on' : ''}`}>
          <span className="n">{i + 1}</span>
          <div>
            <b>{a}</b>
            <span>{b}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
const Frame = ({ tone }: { tone?: 'ok' | 'err' }) => (
  <div className={`pos-frame ${tone ?? ''}`}>
    <i />
    <i />
    <i />
    <i />
    {!tone && <span className="beam" />}
    <PosQr color={tone === 'ok' ? '#16a34a' : '#a3acd0'} />
  </div>
)

/* ---------------- K1 / K1c scan (Figma 264:272, 461:719, 270:334) ---------------- */
export function K1({ step, goto }: SceneProps) {
  const [state, setState] = useState<'ready' | 'scanning' | 'found'>(step === 'K1c' ? 'ready' : 'ready')
  const err = step === 'K1c'
  usePrimary(
    err
      ? () => goto('K1b')
      : state === 'ready'
        ? () => setState('scanning')
        : state === 'found'
          ? () => goto('K2')
          : null,
  )
  useEffect(() => {
    if (state !== 'scanning') return
    const t = window.setTimeout(() => setState('found'), 1300)
    return () => window.clearTimeout(t)
  }, [state])
  const title = err ? 'QR code not recognised' : state === 'found' ? 'Pass found' : state === 'scanning' ? 'Scanning…' : 'Ready to scan'
  const color = err ? '#e3355a' : state === 'found' ? '#16a34a' : '#1c2040'
  return (
    <PosShell active="Check-in">
      <PosHead title="Check-in" sub="Scan the guest’s QR pass to check them in" />
      <div className="pos-body">
        <div className="pos-left">
          <div className="pos-scan">
            <h2 style={{ color }}>{title}</h2>
            <div onClick={() => !err && state === 'ready' && setState('scanning')} style={{ cursor: 'pointer' }}>
              <Frame tone={err ? 'err' : state === 'found' ? 'ok' : undefined} />
            </div>
            <div className="pos-cap" style={{ color: err ? '#e3355a' : undefined }}>
              {err ? 'QR code not recognised. Try again or enter the reservation number.' : state === 'found' ? 'Priya Nair · Reservation #00032' : 'Position the guest’s QR code within the frame'}
            </div>
          </div>
          <div className="pos-help">
            Having trouble scanning?
            <button onClick={() => goto('K1b')}>Enter reservation #</button>
          </div>
        </div>
        <How step={1} />
      </div>
    </PosShell>
  )
}

/* ---------------- K1b find reservation (Figma 270:270) ---------------- */
export function K1b({ goto }: SceneProps) {
  const [q, setQ] = useState('')
  const target = '#0003'
  useEffect(() => {
    let i = 0
    const t = window.setInterval(() => {
      i++
      setQ(target.slice(0, i))
      if (i >= target.length) window.clearInterval(t)
    }, 220)
    return () => window.clearInterval(t)
  }, [])
  const done = q.length >= target.length
  usePrimary(done ? () => goto('K2') : null)
  const rows: [string, string, string][] = [
    ['PN', 'Priya Nair', '#00032 · Standard Double Room · Nov 12 – 15'],
    ['GL', 'Grace Liu', '#00033 · Standard Double Room · Nov 12 – 15'],
  ]
  return (
    <PosShell active="Check-in">
      <PosHead title="Check-in" sub="Scan the guest’s QR pass to check them in" />
      <div className="pos-body">
        <div className="pos-left pos-sheet">
          <div className="pos-back">
            <button className="pos-link" style={{ color: '#6b7088', fontWeight: 400 }} onClick={() => goto('K1')}>
              ← Back to scanner
            </button>
          </div>
          <h2>Find reservation</h2>
          <p>Type the reservation number or the guest name</p>
          <div className="pos-find">
            <span className={done ? '' : 'caret'}>{q}</span>
          </div>
          {done && <div className="pos-matches">2 matches</div>}
          {done &&
            rows.map(([i, n, s], k) => (
              <div key={n} className={`pos-match ${k === 0 ? 'on' : ''}`}>
                <span className="pos-av" style={k ? { background: '#fff' } : undefined}>
                  {i}
                </span>
                <div>
                  <b>{n}</b>
                  <span>{s}</span>
                </div>
                <PosPill tone="green">Confirmed</PosPill>
                <button className={`pos-btn ${k ? 'ghost' : ''}`} style={{ height: 52, padding: '0 28px' }} onClick={() => k === 0 && goto('K2')}>
                  Select
                </button>
              </div>
            ))}
        </div>
        <How step={1} />
      </div>
    </PosShell>
  )
}

/* ---------------- K2 confirm check-in (Figma 264:322) ---------------- */
export function K2({ goto }: SceneProps) {
  return (
    <PosShell active="Check-in">
      <PosHead title="Check-in" sub="Scan the guest’s QR pass to check them in" />
      <div className="pos-body">
        <div className="pos-left pos-sheet">
          <div className="pos-back">
            <button className="pos-link" style={{ color: '#6b7088', fontWeight: 400 }} onClick={() => goto('K1')}>
              ← Back
            </button>
            <button className="pos-link" onClick={() => goto('K1')}>
              New scan
            </button>
          </div>
          <h2>Confirm check-in</h2>
          <p>Please confirm the details before recording the arrival</p>
          <div className="pos-card">
            <div className="pos-guest">
              <span className="pos-av big">PN</span>
              <div>
                <b>Priya Nair</b>
                <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                  <PosPill tone="blue">Standard Double Room</PosPill>
                  <PosPill tone="green">Confirmed</PosPill>
                </div>
              </div>
            </div>
            <div className="pos-kv">
              <span>Reservation</span>
              <b>#00032 · Group Horizon Foundation</b>
            </div>
            <div className="pos-kv">
              <span>Stay</span>
              <b>Nov 12 – Nov 15, 2026 · 3 nights</b>
            </div>
            <div className="pos-kv">
              <span>Room</span>
              <b>
                {pos.room} <button className="pos-link">Change</button>
              </b>
            </div>
            <div className="pos-kv">
              <span>Balance due</span>
              <b>$ 0.00</b>
            </div>
          </div>
          <h3 className="pos-h3">Visit details</h3>
          <div className="pos-card">
            <div className="pos-kv">
              <span>Date &amp; time</span>
              <b>Nov 12, 2026 · 3:45 PM</b>
            </div>
            <div className="pos-kv">
              <span>Checked in by</span>
              <b>Sam Patel (Front desk)</b>
            </div>
          </div>
          <ActionButton className="pos-btn block" primary loadingMs={800} onDone={() => goto('K2b')} >
            Continue to waiver
          </ActionButton>
        </div>
        <How step={2} />
      </div>
    </PosShell>
  )
}

/* ---------------- K2b waiver (Figma 461:759, 269:270) ---------------- */
const SIG = 'M48 78 C 62 40, 80 38, 100 62 S 126 20, 148 38 S 176 66, 200 44 S 238 36, 262 52'
export function K2b({ goto }: SceneProps) {
  const [signed, setSigned] = useState(false)
  const [agree, setAgree] = useState(false)
  const [drawing, setDrawing] = useState(false)
  const [paths, setPaths] = useState<string[]>([])
  const pad = useRef<SVGSVGElement>(null)
  const ready = (signed || paths.length > 0) && agree

  // → key: sign, then agree, then check in
  usePrimary(() => {
    if (!signed && paths.length === 0) {
      setDrawing(true)
      window.setTimeout(() => {
        setSigned(true)
        setDrawing(false)
        window.setTimeout(() => setAgree(true), 450)
      }, 1300)
    } else if (!agree) setAgree(true)
    else goto('K2c')
  })

  const pt = (e: React.PointerEvent) => {
    const r = pad.current!.getBoundingClientRect()
    return `${Math.round(e.clientX - r.left)} ${Math.round(e.clientY - r.top)}`
  }
  const down = (e: React.PointerEvent) => {
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    setPaths((p) => [...p, `M${pt(e)}`])
    setSigned(false)
    setDrawing(true)
  }
  const move = (e: React.PointerEvent) => {
    if (!drawing || signed) return
    setPaths((p) => (p.length ? [...p.slice(0, -1), `${p[p.length - 1]} L${pt(e)}`] : p))
  }
  const hasInk = signed || paths.length > 0

  return (
    <PosShell active="Check-in">
      <PosHead title="Check-in" sub="Scan the guest’s QR pass to check them in" />
      <div className="pos-body">
        <div className="pos-left pos-sheet">
          <div className="pos-back">
            <button className="pos-link" style={{ color: '#6b7088', fontWeight: 400 }} onClick={() => goto('K2')}>
              ← Back
            </button>
          </div>
          <h2>Stay waiver</h2>
          <p>Please read and sign to complete check-in</p>
          <div className="pos-card pos-terms">
            <b>1. Property rules</b>
            <span>Guests agree to follow the venue rules, including quiet hours from 10:00 PM to 7:00 AM.</span>
            <b>2. Responsibility</b>
            <span>The venue is not responsible for items left unattended. Damage to rooms may be charged to the reservation.</span>
            <b>3. Safety</b>
            <span>Guests will follow posted safety instructions on trails and in shared spaces.</span>
          </div>
          <div className="pos-sig-l">Guest signature</div>
          <div className="pos-sig">
            <svg ref={pad} width="100%" height="100%" onPointerDown={down} onPointerMove={move} onPointerUp={() => setDrawing(false)} style={{ touchAction: 'none' }}>
              {(signed || (drawing && paths.length === 0)) && <path d={SIG} className={`sig ${signed ? 'done' : 'draw'}`} />}
              {paths.map((d, i) => (
                <path key={i} d={d} fill="none" stroke="#1c2040" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
              ))}
            </svg>
            {!hasInk && !drawing && <span className="hint">Sign here</span>}
            <button
              className="clear"
              onClick={() => {
                setPaths([])
                setSigned(false)
                setAgree(false)
              }}
            >
              Clear
            </button>
          </div>
          <label className="pos-agree" onClick={() => setAgree((a) => !a)}>
            <span className={`bx ${agree ? 'on' : ''}`}>{agree && <Icon name="check" size="x-small" />}</span>I agree to the stay terms
          </label>
          <ActionButton className="pos-btn" disabled={!ready} loadingMs={900} onDone={() => goto('K2c')} >
            Sign and check in
          </ActionButton>
        </div>
        <How step={2} />
      </div>
    </PosShell>
  )
}

/* ---------------- K2c checking in… → K3 checked in (Figma 461:861, 264:402) ---------------- */
export function K3({ step, goto }: SceneProps) {
  const [busy, setBusy] = useState(step === 'K2c')
  useEffect(() => {
    if (step !== 'K2c') return
    const t = window.setTimeout(() => goto('K3'), 1300)
    return () => window.clearTimeout(t)
  }, [step, goto])
  useEffect(() => setBusy(step === 'K2c'), [step])
  usePrimary(step === 'K3' ? () => goto('R0') : null)
  return (
    <PosShell active="Check-in">
      <PosHead title="Check-in" sub="Scan the guest’s QR pass to check them in" />
      <div className="pos-body">
        <div className="pos-left pos-sheet" style={{ alignItems: 'center' }}>
          {busy ? (
            <div className="pos-busy">
              <span className="ab-spinner" style={{ position: 'static', width: 46, height: 46, borderColor: '#0b66ff', borderRightColor: 'transparent', borderWidth: 5 }} />
              <b>Checking in…</b>
            </div>
          ) : (
            <>
              <div className="pos-okbig">
                <Icon name="check" size="large" color="#fff" />
              </div>
              <h2 style={{ fontSize: 34, marginTop: 14 }}>Checked in</h2>
              <p style={{ margin: '6px 0 26px' }}>Priya Nair is checked in to {pos.room}</p>
              <div className="pos-card" style={{ width: 560 }}>
                <div className="pos-kv">
                  <span>Reservation</span>
                  <b>#00032</b>
                </div>
                <div className="pos-kv">
                  <span>Room</span>
                  <b>{pos.room}</b>
                </div>
                <div className="pos-kv">
                  <span>Checked in</span>
                  <b>Nov 12, 2026 · 3:45 PM</b>
                </div>
                <div className="pos-kv">
                  <span>Status</span>
                  <PosPill tone="green">Checked in</PosPill>
                </div>
              </div>
              <div className="pos-info">Reservation #00032 now shows Checked in for the whole team.</div>
              <div className="k3-acts">
                <button className="pos-btn out" style={{ flex: 1 }} onClick={() => goto('K1')}>
                  Check in another guest
                </button>
                <ActionButton className="pos-btn" primary loadingMs={700} onDone={() => goto('R0')} >
                  Open reservation
                </ActionButton>
              </div>
            </>
          )}
        </div>
        <How step={3} />
      </div>
    </PosShell>
  )
}
