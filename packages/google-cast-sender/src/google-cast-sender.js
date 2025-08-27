import videojs from 'video.js';
import { version } from '../package.json';
import Chromecast from './google-cast-tech.js';
import './components/google-cast-launcher.js';
import './lang';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/utils/log.js').default}
 */
const log = videojs.log.createLogger('GoogleCastSender-plugin');

// The `cast` and `chrome` objects are provided by the Google Cast SDK,
// which is loaded externally. This comment disables ESLint's `no-undef`
// rule for this file.
/* eslint-disable no-undef */

/**
 * @typedef {import('video.js/dist/types/player').default} Player
 * @typedef {import('video.js/dist/types/tech/tech').default} Tech
 * @typedef {import('video.js/dist/types/tracks/audio-track').default} AudioTrack
 * @typedef {import('video.js/dist/types/tracks/text-track').default} TextTrack
 * @typedef {import('video.js/dist/types/component').default} Component
 *
 * @typedef {object} GoogleCastSenderOptions
 * @property {boolean} [androidReceiverCompatible=true] indicates whether the
 *           receiver application is compatible with Android TV devices
 * @property {string} [autoJoinPolicy=chrome.cast.AutoJoinPolicy.TAB_AND_ORIGIN_SCOPED] the policy for
 *           automatically joining a Cast session
 * @property {boolean} [enableDefaultCastLauncher=true] indicates whether the
 *           default Cast button should be displayed in the controlBar
 * @property {string} [receiverApplicationId=chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID] the ID of the receiver application to use.
 *           Note that the default receiver doesn't handle DRM content.
 * @property {object} [script] configuration for the Google Cast sender script
 * @property {string} [script.id='gstatic_cast_sender'] the ID for the script
 *           element
 * @property {string} [script.src='https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1'] the URL for the Google Cast sender script
 * @property {function(object): object} [sourceResolver] a function to resolve
 *           the source to be played on the cast device.
 */

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/plugin').default}
 */
const Plugin = videojs.getPlugin('plugin');

/**
 * This plugin adds Chromecast to video.js and supports changing the language of the subtitles as well as the audio.
 *
 * __Be aware of the following issue__: [Subtitles do not activate on HLS TS and FMP4](https://issuetracker.google.com/issues/383582114)
 *
 * @see [AutoJoinPolicy](https://developers.google.com/cast/docs/reference/web_sender/chrome.cast#.AutoJoinPolicy)
 * @see [CastOptions](https://developers.google.com/cast/docs/reference/web_sender/cast.framework.CastOptions)
 * @see [SessionState](https://developers.google.com/cast/docs/reference/web_sender/cast.framework#.SessionState)
 * @see [Default cast button](https://developers.google.com/cast/docs/web_sender/integrate#cast_button)
 *
 * @extends Plugin
 */
class GoogleCastSender extends Plugin {
  /**
   * Default options for the plugin.
   *
   * @private
   * @type {GoogleCastSenderOptions}
   */
  #options = {
    androidReceiverCompatible: true,
    autoJoinPolicy: 'tab_and_origin_scoped',
    enableDefaultCastLauncher: true, // https://developers.google.com/cast/docs/web_sender/integrate#cast_button
    receiverApplicationId: undefined,
    script: {
      id: 'gstatic_cast_sender',
      src: 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1'
    },
    sourceResolver: undefined
  };

  /** @type {cast.framework.CastContext} */
  #castContext;

  /**
   * Creates an instance of the GoogleCastSender plugin.
   *
   * @param {Player} player the Video.js player instance
   * @param {GoogleCastSenderOptions} [options={}] configuration options
   */
  constructor(player, options) {
    super(player);

    this.#options = videojs.obj.merge(this.#options, options);
    this.sessionStateChangedListener =
      this.sessionStateChangedListener.bind(this);

    this.loadCastSenderScript();
  }

  /**
   * Resolves the source to be used by the Chromecast tech if provided.
   *
   * @param {object} source the original source from the player
   *
   * @returns {object} the resolved source for casting
   */
  sourceResolver(source) {
    if (typeof this.#options.sourceResolver !== 'function') return source;

    return this.#options.sourceResolver(source);
  }

  /**
   * Creates the Google Cast button and adds it to the player's control bar.
   *
   * The button is only added after the Google Cast API is available.
   *
   * https://developers.google.com/cast/docs/web_sender/integrate#cast_button
   *
   * @private
   */
  enableDefaultCastLauncher() {
    if (
      !this.#options.enableDefaultCastLauncher ||
      !this.player.controlBar
    ) {
      return;
    }

    const controlBar = this.player.controlBar;
    const position = controlBar.children().length - 1;

    controlBar.addChild('GoogleCastLauncher', {}, position);
  }

  /**
   * Removes the Google Cast button.
   *
   * @private
   */
  removeDefaultCastLauncher() {
    this.player.controlBar.removeChild('GoogleCastLauncher');
  }

  /**
   * Cast session state change handler.
   *
   * @private
   * @param {cast.framework.SessionState} event the session state change event
   */
  sessionStateChangedListener({ sessionState }) {
    const {
      SESSION_STARTED,
      SESSION_RESUMED,
      SESSION_ENDED
    } = cast.framework.SessionState;

    log.debug('sessionStateChangedListener', sessionState);

    switch (sessionState) {
      case SESSION_STARTED:
        this.onCastSessionStarted();
        break;
      case SESSION_RESUMED:
        this.onCastSessionResumed();
        break;
      case SESSION_ENDED:
        this.onCastSessionEnded();
        break;
      default:
        log.debug('Unknown state change', sessionState);
        break;
    }

    this.setState({ sessionState: sessionState });
  }

  /**
   * When a new cast session is started. It loads the `chromecast` tech
   * with the current player state (source, time, tracks).
   *
   * @private
   */
  onCastSessionStarted() {
    const {
      currentTime,
      source
    } = this.player.getCache();
    const audioTrack = this.findEnabledAudioTrack(this.player.audioTracks());
    const textTrack = this.findShowingTextTrack(this.player.textTracks());

    this.player.loadTech_('chromecast', {
      ...source,
      currentTime,
      audioTrack,
      textTrack,
    });
  }

  /**
   * Resumes an existing cast session. It loads the `chromecast`
   * tech with the player's current source.
   *
   * Happens when reloading the browser's tab from where the content
   * is being cast.
   *
   * @private
   */
  onCastSessionResumed() {
    this.player.loadTech_('chromecast', this.player.currentSource());
  }

  /**
   * When a cast session is ended. It restores the player to the last
   * known cast receiver state.
   *
   * @private
   */
  onCastSessionEnded() {
    const {
      currentTime,
      source,
      volume
    } = this.player.getCache();
    const {
      audioTrack,
      textTrack
    } = this.getCastSessionTracks();

    // reload the tech to avoid having a blob in currentSource
    // which breaks the load function if called.
    this.player.loadTech_('html5');
    this.player.one('loadeddata', () => {
      this.player.currentTime(currentTime);
      this.player.volume(volume);
      this.restoreTracks(audioTrack, textTrack);
    });

    this.player.src(source);
  }

  /**
   * Get the active audio and text tracks from the current cast session.
   *
   * @private
   * @returns {{
   *    audioTrack: AudioTrack|undefined,
   *    textTrack: TextTrack|undefined
   * }} the active audio and text tracks
   */
  getCastSessionTracks() {
    const castTechOptions = this.player.tech(true).options();
    const audioTrack = this.findEnabledAudioTrack(
      castTechOptions.audioTracks || []
    );
    const textTrack = this.findShowingTextTrack(
      castTechOptions.textTracks || []
    );

    return {
      audioTrack,
      textTrack
    };
  }

  /**
   * Converts a `TrackList` object into an array of tracks.
   *
   * @param {AudioTrackList|TextTrackList} trackList the track list to convert
   *
   * @returns {Array<AudioTrack|TextTrack>} an array of tracks
   */
  trackListToArray(trackList) {
    return Array.from(trackList);
  }

  /**
   * Finds the first enabled audio track.
   *
   * @param {AudioTrack[]} tracks the list of audio tracks
   *
   * @returns {AudioTrack|undefined} the enabled audio track if found
   */
  findEnabledAudioTrack(tracks) {
    return this.trackListToArray(tracks).find(track => track.enabled);
  }

  /**
   * Finds the first showing text track.
   *
   * @param {TextTrack[]} tracks the list of text tracks
   *
   * @returns {TextTrack|undefined} the showing text track if found
   */
  findShowingTextTrack(tracks) {
    return this.trackListToArray(tracks).find(track => track.mode === 'showing');
  }

  /**
   * Restores the audio and text tracks.
   *
   * @param {AudioTrack} audioTrack the audio track to restore
   * @param {TextTrack} textTrack the text track to restore
   */
  restoreTracks(audioTrack, textTrack) {
    this.trackListToArray(this.player.audioTracks()).forEach(track => {
      track.enabled = track.language === audioTrack.language;
    });

    this.trackListToArray(this.player.textTracks()).forEach(track => {
      track.mode = textTrack && track.language === textTrack.language ? 'showing' : 'disabled';
    });
  }

  /**
   * Callback executed when the Google Cast API becomes available.
   *
   * It will:
   * - initialize the CastContext
   * - add the default cast launcher if the option is set to true
   * - setup the SESSION_STATE_CHANGED listener
   *
   * @param {boolean} isAvailable whether the API is available
   */
  onGCastApiAvailable(isAvailable) {
    if (!isAvailable) return;

    const castOptions = {
      androidReceiverCompatible: this.#options.androidReceiverCompatible,
      autoJoinPolicy:
        this.#options.autoJoinPolicy ||
        chrome.cast.AutoJoinPolicy.TAB_AND_ORIGIN_SCOPED,
      receiverApplicationId:
        this.#options.receiverApplicationId ||
        chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
    };

    this.#castContext = cast.framework.CastContext.getInstance();
    this.#castContext.setOptions(castOptions);

    this.enableDefaultCastLauncher();

    this.#castContext.addEventListener(
      cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
      this.sessionStateChangedListener
    );
  }

  /**
   * Loads the Google Cast sender script into the page.
   *
   * @private
   */
  loadCastSenderScript() {
    // compatible with all chromium browsers
    if (!window.chrome) return;

    window.__onGCastApiAvailable = this.onGCastApiAvailable.bind(this);

    if (document.getElementById(this.#options.script.id)) {
      // https://developers.google.com/cast/docs/web_sender/integrate#initialization
      window.__onGCastApiAvailable(true);

      return;
    }

    this.createCastScriptEl();
  }

  /**
   * Creates and appends the Google Cast sender script to the document head.
   */
  createCastScriptEl() {
    const {
      id,
      src
    } = this.#options.script;

    document.head.appendChild(
      videojs.dom.createEl('script', {
        id,
        src,
        defer: true,
        type: 'text/javascript'
      })
    );
  }

  /**
   * Disposes the plugin by cleaning up event listeners and
   * removing the cast script.
   */
  dispose() {
    this.removeCastListener();
    this.removeCastScript();
    this.removeDefaultCastLauncher();
    this.endCurrentSession();

    delete window.__onGCastApiAvailable;

    super.dispose();
  }

  /**
   * Ends the current cast session.
   *
   * Is mainly used if a cast session is active but the `dispose` method is
   * called. This will prevent having the content still playing on the receiver.
   */
  endCurrentSession() {
    if (!this.#castContext) return;

    this.#castContext.endCurrentSession();
  }

  requestSession() {
    if (!this.#castContext) return;

    this.#castContext.requestSession();
  }

  /**
   * Removes the session state change listener from the CastContext.
   *
   * @private
   */
  removeCastListener() {
    if (!window.cast || !window.cast.framework || !this.#castContext) return;

    this.#castContext.removeEventListener(
      cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
      this.sessionStateChangedListener
    );
  }

  /**
   * Removes the Google Cast sender script from the page.
   *
   * @private
   */
  removeCastScript() {
    const script = document.getElementById(this.#options.script.id);

    if (!script) return;

    script.remove();
  }

  /**
   * Gets the version of the plugin.
   *
   * @static
   * @returns {string} The plugin version.
   */
  static get VERSION() {
    return version;
  }
}

videojs.registerPlugin('googleCastSender', GoogleCastSender);

export { GoogleCastSender, Chromecast };
