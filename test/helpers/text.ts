export const NO_BREAK_SPACE = String.fromCharCode(0xa0)

export const asRead = (text: string | null | undefined) => text?.replaceAll(NO_BREAK_SPACE, ' ')
