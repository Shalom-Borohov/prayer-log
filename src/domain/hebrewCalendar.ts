import { type FlagName, HDate, type HolidayEvent, Locale, RoshHashanaEvent, gematriya, getHolidaysOnDate } from '@hebcal/core'
import { parseIsoDate } from './logicalDay'

const LOCALE = 'he-x-NoNikud'

const hiddenFlags: FlagName[] = ['SPECIAL_SHABBAT', 'YOM_KIPPUR_KATAN', 'BEHAB']

const toHDate = (date: string) => new HDate(parseIsoDate(date))

const israeliHolidays = (date: string) => getHolidaysOnDate(toHDate(date), true) ?? []

const nationalDays = [
  'Yom HaShoah',
  'Yom HaZikaron',
  "Yom HaAtzma'ut",
  'Yom Yerushalayim',
  'Swords of Iron War Memorial Day',
]

const isShown = (ev: HolidayEvent) =>
  !hiddenFlags.some((flag) => ev.hasFlag(flag)) && (!ev.hasFlag('MODERN_HOLIDAY') || nationalDays.includes(ev.getDesc()))

export function holidayNames(date: string): string[] {
  return israeliHolidays(date)
    .filter(isShown)
    .map((ev) => (ev instanceof RoshHashanaEvent ? Locale.gettext('Rosh Hashana I', LOCALE) : ev.render(LOCALE)))
}

export function isRestDay(date: string): boolean {
  return parseIsoDate(date).getDay() === 6 || israeliHolidays(date).some((ev) => ev.hasFlag('CHAG'))
}

export function hasMusaf(date: string): boolean {
  return isRestDay(date) || israeliHolidays(date).some((ev) => ev.hasFlag('CHOL_HAMOED') || ev.hasFlag('ROSH_CHODESH'))
}

export function hebrewDayNumber(date: string): string {
  return gematriya(toHDate(date).getDate())
}

export function hebrewDateLabel(date: string): string {
  const hdate = toHDate(date)

  return `${gematriya(hdate.getDate())} ב${Locale.gettext(hdate.getMonthName(), LOCALE)}`
}
