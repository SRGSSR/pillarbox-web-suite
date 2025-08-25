import videojs from 'video.js';
import '@srgssr/svg-button';
import googleCastIcon from '../../assets/google-cast.svg?raw';
import { version } from '../../package.json';

/**
 * @ignore
 * @type {typeof import('video.js').Component}
 */
const SvgButton = videojs.getComponent('SvgButton');

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/utils/log.js').default}
 */
const log = videojs.log.createLogger('google-cast-button');

/**
 * A custom Google Cast button for the Video.js player.
 *
 * Unlike the default Google Cast launcher, this button is based on
 * {@link SvgButton} and therefore supports customization of its
 * icon and appearance.
 *
 * By default, clicking the button will request a new Cast session
 * using the Google Cast SDK.
 */
class GoogleCastButton extends SvgButton {

  /**
   * Creates an instance of GoogleCastButton.
   *
   * @param {import('video.js/dist/types/player.js').default} player
   *        The Video.js player instance.
   *
   * @param {Object} [options={}]
   *        Configuration options for the button. Supports all options
   *        from {@link SvgButton}, such as `icon`, `iconName`, and `controlText`.
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
   * Handles click events on the Google Cast button.
   * Requests a Cast session from the Google Cast SDK.
   *
   * @param {Event} event The click event.
   */
  handleClick(event) {
    super.handleClick(event);
    window.cast.framework.CastContext.getInstance().requestSession();
  }

  /**
   * Builds the CSS class string for the button.
   *
   * @returns {string} The CSS class string.
   */
  buildCSSClass() {
    return `vjs-google-cast-button ${super.buildCSSClass()}`;
  }

  /**
   * Returns the current version of the GoogleCastButton component.
   *
   * @static
   * @returns {string} The version string.
   */
  static get VERSION() {
    return version;
  }
}

GoogleCastButton.prototype.options_ = {
  iconName: 'google-cast',
  icon: googleCastIcon,
  controlText: 'Use Google Cast'
};

videojs.registerComponent('GoogleCastButton', GoogleCastButton);

const controlBarChildren = videojs.getComponent('ControlBar').prototype.options_.children;

controlBarChildren.splice(controlBarChildren.length - 1, 0, 'GoogleCastButton');

export default GoogleCastButton;
