import Logger from './Logger'

const logger = Logger.getLogger('Observer')

class Observer {
  constructor () {
    this.$handlers = {}
  }

  register (event, handler) {
    logger.start('register( event: ', event, ' )')
    let handlerArray = this.$handlers[event]
    if (undefined === handlerArray) {
      this.$handlers[event] = []
      handlerArray = this.$handlers[event]
    }
    handlerArray.push(handler)
    logger.end()
  }

  unregister (event, handler) {
    logger.start('unregister( event: ', event, ' )')
    let handlerArray = this.$handlers[event]
    if (undefined === handlerArray) {
      logger.end()
      return
    }
    for (let i = 0; i < handlerArray.length; i++) {
      let handlerItem = handlerArray[i]
      if (handler === handlerItem['handler']) {
        handlerArray.splice(i, 1)
        return
      }
    }
    logger.end()
  }

  notify (event, data) {
    logger.start('notify( event: ', event, ', data: ', data, ' )')
    let handlerArray = this.$handlers[event]
    if (undefined === handlerArray) {
      logger.end()
      return
    }
    for (let handler of handlerArray) {
      if (handler instanceof Function) {
        handler(data)
      }
    }
    logger.end()
  } 

  static $instance
  static getInstance () {
    if (!this.$instance) {
      logger.start('create Observer instance')
      this.$instance = new Observer()
      logger.end()
    }

    return this.$instance
  }
}

export default Observer.getInstance()