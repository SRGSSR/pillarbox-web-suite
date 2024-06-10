import videojs from 'video.js';

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
    super(player, options);
    this.handleLanguagechange();
    this.setIcon('repeat');

    this.player().ready(() => {
      this.$('.vjs-icon-placeholder').classList.toggle(`vjs-icon-repeat`, true);
    });
  }

  /**
   * Get the playlist instance associated with the player.
   *
   * @returns {import('pillarbox-playlist.js').default} The playlist instance.
   */
  playlist() {
    return this.player().pillarboxPlaylist();
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
    this.toggleClass('vjs-selected', this.playlist().repeat);
  }

  /**
   * Handles the language change event to update the control text.
   */
  handleLanguagechange() {
    this.controlText(this.localize('Repeat'));
  }
}

videojs.registerComponent('PillarboxPlaylistRepeatButton', PillarboxPlaylistRepeatButton);
