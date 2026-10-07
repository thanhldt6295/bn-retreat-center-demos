import { useState, type ReactNode } from 'react'
import { usePrimary } from '../../player/Player'
import './mail.css'

/* "Demo mailbox": a generic webmail frame so every e-mail in the videos is opened from an Inbox. */
export type MailMeta = {
  box: { name: string; role: string; email: string }
  subject: string
  from: { name: string; email: string; color?: string }
  date: string
  snippet: string
}

const others: Record<string, [string, string, string, string][]> = {
  Organizer: [
    ['Cedar Valley Dining Hall', 'Menu options for your group dinner', 'Here are three menu choices for Fri, Nov 13…', 'Sep 10'],
    ['Horizon Foundation Team', 'Retreat packing list', 'Please bring walking shoes and a warm layer…', 'Sep 09'],
    ['Alex Rivera', 'Activities during your stay', 'We can arrange a guided walk on Friday morning…', 'Sep 08'],
  ],
  Guest: [
    ['Horizon Foundation Team', 'Retreat packing list', 'Please bring walking shoes and a warm layer…', 'Sep 22'],
    ['Cedar Valley Dining Hall', 'Dietary preferences', 'Let us know if you have any dietary needs…', 'Sep 20'],
    ['Alex Rivera', 'Welcome to the retreat', 'Looking forward to hosting you in November…', 'Sep 18'],
  ],
}

export function MailShell({ meta, children }: { meta: MailMeta; children: ReactNode }) {
  const [open, setOpen] = useState(() => new URLSearchParams(window.location.search).get('mail') === 'open')
  usePrimary(open ? null : () => setOpen(true))
  const role = meta.box.role
  const first = meta.box.name[0]
  return (
    <div className="mail">
      <header className="mail-top">
        <h1>Email</h1>
        <div className="search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#444746" strokeWidth="2.4" strokeLinecap="round">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="M16 16l5 5" />
          </svg>
          Search mail
        </div>
        <div className="who">
          <div>
            <small>Demo mailbox</small>
            <b>
              {meta.box.name} · {role} ▾
            </b>
            <small>{meta.box.email}</small>
          </div>
          <span className="av">{first}</span>
        </div>
      </header>
      <div className="mail-main">
        <aside>
          <button className="compose">Compose</button>
          <nav>
            <a className="on">
              Inbox <b>{open ? 2 : 3}</b>
            </a>
            <a>Starred</a>
            <a>Sent</a>
            <a>Drafts</a>
          </nav>
          <div className="lab">Labels</div>
          <a className="sub">Retreat booking</a>
        </aside>
        <section className="mail-card">
          {!open ? (
            <ul className="mail-list">
              <li className="unread target" onClick={() => setOpen(true)}>
                <span className="from">{meta.from.name}</span>
                <span className="subj">
                  <b>{meta.subject}</b> <span>– {meta.snippet}</span>
                </span>
                <span className="dt">{meta.date}</span>
              </li>
              {(others[role] ?? others.Guest).map(([f, s, sn, d]) => (
                <li key={s}>
                  <span className="from">{f}</span>
                  <span className="subj">
                    {s} <span>– {sn}</span>
                  </span>
                  <span className="dt">{d}</span>
                </li>
              ))}
            </ul>
          ) : (
            <>
              <div className="back" onClick={() => setOpen(false)}>
                ← Back to inbox
              </div>
              <h2>{meta.subject}</h2>
              <div className="sender">
                <span className="av2" style={{ background: meta.from.color ?? '#7a1fa2' }}>
                  {meta.from.name[0]}
                </span>
                <div>
                  <b>{meta.from.name}</b> <span>&lt;{meta.from.email}&gt;</span>
                  <div>
                    to {meta.box.name} &lt;{meta.box.email}&gt;
                  </div>
                </div>
                <span className="dt">{meta.date}</span>
              </div>
              <div className="mail-body">{children}</div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
