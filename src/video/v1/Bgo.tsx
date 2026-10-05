import { useEffect, type ReactNode } from 'react'
import { ActionButton } from '../../components/shared/ActionButton'
import { AdminPage, Badge, Field, GlobalNav, Input, Modal, Stepper, TextArea } from '../../components/admin/Admin'
import { Icon } from '../../components/admin/Icon'
import { QuoteSummary } from '../../components/admin/QuoteSummary'
import { agenda, group, money, organizer, quote, staff, timeline } from '../../data/demo'
import { usePlayer, type SceneProps } from '../../player/Player'
import './bgo.css'

/* Group Block (BEO) record: 3.1 Sent, 3.2 Confirmed + New Reservation wizard (4.1, 4.2).
   Sizes from Figma 183:7523: left column 444, right column 932, gap 16, table rows 36 / 56, card headers 56–60. */

function Card({ title, count, right, children, tall }: { title: string; count?: number; right?: ReactNode; children: ReactNode; tall?: boolean }) {
  return (
    <section className="slds-card bgo-card">
      <header className="bgo-card-h" style={tall ? { minHeight: 60 } : undefined}>
        <h2>
          {title}
          {count !== undefined && <small>{count}</small>}
        </h2>
        <span className="push">{right}</span>
      </header>
      {children}
    </section>
  )
}

const Lbl = ({ children }: { children: ReactNode }) => <div className="lds-lbl">{children}</div>

function Field2({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="bgo-f">
      <Lbl>{label}</Lbl>
      <div className="lds-val">{children}</div>
    </div>
  )
}

function Table({ head, widths, rows, rowH = 36 }: { head: string[]; widths: number[]; rows: ReactNode[][]; rowH?: number }) {
  return (
    <table className="slds-table slds-table_fixed-layout bgo-table">
      <colgroup>
        {widths.map((w, i) => (
          <col key={i} style={{ width: w || undefined }} />
        ))}
      </colgroup>
      <thead>
        <tr>
          {head.map((h) => (
            <th key={h} scope="col">
              <div className="slds-truncate">{h}</div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} style={{ height: rowH }}>
            {r.map((c, j) => (
              <td key={j}>{c}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function BgoPage({
  confirmed,
  onSend,
  onConvert,
  children,
}: {
  confirmed: boolean
  onSend?: () => void
  onConvert?: () => void
  children?: ReactNode
}) {
  const st = confirmed ? 'Confirmed' : 'Sent'
  const tone = confirmed ? 'mint' : 'warn'
  const rowBadge = <Badge tone={tone}>{confirmed ? 'Confirmed' : 'Pending'}</Badge>
  return (
    <AdminPage>
      <GlobalNav />
      <div className="bgo-head">
        <div className="bgo-title">
          <div className="lds-bc">
            <a className="slds-text-link">Group Block Requests</a>
            <Icon name="chevronright" size="xx-small" color="#5c5c5c" style={{ width: 10, height: 10 }} />
            <a className="slds-text-link">Banquet Event Order</a>
          </div>
          <div className="bgo-row1">
            <h1>{group.code}</h1>
            <Badge tone={tone}>{st}</Badge>
          </div>
          <div className="bgo-sub">
            {group.type} <i>·</i> {group.name} <i>·</i> <a className="slds-text-link">{organizer.name}</a>
          </div>
        </div>
        <div className="bgo-actions">
          <button className="slds-button slds-button_neutral">
            {group.code}
            <Icon name="new_window" size="x-small" className="slds-button__icon slds-button__icon_right" />
          </button>
          <button className="slds-button slds-button_neutral ab" onClick={onSend}>
            Send
          </button>
          <button className="slds-button slds-button_neutral">Edit</button>
          <button className="slds-button slds-button_neutral ab" onClick={onConvert}>
            Convert
          </button>
        </div>
      </div>
      <div className="bgo-body">
        <div className="bgo-left">
          <Card title="Banquet Event Order" right={<Badge>PMS</Badge>}>
            <div className="bgo-fields">
              <Field2 label="Group Name">{group.name}</Field2>
              <Field2 label="Status">
                <Badge tone={tone}>{st}</Badge>
              </Field2>
              <Field2 label="Contact">
                <a className="slds-text-link" style={{ fontWeight: 590 }}>{organizer.name}</a>
              </Field2>
              <Field2 label="Start Date → End Date">Nov 12, 2026 → Nov 15, 2026</Field2>
              <Field2 label="Group Type">{group.type}</Field2>
              <Field2 label="Payment options">Card</Field2>
              <Field2 label="Group Block Request">
                <a className="slds-text-link" style={{ fontWeight: 590 }}>{group.code}</a>
              </Field2>
            </div>
          </Card>
          <Card title="Summary">
            <div className="bgo-sum">
              {[
                ['Rooms', money(quote.roomsTotal), false],
                ['Space', money(quote.meeting.total), false],
                ['Add-on', money(quote.catering.total), false],
                ['Taxes', money(quote.tax), false],
                ['Total Amount', money(quote.total), true],
                ['Deposit due (50%)', money(quote.deposit), false],
              ].map(([k, v, blue]) => (
                <div key={k as string} className={blue ? 'blue' : ''}>
                  <span>{k}</span>
                  <b>{v}</b>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="bgo-right">
          <Card tall title="Agenda" count={3} right={<button className="slds-button slds-button_neutral">New</button>}>
            <Table
              head={['#', 'Agenda', 'Guests', 'Start time', 'End time', 'Location', 'Status']}
              widths={[48, 278, 80, 110, 110, 190, 114]}
              rows={agenda.map((a) => [a.n, a.name, a.guests, a.start, a.end, a.location, rowBadge])}
            />
          </Card>
          <Card title="Space" count={1} right={<Badge tone="blue">Inventory</Badge>}>
            <Table head={['#', 'Space', 'Quantity', 'Rate', 'Total amount']} widths={[48, 0, 184, 136, 180]} rows={[[1, quote.meeting.name, quote.meeting.days, money(quote.meeting.rate), money(quote.meeting.total)]]} />
          </Card>
          <Card title="Room Setup" count={3} right={<Badge tone="">Inventory</Badge>}>
            <Table
              head={['#', 'Room type', 'Quantity', 'Rate', 'Total amount']}
              widths={[48, 0, 184, 136, 180]}
              rowH={56}
              rows={quote.roomLines.map((l, i) => [i + 1, `${l.name} (3 nights)`, l.qty, money(l.rate), money(l.total)])}
            />
          </Card>
          <Card title="Add-on" count={1} right={<Badge tone="blue">POS</Badge>}>
            <Table head={['#', 'Add-on', 'Quantity', 'Rate', 'Total amount']} widths={[48, 0, 184, 136, 180]} rows={[[1, quote.catering.name, quote.catering.qty, money(quote.catering.rate), money(quote.catering.total)]]} />
          </Card>
          <Card title="Contract" right={<Badge tone={confirmed ? 'mint' : 'warn'}>{confirmed ? 'Confirmed' : 'Pending'}</Badge>}>
            <div className="bgo-contract">
              <Lbl>{group.code}</Lbl>
              <div className="bgo-info">
                <div>
                  <Lbl>Group Name</Lbl>
                  <div className="lds-val">{group.name}</div>
                </div>
                <div>
                  <Lbl>Status</Lbl>
                  <div className="lds-val">{st}</div>
                </div>
              </div>
              <div className="bgo-terms">
                <Lbl>Terms &amp; Conditions</Lbl>
                <p>
                  50% deposit ({money(quote.deposit, 0)}) is due when the contract is signed (Sep 22, 2026); the remaining 50% ({money(quote.balance, 0)}) is due
                  seven days before arrival (Nov 05, 2026). The meeting hall, group catering and rooms are billed to Horizon Foundation on one invoice.
                </p>
              </div>
              <div className="bgo-sigs">
                <Sig who="Client Signature" signed={confirmed ? organizer.name : ''} printed={confirmed ? `Printed name: ${organizer.name}` : 'Printed Name'} date={confirmed ? 'Sep 22, 2026' : 'Date'} />
                <Sig
                  who="Venue Signature"
                  signed={confirmed ? staff.jordan.name : ''}
                  printed={confirmed ? `Printed name: ${staff.jordan.name}, ${staff.jordan.role}` : 'Printed Name'}
                  date={confirmed ? 'Sep 22, 2026' : 'Date'}
                />
              </div>
            </div>
          </Card>
          <Card tall title="Notes" count={confirmed ? 2 : 1} right={<button className="slds-button slds-button_brand">Add Note</button>}>
            {confirmed && <Row t="Contract signed and deposit received." m="Sep 22, 2026 · System" />}
            <Row t={`Quote sent to ${organizer.email}.${confirmed ? '' : ' Waiting for approval.'}`} m={`${timeline.quote} · ${staff.sam.name}`} />
          </Card>
          <Card tall title="Files" count={confirmed ? 2 : 1} right={<button className="slds-button slds-button_neutral">Upload Files</button>}>
            {confirmed ? (
              <>
                <Row t="Contract_GBR-008.pdf" m="Signed electronically · Sep 22, 2026" badge={<Badge tone="mint">Signed</Badge>} />
                <Row t="BEO_GBR-008.pdf" m="Banquet Event Order · Version 2" badge={<Badge tone="mint">Final</Badge>} />
              </>
            ) : (
              <Row t="BEO_GBR-008.pdf" m="Banquet Event Order · Version 1" badge={<Badge tone="warn">Draft</Badge>} />
            )}
          </Card>
        </div>
      </div>
      {children}
    </AdminPage>
  )
}

function Sig({ who, signed, printed, date }: { who: string; signed: string; printed: string; date: string }) {
  return (
    <div className="bgo-sig">
      <b>{who}</b>
      <div className="name">{signed}</div>
      {signed && <small>Signed electronically</small>}
      <div className="line" />
      <div className="foot">
        <span>{printed}</span>
        <span>{date}</span>
      </div>
    </div>
  )
}

function Row({ t, m, badge }: { t: string; m: string; badge?: ReactNode }) {
  return (
    <div className="bgo-listrow">
      <div>
        <b>{t}</b>
        <span>{m}</span>
      </div>
      {badge && (
        <span className="r">
          {badge}
          <a className="slds-text-link">View</a>
        </span>
      )}
    </div>
  )
}
/* ---------------- 3.1 ---------------- */
export function BgoSent({ goto, from }: SceneProps) {
  const { toast } = usePlayer()
  useEffect(() => {
    if (from === '2.5') toast(`Group Block ${group.code} created and quote sent to ${organizer.name}.`)
  }, [from, toast])
  return <BgoPage confirmed={false} onSend={() => goto('3.1b')} />
}

/* ---------------- 3.2 and New Reservation wizard (4.1, 4.2) ---------------- */
export function BgoConfirmed({ step, next, prev, goto }: SceneProps) {
  const n = step === '4.1' ? 1 : step === '4.2' ? 2 : 0
  const footer =
    n === 1 ? (
      <>
        <button className="slds-button slds-button_neutral">Cancel</button>
        <ActionButton className="slds-button slds-button_brand" primary loadingMs={700} onDone={next}>Next</ActionButton>
      </>
    ) : (
      <>
        <button className="slds-button slds-button_neutral" onClick={prev}>Back</button>
        <ActionButton className="slds-button slds-button_brand" primary loadingMs={1200} onDone={() => goto('4.5')}>Book</ActionButton>
      </>
    )
  return (
    <BgoPage confirmed onConvert={() => goto('4.1')}>
      {n > 0 && (
        <Modal title="New Reservation" width={650} footer={footer}>
          <Stepper steps={['Reservation info', 'Review & book']} current={n} />
          <div className="lds-stepbody" key={n}>
            {n === 1 ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Field label="GB Code"><Input value={group.code} /></Field>
                  <Field label="Group Name"><Input value={`Retreat – ${group.name}`} /></Field>
                </div>
                <div className="lds-section" style={{ marginTop: 14 }}>Reservation Info</div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
                  <Field label="Status" style={{ flex: 1 }}><Input value="Pending Approval" disabled /></Field>
                  <Field label="Color"><div style={{ width: 36, height: 30, background: '#fbd354', borderRadius: 4 }} /></Field>
                </div>
                <Field label="Notes" style={{ marginTop: 12 }}>
                  <TextArea rows={2} value={`Group reservation for ${group.code}. Assign rooms after approval.`} />
                </Field>
              </>
            ) : (
              <>
                <QuoteSummary lineStyle="for" />
                <Field label="Stored Value">
                  <div className="slds-input-has-icon slds-input-has-icon_right">
                    <Icon name="moneybag" className="slds-input__icon slds-input__icon_right" color="#5c5c5c" />
                    <input className="slds-input" readOnly placeholder="Apply a discount, voucher or credit" aria-label="Stored Value" />
                  </div>
                </Field>
              </>
            )}
          </div>
        </Modal>
      )}
    </BgoPage>
  )
}
