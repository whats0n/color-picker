import { hsv2rgb } from '../utils/hvs2rgb'
import { rgb2hsv } from '../utils/rgb2hsv'

type HSV = Record<'h' | 's' | 'v', number>
type RGB = Record<'r' | 'g' | 'b', number>

export class Color {
  public hsv: HSV

  public get rgb(): RGB {
    const { h, s, v } = this.hsv
    return hsv2rgb(h, s, v)
  }

  public set rgb(rgb: RGB) {
    const { r, g, b } = rgb
    this.hsv = rgb2hsv(r, g, b)
  }

  /**
   * @returns string - **rgb(N, N, N)**
   */
  public stringifyRGB = (): string => {
    const value = Object.values(this.rgb).join(', ')
    return `rgb(${value})`
  }

  /**
   * @param  {number} h - **Hue** from **0** to **1**
   * @param  {number} s - **Saturation** from **0** to **1**
   * @param  {number} v - **Value** from **0** to **1**
   */
  constructor(h: number, s: number, v: number) {
    this.hsv = { h, s, v }
  }
}
