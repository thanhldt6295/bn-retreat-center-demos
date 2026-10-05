import type { ReactNode } from 'react'
import { ActionButton } from '../../components/shared/ActionButton'
import { Check, Field, Modal, Section, Stepper } from '../../components/admin/Admin'
import { QuoteSummary } from '../../components/admin/QuoteSummary'
import { addOnCatalog, group, money, organizer, quote, roomTypes } from '../../data/demo'
import type { SceneProps } from '../../player/Player'
import { RecordPage } from './AdminRequest'

const STEPS = ['Group Block Info', 'Space, rooms & add-ons', 'Billing', 'Review & send']
const SUB = 'Leadership retreat · 22 of 22 rooms selected · Single Bed 12/12 · Double Bed 10/10'
const SUB0 = 'Leadership retreat · 0 of 22 rooms selected · Single Bed 0/12 · Double Bed 0/10'

const Select = ({ children }: { children: ReactNode }) => <div className="lds-input lds-select">{children}</div>
const Input = ({ children, disabled }: { children: ReactNode; disabled?: boolean }) => (
  <div className={`lds-input ${disabled ? 'disabled' : ''}`}>{children}</div>
)
const Back = ({ onClick }: { onClick: () => void }) => (
  <button className="lds-btn outline" onClick={onClick}>
    Back
  </button>
)

/** 2.1 – 2.5 (+ 2.2b room types, 2.3 add-on picker) */
export function Wizard({ step, next, prev, goto }: SceneProps) {
  const n = step === '2.1' ? 1 : step === '2.4' ? 3 : step === '2.5' ? 4 : 2

  const footer =
    step === '2.1' ? (
      <>
        <button className="lds-btn outline">Cancel</button>
        <ActionButton className="lds-btn brand" primary loadingMs={600} onDone={next}>
          Next
        </ActionButton>
      </>
    ) : step === '2.2' ? (
      <>
        <Back onClick={prev} />
        <ActionButton className="lds-btn brand" loadingMs={600} onDone={() => goto('2.4')}>
          Next
        </ActionButton>
      </>
    ) : step === '2.4' ? (
      <>
        <Back onClick={prev} />
        <ActionButton className="lds-btn brand" primary loadingMs={600} onDone={next}>
          Next
        </ActionButton>
      </>
    ) : step === '2.5' ? (
      <>
        <Back onClick={prev} />
        <ActionButton className="lds-btn brand" primary loadingMs={1100} onDone={next}>
          Send
        </ActionButton>
      </>
    ) : null

  return (
    <RecordPage confirmed>
      <Modal title={`New Group Booking for ${group.code}`} footer={footer}>
        <Stepper steps={STEPS} current={n} />
        <div style={{ fontSize: 13, color: '#555', margin: '4px 0 6px' }}>{step === '2.1' ? SUB0 : SUB}</div>
        <div className="lds-stepbody" key={n}>
          {n === 1 && <StepOne />}
          {n === 2 && <StepTwo onPick={() => goto('2.2b')} onAddOn={() => goto('2.3')} />}
          {n === 3 && <StepThree />}
          {n === 4 && <StepFour />}
        </div>
      </Modal>
      {step === '2.2b' && <RoomTypes onApply={next} />}
      {step === '2.3' && <AddOns onApply={next} />}
    </RecordPage>
  )
}

function StepOne() {
  return (
    <>
      <Section>Group Block Info</Section>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 12px' }}>
        <Field label="Code">
          <Input>{group.code}</Input>
        </Field>
        <Field label="Status">
          <Select>Confirmed</Select>
        </Field>
        <Field label="Start Date *">
          <Input disabled>{group.start}</Input>
        </Field>
        <Field label="End Date *">
          <Input disabled>{group.end}</Input>
        </Field>
        <Field label="Group Type">
          <Select>Retreat</Select>
        </Field>
        <Field label="Group Name">
          <Input>{group.name}</Input>
        </Field>
      </div>
      <Field label="Pricing Type" style={{ marginTop: 14 }}>
        <Select>Nightly</Select>
      </Field>
      <Field label="Special Request" style={{ marginTop: 14 }}>
        <div className="lds-input area">{group.special}</div>
      </Field>
    </>
  )
}

function StepTwo({ onPick, onAddOn }: { onPick: () => void; onAddOn: () => void }) {
  const th = { fontSize: 12, textTransform: 'uppercase', letterSpacing: '.04em', fontWeight: 700 } as const
  return (
    <>
      <Section>Space</Section>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Space">
          <Select>Meeting Hall</Select>
        </Field>
        <Field label="Setup layout">
          <Select>Classroom</Select>
        </Field>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 12 }}>
        <Field label="Dates">
          <Input>Nov 12 – Nov 14, 2026</Input>
        </Field>
        <Field label="Time">
          <Input>9:00 AM – 5:00 PM</Input>
        </Field>
        <Field label="Guests">
          <Input>{group.guests}</Input>
        </Field>
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', margin: '12px 0', fontSize: 13 }}>
        <span className="lds-badge mint">Available</span> Capacity 60 · $600.00 per day · free Nov 12 – 14
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
        <Check on /> Overnight stay: add rooms for this group
      </div>
      <Section>Rooms</Section>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <ActionButtonLike onClick={onPick}>Select room types</ActionButtonLike>
        <button className="lds-btn outline">Auto select requested rooms</button>
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
          <Check /> Allow overbooking
        </span>
      </div>
      <table className="lds-table" style={{ marginTop: 14, fontSize: 13 }}>
        <thead>
          <tr>
            {['Room type', 'Bed type', 'Rooms', 'Available', 'Rate / night', ''].map((h) => (
              <th key={h} style={th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {roomTypes.map((r) => (
            <tr key={r.key}>
              <td style={{ height: 36 }}>{r.name}</td>
              <td>{r.bed}</td>
              <td>{r.qty}</td>
              <td>{r.available}</td>
              <td>{money(r.rate)}</td>
              <td>
                <a className="lds-link">Edit rate</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', margin: '12px 0', fontSize: 13 }}>
        <span className="lds-badge mint">Matches request</span> 22 of 22 rooms · Single bed 12/12 · Double bed 10/10
      </div>
      <Section>Add-ons</Section>
      <ActionButtonLike onClick={onAddOn}>Add add-on</ActionButtonLike>
      <table className="lds-table" style={{ marginTop: 12, fontSize: 13 }}>
        <thead>
          <tr>
            {['Add-on', 'Qty', 'Rate', 'Total', ''].map((h) => (
              <th key={h} style={th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ height: 36 }}>{quote.catering.name}</td>
            <td>{quote.catering.qty}</td>
            <td>{money(quote.catering.rate)}</td>
            <td>{money(quote.catering.total)}</td>
            <td>
              <a className="lds-link">Edit</a>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

const ActionButtonLike = ({ onClick, children }: { onClick: () => void; children: ReactNode }) => (
  <button className="lds-btn outline ab" onClick={onClick}>
    {children}
  </button>
)

function StepThree() {
  return (
    <>
      <Section>Billing Information</Section>
      <div style={{ display: 'flex', gap: 18, alignItems: 'flex-end' }}>
        <Field label="Billed to (Person) *" style={{ width: 296 }}>
          <Select>{organizer.name}</Select>
        </Field>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', height: 32, fontSize: 13 }}>
          <Check on /> Taxes Enabled
        </label>
      </div>
      <p style={{ fontSize: 13, color: '#444', margin: '14px 0 6px' }}>
        All rooms and add-ons go on one invoice for the organizer. Guests who prefer to pay separately can book with the
        group code.
      </p>
    </>
  )
}

function StepFour() {
  return (
    <>
      <QuoteSummary lineStyle="at" />
      <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, margin: '14px 0' }}>
        <Check on /> Send quote to customer e-mail
      </label>
      <Field label="Email">
        <Input>{organizer.email}</Input>
      </Field>
    </>
  )
}

/* 2.2b */
function RoomTypes({ onApply }: { onApply: () => void }) {
  const rows = [...roomTypes.map((r) => ({ ...r, on: true, name: r.name })), { key: 'acc', name: 'Accessible Double Room', bed: 'Double', qty: 0, available: 2, maxOcc: 2, rate: 140, on: false }]
  return (
    <div className="lds-overlay" style={{ background: 'rgba(8,7,7,0.35)', zIndex: 600 }}>
      <div className="lds-modal">
        <span className="lds-modal-close">✕</span>
        <div className="lds-modal-h">Room Types</div>
        <div className="lds-modal-b" style={{ padding: '14px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <b style={{ color: '#032d60' }}>Room types for Nov 12 – Nov 15, 2026 · 3 nights</b>
              <div style={{ fontSize: 13, color: '#555', marginTop: 2 }}>Requested 22 rooms · Single bed 12 · Double bed 10</div>
            </div>
            <span className="lds-badge mint" style={{ padding: '4px 10px' }}>Selected 22 of 22</span>
          </div>
          <table className="lds-table" style={{ marginTop: 14, fontSize: 13 }}>
            <thead>
              <tr>
                {['', 'Room type', 'Bed type', 'Rooms', 'Avail', 'Max occ', 'Rate'].map((h) => (
                  <th key={h} style={{ fontSize: 12 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key}>
                  <td style={{ height: 40 }}>
                    <Check on={r.on} />
                  </td>
                  <td>{r.name}</td>
                  <td>{r.bed}</td>
                  <td>
                    <span style={{ display: 'inline-block', width: 38, textAlign: 'center', border: '1.5px solid #747474', borderRadius: 4, padding: '4px 0', fontWeight: 700, color: '#032d60' }}>{r.qty}</span>
                  </td>
                  <td>{r.available}</td>
                  <td>{r.maxOcc}</td>
                  <td>{money(r.rate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="lds-modal-f">
          <button className="lds-btn outline">Cancel</button>
          <ActionButton className="lds-btn brand" primary loadingMs={700} onDone={onApply}>
            Apply
          </ActionButton>
        </div>
      </div>
    </div>
  )
}

/* 2.3 */
function AddOns({ onApply }: { onApply: () => void }) {
  return (
    <div className="lds-overlay" style={{ background: 'rgba(8,7,7,0.35)', zIndex: 600 }}>
      <div className="lds-modal">
        <span className="lds-modal-close">✕</span>
        <div className="lds-modal-h">Add-ons</div>
        <div className="lds-modal-b" style={{ padding: '14px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div style={{ width: 350 }}>
              <div className="lds-label" style={{ fontSize: 13 }}>Search</div>
              <div className="lds-input" style={{ borderRadius: 8 }}>Search for Add-ons</div>
            </div>
            <button className="lds-btn outline">Create New</button>
          </div>
          <table className="lds-table" style={{ marginTop: 16, fontSize: 13 }}>
            <thead>
              <tr>
                {['', 'Item', 'Qty', 'Delivery', 'Base rate', 'Price'].map((h) => (
                  <th key={h} style={{ fontSize: 12 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {addOnCatalog.map((a) => (
                <tr key={a.name}>
                  <td style={{ height: 36 }}>
                    <Check on={'checked' in a && a.checked} />
                  </td>
                  <td>{a.name}</td>
                  <td>{a.qty}</td>
                  <td>{a.delivery}</td>
                  <td>{a.base}</td>
                  <td>{money(a.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="lds-modal-f">
          <button className="lds-btn outline">Cancel</button>
          <ActionButton className="lds-btn brand" primary loadingMs={700} onDone={onApply}>
            Apply
          </ActionButton>
        </div>
      </div>
    </div>
  )
}
