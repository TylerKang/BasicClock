# BasicClock — Agent Harness

Aesthetic multi-timezone clock app — React + Vite, packaged as Electron desktop app for macOS.

## Dev

```bash
npm install && npm run dev    # http://localhost:5173
npm run electron              # builds + opens Electron app
```

## Build

### Direct distribution (DMG)
```bash
npm run dist
# outputs: release/Basic Clock-*.dmg
```

### App Store (MAS)
```bash
# requires Apple Distribution cert + provisioning profile
npm run dist:mas
# outputs: release/mas/Basic Clock.app
```

## Structure

| File | Purpose |
|---|---|
| `src/App.jsx` | Main app: zone selector, drag-to-reorder, state/localStorage |
| `src/App.css` | All styles (pastel color palette, animations) |
| `src/ClockCard.jsx` | Individual timezone card with live time |
| `src/TimezoneList.jsx` | Infinite-scroll timezone sidebar (rAF-driven) |
| `src/TimezoneList.js` | IANA timezone data array |
| `src/index.css` | Base reset only |
| `electron/main.js` | Electron main process — window, menu, lifecycle |
| `vite.config.js` | Vite + React plugin |
| `entitlements.mas.plist` | App Sandbox entitlement for MAS |
| `entitlements.mas.inherit.plist` | Inherited entitlements for child processes |

## Features

- Select and display multiple timezones simultaneously
- Drag-to-reorder timezone cards
- Pastel color palette cycling across cards
- Live time updates every second
- Timezone search with instant filtering
- Selections persist in localStorage
- Infinite-scroll sidebar showing all IANA timezones
- macOS dark mode support
- Hidden title bar with traffic light integration

## App Store Config

- **Bundle ID**: `com.devsky.clock`
- **App name**: Basic Clock
- **Category**: Utilities
- **Min macOS**: 12.0
- **Privacy policy**: https://devsky.org/privacy/clock

## Deployed copy

Also lives in [devsky](https://github.com/TylerKang/devsky) at the `/clock` route with scoped CSS (`.clock-page`). The devsky copy renames imports and wraps in a `.clock-page` div to avoid style bleed.

When making changes here, mirror them to `devsky/src/clock/`.

## Gotchas

- **Ambiguous imports**: `TimezoneList.js` (data) and `TimezoneList.jsx` (component) share a stem. Always use explicit extensions.
- **index.css must stay minimal**: duplicate body/layout styles cause white screen.
- **Pastel colors cycle via `timeBox-N` classes** (N % 6). Old `nth-of-type` approach broke with drag wrappers.
- **Electron loads from `dist/`**: must run `npm run build` before `electron .`
