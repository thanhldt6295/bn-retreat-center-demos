import { ActionButton } from '../../components/shared/ActionButton'
import { AdminPage, Badge, Check, GlobalNav, Select, TextArea } from '../../components/admin/Admin'
import { group, money, organizer, quote, staff, venue } from '../../data/demo'
import { usePlayer, type SceneProps } from '../../player/Player'
import './beo-preview.css'

/* BEO paper as drawn in Figma 286:13620 (794 wide, padding 48/56) */
const Meta = ({ k, v }: { k: string; v: string }) => (
  <div>
    <p className="k">{k}</p>
    <p className="v">{v}</p>
  </div>
)
function Tbl({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  return (
    <div className="bp-t">
      <div className="h">
        {head.map((h, i) => (
          <p key={h} className={['w300', 'w60 r', 'w120 r', 'w202 r'][i]}>
            {h}
          </p>
        ))}
      </div>
      {rows.map((r, i) => (
        <div className="r" key={i}>
          {r.map((c, j) => (
            <p key={j} className={['w300', 'w60 r', 'w120 r', 'w202 r'][j]}>
              {c}
            </p>
          ))}
        </div>
      ))}
    </div>
  )
}
function Paper() {
  return (
    <div className="bp-doc">
      <div className="hd">
        <div>
          <p className="brand">CEDAR VALLEY</p>
          <p className="sub">Retreat &amp; Conference Center</p>
        </div>
        <div className="id">
          <p>BANQUET EVENT ORDER</p>
          <b>{group.code}</b>
        </div>
      </div>
      <div className="meta">
        <Meta k="GROUP" v={group.name} />
        <Meta k="ORGANIZER" v={organizer.name} />
        <Meta k="DATES" v="Nov 12 – Nov 15, 2026 · 3 nights" />
        <Meta k="ROOMS" v="22 rooms · 12 single bed, 10 double bed" />
      </div>
      <p className="sec">ROOM SETUP</p>
      <Tbl head={['Room type', 'Qty', 'Rate', 'Total']} rows={quote.roomLines.map((l) => [`${l.name.replace(' Room', '')} Room (3 nights)`.replace('Cabin Room', 'Cabin'), l.qty, money(l.rate), money(l.total)])} />
      <p className="sec">SPACE AND ADD-ONS</p>
      <Tbl
        head={['Item', 'Qty', 'Rate', 'Total']}
        rows={[
          [quote.meeting.name, quote.meeting.days, money(quote.meeting.rate), money(quote.meeting.total)],
          [quote.catering.name, quote.catering.qty, money(quote.catering.rate), money(quote.catering.total)],
        ]}
      />
      <div className="tot">
        {[
          ['Rooms', money(quote.roomsTotal)],
          ['Space and add-ons', money(quote.addOnsTotal)],
          ['Taxes (10%)', money(quote.tax)],
        ].map(([k, v]) => (
          <div key={k}>
            <span>{k}</span>
            <b>{v}</b>
          </div>
        ))}
        <div className="g">
          <span>Total</span>
          <b>{money(quote.total)}</b>
        </div>
      </div>
      <div className="sig">
        <div>
          <i />
          <b>Client signature · pending</b>
          <span>
            {organizer.name} · {group.org}
          </span>
        </div>
        <div>
          <i />
          <b>Venue signature · pending</b>
          <span>
            {staff.jordan.name} · {staff.jordan.role}
          </span>
        </div>
      </div>
    </div>
  )
}

/** 3.1b BEO preview · send for e-signature (Figma 286:13379) */
export function BeoPreview({ next }: SceneProps) {
  const { toast } = usePlayer()
  return (
    <AdminPage>
      <GlobalNav />
      <div className="bp-page">
        <div className="bp-head">
          <div>
            <div className="s">Group Block GBR-008 · Documents</div>
            <div className="t">
              <h1>Banquet Event Order</h1>
              <Badge tone="warn">Draft</Badge>
            </div>
            <div className="s">Version 2 · Updated Sep 12, 2026 · Preview as the client will see it</div>
          </div>
          <div className="bp-act">
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
        <div className="bp-cols">
          <section className="slds-card bp-stage-card">
            <div className="bp-tabs">
              <span className="slds-button slds-button_brand">BEO</span>
              <span className="slds-button slds-button_neutral">Contract</span>
              <span className="slds-button slds-button_neutral">Agenda</span>
            </div>
            <div className="bp-stage">
              <Paper />
            </div>
          </section>
          <div className="bp-side">
            <section className="slds-card bp-es">
              <h2>E-signature</h2>
              <b className="l">Documents to sign</b>
              <Check on label="BEO_GBR-008.pdf" />
              <Check on label="Contract_GBR-008.pdf" />
              <b className="l" style={{ marginTop: 8 }}>
                Signers (in order)
              </b>
              {[
                [`${organizer.name} · Client`, organizer.email],
                [`${staff.jordan.name} · Venue`, venue.eventsEmail],
              ].map(([n, e]) => (
                <div key={n} className="sg">
                  <div>
                    <b>{n}</b>
                    <span>{e}</span>
                  </div>
                  <Badge>Not sent</Badge>
                </div>
              ))}
              <div className="f">
                <div className="lb">Message to the client</div>
                <TextArea rows={3} value="Hi Maya, please review the BEO and sign the contract to confirm your retreat. The deposit is paid in the next step." />
              </div>
              <div className="f">
                <div className="lb">Reminder</div>
                <Select value="After 3 days if unsigned" />
              </div>
            </section>
            <section className="slds-card bp-st">
              <h2>After you send</h2>
              <p>• Maya signs first with her secure link; then Jordan Reyes countersigns for the venue.</p>
              <p>• You see who signed and when on the Contract card.</p>
              <p>• The signed files are saved to Files automatically.</p>
            </section>
          </div>
        </div>
      </div>
    </AdminPage>
  )
}
