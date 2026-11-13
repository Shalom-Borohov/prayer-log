# Product

<!-- impeccable:product-schema 1 -->

## Platform

ios

## Stack

React + TypeScript + Vite, Ionic React forced to iOS mode, Dexie (IndexedDB), `vite-plugin-pwa`, `@hebcal/core` for the Hebrew calendar. Same stack as the owner's אימונים app (`~/Personal/workout-log`). Hosted on GitHub Pages.

## Users

One person, the owner. They go to shul for שחרית, מנחה and ערבית, learn Torah, and want an honest picture of how consistent they are. They usually log right after each prayer, with the phone out on the way out of shul, and sometimes catch up at night.

## Product Purpose

Log each prayer as במניין or ביחידות (מוסף only on the days it applies), with ק״ש בלבד as a third state for שחרית and ערבית (spec decision 16), plus a daily "למדתי תורה" with an optional note. Success means logging a prayer takes seconds, and weekly/monthly totals, per-prayer streaks and per-prayer stats show the pattern without digging.

## Positioning

Personal, free and Hebrew-first. Built around the owner's own day: the Israel holiday schedule decides when מוסף appears, and the day rolls over at 03:00 so late ערבית lands on the right date. No account; the data stays on the phone.

## Operating Context

Used for a few seconds at a time, usually right after a prayer, one-handed, on the way out of shul. Sometimes used at night to catch up on the day. Not used on שבת or יום טוב; those days are filled in after they end. Installed as an iPhone Home Screen web app and works offline.

## Capabilities and Constraints

- PWA with a native iOS look, hosted on GitHub Pages. No backend; data in IndexedDB on the device, with export/import of a JSON backup file.
- No notifications and no prayer times (זמנים): iOS web push needs a server, and זמנים need a location.
- Hebrew UI, full RTL. Terms: שחרית, מנחה, ערבית, מוסף, במניין, ביחידות, ק״ש בלבד, למדתי תורה, מה למדתי, היום, לוח, סטטיסטיקה, רצף.
- Day = calendar date that rolls over at 03:00. Friday-night ערבית counts as Friday.
- מוסף on שבת, ראש חודש, יום טוב, חול המועד, ראש השנה and יום כיפור, by the Israel schedule.
- Tracking starts on the first day with any record; earlier days never count as missed.

## Brand Commitments

- Name: תפילות. Repo: `prayer-log`.
- Voice: quiet and factual. Numbers and plain labels, no praise and no guilt. It's a private log, not a coach.
- Must look and feel like a native iPhone app.

## Evidence on Hand

- Single-user tool: no testimonials, customers or metrics exist, and none should be invented.

## Product Principles

1. Seconds to log: marking a prayer right after it is one tap.
2. Native, not novel: iOS conventions over custom ones.
3. The pattern at a glance: which prayers hold and which slip is visible without digging.
4. Private by default: nothing leaves the device unless the owner exports it.

## Accessibility & Inclusion

Touch targets of at least 44pt for one-handed use; light or dark follows the phone unless הגדרות fixes it (spec decision 79), and text follows the phone's text size. Nothing read while marking is under 15pt, and nothing at all under 13pt except tab labels (spec decision 81). A mark's state shows by the shape of its spine, never by colour alone.
