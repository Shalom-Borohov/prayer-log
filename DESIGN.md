---
name: תפילות
description: A private prayer log drawn as a night star chart, where every prayer is a star and its size is its state.
colors:
  night-ground: "#0e1a33"
  night-card: "#17264a"
  night-bar: "#12203d"
  chalk: "#f1efe6"
  amber: "#e8a13a"
  today-ring: "#d2513a"
  label-secondary: "#8f9bbb"
  label-tertiary: "rgba(241, 239, 230, 0.35)"
  separator: "rgba(241, 239, 230, 0.08)"
  fill: "rgba(241, 239, 230, 0.09)"
  divider: "rgba(241, 239, 230, 0.16)"
  quiet-thumb: "rgba(241, 239, 230, 0.2)"
  control-ring: "rgba(241, 239, 230, 0.55)"
  streak-line: "rgba(241, 239, 230, 0.45)"
typography:
  display:
    fontFamily: "Frank Ruhl Libre, Heebo, serif"
    fontSize: "96px"
    fontWeight: 300
    lineHeight: "80px"
    letterSpacing: "-2px"
  headline:
    fontFamily: "Frank Ruhl Libre, Heebo, serif"
    fontSize: "2rem"
    fontWeight: 400
    letterSpacing: "-0.3px"
  figure:
    fontFamily: "Frank Ruhl Libre, Heebo, serif"
    fontSize: "1.875rem"
    fontWeight: 300
    lineHeight: "36px"
  title:
    fontFamily: "Heebo, -apple-system, BlinkMacSystemFont, Arial Hebrew, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 600
    lineHeight: "22px"
  body:
    fontFamily: "Heebo, -apple-system, BlinkMacSystemFont, Arial Hebrew, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.4
    fontFeature: "tnum"
  label:
    fontFamily: "Heebo, -apple-system, BlinkMacSystemFont, Arial Hebrew, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.35
  caption:
    fontFamily: "Heebo, -apple-system, BlinkMacSystemFont, Arial Hebrew, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: "18px"
rounded:
  card: "20px"
  chart-ring: "14px"
  button: "12px"
  field: "10px"
  control: "9px"
  thumb: "7px"
  chip: "11px"
  full: "50%"
spacing:
  chart-row: "22px"
  card-gap: "10px"
  gutter: "16px"
  list-text: "32px"
  tap: "44px"
components:
  card:
    backgroundColor: "{colors.night-card}"
    rounded: "{rounded.card}"
  attendance-control:
    backgroundColor: "{colors.fill}"
    textColor: "{colors.chalk}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "2px"
    height: "34px"
    width: "140px"
  attendance-minyan-selected:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.night-ground}"
    rounded: "{rounded.thumb}"
  attendance-other-selected:
    backgroundColor: "{colors.quiet-thumb}"
    textColor: "{colors.chalk}"
    rounded: "{rounded.thumb}"
  holiday-chip:
    textColor: "{colors.amber}"
    typography: "{typography.caption}"
    rounded: "{rounded.chip}"
    padding: "0 10px"
    height: "22px"
  period-button:
    backgroundColor: "{colors.fill}"
    textColor: "{colors.chalk}"
    rounded: "{rounded.full}"
    size: "32px"
  round-check:
    textColor: "{colors.night-ground}"
    rounded: "{rounded.full}"
    size: "18px"
  round-check-checked:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.night-ground}"
    rounded: "{rounded.full}"
  segment-switch:
    backgroundColor: "{colors.fill}"
    textColor: "{colors.chalk}"
    height: "44px"
  tab-bar:
    backgroundColor: "{colors.night-bar}"
    textColor: "{colors.label-secondary}"
  tab-bar-selected:
    textColor: "{colors.amber}"
  recovery-button-primary:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.night-ground}"
    rounded: "{rounded.button}"
    height: "44px"
---

# Design System: תפילות

## Overview

**Creative North Star: "Three stars"**

The app is a night star chart. Every prayer is a star and its size is its state. A streak is the thin line that joins bright stars on consecutive days. The ground is deep navy, the stars and text are chalk, and nothing on the chart is ornament: every dot is data.

The chart is the one signature. Around it the app stays a plain iOS app in Ionic's iOS mode: large titles, inset grouped lists, native segmented controls, a native tab bar. The world lends the palette, the two typefaces and the size-as-state stars. Navigation and controls stay standard.

The density is set by the iPhone SE (375×667). On היום the chart, every prayer's control, the תפילין and טלית checks and the Torah card's check all fit on the first screen. The app has one appearance. It stays navy whatever the phone is set to.

It refuses the habit-tracker defaults (green checks, flames, heat grids) and the Judaica defaults (leather, parchment, gold).

**Key Characteristics:**
- Always night: one navy appearance, no light theme.
- Size is state: four marks on a fixed ramp, told apart by shape and size, never by colour alone.
- Chalk carries data, amber carries annotations, red rings only today.
- Frank Ruhl Libre for large titles and poster numerals, Heebo for everything else, both self-hosted for offline use.
- Flat colour with no shadows, glows, gradients or texture inside the app.

## Colors

Three voices on navy: chalk for data and text, amber for notes about the data, and one red that marks today.

### Primary
- **Chalk** (chalk): stars, streak lines (at 45%), body text, the selected segment thumb and the checked round check. Anything that is the log itself is chalk.

### Secondary
- **Lamp Amber** (amber): annotations only. The date line under the title, streak numbers ("3 ברצף"), the holiday chip, a holiday's day number and holiday line in לוח, the פרשה in a week card header, the reminder rows above the chart, the add-learning +, the focus outline and the selected tab. It is also Ionic's primary colour, so a primary button is amber with navy text.

### Tertiary
- **Today Red** (today-ring): the 1.5px rounded ring around today's column on a chart and around today's star on the stats line. Nothing else is red.

### Neutral
- **Night Ground** (night-ground): page background, toolbar, the fixed status-bar strip and modals. Also the text on a chalk thumb or amber button.
- **Raised Night** (night-card): every card, inset list and table; also the fill inside a hollow ק״ש בלבד ring.
- **Tab Night** (night-bar): the tab bar only, a step between ground and card.
- **Dusk Grey** (label-secondary): secondary text, chart line labels, column heads, captions, the + of an unmarked prayer, unselected tabs.
- **Faint Chalk** (label-tertiary): the ring around a past shown day, disclosure chevrons.
- **Chalk tints** (separator 8%, fill 9%, divider 16%, quiet-thumb 20%, control-ring 55%): hairlines and chart rules, control troughs and round buttons, the dividers inside the attendance control, a selected ביחידות or ק״ש בלבד thumb, the ring of an unchecked round check.

### Named Rules
**The Red Is Today Rule.** Red rings today and nothing else. A past day the user is looking at gets a faint chalk ring instead.

**The Amber Annotates Rule.** Amber never fills a star or a large surface. It writes notes beside the data: dates, streak counts, holidays, reminders, the selected tab.

**The Every Dot Is Data Rule.** No decorative stars, sparkles or dot patterns. If a dot is on screen it is a prayer or a day.

## Typography

**Display Font:** Frank Ruhl Libre (with Heebo, serif), weights 300 and 400, self-hosted through Fontsource.
**Body Font:** Heebo (with -apple-system, BlinkMacSystemFont, Arial Hebrew, sans-serif), weights 400, 500 and 600, self-hosted through Fontsource.

**Character:** A light Hebrew serif for the few big moments and a clean Hebrew sans for every working line. Figures are tabular across the app, so counts line up in tables and charts.

### Hierarchy
- **Display** (Frank Ruhl Libre 300, 96px, 80px line): the one poster number in סטטיסטיקה, the count במניין for the period.
- **Headline** (Frank Ruhl Libre 400, 2rem): iOS large titles (היום, לוח, סטטיסטיקה). The recovery screen title uses the same face at 30px.
- **Figure** (Frank Ruhl Libre 300, 1.875rem, 36px line): the three secondary figures under the stats star line.
- **Title** (Heebo 600, 1.0625rem, 22px line): prayer names in the היום card, and stats table prayer names. The stats caption "במניין" steps up to 1.375rem.
- **Body** (Heebo 400, 1rem, 1.4): learning entries, notes, segment labels, empty-state text, plain table cells. On iPhone 1rem is iOS Body, 17pt at the default Text Size.
- **Label** (Heebo 400, 0.875rem): the amber date line, group labels, list footers, week card holiday lines, the תפילין and טלית checks, the stats table's streak and best cells (streak at 500). The attendance segment text stays at 0.8125rem (500), close to iOS's 13pt segmented control, so "ק״ש בלבד" fits its third of the control.
- **Caption** (Heebo 500, 0.8125rem, 18px line): streak numbers in the היום card, the holiday chip, state and place lines (at 400), chart labels. The smallest step, 0.6875rem, is kept for the Hebrew day under a week card column and the stats star-line labels, and stays above iOS's 11pt minimum.

### Named Rules
**The Serif Is For Numbers And Titles Rule.** Frank Ruhl Libre appears only in large titles and poster-size numerals. Every row, control and label is Heebo.

## Layout

Screens are laid out for the iPhone SE at 375×667 and simply fill wider phones. There are no breakpoints. Right to left throughout, so a chart's newest day is on the left end.

Cards sit 16px in from the screen edge. Text in grouped lists and their headers and footers starts 32px in, matching iOS inset lists. Week cards in לוח stack with a 10px gap. Every tap target is at least 44pt; small visuals (the 32px period buttons, the 18px round checks, the 34px attendance control) get invisible hit areas that reach 44pt.

The star chart is a grid: a 52px label column on the reading start side, then seven equal day columns. Lines are 22px apart on היום (20px in a week card), with a 26px column head (24px on היום, 48px in a week card to hold the weekday letter, Gregorian day and Hebrew day). Each line carries a 1px faint rule so an empty line still reads as a line.

On היום the order is fixed: toolbar with the gear and the round הקודם / הבא chevrons, the serif title with the holiday chip at its far end, the amber date line, the week chart card, the prayer card, then the Torah card. Reminder rows sit above the chart when present.

## Elevation & Depth

The app is flat. Depth is tonal: navy ground, a slightly lighter navy card, and chalk-tint troughs for controls. There are no box shadows, glows or gradients on any surface. The only inset shadow in the code draws the 1.5px ring of an unchecked round check; it is a stroke, not elevation.

The app icon is the one exception. Following the owner's taste for solid icons with depth, the arched shul window is drawn with soft gradients and drop shadows. That shading stays in the icon and never moves into the UI.

### Named Rules
**The Flat Night Rule.** Surfaces separate by tone, never by shadow. A new surface is either ground or card.

## Shapes

Round and soft. Cards and inset lists have 20px corners. Controls get smaller radii that stay concentric: the attendance trough is 9px with a 7px thumb, search fields 10px, recovery buttons 12px. The holiday chip is a full pill (11px on a 22px height). Period buttons, round checks and stars are circles.

Stars are discs or rings, never star glyphs. The today ring around a chart column is a rounded rectangle (14px radius, 32px wide); on the stats star line it is a circle. The only straight-edged mark is the + of an unmarked prayer, two 1px hairlines 8px long.

## Components

### Star Chart (signature)
The heart of the app, shared by היום's week chart and every week card in לוח.
- **Size ramp:** a 14px chalk disc for במניין or a day of learning; a 6px chalk disc for ביחידות; an 11px hollow ring with a 1.5px chalk stroke and card fill for ק״ש בלבד; a dusk-grey 8px + for a prayer that was due and is unmarked; nothing when the prayer did not apply.
- **Streak lines:** 1.25px chalk at 45%, drawn behind the stars, joining large discs on consecutive days. In a week card a line runs on to the card's edge when the streak continues into the next week. מוסף never gets a joining line.
- **Today and shown day:** today's column sits inside a 1.5px red rounded ring; a past day being shown gets the same ring in faint chalk. The ringed column's head turns chalk and 600.
- **Columns:** each column is a button that opens its day. Pressed, it gets a 12px fill. Days ahead are dimmed to 35% and cannot be opened; days outside the shown month have their number dimmed to 45% with stars still drawn.
- **Motion:** when today's star turns במניין it grows in from 40% scale and its streak line draws in from yesterday's star, both in 220ms on cubic-bezier(0.16, 1, 0.3, 1). Nothing moves under reduce motion.

### Stats Star Line
One line of stars for the period in סטטיסטיקה, on a faint rule. Each disc is sized by its day's share במניין (large, medium, small), with a + for a tracked day with nothing marked and an empty ring for today until something is marked. Discs shrink to fit a month. Labels are 0.6875rem dusk grey; today's is chalk 600.

### Attendance Control
The במניין | ביחידות | ק״ש בלבד control at the end of each prayer row. A 140px (192px with ק״ש בלבד) chalk-tint trough, 34px tall, with 1px dividers between segments.
- **במניין selected:** chalk thumb with navy text, the brightest thing in the row, matching the bright star it makes.
- **ביחידות or ק״ש בלבד selected:** a quiet 20% chalk thumb with chalk 600 text.
- **States:** background and colour ease over 160ms; press scales to 0.97. No transition or scale under reduce motion.

### Segmented Switch
The full-width השבוע | החודש | כל הזמנים switch: Ionic's iOS segment, 44px tall, 16px in from the edges, a chalk-tint trough with a chalk thumb and navy text.

### Cards / Containers
- **Corner Style:** 20px.
- **Background:** Raised Night on Night Ground.
- **Shadow Strategy:** none (see Elevation & Depth).
- **Border:** none outside; 1px separator hairlines between rows and table lines.
- **Internal Padding:** rows sit 14 to 16px in from the card edge.

### Round Check
Used for תפילין, טלית and למדתי. An 18px circle with a 1.5px chalk ring at 55%; checked, it fills chalk with a navy check mark. The Torah card's check is 26px. Fill changes over 160ms.

### Chips
- **Holiday chip:** a 1px amber outline pill, 22px tall, amber 0.8125rem 500 text, no fill. It sits at the far end of the title row.

### Buttons
- **Period buttons:** הקודם / הבא in the toolbar are 32px chalk-tint circles with a 16px chalk chevron and a 44pt hit area. Disabled, they drop to 35%.
- **Primary:** Ionic primary is amber with navy text (the recovery screen's main action, 12px corners, 44px tall). Secondary recovery buttons are chalk-tint with amber text.
- **Focus:** a 2px amber outline on every button and checkbox.

### Inputs / Fields
- **Search:** a 10px chalk-tint field with chalk text and dusk-grey placeholder and icons.
- **Note line:** the Torah card's הערה field is a bare line with a dusk-grey placeholder.

### Navigation
Native iOS throughout. A transparent navy toolbar with the gear at its end, iOS large serif titles that collapse on scroll, and a native tab bar on Tab Night with a hairline top border. Tab labels are 0.6875rem; unselected tabs are dusk grey and the selected tab is amber.

## Do's and Don'ts

### Do:
- **Do** keep the star size ramp exact: 14px disc, 6px disc, 11px ring with a 1.5px stroke, an 8px +, or nothing.
- **Do** tell marks apart by shape and size so the chart reads without colour.
- **Do** draw streak lines at 1.25px in chalk at 45%, behind the stars, and never on the מוסף line.
- **Do** ring today in red and a past shown day in faint chalk.
- **Do** put annotations in amber: dates, streak numbers, holidays, reminders, the selected tab.
- **Do** set large titles and poster numerals in Frank Ruhl Libre and everything else in Heebo, with tabular figures.
- **Do** check every screen at 375×667 first.
- **Do** keep every tap target at least 44pt, with an invisible hit area when the visual is smaller.
- **Do** turn off the star grow, the streak draw and control transitions under reduce motion.

### Don't:
- **Don't** add a light appearance; the app is always night.
- **Don't** use red for anything but today's ring.
- **Don't** add shadows, glows, gradients or textures to app surfaces.
- **Don't** draw decorative stars, sparkles or dot patterns; every dot is data.
- **Don't** give prayers their own colours or bring back leather, gold, parchment or spines.
- **Don't** use green checks, flames or heat grids for progress.
- **Don't** set rows, labels or controls in the serif.
