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

/* ---------------- shared record body (1.2 / 1.3 and wizard background) ---------------- */
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
      <div className="lds-page">
        <div className="lds-head" style={{ paddingBottom: 26 }}>
          <ObjectIcon size={48} />
          <div>
            <div className="lds-crumb">
              <a className="slds-text-link">Group Block Requests</a> ›
            </div>
            <h1 className="lds-h1">{group.name}</h1>
            <div className="lds-sub">
              {group.code} · Created {timeline.request}
            </div>
          </div>
          <div className="lds-head-right">
            Request status <Badge tone={confirmed ? 'mint' : 'warn'}>{confirmed ? 'Confirmed' : 'Pending'}</Badge>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 480px', gap: 20 }}>
          <div className="slds-card" style={{ borderRadius: 18 }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #dddbda', padding: '20px 24px' }}>
              <Stat label="Stay dates" value="Nov 12 – Nov 15, 2026" sub="3 nights" />
              <Stat label="Rooms requested" value="22 rooms" sub="12 single bed · 10 double bed" divider />
              <Stat label="Group type" value="Leadership retreat" divider />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, padding: '24px', minHeight: 300 }}>
              <div>
                <div style={{ fontWeight: 700, color: '#032d60', fontSize: 15, marginBottom: 14 }}>Organizer</div>
                <Info label="Contact" value={<a className="slds-text-link">{organizer.name}</a>} />
                <Info label="Organization" value={organizer.org} />
                <Info label="Email" value={organizer.email} />
                <Info label="Address" value={organizer.address} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#032d60', fontSize: 15, marginBottom: 14 }}>Special request</div>
                <div style={{ background: '#f3f3f3', borderRadius: 8, padding: '14px 16px', fontSize: 14 }}>{group.special}</div>
              </div>
            </div>
          </div>
          <div className="slds-card" style={{ borderRadius: 18, padding: 24, alignSelf: 'start' }}>
            <div style={{ fontSize: 22, color: '#032d60', marginBottom: 28 }}>Next step</div>
            <Num n={1} title="Review the request" body="Dates, rooms and special request." />
            <Num n={2} title="Check availability" body="Rooms and the Meeting Hall for Nov 12 – 14.">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                <Badge tone="mint">Available</Badge>
                <a className="slds-text-link" style={{ fontSize: 13 }} onClick={onOpenGrid}>
                  Open availability grid
                </a>
              </div>
            </Num>
            <Num n={3} title="Confirm the request" body={confirmed ? 'Status is Confirmed.' : 'Set the status to Confirmed.'} />
            {confirmed ? (
              <button className="slds-button slds-button_brand slds-button_stretch ab" style={{ marginTop: 14 }} onClick={onConvert}>
                Convert To Group Block Code
              </button>
            ) : (
              <ActionButton className="slds-button slds-button_brand slds-button_stretch" primary loading={loading} onDone={onConfirm} loadingMs={1000}>
                Confirm request
              </ActionButton>
            )}
            {!confirmed && (
              <button className="slds-button slds-button_neutral slds-button_stretch" style={{ marginTop: 14, marginLeft: 0 }} disabled>
                Convert To Group Block Code
              </button>
            )}
            <div style={{ textAlign: 'center', fontSize: 12, color: '#555', marginTop: 14 }}>
              {confirmed ? 'Opens the New Group Booking wizard.' : 'Available after the request is confirmed.'}
            </div>
          </div>
        </div>
      </div>
      {children}
    </AdminPage>
  )
}

function Stat({ label, value, sub, divider }: { label: string; value: string; sub?: string; divider?: boolean }) {
  return (
    <div style={{ flex: 1, paddingLeft: divider ? 24 : 0, borderLeft: divider ? '1px solid #dddbda' : undefined }}>
      <div style={{ fontSize: 12, color: '#555' }}>{label}</div>
      <div style={{ fontSize: 18, color: '#032d60', fontWeight: 500, margin: '4px 0' }}>{value}</div>
      {sub && <div style={{ fontSize: 13, color: '#555' }}>{sub}</div>}
    </div>
  )
}

function Info({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12, color: '#555' }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 500, marginTop: 3 }}>{value}</div>
    </div>
  )
}

function Num({ n, title, body, children }: { n: number; title: string; body: string; children?: ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
      <span
        style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: '#0b5cff',
          color: '#fff',
          display: 'grid',
          placeItems: 'center',
          fontSize: 12,
          fontWeight: 700,
          flex: 'none',
          marginTop: 1,
        }}
      >
        {n}
      </span>
      <div>
        <div style={{ fontWeight: 700, color: '#032d60', fontSize: 14 }}>{title}</div>
        <div style={{ color: '#555', fontSize: 13, marginTop: 4 }}>{body}</div>
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
