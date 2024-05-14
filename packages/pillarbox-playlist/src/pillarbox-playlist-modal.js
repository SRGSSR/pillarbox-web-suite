import videojs from 'video.js';
import './pillarbox-playlist-menu-item.js';

/**
 * @ignore
 * @type {typeof import('./pillarbox-playlist-menu-item.js').default}
 */
const PillarboxPlaylistMenuItem = videojs.getComponent('PillarboxPlaylistMenuItem');
/**
 * @ignore
 * @type {typeof import('video.js/dist/types/button').default}
 */
const Button = videojs.getComponent('Button');
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
  _onPlaylistStateChanged = ({ changes }) => {
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
   */
  constructor(player, options) {
    options.temporary = false;

    super(player, options);
    this.fill();
    this.renderComponent();
    this.playlist().on('statechanged', this._onPlaylistStateChanged);
  }

  buildCSSClass() {
    return `pbw-playlist-dialog ${super.buildCSSClass()}`;
  }

  /**
   * Dispose of the PlaylistMenuDialog instance.
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
      const itemEl  = new Component(this.player(), {
        name: 'PillarboxPlaylistMenuItem',
        el: videojs.dom.createEl('li', {
          className: 'pbw-playlist-item'
        })
      });

      itemEl.addChild(new PillarboxPlaylistMenuItem(this.player(), {
        item, index, name: 'PillarboxPlaylistMenuItemButton'
      }));

      itemListEl.addChild(itemEl);
    });


    this.addChild(itemListEl);
  }

  /**
   * Create the playlist control buttons.
   *
   * @returns {Component} The component containing the playlist control buttons.
   */
  createControls() {
    const playlistControls = new Component(this.player(), {
      name: 'PlaylistControls',
      className: 'pbw-playlist-controls'
    });

    playlistControls.addChild(this.createRepeatButton());
    playlistControls.addChild(this.createSuffleButton());
    playlistControls.addChild(this.createPreviousItemButton());
    playlistControls.addChild(this.createNextItemButton());

    return playlistControls;
  }

  /**
   * Create the "Previous Item" button.
   *
   * @returns {Button} The button to go to the previous item in the playlist.
   */
  createPreviousItemButton() {
    return this.setButtonIcon(new Button(this.player(), {
      name: 'PreviousItemButton',
      controlText: this.localize('Previous Item'),
      clickHandler: () => this.playlist().previous()
    }), 'previous-item');
  }

  /**
   * Create the "Repeat" button.
   *
   * @returns {Button} The button to toggle repeat mode in the playlist.
   */
  createRepeatButton() {
    const repeatButton = this.setButtonIcon(new Button(this.player(), {
      name: 'RepeatButton',
      controlText: this.localize('Repeat'),
      className: this.playlist().repeat ? 'vjs-selected' : '',
      clickHandler: () => {
        this.playlist().toggleRepeat();
        repeatButton.toggleClass('vjs-selected', this.playlist().repeat);
      }
    }), 'repeat');

    return repeatButton;
  }

  /**
   * Create the "Shuffle" button.
   *
   * @returns {Button} The button to shuffle the playlist.
   */
  createSuffleButton() {
    return this.setButtonIcon(new Button(this.player(), {
      name: 'ShuffleButton',
      controlText: this.localize('Shuffle'),
      clickHandler: () => this.playlist().shuffle()
    }), 'shuffle');
  }

  /**
   * Create the "Next Item" button.
   *
   * @returns {Button} The button to go to the next item in the playlist.
   */
  createNextItemButton() {
    return this.setButtonIcon(new Button(this.player(), {
      name: 'NextItemButton',
      controlText: this.localize('Next Item'),
      clickHandler: () => this.playlist().next()
    }), 'next-item');
  }

  /**
   * Set the icon for a button.
   *
   * @param {Button} button The button to set the icon for.
   * @param {string} iconName The name of the icon to set.
   *
   * @returns {Button} The button with the icon set.
   */
  setButtonIcon(button, iconName) {
    button.setIcon(iconName);
    this.player().ready(() => {
      button.$('.vjs-icon-placeholder').classList.toggle(`vjs-icon-${iconName}`, true);
    });

    return button;
  }

  /**
   * Render the component, including controls and playlist items.
   */
  renderComponent() {
    this.addChild(this.createControls());
    this.renderItems();
  }

  /**
   * Handles the language change event to update the control text.
   */
  handleLanguagechange() {
    const controls = this.getChild('PlaylistControls');

    controls.getChild('PreviousItemButton').controlText(this.localize('Previous Item'));
    controls.getChild('RepeatButton').controlText(this.localize('Repeat'));
    controls.getChild('ShuffleButton').controlText(this.localize('Shuffle'));
    controls.getChild('NextItemButton').controlText(this.localize('Next Item'));
  }
}

videojs.registerComponent('PlaylistMenuDialog', PlaylistMenuDialog);
