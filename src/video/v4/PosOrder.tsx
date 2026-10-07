import { useEffect, useState, type ReactNode } from 'react'
import { ActionButton } from '../../components/shared/ActionButton'
import { Icon } from '../../components/admin/Icon'
import { PosBar, PosPill, PosShell } from '../../components/pos/Pos'
import { money, pos } from '../../data/demo'
import { asset } from '../../lib/asset'
import { usePrimary, type SceneProps } from '../../player/Player'
import './v4.css'
import './pos-order.css'

const p = (n: number) => `$ ${n.toFixed(2)}`

/* ---------------- P1 reservations (Figma 469:820) ---------------- */
export function P1({ goto }: SceneProps) {
  usePrimary(() => goto('P2a'))
  const rows: [string, string, string, string, string, string, string, boolean][] = [
    ['#00032', 'Priya Nair', 'Checked in Nov 12 · 3:45 PM', 'Horizon Foundation', 'Standard Double Room · 204', 'In house', '$0.00', true],
    ['#00033', 'Grace Liu', 'Arrives Nov 12', 'Horizon Foundation', 'Standard Double Room · 202', 'Confirmed', '$0.00', false],
    ['#00031', 'Maya Thompson', 'Organizer', 'Horizon Foundation', '22 rooms · Meeting Hall', 'Confirmed', '$0.00', false],
    ['#00036', 'Tom Becker', 'Checked in Nov 12', '—', 'Cabin 2', 'In house', '$0.00', false],
  ]
  return (
    <PosShell active="Reservations">
      <div className="po-list">
        <h1>Reservations</h1>
        <p>Find the guest to add charges to their stay</p>
        <div className="po-tools">
          <div className="pos-search" style={{ width: 420 }}>
            <span>Search guest, room or reservation</span>
            <Icon name="search" size="small" />
          </div>
          <span className="po-sort">
            Sort by: <b>Room number</b>
          </span>
        </div>
        <div className="po-tbl">
          <div className="r h">
            {['Reservation', 'Guest', 'Group', 'Room', 'Status', 'Balance', ''].map((h, i) => (
              <span key={i}>{h}</span>
            ))}
          </div>
          {rows.map((r) => (
            <div key={r[0]} className={`r ${r[7] ? 'hl' : ''}`}>
              <span>{r[0]}</span>
              <span className="gu">
                <b>{r[1]}</b>
                <small>{r[2]}</small>
              </span>
              <span>{r[3]}</span>
              <span>{r[4]}</span>
              <span>
                <PosPill tone={r[5] === 'In house' ? 'green' : 'blue'}>{r[5]}</PosPill>
              </span>
              <span>{r[6]}</span>
              <span>
                <button className="pos-btn" style={{ height: 40, width: 82, padding: 0, fontSize: 14 }} onClick={() => r[7] && goto('P2a')}>
                  Open
                </button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </PosShell>
  )
}

/* ---------------- P2 order screen (Figma 508:1399, 469:1444) ---------------- */
const CATS: [string, string][] = [
  ['Entrees', '#12a8e0'],
  ['Sides', '#d12f4f'],
  ['Appetizers', '#18b24b'],
  ['Desserts', '#f5884c'],
  ['Beverages', '#1fcfb2'],
  ['Snacks', '#f5b83a'],
  ['Gift shop', '#f04fd4'],
  ['Services', '#7a5cff'],
]
const ITEMS = ['Grilled Beef Steak', 'Grilled Chicken Breast', 'BBQ Pork Ribs', 'Shrimp stir-fry with rice', 'Grilled Lamb Chops', 'Pan-Seared Salmon', 'Garlic Butter Shrimp', 'Stuffed bell peppers']

export function P2({ step, goto }: SceneProps) {
  const steak = step === 'P2c'
  const [flash, setFlash] = useState(step === 'P2c')
  useEffect(() => {
    if (!steak) return
    const t = window.setTimeout(() => setFlash(false), 1800)
    return () => window.clearTimeout(t)
  }, [steak])
  usePrimary(steak ? () => goto('P4') : () => goto('P3a'))
  const sub = steak ? 34.5 : 6.5
  const tax = sub * 0.1
  return (
    <PosShell active="Reservations">
      <PosBar title="RES-00032" onClose={() => goto('P1')} />
      <div className="po-split">
        <aside className="po-order">
          <div className="po-who">
            <div>
              <b>Priya Nair (Horizon Foundation)</b>
              <span>Standard Double Room · 204 · Nov 12 – 15</span>
            </div>
            <PosPill tone="blue">Open</PosPill>
          </div>
          <div className="po-tabs">
            <span>Stay</span>
            <span className="on">Additional charges</span>
          </div>
          <div className="po-lines">
            <div className="ln">
              <div>
                <b>1x Coffee</b>
                <small>Regular · Hot</small>
              </div>
              <b>{p(6.5)}</b>
            </div>
            {steak && (
              <div className={`ln ${flash ? 'new' : ''}`}>
                <div>
                  <b>1x Grilled Beef Steak</b>
                  <small>Medium · Seat 1 · Main course</small>
                </div>
                <b>{p(28)}</b>
              </div>
            )}
          </div>
          <div className="po-tot">
            <div>
              <span>Subtotal</span>
              <span>{p(sub)}</span>
            </div>
            <div>
              <span>Tax (10%)</span>
              <span>{p(tax)}</span>
            </div>
            <div className="t">
              <span>Total</span>
              <span key={sub}>{p(sub + tax)}</span>
            </div>
            <div className="bt">
              <button>Note</button>
              <button>Discount</button>
            </div>
          </div>
        </aside>
        <section className="po-menu">
          <div className="po-menu-h">
            <h2>Dining Hall</h2>
            <span className="po-sq">
              <Icon name="search" size="small" />
            </span>
          </div>
          <div className="po-cats">
            {CATS.map(([n, c], i) => (
              <button key={n} style={{ background: c }} className={i === 0 ? 'sel' : ''}>
                {n}
              </button>
            ))}
          </div>
          <div className="po-items">
            {ITEMS.map((n, i) => (
              <button key={n} onClick={() => n === 'Grilled Beef Steak' && goto('P3a')}>
                <img src={asset(`img/food-${i + 1}.png`)} alt="" />
                <span>{n}</span>
              </button>
            ))}
          </div>
          <div className="po-acts">
            <button className="pos-btn red" onClick={() => goto('P1')}>
              Cancel
            </button>
            <button className="pos-btn ghost" style={{ color: '#0b66ff' }}>
              Save
            </button>
            <ActionButton className="pos-btn" primary={false} loadingMs={700} onDone={() => goto('P4')}>
              Checkout&nbsp; →
            </ActionButton>
          </div>
        </section>
      </div>
    </PosShell>
  )
}

/* ---------------- P3 item options (Figma 508:1607, 469:1564) ---------------- */
const TEMPS = ['Rare', 'Med-Rare', 'Medium', 'Med-Well', 'Well', 'Pittsburgh / Charred', 'Blue', 'Char-grilled']
export function P3({ step, goto }: SceneProps) {
  const [sel, setSel] = useState<string | null>(step === 'P3b' ? 'Medium' : null)
  usePrimary(sel ? () => goto('P2c') : () => { setSel('Medium'); goto('P3b') })
  return (
    <PosShell active="Reservations">
      <PosBar title="Grilled Beef Steak" onClose={() => goto('P2a')} />
      <div className="po-opt">
        <div className="po-opt-l">
          <h3>Cooking temperature</h3>
          <div className="po-temps">
            {TEMPS.map((t) => (
              <button
                key={t}
                className={sel === t ? 'on' : ''}
                onClick={() => {
                  setSel(t)
                  if (t === 'Medium') goto('P3b')
                }}
              >
                {t}
              </button>
            ))}
          </div>
          <small>Included: 8 oz grass-fed beef · seasonal vegetables</small>
        </div>
        <div className="po-opt-r">
          <div className="qty">
            <button>−</button>
            <b>1</b>
            <button>+</button>
          </div>
          {[
            ['Cooking temps', sel ?? 'Choose', true],
            ['Sauce', 'Choose', false],
            ['Seat', 'Seat 1', false],
            ['Course', 'Main course', false],
          ].map(([a, b, on]) => (
            <div key={a as string} className={`mod ${on ? 'on' : ''}`}>
              <span>{a as string}</span>
              <span>{b as string}</span>
            </div>
          ))}
          <button className="note">Add note</button>
          <ActionButton className="pos-btn block" disabled={!sel} loadingMs={700} onDone={() => goto('P2c')}>
            Add · $ 28.00
          </ActionButton>
        </div>
      </div>
    </PosShell>
  )
}

/* ---------------- P4 checkout · P5 charged to room (Figma 469:1128, 469:1197) ---------------- */
export function P4({ step, goto }: SceneProps) {
  const [charging, setCharging] = useState(false)
  const done = step === 'P5'
  usePrimary(done ? () => goto('R1') : charging ? null : () => setCharging(true))
  useEffect(() => {
    if (!charging) return
    const t = window.setTimeout(() => goto('P5'), 1300)
    return () => window.clearTimeout(t)
  }, [charging, goto])
  return (
    <PosShell active="Reservations">
      <PosBar title="Checkout" back onBack={() => goto('P2c')} onClose={() => goto('P1')} />
      <div className="po-co">
        <div className="po-total">
          <b>{p(pos.total)}</b>
          <span>total</span>
        </div>
        <div className="po-cols">
          <div>
            <h4>Adjust</h4>
            <div className="mini">
              <span>Tip</span>
              <span>$ 0.00</span>
            </div>
            <button className="pos-btn ghost block" style={{ height: 78 }}>
              Add tip
            </button>
            <div className="mini" style={{ marginTop: 18 }}>
              <span>Discount</span>
              <span>$ 0.00</span>
            </div>
            <button className="pos-btn ghost block" style={{ height: 78 }}>
              Discount
            </button>
          </div>
          <div>
            <h4>Items</h4>
            <div className="it">
              <span>1x Coffee</span>
              <span>{p(6.5)}</span>
            </div>
            <div className="it">
              <span>1x Grilled Beef Steak</span>
              <span>{p(28)}</span>
            </div>
            <div className="it">
              <span>Tax (10%)</span>
              <span>{p(pos.tax)}</span>
            </div>
            <div className="it tot">
              <span>Total</span>
              <span>{p(pos.total)}</span>
            </div>
            <small>Guest</small>
            <div className="gst">Priya Nair · Standard Double Room · 204</div>
          </div>
          <div>
            <h4>Pay</h4>
            <button className={`pos-btn block big ${charging ? 'ab-loading' : ''}`} onClick={() => setCharging(true)} style={{ height: 83 }}>
              <span className="ab-label">
                Charge to room
                <small>Priya Nair · Res #00032</small>
              </span>
              {charging && <span className="ab-spinner" />}
            </button>
            <button className="pos-btn ghost block" style={{ height: 78 }}>
              Cash
            </button>
            <button className="pos-btn ghost block" style={{ height: 78 }}>
              Card
            </button>
            <button className="pos-btn ghost block" style={{ height: 78 }}>
              Print invoice
            </button>
          </div>
        </div>
      </div>
      {done && (
        <Dialog
          title="Charged to room"
          sub={`Priya Nair · ${'Standard Double Room'} · 204`}
          big={p(pos.total)}
          note={`Order ${pos.order} was added to Reservation #00032`}
          small={`Balance due on the stay: ${p(pos.total)}`}
          left="New order"
          onLeft={() => goto('P2a')}
          onDone={() => goto('R1')}
        />
      )}
    </PosShell>
  )
}

export function Dialog({ title, sub, big, note, small, left, onLeft, onDone }: { title: string; sub: string; big: ReactNode; note: string; small: string; left: string; onLeft: () => void; onDone: () => void }) {
  return (
    <div className="pos-back-dim">
      <div className="pos-dialog">
        <div className="ok">
          <Icon name="check" size="large" style={{ fill: '#fff', width: 44, height: 44 }} />
        </div>
        <h3>{title}</h3>
        <div className="sub">{sub}</div>
        <div className="big">{big}</div>
        <div className="note">
          {note}
          <small>{small}</small>
        </div>
        <div className="row">
          <button className="pos-btn ghost" onClick={onLeft}>
            {left}
          </button>
          <ActionButton className="pos-btn" primary instant onDone={onDone}>
            Done
          </ActionButton>
        </div>
      </div>
    </div>
  )
}

/* ---------------- P6 check-out · P7 checked out (Figma 469:1282, 469:1355) ---------------- */
export function P6({ step, goto }: SceneProps) {
  const [paying, setPaying] = useState(false)
  const done = step === 'P7'
  usePrimary(done ? () => goto('R2b') : paying ? null : () => setPaying(true))
  useEffect(() => {
    if (!paying) return
    const t = window.setTimeout(() => goto('P7'), 1400)
    return () => window.clearTimeout(t)
  }, [paying, goto])
  const rows: [string, string?, string?, boolean?][] = [
    ['Room · Standard Double Room (3 nights)', '$140.00 × 3 nights', p(420)],
    ['Tax on room (10%)', undefined, p(42)],
    ['POS-1058 · Coffee, Grilled Beef Steak', 'Charged to room · Nov 12, 7:42 PM', p(34.5)],
    ['Tax on POS order (10%)', undefined, p(3.45)],
    ['Paid at booking · Card ending 4242', 'Sep 24, 2026', '− $ 462.00'],
  ]
  return (
    <PosShell active="Reservations">
      <PosBar title="Check-out · #00032" back onBack={() => goto('P1')} onClose={() => goto('P1')} />
      <div className="po-out">
        <div className="po-out-h">
          <div>
            <b>Priya Nair (Horizon Foundation)</b>
            <span>Standard 204 · Nov 12 – 15, 2026</span>
          </div>
          <PosPill tone="green">{done ? 'Checked out' : 'Checked in'}</PosPill>
        </div>
        <div className="po-out-b">
          <div className="folio">
            <h4>Folio</h4>
            {rows.map(([a, b, c]) => (
              <div className="fr" key={a}>
                <div>
                  <span>{a}</span>
                  {b && <small>{b}</small>}
                </div>
                <b>{c}</b>
              </div>
            ))}
            <div className="due">
              <span>Balance due</span>
              <b key={String(done)}>{done ? '$ 0.00' : p(pos.total)}</b>
            </div>
          </div>
          <div className="payb">
            <h4>Pay the balance</h4>
            <button className={`pos-btn block big ${paying ? 'ab-loading' : ''}`} onClick={() => setPaying(true)} style={{ height: 83 }}>
              <span className="ab-label">
                Card
                <small>Pay {p(pos.total)}</small>
              </span>
              {paying && <span className="ab-spinner" />}
            </button>
            <button className="pos-btn ghost block" style={{ height: 78 }}>
              Cash
            </button>
            <button className="pos-btn ghost block" style={{ height: 78 }}>
              Print invoice
            </button>
            <button className="pos-btn dang block" style={{ marginTop: 'auto', height: 78 }}>
              Check out without paying
            </button>
          </div>
        </div>
      </div>
      {done && (
        <Dialog
          title="Checked out"
          sub="Priya Nair · Standard 204 · Nov 15, 2026 · 10:42 AM"
          big={<span style={{ fontSize: 22, fontWeight: 600 }}>Paid {p(pos.total)} by card</span>}
          note="Reservation #00032 is now Checked out"
          small="Balance due on the stay: $ 0.00"
          left="Print receipt"
          onLeft={() => {}}
          onDone={() => goto('R2b')}
        />
      )}
    </PosShell>
  )
}

export { money }
