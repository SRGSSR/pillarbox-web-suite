import videojs from 'video.js';
import { version } from '../package.json';
import Card from './card.js';

/**
 * @typedef {object} cardLinkOptions
 * @property {function(): string} urlHandler function that returns a URL
 *
 * @typedef {cardLinkOptions & import('./card.js').CardOptions} CardLinkOptions
 */

/**
 * A card component that functions as a link.
 *
 * This component extends the Card class and can be used to navigate to a URL.
 *
 * @extends Card
 */
class CardLink extends Card {
  /**
   * Creates an instance of CardLink.
   *
   * @param {import('video.js/dist/types/player').default} player
   * @param {CardLinkOptions} options
   */
  constructor(player, options) {
    super(player, options);

    /** @type { function(): string } */
    this.handleUrl = typeof options.urlHandler === 'function' ? options.urlHandler.bind(this) : () => { };

    videojs.dom.setAttributes(this.el(), {
      href: this.handleUrl(),
      'aria-labelledby': this.id(),
      title: this.metadata.title
    });
  }

  /**
   * Builds the CSS class for the component.
   *
   * @returns {string} the CSS class name
   */
  buildCSSClass() {
    return `${super.buildCSSClass()} vjs-card-link`;
  }

  /**
   * Creates the a element for the component.
   *
   * @returns {HTMLAnchorElement} the a element
   */
  createEl() {
    return super.createEl('a', {
      className: this.buildCSSClass(),
      rel: 'noopener noreferrer',
    });
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

videojs.registerComponent('CardLink', CardLink);

export default CardLink;
