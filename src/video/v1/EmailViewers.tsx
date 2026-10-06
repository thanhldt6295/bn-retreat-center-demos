import type { ReactNode } from 'react'
import { ActionButton } from '../../components/shared/ActionButton'
import { agenda, group, money, organizer, quote, timeline, venue } from '../../data/demo'
import type { SceneProps } from '../../player/Player'
import './email-viewer.css'

/* ---------------- G3 quote email (Figma 192:7775) ---------------- */
export function G3({ next }: SceneProps) {
  const rows = [
    ...quote.roomLines.map((l) => [l.name, l.qty, String(quote.nights), money(l.rate, 0), money(l.total, 0)]),
    [quote.meeting.name, quote.meeting.days, '—', money(quote.meeting.rate, 0), money(quote.meeting.total, 0)],
    [quote.catering.name, quote.catering.qty, '—', money(quote.catering.rate, 0), money(quote.catering.total, 0)],
  ]
  return (
    <div className="em">
      <div className="em-subject">
        <b>Group Rate Quote · your private link inside</b>
        <span>· from {venue.name} · {timeline.quote}</span>
      </div>
      <div className="em-card">
        <div className="em-head">
          <div>
            <p className="k">GROUP BOOKING QUOTE</p>
            <p className="t">{group.name}</p>
          </div>
          <div className="id">
            <p className="k small">UNIQUE ID</p>
            <p className="n">{group.code}</p>
          </div>
        </div>
        <div className="em-meta">
          <div>
            <p className="k">TO</p>
            <p className="b">{organizer.name}</p>
            <p className="m">{organizer.email}</p>
          </div>
          <div>
            <p className="k">FROM</p>
            <p className="b">{venue.name}</p>
            <p className="m">{venue.email}</p>
          </div>
        </div>
        <div className="em-lines">
          <div className="hd">
            <p>Description</p>
            <p className="w60">Qty</p>
            <p className="w70">Nights</p>
            <p className="w80">Price</p>
            <p className="w90">Total</p>
          </div>
          {rows.map((r) => (
            <div key={r[0]} className="row">
              <p>{r[0]}</p>
              <p className="w60">{r[1]}</p>
              <p className="w70">{r[2]}</p>
              <p className="w80">{r[3]}</p>
              <p className="w90">{r[4]}</p>
            </div>
          ))}
        </div>
        <div className="em-totals">
          <div>
            <span>Amount total</span>
            <span>{money(quote.subtotal)}</span>
          </div>
          <div>
            <span>Tax (10%)</span>
            <span>{money(quote.tax)}</span>
          </div>
          <div className="grand">
            <span>Grand Total</span>
            <span>{money(quote.total)}</span>
          </div>
        </div>
        <div className="em-action">
          <ActionButton className="g-btn yellow" primary loadingMs={900} onDone={next}>
            Open your event portal
          </ActionButton>
          <p>
            50% deposit ({money(quote.deposit)}) is due when you sign. This link is private to you, so there is no login. The quote is
            valid until {timeline.quoteValidTo}.
          </p>
        </div>
        <div className="em-secure">
          <span className="g-pill">Secure link</span>
          <span>{group.portalLink}</span>
        </div>
      </div>
    </div>
  )
}

/* ---------------- document viewers (Figma 200:7741, 200:7872) ---------------- */
function Viewer({
  file,
  meta,
  back,
  backLabel = 'Back to review',
  cta,
  children,
}: {
  file: string
  meta: string
  backLabel?: string
  back: () => void
  cta?: { label: string; onDone: () => void }
  children: ReactNode
}) {
  return (
    <div className="vw">
      <div className="vw-bar">
        <div className="l">
          <span className="back" onClick={back}>
            ← {backLabel}
          </span>
          <i />
          <b>{file}</b>
          <span className="meta">{meta}</span>
        </div>
        <div className="r">
          <span className="meta">Page 1 of 1</span>
          <button className="vw-btn">Download</button>
          <button className="vw-btn">Print</button>
          {cta && (
            <ActionButton className="vw-btn yellow" primary loadingMs={700} onDone={cta.onDone}>
              {cta.label}
            </ActionButton>
          )}
        </div>
      </div>
      <div className="vw-stage">
        <div className="vw-doc">{children}</div>
      </div>
    </div>
  )
}

const DocHead = ({ kind }: { kind: string }) => (
  <>
    <div className="vw-dh">
      <div>
        <b className="brand">CEDAR VALLEY</b>
        <span>Retreat &amp; Conference Center</span>
      </div>
      <div className="id">
        <span>{kind}</span>
        <b>{group.code}</b>
      </div>
    </div>
    <i className="vw-rule" />
  </>
)

const Meta = ({ items }: { items: [string, string][] }) => (
  <div className="vw-meta">
    {items.map(([k, v]) => (
      <div key={k}>
        <small>{k}</small>
        <b>{v}</b>
      </div>
    ))}
  </div>
)

const Sigs = () => (
  <div className="vw-sigs">
    {[
      ['Client signature', `${organizer.name} · ${group.org}`],
      ['Venue signature', venue.name],
    ].map(([a, b]) => (
      <div key={a}>
        <i />
        <b>{a}</b>
        <span>{b}</span>
        <span>Date: ____ / ____ / ________</span>
      </div>
    ))}
  </div>
)

function Table({ head, rows, widths, last }: { head: string[]; rows: (string | number)[][]; widths: number[]; last: number }) {
  const align = (i: number) => (i === 0 ? 'left' : i >= last ? 'right' : 'left')
  return (
    <div className="vw-table">
      <div className="h">
        {head.map((h, i) => (
          <p key={h} style={{ width: i === 0 ? undefined : widths[i], flex: i === 0 ? 1 : undefined, textAlign: align(i) }}>
            {h}
          </p>
        ))}
      </div>
      {rows.map((r, ri) => (
        <div key={ri} className="r">
          {r.map((c, i) => (
            <p key={i} style={{ width: i === 0 ? undefined : widths[i], flex: i === 0 ? 1 : undefined, textAlign: align(i) }}>
              {c}
            </p>
          ))}
        </div>
      ))}
    </div>
  )
}

export const G4b = ({ goto }: SceneProps) => (
  <Viewer file="BEO_GBR-008.pdf" meta="Version 2 · Sep 12, 2026" backLabel="Back to overview" back={() => goto('G4')}>
    <DocHead kind="BANQUET EVENT ORDER" />
    <Meta
      items={[
        ['GROUP', group.name],
        ['ORGANIZER', organizer.name],
        ['DATES', 'Nov 12 – Nov 15, 2026 · 3 nights'],
        ['ROOMS', '22 rooms · 12 single bed, 10 double bed'],
      ]}
    />
    <p className="vw-sec">AGENDA</p>
    <Table
      head={['Session', 'Day', 'Time', 'Location', 'Guests']}
      widths={[0, 90, 130, 190, 62]}
      last={4}
      rows={agenda.map((a) => [a.name, a.day, a.time, a.location, a.guests])}
    />
    <p className="vw-sec">ROOM SETUP</p>
    <Table
      head={['Room type', 'Qty', 'Rate', 'Total']}
      widths={[0, 56, 110, 246]}
      last={1}
      rows={quote.roomLines.map((l) => [`${l.name} (3 nights)`, l.qty, money(l.rate), money(l.total)])}
    />
    <p className="vw-sec">ADD-ONS</p>
    <Table
      head={['Add-on', 'Qty', 'Rate', 'Total']}
      widths={[0, 56, 110, 246]}
      last={1}
      rows={[
        [quote.meeting.name, quote.meeting.days, money(quote.meeting.rate), money(quote.meeting.total)],
        [quote.catering.name, quote.catering.qty, money(quote.catering.rate), money(quote.catering.total)],
      ]}
    />
    <div className="vw-totals">
      {[
        ['Rooms', money(quote.roomsTotal), true],
        ['Add-ons', money(quote.addOnsTotal), true],
        ['Taxes (10%)', money(quote.tax), true],
        ['Total', money(quote.total), false],
        ['Deposit due on signing (50%)', money(quote.deposit), true],
        [`Balance due ${timeline.balanceDue}`, money(quote.balance), true],
      ].map(([k, v, muted]) => (
        <div key={k as string} className={muted ? 'muted' : ''}>
          <span>{k}</span>
          <span>{v}</span>
        </div>
      ))}
    </div>
    <Sigs />
  </Viewer>
)

export const G4c = ({ goto }: SceneProps) => {
  const clauses = [
    ['1. Event', `${venue.name} will host the ${group.name} from Nov 12 to Nov 15, 2026, including 22 rooms (12 single bed, 10 double bed), the Meeting Hall for 3 days and group catering for ${group.guests} guests, as listed in BEO ${group.code}.`],
    ['2. Payment', `The total is ${money(quote.total)} including taxes. A 50% deposit (${money(quote.deposit)}) is due when this contract is signed. The remaining 50% (${money(quote.balance)}) is due seven days before arrival (${timeline.balanceDue}).`],
    ['3. Changes', 'Room counts and add-ons can be adjusted until Oct 30, 2026. Changes after that date depend on availability and may change the total.'],
    ['4. Cancellation', 'Cancellations after Oct 30, 2026 are charged according to the venue cancellation policy attached to this booking.'],
    ['5. Billing', `All rooms and add-ons are billed to the organizer on one invoice. Guests who prefer to pay separately may book with the group code ${group.code}.`],
    ['6. Electronic signature', 'By signing electronically, both parties agree that the signature has the same effect as a handwritten signature.'],
  ]
  return (
    <Viewer
      file="Contract_GBR-008.pdf"
      meta="Needs your signature"
      back={() => goto('G4')}
      cta={{ label: 'Continue to sign', onDone: () => goto('G5') }}
    >
      <DocHead kind="GROUP BOOKING CONTRACT" />
      <Meta
        items={[
          ['CLIENT', `${group.org} · ${organizer.name}`],
          ['VENUE', venue.name],
          ['EVENT', 'Annual Leadership Retreat'],
          ['DATES', 'Nov 12 – Nov 15, 2026'],
        ]}
      />
      {clauses.map(([h, t]) => (
        <div key={h} className="vw-clause">
          <b>{h}</b>
          <p>{t}</p>
        </div>
      ))}
      <Sigs />
    </Viewer>
  )
}
