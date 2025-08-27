import videojs from 'video.js';
import '@srgssr/svg-button';
import googleCastIconIdle from '../../assets/cast-idle.svg?raw';
import googleCastIconActive from '../../assets/cast-active.svg?raw';
import { version } from '../../package.json';

/**
 * @ignore
 * @type {typeof import('video.js').Component}
 */
const SvgButton = videojs.getComponent('SvgButton');

// The `cast` and `chrome` objects are provided by the Google Cast SDK,
// which is loaded externally. This comment disables ESLint's `no-undef`
// rule for this file.
/* eslint-disable no-undef */

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
   * Handles the 'statechanged' event when triggered by the google cast sender
   * plugin. This method serves as a proxy to the main `statechanged` handler,
   * ensuring that additional logic can be executed or making it easier to
   * detach the event listener later.
   *
   * @private
   */
  #onCastStateChanged = ({ changes }) => {
    if ('sessionState' in changes) {
      this.toggleState(changes.sessionState.to).catch(reason =>
        log.error(`There was a problem loading the provided SVG Icon`, reason));
    }
  };

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
    options = videojs.obj.merge(
      options,
      GoogleCastButton.prototype.options_.idleIcon
    );

    super(player, options);

    if (!window.chrome) {
      this.hide();
    }

    if (!player.usingPlugin('googleCastSender')) {
      log.error('The google-cast-sender plugin is required');
    }

    this.googleCastSender().on('statechanged', this.#onCastStateChanged);
  }

  /**
   * Dispose of the GoogleCastButton instance.
   */
  dispose() {
    this.googleCastSender().off('statechanged', this.#onCastStateChanged);
    super.dispose();
  }

  googleCastSender() {
    return this.player().googleCastSender();
  }

  /**
   * Handles click events on the Google Cast button.
   * Requests a Cast session from the Google Cast SDK.
   *
   * @param {Event} event The click event.
   */
  handleClick(event) {
    super.handleClick(event);

    if (
      this.options().endSessionOnClick &&
      this.player().hasClass('vjs-chromecast-connected')
    ) {
      this.googleCastSender().endCurrentSession();

      return;
    }

    this.googleCastSender().requestSession();
  }

  async toggleState(sessionState) {
    const {
      SESSION_STARTED,
      SESSION_RESUMED,
      SESSION_ENDED
    } = cast.framework.SessionState;

    switch (sessionState) {
      case SESSION_STARTED:
      case SESSION_RESUMED:
        await this.appendIcon(this.options().activeIcon);
        break;
      case SESSION_ENDED:
        await this.appendIcon(this.options().idleIcon);
        break;
    }
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
  endSessionOnClick: false,
  idleIcon: {
    iconName: 'google-cast',
    icon: googleCastIconIdle
  },
  activeIcon: {
    iconName: 'google-cast-active',
    icon: googleCastIconActive
  },
  controlText: 'Use Google Cast'
};

videojs.registerComponent('GoogleCastButton', GoogleCastButton);

const controlBarChildren = videojs.getComponent('ControlBar').prototype.options_.children;

controlBarChildren.splice(controlBarChildren.length - 1, 0, 'GoogleCastButton');

export default GoogleCastButton;
