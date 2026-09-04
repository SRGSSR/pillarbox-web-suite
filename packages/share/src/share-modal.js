import videojs from 'video.js';
import './lang';
import './share-button-collection.js';
import './share-url-options.js';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/modal-dialog').default}
 */
const ModalDialog = videojs.getComponent('ModalDialog');

/**
 * A small share modal anchored to the top-right corner of the player.
 */
class ShareModal extends ModalDialog {
  /**
   * Creates an instance of ShareModal.
   *
   * @param {import('video.js/dist/types/player.js').default} player The player instance.
   * @param {Object} options Configuration options for the modal.
   */
  constructor(player, options = {}) {
    super(player, options);

    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.handleUrlOptionsChange = this.handleUrlOptionsChange.bind(this);
    this.handleShare = this.handleShare.bind(this);
    this.fill();
    this.render();
  }

  /**
   * Cleans up the modal and removes its event listeners.
   */
  dispose() {
    this.unbindOutsideClick();
    this.urlOptions_?.off('change', this.handleUrlOptionsChange);
    this.collection_?.off('share', this.handleShare);
    super.dispose();
  }

  /**
   * Builds the CSS class string for the modal.
   *
   * @returns {string} The CSS class string.
   */
  buildCSSClass() {
    return `vjs-share-modal ${super.buildCSSClass()}`;
  }

  /**
   * Renders the modal content.
   */
  render() {
    this.title_ = this.createTitle();
    this.urlOptions_ = this.addChild(
      'ShareUrlOptions',
      this.options().shareUrlOptions
    );
    this.collection_ = this.addChild(
      'ShareButtonCollection',
      this.options().shareButtonCollection
    );

    this.urlOptions_.on('change', this.handleUrlOptionsChange);
    this.collection_.on('share', this.handleShare);
    this.updateUrlGenerator();
  }

  /**
   * Creates the modal title.
   *
   * @returns {Component} The title component.
   */
  createTitle() {
    const title = this.addChild('ShareModalTitle', {
      componentClass: 'TitleBar',
      className: 'vjs-share-title'
    });

    title.update({
      title: this.localize(this.options().title ?? 'Share')
    });

    return title;
  }

  /**
   * Opens the modal.
   */
  open() {
    super.open();
    this.bindOutsideClick();
    this.updateUrlGenerator();
  }

  /**
   * Closes the modal.
   */
  close() {
    this.unbindOutsideClick();
    super.close();
  }

  /**
   * Returns whether the modal is currently open.
   *
   * @returns {boolean} True when open.
   */
  isOpen() {
    return this.opened();
  }

  /**
   * Updates the collection URL generator.
   */
  updateUrlGenerator() {
    this.collection_.setUrlGenerator(() => this.urlOptions_.generateUrl());
  }

  /**
   * Handles URL option changes.
   */
  handleUrlOptionsChange() {
    this.updateUrlGenerator();
  }

  /**
   * Closes the modal after a share action.
   */
  handleShare() {
    this.close();
  }

  /**
   * Binds the outside click listener.
   */
  bindOutsideClick() {
    document.addEventListener('pointerdown', this.handleOutsideClick);
  }

  /**
   * Removes the outside click listener.
   */
  unbindOutsideClick() {
    document.removeEventListener('pointerdown', this.handleOutsideClick);
  }

  /**
   * Closes the modal when clicking outside the share modal.
   *
   * @param {PointerEvent} event The pointer event.
   */
  handleOutsideClick(event) {
    if (this.isOwnClick(event)) return;

    this.close();
  }

  /**
   * Returns whether the click happened inside the share modal.
   *
   * @param {PointerEvent} event The pointer event.
   *
   * @returns {boolean} True when the click belongs to the share modal.
   */
  isOwnClick(event) {
    return this.el().contains(event.target);
  }

  handleLanguagechange() {
    this.el().title = this.localize(this.options().title ?? 'Share');
    this.title_.update({
      title: this.localize(this.options().title ?? 'Share')
    });
  }
}

ShareModal.prototype.options_ = {
  pauseOnOpen: false,
  temporary: false,
  title: 'Share',
  shareUrlOptions: {},
  shareButtonCollection: {}
};

videojs.registerComponent('ShareModal', ShareModal);

export default ShareModal;
