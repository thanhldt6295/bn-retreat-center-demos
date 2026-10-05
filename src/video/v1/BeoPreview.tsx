import { ActionButton } from '../../components/shared/ActionButton'
import { AdminPage, Check, GlobalNav, Select, TextArea } from '../../components/admin/Admin'
import { BeoDoc } from '../../components/shared/Docs'
import { Badge } from '../../components/admin/Admin'
import { organizer, staff, venue } from '../../data/demo'
import { usePlayer, type SceneProps } from '../../player/Player'

/** 3.1b BEO preview · send for e-signature */
export function BeoPreview({ next }: SceneProps) {
  const { toast } = usePlayer()
  return (
    <AdminPage>
      <GlobalNav />
      <div className="lds-page" style={{ paddingTop: 14 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 12, color: '#555' }}>Group Block GBR-008 · Documents</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '6px 0 4px' }}>
              <h1 className="lds-h1" style={{ fontSize: 24 }}>Banquet Event Order</h1>
              <Badge tone="warn">Draft</Badge>
            </div>
            <div className="lds-sub">Version 2 · Updated Sep 12, 2026 · Preview as the client will see it</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button className="slds-button slds-button_neutral">Edit BEO</button>
            <button className="slds-button slds-button_neutral">Download</button>
            <ActionButton
              className="slds-button slds-button_brand"
              primary
              loadingMs={1100}
              onDone={() => {
                toast(`Sent for e-signature to ${organizer.name}.`)
                next()
              }}
            >
              Send for e-signature
            </ActionButton>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 14, alignItems: 'start' }}>
          <div className="slds-card" style={{ borderRadius: 18, padding: '24px 20px 30px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 18 }}>
              <span className="slds-button slds-button_brand" style={{ fontWeight: 700 }}>BEO</span>
              <span className="slds-button slds-button_neutral" style={{ fontWeight: 700, color: '#222' }}>Contract</span>
              <span className="slds-button slds-button_neutral" style={{ fontWeight: 700, color: '#222' }}>Agenda</span>
            </div>
            <div style={{ background: '#ededed', borderRadius: 10, padding: '28px 0', display: 'flex', justifyContent: 'center' }}>
              <BeoDoc variant="admin" />
            </div>
          </div>
          <div>
            <div className="slds-card" style={{ borderRadius: 18, padding: 16, marginBottom: 14 }}>
              <div style={{ fontSize: 20, color: '#555', marginBottom: 14 }}>E-signature</div>
              <b style={{ fontSize: 13 }}>Documents to sign</b>
              {['BEO_GBR-008.pdf', 'Contract_GBR-008.pdf'].map((f) => (
                <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'center', margin: '10px 0', fontSize: 13 }}>
                  <Check on /> {f}
                </div>
              ))}
              <b style={{ fontSize: 13, display: 'block', marginTop: 14 }}>Signers (in order)</b>
              {[
                [`${organizer.name} · Client`, organizer.email],
                [`${staff.jordan.name} · Venue`, venue.eventsEmail],
              ].map(([n, e]) => (
                <div key={n} style={{ display: 'flex', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #ddd' }}>
                  <div>
                    <b style={{ color: '#032d60', fontSize: 13 }}>{n}</b>
                    <div style={{ fontSize: 11, color: '#555', marginTop: 3 }}>{e}</div>
                  </div>
                  <span style={{ marginLeft: 'auto' }}><Badge>Not sent</Badge></span>
                </div>
              ))}
              <div className="lds-label" style={{ marginTop: 12 }}>Message to the client</div>
              <TextArea rows={3} value="Hi Maya, please review the BEO and sign the contract to confirm your retreat. The deposit is paid in the next step." />
              <div className="lds-label" style={{ marginTop: 12 }}>Reminder</div>
              <Select value="After 3 days if unsigned" />
            </div>
            <div className="slds-card" style={{ borderRadius: 18, padding: 16, fontSize: 13 }}>
              <div style={{ fontSize: 20, color: '#555', marginBottom: 10 }}>After you send</div>
              <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
                <li>Maya signs first with her secure link; then Jordan Reyes countersigns for the venue.</li>
                <li>You see who signed and when on the Contract card.</li>
                <li>The signed files are saved to Files automatically.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  )
}
