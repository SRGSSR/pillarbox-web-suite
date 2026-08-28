import videojs from 'video.js';
import './share-button.js';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/component').default}
 */
const Component = videojs.getComponent('Component');

/**
 * Holds the platform share buttons.
 */
class ShareButtonCollection extends Component {
  /**
   * Creates the collection and its configured children.
   *
   * @param {import('video.js/dist/types/player.js').default} player The player instance.
   * @param {Object} options The collection options.
   */
  constructor(player, options = {}) {
    const shareText = options.shareText;

    super(player, options);
    this.shareText_ = shareText ?? this.options().shareText;
    this.configureChildren();
  }

  /**
   * Creates the collection element.
   *
   * @returns {HTMLElement} The collection element.
   */
  createEl() {
    return super.createEl('div', {
      className: this.options().className
    });
  }

  /**
   * Configures children declared through Video.js options.
   */
  configureChildren() {
    this.children().forEach(child => {
      child.setShareText?.(this.shareText_);
      child.setShareHandler?.(() => this.trigger('share'));
    });
  }

  /**
   * Passes the selected URL generator to every platform button.
   *
   * @param {Function} generateUrl The URL generator.
   */
  setUrlGenerator(generateUrl) {
    this.children().forEach(child => {
      child.setUrlGenerator?.(generateUrl);
    });
  }

  /**
   * Returns no additional CSS class for the collection.
   *
   * @returns {string} The CSS class string.
   */
  buildCSSClass() {
    return "";
  }

  /**
   * Keeps the collection language-independent.
   */
  handleLanguagechange() {
    // do nothing here
  }
}

ShareButtonCollection.prototype.options_ = {
  className: 'vjs-share-button-collection',
  shareText: () => document.title,
  children: [
    'FacebookShareButton',
    'XShareButton',
    'LinkedinShareButton',
    'WhatsappShareButton',
    'EmailShareButton',
    'CopyLinkShareButton',
    'EmbedShareButton'
  ]
};

videojs.registerComponent('ShareButtonCollection', ShareButtonCollection);

export default ShareButtonCollection;
