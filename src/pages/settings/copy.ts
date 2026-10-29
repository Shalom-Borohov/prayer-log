export const SETTINGS_COPY = {
  actionFailed: 'הפעולה נכשלה',
  backupRestored: 'הגיבוי שוחזר',
  backup: 'גיבוי',
  exportBackup: 'ייצוא גיבוי',
  importBackup: 'ייבוא גיבוי',
  importWarning: 'הייבוא יחליף את כל הנתונים',
  confirmImport: 'ייבוא',
  storageNote:
    'הנתונים נשמרים רק במכשיר הזה. הייצוא יוצר קובץ עם כל הימים שסומנו, שאפשר לשמור בקבצים ולשחזר ממנו בייבוא.',
  backupFile: 'קובץ גיבוי',
  version: (commit: string) => `גרסה ${commit}`,
  updated: (date: string) => `עודכנה ${date}`,
} as const
