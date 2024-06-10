import videojs from 'video.js';
import './components/pillarbox-playlist-button.js';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/plugin').default}
 */
const Plugin = videojs.getPlugin('plugin');

/**
 *  A plugin that adds a playlist button to the control bar.
 */
class PillarboxPlaylistUI extends Plugin {

  /**
   * Creates an instance of the pillarbox playlist UI.
   *
   * @param {Player} player - The video.js player instance.
   * @param {Object} options - Plugin options.
   * @param {string} [options.insertChildBefore='fullscreenToggle'] - The control bar child name before which the playlist button should be inserted.
   * @param {Object} [options.modal={}] - Configuration for the modal dialog component. This can take any modal dialog options available in video.js.
   */
  constructor(player, options) {
    super(player);

    options = this.options_ = videojs.obj.merge(this.options_, options);
    player.ready(function() {
      if (!options.insertChildBefore) {
        player.controlBar.addChild('PillarboxPlaylistButton', options);

        return;
      }

      const controlBar = player.controlBar;
      const insertBefore = controlBar.getChild(options.insertChildBefore);
      const index = controlBar.children().indexOf(insertBefore);

      controlBar.addChild('PillarboxPlaylistButton', options, index);
    });
  }
}

PillarboxPlaylistUI.prototype.options_ = {
  insertChildBefore: 'fullscreenToggle'
};

videojs.registerPlugin('pillarboxPlaylistUI', PillarboxPlaylistUI);

export default PillarboxPlaylistUI;


