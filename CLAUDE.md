# Claude Code

## What this is
Multi-timezone clock app — React + Vite. Source is in `basic-clock-app/`.

## Dev
```bash
cd basic-clock-app && npm install && npm run dev
```
Runs at http://localhost:5173

## Build
```bash
npm run build   # output in dist/
```

## Structure
- `src/App.jsx` — main app: zone selector, drag-to-reorder, state/localStorage
- `src/App.css` — all styles (not scoped — standalone app)
- `src/ClockCard.jsx` — individual timezone card
- `src/TimezoneList.jsx` — infinite-scroll timezone list (rAF-driven)
- `src/TimezoneList.js` — IANA timezone data array
- `src/index.css` — base reset only

## Deployed copy
Also lives in [devsky](https://github.com/TylerKang/devsky) at `/clock` route with scoped CSS (`.clock-page`). Changes here should be mirrored to `devsky/src/clock/` — the devsky copy renames imports (`App.css` → `Clock.css`, `TimezoneList.js` → `timezoneData.js`) and wraps in a `.clock-page` div to avoid style bleed.

## Gotchas
- `TimezoneList.js` (data) and `TimezoneList.jsx` (component) share a stem. Always use explicit extensions in imports to avoid ambiguous resolution.
- `index.css` must stay minimal — an earlier version had duplicate body/layout styles that caused a white screen.
