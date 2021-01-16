import Logger from './Logger'

const logger = Logger.getLogger('Component')

const hasTouch = 'ontouchstart' in window

const events = {
  click: 'click',
  change: 'change',
  input: 'input',
  startEvent: hasTouch ? 'touchstart' : 'mousedown',
  moveEvent: hasTouch ? 'touchmove' : 'mousemove',
  endEvent: hasTouch ? 'touchend' : 'mouseup',
  cancelEvent: hasTouch ? 'touchcancel' : 'mouseup'
}

export default class Component {
  constructor (id) {
    logger.debug('create component: ', id)
    this.$id = id
    this.$element = document.querySelector(`#${id}`)
  }

  qs (selector) {
    return this.$element.querySelector(selector)
  }

  show () {
    this.$element.style.display = ''
  }

  hide () {
    this.$element.style.display = 'none'
  }

  addClass (className) {
    this.$element.classList.add(className)
  }

  removeClass (className) {
    this.$element.classList.remove(className)
  }

  setText (text) {
    this.$element.innerText = text
  }

  setSrc (src) {
    this.$element.src = src
  }

  getValue () {
    return this.$element.hasAttribute('value')
      ? this.$element.value 
      : this.$element.dataset.value
  }

  setValue (value) {
    this.$element.hasAttribute('value')
      ? this.$element.value = value
      : this.$element.dataset.value = value
  }

  /**
   * readonly
   */
  get visible () {
    return this.$element.style.display !== 'none'
  }

  bind (eventName, handler) {
    logger.start('bind( component:', this.$id, ', event:', eventName, ' )')
    this.$element.addEventListener(events[eventName], handler)
    logger.end()
  }

  unbind (eventName, handler) {
    logger.start('unbind( component:', this.$id, ' event:', eventName, ')')
    this.$element.removeEventListener(events[eventName], handler)
    logger.end()
  }
}
