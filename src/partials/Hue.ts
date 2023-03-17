import { Color } from './Color'
import { events } from '../utils/events'
import { Store } from '../Store'

export class Hue {
  #refs = {
    container: document.createElement('div'),
    canvas: document.createElement('canvas'),
    track: document.createElement('div'),
    handler: document.createElement('button'),
  }

  private get context() {
    return this.#refs.canvas.getContext('2d')
  }

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

  constructor(private store: Store) {
    this.store.listen((next, prev) => {
      if (next.hue !== prev.hue) this.moveTo(next.hue)
    })
  }

  public mount = (container: HTMLElement): void => {
    this.#refs.container.classList.add('rainbow')
    this.#refs.canvas.classList.add('rainbow__canvas')
    this.#refs.track.classList.add('rainbow__track')
    this.#refs.handler.classList.add('rainbow__handler')

    this.#refs.container.appendChild(this.#refs.canvas)
    this.#refs.container.appendChild(this.#refs.track)
    this.#refs.track.appendChild(this.#refs.handler)
    container.appendChild(this.#refs.container)

    this.draw()
    this.addListeners()
    this.moveTo(this.store.get().hue)
  }

  private draw = (): void => {
    if (!this.context) return

    this.#refs.canvas.width = this.#refs.canvas.offsetWidth
    this.#refs.canvas.height = this.#refs.canvas.offsetHeight

    const gradient = this.context.createLinearGradient(
      0,
      0,
      this.#refs.canvas.width,
      0
    )

    this.#state.colors.forEach((color, i, { length }) =>
      gradient.addColorStop(i / (length - 1), color.stringifyRGB())
    )

    this.context.fillStyle = gradient
    this.context.fillRect(
      0,
      0,
      this.#refs.canvas.width,
      this.#refs.canvas.height
    )

    this.setState(this.#state.x)
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

    this.#state.x = (x / width) * 100

    this.#refs.container.style.setProperty('--x', `${this.#state.x}%`)

    const h = this.#state.x / 100

    this.#state.color = new Color(h, 1, 1)

    this.#refs.container.style.setProperty(
      '--color',
      this.#state.color.stringifyRGB()
    )

    if (this.store.get().hue !== h) this.store.set({ hue: h })
  }

  /**
   * @param  {number} h - **Hue** from **0** to **1**
   * @returns void
   */
  private moveTo = (h: number): void => {
    const { left, width } = this.#refs.track.getBoundingClientRect()

    const clientX = left + h * width

    this.setState(clientX)
  }
}
