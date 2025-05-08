import videojs from 'video.js';
import { version } from '../package.json';
import loadSvgElement from './svg-loader.js';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/Component').default}
 */
const Component = videojs.getComponent('Component');

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/utils/log.js').default}
 */
const log = videojs.log.createLogger('brand-button');

/**
 * Represents a BrandButton component for the video.js player.
 * Displays a clickable brand icon that redirects to a specified URL.
 */
class BrandButton extends Component {
  /**
   * A bound method for updating the href attribute.
   * @private
   */
  #updateHref = () => this.updateHref();

  /**
   * Creates an instance of BrandButton.
   *
   * @param {import('video.js/dist/types/player.js').default} player - The Video.js player instance.
   * @param {Object} [options={}] - Configuration options for the BrandButton.
   * @param {string} [options.title] - The title (tooltip) text for the link element.
   * @param {SVGElement|string|URL} options.icon - The SVG icon to display inside the button. Can be an SVGElement, a raw SVG string, or a URL (string or URL object).   * @param {string | ((player: import('video.js/dist/types/player.js').default) => string)} [options.href] - A static URL string or a callback function that receives the player instance and returns a URL.
   * @param {string} [options.target='_blank'] - The target attribute for the link (e.g., '_blank', '_self').
   * @param {string} [options.rel='noopener noreferrer'] - The rel attribute for the link, defining the relationship between the current page and the linked page.
   */
  constructor(player, options = {}) {
    super(player, videojs.obj.merge({
      target: '_blank',
      rel: 'noopener noreferrer'
    }, options));

    this.player().on('loadeddata', this.#updateHref);
  }

  dispose() {
    this.player().off('loadeddata', this.#updateHref);
    super.dispose();
  }

  /**
   * Constructs the DOM element that will be used to render the button.
   * Ensures the element is an '<a>' and sets up the necessary properties.
   *
   * @param {string} [tag='a'] - The HTML tag name for the element. Must be 'a'.
   * @param {Object} [props={}] - Additional properties to set on the element.
   * @param {Object} [attributes={}] - Additional attributes to set on the element.
   * @returns {HTMLAnchorElement} The created anchor element.
   */
  createEl(tag = 'a', props = {}, attributes = {}) {
    if (tag !== 'a') {
      log.error(`Creating a BrandButton with an HTML element of ${tag} is not supported; the element must be an 'a'`);
      throw new Error(`'${tag}' is not supported for BrandButton`);
    }

    const {
      title,
      target,
      rel
    } = this.options();
    const el = videojs.dom.createEl(
      tag,
      videojs.obj.merge({ className: this.buildCSSClass() }, props),
      videojs.obj.merge({
        href: this.getHref(),
        title: this.localize(title),
        target,
        rel
      }, attributes)
    );

    this.createIconEl(el);

    return el;
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
  createIconEl(el) {
    this.loadSvgElement().then(svg => {
      const svgContainer = videojs.dom.createEl(
        'span',
        { className: 'pbw-brand-button-icon-container' },
        { ariaHidden: true }
      );

      svgContainer.appendChild(svg);
      el.appendChild(svgContainer);
    }, reason => {
      log.error(`No valid SVG Icon provided for BrandButton`, reason);
    });
  }

  /**
   * Returns the href for the button, resolving callbacks if necessary.
   *
   * @returns {string} The resolved href URL.
   */
  getHref() {
    if (typeof this.options().href === 'string') {
      return this.options().href || '';
    }

    if (typeof this.options().href === 'function') {
      try {
        return this.options().href(this.player());
      } catch (error) {
        log.error('Error executing the href callback:', error);
      }
    }

    return '';
  }

  /**
   * Updates the href attribute of the button element dynamically.
   */
  updateHref() {
    this.el().href = this.getHref();
  }

  /**
   * Builds the CSS class string for the button.
   *
   * @returns {string} The CSS class string.
   */
  buildCSSClass() {
    return `${super.buildCSSClass()} vjs-control pbw-brand-button`;
  }

  /**
   * Updated the link title when a language change is detected.
   */
  handleLanguagechange() {
    this.el().title = this.localize(this.options().title);
  }

  /**
   * Returns the current version of the BrandButton component.
   *
   * @static
   * @returns {string} The version string.
   */
  static get VERSION() {
    return version;
  }
}

videojs.registerComponent('BrandButton', BrandButton);

export default BrandButton;
