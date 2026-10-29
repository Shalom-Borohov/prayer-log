import { type FlagName, HDate, type HolidayEvent, Locale, RoshHashanaEvent, gematriya, getHolidaysOnDate } from '@hebcal/core'
import { FORMAT_COPY } from '../copy/format'
import { isSaturday, parseIsoDate } from './logicalDay'

const LOCALE = 'he-x-NoNikud'

const IN_ISRAEL = true

const ROSH_HASHANA_DAY_ONE = 'Rosh Hashana I'

const hiddenFlags: FlagName[] = ['SPECIAL_SHABBAT', 'YOM_KIPPUR_KATAN', 'BEHAB']

const toHDate = (date: string) => new HDate(parseIsoDate(date))

const israeliHolidays = (date: string) => getHolidaysOnDate(toHDate(date), IN_ISRAEL) ?? []

const nationalDays = [
  'Yom HaShoah',
  'Yom HaZikaron',
  "Yom HaAtzma'ut",
  'Yom Yerushalayim',
  'Swords of Iron War Memorial Day',
]

const isShown = (holiday: HolidayEvent) =>
  !hiddenFlags.some((flag) => holiday.hasFlag(flag)) &&
  (!holiday.hasFlag('MODERN_HOLIDAY') || nationalDays.includes(holiday.getDesc()))

export function holidayNames(date: string): string[] {
  return israeliHolidays(date)
    .filter(isShown)
    .map((holiday) =>
      holiday instanceof RoshHashanaEvent ? Locale.gettext(ROSH_HASHANA_DAY_ONE, LOCALE) : holiday.render(LOCALE),
    )
}

const hasHolidayFlag = (date: string, ...flags: FlagName[]) =>
  israeliHolidays(date).some((holiday) => flags.some((flag) => holiday.hasFlag(flag)))

export function isRestDay(date: string): boolean {
  return isSaturday(date) || hasHolidayFlag(date, 'CHAG')
}

export function hasMusaf(date: string): boolean {
  return isRestDay(date) || hasHolidayFlag(date, 'CHOL_HAMOED', 'ROSH_CHODESH')
}

export function hasTefillin(date: string): boolean {
  return !isRestDay(date) && !hasHolidayFlag(date, 'CHOL_HAMOED')
}

export function hebrewDayNumber(date: string): string {
  return gematriya(toHDate(date).getDate())
}

export function hebrewDateLabel(date: string): string {
  const hebrewDate = toHDate(date)

  return FORMAT_COPY.hebrewDate(gematriya(hebrewDate.getDate()), Locale.gettext(hebrewDate.getMonthName(), LOCALE))
}
