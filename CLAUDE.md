# Booking Ninjas · Retreat Center video prototypes

Clickable, recordable code prototypes for 4 marketing videos (1–3 min each) about the Retreat Center niche of Booking Ninjas (BN). The Figma designs are the source of truth for layout and copy; this repo adds the real interaction states Figma lacks (loading, typing, toasts, live numbers, drag and drop) so the screen recording looks real.

Reviewer: David (needs a public link, no login).

## Deliverable

- One web app, four routes: `/v1`, `/v2`, `/v3`, `/v4`, plus `/` as an index.
- Each route plays its video's scenes in order. Keyboard: `→` next step, `←` previous, `R` reset scene, `H` hide the helper overlay (must be hidden while recording).
- Every click the video shows must work with a mouse too, so it can be recorded naturally.
- Deployed to a public URL (Vercel preferred, GitHub Pages as fallback) on every push to `main`.

## Stack

- Vite + React + TypeScript. Plain CSS modules or Tailwind; no heavy UI kit.
- Two visual systems, kept separate:
  - **Admin (staff) screens:** Salesforce Lightning look (LDS v2): Salesforce Sans fallback stack, blue brand buttons, global nav bar, record header, badges (Warning / Success / neutral), data tables, modals, toasts.
  - **Guest / organizer screens:** venue style: Inter, yellow primary buttons, dark green header, cream background, pill badges (Mint / Cream / Amber).
  - **POS screens (V4):** tablet POS style, Inter, dark bottom navigation, 1366 × 1024.
- Shared components live in `src/components/admin`, `src/components/guest`, `src/components/pos`. Build a component once and reuse it; do not copy markup between screens.
- All demo numbers come from `src/data/demo.ts` (see Canonical data). Screens never hard-code money values.

## Figma

File key `cmbum4z8hKBsaWVRVyaMpB` ("for-Retreat-Center-Video-demo"). Use the Figma connector (get_design_context / get_screenshot) to read each frame before building it. Pages:

| Video | Page | Page id |
| --- | --- | --- |
| V1 | V1 – Group Block – Guest | 192:7773 |
| V1 | V1 – Group Block – Admin | 178:7523 |
| V2 | V2 – Assign Rooms – Organizer | 238:270 |
| V2 | V2 – Room Invitation – Guest | 267:272 |
| V2 | V2 – Group Code Booking – Guest | 237:270 |
| V2 | V2 – Reservations & Room Changes – Admin | 239:14352 |
| V3 | V3 – Organizer Portal – Organizer (desktop) | 272:270 |
| V3 | V3 – Organizer Portal (mobile) | 306:2879 |
| V3 | V3 – Guest Portal – Guest (desktop) | 273:270 |
| V3 | V3 – Guest Portal (mobile) | 292:489 |
| V3 | V3 – Service Requests – Admin | 275:270 |
| V4 | V4 – Check-in QR – Guest | 263:270 |
| V4 | V4 – POS Check-in – Staff (tablet) | 264:270 |
| V4 | V4 – POS Ordering – Staff (tablet) | 251:270 |
| V4 | V4 – Connected Record – Admin | 259:2728 |
| All | V1–V4 – Title & End Cards – All | 296:13578 |

Several pages have a "Flow map" frame listing step → frame → action → next frame. Follow it.

Do not edit the Figma file. Read only.

## Scene order

### V1 · Group Block Request → Confirmed Group Booking (~2:55)

G1 request form → G2 request received → 1.1 request list → 1.2 GBR-008 Pending → 1.3 change Status to Confirmed → 1.4 availability check (1.4b–d hovers) → wizard 2.1 → 2.2 / 2.2b → 2.3 → 2.4 → 2.5 Send → 3.1 Group Block Sent → 3.1b BEO preview, Send for e-signature → G3 quote email, "Open your event portal" → G4 overview (G4b BEO, G4c contract) → G5 sign → G6 pay $9,306 → G7 booking confirmed → 3.2 Group Block Confirmed → 4.1 → 4.2 Book → 4.5 availability grid (4.5b–c) → 4.3 Reservation Pending Approval → 4.4 invoice (deposit paid) → Confirm Reservation → 4.3b Confirmed → end card.

### V2 · Group Rooms → Individual Guest Reservations (~2:45)

V1 G7 "Assign rooms" → A1 assign rooms, who pays → A2 send invitations → I1 invitation email → I2 → I3 Elena pays $462 → I4 confirmed #00034 → B1 enter GBR-008 → B2 choose Standard Double ("4 left in your block") → B3 Priya pays → B4 #00032 → C1 reservations list → C5 block usage → C6 assign room → C2 #00032 → C3 change room → C4 availability → C7 drag to move → C8 extend stay → end card.

### V3 · Organizer & Guest Portal

O0 secure link email → O1 overview → O2 rooms → O3 guests → O4 documents → O5 invoices → O6 schedule & meals → O7 invite guests → cut to guest → U0 secure link email → U1 my stay → U2 room → U3 payment → U4 schedule → U5 documents → U6 charges → U7 add-ons → U7b one cart → U8 request sent → S1 Request Manager (new request) → S2 detail → S3 confirmed → S4 portal activity. Show the mobile versions (MO*, M1–M4) as a short phone segment.

### V4 · POS → Connected Guest/Reservation Record

Q1 check-in email → Q2 QR pass → K1 scan QR (K1b find reservation, K1c QR not recognised) → K2 confirm check-in → K2b stay waiver signature → K3 checked in → R0 reservation Checked in → P1 reservations → P2 add charges → P3 item options → P4 checkout → P5 charged to room → R1 reservation with POS orders → R2 invoice (stay + POS) → R3 contact record → P6 check-out → P7 checked out → R2b invoice paid → R4 reservation checked out.

## Interaction states to build (the reason this repo exists)

- Buttons: hover, pressed, loading spinner (600–1200 ms), then success.
- Typing: form fields fill character by character when a scene starts (request form, group code, card number, signature name).
- Toasts slide in and auto-dismiss; badges change in place (Pending → Confirmed, Invited → Paid, Checked in, Checked out).
- Live numbers: rooms left per type (B2), Balance Due after payments, block usage (C5), invoice totals after a POS charge.
- Modals and wizards: open, step transitions, close.
- Availability grid: hover tooltips, cell selection, drag a booking to another unit, drag to extend a stay with the price updating.
- Tabs and scroll: scroll smoothly to the area the voiceover talks about.
- Responsive guest pages at 1440 wide and 390 wide (mobile segment in V3).

## Canonical data (`src/data/demo.ts`)

Venue: Cedar Valley Retreat & Conference Center (48 rooms, 6 cabins, 7 meeting spaces). Staff: Sam Patel (front desk / events), Jordan Reyes (Events Manager), Alex Rivera (activities).

Group: Horizon Foundation Annual Leadership Retreat, 32 guests. Organizer Maya Thompson, maya.thompson@horizon.example. Group Block Request **GBR-008**. Stay **Nov 12 – Nov 15, 2026**, 3 nights.

Quote (organizer pays everything):

| Item | Value |
| --- | --- |
| Standard Single | 12 × 3 nights × $140 = $5,040 |
| Standard Double | 6 × 3 nights × $140 = $2,520 (only 6 of 7 doubles free) |
| Cabin | 4 × 3 nights × $190 = $2,280 |
| Rooms total | $9,840 (22 rooms) |
| Meeting Hall | 3 days × $600 = $1,800 (own line, not an add-on) |
| Group Catering | 96 guest-days × $55 = $5,280 (add-on) |
| Subtotal | $16,920 |
| Tax 10% | $1,692 |
| Total | **$18,612** |
| Deposit 50% | **$9,306**, paid Sep 22 |
| Balance | due Nov 05 |

Timeline: request Sep 08, quote Sep 12 (valid to Sep 28), venue signed Sep 20, organizer signed and paid deposit Sep 22.

Statuses: GBR Pending → Confirmed → Converted. Group Block Sent → Confirmed. Reservation Pending Approval → (staff clicks Confirm Reservation) → Confirmed. Availability is checked at convert; there is no room hold.

Group reservation **#00031** (Maya), invoice INV-00031.

V2 individual reservations (guest pays $140 × 3 + 10% tax = $462; cabin $190 × 3 + tax = $627):

| # | Guest | Room type | Total | Balance | Status | How |
| --- | --- | --- | --- | --- | --- | --- |
| #00032 | Priya Nair | Standard Double | $462 | $0 | Confirmed | group code, paid Sep 24 |
| #00033 | Grace Liu | Standard Double | $462 | $0 | Confirmed | paid |
| #00034 | Elena Rossi | Standard Single | $462 | $0 | Confirmed | invitation from organizer |
| #00035 | Marcus Webb | Cabin | $627 | $627 | Pending Approval | booked, not paid |
| #00036 | Tom Becker | — (not in group) | $693 | $0 | Confirmed | |

Organizer-paid assigned rooms: Maya Thompson and Daniel Okafor (Standard Single), Omar Haddad (Standard Double).

After the guest bookings, #00031 = 18 rooms, subtotal $15,090, tax $1,509, total **$16,599**, balance **$7,293**. The organizer portal shows the same as Total $18,612 − credit $2,013 (rooms paid by guests) = $16,599. Block usage: 22 in block, 7 assigned (1 pending approval), 15 open; per type 3 of 12 single, 3 of 6 double, 1 of 4 cabin. Organizer view: Confirmed 6 (3 paid by you · 3 paid by guests), Waiting 1, Still open 15.

V3: guest view is Priya (#00032). Room number is assigned at check-in, so before arrival she sees "Standard Double Room". Add-on request: Guided Forest Walk, Fri Nov 13 9:00 AM, included ($0), confirmed by Sam Patel, assigned to Alex Rivera. Group meals and meeting hall are "Paid by Horizon". Stay waiver: "Sign at check-in on Nov 12".

V4: Priya checks in Nov 12 3:45 PM by QR scan at POS (Sam Patel), room **Standard 204**, waiver signed 3:40 PM. POS order **POS-1058**, Nov 12 7:42 PM, $34.50 + tax $3.45 = **$37.95**, charged to room. Stay total $499.95 ($462 paid at booking + $37.95). Check-out Nov 15 10:42 AM, $37.95 paid by card, balance $0.

## Rules

- Match Figma copy and data exactly; where Figma and this file disagree on a number, this file wins and you note it in the PR.
- No real names of real companies other than Booking Ninjas; no real card numbers (use 4242 test style).
- Never add features that are not in the Figma frames.
- Features still to be confirmed by David before the video ships (build them, but keep each behind a flag in `src/flags.ts` so it can be hidden): guest portal and staff notifications (V3); QR check-in, Charge to room, combined stay + POS invoice, Contact record sections (V4).
- After building each scene, take a screenshot and compare it with the Figma frame before moving on.
- Commit per scene with a clear message; push to `main` to deploy.

## First session

1. Scaffold the Vite + React + TS app, routes `/`, `/v1`–`/v4`, the scene player and keyboard controls.
2. Create `src/data/demo.ts` from the canonical data above.
3. Build V1 end to end (admin + guest components first), deploy, and send the public URL.
4. Then V2, V3, V4 in that order, reusing components.
