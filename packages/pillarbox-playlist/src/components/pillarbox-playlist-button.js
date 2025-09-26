import videojs from 'video.js';
import '@srgssr/svg-button';

/**
 * @ignore
 * @type {typeof import('@srgssr/svg-button').SvgButton}
 */
const SvgButton = videojs.getComponent('SvgButton');

/**
 * Class representing a button that opens the playlist menu.
 */
class PillarboxPlaylistButton extends SvgButton {
  /**
   * Handles the 'statechanged' event when triggered by the playlist. This method
   * serves as a proxy to the main `statechanged` handler, ensuring that additional
   * logic can be executed or making it easier to detach the event listener later.
   *
   * @private
   */
  onPlaylistStateChanged_ = ({ changes }) => {
    if ('items' in changes) {
      this.toggleVisibility();
    }
  };

  /**
   * Creates an instance of PillarboxPlaylistButton.
   *
   * @param {Object} player - The video.js player instance.
   * @param {Object} options - Options for the button.
   */
  constructor(player, options) {
    super(player, options);
    this.playlist().on('statechanged', this.onPlaylistStateChanged_);
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
   * Dispose of the PillarboxPlaylistButton instance.
   */
  dispose() {
    this.playlist().off('statechanged', this.onPlaylistStateChanged_);
    super.dispose();
  }

  /**
   * Builds the CSS class string for the button.
   *
   * @returns {string} The CSS class string.
   */
  buildCSSClass() {
    return `pbw-playlist-button vjs-hidden ${super.buildCSSClass()}`;
  }

  /**
   * Handles the click event on the button.
   *
   * @param {Event} event - The click event.
   */
  handleClick(event) {
    super.handleClick(event);
    this.player().getChild('PillarboxPlaylistMenuDialog').open();
  }

  /**
   * Toggles the visibility of the element based on the presence of items in the playlist.
   */
  toggleVisibility() {
    if (this.playlist().items.length > 0) {
      this.show();

      return;
    }

    this.hide();
  }
}

PillarboxPlaylistButton.prototype.options_ = {
  controlText: 'Playlist',
  iconName: 'chapters'
};

videojs.registerComponent('PillarboxPlaylistButton', PillarboxPlaylistButton);
