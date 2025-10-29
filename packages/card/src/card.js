import videojs from 'video.js';
import { version } from '../package.json';

/**
 * @typedef {object} CardMetadata
 * @property {string} title the title of the card
 * @property {number} duration the duration of the media in seconds
 * @property {string} imageTitle the title of the image
 * @property {string} imageUrl the URL of the image
 *
 * @typedef {object} CardOptions
 * @property {CardMetadata} metadata the card metadata
 * @property {string} styleEl a string of CSS styles to be applied to the card
 */

/**
* @ignore
* @type {typeof import('video.js/dist/types/clickable-component').default}
*/
const ClickableComponent = videojs.getComponent('ClickableComponent');

/**
 * A card component that displays metadata, such as title, duration, and an image.
 *
 * This component extends the Video.js ClickableComponent class, making it interactive.
 *
 * @extends ClickableComponent
 */
class Card extends ClickableComponent {
  /**
   * Creates an instance of Card.
   *
   * @param {import('video.js/dist/types/player').default} player
   * @param {CardOptions} options
   */
  constructor(player, options) {
    super(player, options);

    /** @type { CardMetadata } */
    this.metadata = this.options().metadata;

    const style = this.options().styleEl;

    if (style) {
      videojs.dom.setAttributes(this.el(), {
        style
      });
    }

  }

  /**
   * Creates the title element for the card.
   *
   * @returns {HTMLParagraphElement} the title element
   */
  createTitle() {
    return videojs.dom.createEl(
      'p',
      undefined,
      { class: 'vjs-card-title' },
      this.options().metadata.title
    );
  }

  /**
   * Creates the duration element for the card.
   *
   * @returns {HTMLSpanElement} the duration element
   */
  createDuration() {
    return videojs.dom.createEl(
      'span',
      undefined,
      { class: 'vjs-card-duration', 'aria-hidden': true },
      videojs.time.formatTime(this.options().metadata.duration, 600)
    );
  }

  /**
   * Creates a figcaption element to contain the title and duration.
   *
   * @returns {HTMLElement} the figcaption element
   */
  createFigCaption() {
    return videojs.dom.createEl(
      'figcaption',
      { className: 'vjs-card-figcaption', id: this.id() },
      undefined,
      [this.createTitle(), this.createDuration()]
    );
  }

  /**
   * Creates the image element for the card.
   *
   * @returns {HTMLImageElement} the image element
   */
  createImage() {
    return videojs.dom.createEl(
      'img',
      undefined,
      {
        class: 'vjs-card-img',
        alt: this.options().metadata.imageTitle ?? '',
        src: this.options().metadata.imageUrl ?? ''
      }
    );
  }

  /**
   * Creates a figure element to contain the image and figcaption.
   *
   * @returns {HTMLElement} the figure element
   */
  createFigure() {
    return videojs.dom.createEl(
      'figure',
      undefined,
      { class: 'vjs-card-figure' },
      [this.createImage(), this.createFigCaption()]
    );
  }

  /**
   * Toggles the selection state of the card.
   *
   * @param {boolean} isSelected a flag indicating whether the card is selected
   * @returns {void}
   */
  select(isSelected) {
    this.toggleClass('vjs-card-selected', isSelected);
  }

  isSelected() {
    return this.hasClass('vjs-card-selected');
  }

  /**
   * Builds the CSS class for the component.
   *
   * @returns {string} the CSS class name
   */
  buildCSSClass() {
    return `vjs-card`;
  }

  /**
   * Creates the div element for the component.
   *
   * @returns {HTMLDivElement} the div element
   */
  createEl(tag = 'div', props = { className: this.buildCSSClass() }, attributes = {}) {
    return videojs.dom.createEl(tag, props, attributes, this.createFigure());
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

videojs.registerComponent('Card', Card);

export default Card;
