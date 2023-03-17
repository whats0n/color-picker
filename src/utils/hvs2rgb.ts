export const hsv2rgb = (
  h: number,
  s: number,
  v: number
): Record<'r' | 'g' | 'b', number> => {
  let d = 0.0166666666666666 * (h * 360)
  let c = v * s
  let x = c - c * Math.abs((d % 2.0) - 1.0)
  let m = v - c
  c += m
  x += m

  const rgb: Record<number, () => Record<'r' | 'g' | 'b', number>> = {
    0: () => ({ r: c, g: x, b: m }),
    1: () => ({ r: x, g: c, b: m }),
    2: () => ({ r: m, g: c, b: x }),
    3: () => ({ r: m, g: x, b: c }),
    4: () => ({ r: x, g: m, b: c }),
  }

  const { r, g, b } = rgb[d >>> 0]?.() || { r: c, g: m, b: x }

  return {
    r: Math.round(255 * r),
    g: Math.round(255 * g),
    b: Math.round(255 * b),
  }
}
