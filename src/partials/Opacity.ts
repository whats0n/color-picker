import { Store } from '../Store'
import { Color } from './Color'
import { Handler } from './Handler'

export class Opacity {
  #state = 1

  #handler = new Handler({
    onMounted: () => {
      const { hue, saturation, value, alpha } = this.store.get()

      const color = new Color(hue, saturation, value)

      this.draw(color)
      this.setState(alpha)
    },
    onChange: (progress) => {
      this.#state = progress

      if (this.store.get().alpha !== this.#state)
        this.store.set({ alpha: this.#state })
    },
  })

  constructor(private store: Store) {
    this.store.listen((next, prev) => {
      if (next.alpha !== prev.alpha) this.setState(next.alpha)

      if (
        next.hue !== prev.hue ||
        next.saturation !== prev.saturation ||
        next.value !== prev.value
      ) {
        const color = new Color(next.hue, next.saturation, next.value)

        this.draw(color)
      }
    })

    this.#handler.refs.container.classList.add('handler_opacity')
  }

  public mount = (container: HTMLElement): void => {
    this.#handler.mount(container)
  }

  private draw = (color: Color): void => {
    this.#handler.refs.container.style.setProperty(
      '--color',
      color.stringifyRGB()
    )
  }

  /**
   * @param  {number} a - **Alpha (Opacity)** from **0** to **1**
   * @returns void
   */
  private setState = (a: number): void => {
    this.#handler.setProgress(a)
  }
}
