import { hsv2rgb } from '../utils/hvs2rgb'
import { rgb2hex } from '../utils/rgb2hex'
import { rgb2hsv } from '../utils/rgb2hsv'

type HSV = Record<'h' | 's' | 'v', number>
type RGB = Record<'r' | 'g' | 'b', number>

export class Color {
  public hsv: HSV

  public alpha: number = 1

  public get rgb(): RGB {
    const { h, s, v } = this.hsv
    return hsv2rgb(h, s, v)
  }

  public set rgb(rgb: RGB) {
    const { r, g, b } = rgb
    this.hsv = rgb2hsv(r, g, b)
  }

  /**
   * @returns string - **rgb(R, G, B)**
   */
  public stringifyRGB = (): string => {
    const value = Object.values(this.rgb).join(', ')
    return `rgb(${value})`
  }

  /**
   * @returns string - **rgba(R, G, B, A)**
   */
  public stringifyRGBA = (): string => {
    const value = Object.values(this.rgb).join(', ')
    return `rgba(${value}, ${this.alpha})`
  }

  public stringifyHexA = (): string => {
    const { r, g, b } = this.rgb
    return (
      '#' +
      (this.alpha === 1
        ? rgb2hex(r, g, b)
        : rgb2hex(r, g, b) + `${Math.round(this.alpha * 100)}`.padStart(2, '0'))
    )
  }

  /**
   * @param  {number} h - **Hue** from **0** to **1**
   * @param  {number} s - **Saturation** from **0** to **1**
   * @param  {number} v - **Value** from **0** to **1**
   * @param  {number} v - **Alpha** from **0** to **1**
   */
  constructor(h: number, s: number, v: number, a?: number) {
    this.hsv = { h, s, v }
    if (a !== undefined) this.alpha = Math.round(a * 100) / 100
  }
}
