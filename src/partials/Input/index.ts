import { Store } from '../../Store'
import { rgb2hsv } from '../../utils/rgb2hsv'
import { Color } from '../Color'
import { InputRGBA } from './rgba'

export class Input {
  #refs = {
    container: document.createElement('div'),
  }

  #partials = {
    rgba: new InputRGBA((key, { r, g, b, a }) => {
      const { hue, saturation, value, alpha } = this.store.get()

      if (key === 'a') {
        if (alpha !== a) this.store.set({ alpha: a / 100 })

        return
      }

      const { h, s, v } = rgb2hsv(r, g, b)

      if (h !== hue || saturation !== s || value !== v) {
        this.store.set({
          hue: h,
          saturation: s,
          value: v,
          alpha: a / 100,
        })
      }
    }),
  }

  constructor(private store: Store) {
    this.store.listen((next, prev) => {
      if (next.alpha !== prev.alpha) this.#partials.rgba.setAlpha(next.alpha)

      if (
        next.hue !== prev.hue ||
        next.saturation !== prev.saturation ||
        next.value !== prev.value
      ) {
        const color = new Color(next.hue, next.saturation, next.value)
        this.#partials.rgba.set(color)
      }
    })
  }

  public mount = (container: HTMLElement): void => {
    this.#refs.container.classList.add('output')

    this.#partials.rgba.mount(this.#refs.container)

    container.appendChild(this.#refs.container)

    const { hue, saturation, value, alpha } = this.store.get()

    const color = new Color(hue, saturation, value)

    this.#partials.rgba.set(color)
    this.#partials.rgba.setAlpha(alpha)
  }
}
