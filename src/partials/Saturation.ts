import { Color } from './Color'
import { events } from '../utils/events'
import { Store } from '../Store'

export class Saturation {
  #refs = {
    container: document.createElement('div'),
    canvas: document.createElement('canvas'),
    handler: document.createElement('button'),
  }

  private get context() {
    return this.#refs.canvas.getContext('2d')
  }

  #state: {
    hue: number
    saturation: number
    value: number
    x: number
    y: number
  } = {
    hue: 1,
    saturation: 1,
    value: 1,
    x: 100,
    y: 0,
  }

  constructor(private store: Store) {
    this.store.listen((next, prev) => {
      if (next.hue !== prev.hue) this.draw(next.hue)
      if (
        next.saturation !== this.#state.saturation ||
        next.value !== this.#state.value
      ) {
        this.moteTo(next.saturation, next.value)
      }
    })
  }

  public mount = (container: HTMLElement): void => {
    this.#refs.container.classList.add('display')
    this.#refs.canvas.classList.add('display__canvas')
    this.#refs.handler.classList.add('display__handler')

    this.#refs.container.appendChild(this.#refs.canvas)
    this.#refs.container.appendChild(this.#refs.handler)
    container.appendChild(this.#refs.container)

    this.addListeners()

    const { saturation, value, hue } = this.store.get()

    this.draw(hue)
    this.moteTo(saturation, value)
  }

  private draw = (hue: number): void => {
    if (!this.context) return

    this.#state.hue = hue

    const { top, left, width, height } =
      this.#refs.canvas.getBoundingClientRect()

    this.#refs.canvas.width = width
    this.#refs.canvas.height = height

    const horizontal = this.context.createLinearGradient(
      0,
      0,
      this.#refs.canvas.width,
      0
    )

    const color = new Color(hue, 1, 1)

    horizontal.addColorStop(0, 'rgba(255, 255, 255, 1)')
    horizontal.addColorStop(1, color.stringifyRGB())

    this.context.fillStyle = horizontal
    this.context.fillRect(
      0,
      0,
      this.#refs.canvas.width,
      this.#refs.canvas.height
    )

    const vertical = this.context.createLinearGradient(
      0,
      0,
      0,
      this.#refs.canvas.height
    )

    vertical.addColorStop(1, 'rgba(0, 0, 0, 1)')
    vertical.addColorStop(0, 'rgba(0, 0, 0, 0)')

    this.context.fillStyle = vertical
    this.context.fillRect(
      0,
      0,
      this.#refs.canvas.width,
      this.#refs.canvas.height
    )

    this.setState(
      left + (this.#state.x * width) / 100,
      top + (this.#state.y * height) / 100
    )
  }

  private addListeners = (): void => {
    this.#refs.container.addEventListener(events().start, this.onStart)
  }

  private onStart = (e: Event): void => {
    if (!(e instanceof MouseEvent)) return

    this.setState(e.clientX, e.clientY)

    document.addEventListener(events().move, this.onMove)
    document.addEventListener(events().end, this.onEnd)
  }

  private onMove = (e: Event): void => {
    if (!(e instanceof MouseEvent)) return
    this.setState(e.clientX, e.clientY)
  }

  private onEnd = (e: Event): void => {
    if (!(e instanceof MouseEvent)) return

    this.setState(e.clientX, e.clientY)

    document.removeEventListener(events().move, this.onMove)
    document.removeEventListener(events().end, this.onEnd)
  }

  private setState = (clientX: number, clientY: number): void => {
    if (!this.context) return

    const { top, left, width, height } =
      this.#refs.container.getBoundingClientRect()

    const x = Math.min(width, Math.max(clientX - left, 0))

    const y = Math.min(height, Math.max(clientY - top, 0))

    this.#state.x = (x / width) * 100

    this.#state.y = (y / height) * 100

    this.#refs.container.style.setProperty('--x', `${this.#state.x}%`)
    this.#refs.container.style.setProperty('--y', `${this.#state.y}%`)

    this.#state.saturation = this.#state.x / 100
    this.#state.value = (100 - this.#state.y) / 100

    const color = new Color(
      this.#state.hue,
      this.#state.saturation,
      this.#state.value
    )

    this.#refs.container.style.setProperty('--color', color.stringifyRGB())

    const { saturation, value } = this.store.get()

    if (this.#state.saturation !== saturation || this.#state.value !== value)
      this.store.set({
        saturation: this.#state.saturation,
        value: this.#state.value,
      })
  }

  private moteTo = (saturation: number, value: number): void => {
    const { left, top, width, height } =
      this.#refs.canvas.getBoundingClientRect()

    const clientY = (-value * 100 + 100) * (height / 100) + top
    const clientX = saturation * 100 * (width / 100) + left

    this.setState(clientX, clientY)
  }
}
