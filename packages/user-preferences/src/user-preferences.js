import videojs from 'video.js';
import { version } from '../package.json';

/**
 * Represents the saved preference for an audio track.
 *
 * @typedef {Object} PreferredAudioTrack
 * @property {String} [language] The BCP 47 language code (e.g., 'en', 'fr')
 * @property {String} [kind] The kind of the audio track (e.g., 'main', 'commentary')
 */

/**
 * Represents the saved preference for a text track (subtitles/captions).
 *
 * @typedef {Object} PreferredTextTrack
 * @property {String} [language] The BCP 47 language code (e.g., 'en', 'es')
 * @property {String} [kind] The kind of the text track (e.g., 'subtitles', 'captions')
 */

/**
 * Represents the complete set of user preferences that can be stored.
 *
 * @typedef {Object} Preferences
 * @property {Number} [volume] The player volume level (0 to 1)
 * @property {Boolean} [muted] Whether the player is muted
 * @property {Number} [playbackRate] The playback speed (e.g., 1, 1.5, 2)
 * @property {PreferredAudioTrack} [audioTrack] The preferred audio track settings
 * @property {PreferredTextTrack} [textTrack] The preferred text track settings
 */

/**
 * Defines which user preferences should be saved and restored by the component.
 * If a property is set to `false`, that preference will not be managed.
 * Defaults to all `true` if not specified.
 *
 * @typedef {Object} AllowedPreferences
 * @property {Boolean} [volume=true] Whether to save/restore the volume level
 * @property {Boolean} [muted=true] Whether to save/restore the mute state
 * @property {Boolean} [playbackRate=true] Whether to save/restore the playback rate
 * @property {Boolean} [audioTrack=true] Whether to save/restore the selected audio track
 * @property {Boolean} [textTrack=true] Whether to save/restore the selected text track
 */

/**
 * Configuration options for the UserPreferences component.
 *
 * @typedef {Object} UserPreferencesOptions
 * @property {String} [storageName='vjs-user-preferences'] The key used in localStorage to store the preferences
 * @property {AllowedPreferences} [allowedPreferences] Specifies which preferences to manage
 */

/**
* @ignore
* @type {typeof import('video.js/dist/types/component').default}
*/
const Component = videojs.getComponent('Component');

/**
* A video.js component that persists user preferences across sessions using
* localStorage.
*
* It automatically saves and restores settings like volume, mute status,
* playback rate, selected text track, and selected audio track.
*
* @extends import('video.js/dist/types/component').default
*/
class UserPreferences extends Component {
  /**
  * Creates an instance of a UserPreferences.
  *
  * @param {import('video.js/dist/types/player.js').default} player The player instance
  * @param {UserPreferencesOptions} options Configuration options for the component.
  */
  constructor(player, options) {
    /** @type { UserPreferencesOptions } */
    const opts = videojs.obj.merge({
      createEl: false,
      storageName: 'vjs-user-preferences',
      allowedPreferences: {
        volume: true,
        muted: true,
        playbackRate: true,
        audioTrack: true,
        textTrack: true,
      }
    }, options);

    super(player, opts);

    this.bindListeners();

    this.player().on('emptied', this.emptied);
    this.player().on('volumechange', this.volumeChange);
    this.player().on('ratechange', this.playbackRateChange);
    this.player().textTracks().on('change', this.textTrackChange);
    this.player().audioTracks().on('change', this.audioTrackChange);
    this.player().on('loadeddata', this.restore);
  }

  /**
   * Handles changes in the selected audio track and saves the preference.
   *
   * It saves the language and kind of the enabled audio track.
   *
   * Does nothing if the player hasn't started yet.
   */
  audioTrackChange() {
    if (!this.player().hasStarted()) return;

    const { language, kind } = Array.from(this.player().audioTracks())
      .find(track => track.enabled) || {};

    this.save({
      audioTrack: { language, kind }
    });
  }

  /**
   * Binds necessary event listeners to the component instance.
   *
   * Ensures that methods have the correct `this` context when used as event
   * handlers.
   */
  bindListeners() {
    this.audioTrackChange = this.audioTrackChange.bind(this);
    this.emptied = this.emptied.bind(this);
    this.playbackRateChange = this.playbackRateChange.bind(this);
    this.restore = this.restore.bind(this);
    this.textTrackChange = this.textTrackChange.bind(this);
    this.volumeChange = this.volumeChange.bind(this);
  }

  /**
   * Cleans up the component by removing event listeners.
   *
   * Calls the super class's dispose method.
   */
  dispose() {
    this.player().off('emptied', this.emptied);
    this.player().off('volumechange', this.volumeChange);
    this.player().off('ratechange', this.playbackRateChange);
    this.player().textTracks().off('change', this.textTrackChange);
    this.player().audioTracks().off('change', this.audioTrackChange);
    this.player().off('loadeddata', this.restore);

    super.dispose();
  }

  /**
   * Handles the 'emptied' event from the player.
   *
   * Sets a flag to prevent saving preferences when the source changes rapidly.
   */
  emptied() {
    this.isEmptied = true;
  }

  /**
   * Filters a preference object, removing keys that are not allowed to be saved
   * based on the `allowedPreferences` option.
   *
   * @param {Object} preference The preference object potentially containing multiple keys to save.
   * @returns {Object} A new object containing only the allowed preferences.
   */
  filterPreferences(preference) {
    const filtered = {};
    /** @type { AllowedPreferences } */
    const allowed = this.options().allowedPreferences;

    for (const key in preference) {
      if (allowed[key] !== false) {
        filtered[key] = preference[key];
      }
    }

    return filtered;
  }

  /**
   * Handles changes in the playback rate and saves the preference.
   *
   * Does nothing if the player hasn't started or if the 'emptied' event was recently fired.
   */
  playbackRateChange() {
    if (!this.player().hasStarted() || this.isEmptied) return;

    this.save({
      playbackRate: this.player().playbackRate(),
    });
  }

  /**
   * Restores the previously selected audio track based on saved preferences.
   *
   * It attempts to find an exact match for language and kind. If not found,
   * it enables the first track matching the language.
   *
   * @param {PreferredAudioTrack} audioTrack The preferred audio track to restore
   */
  restoreAudioTrack(audioTrack) {
    if (!audioTrack || !audioTrack.language) return;

    const tracks = Array.from(this.player().audioTracks())
      .filter(track => audioTrack.language === track.language);

    const track = tracks.find(track =>
      audioTrack.language === track.language && audioTrack.kind === track.kind);

    if (track) {
      track.enabled = true;

      return;
    }

    if (!tracks.length) return;

    tracks[0].enabled = true;
  }

  /**
   * Restores the previously selected text track (subtitles/captions) based on
   * saved preferences.
   *
   * It updates the player's cache to reflect the saved language and kind.
   *
   * If no language is saved, it ensures text tracks are disabled.
   *
   * @param {PreferredTextTrack} [textTrack] The saved text track preference
   */
  restoreTextTrack(textTrack) {
    if (!textTrack) return;

    const textTracks = Array.from(this.player().textTracks())
      .filter(track => !['metadata', 'chapters'].includes(track.kind));

    if (!textTrack.language) return textTracks
      .forEach(track => track.mode = 'disabled');

    const track = textTracks.find(track =>
      textTrack.language === track.language && textTrack.kind === track.kind);

    if (track) return track.mode = 'showing';

    const defaultTrack = textTracks.find(track =>
      textTrack.language === track.language);

    if (defaultTrack) return defaultTrack.mode = 'showing';
  }

  /**
   * Restores all saved user preferences when the player has loaded data.
   *
   * This includes volume, mute status, playback rate, text track, and audio track.
   *
   * Resets the `isEmptied` flag.
   */
  restore() {
    const preferences = this.storage();

    if (!preferences) return;

    this.isEmptied = false;

    this.player().volume(this.getAllowedPreferenceValue(
      preferences,
      'volume'
    ));
    this.player().muted(this.getAllowedPreferenceValue(
      preferences,
      'muted'
    ));
    this.player().playbackRate(this.getAllowedPreferenceValue(
      preferences,
      'playbackRate'
    ));
    this.restoreTextTrack(this.getAllowedPreferenceValue(
      preferences,
      'textTrack'
    ));
    this.restoreAudioTrack(this.getAllowedPreferenceValue(
      preferences,
      'audioTrack'
    ));
  }

  /**
   * Retrieves a preference value only if its corresponding type is enabled in allowedPreferences.
   *
   * A preference is considered enabled if it is not explicitly set to `false` in the `allowedPreferences` option.
   *
   * @param {Object} preferences The stored preferences object.
   * @param {string} name The name of the preference to retrieve.
   *
   * @returns {*} The preference value if enabled, otherwise `undefined`.
   */
  getAllowedPreferenceValue(preferences, name) {
    if (this.options().allowedPreferences[name] === false) return;

    return preferences[name];
  }

  /**
   * Saves the provided preference object to localStorage.
   *
   * Merges the new preference with existing saved preferences.
   *
   * @param {Object} [preference] An object containing the preference(s) to save
   */
  save(preference) {
    if (!preference) return;

    try {
      const { storageName } = this.options();
      const storage = this.storage();
      const savablePreferences = this.filterPreferences(preference);
      const updatedStorage = videojs.obj.merge(storage, savablePreferences);

      localStorage.setItem(storageName, JSON.stringify(updatedStorage));
    } catch (e) {
      videojs.log.error('UserPreferences: Error saving preferences:', e);
    }
  }

  /**
   * Retrieves the user preferences object from localStorage.
   *
   * @returns {Object|null} The parsed preferences object, or null if not found or on error
   */
  storage() {
    const { storageName } = this.options();

    try {
      return JSON.parse(localStorage.getItem(storageName));

    } catch (e) {
      videojs.log.error('UserPreferences: localStorage:', e);
    }
  }

  /**
   * Handles changes in the active text track (subtitles/captions) and saves the preference.
   *
   * It saves the language and kind of the track currently being shown.
   *
   * Does nothing if the player hasn't started yet.
   */
  textTrackChange() {
    if (!this.player().hasStarted()) return;

    const { language, kind } = Array.from(this.player().textTracks()).find(track => track.mode === 'showing') || {};

    this.save({
      textTrack: { language, kind }
    });
  }

  /**
   * Handles changes in volume or mute status and saves the preferences.
   */
  volumeChange() {
    this.save({
      volume: this.player().volume(),
      muted: this.player().muted(),
    });
  }

  /**
   * Gets the version of the UserPreferences component.
   *
   * @returns {string} The component version string.
   * @static
   */
  static get VERSION() {
    return version;
  }
}

videojs.registerComponent('UserPreferences', UserPreferences);

export default UserPreferences;
