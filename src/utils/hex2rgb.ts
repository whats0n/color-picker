export const hex2rgb = (
  value: string
): Record<'r' | 'g' | 'b', number> | null => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  const hex = value.replace(shorthandRegex, function (_, r, g, b) {
    return r + r + g + g + b + b
  })

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}
