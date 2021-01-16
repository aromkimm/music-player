import Logger from '../libs/Logger'
import Observer from '../libs/Observer'

import { REPEAT } from '../constants'

const logger = Logger.getLogger('AudioManager')

/**
 * Audio 객체를 다루는 AudioManager Class
 * Observer 객체(싱글톤)를 통해 PlayListManager 및 UIManager 통신
 */
class AudioManager {
  constructor () {
    this.$observer = Observer

    this.$audio = new Audio()
    this.$audio.autoplay = false
    this.$audio.loop = false
    this.$audioPlaying = false
    this.$audioTimeUpdatable = true
    this.$audioCurrentTime = 0
    this.$audioDuration = 0

    this.play = this.play.bind(this)
    this.pause = this.pause.bind(this)
    this.setSong = this.setSong.bind(this)
    this.setLoop = this.setLoop.bind(this)
    this.setVolume = this.setVolume.bind(this)
    this.setCurrentTime = this.setCurrentTime.bind(this)
    this.setUpdatable = this.setUpdatable.bind(this)

    this.onPlay = this.onPlay.bind(this)
    this.onPause = this.onPause.bind(this)
    this.onCanplay = this.onCanplay.bind(this)
    this.onTimeupdate = this.onTimeupdate.bind(this)
    this.onDurationchange = this.onDurationchange.bind(this)
    this.onEnded = this.onEnded.bind(this)
    this.onError = this.onError.bind(this)
  }

  play () {
    logger.start('play()')
    this.$audio.src 
      ? this.$audio.play() 
      : logger.error('재생할 곡이 없음')
    logger.end()
  }

  pause () {
    logger.start('pause()')
    this.$audio.pause()
    logger.end()
	}

  setSong (song) {
    logger.start('setSong( songUrl: ', song.songUrl, ' )')
    if (this.$audioPlaying) this.pause()
    this.$audio.src = song.songUrl
    logger.end()
  }

  setLoop (loop) {
    logger.start('setLoop( loop: ', loop, ' )')
    this.$audio.loop = (loop === REPEAT.ONE) ? true : false
    logger.end()
  }

  setVolume (volume) {
    logger.start('setVolume( volume: ', volume, ' )')
    this.$audio.volume = volume
    logger.end()
  }

  setCurrentTime (time) {
    logger.start('setCurrentTime( time: ', time, ' )')
    this.$audio.currentTime = time
    logger.end()
  }

  setUpdatable (isUpdatable) {
    logger.start('setUpdatable( isUpdatable: ', isUpdatable, ' )')
    this.$audioTimeUpdatable = isUpdatable
    logger.end()
  }

  onPlay () {
    logger.start('onPlay()')
    this.$audioPlaying = true
    this.$observer.notify('playStatus', true)
    logger.end()
  }

  onPause () {
    logger.start('onPause()')
    this.$audioPlaying = false
    this.$observer.notify('playStatus', false)
    logger.end()
  }

  onCanplay () {
    logger.start('onCanplay()')
    this.play()
    logger.end()
  }

  onTimeupdate () {
    let audioCurrentTime = parseInt(this.$audio.currentTime)
    if (!this.$audioTimeUpdatable) return
    if (this.$audioCurrentTime === audioCurrentTime) return
    this.$audioCurrentTime = audioCurrentTime
    this.$observer.notify('timeUpdated', this.$audioCurrentTime)
    this.$observer.notify('percentUpdated', parseInt((this.$audioCurrentTime / this.$audioDuration) * 100))
  }

  onDurationchange () {
    logger.start('onDurationchange()')
    this.$audioDuration = parseInt(this.$audio.duration)
    this.$observer.notify('durationUpdated', this.$audioDuration)
    logger.end()
  }

  onEnded () {
    logger.start('onEnded()')
    this.$observer.notify('playStatus', false)
    this.$observer.notify('ended')
    logger.end()
  }

  onError () {
    logger.start('onError()')
    this.$observer.notify('playStatus', false)
    logger.error('에러 발생')
    logger.end()
  }

  async init () {
    logger.start('init()')
    this.$observer.notify('playStatus', false)
    this.$observer.register('play', this.play)
    this.$observer.register('pause', this.pause)
    this.$observer.register('volume', this.setVolume)
    this.$observer.register('nowPlaying', this.setSong)
    this.$observer.register('updatable', this.setUpdatable)
    this.$observer.register('currentTime', this.setCurrentTime)
    this.$observer.register('repeat', this.setLoop)
    this.$audio.addEventListener('play', this.onPlay)
    this.$audio.addEventListener('pause', this.onPause)
    this.$audio.addEventListener('canplay', this.onCanplay)
    this.$audio.addEventListener('timeupdate', this.onTimeupdate)
    this.$audio.addEventListener('durationchange', this.onDurationchange)
    this.$audio.addEventListener('ended', this.onEnded)
    this.$audio.addEventListener('error', this.onError)
    logger.end()
  }
  
  destroy () {
    logger.start('destroy()')
    this.$observer.unregister('play', this.play)
    this.$observer.unregister('pause', this.pause)
    this.$observer.unregister('volume', this.setVolume)
    this.$observer.unregister('nowPlaying', this.setSong)
    this.$observer.unregister('updatable', this.setUpdatable)
    this.$observer.unregister('currentTime', this.setCurrentTime)
    this.$observer.unregister('repeat', this.setLoop)
    this.$audio.removeEventListener('play', this.onPlay)
    this.$audio.removeEventListener('pause', this.onPause)
    this.$audio.removeEventListener('canplay', this.onCanplay)
    this.$audio.removeEventListener('timeupdate', this.onTimeupdate)
    this.$audio.removeEventListener('durationchange', this.onDurationchange)
    this.$audio.removeEventListener('ended', this.onEnded)
    this.$audio.removeEventListener('error', this.onError)
    logger.end()
  }

  static $instance
  static getInstance () {
    if (!this.$instance) {
      logger.start('create AudioManager instance')
      this.$instance = new AudioManager()
      logger.end()
    }

    return this.$instance
  }
}

export default AudioManager.getInstance()