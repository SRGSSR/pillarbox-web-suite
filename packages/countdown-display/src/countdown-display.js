import videojs from 'video.js';
import { version } from '../package.json';
import Countdown from './countdown-component.js';
import CountdownUnit from './countdown-unit.js';
import './lang';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/modal-dialog').default}
 */
const ModalDialog = videojs.getComponent('ModalDialog');

/**
 * Represents a CountdownDisplay component for the Video.js player.
 *
 * This component wraps a Countdown inside a modal dialog. It handles
 * opening, closing, and resetting the countdown automatically when
 * the player starts, resets, disposes, or encounters an error.
 *
 * @property {typeof import('./countdown-component.js').default} Countdown
 */
class CountdownDisplay extends ModalDialog {
  /**
   * @private
   */
  reset_ = () => this.reset();

  /**
   * Creates an instance of a CountdownDisplay.
   *
   * @param {import('video.js/dist/types/player.js').default} player The player instance.
   * @param {Object} options Configuration options for the component.
   */
  constructor(player, options) {
    super(player, options);
    this.player().on(['loadstart', 'playerreset', 'dispose', 'error'], this.reset_);
  }

  /**
   * Disposes the component.
   */
  dispose() {
    this.reset();
    this.player().off(['loadstart', 'playerreset', 'dispose', 'error'], this.reset_);
    super.dispose();
  }

  /**
   * Builds the CSS class for the component.
   *
   * @returns {string} the CSS class name
   */
  buildCSSClass() {
    return `vjs-countdown-display ${super.buildCSSClass()}`;
  }

  /**
   * Resets the countdown timer.
   *
   * Clears the interval and closes the modal.
   */
  reset() {
    this.Countdown.reset();
    this.close();
  }

  /**
   * Starts the countdown timer.
   *
   * Opens the modal dialog and starts the countdown to the given timestamp.
   *
   * @param {number} timestamp The target timestamp in milliseconds
   * @param {string} source The source to play when the countdown ends
   */
  start(timestamp, source) {
    this.Countdown.start(timestamp, source);
    this.open();
  }

  /**
   * Returns the version of the component.
   *
   * @static
   * @returns {string} the version of the component
   */
  static get VERSION() {
    return version;
  }
}

CountdownDisplay.prototype.options_ = {
  pauseOnOpen: false,
  fillAlways: true,
  temporary: false,
  uncloseable: true,
  children: ['Countdown']
};

videojs.registerComponent('CountdownDisplay', CountdownDisplay);

export default CountdownDisplay;
export { Countdown, CountdownUnit };
