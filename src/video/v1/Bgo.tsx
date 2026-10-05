import { useEffect, type CSSProperties, type ReactNode } from 'react'
import { ActionButton } from '../../components/shared/ActionButton'
import { AdminPage, Badge, Field, GlobalNav, Input, Modal, Stepper, TextArea } from '../../components/admin/Admin'
import { Icon } from '../../components/admin/Icon'
import { QuoteSummary } from '../../components/admin/QuoteSummary'
import { agenda, group, money, organizer, quote, staff, timeline } from '../../data/demo'
import { usePlayer, type SceneProps } from '../../player/Player'

/* ------- Group Block (BEO) record: 3.1 Sent, 3.2 Confirmed, + new-reservation modal (4.1, 4.2) ------- */

const th = { fontSize: 12, textTransform: 'uppercase', letterSpacing: '.04em', fontWeight: 700 } as const

function Panel({ title, count, tag, right, children }: { title: string; count?: number; tag?: string; right?: ReactNode; children: ReactNode }) {
  return (
    <div className="slds-card" style={{ borderRadius: 12, marginBottom: 12, overflow: 'hidden' }}>
      <div className="lds-card-h" style={{ padding: '14px 14px 10px', fontSize: 19 }}>
        {title}
        {count !== undefined && <small>{count}</small>}
        <span className="push">{right ?? (tag && <Badge tone="">{tag}</Badge>)}</span>
      </div>
      {children}
    </div>
  )
}

function KV({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11.5, color: '#555', fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 13.5, fontWeight: 600, marginTop: 4 }}>{children}</div>
    </div>
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
  return (
    <AdminPage>
      <GlobalNav />
      <div className="lds-page">
        <div style={{ display: 'flex', alignItems: 'flex-start', padding: '16px 0 12px' }}>
          <div>
            <div className="lds-crumb">
              <a className="slds-text-link">Group Block Requests</a> › <a className="slds-text-link">Banquet Event Order</a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
              <h1 className="lds-h1" style={{ fontSize: 28, marginTop: 0 }}>{group.code}</h1>
              <Badge tone={tone}>{st}</Badge>
            </div>
            <div className="lds-sub">
              {group.type} · {group.name} · <a className="slds-text-link">{organizer.name}</a>
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button className="slds-button slds-button_neutral">{group.code} ↗</button>
            <button className="slds-button slds-button_neutral ab" onClick={onSend}>Send</button>
            <button className="slds-button slds-button_neutral">Edit</button>
            <button className="slds-button slds-button_neutral ab" onClick={onConvert}>Convert</button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: 12, alignItems: 'start' }}>
          <div>
            <Panel title="Banquet Event Order" tag="PMS">
              <div style={{ padding: '4px 14px 4px' }}>
                <KV label="Group Name">{group.name}</KV>
                <KV label="Status"><Badge tone={tone}>{st}</Badge></KV>
                <KV label="Contact"><a className="slds-text-link" style={{ fontWeight: 400 }}>{organizer.name}</a></KV>
                <KV label="Start Date → End Date">Nov 12, 2026 → Nov 15, 2026</KV>
                <KV label="Group Type">{group.type}</KV>
                <KV label="Payment options">Card</KV>
                <KV label="Group Block Request"><a className="slds-text-link" style={{ fontWeight: 400 }}>{group.code}</a></KV>
              </div>
            </Panel>
            <Panel title="Summary">
              <div style={{ padding: '4px 14px 8px', fontSize: 13 }}>
                {[
                  ['Rooms', quote.roomsTotal],
                  ['Space', quote.meeting.total],
                  ['Add-on', quote.catering.total],
                  ['Taxes', quote.tax],
                ].map(([k, v]) => (
                  <Line key={k as string} k={k as string} v={money(v as number)} />
                ))}
                <Line k="Total Amount" v={money(quote.total)} blue />
                <Line k="Deposit due (50%)" v={money(quote.deposit)} />
              </div>
            </Panel>
          </div>
          <div>
            <Panel title="Agenda" count={3} right={<button className="slds-button slds-button_neutral">New</button>}>
              <table className="slds-table slds-table_bordered slds-table_cell-buffer" style={{ fontSize: 12 }}>
                <thead>
                  <tr>
                    {['#', 'Agenda', 'Guests', 'Start time', 'End time', 'Location', 'Status'].map((h) => (
                      <th key={h} style={th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {agenda.map((a) => (
                    <tr key={a.n}>
                      <td style={{ height: 34 }}>{a.n}</td>
                      <td>{a.name}</td>
                      <td>{a.guests}</td>
                      <td>{a.start}</td>
                      <td>{a.end}</td>
                      <td>{a.location}</td>
                      <td><Badge tone={confirmed ? 'mint' : 'warn'}>{st === 'Sent' ? 'Pending' : 'Confirmed'}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
            <Panel title="Space" count={1} tag="Inventory">
              <Tbl head={['#', 'Space', 'Quantity', 'Rate', 'Total amount']} rows={[[1, quote.meeting.name, quote.meeting.days, money(quote.meeting.rate), money(quote.meeting.total)]]} />
            </Panel>
            <Panel title="Room Setup" count={3} tag="Inventory">
              <Tbl
                head={['#', 'Room type', 'Quantity', 'Rate', 'Total amount']}
                rows={quote.roomLines.map((l, i) => [i + 1, `${l.name} (3 nights)`, l.qty, money(l.rate), money(l.total)])}
                tall
              />
            </Panel>
            <Panel title="Add-on" count={1} right={<Badge tone="blue">POS</Badge>}>
              <Tbl head={['#', 'Add-on', 'Quantity', 'Rate', 'Total amount']} rows={[[1, quote.catering.name, quote.catering.qty, money(quote.catering.rate), money(quote.catering.total)]]} />
            </Panel>
            <Panel title="Contract" right={<Badge tone={confirmed ? 'mint' : 'warn'}>{confirmed ? 'Confirmed' : 'Pending'}</Badge>}>
              <div style={{ padding: '0 14px 14px' }}>
                <div style={{ fontSize: 11.5, color: '#555', marginBottom: 10 }}>{group.code}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <Box><KV label="Group Name">{group.name}</KV></Box>
                  <Box><KV label="Status">{st}</KV></Box>
                </div>
                <Box style={{ marginTop: 10 }}>
                  <KV label="Terms & Conditions">
                    <span style={{ fontWeight: 400, color: '#555', fontSize: 12.5 }}>
                      50% deposit ({money(quote.deposit, 0)}) is due when the contract is signed (Sep 22, 2026); the remaining 50%
                      ({money(quote.balance, 0)}) is due seven days before arrival (Nov 05, 2026). The meeting hall, group catering and
                      rooms are billed to Horizon Foundation on one invoice.
                    </span>
                  </KV>
                </Box>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
                  <Sig who="Client Signature" signed={confirmed ? organizer.name : ''} printed={confirmed ? `Printed name: ${organizer.name}` : 'Printed Name'} date={confirmed ? 'Sep 22, 2026' : 'Date'} />
                  <Sig who="Venue Signature" signed={confirmed ? staff.jordan.name : ''} printed={confirmed ? `Printed name: ${staff.jordan.name}, ${staff.jordan.role}` : 'Printed Name'} date={confirmed ? 'Sep 22, 2026' : 'Date'} />
                </div>
              </div>
            </Panel>
            <Panel title="Notes" count={confirmed ? 2 : 1} right={<button className="slds-button slds-button_brand">Add Note</button>}>
              {confirmed && <Note t="Contract signed and deposit received." m="Sep 22, 2026 · System" />}
              <Note t={`Quote sent to ${organizer.email}.${confirmed ? '' : ' Waiting for approval.'}`} m={`${timeline.quote} · ${staff.sam.name}`} />
            </Panel>
            <Panel title="Files" count={confirmed ? 2 : 1} right={<button className="slds-button slds-button_neutral">Upload Files</button>}>
              {confirmed ? (
                <>
                  <File n="Contract_GBR-008.pdf" m="Signed electronically · Sep 22, 2026" b="Signed" tone="mint" />
                  <File n="BEO_GBR-008.pdf" m="Banquet Event Order · Version 2" b="Final" tone="mint" />
                </>
              ) : (
                <File n="BEO_GBR-008.pdf" m="Banquet Event Order · Version 1" b="Draft" tone="warn" />
              )}
            </Panel>
          </div>
        </div>
      </div>
      {children}
    </AdminPage>
  )
}

const Line = ({ k, v, blue }: { k: string; v: string; blue?: boolean }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontWeight: 600 }}>
    <span style={{ color: blue ? '#0b5cff' : '#333', fontSize: 12 }}>{k}</span>
    <span style={{ color: blue ? '#0b5cff' : '#222' }}>{v}</span>
  </div>
)

const Box = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div style={{ background: '#f6f6f6', border: '1px solid #e1e1e1', borderRadius: 8, padding: '10px 12px 0', ...style }}>{children}</div>
)

function Sig({ who, signed, printed, date }: { who: string; signed: string; printed: string; date: string }) {
  return (
    <Box style={{ padding: '12px 14px', minHeight: 110 }}>
      <div style={{ fontWeight: 700, fontSize: 12.5 }}>{who}</div>
      <div style={{ fontSize: 22, minHeight: 36, marginTop: 6, color: '#222' }}>{signed}</div>
      {signed && <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Signed electronically</div>}
      <div style={{ borderTop: '1px solid #999', marginTop: signed ? 0 : 36, paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700 }}>
        <span>{printed}</span>
        <span>{date}</span>
      </div>
    </Box>
  )
}

const Note = ({ t, m }: { t: string; m: string }) => (
  <div style={{ padding: '12px 14px', borderTop: '1px solid #e5e5e5' }}>
    <div style={{ fontWeight: 700, fontSize: 13, color: '#032d60' }}>{t}</div>
    <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>{m}</div>
  </div>
)

const File = ({ n, m, b, tone }: { n: string; m: string; b: string; tone: 'mint' | 'warn' }) => (
  <div style={{ padding: '12px 14px', borderTop: '1px solid #e5e5e5', display: 'flex', alignItems: 'center' }}>
    <div>
      <div style={{ fontWeight: 700, fontSize: 13, color: '#032d60' }}>{n}</div>
      <div style={{ fontSize: 11, color: '#666', marginTop: 3 }}>{m}</div>
    </div>
    <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14 }}>
      <Badge tone={tone}>{b}</Badge>
      <a className="slds-text-link" style={{ fontSize: 12 }}>View</a>
    </span>
  </div>
)

function Tbl({ head, rows, tall }: { head: string[]; rows: (string | number)[][]; tall?: boolean }) {
  return (
    <table className="slds-table slds-table_bordered slds-table_cell-buffer" style={{ fontSize: 12 }}>
      <thead>
        <tr>
          {head.map((h) => (
            <th key={h} style={th}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => (
              <td key={j} style={{ height: tall ? 48 : 34 }}>{c}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
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
