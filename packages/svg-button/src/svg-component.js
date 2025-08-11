import videojs from 'video.js';
import { version } from '../package.json';
import { appendSvgIcon } from './svg-icon-loader.js';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/component').default}
 */
const Component = videojs.getComponent('Component');

/**
 * A helper Video.js component that supports various strategies
 * for displaying SVG icons.
 *
 * This component is intended to be extended by other custom components
 * that want to display an SVG icon via multiple possible inputs:
 *
 * - Raw SVG string
 * - SVGElement instance
 * - URL to an SVG file
 * - icon font via CSS
 * - experimental Video.js SVG icons
 */
class SvgComponent extends Component {
  /**
   * Creates an instance of SvgComponent.
   *
   * @param {import('video.js/dist/types/player.js').default} player The player instance.
   * @param {Object} options Configuration options for the component.
   * @param {SVGElement|string|URL} [options.icon] An optional icon to be loaded into the component.
   * Can be an SVGElement, a raw SVG string, or a URL to an SVG file.
   * @param {string} [options.iconName] An Optional icon name if using Video.js experimental icon support.
   */
  constructor(player, options) {
    super(player, options);
    this.appendIcon();
  }

  /**
   * Appends the configured icon to the component element.
   * Uses the `appendSvgIcon` helper to handle different icon input formats.
   *
   * Override this function to customize how the svg icon is appended.
   */
  appendIcon() {
    appendSvgIcon(this);
  }

  /**
   * Creates the DOM element for this component.
   *
   * This overrides the base `createEl` to:
   * - Apply the component's CSS class.
   * - Add a `.vjs-icon-placeholder` span if experimental SVG icons are not enabled.
   *
   * @param {string} [tag] The HTML tag name to use for the element (defaults to `'div'` if not specified by super).
   * @param {Object} [props={}] An object of element properties (such as `className`).
   * @param {Object} [attributes={}]  An object of element attributes (such as `aria-hidden`).
   *
   * @returns {Element} The created DOM element for this component.
   */
  createEl(tag, props = {}, attributes = {}) {
    props = Object.assign({ className: this.buildCSSClass() }, props);

    const el = super.createEl(tag, props, attributes);

    if (!this.player_.options_.experimentalSvgIcons) {
      el.appendChild(videojs.dom.createEl('span', {
        className: 'vjs-icon-placeholder'
      }, {
        'aria-hidden': true
      }));
    }

    return el;
  }

  /**
   * Builds the CSS class name for the component element.
   *
   * @returns {string} The full CSS class string for this component.
   */
  buildCSSClass() {
    return `vjs-svg-component ${super.buildCSSClass()}`;
  }

  /**
   * Static getter for the component version.
   *
   * @returns {string} The current version of the SvgComponent component.
   */
  static get VERSION() {
    return version;
  }
}

videojs.registerComponent('SvgComponent', SvgComponent);

export default SvgComponent;
