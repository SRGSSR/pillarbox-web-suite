import videojs from 'video.js';
import { version } from '../package.json';
import Card from './card.js';

/**
 * @typedef {object} styledCardButtonOptions
 * @property {function(): string} styleHandler function that returns a string of CSS styles to be applied to the card
 *
 * @typedef {styledCardButtonOptions | import('./card.js').CardOptions} StyledCardButtonOptions
 */

/**
 * The StyledCardButton functions as a button with customizable styles.
 *
 * This component extends the Card class and can be used to trigger actions.
 *
 * @extends Card
 */
class StyledCardButton extends Card {
  /**
   * Creates an instance of StyledCardButton.
   *
   * @param {import('video.js/dist/types/player').default} player
   * @param {StyledCardButtonOptions} options
   */
  constructor(player, options) {
    super(player, options);

    /** @type { function(): string } */
    this.handleStyle = typeof this.options().styleHandler === 'function' ? this.options().styleHandler.bind(this) : () => { };

    videojs.dom.setAttributes(this.el(), {
      'aria-labelledby': this.metadata.id,
      style: this.handleStyle()
    });
  }

  /**
   * Builds the CSS class for the component.
   *
   * @returns {string} the CSS class name.
   */
  buildCSSClass() {
    return `${super.buildCSSClass()} vjs-styled-card-button`;
  }

  /**
   * Creates the main element for the component.
   *
   * @returns {HTMLButtonElement} the main element.
   */
  createEl() {
    return videojs.dom.createEl('button', {
      className: this.buildCSSClass(),
    });
  }

  /**
   * Returns the version of the component.
   *
   * @static
   * @returns {string} the version of the component.
   */
  static get VERSION() {
    return version;
  }
}

videojs.registerComponent('StyledCardButton', StyledCardButton);

export default StyledCardButton;
