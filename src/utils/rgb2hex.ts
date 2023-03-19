export const rgb2hex = (r: number, g: number, b: number): string =>
  [r, g, b]
    .map((value) => {
      const hex = value.toString(16)
      return hex.padStart(2, '0')
    })
    .join('')
