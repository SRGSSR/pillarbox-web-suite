import videojs from 'video.js';
import '@srgssr/svg-button';

/**
 * @ignore
 * @type {typeof import('@srgssr/svg-button').SvgButton}
 */
const SvgButton = videojs.getComponent('SvgButton');

/**
 * The next item button for the playlist ui. When clicked moves to the
 * next item in the playlist.
 */
class PillarboxPlaylistNextItemButton extends SvgButton {
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
    this.playlist().next();
  }
}

PillarboxPlaylistNextItemButton.prototype.options_ = {
  controlText: 'Next Item',
  iconName: 'next-item'
};

videojs.registerComponent('PillarboxPlaylistNextItemButton', PillarboxPlaylistNextItemButton);
