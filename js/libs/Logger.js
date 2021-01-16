import { getTimeString } from './Utils'

const IS_DEV = process.env.NODE_ENV === 'development'

export const LOG_LEVELS = {
  VERBOSE: 0,
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4
}

// 기본 로그레벨 정의
const DEFAULT_LOG_LEVEL = IS_DEV ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO

/**
 * 로깅 유틸리티 클래스
 * (로깅 라이브러리를 투명하게 사용하기 위한 wrapping 유틸리티)
 * (참고) 메소드 정의 순서가 log level 순서이다.
 *       (trace -> debug -> info -> warn -> error)
 * @class
 */
export class Logger {
  $namespace
  $logLevel

  /**
   * @constructor
   * @param {*} namespace
   */
  constructor (
    namespace,
    logLevel = DEFAULT_LOG_LEVEL
  ) {
    this.$namespace = namespace
    this.setLogLevel(logLevel)
  }

  setLogLevel (level) {
    if (Object.keys(LOG_LEVELS).filter(key => LOG_LEVELS[key] === level).length > 0) {
      this.$logLevel = level
    }
  }

  /**
   * 루틴의 시작 부분을 로깅을 위한 편의 함수
   * @param {*} msgs
   */
  start (...msgs) {
    let message = `${this._getPrefix()} `
    for (let i = 0, max = msgs.length; i < max; i++) {
      let msg = msgs[i]
      message += (typeof msg !== 'string') ? JSON.stringify(msg) : msg
    }
    console.group(message)
  }

  /**
   * 루틴의 종료 부분을 로깅을 위한 편의 함수
   * @param {*} msgs
   */
  end (...msgs) {
    if (msgs && msgs.length > 0) {
      this.info(...msgs)
    }
    console.groupEnd()
  }

  /**
   * log 출력. log는 로그레벨에 관계없이 출력됨
   * @param {*} msgs
   */
  log (...msgs) {
    let message = ''
    for (let i = 0, max = msgs.length; i < max; i++) {
      let msg = msgs[i]
      message += (typeof msg !== 'string') ? JSON.stringify(msg) : msg
    }
    console.log(this._getPrefix('LOG') + message)
  }

  trace (...msgs) {
    if (this._checkLogLevel(LOG_LEVELS.VERBOSE)) {
      let message = ''
      for (let i = 0, max = msgs.length; i < max; i++) {
        let msg = msgs[i]
        message += (typeof msg !== 'string') ? JSON.stringify(msg) : msg
      }
      console.trace(this._getPrefix('TRACE') + message)
    }
  }

  debug (...msgs) {
    if (this._checkLogLevel(LOG_LEVELS.DEBUG)) {
      let message = ''
      for (let i = 0, max = msgs.length; i < max; i++) {
        let msg = msgs[i]
        message += (typeof msg !== 'string') ? JSON.stringify(msg) : msg
      }
      console.debug(this._getPrefix('DEBUG') + message)
    }
  }

  info (...msgs) {
    if (this._checkLogLevel(LOG_LEVELS.INFO)) {
      let message = ''
      for (let i = 0, max = msgs.length; i < max; i++) {
        let msg = msgs[i]
        message += (typeof msg !== 'string') ? JSON.stringify(msg) : msg
      }
      console.info(this._getPrefix('INFO') + message)
    }
  }

  warn (...msgs) {
    if (this._checkLogLevel(LOG_LEVELS.WARN)) {
      let message = ''
      for (let i = 0, max = msgs.length; i < max; i++) {
        let msg = msgs[i]
        message += (typeof msg !== 'string') ? JSON.stringify(msg) : msg
      }
      console.warn(this._getPrefix('WARN') + message)
    }
  }

  error (...msgs) {
    if (this._checkLogLevel(LOG_LEVELS.ERROR)) {
      let message = ''
      for (let i = 0, max = msgs.length; i < max; i++) {
        let msg = msgs[i]
        message += (typeof msg !== 'string') ? JSON.stringify(msg) : msg
      }
      console.error(this._getPrefix('ERROR') + message)
    }
  }

  _checkLogLevel (logLevel) {
    return this.$logLevel <= logLevel
  }

  _getPrefix (category) {
    return `[${this.$namespace}][${getTimeString(new Date(), true)}]${category ? ' [' + category + ']' : ''} > `
  }

  static getLogger (namespace, logLevel) {
    return new Logger(namespace, logLevel)
  }
}

export default Logger
