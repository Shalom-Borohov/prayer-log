# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

תפילות: a personal, offline-only iPhone PWA for logging each day's prayers (במניין / ביחידות / ק״ש בלבד), Torah learning, תפילין and טלית, with streaks and stats. Hebrew, RTL. There is no server or account: all data lives in IndexedDB on the device, and a JSON backup file can be exported and imported.

## Commands

- `npm run dev`: Vite dev server at `http://localhost:5173/prayer-log/`.
  - The app uses a hash router, so deep links look like `/prayer-log/#/tabs/calendar`.
- `npm test`: the whole Vitest suite (jsdom, `--maxWorkers=25%`).
  - One file: `npx vitest run test/unit/repo.test.ts`
  - One test by name: `npx vitest run test/ui/today.test.tsx -t "marks a prayer"`
- `npm run lint`: oxlint.
- `npm run build`: `tsc -b && vite build`. This is the type check; there is no separate `tsc` script.
  - The build needs a git checkout, because `vite.config.ts` stamps `git rev-parse --short HEAD` and the build time into `__APP_COMMIT__` / `__APP_BUILT_AT__`.

CI (`.github/workflows/ci.yml`) runs lint, test and build on PRs. `deploy.yml` deploys to GitHub Pages on every push to `main`, with base path `/prayer-log/`.

## Sources of truth

- `docs/specs/2026-10-28-prayer-log-design.md`: numbered product decisions and assumptions.
  - New behaviour is added there as a new numbered decision: "(added YYYY-MM-DD, extends/clarifies N)".
  - Check it before changing any status, streak, count or navigation rule.
- `DESIGN.md` and `.impeccable/` (`design.json`, `surfaces/`): the visual system, "The Beit Midrash Shelf". When a visual change alters what they describe, update them too.
- `PRODUCT.md`: product principles. Logging a prayer is one tap, and the app follows native iOS conventions.

## Architecture

The code is split into layers, and imports go downward only: `pages` → `data` / `domain` → `copy`.

- **`src/domain/`**: pure functions over `DayRecord[]`, with no React and no Dexie.
  - Types live in `types.ts`.
  - Streaks, totals, shelves, backfill, places and Hebrew-calendar logic each live in their own module.
  - Holidays come from `@hebcal/core` with the Israel schedule (`hebrewCalendar.ts`).
- **`src/domain/logicalDay.ts`**: day boundaries.
  - A logical day rolls over at 03:00, so ערבית at 00:30 belongs to the previous date.
  - Dates are `'YYYY-MM-DD'` strings everywhere. Convert to `Date` only through `parseIsoDate` / `toIsoDate`, which pin the time to noon so DST can't shift the date.
- **`src/data/`**: the Dexie database `prayer-log`, with a single table `days` keyed by `date`.
  - Every write goes through `updateDay` in `repo.ts`. It normalises the record (places are kept only for prayers marked `minyan`) and deletes the row when `isEmptyDay` says it's empty.
  - Absent keys mean "not marked": optional fields are stored only when they have a value.
  - Pages read through `useAllDays()` (`useLiveQuery`) and derive everything else in render.
- **`src/data/backup.ts`**: a valibot schema for the backup file.
  - The backup format stays `version: 1`. New `DayRecord` fields must be optional so old backups still import; `test/unit/backup.test.ts` has a test for this.
- **`src/pages/<feature>/`**: one folder per tab (today, calendar, stats, settings). Each has its own `copy.ts` and CSS.
  - `DayView` serves both the היום tab and days opened from לוח.
  - Navigating into the future is blocked everywhere (spec decision 7).
- **`src/copy/`** and each page's `copy.ts`: every user-visible string is an `as const` copy constant. Strings with values are functions. Don't inline Hebrew text in components.
- **UI**: Ionic React in iOS mode.
  - Overlays use the hooks (`useIonActionSheet`, `useIonAlert`, `useIonToast`).
  - Styling is plain CSS with tokens in `theme.css`. Gold is reserved for the במניין state.

## Tests

- Tests live in `test/unit` (domain and data) and `test/ui` (pages rendered with `renderAt(path)`).
- Storage isn't mocked: `fake-indexeddb` backs the real Dexie db. Call `resetDb` in `beforeEach`, and assert against `db.days` / `allDays()`.
- Use `freezeDate` (in `test/helpers/clock.ts`) to pin "today". It fakes only `Date`.
- `test/helpers/overlays.ts` drives Ionic action sheets and alerts, and `test/helpers/dayRows.ts` finds and marks prayer rows.
- jsdom has no layout, so check CSS changes in a browser.
