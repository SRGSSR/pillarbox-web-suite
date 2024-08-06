import videojs from 'video.js';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/button').default}
 */
const Button = videojs.getComponent('Button');

/**
 * The next item button for the playlist ui. When clicked moves to the
 * next item in the playlist.
 */
class PillarboxPlaylistNextItemButton extends Button {
  constructor(player, options) {
    options = videojs.mergeOptions({ controlText: 'Next Item' }, options);
    super(player, options);
    this.setIcon('next-item');
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
    this.$('.vjs-icon-placeholder').classList.toggle(`vjs-icon-next-item`, true);
  }

  /**
   * Handles the click event on the button.
   *
   * @param {Event} event - The click event.
   */
  handleClick(event) {
    super.handleClick(event);
    this.playlist().next();
  }
}

videojs.registerComponent('PillarboxPlaylistNextItemButton', PillarboxPlaylistNextItemButton);
