import videojs from 'video.js';
import './pillarbox-playlist-menu-item.js';
import './pillarbox-playlist-controls.js';

/**
 * @ignore
 * @type {typeof import('./pillarbox-playlist-menu-item.js').default}
 */
const PillarboxPlaylistMenuItem = videojs.getComponent('PillarboxPlaylistMenuItem');
/**
 * @ignore
 * @type {typeof import('video.js/dist/types/component').default}
 */
const Component = videojs.getComponent('Component');
/**
 * @ignore
 * @type {typeof import('video.js/dist/types/modal-dialog').default}
 */
const ModalDialog = videojs.getComponent('ModalDialog');

/**
 * PlaylistMenuDialog is a custom dialog that extends the ModalDialog class.
 * It is designed to manage and display a playlist with various controls.
 */
class PlaylistMenuDialog extends ModalDialog {
  /**
   * Handles the 'statechanged' event when triggered by the playlist. This method
   * serves as a proxy to the main `statechanged` handler, ensuring that additional
   * logic can be executed or making it easier to detach the event listener later.
   *
   * @private
   */
  onPlaylistStateChanged_ = ({ changes }) => {
    if ('items' in changes) {
      this.removeItems();
      this.renderItems();
    }

    if ('currentIndex' in changes) {
      this.select(changes.currentIndex.to);
    }
  };

  /**
   * Creates an instance of PlaylistMenuDialog.
   *
   * @param {import('@srgssr/pillarbox-web').Player} player - The pillarbox player instance.
   * @param {Object} options - Options for the dialog.
   * @param {boolean} [options.pauseOnOpen=false] - If true, the player will pause when the modal dialog is opened.
   * @param {Object} [options.pillarboxPlaylistControls={}] - Configuration for the control buttons within the modal. You can define the order of the buttons, remove buttons you don't need, or add new ones.
   */
  constructor(player, options) {
    options.temporary = false;
    options = videojs.mergeOptions({ pauseOnOpen: false }, options);

    super(player, options);

    this.fill();
    this.addChild('PillarboxPlaylistControls', options.pillarboxPlaylistControls);
    this.renderItems();
    this.playlist().on('statechanged', this.onPlaylistStateChanged_);
  }

  buildCSSClass() {
    return `pbw-playlist-dialog ${super.buildCSSClass()}`;
  }

  /**
   * Dispose of the PlaylistMenuDialog instance.
   */
  dispose() {
    this.playlist().off('statechanged', this.onPlaylistStateChanged_);
    super.dispose();
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
   * Update the playlist item UI with the selected index.
   *
   * @param {number} index - The index of the item to select.
   */
  select(index) {
    const itemList = this.getChild('PillarboxPlaylistMenuItemsList');

    itemList.children()
      .filter(item => item.name() === 'PillarboxPlaylistMenuItem')
      .map(item => item.getChild('PillarboxPlaylistMenuItemButton'))
      .forEach(button => button.selected(index === button.options().index));
  }

  /**
   * Remove all playlist items from the dialog.
   */
  removeItems() {
    this.removeChild(this.getChild('PillarboxPlaylistMenuItemsList'));
  }

  /**
   * Render the playlist items in the dialog.
   */
  renderItems() {
    const itemListEl = new Component(this.player(), {
      name: 'PillarboxPlaylistMenuItemsList',
      el: videojs.dom.createEl('ol', {
        className: 'pbw-playlist-items'
      })
    });

    this.playlist().items.forEach((item, index) => {
      const itemEl = new Component(this.player(), {
        name: 'PillarboxPlaylistMenuItem',
        el: videojs.dom.createEl('li', {
          className: 'pbw-playlist-item'
        })
      });

      itemEl.addChild(new PillarboxPlaylistMenuItem(this.player(), {
        item,
        index,
        name: 'PillarboxPlaylistMenuItemButton'
      }));

      itemListEl.addChild(itemEl);
    });

    this.addChild(itemListEl);
  }
}

videojs.registerComponent('PillarboxPlaylistMenuDialog', PlaylistMenuDialog);
