type State = Record<'hue' | 'saturation' | 'value' | 'alpha', number>

interface Listener {
  (nextState: State, prevState: State): void
}

export class Store {
  #state: State = {
    hue: 0,
    saturation: 1,
    value: 1,
    alpha: 1,
  }

  #listeners: Listener[] = []

  public set = (state: Partial<State>): void => {
    const prev = { ...this.#state }
    const next = { ...prev, ...state }

    const isEqual = Object.entries(prev).every(
      ([key, value]) => next[key as keyof State] === value
    )

    if (isEqual) return

    this.#state = next

    this.#listeners.forEach((listener) => listener(this.#state, prev))
  }

  public get = (): State => this.#state

  public listen = (listener: Listener): void => {
    this.#listeners.push(listener)
  }
}
