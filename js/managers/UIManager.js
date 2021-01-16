import Logger from '../libs/Logger'
import Component from '../libs/Component'
import Observer from '../libs/Observer'

import { getAudioTimeFormat } from '../libs/Utils'
import { REPEAT, SHUFFLE } from '../constants'

const logger = Logger.getLogger('UIManager')

/**
 * DOM 객체를 다루는 UIManager Class
 * Observer 객체(싱글톤)를 통해 PlayListManager 및 AudioManager 통신
 */
class UIManager {
  constructor () {
    this.$observer = Observer

    // Info Element
    this.$cover = new Component('cover')
    this.$title = new Component('title')
    this.$artist = new Component('artist')

    // Progress Element
    this.$bar = new Component('bar')
    this.$currentTime = new Component('current')
    this.$totalTime = new Component('total')

    // Setting Element
    this.$repeat = new Component('repeat')
    this.$volume = new Component('volume')
    this.$shuffle = new Component('shuffle')
    this.$volBox = new Component('volume-box')
    this.$volUp = new Component('volume-up')
    this.$volDown = new Component('volume-down')
    this.$volBar = new Component('volume-bar')

    // Controller Element
    this.$play = new Component('play')
    this.$pause = new Component('pause')
    this.$next = new Component('next')
    this.$prev = new Component('prev')

    this.onClickPlay = this.onClickPlay.bind(this)
    this.onClickPause = this.onClickPause.bind(this)
    this.onClickNext = this.onClickNext.bind(this)
    this.onClickPrev = this.onClickPrev.bind(this)
    this.onClickRepeat = this.onClickRepeat.bind(this)
    this.onClickVolume = this.onClickVolume.bind(this)
    this.onClickShuffle = this.onClickShuffle.bind(this)
    this.onClickVolumeUp = this.onClickVolumeUp.bind(this)
    this.onClickVolumeDown = this.onClickVolumeDown.bind(this)
    this.moveVolume = this.moveVolume.bind(this)
    this.moveTime = this.moveTime.bind(this)
    this.setTime = this.setTime.bind(this)
    this.handlePlayStatus = this.handlePlayStatus.bind(this)
    this.handleNowPlaying = this.handleNowPlaying.bind(this)
    this.timeUpdate = this.timeUpdate.bind(this)
    this.percentUpdate = this.percentUpdate.bind(this)
    this.durationUpdate = this.durationUpdate.bind(this)
  }

  onClickPlay () {
    logger.start('onClickPlay()')
    this.$observer.notify('play')
    logger.end()
  }

  onClickPause () {
    logger.start('onClickPause()')
    this.$observer.notify('pause')
    logger.end()
  }

  onClickNext () {
    logger.start('onClickNext()')
    this.$observer.notify('next')
    logger.end()
  }

  onClickPrev () {
    logger.start('onClickPrev()')
    this.$observer.notify('prev')
    logger.end()
  }

  onClickRepeat () {
    logger.start('onClickRepeat()')
    let oldVal = this.$repeat.getValue()
    let newVal = (oldVal === REPEAT.ALL) ? REPEAT.ONE : (oldVal === REPEAT.ONE) ? REPEAT.OFF : REPEAT.ALL
    this.$observer.notify('repeat', newVal)
    this.$repeat.setValue(newVal)
    this.$repeat.setText(newVal === REPEAT.ONE ? 'repeat_one' : 'repeat')
    newVal === REPEAT.OFF 
      ? this.$repeat.removeClass('setting__button--on') 
      : this.$repeat.addClass('setting__button--on')
    logger.end()
  }

  onClickVolume () {
    logger.start('onClickVolume()')
    this.$volBox.visible
      ? (this.$volBox.hide(), this.$volume.removeClass('setting__button--on'))
      : (this.$volBox.show(), this.$volume.addClass('setting__button--on'))
    logger.end()
  }

  
  onClickVolumeUp () {
    logger.start('onClickVolumeUp()')
    let oldVal = this.$volBar.getValue()
    let newVal = Number(oldVal) + 10
    this.$volBar.setValue(newVal)
    if (newVal <= 100) {
      this.$observer.notify('volume', (newVal / 100))
    }
    logger.end()
  }

  onClickVolumeDown () {
    logger.start('onClickVolumeDown()')
    let oldVal = this.$volBar.getValue()
    let newVal = Number(oldVal) - 10
    this.$volBar.setValue(newVal)
    if (newVal >= 0) {
      this.$observer.notify('volume', (newVal / 100))
    }
    logger.end()
  }

  onClickShuffle () {
    logger.start('onClickShuffle()')
    let oldVal = this.$shuffle.getValue()
    let newVal = (oldVal === SHUFFLE.ON) ? SHUFFLE.OFF : SHUFFLE.ON
    this.$observer.notify('shuffle', newVal)
    this.$shuffle.setValue(newVal)
    newVal === SHUFFLE.OFF
      ? this.$shuffle.removeClass('setting__button--on')
      : this.$shuffle.addClass('setting__button--on')
    logger.end()
  }

  moveVolume () {
    // Throttle 적용
    if (!this.$throttleTimer) {
      this.$throttleTimer = setTimeout(() => {
        this.$throttleTimer = null
        logger.start('moveVolume()')
        this.$observer.notify('volume', (Number(this.$volBar.getValue()) / 100))
        logger.end()
      }, 200)
    }
  }

  moveTime () {
    logger.start('moveTime()')
    this.$observer.notify('updatable', false)
    this.timeUpdate((this.$bar.getValue() / 100) * this.$totalTime.getValue())
    logger.end()
  }

  setTime () {
    logger.start('setTime()')
    this.$observer.notify('updatable', true)
    this.$observer.notify('currentTime', this.$currentTime.getValue())
    logger.end()
  }

  handlePlayStatus (isPlaying) {
    logger.start('handlePlayStatus( isPlaying: ', isPlaying, ' )')
    isPlaying
      ? (this.$pause.show(), this.$play.hide())
      : (this.$play.show(), this.$pause.hide())
    logger.end()
  }

  handleNowPlaying (songInfo) {
    logger.start('handleNowPlaying( songInfo: ', songInfo, ' )')
    this.$cover.setSrc(songInfo.imageUrl)
    this.$title.setText(songInfo.title)
    this.$artist.setText(songInfo.artist)
    logger.end()
  }

  timeUpdate (currentTimeVal) {
    logger.start('timeUpdate( currentTimeVal: ', currentTimeVal, ' )')
    let audioTimeFormat = getAudioTimeFormat(currentTimeVal)
    this.$currentTime.setValue(currentTimeVal)
    this.$currentTime.setText(audioTimeFormat)
    logger.end()
  }

  percentUpdate (currentPercentVal) {
    logger.start('percentUpdate( currentTimeVal: ', currentPercentVal, ' )')
    this.$bar.setValue(currentPercentVal)
    logger.end()
  }

  durationUpdate (durationVal) {
    logger.start('durationUpdate()')
    let audioTimeFormat = getAudioTimeFormat(durationVal)
    this.$totalTime.setValue(durationVal)
    this.$totalTime.setText(audioTimeFormat)
    logger.end()
  }

  init () {
    logger.start('init()')
    this.$bar.bind('input', this.moveTime)
    this.$bar.bind('change', this.setTime)
    this.$volBar.bind('input', this.moveVolume)
    this.$play.bind('click', this.onClickPlay)
    this.$play.bind('click', this.onClickPlay)
    this.$pause.bind('click', this.onClickPause)
    this.$next.bind('click', this.onClickNext)
    this.$prev.bind('click', this.onClickPrev)
    this.$repeat.bind('click', this.onClickRepeat)
    this.$volume.bind('click', this.onClickVolume)
    this.$volUp.bind('click', this.onClickVolumeUp)
    this.$volDown.bind('click', this.onClickVolumeDown)
    this.$shuffle.bind('click', this.onClickShuffle)
    this.$observer.register('playStatus', this.handlePlayStatus)
    this.$observer.register('nowPlaying', this.handleNowPlaying)
    this.$observer.register('timeUpdated', this.timeUpdate)
    this.$observer.register('percentUpdated', this.percentUpdate)
    this.$observer.register('durationUpdated', this.durationUpdate)
    logger.end()
  }
  
  destroy () {
    logger.start('destroy()')
    this.$bar.unbind('input', this.moveTime)
    this.$bar.unbind('change', this.setTime)
    this.$volBar.unbind('input', this.moveVolume)
    this.$play.unbind('click', this.onClickPlay)
    this.$play.unbind('click', this.onClickPlay)
    this.$pause.unbind('click', this.onClickPause)
    this.$next.unbind('click', this.onClickNext)
    this.$prev.unbind('click', this.onClickPrev)
    this.$repeat.unbind('click', this.onClickRepeat)
    this.$volume.unbind('click', this.onClickVolume)
    this.$volUp.unbind('click', this.onClickVolumeUp)
    this.$volDown.unbind('click', this.onClickVolumeDown)
    this.$shuffle.unbind('click', this.onClickShuffle)
    this.$observer.unregister('playStatus', this.handlePlayStatus)
    this.$observer.unregister('nowPlaying', this.handleNowPlaying)
    this.$observer.unregister('timeUpdated', this.timeUpdate)
    this.$observer.unregister('percentUpdated', this.percentUpdate)
    this.$observer.unregister('durationUpdated', this.durationUpdate)
    logger.end()
  }

  static $instance
  static getInstance () {
    if (!this.$instance) {
      logger.start('create UIManager instance')
      this.$instance = new UIManager()
      logger.end()
    }

    return this.$instance
  }
}

export default UIManager.getInstance()