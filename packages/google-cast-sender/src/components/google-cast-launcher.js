import videojs from 'video.js';
import { version } from '../../package.json';

/**
 * @ignore
 * @type {typeof import('video.js').Component}
 */
const Component = videojs.getComponent('Component');

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/utils/log.js').default}
 */
const log = videojs.log.createLogger('google-cast-launcher');

/**
 * A Google Cast launcher component for the Video.js player.
 *
 * This wraps the native `<google-cast-launcher>` element provided by
 * the Google Cast SDK. It automatically manages session handling,
 * but offers limited customization compared to {@link GoogleCastButton}.
 */
class GoogleCastLauncher extends Component {

  /**
   * Creates an instance of GoogleCastLauncher.
   *
   * @param {import('video.js/dist/types/player.js').default} player
   *        The Video.js player instance.
   *
   * @param {Object} [options={}]
   *        Configuration options for the launcher. Supports:
   *        - `title` {string} Accessible title for the button (default: `"Use Google Cast"`).
   */
  constructor(player, options = {}) {
    super(player, options);

    if (!window.chrome) {
      this.hide();
    }

    if (!player.usingPlugin('googleCastSender')) {
      log.error('The google-cast-sender plugin is required');
    }
  }

  /**
   * Constructs the DOM element that will be used to render the launcher.
   * Ensures the element is a `<google-cast-launcher>` and applies
   * proper attributes and CSS classes.
   *
   * @param {string} [tag='google-cast-launcher']
   *        The HTML tag name. Must be `'google-cast-launcher'`.
   *
   * @param {Object} [props={}]
   *        Additional properties to apply to the element.
   *
   * @param {Object} [attributes={}]
   *        Additional attributes to set on the element.
   *
   * @returns {HTMLElement}
   *          The created `<google-cast-launcher>` element.
   */
  createEl(tag = 'google-cast-launcher', props = {}, attributes = {}) {
    if (tag !== 'google-cast-launcher') {
      log.error(`Creating a GoogleCastLauncher with an HTML element of ${tag} is not supported; the element must be an 'google-cast-launcher'`);
      throw new Error(`'${tag}' is not supported for GoogleCastLauncher`);
    }

    const { title } = this.options();

    return super.createEl(
      tag,
      videojs.obj.merge({ className: this.buildCSSClass() }, props),
      videojs.obj.merge({ title: this.localize(title), }, attributes)
    );
  }

  /**
   * Builds the CSS class string for the launcher.
   *
   * @returns {string} The CSS class string.
   */
  buildCSSClass() {
    return `vjs-google-cast-launcher vjs-control vjs-button ${super.buildCSSClass()}`;
  }

  /**
   * Updates the launcher title when the player's language changes.
   */
  handleLanguagechange() {
    this.el().title = this.localize(this.options().title);
  }

  /**
   * Returns the current version of the GoogleCastLauncher component.
   *
   * @static
   * @returns {string} The version string.
   */
  static get VERSION() {
    return version;
  }
}

GoogleCastLauncher.prototype.options_ = {
  title: 'Use Google Cast'
};

videojs.registerComponent('GoogleCastLauncher', GoogleCastLauncher);

export default GoogleCastLauncher;
