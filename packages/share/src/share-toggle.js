import videojs from 'video.js';
import '@srgssr/svg-button';
import { version } from '../package.json';
import './share-modal.js';

/**
 * @ignore
 * @type {typeof import('@srgssr/svg-button').SvgButton}
 */
const SvgButton = videojs.getComponent('SvgButton');

/**
 * A Video.js button that opens the share modal.
 */
class ShareToggle extends SvgButton {
  /**
   * Creates the ShareToggle and binds it to the share modal lifecycle.
   *
   * @param {import('video.js/dist/types/player.js').default} player The player instance.
   * @param {Object} options The button options.
   */
  constructor(player, options = {}) {
    super(player, options);

    this.handleModalOpen = this.handleModalOpen.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.bindShareModal = this.bindShareModal.bind(this);
    this.shareModal_ = null;

    this.bindShareModal();
    this.player().ready(this.bindShareModal);
  }

  /**
   * Cleans up modal listeners.
   */
  dispose() {
    this.unbindShareModal();
    super.dispose();
  }

  /**
   * Handles click events on the ShareToggle.
   *
   * @param {Event} event The click event.
   */
  handleClick(event) {
    const modal = this.shareModal();

    this.bindShareModal();
    super.handleClick(event);

    if (modal.isOpen()) {
      modal.close();

      return;
    }

    modal.open();
  }

  /**
   * Returns the modal controlled by this toggle.
   *
   * @returns {Component} The share modal.
   */
  shareModal() {
    const modal = this.player().getChild('ShareModal');

    if (!modal) {
      throw new Error('ShareToggle requires a ShareModal child on the player');
    }

    return modal;
  }

  /**
   * Binds this toggle to the ShareModal lifecycle events.
   */
  bindShareModal() {
    const modal = this.player().getChild('ShareModal');

    if (!modal || modal === this.shareModal_) return;

    this.unbindShareModal();
    this.shareModal_ = modal;
    this.on(modal, 'modalopen', this.handleModalOpen);
    this.on(modal, 'modalclose', this.handleModalClose);

    if (modal.isOpen()) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Removes modal lifecycle listeners.
   */
  unbindShareModal() {
    if (!this.shareModal_) return;

    this.off(this.shareModal_, 'modalopen', this.handleModalOpen);
    this.off(this.shareModal_, 'modalclose', this.handleModalClose);
    this.shareModal_ = null;
  }

  /**
   * Hides this toggle when the modal opens.
   */
  handleModalOpen() {
    this.hide();
  }

  /**
   * Shows this toggle when the modal closes.
   */
  handleModalClose() {
    this.show();
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
