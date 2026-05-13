# BasicClock — Agent Harness

Multi-timezone clock app — React + Vite.

## Dev

```bash
npm install && npm run dev    # http://localhost:5173
npm run build                 # output in dist/
```

## Structure

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main app: zone selector, drag-to-reorder, state/localStorage |
| `src/App.css` | All styles (not scoped — standalone app) |
| `src/ClockCard.jsx` | Individual timezone card |
| `src/TimezoneList.jsx` | Infinite-scroll timezone list (rAF-driven) |
| `src/TimezoneList.js` | IANA timezone data array |
| `src/index.css` | Base reset only |
| `vite.config.js` | Vite + React plugin |
| `index.html` | HTML shell |

## Deployed copy

Also lives in [devsky](https://github.com/TylerKang/devsky) at the `/clock` route with scoped CSS (`.clock-page`). The devsky copy renames imports (`App.css` → `Clock.css`, `TimezoneList.js` → `timezoneData.js`) and wraps in a `.clock-page` div to avoid style bleed.

When making changes here, mirror them to `devsky/src/clock/`.

## Gotchas

- **Ambiguous imports**: `TimezoneList.js` (data) and `TimezoneList.jsx` (component) share a stem. Always use explicit extensions in imports to avoid bundler resolution issues.
- **index.css must stay minimal**: an earlier version had duplicate body/layout styles that caused a white screen.
- **Pastel colors cycle via `timeBox-N` classes** (N % 6). The old `nth-of-type` approach broke when drag wrappers were added.
