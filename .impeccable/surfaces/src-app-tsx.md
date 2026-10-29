---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: ["src/pages"]
---

Scope: the whole app shell (היום, לוח, סטטיסטיקה). Visitor mode: Operate. Native iOS (Ionic iOS mode) structure; HIG wins conflicts.

Job: mark each prayer במניין/ביחידות in one tap right after it, tick למדתי תורה, see the week; fill past days (שבת) from לוח or the banner; read per-prayer patterns in סטטיסטיקה.

## Direction contract

THESIS: Every day is a spine on the beit midrash shelf, and a prayer במניין earns its gold stamp. Refuses the habit-tracker default of green checkmarks, a flame and a heat grid.

OWN-WORLD: Flat leather hues, one per prayer and fixed on every tab: שחרית bottle green, מוסף plum, מנחה oxblood, ערבית navy, תורה brown. Gold leaf is the done state (darker gold in light mode for contrast). Shell is one solid dark leather block (toolbar + large title + date line, no transition flash, no scroll fade) with gold title type; content on the system grouped ground; SF for everything. No grain, gradient or texture.

STORY: The owner opens היום, sees today's date in Hebrew and Gregorian, taps במניין under שחרית, and watches that prayer's shelf gain a gold spine and its streak count tick up.

FIRST VIEWPORT: Leather band with gold large title היום and the date line (weekday · Hebrew date · Gregorian, holiday name). Below, an inset group with one row per applicable prayer: name, streak line, 7-day mini shelf at the trailing edge, and a full-width native segmented control במניין | ביחידות (plus ק״ש בלבד on שחרית and ערבית) whose selected במניין segment takes the prayer's leather hue; under שחרית, round תפילין and טלית checks (תפילין hidden on שבת, יום טוב and חול המועד). Then the Torah row (check + note field), then the השבוע ruled table. Tab bar at the bottom.

FORM: Beit Midrash Shelf, candidate 5 of 7 (siddur, wall calendar, zmanim board, tallit, sefarim shelf, Jerusalem stone, parochet). seed:7bcf1fddce3b850e. Raises: flat colour only (zoo map); hue per prayer as data series (acetate manual); state as a mark in a fixed slot: gold spine / bare leather / short bare spine for ק״ש בלבד / empty dashed slot (timetable rack); stats as dense hairline-ruled tables with no card stack (high-density; streaks stay a separate table because they are all-time while the per-prayer table follows the השבוע/החודש switch, and Torah days get their own row so they never sit under במניין); stamps in place, nothing reflows (ticket wallet); rows never move (split-flap). Signature move: the shelf, repeated as the 7-day mini shelf on היום, the per-day spine slots in לוח cells, and full-month shelves per prayer in סטטיסטיקה. No coloured row-edge borders.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
