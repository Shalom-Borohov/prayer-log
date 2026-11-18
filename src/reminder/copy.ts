export const REMINDER_COPY = {
  title: 'תפילות',
  someMissing: 'יש תפילות של היום שעוד לא נרשמו',
  allLogged: 'כל התפילות של היום נרשמו',
  missing: (names: string[]) =>
    names.length === 1 ? `עוד לא נרשמה: ${names[0]}` : `עוד לא נרשמו: ${names.join(', ')}`,
} as const
