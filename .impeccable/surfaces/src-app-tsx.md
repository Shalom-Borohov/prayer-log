---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: ["src/pages"]
---

Scope: the whole app shell (היום, לוח, סטטיסטיקה). Visitor mode: Operate. Native iOS (Ionic iOS mode) structure; HIG wins conflicts.

Job: mark each prayer במניין/ביחידות in one tap right after it, tick למדתי תורה, see the week; fill past days (שבת) from לוח or the banner; read per-prayer patterns in סטטיסטיקה.

Redesign chosen 2026-11-11 on impeccable's decision page. It replaces "The Beit Midrash Shelf" (leather, gold, spines), which the owner found heavy and dated. Nothing visual carries over; behaviour and Hebrew terms stay as the spec says. The picked sketch is `.impeccable/mocks/decision/challenger-star-atlas.html`.

## Direction contract

THESIS: Every prayer is a star and its size is its state; a streak is the line that joins bright stars. Refuses the habit-tracker default of green checks, flames and heat grids, and the Judaica default of leather, parchment and gold.

OWN-WORLD: Deep navy chart ground (#0e1a33) with raised navy cards (#17264a, 22px corners). Chalk white (#f1efe6) for stars, text and the selected segment. Amber (#e8a13a) for annotations: date line, streak numbers, holiday chip, selected tab. Red (#d2513a) only rings today. Frank Ruhl Libre light for large titles, Heebo for everything else, tabular figures. Fixed size ramp: 14px disc במניין or learned, 6px disc ביחידות, 11px hollow ring ק״ש בלבד, a small + for due and unmarked, nothing when not due. Flat: no glow, gradient, texture or decorative stars; every dot is data.

STORY: The owner opens היום after מנחה, sees the week chart with today's column ringed and a + waiting on the מנחה line, taps במניין, and the + becomes a bright star joined to yesterday's by a line.

FIRST VIEWPORT: Toolbar with the gear at its end and round הקודם / הבא chevrons. Serif large title היום with the holiday chip at the far end of its row, then the amber date line. Week chart card: seven day columns right to left, one line per applicable prayer plus תורה, stars on the size ramp, streak lines behind them, today's column inside a red rounded ring. Below it one card with a row per prayer: name, amber streak, state and place in secondary text, and a compact native segmented control at the row's end whose במניין thumb is chalk with navy text. Then the Torah card with its round check. Native tab bar, selected tab amber.

FORM: Star atlas, a catalog challenger (`notation-diagram-systems-star-atlas`) the owner chose over the assigned grounded direction. The world lends type, palette, density and one signature move (size-as-state stars joined by streak lines); navigation and controls stay iOS-standard. Signature interaction: marking במניין grows the + into a star and draws its streak line from the previous day; no motion under reduce motion. seed:68fc52654cfe6937

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Per-tab structures (picked 2026-11-11)

- היום: `.impeccable/mocks/decision/se-compact.html`, drawn at the iPhone SE's 375×667 (spec 68). It is the layout to build: the chart on top with lines 22px apart, then the prayer rows with תפילין and טלית under שחרית, then the Torah card, all on the first screen. `challenger-star-atlas.html` is the first, taller sketch the world was picked from. הקודם / הבא stay in the toolbar (spec 63).
- לוח: week charts, `.impeccable/mocks/decision/calendar-weeks.html` (spec 64). One card per week, newest on top, the same chart as היום. seed:99bc96dd600a854b
- סטטיסטיקה: headline numbers, `.impeccable/mocks/decision/stats-numbers.html` (spec 65). One poster-size number, the period as a line of stars, three figures, a line per prayer. seed:aa63924963133bc3
- Always night: one navy appearance in light and dark mode (spec 66).
- מוסף has no streak number and no joining line, whatever the sketches show (spec 62).
- App icon: the arched window, `.impeccable/mocks/decision/icon-window.html`, with larger stars and a slightly wider arch (spec 67).

## Unresolved decisions

- לוח and סטטיסטיקה were sketched at 390×844 and have not been redrawn for the SE; the build fits them at 375×667 and shows the owner.
- Build-plan defaults the owner has not confirmed: holiday names and Hebrew dates in לוח, the star line on a full month and on כל הזמנים, and where the detail tables sit in סטטיסטיקה.
