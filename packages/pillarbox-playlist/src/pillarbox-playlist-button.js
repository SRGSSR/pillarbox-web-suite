import videojs from 'video.js';
import './pillarbox-playlist-modal.js';
import './lang';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/button').default}
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
  _onPlaylistStateChanged = ({ changes }) => {
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
    this.handleLanguagechange();
    this.setIcon('chapters');
    player.ready(() => {
      this.$('.vjs-icon-placeholder').classList.toggle('vjs-icon-chapters', true);
      player.addChild('PlaylistMenuDialog', {pauseOnOpen: false});
    });

    this.playlist().on('statechanged', this._onPlaylistStateChanged);
  }

  /**
   * Dispose of the PillarboxPlaylistButton instance.
   */
  dispose() {
    this.playlist().off('statechanged', this._onPlaylistStateChanged);
    super.dispose();
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
    this.player().getChild('PlaylistMenuDialog').open();
  }

  /**
   * Handles the language change event to update the control text.
   */
  handleLanguagechange() {
    this.controlText(this.localize('Playlist'));
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
