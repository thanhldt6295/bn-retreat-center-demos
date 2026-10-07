import { money, quote } from '../../data/demo'

/* Figma 184:8547 / 184:8565: boxes with 1px #c9c9c9, radius 8, padding 16, gap 8; headings 14/19 bold #03234d; lines 13/18 #2e2e2e */
const box = { border: '1px solid #c9c9c9', borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 } as const
const row = { display: 'flex', justifyContent: 'space-between', fontSize: 13, lineHeight: '18px', color: '#2e2e2e' } as const
const hd = { fontWeight: 700, color: '#03234d', fontSize: 14, lineHeight: '19px' } as const

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
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#03234d' }}>
          <b style={{ fontSize: 14, lineHeight: '19px' }}>Grand Total</b>
          <b style={{ fontSize: 20, lineHeight: '28px', fontWeight: 590 }}>{money(quote.total)}</b>
        </div>
      </div>
    </>
  )
}
