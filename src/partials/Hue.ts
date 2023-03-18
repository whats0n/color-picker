import { Color } from './Color'
import { Store } from '../Store'
import { Handler } from './Handler'

export class Hue {
  #state: {
    colors: Color[]
    color: Color | null
    x: number
  } = {
    colors: Array(7)
      .fill(0)
      .map<Color>((_, i, { length }) => new Color(i / (length - 1), 1, 1)),
    color: null,
    x: 0,
  }

  #handler = new Handler({
    onMounted: () => {
      this.draw()
      this.setState(this.store.get().hue)
    },
    onChange: (progress) => {
      this.#state.x = progress * 100

      this.#state.color = new Color(progress, 1, 1)

      this.#handler.refs.container.style.setProperty(
        '--color',
        this.#state.color.stringifyRGB()
      )

      if (this.store.get().hue !== progress) this.store.set({ hue: progress })
    },
  })

  constructor(private store: Store) {
    this.store.listen((next, prev) => {
      if (next.hue !== prev.hue) this.setState(next.hue)
    })

    this.#handler.refs.container.classList.add('handler_hue')
  }

  public mount = (container: HTMLElement): void => {
    this.#handler.mount(container)
  }

  private draw = (): void => {
    const colors = this.#state.colors
      .map(
        (color, i, { length }) =>
          `${color.stringifyRGB()} ${(i / (length - 1)) * 100}%`
      )
      .join(', ')

    this.#handler.refs.container.style.setProperty('--colors', colors)
  }

  /**
   * @param  {number} h - **Hue** from **0** to **1**
   * @returns void
   */
  private setState = (h: number): void => {
    this.#handler.setProgress(h)
  }
}
