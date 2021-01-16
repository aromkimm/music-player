import Logger from '../libs/Logger'
import Observer from '../libs/Observer'

import { REPEAT, SHUFFLE } from '../constants'

const logger = Logger.getLogger('PlayListManager')

/**
 * 플레이리스트를 관리하는 PlayListManager Class
 * Observer 객체(싱글톤)를 통해 UIManager 및 AudioManager 통신
 */
class PlayListManager {
  constructor () {
    this.$observer = Observer

    this.$playList = []
    this.$randomList = null

    this.$songIndex = 0
    this.$shuffle = false
    this.$repeatAll = false

    this.prev = this.prev.bind(this)
    this.next = this.next.bind(this)
    this.checkNext = this.checkNext.bind(this)
    this.setRepeatAll = this.setRepeatAll.bind(this)
    this.setShuffle = this.setShuffle.bind(this)
  }

  async getPlayList () {
    logger.start('getPlayList()')
    let response = await fetch(`${process.env.NODE_ENV === 'development' ? '' : '../music-player'}/mock/playlist.json`)
    let json = await response.json()
    let list = json.data
    logger.end('list: ', list)
    return list
  }

  prev () {
    logger.start('prev()')
    this.$songIndex -= 1
    if (this.$songIndex < 0) {
      if (this.$shuffle) {
        this.$songIndex = this.$randomList[++this.$songIndex]
        this.createRandomList()
      }
      this.$songIndex = this.$playList.length - 1
    }
    this.notifyNowPlaying()
    logger.end()
	}

	next () {
    logger.start('next()')
    this.$songIndex += 1
    if (this.$songIndex > this.$playList.length - 1) {
      if (this.$shuffle) {
        this.$songIndex = this.$randomList[--this.$songIndex]
        this.createRandomList()
        this.$songIndex = 1
      } else {
        this.$songIndex = 0
      }
    }
    this.notifyNowPlaying()
    logger.end()
  }

  checkNext () {
    logger.start('checkNext()')
    if (this.$repeatAll || this.$songIndex < this.$playList.length - 1) {
      this.next()
    }
    logger.end()
  }

  setRepeatAll (repeatType) {
    logger.start('setRepeatAll()')
    this.$repeatAll = repeatType === REPEAT.ALL
    logger.end('result: ', this.$repeatAll)
  }

  setShuffle (shuffle) {
    logger.start('setShuffle()')
    this.$shuffle = shuffle === SHUFFLE.ON
    if (this.$shuffle) {
      if (!this.$randomList || this.$randomList[0] !== this.$randomList[this.$songIndex]) {
        this.createRandomList()
        this.$songIndex = 0
      }
    } else {
      this.$songIndex = this.$randomList[this.$songIndex]
    }
    logger.end('result: ', this.$shuffle)
  }

  createRandomList () {
    logger.start('createRandomList()')
    let randomList = []
    for (let i = 0; i < this.$playList.length; i++) {
      if (i === this.$songIndex) continue 
      randomList.push(i)
    }
    for (let i = randomList.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1))
      let temp = randomList[i]
      randomList[i] = randomList[j]
      randomList[j] = temp
    }
    randomList.unshift(this.$songIndex)
    this.$randomList = randomList
    logger.end('result: ', randomList)
  }

  notifyNowPlaying () {
    let songIndex = this.$shuffle ? this.$randomList[this.$songIndex] : this.$songIndex
    this.$observer.notify('nowPlaying', this.$playList[songIndex])
  }

  async init () {
    logger.start('init()')
    this.$playList = await this.getPlayList()
    this.$observer.register('next', this.next)
    this.$observer.register('prev', this.prev)
    this.$observer.register('ended', this.checkNext)
    this.$observer.register('repeat', this.setRepeatAll)
    this.$observer.register('shuffle', this.setShuffle)
    this.notifyNowPlaying()
    logger.end()
  }
  
  destroy () {
    logger.start('destroy()')
    this.$observer.unregister('next', this.next)
    this.$observer.unregister('prev', this.prev)
    this.$observer.unregister('ended', this.checkNext)
    this.$observer.unregister('repeat', this.setRepeatAll)
    this.$observer.unregister('shuffle', this.setRepeatAll)
    logger.end()
  }

  static $instance
  static getInstance () {
    if (!this.$instance) {
      logger.start('create PlayListManager instance')
      this.$instance = new PlayListManager()
      logger.end()
    }

    return this.$instance
  }
}

export default PlayListManager.getInstance()