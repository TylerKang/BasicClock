# BasicClock

A multi-timezone clock display with pastel gradients, drag-to-reorder, and an infinite-scroll timezone list.

## Features

- **Variable clock cards** — select any number of timezones (min 1) from the full IANA list
- **Drag to reorder** — rearrange cards by dragging, order persists to localStorage
- **Searchable timezone selector** — filter 350+ timezones, selected zones float to top
- **Infinite scroll list** — all world timezones with live times, smooth rAF-driven scroll
- **Pastel gradients** — 6 cycling colors with animated gradient shifts
- **Responsive** — adapts to desktop and mobile layouts
- **Defaults** — Seoul, Tokyo, Los Angeles pre-selected on first visit

## Development

```bash
cd basic-clock-app
npm install
npm run dev       # Vite dev server at http://localhost:5173
```

## Build

```bash
npm run build     # output in dist/
npm run preview   # preview production build
```

## Deployed

This app is also deployed as part of [devsky](https://github.com/TylerKang/devsky) at the `/clock` route on Firebase Hosting.

## Project Structure

```
basic-clock-app/
  src/
    App.jsx           # Main app — zone selector, drag reorder, routing
    App.css           # All styles
    ClockCard.jsx     # Individual timezone card component
    TimezoneList.jsx  # Scrolling timezone list with rAF animation
    TimezoneList.js   # IANA timezone data array
    main.jsx          # React entry point
    index.css         # Base reset
  vite.config.js      # Vite + React plugin
  index.html          # HTML shell
```
