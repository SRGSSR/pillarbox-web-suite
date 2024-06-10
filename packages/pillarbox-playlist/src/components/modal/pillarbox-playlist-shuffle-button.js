import videojs from 'video.js';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/button').default}
 */
const Button = videojs.getComponent('Button');

/**
 * The shuffle button for the playlist ui. When clicked shuffles the items
 * in the playlist.
 */
class PillarboxPlaylistShuffleButton extends Button {
  constructor(player, options) {
    super(player, options);
    this.handleLanguagechange();
    this.setIcon('shuffle');

    this.player().ready(() => {
      this.$('.vjs-icon-placeholder').classList.toggle(`vjs-icon-shuffle`, true);
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
    this.playlist().shuffle();
  }

  /**
   * Handles the language change event to update the control text.
   */
  handleLanguagechange() {
    this.controlText(this.localize('Shuffle'));
  }
}

videojs.registerComponent('PillarboxPlaylistShuffleButton', PillarboxPlaylistShuffleButton);
