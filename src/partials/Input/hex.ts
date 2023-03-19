import { hex2rgb } from '../../utils/hex2rgb'
import { Color } from '../Color'

interface State {
  r: number
  g: number
  b: number
}

export class InputHex {
  #refs = {
    container: document.createElement('div'),
    input: document.createElement('input'),
  }

  #state: State = {
    r: 0,
    g: 0,
    b: 0,
  }

  constructor(private onChange: (state: State) => void) {
    this.prepare()
    this.addListeners()
  }

  private prepare = (): void => {
    this.#refs.container.classList.add('hex')
    this.#refs.input.type = 'text'
    this.#refs.container.appendChild(this.#refs.input)
  }

  private addListeners = (): void => {
    this.#refs.input.addEventListener('input', this.onInput)
  }

  private onInput = (event: Event): void => {
    if (
      !(event instanceof InputEvent) ||
      !(event.target instanceof HTMLInputElement)
    )
      return

    const { value } = event.target

    if (!(value.length === 3 || value.length === 6)) return

    const rgb = hex2rgb(value)

    if (!rgb) return

    this.#state.r = rgb.r
    this.#state.g = rgb.g
    this.#state.b = rgb.b

    console.log(rgb)

    this.onChange(rgb)
  }

  public mount = (container: HTMLElement): void => {
    container.appendChild(this.#refs.container)
  }

  public set = (color: Color): void => {
    const rgb = color.rgb

    if (
      (rgb.r === this.#state.r &&
        rgb.g === this.#state.g &&
        rgb.b === this.#state.b) ||
      this.#refs.input === document.activeElement
    )
      return

    const value = Object.entries(rgb).reduce<string>((result, [key, value]) => {
      this.#state[key as keyof State] = value

      const hex = value.toString(16)

      return result + hex.padStart(2, '0')
    }, '')

    this.#refs.input.value = value
  }
}
