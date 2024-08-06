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
    options = videojs.mergeOptions({ controlText: 'Previous Item' }, options);
    super(player, options);
    this.setIcon('previous-item');
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
    this.$('.vjs-icon-placeholder').classList.toggle(`vjs-icon-previous-item`, true);
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
}

videojs.registerComponent('PillarboxPlaylistPreviousItemButton', PillarboxPlaylistPreviousItemButton);
