# Booking Ninjas · Retreat Center video prototypes

Clickable, recordable prototypes for the four Retreat Center marketing videos. See `CLAUDE.md` for the full brief.

- Routes: `/` index, `/v1` … `/v4`
- Keys: `→` next step · `←` previous · `R` reset scene · `H` hide the helper overlay (hide it while recording)
- Deep link to a step: `/v1?step=3.1` (add `&rec=1` to start with the overlay hidden)
- Demo numbers live in `src/data/demo.ts`; unconfirmed features are behind flags in `src/flags.ts`

```bash
npm install
npm run dev
```

## Notes vs. Figma

Where Figma and `CLAUDE.md` disagree on a number, `CLAUDE.md` wins:

- Quote validity: Figma G3 says "valid until Oct 15, 2026"; the brief says Sep 28, 2026 (used).
