import videojs from 'video.js';
import '@srgssr/svg-button';
import { version } from '../package.json';

/**
 * @ignore
 * @type {typeof import('@srgssr/svg-button').SvgButton}
 */
const SvgButton = videojs.getComponent('SvgButton');

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/utils/log.js').default}
 */
const log = videojs.log.createLogger('share-toggle');

/**
 * A Video.js button that opens the share modal. The button follows the modal
 * state: it is hidden while the modal is open and shown again once closed.
 */
class ShareToggle extends SvgButton {
  /**
   * Creates an instance of ShareToggle.
   *
   * @param {import('video.js/dist/types/player.js').default} player The player instance.
   * @param {Object} options The button options, on top of the `SvgButton` ones.
   * @param {string} [options.controlText='Share'] The accessible text of the button.
   * @param {SVGElement|string|URL} [options.icon] The icon displayed by the button.
   * @param {string} [options.iconName='share'] The icon name when using Video.js experimental SVG icons.
   */
  constructor(player, options = {}) {
    super(player, options);

    // The modal may be initialized after this button depending on the order
    // of the player options, defer the binding until the player is ready.
    this.player().ready(() => this.bindShareModal());
  }

  /**
   * Listens to the share modal lifecycle events to follow its state.
   */
  bindShareModal() {
    const modal = this.player().getChild('ShareModal');

    if (!modal) {
      log.warn('ShareToggle requires a ShareModal child on the player');

      return;
    }

    this.on(modal, 'modalopen', this.hide);
    this.on(modal, 'modalclose', this.show);
    this.toggleClass('vjs-hidden', modal.opened());
  }

  /**
   * Handles click events on the ShareToggle by opening the share modal.
   *
   * @param {Event} event The click event.
   */
  handleClick(event) {
    super.handleClick(event);
    this.shareModal().open();
  }

  /**
   * Returns the modal controlled by this toggle.
   *
   * @returns {import('./share-modal.js').default} The share modal.
   */
  shareModal() {
    const modal = this.player().getChild('ShareModal');

    if (!modal) {
      throw new Error('ShareToggle requires a ShareModal child on the player');
    }

    return modal;
  }

  /**
   * Builds the CSS class string for the toggle.
   *
   * @returns {string} The CSS class string.
   */
  buildCSSClass() {
    return `vjs-share-toggle ${super.buildCSSClass()}`;
  }

  /**
   * Returns the package version.
   *
   * @returns {string} The current package version.
   */
  static get VERSION() {
    return version;
  }
}

ShareToggle.prototype.options_ = {
  controlText: 'Share',
  iconName: 'share'
};

videojs.registerComponent('ShareToggle', ShareToggle);

export default ShareToggle;
