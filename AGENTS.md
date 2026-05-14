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
# outputs: release/Basic Clock-*-universal.pkg (arm64 + x64)
```

## Structure

| File | Purpose |
|---|---|
| `src/App.jsx` | Main app: zone selector, drag-to-reorder, state/localStorage, TZ_ABBR_MAP |
| `src/App.css` | All styles (pastel color palette, animations, zone selector layout) |
| `src/ClockCard.jsx` | Individual timezone card with live time |
| `src/TimezoneList.jsx` | Infinite-scroll timezone sidebar (rAF-driven) |
| `src/TimezoneList.js` | IANA timezone data array |
| `src/index.css` | Base reset only |
| `electron/main.js` | Electron main process — window, menu, lifecycle |
| `vite.config.js` | Vite + React plugin, `base: './'` for Electron |
| `entitlements.mas.plist` | App Sandbox entitlement for MAS |
| `entitlements.mas.inherit.plist` | Inherited entitlements for child processes |
| `icon-src.png` | Source icon (center-crop to square → scale to 1024 → iconutil) |
| `assets/icon.icns` | Generated macOS icon |

## Features

- Select and display multiple timezones simultaneously
- Drag-to-reorder timezone cards
- Pastel color palette cycling across cards
- Live time updates every second
- Timezone search by city name, IANA path, or abbreviation (KST, EST, PST, etc.)
- Space-tolerant search ("new york" matches `America/New_York`)
- Selections persist in localStorage
- Infinite-scroll sidebar showing all IANA timezones
- macOS dark mode support
- Hidden title bar with traffic light integration
- Universal binary (Apple Silicon + Intel)

## App Store Config

- **Bundle ID**: `com.devsky.clock`
- **App name**: Basic Clock
- **Subtitle**: World time, beautifully simple
- **Category**: Utilities
- **Min macOS**: 12.0
- **Arch**: Universal (arm64 + x64)
- **Privacy policy**: https://devsky.org/privacy/clock

## Deploy Protocol

### Code changes
1. Make changes in this repo
2. `npm run build` to verify Vite build succeeds
3. `npm run electron` to test in Electron (check for blank screen, drag, search)
4. Commit and push to GitHub

### App Store release
1. `npm run dist:mas` → produces universal `.pkg` in `release/`
2. Open Transporter, upload the `.pkg`
3. If Transporter rejects: check signing, entitlements, provisioning profile, version bump
4. In App Store Connect: select the build, fill metadata, submit for review

### Sync to devsky
When making changes here, mirror them to `devsky/src/clock/` (scoped CSS with `.clock-page` wrapper).

After changes to privacy pages or firebase.json:
```bash
cd ../devsky && npx firebase deploy --only hosting
```

Privacy pages live at:
- https://devsky.org/privacy/clock

### Version bumping
Bump both in `package.json`:
- `version` field (semver)
- App Store Connect requires unique `CFBundleVersion` per upload — Transporter will reject duplicates

## Gotchas

- **Ambiguous imports**: `TimezoneList.js` (data) and `TimezoneList.jsx` (component) share a stem. Always use explicit extensions.
- **index.css must stay minimal**: duplicate body/layout styles cause white screen.
- **Pastel colors cycle via `timeBox-N` classes** (N % 6). Old `nth-of-type` approach broke with drag wrappers.
- **Electron loads from `dist/`**: must run `npm run build` before `electron .`
- **Vite `base: './'`**: required for Electron. Absolute paths (`/assets/...`) fail on `file://` protocol.
- **Drag bar**: Electron `titleBarStyle: 'hiddenInset'` removes default drag region. The `.drag-bar` div with `-webkit-app-region: drag` restores it. Buttons/inputs inside must have `-webkit-app-region: no-drag`.
- **Timezone abbreviations**: `Intl.DateTimeFormat` returns `GMT+N` for many zones (Asia especially). `TZ_ABBR_MAP` in App.jsx has 80+ manual overrides. When adding new zones, add to the map if Intl returns a generic offset.
- **Search spaces**: User types "new york" but IANA uses underscores. Search converts spaces → underscores before matching IANA strings. Abbreviation search uses original input (no underscores).
- **Zone selector layout**: Single-column list (not grid). Grid caused long names to wrap badly.
- **Universal build**: `--universal` flag in `dist:mas` script. Produces ~2x larger pkg but runs on both Apple Silicon and Intel.
- **Provisioning profile**: Must match bundle ID `com.devsky.clock`. File: `BasicClock_AppStore.provisionprofile` (gitignored).
