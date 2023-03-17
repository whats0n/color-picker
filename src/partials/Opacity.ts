import { Store } from '../Store'
import { events } from '../utils/events'
import { Color } from './Color'

export class Opacity {
  #refs = {
    container: document.createElement('div'),
    track: document.createElement('div'),
    handler: document.createElement('button'),
  }
  #state = 1

  constructor(private store: Store) {
    this.store.listen((next, prev) => {
      if (next.alpha !== prev.alpha) this.moveTo(next.alpha)

      if (
        next.hue !== prev.hue ||
        next.saturation !== prev.saturation ||
        next.value !== prev.value
      ) {
        const color = new Color(next.hue, next.saturation, next.value)

        this.draw(color)
      }
    })
  }

  public mount = (container: HTMLElement): void => {
    this.#refs.container.classList.add('opacity')
    this.#refs.track.classList.add('opacity__track')
    this.#refs.handler.classList.add('opacity__handler')

    this.#refs.container.appendChild(this.#refs.track)
    this.#refs.track.appendChild(this.#refs.handler)
    container.appendChild(this.#refs.container)

    this.addListeners()

    const { hue, saturation, value, alpha } = this.store.get()

    const color = new Color(hue, saturation, value)

    this.draw(color)
    this.moveTo(alpha)
  }

  private draw = (color: Color): void => {
    this.#refs.container.style.setProperty('--color', color.stringifyRGB())
  }

  private addListeners = (): void => {
    this.#refs.container.addEventListener(events().start, this.onStart)
  }

  private onStart = (e: Event): void => {
    if (!(e instanceof MouseEvent)) return

    this.setState(e.clientX)

    document.addEventListener(events().move, this.onMove)
    document.addEventListener(events().end, this.onEnd)
  }

  private onMove = (e: Event): void => {
    if (!(e instanceof MouseEvent)) return
    this.setState(e.clientX)
  }

  private onEnd = (e: Event): void => {
    if (!(e instanceof MouseEvent)) return

    this.setState(e.clientX)

    document.removeEventListener(events().move, this.onMove)
    document.removeEventListener(events().end, this.onEnd)
  }

  private setState = (clientX: number): void => {
    const { left, width } = this.#refs.track.getBoundingClientRect()

    const x = Math.min(width, Math.max(clientX - left, 0))

    this.#state = x / width

    this.#refs.container.style.setProperty('--x', `${this.#state * 100}%`)
    this.#refs.container.style.setProperty('--opacity', `${this.#state}`)

    if (this.store.get().alpha !== this.#state)
      this.store.set({ alpha: this.#state })
  }

  /**
   * @param  {number} a - **Alpha (Opacity)** from **0** to **1**
   * @returns void
   */
  private moveTo = (a: number): void => {
    const { left, width } = this.#refs.track.getBoundingClientRect()

    const clientX = left + a * width

    this.setState(clientX)
  }
}
