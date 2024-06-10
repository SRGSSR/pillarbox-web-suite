import videojs from 'video.js';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/button').default}
 */
const Button = videojs.getComponent('Button');

/**
 * The previous item button for the playlist ui. When clicked moves to the
 * previous item in the playlist.
 */
class PillarboxPlaylistPreviousItemButton extends Button {
  constructor(player, options) {
    super(player, options);
    this.handleLanguagechange();
    this.setIcon('previous-item');

    this.player().ready(() => {
      this.$('.vjs-icon-placeholder').classList.toggle(`vjs-icon-previous-item`, true);
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
   * Handles the click event on the button.
   *
   * @param {Event} event - The click event.
   */
  handleClick(event) {
    super.handleClick(event);
    this.playlist().previous();
  }

  /**
   * Handles the language change event to update the control text.
   */
  handleLanguagechange() {
    this.controlText(this.localize('Previous Item'));
  }
}

videojs.registerComponent('PillarboxPlaylistPreviousItemButton', PillarboxPlaylistPreviousItemButton);
