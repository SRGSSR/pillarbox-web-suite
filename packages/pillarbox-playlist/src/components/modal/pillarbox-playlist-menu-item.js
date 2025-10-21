import videojs from 'video.js';
import '@srgssr/card';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/button').default}
 */
const CardButton = videojs.getComponent('CardButton');

/**
 * Class representing a playlist menu item in the Pillarbox plugin.
 */
class PillarboxPlaylistMenuItem extends CardButton {
  /**
   * Creates an instance of PillarboxPlaylistMenuItem.
   * @param {Object} player - The video.js player instance.
   * @param {Object} options - Options for the menu item.
   * @param {number} options.index - The index of the playlist item.
   */
  constructor(player, options) {
    super(player, options);
    this.select(options.index === this.playlist().currentIndex);
  }

  /**
   * Gets the Pillarbox playlist associated with the player.
   *
   * @returns {import('/packages/pillarbox-playlist/src/pillarbox-playlist.js').default} The Pillarbox playlist.
   */
  playlist() {
    return this.player().pillarboxPlaylist();
  }

  /**
   * Handles the click event on the menu item.
   *
   * @param {Event} event - The click event.
   */
  handleClick(event) {
    super.handleClick(event);
    this.playlist().select(this.options().index);
  }
}

videojs.registerComponent('PillarboxPlaylistMenuItem', PillarboxPlaylistMenuItem);
