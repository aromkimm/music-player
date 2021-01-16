import Logger from './libs/Logger'

import AudioManager from './managers/AudioManager'
import UIManager from './managers/UIManager'
import PlayListManager from './managers/PlayListManager'

const logger = Logger.getLogger('MusicPlayer')

class MusicPlayer {
  constructor () {
    this.$uiManager = UIManager
    this.$audioManager = AudioManager
    this.$playListManager = PlayListManager
  }

  init () {
    this.$uiManager.init()
    this.$audioManager.init()
    this.$playListManager.init()
  }

  destroy () {
    this.$uiManager.destroy()
    this.$audioManager.destroy()
    this.$playListManager.destroy()
  }

  static $instance
  static getInstance () {
    if (!this.$instance) {
      logger.start('create MusicPlayer instance')
      this.$instance = new MusicPlayer()
      if (process.env.NODE_ENV === 'development') {
        window.musicPlayer = this.$instance
      }
      logger.end()
    }

    return this.$instance
  }
}

export default MusicPlayer.getInstance()