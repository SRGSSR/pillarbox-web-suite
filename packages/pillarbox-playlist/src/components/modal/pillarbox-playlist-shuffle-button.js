import videojs from 'video.js';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/menu/menu-item').default}
 */
const Button = videojs.getComponent('Button');

/**
 * The shuffle button for the playlist ui. When clicked shuffles the items
 * in the playlist.
 */
class PillarboxPlaylistShuffleButton extends Button {
  constructor(player, options) {
    options = videojs.mergeOptions({ controlText: 'Shuffle' }, options);
    super(player, options);
    this.setIcon('shuffle');
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
    this.$('.vjs-icon-placeholder').classList.toggle(`vjs-icon-shuffle`, true);
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
}

videojs.registerComponent('PillarboxPlaylistShuffleButton', PillarboxPlaylistShuffleButton);
