---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: ["src/pages"]
---

Scope: the whole app shell (היום, לוח, סטטיסטיקה). Visitor mode: Operate. Native iOS (Ionic iOS mode) structure; HIG wins conflicts.

Job: mark each prayer במניין/ביחידות in one tap right after it, tick למדתי תורה, see the week; fill past days (שבת) from לוח or the banner; read per-prayer patterns in סטטיסטיקה.

Redesign chosen 2026-11-13 on impeccable's decision page, judged on the owner's iPhone SE. It replaces "Three stars" (navy night chart), which proved too dense and too small on the phone. After two hands of new worlds were rejected, the owner pinned the earlier books concept ("The Beit Midrash Shelf", spec decision 14) and picked its dressed, larger form. The picked sketch is `.impeccable/mocks/decision/shelf-dressed.html`.

## Direction contract

THESIS: Every prayer is a sefer on the shelf, and a prayer במניין earns its gold stamp. Refuses the habit-tracker default of green checks, flames and heat grids, and refuses its own first version's small 6pt spines: every mark is large enough to read at arm's length.

OWN-WORLD: One flat leather hue per prayer, fixed on every tab: שחרית bottle green, מוסף plum, מנחה oxblood, ערבית navy, תורה brown. Gold leaf is the במניין state only. Spines 16pt wide: a stamped spine with two gold bands and a gold title block for במניין; a plain bare spine for ביחידות; a plain half-height spine for ק״ש בלבד; a dashed slot for due and not marked. A flat shelf board under every week, a small gilded bar under today. One dark leather band holds the toolbar, the gold large title and the date line, closed by a fine gold double rule. Frank Ruhl Libre for the large title, prayer names and poster numerals; the system sans for the rest. Flat colour, no grain, gradient or shadow. Light and dark follow the phone.

STORY: The owner opens היום after מנחה, sees the dashed slot at the end of מנחה's shelf, taps במניין, and the slot becomes a gold-stamped spine while the streak ticks up.

FIRST VIEWPORT: Leather band with the gear and round הקודם / הבא chevrons, the gold title היום with the holiday chip, and the date line. Below, one list with a row per applicable prayer, about 112pt each: the name at 24pt with place and streak under it, the week's seven spines on a shelf board at the row's end, and under them a full-width 44pt segmented control whose selected במניין takes the prayer's leather with gold lettering. On a four-prayer day only the prayers fill the first screen; the checks, Torah card and השבוע table follow below.

FORM: The sefarim shelf, pinned by the owner over two dealt hands; signature move: the shelf of dressed spines, repeated per prayer on היום, per week in לוח and per period in סטטיסטיקה. Signature interaction: marking במניין stamps today's slot in gold in place; nothing moves under reduce motion. The roll ran (seed:8c46305ce270a843) and dealt two hands, which the owner turned down before pinning the books, so this form is the owner's, not the roll's.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Per-tab structures (picked 2026-11-13, all drawn at 375×667)

- היום: `.impeccable/mocks/decision/shelf-dressed.html`. Only the prayers' controls must be on the first screen (owner's answer; replaces spec 68).
- לוח: week shelves, `.impeccable/mocks/decision/cal-weeks.html`. One card per week, newest on top, a shelf per prayer and for תורה, 38pt day columns.
- סטטיסטיקה: the number and the shelves, `.impeccable/mocks/decision/stats-shelves.html`. The count במניין at 88pt, then a row per prayer with its line of numbers and the period's shelf.
- Appearance: follows the phone's light or dark setting, with a switch in הגדרות to override it (owner's answer; replaces spec 66). Dark sketches: `dark-today.html`, `dark-calendar.html`, `dark-stats.html`.
- App icon: the first, flat shelf icon restored as it was (five spines with gold bands on dark leather), `.impeccable/mocks/decision/icon-flat.html`. The owner picked it on 2026-11-13 over three shaded drawings; it replaces spec 67.
- מוסף has no streak number, as before (spec 5).

## Unresolved decisions

- סטטיסטיקה's other periods (picked 2026-11-13): החודש stands each prayer's month on two boards, `month-boards.html`; כל הזמנים has trend columns under the big number, `alltime-trend.html`.
- The dark versions were confirmed by the owner on 2026-11-13.
- The sketches show a four-prayer day only; the three-prayer day, the reminder rows and the checks, Torah card and השבוע table below the prayers are the build's to lay out.
