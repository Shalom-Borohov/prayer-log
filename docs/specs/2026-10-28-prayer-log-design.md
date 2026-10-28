# תפילות — Prayer & Torah Log PWA Design

Personal iPhone PWA for logging each day's prayers (במניין / ביחידות) and Torah learning, with totals, streaks and per-prayer stats. Sibling of אימונים (`~/Projects/workout-log`).

## Decisions (from grilling, 2026-10-28)

1. **Prayers:** שחרית, מנחה, ערבית every day. A מוסף row appears only on days it applies (שבת, ראש חודש, יום טוב, חול המועד, ראש השנה, יום כיפור), by the Israel holiday schedule. No סליחות or נעילה.
2. **Per prayer:** במניין / ביחידות / not marked. Tapping the selected state again clears it.
3. **Counters:** weekly and monthly totals, streaks, and per-prayer stats.
4. **Torah:** a "למדתי תורה" checkbox plus an optional one-line "מה למדתי" note.
5. **Streaks:** a separate streak for each daily prayer (consecutive days במניין), shown next to that prayer on היום, plus a Torah streak (consecutive days with למדתי) on the Torah row. ביחידות or a blank breaks a prayer streak. Today never breaks a streak before the day ends. מוסף has no streak; its counts appear in stats. Stats also show each streak's best ever.
6. **Day boundary:** calendar day, rolling over at 03:00. Logging ערבית at 00:30 lands on the previous day. Friday-night ערבית counts as Friday.
7. **Layout:** three tabs, היום · לוח · סטטיסטיקה. היום has ‹ › to step through past days (never into the future), and any day opens from לוח.
8. **Calendar:** Gregorian month grid with small Hebrew dates and holiday / ראש חודש names. "This month" stats use the Gregorian month.
9. **Backfill banner:** on היום, a row such as "שבת לא מולאה" for each day in the last 7 that has nothing marked at all; tapping it opens that day. Partly filled days count as missed and don't show the banner.
10. **Name:** תפילות. Repo and folder: `prayer-log`.
11. **Voice (impeccable init):** quiet and factual. Numbers and plain labels, no praise and no guilt.
12. **Logging moment (impeccable init):** usually right after each prayer, one-handed; sometimes catching up at night.
13. **Eve ערבית reminder (added 2026-10-28, extends 9):** the banner also lists "ערבית של <day> לא סומנה" for a partly filled day in the last 7 whose next day is שבת or an Israeli יום טוב and whose ערבית is blank, since that ערבית can only be logged after שבת / the חג. Rows are ordered oldest first. Decision 6 is unchanged: that ערבית still belongs to the eve.
14. **Visual world (impeccable, 2026-10-28):** The Beit Midrash Shelf. Each prayer owns a flat leather hue on every tab; gold leaf is the במניין state; a 7-day "shelf" of spines per row (gold-stamped = במניין, bare leather = ביחידות, empty slot = unmarked). Dark leather header band with gold title. Contract: `.impeccable/surfaces/src-app-tsx.md`.
15. **Calendar holiday names (added 2026-10-28, clarifies 8):** religious holidays, ראש חודש, fasts and minor holidays, plus the national days יום השואה, יום הזכרון, יום העצמאות, יום ירושלים and the חרבות ברזל memorial day. Civil observances (יום רבין, יום בן־גוריון, school days, etc.) are left out.

## Assumptions (accepted by the user)

1. Stack: same as אימונים — React 19 + TypeScript + Vite, Ionic React in iOS mode, Dexie with persistent storage, `vite-plugin-pwa`, Vitest + Testing Library + fake-indexeddb, oxlint. Hebrew calendar via `@hebcal/core` (offline, no location).
2. Data: one `DayRecord` per logical date `{ date: 'YYYY-MM-DD', prayers: Partial<Record<Prayer, 'minyan' | 'alone'>>, torah: boolean, torahNote?: string }`. No account, no server. Export/import a JSON backup file from a settings page (gear in the סטטיסטיקה header).
3. Tracking start: stats, streaks and the banner start from the first day with any record. Earlier days are not counted as missed.
4. Totals: the denominator is the applicable prayers on days so far in the period, today included. Weeks start on Sunday.
5. Day header: weekday · Hebrew date · Gregorian date, plus the holiday or ראש חודש name when there is one.
6. No notifications or prayer times (זמנים).
7. Design: impeccable Operate mode + Apple HIG; HIG wins on conflicts. Light/dark follows the phone; Hebrew RTL; 44pt targets.
8. Hosting: public GitHub repo on the personal account, GitHub Pages, deploy on push to `main`; repo creation and pushes only when the user asks.
