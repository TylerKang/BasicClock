# Basic Clock

An aesthetic background clock app for macOS that displays multiple timezones with a soft pastel color palette and smooth animations. Perfect for remote teams, travelers, or anyone who needs to track time across the world at a glance.

## Features

- **Multi-timezone display** — select and view as many timezones as you need
- **Drag-to-reorder** — arrange clocks in your preferred order
- **Pastel color palette** — six rotating pastel colors for a calm, aesthetic look
- **Live updates** — time refreshes every second
- **Timezone search** — find any IANA timezone instantly
- **Persistent layout** — your selection and order saved automatically
- **Dark mode** — follows macOS system appearance
- **Lightweight** — no background services, no network calls

## Install

### Mac App Store

One-time purchase — no ads, no subscriptions, no data collection.

### Direct Download

Grab the latest `.dmg` from [Releases](https://github.com/TylerKang/BasicClock/releases).

## Build from Source

```bash
npm install
npm run electron    # builds React app + opens Electron
```

### Package as DMG

```bash
npm run dist
# outputs: release/Basic Clock-*.dmg
```

## App Store Listing

**Promotional Text:**
> A beautiful multi-timezone clock for your Mac desktop. One-time purchase — no ads, no subscriptions, no data collection.

**Description:**
> Basic Clock lets you see the time in every timezone that matters to you, all at once. Pick your timezones, drag to reorder, and enjoy a calm, pastel-colored display that updates every second.
>
> Built for simplicity:
> • One-time purchase — yours forever
> • No ads, no in-app purchases, no subscriptions
> • No data collection — runs entirely offline
> • No account required
>
> Features:
> • Display multiple timezones simultaneously
> • Drag-to-reorder your clocks
> • Search all IANA timezones instantly
> • Soft pastel color palette with six rotating colors
> • Dark mode support
> • Selections persist automatically

## Privacy

Basic Clock collects no data. See the full [Privacy Policy](https://devsky.org/privacy/clock).

## License

MIT
