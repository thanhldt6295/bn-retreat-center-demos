import { useEffect, type ReactNode } from 'react'
import { ActionButton } from '../../components/shared/ActionButton'
import { AdminPage, Badge, GlobalNav, ObjectIcon } from '../../components/admin/Admin'
import { Icon } from '../../components/admin/Icon'
import { group, gbrList, organizer, timeline } from '../../data/demo'
import { usePlayer, type SceneProps } from '../../player/Player'

/* ---------------- 1.1 list ---------------- */
export function RequestList({ next }: SceneProps) {
  const cols = [110, 150, 338, 150, 200, 70, 130, 120, 116]
  return (
    <AdminPage>
      <GlobalNav />
      <div className="lds-page">
        <div className="lds-head" style={{ paddingBottom: 6 }}>
          <ObjectIcon />
          <div>
            <div className="lds-crumb">Group Block Requests</div>
            <h1 className="lds-h1" style={{ fontWeight: 600 }}>
              All requests
            </h1>
          </div>
          <div className="lds-head-right">
            <button className="slds-button slds-button_neutral">New</button>
          </div>
        </div>
        <div className="lds-sub" style={{ margin: '0 0 12px' }}>
          6 items · Sorted by Start Date · Updated a few seconds ago
        </div>
        <div className="slds-card" style={{ borderRadius: 6, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'flex-end' }}>
            <div className="slds-form-element" style={{ width: 320 }}>
              <label className="slds-form-element__label" style={{ fontSize: 13, color: '#333' }} htmlFor="req-search">
                Search
              </label>
              <div className="slds-form-element__control slds-input-has-icon slds-input-has-icon_left">
                <Icon name="search" className="slds-input__icon slds-input__icon_left" color="#5c5c5c" />
                <input id="req-search" className="slds-input" placeholder="Search this list..." style={{ borderRadius: 8 }} />
              </div>
            </div>
            <button className="slds-button slds-button_neutral" style={{ marginLeft: 'auto' }}>
              Assign Label
            </button>
          </div>
          <table className="slds-table slds-table_bordered slds-table_cell-buffer slds-table_fixed-layout">
            <colgroup>
              {cols.map((w, i) => (
                <col key={i} style={{ width: w }} />
              ))}
            </colgroup>
            <thead>
              <tr className="slds-line-height_reset">
                {['Request', 'Contact', 'Group name', 'Group type', 'Dates', 'Rooms', 'Rate range', 'Status', 'Next step'].map((h) => (
                  <th key={h} scope="col">
                    <div className="slds-truncate">{h}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gbrList.map((r) => {
                const live = r.code === group.code
                const act = r.status === 'Pending' ? 'Review' : r.status === 'Confirmed' ? 'Convert' : 'View'
                return (
                  <tr
                    key={r.code}
                    className="slds-hint-parent"
                    style={{ cursor: live ? 'pointer' : 'default', background: live ? '#eaf1fe' : undefined, height: 48 }}
                    onClick={live ? next : undefined}
                  >
                    <th scope="row" style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 400, background: 'transparent' }}>
                      <a className="slds-text-link">{r.code}</a>
                    </th>
                    <td>{r.contact}</td>
                    <td>
                      <div className="slds-truncate">{r.name}</div>
                    </td>
                    <td>{r.type}</td>
                    <td>{r.dates}</td>
                    <td>{r.rooms}</td>
                    <td>{r.rate}</td>
                    <td>
                      <Badge>{r.status}</Badge>
                    </td>
                    <td>
                      <a className="slds-text-link">{act}</a>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
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
