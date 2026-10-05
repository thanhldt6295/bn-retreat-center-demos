import { useEffect, useState } from 'react'
import { GCheck, PortalShell, Track } from '../../components/guest/Guest'
import { group, money, organizer, quote, timeline } from '../../data/demo'
import type { SceneProps } from '../../player/Player'
import './g4.css'

const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="g4-field">
    <span>{label}</span>
    <b>{value}</b>
  </div>
)

const Line = ({ label, value, kind }: { label: string; value: string; kind?: 'muted' | 'bold' }) => (
  <div className={`g4-line ${kind ?? ''}`}>
    <span>{label}</span>
    <span>{value}</span>
  </div>
)

/** The little document preview inside each card (Figma 198:7833 / 198:7862) */
function Preview({ kind }: { kind: 'beo' | 'contract' }) {
  const rows =
    kind === 'beo'
      ? [
          ['Dates', 'Nov 12 – Nov 15, 2026'],
          ['Rooms', '22 rooms · 3 nights'],
          ['Meeting Hall', '3 days, 9:00 – 17:00'],
          ['Catering', `${quote.catering.qty} guest-days`],
          ['Total', money(quote.total)],
        ]
      : [
          ['Deposit', `50% · ${money(quote.deposit)}`],
          ['Balance', `Due ${timeline.balanceDue}`],
          ['Billed to', organizer.name],
          ['Payment', 'Card'],
        ]
  return (
    <div className="g4-preview">
      <div className="g4-page">
        <div className="g4-dh">
          <b>CEDAR VALLEY</b>
          <span>{kind === 'beo' ? 'BEO' : 'CONTRACT'} · {group.code}</span>
        </div>
        <p className="g4-dt">{kind === 'beo' ? 'Banquet Event Order' : 'Group Booking Contract'}</p>
        <p className="g4-ds">{group.name}</p>
        {rows.map(([k, v]) => (
          <div key={k} className="g4-row">
            <span>{k}</span>
            <b>{v}</b>
          </div>
        ))}
        <div className="g4-sigs">
          <div>
            <i />
            Client signature
          </div>
          <div>
            <i />
            Venue signature
          </div>
        </div>
      </div>
    </div>
  )
}

/* G4 · review quote, BEO and contract (values from Figma frame 192:7847) */
export function G4({ goto }: SceneProps) {
  const [checked, setChecked] = useState(false)
  useEffect(() => {
    const t = window.setTimeout(() => setChecked(true), 900)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <PortalShell active="Overview">
      <div className="g-wrap">
        <div>
          <h1 className="g-h1">Review your group booking</h1>
          <p className="g-lead">Check the quote, the Banquet Event Order and the contract before you sign.</p>
        </div>
        <Track steps={['Review', 'Sign', 'Pay deposit']} current={1} />
        <div className="g4-cols">
          <div className="g-card g4-summary">
            <div className="g-card-h">Your quote</div>
            <div className="g4-body">
              <div className="g4-dates">
                <div>
                  <Field label="Group" value={group.name} />
                  <Field label="Dates" value="Nov 12 – Nov 15, 2026 · 3 nights" />
                </div>
                <div>
                  <Field label="Rooms" value="22 rooms · 12 single bed, 10 double bed" />
                  <Field label="Billed to" value={organizer.name} />
                </div>
              </div>
              {quote.roomLines.map((l) => (
                <Line key={l.key} label={`${l.name} × ${l.qty}`} value={money(l.total)} />
              ))}
              <Line label={`Meeting Hall × ${quote.meeting.days} days`} value={money(quote.meeting.total)} />
              <Line label={`Group Catering × ${quote.catering.qty} guest-days`} value={money(quote.catering.total)} />
              <Line label="Taxes (10%)" value={money(quote.tax)} kind="muted" />
              <Line label="Grand Total" value={money(quote.total)} kind="bold" />
            </div>
          </div>
          <div className="g4-docs">
            {(['beo', 'contract'] as const).map((k) => (
              <div className="g-card" key={k}>
                <div className="g4-doc">
                  <b>{k === 'beo' ? 'Banquet Event Order (BEO)' : 'Contract'}</b>
                  <span>{k === 'beo' ? 'BEO_GBR-008.pdf · Version 2' : 'Contract_GBR-008.pdf · Needs your signature'}</span>
                  <Preview kind={k} />
                  <div className="g4-btns">
                    <button className="g-btn small ab" onClick={() => goto(k === 'beo' ? 'G4b' : 'G4c')}>
                      Open file
                    </button>
                    <button className="g-btn small">Download</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="g4-actions">
          <span className="g4-check" onClick={() => setChecked((c) => !c)}>
            <GCheck on={checked} />I have reviewed the quote, the BEO and the contract.
          </span>
          <button className="g-btn yellow ab" disabled={!checked} onClick={() => goto('G5')}>
            Continue to sign
          </button>
        </div>
      </div>
    </PortalShell>
  )
}
