import videojs from 'video.js';
import { version } from '../package.json';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/button').default}
 */
const BigPlayButton = videojs.getComponent('BigPlayButton');

/**
 * Represents a BigReplayButton component for the videojs player.
 */
class BigReplayButton extends BigPlayButton {
  /**
   * Creates an instance of a BigReplayButton.
   *
   * @param {import('video.js/dist/types/player.js').default} player The player instance.
   * @param {Object} options Configuration options for the component.
   */
  constructor(player, options) {
    super(player, options);
    this.controlText('Replay');
    this.setIcon('replay');
  }

  buildCSSClass() {
    return `${super.buildCSSClass()} pbw-big-replay-button`;
  }

  static get VERSION() {
    return version;
  }
}

videojs.registerComponent('BigReplayButton', BigReplayButton);

export default BigReplayButton;
