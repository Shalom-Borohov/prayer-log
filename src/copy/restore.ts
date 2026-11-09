import { COMMON_COPY } from './common'

const KEEP_TOGETHER = String.fromCharCode(0xa0)

export const RESTORE_COPY = {
  importWarning: `${COMMON_COPY.importWarning}.`,
  inFile: (summary: string) => `בקובץ: ${summary}`,
  onPhone: (summary: string) => `בטלפון: ${summary}`,
  daysUpTo: (count: number, date: string) =>
    count === 1
      ? `יום${KEEP_TOGETHER}אחד, ${date}`
      : `${count}${KEEP_TOGETHER}ימים, עד${KEEP_TOGETHER}${date}`,
  noData: 'אין נתונים',
  phoneHasLater: (date: string) => `בטלפון יש ימים אחרי${KEEP_TOGETHER}${date}.`,
  comingBack: (summary: string) => `יחזרו: ${summary}`,
  current: (summary: string) => `עכשיו: ${summary}`,
  daysLoggedSinceStay: (count: number) =>
    count === 1 ? 'יום אחד שסומן מאז יישאר.' : `${count} ימים שסומנו מאז יישארו.`,
} as const
