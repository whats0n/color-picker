import { Color } from '../Color'

interface State {
  r: number
  g: number
  b: number
  a: number
}

export class InputRGBA {
  #refs = {
    container: document.createElement('div'),
    r: document.createElement('input'),
    g: document.createElement('input'),
    b: document.createElement('input'),
    a: document.createElement('input'),
  }

  #state: State = {
    r: 0,
    g: 0,
    b: 0,
    a: 0,
  }

  constructor(private onChange: (key: keyof State, state: State) => void) {
    this.prepare()
    this.addListeners()
  }

  private prepare = (): void => {
    this.#refs.container.classList.add('rgba')

    Object.entries(this.#refs).forEach(([key, el]) => {
      if (el instanceof HTMLInputElement) {
        el.type = 'text'
        el.dataset.rgba = key
        el.inputMode = 'numeric'
        el.minLength = 0
        el.maxLength = key === 'a' ? 100 : 255
        this.#refs.container.appendChild(el)
      }
    })
  }

  private addListeners = (): void => {
    this.#refs.r.addEventListener('input', this.onInput.bind(this, 255, 'r'))
    this.#refs.g.addEventListener('input', this.onInput.bind(this, 255, 'g'))
    this.#refs.b.addEventListener('input', this.onInput.bind(this, 255, 'b'))
    this.#refs.a.addEventListener('input', this.onInput.bind(this, 100, 'a'))
  }

  private onInput = (max: number, key: keyof State, event: Event): void => {
    if (
      !(event instanceof InputEvent) ||
      !(event.target instanceof HTMLInputElement)
    )
      return

    const min = 0

    const value = event.target.value.replace(/\D/g, '')

    const maxLength = `${max}`.length

    const realValue =
      +value > max
        ? max
        : +value < min
        ? min
        : value.length > maxLength
        ? value.substring(0, maxLength)
        : value

    event.target.value = `${realValue}`

    this.#state[key] = +realValue

    this.onChange(key, this.#state)
  }

  public mount = (container: HTMLElement): void => {
    container.appendChild(this.#refs.container)
  }

  public set = (color: Color): void => {
    Object.entries(color.rgb).forEach(([key, value]) => {
      this.#state[key as keyof State] = value
      this.#refs[key as keyof State].value = `${value}`
    })
  }

  /**
   * @param  {number} a - **Alpha** from **0** to **1**
   * @returns void
   */
  public setAlpha = (a: number): void => {
    this.#state.a = Math.round(a * 100)
    this.#refs.a.value = `${this.#state.a}`
  }
}
