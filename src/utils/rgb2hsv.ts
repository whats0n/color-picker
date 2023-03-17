export const rgb2hsv = (
  r: number,
  g: number,
  b: number
): Record<'h' | 's' | 'v', number> => {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  const s = max === 0 ? 0 : d / max
  const v = max / 255

  const hue: Record<number, () => number> = {
    [r]: () => (g - b + d * (g < b ? 6 : 0)) / (6 * d),
    [g]: () => (b - r + d * 2) / (6 * d),
    [b]: () => (r - g + d * 4) / (6 * d),
  }

  const h = max === min ? 0 : hue[max]()

  return { h, s, v }
}
