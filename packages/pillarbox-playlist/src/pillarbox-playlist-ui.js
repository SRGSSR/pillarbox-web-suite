import videojs from 'video.js';
import './pillarbox-playlist-button.js';

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
   * @param {string} [options.insertChildBefore] - The control bar child name before which the playlist button should be inserted.
   */
  constructor(player, options) {
    super(player);

    player.ready(function() {
      if (!options.insertChildBefore) {
        player.controlBar.addChild('PillarboxPlaylistButton');

        return;
      }

      const controlBar = player.controlBar;
      const insertBefore = controlBar.getChild(options.insertChildBefore);
      const index = controlBar.children().indexOf(insertBefore);

      controlBar.addChild('PillarboxPlaylistButton', {}, index);
    });
  }
}

videojs.registerPlugin('pillarboxPlaylistUI', PillarboxPlaylistUI);

export default PillarboxPlaylistUI;


