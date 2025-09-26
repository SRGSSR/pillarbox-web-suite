import videojs from 'video.js';
import '@srgssr/svg-button';

/**
 * @ignore
 * @type {typeof import('@srgssr/svg-button').SvgButton}
 */
const SvgButton = videojs.getComponent('SvgButton');

/**
 * The shuffle button for the playlist ui. When clicked shuffles the items
 * in the playlist.
 */
class PillarboxPlaylistShuffleButton extends SvgButton {
  constructor(player, options) {
    super(player, options);
  }

  /**
   * Get the playlist instance associated with the player.
   *
   * @returns {import('packages/pillarbox-playlist/src/pillarbox-playlist.js').default} The playlist instance.
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
}

PillarboxPlaylistShuffleButton.prototype.options_ = {
  controlText: 'Shuffle',
  iconName: 'shuffle',
};

videojs.registerComponent('PillarboxPlaylistShuffleButton', PillarboxPlaylistShuffleButton);
