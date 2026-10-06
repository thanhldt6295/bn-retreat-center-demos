import type { ReactNode } from 'react'
import { ActionButton } from '../../components/shared/ActionButton'
import { Check, Field, Input, Modal, Section, Select, Stepper, TextArea, Badge } from '../../components/admin/Admin'
import { Icon } from '../../components/admin/Icon'
import { QuoteSummary } from '../../components/admin/QuoteSummary'
import { addOnCatalog, group, money, organizer, quote, roomTypes } from '../../data/demo'
import type { SceneProps } from '../../player/Player'
import { RecordPage } from './AdminRequest'

const STEPS = ['Group Block Info', 'Space, rooms & add-ons', 'Billing', 'Review & send']
const SUB = 'Leadership retreat · 22 of 22 rooms selected · Single Bed 12/12 · Double Bed 10/10'
const SUB0 = 'Leadership retreat · 0 of 22 rooms selected · Single Bed 0/12 · Double Bed 0/10'

const Neutral = ({ onClick, children, className = '' }: { onClick?: () => void; children: ReactNode; className?: string }) => (
  <button className={`slds-button slds-button_neutral ${className}`} onClick={onClick}>
    {children}
  </button>
)
const Th = ({ children }: { children?: ReactNode }) => (
  <th scope="col">
    <div className="slds-truncate">{children}</div>
  </th>
)
const tableClass = 'slds-table'

/** 2.1 – 2.5 (+ 2.2b room types, 2.3 add-on picker) */
export function Wizard({ step, next, prev, goto }: SceneProps) {
  const n = step === '2.1' ? 1 : step === '2.4' ? 3 : step === '2.5' ? 4 : 2

  const footer =
    step === '2.1' ? (
      <>
        <Neutral>Cancel</Neutral>
        <ActionButton className="slds-button slds-button_brand" primary loadingMs={600} onDone={next}>
          Next
        </ActionButton>
      </>
    ) : step === '2.2' ? (
      <>
        <Neutral onClick={prev}>Back</Neutral>
        <ActionButton className="slds-button slds-button_brand" loadingMs={600} onDone={() => goto('2.4')}>
          Next
        </ActionButton>
      </>
    ) : step === '2.4' ? (
      <>
        <Neutral onClick={prev}>Back</Neutral>
        <ActionButton className="slds-button slds-button_brand" primary loadingMs={600} onDone={next}>
          Next
        </ActionButton>
      </>
    ) : step === '2.5' ? (
      <>
        <Neutral onClick={prev}>Back</Neutral>
        <ActionButton className="slds-button slds-button_brand" primary loadingMs={1100} onDone={next}>
          Send
        </ActionButton>
      </>
    ) : null

  return (
    <RecordPage confirmed>
      <Modal title={`New Group Booking for ${group.code}`} footer={footer}>
        <div className="lds-wizcol">
        <Stepper steps={STEPS} current={n} />
        <div style={{ fontSize: 13, lineHeight: "18px", color: "#5c5c5c" }}>{step === '2.1' ? SUB0 : SUB}</div>
        <div className="lds-stepbody lds-wiz" key={n}>
          {n === 1 && <StepOne />}
          {n === 2 && <StepTwo onPick={() => goto('2.2b')} onAddOn={() => goto('2.3')} />}
          {n === 3 && <StepThree />}
          {n === 4 && <StepFour />}
        </div>
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Field label="Code">
          <Input value={group.code} />
        </Field>
        <Field label="Status">
          <Select value="Confirmed" />
        </Field>
        <Field label="Start Date *">
          <Input value={group.start} disabled icon="date_input" />
        </Field>
        <Field label="End Date *">
          <Input value={group.end} disabled icon="date_input" />
        </Field>
        <Field label="Group Type">
          <Select value="Retreat" />
        </Field>
        <Field label="Group Name">
          <Input value={group.name} />
        </Field>
      </div>
      <Field label="Pricing Type">
        <Select value="Nightly" />
      </Field>
      <Field label="Special Request">
        <TextArea value={group.special} rows={2} />
      </Field>
    </>
  )
}

function StepTwo({ onPick, onAddOn }: { onPick: () => void; onAddOn: () => void }) {
  return (
    <>
      <Section>Space</Section>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Field label="Space">
          <Select value="Meeting Hall" />
        </Field>
        <Field label="Setup layout">
          <Select value="Classroom" />
        </Field>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        <Field label="Dates">
          <Input value="Nov 12 – Nov 14, 2026" />
        </Field>
        <Field label="Time">
          <Input value="9:00 AM – 5:00 PM" />
        </Field>
        <Field label="Guests">
          <Input value={String(group.guests)} />
        </Field>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
        <Badge tone="mint">Available</Badge> Capacity 60 · $600.00 per day · free Nov 12 – 14
      </div>
      <Check on label="Overnight stay: add rooms for this group" />
      <Section>Rooms</Section>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <Neutral onClick={onPick} className="ab">
          Select room types
        </Neutral>
        <Neutral>Auto select requested rooms</Neutral>
        <span style={{ marginLeft: 'auto' }}>
          <Check label="Allow overbooking" />
        </span>
      </div>
      <table className={tableClass}>
        <thead>
          <tr className="slds-line-height_reset">
            {['Room type', 'Bed type', 'Rooms', 'Available', 'Rate / night', ''].map((h) => (
              <Th key={h}>{h}</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {roomTypes.map((r) => (
            <tr key={r.key} className="slds-hint-parent">
              <td>{r.name}</td>
              <td>{r.bed}</td>
              <td>{r.qty}</td>
              <td>{r.available}</td>
              <td>{money(r.rate)}</td>
              <td>
                <a className="slds-text-link">Edit rate</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
        <Badge tone="mint">Matches request</Badge> 22 of 22 rooms · Single bed 12/12 · Double bed 10/10
      </div>
      <Section>Add-ons</Section>
      <Neutral onClick={onAddOn} className="ab">
        Add add-on
      </Neutral>
      <table className={tableClass}>
        <thead>
          <tr className="slds-line-height_reset">
            {['Add-on', 'Qty', 'Rate', 'Total', ''].map((h) => (
              <Th key={h}>{h}</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="slds-hint-parent">
            <td>{quote.catering.name}</td>
            <td>{quote.catering.qty}</td>
            <td>{money(quote.catering.rate)}</td>
            <td>{money(quote.catering.total)}</td>
            <td>
              <a className="slds-text-link">Edit</a>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

function StepThree() {
  return (
    <>
      <Section>Billing Information</Section>
      <div style={{ display: 'flex', gap: 18, alignItems: 'flex-end' }}>
        <Field label="Billed to (Person) *" style={{ width: 296 }}>
          <Select value={organizer.name} />
        </Field>
        <div style={{ height: 32, display: 'flex', alignItems: 'center' }}>
          <Check on label="Taxes Enabled" />
        </div>
      </div>
      <p style={{ fontSize: 13, color: '#444', margin: '14px 0 6px' }}>
        All rooms and add-ons go on one invoice for the organizer. Guests who prefer to pay separately can book with the group code.
      </p>
    </>
  )
}

function StepFour() {
  return (
    <>
      <QuoteSummary lineStyle="at" />
      <div style={{ margin: '14px 0' }}>
        <Check on label="Send quote to customer e-mail" />
      </div>
      <Field label="Email">
        <Input value={organizer.email} />
      </Field>
    </>
  )
}

/* 2.2b */
function RoomTypes({ onApply }: { onApply: () => void }) {
  const rows = [
    ...roomTypes.map((r) => ({ ...r, on: true })),
    { key: 'acc', name: 'Accessible Double Room', bed: 'Double', qty: 0, available: 2, maxOcc: 2, rate: 140, on: false },
  ]
  return (
    <Modal
      stacked
      title="Room Types"
      footer={
        <>
          <Neutral>Cancel</Neutral>
          <ActionButton className="slds-button slds-button_brand" primary loadingMs={700} onDone={onApply}>
            Apply
          </ActionButton>
        </>
      }
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <b style={{ color: '#032d60' }}>Room types for Nov 12 – Nov 15, 2026 · 3 nights</b>
          <div style={{ fontSize: 13, color: '#555', marginTop: 2 }}>Requested 22 rooms · Single bed 12 · Double bed 10</div>
        </div>
        <Badge tone="mint">Selected 22 of 22</Badge>
      </div>
      <table className={tableClass}>
        <thead>
          <tr className="slds-line-height_reset">
            {['', 'Room type', 'Bed type', 'Rooms', 'Avail', 'Max occ', 'Rate'].map((h) => (
              <Th key={h}>{h}</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key} className="slds-hint-parent" style={{ height: 48 }}>
              <td>
                <Check on={r.on} />
              </td>
              <td>{r.name}</td>
              <td>{r.bed}</td>
              <td>
                <input className="slds-input" readOnly value={r.qty} aria-label={`${r.name} rooms`} style={{ width: 52, textAlign: 'center', fontWeight: 700, color: '#032d60' }} />
              </td>
              <td>{r.available}</td>
              <td>{r.maxOcc}</td>
              <td>{money(r.rate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Modal>
  )
}

/* 2.3 */
function AddOns({ onApply }: { onApply: () => void }) {
  return (
    <Modal
      stacked
      title="Add-ons"
      footer={
        <>
          <Neutral>Cancel</Neutral>
          <ActionButton className="slds-button slds-button_brand" primary loadingMs={700} onDone={onApply}>
            Apply
          </ActionButton>
        </>
      }
    >
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div className="slds-form-element" style={{ width: 350 }}>
          <label className="slds-form-element__label" style={{ fontSize: 13 }} htmlFor="addon-search">
            Search
          </label>
          <div className="slds-form-element__control slds-input-has-icon slds-input-has-icon_left">
            <Icon name="search" className="slds-input__icon slds-input__icon_left" color="#5c5c5c" />
            <input id="addon-search" className="slds-input" placeholder="Search for Add-ons" style={{ borderRadius: 8 }} />
          </div>
        </div>
        <Neutral>Create New</Neutral>
      </div>
      <table className={tableClass} style={{ marginTop: 16 }}>
        <thead>
          <tr className="slds-line-height_reset">
            {['', 'Item', 'Qty', 'Delivery', 'Base rate', 'Price'].map((h) => (
              <Th key={h}>{h}</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {addOnCatalog.map((a) => (
            <tr key={a.name} className="slds-hint-parent">
              <td>
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
    </Modal>
  )
}
