import { events } from '../utils/events'

interface OnChange {
  (progress: number): void
}

interface OnMounted {
  (): void
}

interface Props {
  onChange: OnChange
  onMounted: OnMounted
}

export class Handler {
  public refs = {
    container: document.createElement('div'),
    track: document.createElement('div'),
    pointer: document.createElement('button'),
  }

  constructor(private props: Props) {}

  public mount = (container: HTMLElement): void => {
    this.refs.container.classList.add('handler')
    this.refs.track.classList.add('handler__track')
    this.refs.pointer.classList.add('handler__pointer')

    this.refs.pointer.type = 'button'

    this.refs.container.appendChild(this.refs.track)
    this.refs.track.appendChild(this.refs.pointer)
    container.appendChild(this.refs.container)

    this.addListeners()
    this.props.onMounted()
  }

  private addListeners = (): void => {
    this.refs.container.addEventListener(events().start, this.onStart)
    this.refs.pointer.addEventListener('keydown', this.onPointer)
  }

  private onStart = (e: Event): void => {
    if (!(e instanceof MouseEvent)) return

    this.moveTo(e.clientX)

    document.addEventListener(events().move, this.onMove)
    document.addEventListener(events().end, this.onEnd)
  }

  private onMove = (e: Event): void => {
    if (!(e instanceof MouseEvent)) return
    this.moveTo(e.clientX)
  }

  private onEnd = (e: Event): void => {
    if (!(e instanceof MouseEvent)) return

    this.moveTo(e.clientX)

    document.removeEventListener(events().move, this.onMove)
    document.removeEventListener(events().end, this.onEnd)
  }

  private onPointer = (e: Event): void => {
    if (
      !(e instanceof KeyboardEvent) ||
      !(e.key === 'ArrowRight' || e.key === 'ArrowLeft')
    )
      return

    const progress = +this.refs.container.style.getPropertyValue('--progress')
    const nextProgress = e.key === 'ArrowRight' ? progress + 1 : progress - 1

    this.setProgress(nextProgress / 100)
  }

  private moveTo = (clientX: number): void => {
    const { left, width } = this.refs.track.getBoundingClientRect()

    const x = Math.min(width, Math.max(clientX - left, 0))

    const progress = x / width

    this.refs.container.style.setProperty('--progress', `${progress}`)

    this.props.onChange(progress)
  }

  /**
   * @param  {number} progress - **Progress** from **0** to **1**
   * @returns void
   */
  public setProgress = (progress: number): void => {
    const { left, width } = this.refs.track.getBoundingClientRect()

    const clientX = left + progress * width

    this.moveTo(clientX)
  }
}
