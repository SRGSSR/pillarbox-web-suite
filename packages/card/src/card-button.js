import videojs from 'video.js';
import { version } from '../package.json';
import Card from './card.js';

/**
 * The CardButton functions as a button.
 *
 * This component extends the Card class and can be used to trigger actions.
 *
 * @extends Card
 */
class CardButton extends Card {
  /**
   * Creates an instance of CardButton.
   *
   * @param {import('video.js/dist/types/player').default} player
   * @param {import('./card.js').CardOptions} options
   */
  constructor(player, options) {
    super(player, options);

    videojs.dom.setAttributes(this.el(), {
      'aria-labelledby': this.id(),
    });
  }

  /**
   * Builds the CSS class for the component.
   *
   * @returns {string} the CSS class name
   */
  buildCSSClass() {
    return `${super.buildCSSClass()} vjs-card-button`;
  }

  /**
   * Creates the button element for the component.
   *
   * @returns {HTMLButtonElement} the button element
   */
  createEl() {
    return super.createEl('button', {
      className: this.buildCSSClass(),
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

videojs.registerComponent('CardButton', CardButton);

export default CardButton;
