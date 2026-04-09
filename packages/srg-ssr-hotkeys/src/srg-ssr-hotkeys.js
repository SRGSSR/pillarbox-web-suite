import { version } from '../package.json';

/**
 * Utility class that handles default Video.js and custom keyboard shortcuts
 * based on the SRG SSR specification.
 *
 * @link https://videojs.org/guides/options/#useractionshotkeys
 * @link https://srgssr-ch.atlassian.net/browse/PLAYRTS-1269
 */
class HotkeysHelper {
  /**
   * Register all handlers, including default Video.js hotkeys and
   * custom SRG SSR shortcuts.
   *
   * @param {import('video.js/dist/types/player.js').default} player the player instance
   * @param {KeyboardEvent} event the keyboard event object
   *
   * @example
   * // Listen to player's keyboard shortcuts at the page level
   * const keydown = (event) => {
   *  player.userActive(true);
   *  HotkeysHelper.handle(player, event);
   * };
   * document.body.addEventListener('keydown', keydown);
   */
  static handle(player, event) {
    HotkeysHelper.defaultVideoJSHotkeys(player, event);
    HotkeysHelper.seek(player, event);
    HotkeysHelper.seekPercent(player, event);
    HotkeysHelper.togglePlay(player, event);
    HotkeysHelper.volume(player, event);
  }

  /**
   * Default video.js hotkeys handling.
   *
   * @param {import('video.js/dist/types/player.js').default} player the player instance
   * @param {KeyboardEvent} event the keyboard event object
   */
  static defaultVideoJSHotkeys(player, event) {
    player.handleHotkeys(event);
  }

  /**
   * Skips forward or backward in the video when horizontal arrow keys are pressed.
   *
   * @param {import('video.js/dist/types/player.js').default} player the player instance
   * @param {KeyboardEvent} event the keyboard event object
   */
  static seek(player, event) {
    if (!HotkeysHelper.#isArrowKey(event)) return;

    const seekAmount = HotkeysHelper.#seekAmount(player, event);
    const seekPosition = player.currentTime() + seekAmount;

    if (
      player.liveTracker &&
      player.liveTracker.atLiveEdge() &&
      seekAmount > 0
    ) {
      return;
    }

    player.currentTime(
      HotkeysHelper.#adjustedSeekPosition(player, seekPosition)
    );
  }

  /**
   * Seeks to a percentage of the video duration based on number keys (0-9).
   *
   * @param {import('video.js/dist/types/player.js').default} player the player instance
   * @param {KeyboardEvent} event the keyboard event object
   */
  static seekPercent(player, event) {
    const isNumber = /^[0-9]$/.test(event.key);

    if (!isNumber) return;

    const percent = parseInt(event.key, 10) / 10;
    const duration = HotkeysHelper.#mediaDuration(player);

    player.currentTime(duration * percent);
  }

  /**
   * Toggles the play/pause state of the video when the 'p' key is pressed.
   *
   * @param {import('video.js/dist/types/player.js').default} player the player instance
   * @param {KeyboardEvent} event the keyboard event object
   */
  static togglePlay(player, event) {
    if (event.key.toLowerCase() !== 'p') return;

    if (!player.paused()) {
      player.pause();

      return;
    }

    player.play();
  }

  /**
   * Increases or decreases the volume and mutes/unmutes appropriately.
   * Triggers on '+', '-', 'ArrowUp', or 'ArrowDown'.
   *
   * @param {import('video.js/dist/types/player.js').default} player the player instance
   * @param {KeyboardEvent} event the keyboard event object
   */
  static volume(player, event) {
    if (!['+', '-', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;

    const isVolumeUp = ['+', 'ArrowUp'].includes(event.key);
    const volumeStep = isVolumeUp ? 0.1 : -0.1;
    const volume = player.volume() + volumeStep;

    player.volume(volume);
    player.muted(player.volume() <= 0);
  }

  /**
   * Ensures the computed seek position safely falls within the bounds of the video.
   *
   * @param {import('video.js/dist/types/player.js').default} player the player instance
   * @param {number} seekPosition the desired time to seek to in seconds
   *
   * @returns {number} the safely clamped seek time in seconds
   */
  static #adjustedSeekPosition(player, seekPosition) {
    const duration = HotkeysHelper.#mediaDuration(player);

    if (seekPosition < 0) {
      return 0;
    }

    if (seekPosition > duration) {
      return duration - 0.1;
    }

    return seekPosition;
  }

  /**
   * Checks if the pressed key is a horizontal arrow key.
   *
   * @param {KeyboardEvent} event the keyboard event object
   *
   * @returns {boolean} true if the key is 'ArrowLeft' or 'ArrowRight'
   */
  static #isArrowKey(event) {
    return ['ArrowLeft', 'ArrowRight'].includes(event.key);
  }

  /**
   * Retrieves the accurate duration of the media, accounting for live streams.
   *
   * @param {import('video.js/dist/types/player.js').default} player the player instance
   *
   * @returns {number} the duration of the media in seconds
   */
  static #mediaDuration(player) {
    return player.liveTracker && player.liveTracker.isLive()
      ? player.liveTracker.liveWindow()
      : player.duration();
  }

  /**
   * Computes the amount of seconds to seek based on the specific arrow key.
   *
   * @param {import('video.js/dist/types/player.js').default} player the player instance
   * @param {KeyboardEvent} event the keyboard event object
   *
   * @returns {number} -10 for 'ArrowLeft' or 30 for 'ArrowRight'
   */
  static #seekAmount(player, event) {
    const {
      controlBar : {
        skipButtons : {
          backward = 10,
          forward = 30,
        } = {}
      } = {}
    } = player.options();

    const seekValues = {
      ArrowLeft: (backward * -1),
      ArrowRight: forward,
    };

    return seekValues[event.key];
  }
}

/**
 * Represents a SrgSsrHotkeys component for the pillarbox player.
 *
 * Applies video.js default keyboard shortcuts and additional custom shortcuts
 * following the SRG SSR specification.
 *
 * @link https://videojs.org/guides/options/#useractionshotkeys
 * @link https://srgssr-ch.atlassian.net/browse/PLAYRTS-1269
 *
 * @param {KeyboardEvent} event the keyboard event triggered by user interaction
 */
function srgSsrHotkeys(event) {
  /** @type{import('video.js/dist/types/player.js').default} */
  const player = this.player();

  HotkeysHelper.handle(player, event);
}

srgSsrHotkeys.prototype.VERSION = version;

export { srgSsrHotkeys as default, HotkeysHelper };
