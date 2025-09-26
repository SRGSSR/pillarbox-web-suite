import videojs from 'video.js';
import '@srgssr/svg-button';

/**
 * @ignore
 * @type {typeof import('@srgssr/svg-button').SvgButton}
 */
const SvgButton = videojs.getComponent('SvgButton');

/**
 * The previous item button for the playlist ui. When clicked moves to the
 * previous item in the playlist.
 */
class PillarboxPlaylistPreviousItemButton extends SvgButton {
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
    this.playlist().previous();
  }
}

PillarboxPlaylistPreviousItemButton.prototype.options_ = {
  controlText: 'Previous Item',
  iconName: 'previous-item',
};

videojs.registerComponent('PillarboxPlaylistPreviousItemButton', PillarboxPlaylistPreviousItemButton);
