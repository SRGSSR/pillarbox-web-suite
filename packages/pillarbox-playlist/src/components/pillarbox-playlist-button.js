import videojs from 'video.js';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/menu/menu-item').default}
 */
const Button = videojs.getComponent('Button');

/**
 * Class representing a button that opens the playlist menu.
 */
class PillarboxPlaylistButton extends Button {
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
    options = videojs.mergeOptions({ controlText: 'Playlist' }, options);
    super(player, options);
    this.setIcon('chapters');
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

  ready() {
    this.$('.vjs-icon-placeholder').classList.toggle('vjs-icon-chapters', true);
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

videojs.registerComponent('PillarboxPlaylistButton', PillarboxPlaylistButton);
