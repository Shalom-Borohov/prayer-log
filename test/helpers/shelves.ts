export const spinesOf = (shelf: Element) => [...shelf.querySelectorAll<HTMLElement>('.spine')]

export const todaySlotsOf = (shelf: Element) => [...shelf.querySelectorAll<HTMLElement>('.shelf-slot.is-today')]

export const spineStatesOf = (shelf: Element) =>
  spinesOf(shelf).map((spine) => [...spine.classList].find((name) => name.startsWith('spine-') && name !== 'spine-stamp'))
