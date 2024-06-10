import videojs from 'video.js';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/menu/menu-item').default}
 */
const Button = videojs.getComponent('Button');

/**
 * Class representing a playlist menu item in the Pillarbox plugin.
 */
class PillarboxPlaylistMenuItem extends Button {
  /**
   * Creates an instance of PillarboxPlaylistMenuItem.
   * @param {Object} player - The video.js player instance.
   * @param {Object} options - Options for the menu item.
   * @param {number} options.index - The index of the playlist item.
   * @param {Object} options.item - The playlist item data.
   * @param {Object} options.item.data - The data for the playlist item.
   * @param {string} options.item.data.title - The title of the playlist item.
   * @param {number} options.item.data.duration - The duration of the playlist item.
   */
  constructor(player, options) {
    super(player, options);
    this.selected(options.index === this.playlist().currentIndex);
    this.controlText(`${this.options_.item.data?.title} - ${videojs.formatTime(this.options_.item.data?.duration)}`);
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
    this.playlist().select(this.options_.index);
  }

  /**
   * Sets the selected state of the menu item.
   *
   * @param {boolean} selected - Whether the menu item is selected.
   */
  selected(selected) {
    this.toggleClass('vjs-selected', selected);
  }

  /**
   * Builds the CSS class string for the menu item.
   *
   * @returns {string} The CSS class string.
   */
  buildCSSClass() {
    return `pbw-playlist-item-button vjs-visible-text ${super.buildCSSClass()}`;
  }
}

videojs.registerComponent('PillarboxPlaylistMenuItem', PillarboxPlaylistMenuItem);
