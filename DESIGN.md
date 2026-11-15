---
name: תפילות
description: A private Hebrew prayer log where every day is a spine on the beit midrash shelf.
colors:
  gold-primary: "#8a5a12"
  gold-primary-dark: "#d9ae4e"
  gold-leaf: "#e2c27a"
  gold-stamp: "#a87a1f"
  gold-stamp-dark: "#d9ae4e"
  leather-band: "#2b2320"
  leather-band-dark: "#1f1916"
  leather-plain-dark: "#806a5b"
  leather-band-text: "#e8d7ad"
  on-leather: "#ffffff"
  leather-shacharit: "#1f4d3a"
  leather-shacharit-dark: "#3e7a5e"
  leather-shacharit-ink-dark: "#8fc4ab"
  leather-musaf: "#5b3a6b"
  leather-musaf-dark: "#8a63a0"
  leather-musaf-ink-dark: "#c9a6dc"
  leather-mincha: "#7a2430"
  leather-mincha-dark: "#b04a57"
  leather-mincha-ink-dark: "#e69aa3"
  leather-maariv: "#1e3355"
  leather-maariv-dark: "#4a6a9e"
  leather-maariv-ink-dark: "#a3b9e2"
  leather-torah: "#6b4423"
  leather-torah-dark: "#a0703f"
  grouped-ground: "#f0e9dc"
  grouped-ground-dark: "#000000"
  cell: "#fffcf6"
  cell-dark: "#1d1a17"
  modal-cell-dark: "#2b2723"
  tab-bar: "#f8f3ea"
  tab-bar-dark: "#15120f"
  label: "#000000"
  label-dark: "#ffffff"
  label-secondary: "rgba(60, 60, 67, 0.75)"
  label-secondary-dark: "rgba(235, 235, 245, 0.6)"
  label-tertiary: "rgba(60, 60, 67, 0.3)"
  label-tertiary-dark: "rgba(235, 235, 245, 0.3)"
  separator: "rgba(90, 70, 40, 0.22)"
  separator-dark: "rgba(130, 112, 92, 0.5)"
  choice-outline-neutral: "rgba(70, 55, 35, 0.32)"
  choice-outline-neutral-dark: "rgba(235, 225, 210, 0.28)"
  fill: "rgba(118, 118, 128, 0.12)"
  fill-dark: "rgba(118, 118, 128, 0.24)"
typography:
  title:
    fontFamily: "'Frank Ruhl Libre', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', 'Arial Hebrew', sans-serif"
    fontSize: "17px"
    fontWeight: 700
  row-title:
    fontFamily: "'Frank Ruhl Libre', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', 'Arial Hebrew', sans-serif"
    fontSize: "calc(21rem / 17)"
    fontWeight: 700
    lineHeight: "1.5rem"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', 'Arial Hebrew', sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    fontFeature: "tnum"
  subhead:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', 'Arial Hebrew', sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.4
  footnote:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', 'Arial Hebrew', sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.35
  caption:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', 'Arial Hebrew', sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.2
rounded:
  spine: "1.5px"
  spine-small: "1px"
  cell: "8px"
  group: "14px"
  capsule: "20px"
  circle: "50%"
spacing:
  hairline-gap: "2px"
  spine-gap: "3px"
  xs: "4px"
  sm: "8px"
  row: "12px"
  md: "16px"
  heading: "20px"
  label-inset: "32px"
components:
  leather-shell:
    backgroundColor: "{colors.leather-band}"
    textColor: "{colors.gold-leaf}"
    typography: "{typography.title}"
  date-line:
    backgroundColor: "{colors.leather-band}"
    textColor: "{colors.leather-band-text}"
    typography: "{typography.subhead}"
    padding: "0 20px 14px"
  inset-group:
    backgroundColor: "{colors.cell}"
    rounded: "{rounded.group}"
  prayer-row:
    backgroundColor: "{colors.cell}"
    typography: "{typography.row-title}"
    padding: "12px 16px 14px"
  attendance-button:
    textColor: "{colors.leather-shacharit}"
    typography: "{typography.subhead}"
    rounded: "{rounded.capsule}"
    height: "40px"
  attendance-button-minyan-selected:
    backgroundColor: "{colors.leather-shacharit}"
    textColor: "{colors.gold-leaf}"
    rounded: "{rounded.capsule}"
    height: "40px"
  attendance-button-alone-selected:
    backgroundColor: "{colors.leather-shacharit}"
    textColor: "{colors.on-leather}"
    rounded: "{rounded.capsule}"
    height: "40px"
  choice-switch-button:
    textColor: "{colors.label}"
    typography: "{typography.subhead}"
    rounded: "{rounded.capsule}"
    height: "40px"
  choice-switch-button-selected:
    backgroundColor: "{colors.leather-band}"
    textColor: "{colors.on-leather}"
    rounded: "{rounded.capsule}"
    height: "40px"
  torah-check:
    size: "44px"
    rounded: "{rounded.circle}"
  torah-check-on:
    backgroundColor: "{colors.leather-torah}"
    textColor: "{colors.gold-leaf}"
    rounded: "{rounded.circle}"
  spine:
    backgroundColor: "{colors.leather-shacharit}"
    rounded: "{rounded.spine}"
    width: "6px"
    height: "22px"
  spine-month-cell:
    rounded: "{rounded.spine-small}"
    width: "4px"
    height: "14px"
  spine-table-key:
    rounded: "{rounded.spine-small}"
    width: "5px"
    height: "18px"
  ruled-table:
    backgroundColor: "{colors.cell}"
    typography: "{typography.body}"
    rounded: "{rounded.group}"
    padding: "11px 16px"
  month-grid:
    backgroundColor: "{colors.cell}"
    rounded: "{rounded.group}"
    padding: "10px 8px 12px"
  month-day:
    textColor: "{colors.label}"
    rounded: "{rounded.cell}"
    height: "62px"
    padding: "2px 0 4px"
  worn-mark-tefillin:
    backgroundColor: "{colors.leather-shacharit}"
    rounded: "{rounded.spine-small}"
    width: "5px"
    height: "5px"
  worn-mark-tallit:
    backgroundColor: "{colors.leather-shacharit}"
    rounded: "{rounded.spine-small}"
    width: "9px"
    height: "3px"
  month-day-today:
    backgroundColor: "{colors.leather-band}"
    textColor: "{colors.gold-leaf}"
    rounded: "{rounded.circle}"
    size: "30px"
  backfill-row:
    backgroundColor: "{colors.cell}"
    textColor: "{colors.gold-primary}"
    typography: "{typography.body}"
---

# Design System: תפילות

## Overview

**Creative North Star: "The Beit Midrash Shelf"**

Every day is a spine on a shelf of sefarim, and a prayer במניין earns its gold stamp. The system is a native iOS app first: Ionic in forced iOS mode, the system font for every word but the titles, a warm paper ground with cream inset groups, a bottom tab bar, titles in the toolbar, full RTL. On top of that native frame sit three borrowed materials: a dark leather band that holds the title and the date line; a set of flat leather hues, one per prayer, with gold leaf as the only "done" mark; and one book face, Frank Ruhl Libre bold, that sets the screen titles and the row names on היום like the title page of a sefer.

The shelf is the one signature and it repeats at every scale: a 7-day mini shelf at the trailing edge of each row on היום, a row of tiny spines under each day number in לוח, and full-period shelves per prayer in סטטיסטיקה. A slot is always one of five states (gold, bare leather, short bare leather for ק״ש בלבד, empty dashed, nothing), stamped in place; rows never move and nothing reflows.

Density is Operate-mode: one tap per prayer, one-handed, seconds at a time. Numbers live in hairline-ruled tables with tabular figures, not in card stacks. The one chart is the trend columns on סטטיסטיקה, built from the same materials: gold, bare leather and the dashed empty outline. Everything is flat colour; nothing casts a shadow. The only box-shadows are inset lines: the bands that paint gold onto a spine, the 1px outlines of the choice buttons and the ring of an unchecked round check.

**Key Characteristics:**
- Native iOS skeleton (paper ground, cream inset groups, toolbar title, tab bar) with a dark leather shell band.
- One fixed leather hue per prayer, identical on every tab.
- Gold leaf is the only completion mark; bare leather means prayed ביחידות; a dashed empty slot means unmarked.
- The shelf repeats at three sizes as the system's single signature.
- Frank Ruhl Libre bold for titles and row names only; the system font everywhere else.
- Flat colour only: no grain, texture or gradient.

## Colors

A warm paper ground carrying five flat leather hues and one gold, with a dark leather band as the shell.

### Primary
- **Gold Leaf** (gold-leaf): the shell's voice. Large and small titles, toolbar buttons and the holiday line on the leather band, the text of a picked במניין button, the checkmark in the Torah check, and today's number in the month grid. Same value in both modes because it always sits on dark leather.
- **Gilded Ink** (gold-primary, gold-primary-dark): Ionic's primary. Tab bar selection, focus rings, the backfill banner text, holiday Hebrew dates in the month grid, text selection tint. Darker in light mode for contrast on cream; brighter gold in dark mode.
- **Stamp Gold** (gold-stamp, gold-stamp-dark): the bands painted onto a gold spine. Darker in light mode, brighter in dark mode.

### Secondary: the leathers
Each prayer owns one hue, applied through a hue class that sets a display hue (`--hue`, lightened in dark mode), a deep hue (`--hue-deep`, the light-mode value in both modes) and an ink hue (`--hue-ink`, the deep hue in light mode and a light tint of it in dark mode).
- **Bottle Green**: שחרית (leather-shacharit / leather-shacharit-dark / leather-shacharit-ink-dark).
- **Plum**: מוסף (leather-musaf / leather-musaf-dark / leather-musaf-ink-dark).
- **Oxblood**: מנחה (leather-mincha / leather-mincha-dark / leather-mincha-ink-dark).
- **Navy**: ערבית (leather-maariv / leather-maariv-dark / leather-maariv-ink-dark).
- **Brown**: תורה (leather-torah / leather-torah-dark).

Spines use the display hue, so they lift in dark mode to stay visible on black. Filled controls (a picked attendance button, the checked Torah circle) use the deep hue in both modes so gold-leaf and white text keep their contrast. An unpicked attendance button is drawn in its prayer's leather: a 1px outline of the display hue mixed toward transparent (40% of the hue in light mode, 70% in dark) around a label in the ink hue, which lightens in dark mode to read on the warm dark cell.

### Neutral
- **Shell Leather** (leather-band, leather-band-dark): one solid block holding the toolbar with its title and, under it, the date (or month) line centred, which scrolls away with the content. It stays leather during iOS page transitions and above the page when it is pulled down. Also the today circle in the month grid.
- **Plain Leather** (leather-band, leather-plain-dark): the ביחידות and ק״ש בלבד fill in the trend columns, and the fill of the picked button in the neutral switches (the period switch, גמרא | משנה, באג | הצעה). It is the shell leather in light mode and a lighter warm leather in dark mode, where the shell leather would vanish into the card (3.35:1 on the dark card). It is not a prayer hue.
- **Parchment Text** (leather-band-text): the date line (weekday · Hebrew date · the week's פרשה · Gregorian) on the band.
- **On-Leather White** (on-leather): the text of a picked ביחידות or ק״ש בלבד button, and of a picked neutral switch button in dark mode. In light mode the picked switch text is the cream cell colour.
- **Paper Ground** (grouped-ground / grouped-ground-dark) and **Cream Cell** (cell / cell-dark): a warm paper ground with cream inset cells in light mode; in dark mode the ground stays black and the cells are a warm dark. Modals in dark mode step to the warm dark cell as their ground and modal-cell-dark for their cells. The installed app's launch background is the paper ground.
- **Tab Bar** (tab-bar / tab-bar-dark): the tab bar's own ground, a lighter paper in light mode and a near-black warm brown in dark mode.
- **Labels** (label, label-secondary, label-tertiary and dark pairs): primary text, secondary text for streak lines, group labels, footers and table column heads; tertiary for disabled future days and the unchecked Torah ring. Secondary is raised to 0.75 alpha in light mode for legibility.
- **Separator** (separator / separator-dark): 0.5px warm brown hairlines between rows and table lines.
- **Choice Outline** (choice-outline-neutral / choice-outline-neutral-dark): the 1px outline of an unpicked button in the neutral switches.
- **Fill** (fill / fill-dark): the pressed state of a month cell and the quiet fill of the recovery screen's buttons.

### Named Rules
**The Fixed Hue Rule.** A prayer's leather is the same on every tab, every table and every shelf. A new surface showing a prayer uses that prayer's hue class, never a new colour.

**The Gold Means Minyan Rule.** On marks, gold appears only as the done state: a spine stamped for a prayer במניין or a day of learning, the gold text of the picked במניין button, the tick of a checked round check, and the במניין share of a trend column. Never use gold to decorate a neutral or partial state. The shell, the stats tables' hue key and the accents listed under Colors are outside this rule.

**The Deep Fill Rule.** Anything filled behind gold-leaf or white text takes `--hue-deep`, which does not lighten in dark mode. Only spines and outlines take the lightened `--hue`; only unpicked labels take `--hue-ink`.

## Typography

**Display Font:** Frank Ruhl Libre 700 (bundled with the app, Hebrew subset only, falling back to the system stack for anything outside it)
**Body Font:** SF (system: -apple-system, SF Pro Text, with Helvetica Neue and Arial Hebrew fallbacks)
**Label/Mono Font:** none distinct; figures use tabular numerals app-wide.

**Character:** A book face for the names and the iPhone's own face for everything else. Frank Ruhl Libre, a classic Hebrew book serif, sets the titles and the prayer names like a sefer's title page; every word a user reads or taps beyond those stays native, so the app still reads as part of the phone.

### Hierarchy
- **Title** (Frank Ruhl Libre 700, Ionic's iOS toolbar title size, gold leaf on leather): screen titles היום, לוח, סטטיסטיקה, or the weekday for a past day, centred in the toolbar. There are no large titles. Every title in a leather header takes the same face, in the toolbar and on sheets (לימוד, דיווח, מה חדש), including the copy Ionic animates during a page transition.
- **Row Title** (Frank Ruhl Libre 700, calc(21rem / 17), which is 21pt at the iPhone's default Text Size, line-height 1.5rem): the prayer names and תורה in day rows on היום.
- **Body** (400 for row headers, 600 for values, 1.0625rem): ruled table cells, list items, month day numbers (500; 700 for today).
- **Subhead** (400–600, 0.9375rem, line-height 1.4): the date line, attendance and switch button labels (500, 600 when picked), the Torah note field, shelf-row labels, empty-state body.
- **Footnote** (400, 0.8125rem): streak lines, group labels above inset groups and tables, table column heads, list footers.
- **Caption** (0.6875rem): weekday initials (600) and Hebrew day letters in the month grid, tab bar labels.

### Named Rules
**The Title Page Rule.** Frank Ruhl Libre 700 sets only titles in a leather header and the row names on היום (`--title-face`). Every other word is SF at iOS text-style sizes. Labels above groups are sentence-case footnote in secondary label colour; no uppercase, no tracking.

**The Tabular Rule.** Every number renders with tabular figures (set on body) so counts line up in tables and never jitter when they change.

## Layout

Single column, phone-first, RTL. Content sits on the paper ground in inset groups and tables with 16px side margins and 14px corners; group labels hang 32px in from the edge, 22px above and 6px below. The leather band spans full width at the top and carries the date line, centred, with 20px side padding.

Day rows are 12px/16px/14px padded with a 44px minimum top line: title and streak line on the leading side (at a streak of 0 the line is empty but keeps its height, so the title never moves), the mini shelf on the trailing side, then a full-width row of attendance buttons 10px below. Every interactive target is at least 44px, except that month cells can be about 43px wide on the narrowest phones, because seven must fit across. Where a control looks smaller, an invisible layer carries the tap area to 44px: the attendance buttons are 40px tall in a row with 2px above and below, and each one's tap layer reaches 2px past its top and bottom and 4px into the 8px gap on either side, so a tap anywhere across the row counts.

The month grid is seven equal columns with 4px gaps inside one 14px-cornered cell, 8–12px inner padding, each day at least 62px tall. Statistics stack: period switch (השבוע, החודש, כל הזמנים; separate 40px capsule buttons with 8px gaps and subhead labels, the same form as the attendance control, as are the גמרא | משנה and באג / הצעה switches), trend columns, per-prayer table, Torah table, תפילין וטלית table, period shelves (not on כל הזמנים), streaks table, top to bottom with 24px between tables.

Spacing steps observed: 2, 3, 4, 8, 12, 16, 20, 32px.

## Elevation & Depth

Flat. Depth comes from the grouped model (cream cells on a paper or black ground) and from the dark leather band above the content, not from shadows.

### Shadow Vocabulary
- **Gold bands** (`box-shadow: inset 0 4px 0 var(--gold), inset 0 -4px 0 var(--gold)`; 3px bands on the small spines): not elevation. This is how the gold stamp is painted onto a spine's head and foot.
- **Choice outline** (`box-shadow: inset 0 0 0 1px …`): not elevation. The 1px outline of an attendance or switch button, drawn inside so a picked button keeps its size.
- **Ring** (`box-shadow: inset 0 0 0 1.5px var(--app-label-tertiary)`): the unchecked Torah circle.

### Named Rules
**The Flat Leather Rule.** Leather and gold are flat fills. No grain, texture, noise, gradient or sheen on the band, the spines or anything else.

## Shapes

Small, square-shouldered marks inside softly rounded containers. Spines are narrow upright rectangles with barely softened corners (1.5px, or 1px at the small sizes). Containers are 14px for inset groups, tables, the month grid and Ionic inset lists, and 8px for month cells. Choice buttons (the attendance control and the neutral switches) are 40px capsules with fully rounded ends. Two round forms exist: the 26px Torah check circle and the 30px today circle. The smallest forms are the 5px תפילין square and the 9×3px טלית bar in the month grid. Hairlines are 0.5px. The only dashed line in the system is the empty spine slot.

## Components

### Shelf (signature)
A row of spines standing on a common baseline, one per day, oldest to newest in reading order.
- **Sizes:** day row 6×22px with 3px gaps and 4px gold bands; month cell 4×14px with 2px gaps and 3px bands; stats table key 5×18px with 3px bands. Period shelves on סטטיסטיקה use the day-row size and wrap with 4px row gaps.
- **States:** *gold*: leather spine with gold bands at head and foot (במניין, or a day of learning); *plain*: bare leather (ביחידות); *short*: bare leather at half height on the same baseline (ק״ש בלבד, said instead of the prayer); *empty*: transparent with a 1px dashed secondary-label outline (tracked but unmarked); *none*: an invisible slot (before tracking began). Future days in the month grid hide their spines.
- **Stamp motion:** when the newest slot turns gold on היום, its bands grow in from zero (220ms, cubic-bezier(0.16, 1, 0.3, 1)). Nothing else moves. Disabled under reduced motion.
- **Accessibility:** the shelf is one image with a label like "5 מתוך 7 הימים האחרונים במניין". The count leaves out *none* slots, and a shelf with only *none* slots reads "עוד אין נתונים", as does a trend chart with no column to speak.

### Attendance control
Separate capsule buttons in the prayer's leather, sharing the row width equally: במניין | ביחידות | ק״ש בלבד on שחרית and ערבית, במניין | ביחידות on מנחה and מוסף (they have no קריאת שמע).
- **Row:** no track; 8px gaps between buttons.
- **Buttons:** 40px tall with fully rounded ends, subhead 500, transparent, a 1px inside outline in the prayer's hue (40% light, 70% dark) and the label in the prayer's ink hue.
- **Picked במניין:** the prayer's deep leather with gold-leaf text at 600 and a 1px outline in the display hue.
- **Picked ביחידות or ק״ש בלבד:** the same deep leather and outline with white text at 600. Only במניין takes gold.
- **States:** tapping the picked button clears it. Pressed scales to 0.97; colour and outline transitions run 160ms ease-out; 2px gilded focus ring offset 2px. Reduced motion removes both. No shadow at any state.

### Neutral switches
The period switch on סטטיסטיקה, גמרא | משנה in the learning sheet and באג | הצעה in the feedback sheet: Ionic segments drawn in the attendance control's form. No track; 8px gaps; 40px capsules with a 1px choice outline and label text at 500. The picked one fills with the plain leather, its text white, at 600. No hue and no gold.

### Place (בית כנסת)
While a prayer is במניין with a place, the place name follows the prayer name on the title line. It uses subhead size in secondary label colour, never gold, and truncates with an ellipsis. It is a 44px target with negative margins, so the row never grows. Tapping it opens a native action sheet:
- places used before, with the current one selected;
- מקום חדש… (opens an alert with a text field);
- ללא מקום (destructive);
- ביטול.

The same sheet opens by itself whenever a prayer is marked במניין with no remembered place, until one is chosen.

### Round checks (Torah, תפילין, טלית)
One shared form: a 26px circle inside a 44px target. Off: a 1.5px tertiary ring. On: the row's deep hue with a gold-leaf checkmark. The Torah check leads the Torah row, followed by title, streak line and mini shelf, with the learning entries and hints beneath it and then the borderless "הערה…" note line; תפילין and טלית sit side by side under the שחרית control, each circle followed by its label, the whole pair tappable. תפילין is absent on שבת, יום טוב and חול המועד.

### Learning entries and hints
Under the Torah row's top line, each saved entry is a 44px row in label colour, such as "גמרא · שבת דף י״ב", starting in the title's column and ending in a tertiary ›; it opens the learning sheet on that entry. On a day missing them, the latest earlier day's entries follow as hint rows: the place in secondary label colour after an empty 1.5px tertiary ring, the unticked Torah circle in the check's column. Hints are never gold and never dashed, and they read "בפעם הקודמת: …" to VoiceOver, so nothing unsaved looks saved. The "הערה…" note line ends in a 44px "+" in the primary ink of הקודם and הבא that adds an entry, so adding costs no extra row.

### Learning sheet
A half-height sheet (draggable to full) with a leather header: ביטול, the title לימוד, and שמירה. Below it, the neutral switch גמרא | משנה, then an inline iOS wheel picker with the מסכת column at the start (right) and the דף or פרק column after it, in Hebrew numerals. Ionic lays picker columns out left to right, so the picker reverses them for RTL. When editing, a destructive "מחיקת הלימוד" row sits in an inset group under the wheels.

### מה למדתי list
A page under סטטיסטיקה, entered from a disclosure row "מה למדתי" at the bottom of the תורה table. A native search field sits at the top, then one inset list of days, newest first. Each row starts with a footnote date line in secondary colour (weekday · Hebrew date with year · Gregorian date), then each entry in body text, then the note in secondary subhead. Text wraps rather than truncates. No counts appear on the page. With no match, one centred secondary line says so.

### Ruled tables
Hairline-ruled data tables in place of cards: cell background, 14px corners, 16px side margins, 11px×16px cell padding, 0.5px separators, no line under the last row. Row headers are start-aligned at 400; values are end-aligned at 600. Stats tables add footnote column heads in secondary colour, centre their numeric columns under those heads, and put a small gold-banded spine as the hue key before each prayer name. A cell that cannot apply (ק״ש for מנחה or מוסף) shows an en dash.

### Inset groups
iOS inset grouped lists: 16px margin, 14px corners, cell background, rows separated by 0.5px hairlines. Used for day rows, the Torah row, period shelves and Ionic inset lists (backfill banner, holiday list, settings, the מה למדתי list).

### Month grid cells
Buttons in a seven-column grid: Gregorian number (body 500, centred in a 30px box), Hebrew day letter (caption, secondary), then the day's spines, one per applicable prayer plus Torah, then a 5px line for תפילין and טלית. That line holds a 5px square for תפילין and a 9×3px bar for טלית, in the שחרית hue and in the same order as their checks. They are not shelf slots: an item that isn't marked leaves its place blank, with no dashed outline and no gold. Last comes a caption line (secondary, centred) that holds the week's פרשה on שבת. It wraps only at a space or a maqaf, and every other cell keeps it empty, so all rows stay level and only a row with a wrapped name grows. Today's number sits in a 30px leather circle with gold-leaf bold text. Holidays turn the Hebrew letter gilded and bold. Future days are disabled and tertiary with spines and marks hidden. Pressed shows the fill colour; focus is an inset 2px gilded ring. A cell's accessible name starts with what it shows, as in "1 כ״א בחשון, יום ראשון: לא סומן", and on שבת it adds the פרשה: "31 כ׳ בחשון, שבת פרשת וירא: לא סומן".

### Backfill banner
An inset list at the top of היום (today only) with one disclosure row per day that needs filling, such as an unmarked day or a blank Friday-night ערבית. Label text is gilded; rows navigate to that day. When a backup is due, a last row without a disclosure chevron opens the share sheet. Absent when nothing needs filling and no backup is due.

### Navigation
Native iOS: bottom tab bar (היום, לוח, סטטיסטיקה) with outline icons and 11px labels, selected in gilded ink. Toolbar on leather with a back button to לוח on days opened from לוח, to מה למדתי on days opened from that list, and to סטטיסטיקה on the list itself, and a settings gear at the end of the toolbar on every page but הגדרות. הגדרות opens inside the current tab, with a back button named for the tab. The title always sits in the toolbar; there are no large titles. Toolbar buttons keep Ionic's size, and an invisible centred layer carries each tap area to at least 44×44px. Icons beside a label are hidden from screen readers.

A horizontal swipe on the content steps the day (היום and days opened from לוח or מה למדתי) or the month (לוח): drag left for הקודם, right for הבא. There is no bar for them. Previous and next buttons stay for VoiceOver and the keyboard but aren't drawn; while one has focus, their row shows above the tab bar: item-background ground with the iOS hairline top rule, "› הקודם" at the start and "הבא ‹" at the end in the primary ink. Next is disabled on today and on the current month.

Only the content under the date line follows the finger; the leather band and the tab bar stay put. A committed swipe slides the content off (180ms ease-out) and the new day or month in from the other side; a short drag springs back, and a drag toward the future moves at a fifth of the finger's distance before springing back. Reduce motion drops the slides.

The leather reaches the top of the screen. The page background is leather, and in the installed app a flat 12px leather strip is pinned to the top edge, so iOS 26 draws the status bar in leather rather than fading it. The strip takes pointer events: with `pointer-events: none`, Safari skips it and hazes the top of the header.

### Backup group
The first inset group on הגדרות, under the label "גיבוי": ייצוא גיבוי and ייבוא גיבוי, and for 7 days after an import a third row, ביטול הייבוא האחרון (after an undo, החזרת הייבוא). Each row is disclosure-free with an outline icon in the primary ink at the start; the undo and redo arrows mirror in RTL. Under the group, list footers give the last backup time and, while the undo row shows, "אפשר לבטל עד …" or "אפשר להחזיר עד …". The import and undo alerts keep Ionic's iOS look, with their comparison lines (בקובץ / בטלפון, יחזרו / עכשיו) as separate lines of the message. No gold.

### History export row
A "היסטוריה" group on הגדרות, right after גיבוי: one disclosure-free "ייצוא היסטוריה" row with a document icon, and a footnote saying it is a text file for reading and not a backup.

### Feedback sheet
A "דיווח על באג / הצעה" disclosure-free row in its own inset group on הגדרות, above the version line. It opens a full-screen modal with a leather header: ביטול, the title דיווח, and the neutral switch באג / הצעה. Below it are an inset "תיאור" text area, a footnote saying what is sent, and a full-width "פתיחה ב-GitHub" button that stays disabled until there is text. Tapping the button leaves the sheet open and changes ביטול to סגירה. Under the footnote, in the same style, a note appears when the report is too long for the link, and another after the first tap.

### Version row and what's new sheet
The version line "גרסה X · עודכנה …" is the last row on הגדרות, a disclosure row in its own inset group. It opens "מה חדש", a half-height sheet (it can be dragged to full height) with a leather header, the title מה חדש and סגירה at the end. Each release is an inset group headed "גרסה X", with "חדש" and "תיקונים" items holding bulleted lines. The same sheet opens by itself once after an update, with only the releases not seen yet.

### Update bar
When a new version is waiting, a flat bar sits directly above the tab bar on every tab: an item-background ground with a hairline top rule, a grey × (לא עכשיו) at the start, the label "גרסה חדשה זמינה", and a small round filled "עדכון" button in the primary ink at the end. Both buttons have a 44px tap area; the pill stays small. No gold.

### Recovery screen
When a page can't draw, a plain full-screen page replaces the whole app, with no Ionic, no leather header and no tab bar: the page background, the title "משהו השתבש" (28px, 700), a line of body text, a full-width filled "ייצוא גיבוי" button in the primary ink, any export message, a full-width "ייבוא גיבוי" button on the quiet fill, and a full-width "טעינה מחדש" button on the quiet fill. A chosen file replaces "ייבוא גיבוי" with its warning line, a line each for what the file and the phone hold, "ייבוא" in the destructive red on the quiet fill, and "ביטול". An import failure is a line of body text above the import buttons. While a new version is waiting, the line "גרסה חדשה זמינה" sits above the last button, which reads "עדכון". All buttons are at least 44px tall with a 10px radius. No gold.

## Do's and Don'ts

### Do:
- **Do** show a prayer's state as a mark in a fixed slot: gold spine, bare leather, or empty dashed slot.
- **Do** reuse the shelf when a new surface shows a prayer over time, at one of the three established sizes.
- **Do** put anything filled behind gold-leaf text on `--hue-deep` so it holds contrast in dark mode.
- **Do** present numbers in hairline-ruled tables with tabular figures, row header leading and value trailing at 600.
- **Do** stamp in place: a change animates only the slot that changed, and rows never move or reflow.
- **Do** keep every touch target at least 44px and honour reduced motion.

### Don't:
- **Don't** add grain, texture, noise or gradients to the leather or gold; both are flat fills.
- **Don't** mark a row's prayer with a coloured border along the row edge; hue lives in spines, the attendance buttons and the table key.
- **Don't** use the habit-tracker idiom of green checkmarks, flames or heat grids for completion; completion is the gold spine. (The native checkbox in the Torah check is an input, not a completion badge.)
- **Don't** give a prayer a colour other than its leather, or let one leather stand in for another.
- **Don't** stack statistics into cards, or add charts beyond the trend columns; use the ruled tables and shelves.
- **Don't** set anything but leather-header titles and the row names on היום in Frank Ruhl Libre, or add a third face or a custom type scale; everything else is SF at iOS text-style sizes.
