import videojs from 'video.js';
import { version } from '../package.json';
import { appendSvgIcon } from './svg-icon-loader.js';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/component').default}
 */
const Button = videojs.getComponent('Button');

/**
 * A helper Video.js button component that supports various strategies
 * for displaying SVG icons.
 *
 * This component is intended to be extended by other custom buttons
 * that want to display an SVG icon via multiple possible inputs:
 *
 * - Raw SVG string
 * - SVGElement instance
 * - URL to an SVG file
 * - icon font via CSS
 * - experimental Video.js SVG icons
 */
class SvgButton extends Button {
  /**
   * Creates an instance of SvgButton.
   *
   * @param {import('video.js/dist/types/player.js').default} player The player instance.
   * @param {Object} options Configuration options for the button.
   * @param {SVGElement|string|URL} [options.icon] An optional icon to be loaded into the button.
   * Can be an SVGElement, a raw SVG string, or a URL to an SVG file.
   * @param {string} [options.iconName] An Optional icon name if using Video.js experimental icon support.
   */
  constructor(player, options) {
    super(player, options);
    this.appendIcon();
  }

  /**
   * Appends the configured icon to the button element.
   * Uses the `appendSvgIcon` helper to handle different icon input formats.
   *
   * Override this function to customize how the svg icon is appended.
   */
  appendIcon() {
    appendSvgIcon(this);
  }

  /**
   * Builds the CSS class name for the button element.
   *
   * @returns {string} The full CSS class string for this button.
   */
  buildCSSClass() {
    return `vjs-svg-button ${super.buildCSSClass()}`;
  }

  /**
   * Static getter for the component version.
   *
   * @returns {string} The current version of the SvgButton component.
   */
  static get VERSION() {
    return version;
  }
}

videojs.registerComponent('SvgButton', SvgButton);

export default SvgButton;
