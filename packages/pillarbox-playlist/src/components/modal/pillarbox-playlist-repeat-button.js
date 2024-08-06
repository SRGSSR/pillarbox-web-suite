import videojs from 'video.js';
import { RepeatMode } from '../../pillarbox-playlist.js';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/button').default}
 */
const Button = videojs.getComponent('Button');

/**
 * The repeat button for the playlist ui. When clicked toggles the repeat mode
 * of the playlist.
 */
class PillarboxPlaylistRepeatButton extends Button {
  constructor(player, options) {
    options = videojs.mergeOptions({ controlText: 'Repeat' }, options);
    super(player, options);
    this.controlText(this.repeatModeAsString());
    this.setIcon('repeat');
  }

  /**
   * Get the playlist instance associated with the player.
   *
   * @returns {import('packages/pillarbox-playlist/src/pillarbox-playlist.js').default} The playlist instance.
   */
  playlist() {
    return this.player().pillarboxPlaylist();
  }

  ready() {
    this.$('.vjs-icon-placeholder').classList.toggle(`vjs-icon-repeat`, true);
  }

  repeatModeAsString() {
    switch (this.playlist().repeat) {
      case RepeatMode.NO_REPEAT:
        return 'No Repeat';
      case RepeatMode.REPEAT_ALL:
        return 'Repeat All';
      case RepeatMode.REPEAT_ONE:
        return 'Repeat One';
    }
  }

  /**
   * Builds the CSS class string for the button.
   *
   * @returns {string} The CSS class string.
   */
  buildCSSClass() {
    return `${this.playlist().repeat ? 'vjs-selected' : ''} ${super.buildCSSClass()}`;
  }

  /**
   * Handles the click event on the button.
   *
   * @param {Event} event - The click event.
   */
  handleClick(event) {
    super.handleClick(event);
    this.playlist().toggleRepeat();
    this.toggleClass('vjs-selected', !this.playlist().isNoRepeatMode());
    this.toggleClass('pbw-repeat-one', this.playlist().isRepeatOneMode());
    this.controlText(this.repeatModeAsString());
    this.setAttribute('aria-pressed', !this.playlist().isNoRepeatMode());
  }
}

videojs.registerComponent('PillarboxPlaylistRepeatButton', PillarboxPlaylistRepeatButton);
