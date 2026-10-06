import { useEffect, type ReactNode } from 'react'
import { ActionButton } from '../../components/shared/ActionButton'
import { AdminPage, Badge, GlobalNav, ObjectIcon } from '../../components/admin/Admin'
import { Icon } from '../../components/admin/Icon'
import { group, gbrList, money, organizer, timeline } from '../../data/demo'
import { usePlayer, type SceneProps } from '../../player/Player'

/* ---------------- 1.1 list view (Figma 178:7525: 8 items, sortable columns, checkboxes) ---------------- */
const LIST_COLS: [string, number][] = [
  ['', 44], ['', 40], ['Name', 100], ['Contact', 163], ['Start Date', 120], ['End Date', 120], ['Created Date', 160],
  ['Group Type', 163], ['Maximu…', 110], ['Minimu…', 110], ['Number…', 110], ['Status', 100], ['', 50],
]
const TOOLS = ['settings', 'table', 'refresh', 'sort', 'edit', 'chart', 'filterList']

export function RequestList({ next }: SceneProps) {
  return (
    <AdminPage>
      <GlobalNav />
      <div className="lds-list-head">
        <div className="lds-record-title">
          <ObjectIcon size={40} color="#a25ee8" round />
          <div className="tx">
            <div style={{ fontSize: 13, color: '#5c5c5c' }}>Group Block Requests</div>
            <div className="lds-view">
              <h1>All Requests</h1>
              <Icon name="chevrondown" size="x-small" color="#5c5c5c" />
              <button className="slds-button slds-button_icon slds-button_icon-border-filled lds-pin" title="Pin this list view">
                <Icon name="pinned" size="x-small" color="#0250d9" />
              </button>
            </div>
          </div>
        </div>
        <div className="slds-button-group" role="group">
          <button className="slds-button slds-button_neutral">New</button>
          <button className="slds-button slds-button_neutral">Assign Label</button>
        </div>
      </div>
      <div className="lds-list-meta">8 items · Sorted by Created Date · Updated a few seconds ago</div>
      <div className="slds-card lds-list-card">
        <div className="lds-list-tools">
          <div className="slds-form-element__control slds-input-has-icon slds-input-has-icon_left" style={{ width: 300 }}>
            <Icon name="search" className="slds-input__icon slds-input__icon_left" color="#5c5c5c" />
            <input className="slds-input" placeholder="Search this list..." aria-label="Search this list" style={{ height: 36 }} />
          </div>
          {TOOLS.map((t, i) => (
            <button key={t} className="slds-button slds-button_icon slds-button_icon-border-filled lds-tool" title={t}>
              <Icon name={t} size="x-small" color="#0250d9" />
              {i < 2 && <Icon name="down" size="xx-small" color="#0250d9" style={{ marginLeft: 2 }} />}
            </button>
          ))}
        </div>
        <table className="slds-table slds-table_fixed-layout lds-list-table">
          <colgroup>
            {LIST_COLS.map(([, w], i) => (
              <col key={i} style={{ width: w }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {LIST_COLS.map(([h], i) => (
                <th key={i} scope="col">
                  {i === 1 ? (
                    <span className="lds-cb" />
                  ) : (
                    h && (
                      <div className="lds-th">
                        <span className="slds-truncate">{h}</span>
                        {h === 'Created Date' && <Icon name="arrowdown" size="xx-small" color="#2e2e2e" />}
                        <Icon name="chevrondown" size="xx-small" color="#2e2e2e" className="cv" />
                      </div>
                    )
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {gbrList.map((r, i) => {
              const live = r.code === group.code
              return (
                <tr key={r.code} className={live ? 'sel' : ''} onClick={live ? next : undefined} style={{ cursor: live ? 'pointer' : 'default' }}>
                  <td className="num">{i + 1}</td>
                  <td>
                    <span className="lds-cb" />
                  </td>
                  <td>
                    <a className="slds-text-link" style={{ fontWeight: live ? 590 : 400 }}>
                      {r.code}
                    </a>
                  </td>
                  <td>
                    <a className="slds-text-link">{r.contact}</a>
                  </td>
                  <td>{r.start}</td>
                  <td>{r.end}</td>
                  <td>{r.created}</td>
                  <td>{r.type}</td>
                  <td>{money(r.max)}</td>
                  <td>{money(r.min)}</td>
                  <td>{r.rooms}</td>
                  <td>{r.status}</td>
                  <td>
                    <span className="lds-rowact"><Icon name="chevrondown" size="xx-small" color="#0250d9" /></span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </AdminPage>
  )
}

/* ---------------- shared record body (1.2 / 1.3 and wizard background) — values from Figma 207:36548 / 207:36560 ---------------- */
export function RecordPage({
  confirmed,
  loading,
  onConfirm,
  onOpenGrid,
  onConvert,
  children,
}: {
  confirmed: boolean
  loading?: boolean
  onConfirm?: () => void
  onOpenGrid?: () => void
  onConvert?: () => void
  children?: ReactNode
}) {
  return (
    <AdminPage>
      <GlobalNav />
      <div className="lds-record-head">
        <div className="lds-record-title">
          <ObjectIcon size={48} />
          <div className="tx">
            <div className="lds-bc">
              <a className="slds-text-link">Group Block Requests</a>
              <Icon name="chevronright" size="xx-small" color="#5c5c5c" style={{ width: 10, height: 10 }} />
            </div>
            <h1>{group.name}</h1>
            <div style={{ color: '#5c5c5c' }}>
              {group.code} · Created {timeline.request}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, lineHeight: '17px', color: '#5c5c5c' }}>
          Request status <Badge tone={confirmed ? 'mint' : 'warn'}>{confirmed ? 'Confirmed' : 'Pending'}</Badge>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '16px 24px' }}>
        <div className="slds-card" style={{ flex: 1, overflow: 'hidden', alignSelf: 'stretch' }}>
          <div style={{ display: 'flex', padding: '20px 24px' }}>
            <Stat label="Stay dates" value="Nov 12 – Nov 15, 2026" sub="3 nights" first />
            <Stat label="Rooms requested" value="22 rooms" sub="12 single bed · 10 double bed" />
            <Stat label="Group type" value="Leadership retreat" />
          </div>
          <div style={{ height: 1, background: '#c9c9c9' }} />
          <div style={{ display: 'flex', gap: 32, padding: 24 }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="lds-h-sm">Organizer</div>
              <Info label="Contact" value={<a className="slds-text-link" style={{ fontWeight: 590 }}>{organizer.name}</a>} />
              <Info label="Organization" value={organizer.org} />
              <Info label="Email" value={organizer.email} />
              <Info label="Address" value={organizer.address} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="lds-h-sm">Special request</div>
              <div style={{ background: '#f3f3f3', borderRadius: 8, padding: 16, fontSize: 14, lineHeight: '19px', color: '#2e2e2e' }}>{group.special}</div>
            </div>
          </div>
        </div>
        <div className="slds-card" style={{ width: 480, flex: 'none', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px 16px', fontSize: 20, lineHeight: '28px', fontWeight: 590, color: '#03234d' }}>Next step</div>
          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Num n={1} title="Review the request" body="Dates, rooms and special request." />
            <Num n={2} title="Check availability" body="Rooms and the Meeting Hall for Nov 12 – 14.">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <Badge tone="mint">Available</Badge>
                <a className="slds-text-link" onClick={onOpenGrid}>
                  Open availability grid
                </a>
              </div>
            </Num>
            <Num n={3} title="Confirm the request" body={confirmed ? 'Status is Confirmed.' : 'Set the status to Confirmed.'} />
            {confirmed ? (
              <button className="slds-button slds-button_brand slds-button_stretch ab" onClick={onConvert}>
                Convert To Group Block Code
              </button>
            ) : (
              <ActionButton className="slds-button slds-button_brand slds-button_stretch" primary loading={loading} onDone={onConfirm} loadingMs={1000}>
                Confirm request
              </ActionButton>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
              {!confirmed && (
                <button className="slds-button slds-button_neutral slds-button_stretch" disabled>
                  Convert To Group Block Code
                </button>
              )}
              <div style={{ fontSize: 12, lineHeight: '17px', color: '#5c5c5c' }}>
                {confirmed ? 'Opens the New Group Booking wizard.' : 'Available after the request is confirmed.'}
              </div>
            </div>
          </div>
        </div>
      </div>
      {children}
    </AdminPage>
  )
}

function Stat({ label, value, sub, first }: { label: string; value: string; sub?: string; first?: boolean }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, padding: first ? '0 24px 0 0' : '0 24px', borderLeft: first ? undefined : '1px solid #c9c9c9' }}>
      <div className="lds-lbl">{label}</div>
      <div style={{ fontSize: 16, lineHeight: '22px', fontWeight: 590, color: '#03234d' }}>{value}</div>
      {sub && <div style={{ fontSize: 13, lineHeight: '18px', color: '#5c5c5c' }}>{sub}</div>}
    </div>
  )
}

function Info({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div className="lds-lbl">{label}</div>
      <div className="lds-val">{value}</div>
    </div>
  )
}

function Num({ n, title, body, children }: { n: number; title: string; body: string; children?: ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <span
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          background: '#0250d9',
          color: '#fff',
          display: 'grid',
          placeItems: 'center',
          fontSize: 12,
          lineHeight: '17px',
          fontWeight: 700,
          flex: 'none',
        }}
      >
        {n}
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 0 }}>
        <div className="lds-h-sm">{title}</div>
        <div style={{ color: '#5c5c5c', fontSize: 13, lineHeight: '18px' }}>{body}</div>
        {children}
      </div>
    </div>
  )
}
/* ---------------- 1.2 / 1.3 ---------------- */
export function RequestRecord({ step, from, next, goto }: SceneProps) {
  const { toast } = usePlayer()
  const confirmed = step !== '1.2'

  useEffect(() => {
    // arriving at 1.3 from 1.2: the badge flips in place and the toast slides in
    if (step === '1.3' && from === '1.2') toast('GBR-008 status updated to Confirmed.')
  }, [step, from, toast])

  return <RecordPage confirmed={confirmed} onConfirm={next} onOpenGrid={() => goto('1.4')} onConvert={() => goto('2.1')} />
}
