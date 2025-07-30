import videojs from 'video.js';
import { version } from '../package.json';
import { loadSvgElement } from '@srgssr/web-suite-utils';
import './lang';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/button').default}
 */
const Button = videojs.getComponent('Button');

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/utils/log.js').default}
 */
const log = videojs.log.createLogger('airplay-button');

/**
 * Represents a AirplayButton component for the videojs player.
 */
class AirplayButton extends Button {
  /**
   * Listener for detecting AirPlay device availability.
   * If an AirPlay device is available, the button is shown.
   *
   * @param {{ availability: string }} event - The event object with availability info.
   */
  #onWebkitPlaybackTargetAvailabilityChangedListener = ({ availability }) => {
    if (availability === 'available') {
      this.show();
    } else if (availability === 'not-available') {
      this.hide();
    }
  };

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
    options = videojs.obj.merge({ controlText: 'Use AirPlay' }, options);
    super(player, options);
    this.init();
  }

  dispose() {
    this.#mediaElement?.removeEventListener(
      'webkitplaybacktargetavailabilitychanged',
      this.#onWebkitPlaybackTargetAvailabilityChangedListener
    );
    this.#mediaElement = null;

    super.dispose();
  }

  /**
   * Initializes the AirplayButton by checking for support and
   * registering the device availability event listener.
   */
  init() {
    this.hide();
    this.setIcon('airplay');
    this.appendIcon(this.el());

    if (!AirplayButton.isAirplaySupported()) {
      return;
    }

    this.#mediaElement = this.player().el().querySelector('audio, video');
    this.#mediaElement.addEventListener(
      'webkitplaybacktargetavailabilitychanged',
      this.#onWebkitPlaybackTargetAvailabilityChangedListener
    );
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
   * Asynchronously loads the SVG element based on the icon option.
   *
   * Override or extend this method in subclasses to customize how the SVG
   * element is loaded.
   *
   * @returns {Promise<SVGElement>} A promise that resolves to the loaded SVG element.
   */
  async loadSvgElement() {
    return loadSvgElement(this.options().icon);
  }

  /**
   * Appends the SVG icon to the button element, if a valid icon is provided.
   *
   * @param {HTMLElement} el - The parent element to which the icon should be appended.
   */
  appendIcon(el) {
    if (!this.options().icon) {
      return;
    }

    this.loadSvgElement().then(svg => {
      const placeholder = el.querySelector('.vjs-icon-placeholder');

      if (placeholder) {
        svg.classList.toggle('icon-from-options', true);
        placeholder.innerHTML = '';
        placeholder.appendChild(svg);
      }
    }, reason => {
      log.error(`There was a problem loading the provided SVG Icon`, reason);
    });
  }

  /**
   * Builds the CSS class string for the button.
   *
   * @returns {string} The CSS class string.
   */
  buildCSSClass() {
    return `vjs-airplay-button ${super.buildCSSClass()}`;
  }

  static get VERSION() {
    return version;
  }
}

videojs.registerComponent('AirplayButton', AirplayButton);

export default AirplayButton;
