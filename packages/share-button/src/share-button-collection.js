import videojs from 'video.js';
import './share-button.js';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/component').default}
 */
const Component = videojs.getComponent('Component');

/**
 * Holds the platform share buttons. The buttons are declared as default
 * children so integrators can add, remove or configure them through the
 * standard Video.js options.
 *
 * @param {import('video.js/dist/types/player.js').default} player The player instance.
 * @param {Object} options The collection options.
 * @param {string|function(player, button): string} [options.shareText] The text shared by every
 * button that does not define its own, defaults to the document title.
 * @param {string[]} [options.children] The platform buttons to display. Set one to `false` in the
 * options to remove it.
 */
class ShareButtonCollection extends Component {
  /**
   * Passes the selected URL generator to every platform button.
   *
   * @param {Function} generateUrl The URL generator.
   */
  setUrlGenerator(generateUrl) {
    this.children().forEach(child => child.setUrlGenerator?.(generateUrl));
  }
}

ShareButtonCollection.prototype.options_ = {
  className: 'vjs-share-button-collection',
  shareText: undefined,
  children: [
    'facebookShareButton',
    'xShareButton',
    'linkedinShareButton',
    'whatsappShareButton',
    'emailShareButton',
    'copyLinkShareButton',
    'embedShareButton'
  ]
};

videojs.registerComponent('ShareButtonCollection', ShareButtonCollection);

export default ShareButtonCollection;
