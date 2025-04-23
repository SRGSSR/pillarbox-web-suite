import videojs from 'video.js';
import { version } from '../package.json';


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
  * @param {Object} options Configuration options for the component
  * @param {String} options.storageName - The localStorage name
  */
  constructor(player, options) {
    const opts = videojs.obj.merge({
      createEl: false, storageName: 'vjs-user-preferences'
    }, options);

    super(player, opts);

    this.bindListeners();

    this.player().on('emptied', this.emptied);
    this.player().on('volumechange', this.volumeChange);
    this.player().on('ratechange', this.playbackRateChange);
    this.player().textTracks().on('change', this.textTrackChange);
    this.player().audioTracks().on('change', this.audioTrackChange);
    this.player().on('loadeddata', this.restoreUserPreference);
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
    this.volumeChange = this.volumeChange.bind(this);
    this.playbackRateChange = this.playbackRateChange.bind(this);
    this.restoreUserPreference = this.restoreUserPreference.bind(this);
    this.textTrackChange = this.textTrackChange.bind(this);
    this.audioTrackChange = this.audioTrackChange.bind(this);
    this.emptied = this.emptied.bind(this);
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
    this.player().off('loadeddata', this.restoreUserPreference);

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
   * @param {Object} preferences The user preferences object retrieved from storage
   * @param {Object} preferences.audioTrack The saved audio track preference
   * @param {string} [preferences.audioTrack.language] The language of the saved audio track
   * @param {string} [preferences.audioTrack.kind] The kind of the saved audio track
   */
  restoreAudioTrack({ audioTrack }) {
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
   * @param {Object} preferences The user preferences object retrieved from storage
   * @param {Object} [preferences.textTrack] The saved text track preference
   * @param {string} [preferences.textTrack.language] The language of the saved text track
   * @param {string} [preferences.textTrack.kind] The kind of the saved text track
   */
  restoreTextTrack({ textTrack }) {
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
  restoreUserPreference() {
    const preferences = this.storage();

    if (!preferences) return;

    this.isEmptied = false;

    this.player().volume(preferences.volume);
    this.player().muted(preferences.muted);
    this.player().playbackRate(preferences.playbackRate);
    this.restoreTextTrack(preferences);
    this.restoreAudioTrack(preferences);
  }

  /**
   * Saves the provided preference object to localStorage.
   *
   * Merges the new preference with existing saved preferences.
   *
   * @param {Object} preference An object containing the preference(s) to save
   */
  save(preference) {
    const { storageName } = this.options();

    try {
      const storage = this.storage();

      if (preference) {
        const updatedStorage = videojs.obj.merge(storage, preference);

        localStorage.setItem(storageName, JSON.stringify(updatedStorage));
      }
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
