import { money, quote } from '../../data/demo'

const box = { border: '1px solid #c9c9c9', borderRadius: 10, padding: '14px 14px', marginBottom: 12 } as const
const row = { display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: 13 } as const
const hd = { fontWeight: 700, color: '#032d60', fontSize: 14, margin: '4px 0 6px' } as const

/** Space / Rooms / Add-ons + totals box (wizard step 4 and New Reservation step 2). */
export function QuoteSummary({ lineStyle }: { lineStyle: 'at' | 'for' }) {
  return (
    <>
      <div style={box}>
        <div style={hd}>Space</div>
        <div style={row}>
          <span>
            {quote.meeting.days} × Meeting Hall (per day)
          </span>
          <span>{money(quote.meeting.total)}</span>
        </div>
        <div style={hd}>Rooms ({quote.nights} nights)</div>
        {quote.roomLines.map((l) => (
          <div style={row} key={l.key}>
            <span>
              {l.qty} × {l.name} {lineStyle === 'at' ? `at ${money(l.rate)}` : `for ${quote.nights} nights`}
            </span>
            <span>{money(l.total)}</span>
          </div>
        ))}
        <div style={hd}>Add-ons</div>
        <div style={row}>
          <span>
            {quote.catering.qty} × {quote.catering.name}
          </span>
          <span>{money(quote.catering.total)}</span>
        </div>
      </div>
      <div style={box}>
        <div style={row}>
          <span>Total</span>
          <span>{money(quote.subtotal)}</span>
        </div>
        <div style={row}>
          <span>Taxes</span>
          <span>{money(quote.tax)}</span>
        </div>
        <div style={{ ...row, alignItems: 'center' }}>
          <b style={{ color: '#032d60', fontSize: 14 }}>Grand Total</b>
          <b style={{ color: '#032d60', fontSize: 22 }}>{money(quote.total)}</b>
        </div>
      </div>
    </>
  )
}
