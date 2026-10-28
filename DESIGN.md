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
  leather-band-text: "#e8d7ad"
  leather-shacharit: "#1f4d3a"
  leather-shacharit-dark: "#3e7a5e"
  leather-musaf: "#5b3a6b"
  leather-musaf-dark: "#8a63a0"
  leather-mincha: "#7a2430"
  leather-mincha-dark: "#b04a57"
  leather-maariv: "#1e3355"
  leather-maariv-dark: "#4a6a9e"
  leather-torah: "#6b4423"
  leather-torah-dark: "#a0703f"
  grouped-ground: "#f2f2f7"
  grouped-ground-dark: "#000000"
  cell: "#ffffff"
  cell-dark: "#1c1c1e"
  label: "#000000"
  label-dark: "#ffffff"
  label-secondary: "rgba(60, 60, 67, 0.75)"
  label-secondary-dark: "rgba(235, 235, 245, 0.6)"
  label-tertiary: "rgba(60, 60, 67, 0.3)"
  label-tertiary-dark: "rgba(235, 235, 245, 0.3)"
  separator: "rgba(60, 60, 67, 0.29)"
  separator-dark: "rgba(84, 84, 88, 0.6)"
  fill: "rgba(118, 118, 128, 0.12)"
  fill-dark: "rgba(118, 118, 128, 0.24)"
  raised: "#ffffff"
  raised-dark: "#636366"
typography:
  large-title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', 'Arial Hebrew', sans-serif"
    fontSize: "34px"
    fontWeight: 700
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', 'Arial Hebrew', sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 600
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
  segment-thumb: "7px"
  cell: "8px"
  segment-track: "9px"
  group: "10px"
  pill: "13px"
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
    typography: "{typography.large-title}"
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
    typography: "{typography.headline}"
    padding: "12px 16px 14px"
  attendance-track:
    backgroundColor: "{colors.fill}"
    rounded: "{rounded.segment-track}"
    padding: "2px"
  attendance-segment:
    textColor: "{colors.label}"
    typography: "{typography.subhead}"
    rounded: "{rounded.segment-thumb}"
    height: "40px"
  attendance-segment-minyan-selected:
    backgroundColor: "{colors.leather-shacharit}"
    textColor: "{colors.gold-leaf}"
    rounded: "{rounded.segment-thumb}"
  attendance-segment-alone-selected:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.label}"
    rounded: "{rounded.segment-thumb}"
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
    padding: "5px 0 6px"
  month-day-today:
    backgroundColor: "{colors.leather-band}"
    textColor: "{colors.gold-leaf}"
    rounded: "{rounded.pill}"
    width: "26px"
  backfill-row:
    backgroundColor: "{colors.cell}"
    textColor: "{colors.gold-primary}"
    typography: "{typography.body}"
---

# Design System: תפילות

## Overview

**Creative North Star: "The Beit Midrash Shelf"**

Every day is a spine on a shelf of sefarim, and a prayer במניין earns its gold stamp. The system is a native iOS app first: Ionic in forced iOS mode, SF for every word, the system grouped ground, inset groups, a bottom tab bar, large titles that collapse on scroll, full RTL. On top of that native frame sit exactly two borrowed materials: a dark leather band that holds the large title and the date line, and a set of flat leather hues, one per prayer, with gold leaf as the only "done" mark.

The shelf is the one signature and it repeats at every scale: a 7-day mini shelf at the trailing edge of each row on היום, a row of tiny spines under each day number in לוח, and full-period shelves per prayer in סטטיסטיקה. A slot is always one of four states (gold, bare leather, empty dashed, nothing), stamped in place; rows never move and nothing reflows.

Density is Operate-mode: one tap per prayer, one-handed, seconds at a time. Numbers live in hairline-ruled tables with tabular figures, not in card stacks or charts. Everything is flat colour; the only shadows are the native segmented-control thumb and the inset bands that paint gold onto a spine.

**Key Characteristics:**
- Native iOS skeleton (grouped ground, inset groups, large title, tab bar) with a dark leather shell band.
- One fixed leather hue per prayer, identical on every tab.
- Gold leaf is the only completion mark; bare leather means prayed ביחידות; a dashed empty slot means unmarked.
- The shelf repeats at three sizes as the system's single signature.
- Flat colour only: no grain, texture or gradient.

## Colors

A grouped-iOS neutral ground carrying five flat leather hues and one gold, with a dark leather band as the shell.

### Primary
- **Gold Leaf** (gold-leaf): the shell's voice. Large and small titles, toolbar buttons and the holiday line on the leather band, the text of a selected במניין segment, the checkmark in the Torah check, and today's number in the month grid. Same value in both modes because it always sits on dark leather.
- **Gilded Ink** (gold-primary, gold-primary-dark): Ionic's primary. Tab bar selection, focus rings, the backfill banner text, holiday Hebrew dates in the month grid, text selection tint. Darker in light mode for contrast on white; brighter gold in dark mode.
- **Stamp Gold** (gold-stamp, gold-stamp-dark): the bands painted onto a gold spine. Darker in light mode, brighter in dark mode.

### Secondary: the leathers
Each prayer owns one hue, applied through a hue class that sets both a display hue (`--hue`, lightened in dark mode) and a deep hue (`--hue-deep`, the light-mode value in both modes).
- **Bottle Green**: שחרית (leather-shacharit / leather-shacharit-dark).
- **Plum**: מוסף (leather-musaf / leather-musaf-dark).
- **Oxblood**: מנחה (leather-mincha / leather-mincha-dark).
- **Navy**: ערבית (leather-maariv / leather-maariv-dark).
- **Brown**: תורה (leather-torah / leather-torah-dark).

Spines use the display hue, so they lift in dark mode to stay visible on black. Filled controls (the selected במניין segment, the checked Torah circle) use the deep hue in both modes so gold-leaf text keeps its contrast.

### Neutral
- **Shell Leather** (leather-band, leather-band-dark): the toolbar, the condensed large-title header and the date line beneath it. Also the today pill in the month grid.
- **Parchment Text** (leather-band-text): the date line (weekday · Hebrew date · Gregorian) on the band.
- **Grouped Ground** (grouped-ground / grouped-ground-dark) and **Cell** (cell / cell-dark): the iOS system grouped background and its inset cells. Modals in dark mode step to #1c1c1e ground and #2c2c2e cells.
- **Labels** (label, label-secondary, label-tertiary and dark pairs): primary text, secondary text for streak lines, group labels, footers and table column heads; tertiary for disabled future days and the unchecked Torah ring. Secondary is raised to 0.75 alpha in light mode for legibility.
- **Separator** (separator / separator-dark): 0.5px hairlines between rows and table lines.
- **Fill** (fill / fill-dark) and **Raised** (raised / raised-dark): the segmented-control track and the selected ביחידות thumb; fill is also the pressed state of a month cell.

### Named Rules
**The Fixed Hue Rule.** A prayer's leather is the same on every tab, every table and every shelf. A new surface showing a prayer uses that prayer's hue class, never a new colour.

**The Gold Means Minyan Rule.** Gold appears on data only as the done state: a spine stamped for a prayer במניין or a day of learning, and the gold text of the selected במניין segment. Never use gold to decorate a neutral or partial state.

**The Deep Fill Rule.** Anything filled behind gold-leaf text takes `--hue-deep`, which does not lighten in dark mode. Only spines take the lightened `--hue`.

## Typography

**Display Font:** SF (system: -apple-system, SF Pro Text, with Helvetica Neue and Arial Hebrew fallbacks)
**Body Font:** the same system stack
**Label/Mono Font:** none distinct; figures use tabular numerals app-wide.

**Character:** One family, the iPhone's own. The world is carried by colour and the shelf, not by type; type stays native so the app reads as part of the phone.

### Hierarchy
- **Large Title** (700, Ionic iOS large title, gold leaf on leather): screen titles היום, לוח, סטטיסטיקה, or the weekday for a past day.
- **Headline** (600, 1.0625rem): prayer names in day rows.
- **Body** (400 for row headers, 600 for values, 1.0625rem): ruled table cells, list items, month day numbers (500; 700 for today).
- **Subhead** (400–600, 0.9375rem, line-height 1.4): the date line, attendance segment labels (500, 600 when selected), the Torah note field, shelf-row labels, empty-state body.
- **Footnote** (400, 0.8125rem): streak lines, group labels above inset groups and tables, table column heads, list footers.
- **Caption** (0.6875rem): weekday initials (600) and Hebrew day letters in the month grid, tab bar labels.

### Named Rules
**The Native Type Rule.** SF only, at iOS text-style sizes. Labels above groups are sentence-case footnote in secondary label colour; no uppercase, no tracking, no display face.

**The Tabular Rule.** Every number renders with tabular figures (set on body) so counts line up in tables and never jitter when they change.

## Layout

Single column, phone-first, RTL. Content sits on the grouped ground in inset groups and tables with 16px side margins and 10px corners; group labels hang 32px in from the edge, 22px above and 6px below. The leather band spans full width at the top and carries the date line with 20px side padding.

Day rows are 12px/16px/14px padded with a 44px minimum top line: title and streak line on the leading side, the mini shelf on the trailing side, then a full-width attendance control 10px below. Every interactive target is at least 44px; the attendance segments are 40px inside a 2px-padded track (44px total).

The month grid is seven equal columns with 4px gaps inside one 10px-cornered cell, 8–12px inner padding, each day at least 62px tall. Statistics stack: period switch, per-prayer table, Torah table, period shelves, streaks table, top to bottom with 24px between tables.

Spacing steps observed: 2, 3, 4, 8, 12, 16, 20, 32px.

## Elevation & Depth

Flat. Depth comes from the iOS grouped model (light cells on a grey or black ground) and from the dark leather band above the content, not from shadows.

### Shadow Vocabulary
- **Segment thumb** (`box-shadow: 0 3px 8px rgba(0,0,0,0.12), 0 3px 1px rgba(0,0,0,0.04)`): the selected segment of the attendance control, matching the native iOS segmented-control thumb.
- **Gold bands** (`box-shadow: inset 0 4px 0 var(--gold), inset 0 -4px 0 var(--gold)`; 3px bands on the small spines): not elevation. This is how the gold stamp is painted onto a spine's head and foot.
- **Ring** (`box-shadow: inset 0 0 0 1.5px var(--app-label-tertiary)`): the unchecked Torah circle.

### Named Rules
**The Flat Leather Rule.** Leather and gold are flat fills. No grain, texture, noise, gradient or sheen on the band, the spines or anything else.

## Shapes

Small, square-shouldered forms. Spines are narrow upright rectangles with barely softened corners (1.5px, or 1px at the small sizes). Containers follow iOS: 10px for inset groups, tables and the month grid, 9px/7px for the segmented track and thumb, 8px for month cells. Two round forms exist: the 26px Torah check circle and the 26px-wide, 13px-radius today pill. Hairlines are 0.5px. The only dashed line in the system is the empty spine slot.

## Components

### Shelf (signature)
A row of spines standing on a common baseline, one per day, oldest to newest in reading order.
- **Sizes:** day row 6×22px with 3px gaps and 4px gold bands; month cell 4×14px with 2px gaps and 3px bands; stats table key 5×18px with 3px bands. Period shelves on סטטיסטיקה use the day-row size and wrap with 4px row gaps.
- **States:** *gold*: leather spine with gold bands at head and foot (במניין, or a day of learning); *plain*: bare leather (ביחידות); *empty*: transparent with a 1px dashed secondary-label outline (tracked but unmarked); *none*: an invisible slot (before tracking began). Future days in the month grid hide their spines.
- **Stamp motion:** when the newest slot turns gold on היום, its bands grow in from zero (220ms, cubic-bezier(0.16, 1, 0.3, 1)). Nothing else moves. Disabled under reduced motion.
- **Accessibility:** the shelf is one image with a label like "5 מתוך 7 הימים האחרונים במניין".

### Attendance control (segmented)
A native-styled two-segment control, במניין | ביחידות, full row width.
- **Track:** fill colour, 9px corners, 2px padding, 2px gap.
- **Segments:** 40px tall, 7px corners, subhead 500, transparent at rest.
- **Selected במניין:** the prayer's deep leather with gold-leaf text, weight 600, thumb shadow.
- **Selected ביחידות:** the raised neutral (white / #636366) with label text, thumb shadow.
- **States:** tapping the selected segment clears it. Pressed scales to 0.97; colour transitions run 160ms ease-out; 2px gilded focus ring offset 2px. Reduced motion removes both.

### Torah check
A 44px checkbox target holding a 26px circle. Off: a 1.5px tertiary ring. On: deep brown fill with a gold-leaf checkmark (the native iOS checkbox form). Sits at the leading edge of the Torah row, followed by title, streak line and mini shelf, with a borderless "מה למדתי…" note field beneath.

### Ruled tables
Hairline-ruled data tables in place of cards: cell background, 10px corners, 16px side margins, 11px×16px cell padding, 0.5px separators, no line under the last row. Row headers are start-aligned at 400; values are end-aligned at 600. Stats tables add footnote column heads in secondary colour and a small gold-banded spine as the hue key before each prayer name.

### Inset groups
iOS inset grouped lists: 16px margin, 10px corners, cell background, rows separated by 0.5px hairlines. Used for day rows, the Torah row, period shelves and Ionic inset lists (backfill banner, holiday list, settings).

### Month grid cells
Buttons in a seven-column grid: Gregorian number (body 500), Hebrew day letter (caption, secondary), then the day's spines, one per applicable prayer plus Torah. Today's number sits in a leather pill with gold-leaf bold text. Holidays turn the Hebrew letter gilded and bold. Future days are disabled and tertiary with spines hidden. Pressed shows the fill colour; focus is an inset 2px gilded ring.

### Backfill banner
An inset list at the top of היום (today only) with one disclosure row per day that needs filling, such as an unmarked day or a blank Friday-night ערבית. Label text is gilded; rows navigate to that day. Absent when nothing needs filling.

### Navigation
Native iOS: bottom tab bar (היום, לוח, סטטיסטיקה) with outline icons and 11px labels, selected in gilded ink. Toolbar on leather with gold-leaf chevrons for previous and next day or month, a back button to לוח on past days, and a settings gear on סטטיסטיקה. Large titles collapse into the toolbar on scroll.

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
- **Don't** mark a row's prayer with a coloured border along the row edge; hue lives in spines, the selected segment and the table key.
- **Don't** use the habit-tracker idiom of green checkmarks, flames or heat grids for completion; completion is the gold spine. (The native checkbox in the Torah check is an input, not a completion badge.)
- **Don't** give a prayer a colour other than its leather, or let one leather stand in for another.
- **Don't** stack statistics into cards or charts; use the ruled tables and shelves.
- **Don't** introduce a display face or a custom type scale; SF at iOS text-style sizes only.
