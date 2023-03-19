import { Color } from './partials/Color'
import { Hue } from './partials/Hue'
import { Input } from './partials/Input'
import { Opacity } from './partials/Opacity'
import { Saturation } from './partials/Saturation'
import { Store } from './Store'

interface OnChangeProps {
  rgba: string
  hex: string
}

interface OnChange {
  (props: OnChangeProps): void
}

export class ColorPicker {
  #store = new Store()

  private hue: Hue
  private opacity: Opacity
  private saturation: Saturation
  private input: Input

  constructor(public container: HTMLElement, onChange?: OnChange) {
    this.hue = new Hue(this.#store)
    this.saturation = new Saturation(this.#store)
    this.opacity = new Opacity(this.#store)
    this.input = new Input(this.#store)

    this.#store.listen((state) => {
      const color = new Color(
        state.hue,
        state.saturation,
        state.value,
        state.alpha
      )

      if (typeof onChange === 'function')
        onChange({
          rgba: color.stringifyRGBA(),
          hex: color.stringifyHexA(),
        })
    })

    this.mount()
  }

  private mount = (): void => {
    this.container.classList.add('color-picker')
    this.saturation.mount(this.container)
    this.hue.mount(this.container)
    this.opacity.mount(this.container)
    this.input.mount(this.container)
  }
}
