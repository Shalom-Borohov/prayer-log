export function element(selector: string) {
  const found = document.querySelector(selector)

  if (!found) {
    throw new Error(`fixture missing ${selector}`)
  }

  return found
}
