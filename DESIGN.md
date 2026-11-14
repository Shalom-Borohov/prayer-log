---
name: תפילות
description: A private prayer log drawn as a sefarim shelf, where every prayer is a leather spine and a prayer במניין earns its gold.
colors:
  stamp-gold: "#e2c27a"
  on-shell-parchment: "#e8d7ad"
  accent-gold-light: "#8a5a12"
  accent-gold-dark: "#d9ae4e"
  today-gold-light: "#a87a1f"
  today-gold-dark: "#d9ae4e"
  leather-shell-light: "#2b2320"
  leather-shell-dark: "#1f1916"
  shelf-board-light: "#b08d57"
  shelf-board-dark: "#806a5b"
  switch-dark: "#3a2f2a"
  shacharit-bottle-green: "#1f4d3a"
  shacharit-bottle-green-dark: "#3d785c"
  musaf-plum: "#5b3a6b"
  musaf-plum-dark: "#835e98"
  mincha-oxblood: "#7a2430"
  mincha-oxblood-dark: "#b04a57"
  maariv-navy: "#1e3355"
  maariv-navy-dark: "#4a6a9e"
  torah-brown: "#6b4423"
  torah-brown-dark: "#8e6438"
  ground-light: "#f2f2f7"
  ground-dark: "#000000"
  surface-light: "#ffffff"
  surface-dark: "#1c1c1e"
  bar-light: "#f9f9f9"
  bar-dark: "#161616"
  label-light: "#1c1c1e"
  label-dark: "#ffffff"
  label-secondary-light: "#6c6c70"
  label-secondary-dark: "#a1a1a8"
  tab-idle-dark: "#8e8e93"
  label-tertiary-light: "rgba(60, 60, 67, 0.3)"
  label-tertiary-dark: "rgba(235, 235, 245, 0.3)"
  separator-light: "rgba(60, 60, 67, 0.29)"
  separator-dark: "rgba(84, 84, 88, 0.65)"
  fill-light: "rgba(118, 118, 128, 0.12)"
  fill-dark: "rgba(118, 118, 128, 0.24)"
  raised-dark: "#636366"
typography:
  display:
    fontFamily: "Frank Ruhl Libre, Times New Roman, serif"
    fontSize: "calc(88rem / 17)"
    fontWeight: 700
    lineHeight: "80px"
    fontFeature: "tnum"
  headline:
    fontFamily: "Frank Ruhl Libre, Times New Roman, serif"
    fontSize: "2rem"
    fontWeight: 700
    letterSpacing: "0"
  figure:
    fontFamily: "Frank Ruhl Libre, Times New Roman, serif"
    fontSize: "calc(28rem / 17)"
    fontWeight: 700
    lineHeight: "32px"
  name:
    fontFamily: "Frank Ruhl Libre, Times New Roman, serif"
    fontSize: "calc(24rem / 17)"
    fontWeight: 700
    lineHeight: "26px"
  caption-strong:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Hebrew, Arial Hebrew, sans-serif"
    fontSize: "calc(22rem / 17)"
    fontWeight: 600
    lineHeight: "28px"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Hebrew, Arial Hebrew, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: "22px"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Hebrew, Arial Hebrew, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: "22px"
    fontFeature: "tnum"
  control:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Hebrew, Arial Hebrew, sans-serif"
    fontSize: "calc(15rem / 17)"
    fontWeight: 500
    lineHeight: "20px"
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Hebrew, Arial Hebrew, sans-serif"
    fontSize: "calc(14rem / 17)"
    fontWeight: 400
    lineHeight: "18px"
  small:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Hebrew, Arial Hebrew, sans-serif"
    fontSize: "calc(13rem / 17)"
    fontWeight: 400
    lineHeight: "18px"
  tab:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Hebrew, Arial Hebrew, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
rounded:
  spine: "2px"
  trend-column: "3px"
  control-inner: "5px"
  control: "9px"
  card: "10px"
  column-press: "12px"
  chip: "16px"
  full: "50%"
spacing:
  spine-width: "16px"
  spine-height: "42px"
  spine-small-height: "28px"
  spine-gap: "4px"
  board-height: "4px"
  tap: "44px"
  prayer-row: "112px"
  day-column: "38px"
  card-gap: "12px"
  week-card-gap: "10px"
  card-padding: "12px"
  gutter: "16px"
  list-text: "32px"
components:
  attendance-control:
    backgroundColor: "{colors.fill-light}"
    textColor: "{colors.label-light}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    height: "{spacing.tap}"
  attendance-minyan-selected:
    backgroundColor: "{colors.mincha-oxblood}"
    textColor: "{colors.stamp-gold}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    height: "{spacing.tap}"
  attendance-plain-selected:
    backgroundColor: "{colors.surface-light}"
    textColor: "{colors.label-light}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    height: "{spacing.tap}"
  spine-minyan:
    backgroundColor: "{colors.shacharit-bottle-green}"
    rounded: "{rounded.spine}"
    width: "{spacing.spine-width}"
    height: "{spacing.spine-height}"
  spine-shema:
    backgroundColor: "{colors.shacharit-bottle-green}"
    rounded: "{rounded.spine}"
    width: "{spacing.spine-width}"
    height: "21px"
  inset-card:
    backgroundColor: "{colors.surface-light}"
    rounded: "{rounded.card}"
    padding: "{spacing.card-padding}"
  leather-band:
    backgroundColor: "{colors.leather-shell-light}"
    textColor: "{colors.stamp-gold}"
    typography: "{typography.headline}"
  holiday-chip:
    textColor: "{colors.stamp-gold}"
    typography: "{typography.control}"
    rounded: "{rounded.chip}"
    padding: "4px 12px"
  period-button:
    textColor: "{colors.stamp-gold}"
    rounded: "{rounded.full}"
    size: "34px"
---

# Design System: תפילות

## Overview

**Creative North Star: "The shelf, dressed"**

Every prayer is a sefer on a shelf, bound in its own leather, and a prayer במניין earns its gold stamp. The app reads as a beit midrash bookcase seen in daylight (or by lamplight in dark): one dark leather band across the top carrying a gold large title, then plain iOS grouped cards on the system ground, each row ending in a short shelf of spines standing on a flat board. The shelf repeats as the signature on every tab: seven spines per prayer on היום, one shelf per prayer per week in לוח, and the period's shelf per prayer in סטטיסטיקה.

The system is native first. Ionic React runs in iOS mode, the body face is the phone's own font, cards, lists, segmented controls and the tab bar are iOS grouped-style, and every size is in rem against the phone's Text Size so Dynamic Type still scales it (1rem is 17pt at the default size). The book world lives only in the leathers, the gold, the spines and the board; nothing else is ornamented.

Marks are large enough to read at arm's length on an iPhone SE: spines are 16pt wide and 42pt tall, prayer names 24pt, the marking control 44pt. Colour is flat throughout. The world rejects the habit-tracker vocabulary of green checks, flames and heat grids, and the previous version's small marks.

**Key Characteristics:**
- Five fixed leathers, one per prayer and one for תורה, identical on every tab.
- Gold on a mark means במניין (or a day of learning) and nothing else.
- A spine's state is its shape: stamped, plain, half-height, dashed outline, or a gap.
- One dark leather band holds the toolbar, gold title and date line, closed by a fine gold double rule, in both appearances.
- Light and dark follow the phone, with an override in הגדרות.
- Flat colour: no grain, no gradient fills, no shadows.

## Colors

Five book leathers and one gold on a plain iOS ground; the leathers carry identity, the gold carries the במניין state.

### Primary
- **Stamp Gold** (stamp-gold): the gold leaf. The bands and title block on a stamped spine, the lettering and inner frame of a selected במניין segment, the ticks inside checked round checks, the large title and double rule of the leather band, the holiday chip and the header chevrons. Same value in both appearances, because it always sits on leather.
- **Gilded Accent** (accent-gold-light / accent-gold-dark): the interactive gold on the ground: selected tab, focus outline, holiday dates and the פרשה in לוח, the learning "+", the backfill banner, Ionic's primary colour. Darker in light so it reads on white, brighter in dark.
- **Today Gold** (today-gold-light / today-gold-dark): the short bar under today's slot on a shelf, under today's column head in לוח and over today's trend tick.

### Secondary: the leathers
Each prayer has one leather, set through a hue class on its row, so a component reads `--hue` and never names a prayer. Dark mode uses the lighter `-dark` leathers for spines; the selected במניין segment and checked round checks always use the deep (light-mode) leather so the gold keeps its contrast.
- **Bottle Green** (shacharit-bottle-green / -dark): שחרית, and the תפילין וטלית card.
- **Plum** (musaf-plum / -dark): מוסף.
- **Oxblood** (mincha-oxblood / -dark): מנחה.
- **Navy** (maariv-navy / -dark): ערבית.
- **Brown** (torah-brown / -dark): תורה.

### Tertiary
- **Leather Shell** (leather-shell-light / leather-shell-dark): the header band, the body behind it and the iOS status bar strip. The selected stats period segment uses it in light and **Switch Leather** (switch-dark) in dark.
- **Parchment** (on-shell-parchment): the date line under the large title, the only non-gold text on leather.
- **Shelf Board** (shelf-board-light / shelf-board-dark): the flat board under every row of spines and under the trend columns; in dark also the non-במניין part of a trend column.

### Neutral
iOS system grouped values, per appearance.
- **Ground** (ground-light / ground-dark): page background under the cards.
- **Surface** (surface-light / surface-dark): inset cards, lists and tables.
- **Bar** (bar-light / bar-dark): tab bar. Idle tab icons and labels take label-secondary-light in light and tab-idle-dark in dark.
- **Label / Secondary / Tertiary** (label-*, label-secondary-*, label-tertiary-*): primary text, meta lines and numbers, and disclosure chevrons and placeholder outlines.
- **Separator** (separator-*): hairlines between rows and segments.
- **Fill** (fill-*): the track of segmented controls and the pressed state of rows and day columns.
- **Raised** (surface-light in light, raised-dark in dark): a selected ביחידות or ק״ש בלבד segment, and the indicator of plain iOS segments.

### Named Rules
**The Gold Means במניין Rule.** On a mark, gold means the prayer was said במניין, or on the תורה shelf that a day of learning was logged, and nothing else. ביחידות and ק״ש בלבד never carry gold on a spine or a selected segment. The listed exceptions, which sit around the marks and not on them, are gold-toned by design: the leather band's title and double rule, today's bar, and the gilded accent (the selected tab, holidays and the פרשה, the learning "+", the ticks of the checks).

**The One Leather Rule.** A prayer's leather is the same on every tab and every surface: its spine, its selected במניין segment, its key in כל הזמנים. Never recolour a prayer for a context, and never give ביחידות or ק״ש בלבד a prayer's leather in the trend columns; they take the plain shell (light) or board (dark) colour.

**The Leather Band Holds Rule.** The header and the status bar are leather in light and in dark alike, so the installed app's status bar always matches the band.

## Typography

**Display Font:** Frank Ruhl Libre 700 (bundled from @fontsource, with Times New Roman)
**Body Font:** the phone's own font (-apple-system, SF Hebrew, with Arial Hebrew)

**Character:** A book face for the things a binder would letter (titles, prayer names, the big numbers), and the phone's own sans for everything that is read or tapped, so the app stays native under the leather.

### Hierarchy
- **Display** (Frank Ruhl Libre 700, 88pt, 80px line, tabular figures): the count במניין in סטטיסטיקה, beside its caption.
- **Headline** (Frank Ruhl Libre 700, 2rem): the large title in the leather band, in Stamp Gold.
- **Figure** (Frank Ruhl Libre 700, 28pt, 32px line): the three figures under the stats shelves.
- **Name** (Frank Ruhl Libre 700, 24pt, 26px line): prayer names on היום.
- **Caption Strong** (system 600, 22pt, 28px line): "במניין" beside the big number.
- **Title** (system 600, 17pt, 22px line): row names in סטטיסטיקה, week dates in לוח.
- **Body** (system 400, 17pt, 22px line): checks, learning rows, Torah note, captions.
- **Control** (system 500, 15pt, 20px line; 600 when selected): the attendance control, the date line, meta lines ("אוהל יצחק · 3 ברצף"), week shelf labels, holiday chips, column heads, group labels.
- **Label** (system 400, 14pt): list headers and footers, week-period numbers, table heads.
- **Small** (system 400, 13pt, 18px line): Hebrew day under a column head, trend ticks and key.
- **Tab** (system, 11pt): tab bar labels only.

### Named Rules
**The Book Face Rule.** Frank Ruhl Libre 700 is for large titles, prayer names on היום and the big numbers in סטטיסטיקה only. Row names in לוח and סטטיסטיקה, and everything else, are in the phone's font.

**The Readable At Arm's Length Rule.** Every line read while marking is at least 15pt, and nothing but the tab labels is under 13pt. All sizes are rem fractions of 17 (for example `calc(15rem / 17)`), never px, so the phone's Text Size setting scales them. "ק״ש בלבד" is never shortened.

## Layout

A single iOS column at phone width (designed and checked at 375×667). Content sits in inset grouped cards with a 16px gutter on each side and 12px between cards (10px between week cards in לוח); group labels and list footers align with card text at 32px. Card corners and inner padding are 10px and 12px.

On היום each prayer is one row of a single card, 112px tall on every day so rows never move: a 44px top line with the name and meta on the start side and the week's shelf at the end, then the full-width 44px attendance control. The checks card, the Torah card and the השבוע table follow under the prayers; only the prayers' controls must fit the first screen.

In לוח each week card is a grid of a 52px label column and seven day columns (about 38px at 375 wide; each column is one tap target the full height of the card's grid, the exception to the 44pt width that spec decisions 45, 69 and 77 allow, because seven days must fit side by side) under 48px column heads, with one 38px shelf row per prayer due that week and one for תורה. In סטטיסטיקה a period segment, the big number and its caption, then one card with a row per prayer: 56px rows ending in a 13px-spine shelf on השבוע, the numbers over two 16-day boards on החודש, and 46px rows led by a key spine on כל הזמנים with trend columns (96px tall) under the big number.

Numbers use tabular figures app-wide. RTL throughout; geometry uses logical properties (`inset-inline`, `padding-inline`).

## Elevation & Depth

Flat. There are no shadows, gradient fills or textures anywhere; depth comes only from the iOS ground-and-surface step and the leather band against the ground. The gold double rule along the band's lower edge is two flat lines (1.5px and 0.5px, 16px inset), and the stats period segment's gold frame is an inset ring, not a shadow.

### Named Rules
**The Flat Leather Rule.** Colour is flat: no grain, no gradient fill, no drop shadow, on spines, boards, cards or the band.

## Shapes

Small, almost square corners on the book parts and iOS radii on the chrome. Spines and boards are 2px-rounded rectangles; trend columns 3px. The attendance control and its segments are 9px, with a 5px gold inner frame on a selected במניין segment. Cards and tables are 10px. Pressed day columns in לוח round to 12px. Holiday chips are 16px pills with a 1.5px gold border. Round checks (26px), the header chevrons (34px) and the tab icons are circles or system glyphs.

## Components

### The Spine (signature)
A flat leather rectangle, 16×42px on היום (28px tall in לוח and the stats shelves, 13px wide on the stats week and month, 12×26px as the כל הזמנים key), corners 2px, in the row's leather.
- **במניין / a day of learning:** full height with two gold bands (each 1/14 of the height, inset 1/7 from top and bottom) and a gold title block 3px in from each side.
- **ביחידות:** full height, plain bare leather.
- **ק״ש בלבד:** half height, plain.
- **Due and not marked:** a 1.5px dashed outline in the leather, no fill.
- **Did not apply:** an empty slot; the gap stays.
- **Stamping:** marking today במניין presses the spine from 0.9 scale and fades its gold in over 220ms (`cubic-bezier(0.16, 1, 0.3, 1)`); nothing moves under reduce motion.

### The Shelf
Spines stand bottom-aligned 4px apart on a flat 4px board (3px in לוח and under trend columns) in the board colour, with 4px of board past the outer spines. Today's slot has a 3px Today Gold bar 2px under the board; a past day shown on היום has no bar. A shelf is one image to assistive tech, with its label.

### Attendance Control
The במניין | ביחידות | ק״ש בלבד control: a 44px-tall segmented track in Fill, 9px corners, Control type (15pt, 500), hairline separators between unselected segments. A selected במניין segment takes the prayer's deep leather with Stamp Gold lettering inside a 1px gold frame inset 3px. A selected ביחידות or ק״ש בלבד is a plain Raised segment in weight 600, with no leather and no gold. Press scales a segment to 0.97 and colours change over 160ms; both are off under reduce motion.

### Leather Band (Navigation)
The Ionic header in Leather Shell from the status bar through the date line: settings gear and round 34px הקודם / הבא chevrons on a 14% gold wash (each with a 44px hit area), the gold Frank Ruhl large title, holiday chips, the Parchment date line, then the gold double rule. Collapsing on scroll keeps the leather above the header.

### Tab Bar
iOS tab bar on Bar with a separator line; idle items in the tab-idle grey, the selected one in the gilded accent; 11pt labels.

### Cards / Containers
Inset grouped cards on Surface, 10px corners, no border or shadow, rows split by 0.5px separators that start at the text. Tables (השבוע, פירוט) use 44px rows.

### Checks
Round checks: 26px circles with a 1.5px secondary-label ring; checked, they fill with the deep leather of their card (bottle green for תפילין וטלית, brown for למדתי) and show a gold checkmark icon. Each check is a full row button at least 44px tall (52px in the תפילין וטלית card).

### Chips
Holiday chips on the band: transparent, 1.5px Stamp Gold border, gold Control text, 16px pill.

### Segmented controls
Plain iOS segments (Fill track, Raised indicator, 44px tall in inset form). The stats period segment is the dressed variant: the selected segment is shell leather with gold lettering inside a gold inset ring, echoing the attendance control.

## Do's and Don'ts

### Do:
- **Do** show a prayer's state by the spine's shape (stamped, plain, half-height, dashed, gap), never by colour alone.
- **Do** keep gold on marks for במניין and days of learning only; the band's title and rule, today's bar and the gilded accent are the listed exceptions.
- **Do** give every tap target at least 44pt in both directions; when the drawn control is smaller (the 34px header chevrons), extend its hit area to 44pt.
- **Do** set every size in rem as a fraction of 17 so Text Size scales it, with marking text at 15pt or more.
- **Do** read leathers through the row's hue class and the `--hue` / `--hue-deep` variables, so one component serves every prayer.
- **Do** keep the header and status bar strip in Leather Shell in both appearances.
- **Do** honour reduce motion: the stamp, the press scale and colour transitions all stop.

### Don't:
- **Don't** put gold on a ביחידות or ק״ש בלבד spine or selected segment.
- **Don't** tool ביחידות in a darker leather or any other spine that matches במניין's shape; the owner rejected that because it differed only in colour.
- **Don't** add grain, gradient fills or shadows to spines, boards, cards or the band.
- **Don't** use green checks, flames or heat grids for progress; progress is spines on a shelf.
- **Don't** set row names in לוח or סטטיסטיקה, or any body text, in Frank Ruhl Libre.
- **Don't** shrink spines below the sizes above or abbreviate "ק״ש בלבד" to fit.
