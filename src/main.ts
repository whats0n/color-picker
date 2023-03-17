import './style.scss'
import { ColorPicker } from './ColorPicker'

const container = document.querySelector<HTMLElement>('.js-color-picker')

if (container) new ColorPicker(container)
