import { useEffect, useState } from 'react'
import { ActionButton } from '../../components/shared/ActionButton'
import { GToast } from '../../components/guest/GToast'
import { PortalShell } from '../../components/guest/Guest'
import { group } from '../../data/demo'
import type { SceneProps } from '../../player/Player'
import './assign.css'

type Pill = 'mint' | 'cream' | 'amber'
type Row = { room: string; name?: string; email?: string; pays?: string; pill: [string, Pill]; action: string; hl?: boolean }

const base = (phase: 'before' | 'sent' | 'booked', hl: boolean): Row[] => {
  const invited: [string, Pill] = phase === 'before' ? ['Not invited', 'cream'] : ['Invited', 'amber']
  const act = phase === 'before' ? 'Invite' : 'Resend'
  const booked = phase === 'booked'
  return [
    { room: 'Standard Single Room', name: 'Maya Thompson', email: 'maya.thompson@horizon.example', pays: 'Organizer', pill: ['Assigned', 'mint'], action: 'Change' },
    { room: 'Standard Single Room', name: 'Daniel Okafor', email: 'daniel.okafor@horizon.example', pays: 'Organizer', pill: ['Assigned', 'mint'], action: 'Change' },
    {
      room: 'Standard Single Room',
      name: 'Elena Rossi',
      email: 'elena.rossi@horizon.example',
      pays: 'Guest',
      pill: booked ? ['Paid', 'mint'] : invited,
      action: booked ? 'View' : act,
      hl: booked || (phase === 'sent' && hl),
    },
    { room: 'Standard Single Room', pill: ['Open', 'cream'], action: 'Add guest' },
    { room: 'Standard Double Room', name: 'Grace Liu', email: 'grace.liu@horizon.example', pays: 'Guest', pill: ['Paid', 'mint'], action: 'View' },
    { room: 'Standard Double Room', name: 'Omar Haddad', email: 'omar.haddad@horizon.example', pays: 'Organizer', pill: ['Assigned', 'mint'], action: 'Change' },
    booked
      ? { room: 'Standard Double Room', name: 'Priya Nair', email: 'priya@horizon.example', pays: 'Guest', pill: ['Paid', 'mint'], action: 'View', hl: true }
      : { room: 'Standard Double Room', pill: ['Open', 'cream'], action: 'Add guest' },
    { room: 'Cabin', name: 'Marcus Webb', email: 'marcus.webb@horizon.example', pays: 'Guest', pill: invited, action: act, hl: phase === 'sent' && hl },
  ]
}

const Pill = ({ t, tone }: { t: string; tone: Pill }) => <span className={`g-pill ${tone === 'mint' ? '' : tone}`}>{t}</span>

/* A1a / A2 / A1 / A1d / A1e: organizer "Assign your rooms" */
export function Assign({ step, goto }: SceneProps) {
  const phase = step === 'A1a' || step === 'A2' ? 'before' : step === 'A1e' ? 'booked' : 'sent'
  const rows = base(phase, step === 'A1')
  const [toast, setToast] = useState<{ t: string; s: string; k: number } | null>(null)

  useEffect(() => {
    if (step === 'A1') setToast({ t: '3 invitations sent', s: 'Elena and Marcus can confirm and pay · Daniel gets a confirmation', k: 1 })
    if (step === 'A1d') setToast({ t: 'Booking link copied', s: `Share it with guests who book with code ${group.code}`, k: 2 })
    if (step === 'A1e') setToast({ t: 'Elena Rossi and Priya Nair booked their rooms', s: `Elena paid her invitation · Priya booked with code ${group.code}`, k: 3 })
  }, [step])

  const stats =
    phase === 'booked'
      ? { confirmed: 6, confSub: '3 paid by you · 3 paid by guests', waiting: 1, waitSub: 'Marcus · invitation sent', open: 15 }
      : phase === 'sent'
        ? { confirmed: 4, confSub: '3 paid by you · 1 paid by guest', waiting: 2, waitSub: 'Invitation sent', open: 16 }
        : { confirmed: 4, confSub: '3 paid by you · 1 paid by guest', waiting: 0, waitSub: 'No invitations sent yet', open: 16 }
  const cards: [string, string | number, string][] = [
    ['Rooms in your block', 22, '12 single bed · 10 double bed'],
    ['Confirmed', stats.confirmed, stats.confSub],
    ['Waiting for guests', stats.waiting, stats.waitSub],
    ['Still open', stats.open, 'Add a guest or share the code'],
  ]

  const invitees = [
    ['Elena Rossi', 'elena.rossi@horizon.example', true],
    ['Marcus Webb', 'marcus.webb@horizon.example', true],
    ['Daniel Okafor', 'daniel.okafor@horizon.example', false],
  ] as const

  return (
    <PortalShell active="Rooms">
      <div className="as">
        <div className="as-title">
          <div>
            <h1 className="g-h1">Assign your rooms</h1>
            <p>
              {group.name} · Nov 12 – Nov 15, 2026 · Unassigned rooms are released on Oct 30, 2026
            </p>
          </div>
          <div className="as-btns">
            <button className="g-btn small">Import list</button>
            <button className="g-btn small">Auto-assign</button>
            <ActionButton className="g-btn small" primary={step === 'A1a'} instant onDone={() => goto('A2')}>
              Send invites
            </ActionButton>
            <button className="g-btn small yellow">Add guest</button>
          </div>
        </div>
        <div className="as-sum">
          {cards.map(([k, v, s]) => (
            <div key={k}>
              <b>{k}</b>
              <strong key={`${k}-${v}`} className={k !== 'Rooms in your block' ? 'bump' : ''}>
                {v}
              </strong>
              <span>{s}</span>
            </div>
          ))}
        </div>
        <div className="as-main">
          <div className="as-table">
            <div className="as-row head">
              <div>ROOM</div>
              <div>GUEST</div>
              <div>WHO PAYS</div>
              <div>STATUS</div>
              <div />
            </div>
            {rows.map((r, i) => (
              <div key={i} className={`as-row ${r.hl ? 'hl' : ''}`}>
                <div>{r.room}</div>
                <div>
                  {r.name ? (
                    <span className="as-g">
                      <b>{r.name}</b>
                      <span>{r.email}</span>
                    </span>
                  ) : (
                    <span className="as-na">Not assigned</span>
                  )}
                </div>
                <div>{r.pays ?? '—'}</div>
                <div>
                  <Pill t={r.pill[0]} tone={r.pill[1]} />
                </div>
                <div>
                  <span className="as-link">{r.action}</span>
                </div>
              </div>
            ))}
            <div className="as-foot">
              <span>Showing 8 of 22 rooms ·</span>
              <b>View all</b>
            </div>
          </div>
          <div className="g-card as-side">
            <div className="g-card-h">Share your code</div>
            <div className="body">
              <p>Guests who prefer to book and pay for their own room can use this code.</p>
              <div className="as-code">{group.code}</div>
              <ActionButton
                className="g-btn yellow"
                primary={step === 'A1'}
                instant
                onDone={() => (step === 'A1' ? goto('A1d') : setToast({ t: 'Booking link copied', s: `Share it with guests who book with code ${group.code}`, k: Date.now() }))}
              >
                Copy booking link
              </ActionButton>
              <button className="g-btn">Email the code</button>
            </div>
          </div>
        </div>
      </div>
      {toast && <GToast key={toast.k} title={toast.t} sub={toast.s} />}
      {step === 'A2' && (
        <div className="gm-back">
          <div className="gm">
            <div className="gm-h">
              Send room invitations
              <i>×</i>
            </div>
            <div className="gm-b">
              <p>Guests who pay for their own room get a link to confirm and pay. Guests you pay for receive a confirmation only.</p>
              {invitees.map(([n, e, pays]) => (
                <div key={n} className="gm-g">
                  <span className="as-g">
                    <b>{n}</b>
                    <span>{e}</span>
                  </span>
                  <Pill t={pays ? 'Pays own room' : 'Organizer pays'} tone={pays ? 'amber' : 'cream'} />
                </div>
              ))}
              <div className="gm-a">
                <button className="g-btn" onClick={() => goto('A1a')}>
                  Cancel
                </button>
                <ActionButton
                  className="g-btn yellow"
                  primary
                  loadingMs={1000}
                  onDone={() => {
                    goto('A1')
                  }}
                >
                  Send 3 invitations
                </ActionButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </PortalShell>
  )
}
