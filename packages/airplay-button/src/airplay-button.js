import videojs from 'video.js';
import '@srgssr/svg-button';
import { version } from '../package.json';
import './lang';

/**
 * @ignore
 * @type {typeof import('@srgssr/svg-button').SvgButton}
 */
const SvgButton = videojs.getComponent('SvgButton');

/**
 * Represents a AirplayButton component for the videojs player.
 */
class AirplayButton extends SvgButton {
  /**
   * The media element associated to the player.
   *
   * @type {HTMLMediaElement|null}
   */
  #mediaElement;

  /**
   * Creates an instance of a AirplayButton.
   *
   * @param {import('video.js/dist/types/player.js').default} player The player instance.
   * @param {Object} options Configuration options for the component.
   */
  constructor(player, options) {
    super(player, options);
    this.init();
  }

  dispose() {
    this.#mediaElement = null;

    super.dispose();
  }

  /**
   * Initializes the AirplayButton by checking for support and
   * registering the device availability event listener.
   */
  init() {
    if (!AirplayButton.isAirplaySupported()) {
       this.hide();

      return;
    }

    this.#mediaElement = this.player().tech(true).el();
    this.show();
  }

  /**
   * Handles click events on the AirplayButton.
   *
   * @param {Event} event The click event.
   */
  handleClick(event) {
    super.handleClick(event);
    this.#mediaElement?.webkitShowPlaybackTargetPicker();
  }

  /**
   * Checks whether the current environment supports AirPlay.
   *
   * @returns {boolean} True if AirPlay is supported, false otherwise.
   */
  static isAirplaySupported() {
    return !!window.WebKitPlaybackTargetAvailabilityEvent;
  }

  /**
   * Builds the CSS class string for the button.
   *
   * @returns {string} The CSS class string.
   */
  buildCSSClass() {
    return `vjs-airplay-button vjs-hidden ${super.buildCSSClass()}`;
  }

  static get VERSION() {
    return version;
  }
}

AirplayButton.prototype.options_ = {
  controlText: 'Use AirPlay',
  iconName: 'airplay'
};

videojs.registerComponent('AirplayButton', AirplayButton);

export default AirplayButton;
