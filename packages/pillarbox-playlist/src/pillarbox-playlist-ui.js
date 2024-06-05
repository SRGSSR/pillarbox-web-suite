import videojs from 'video.js';
import './components/pillarbox-playlist-button.js';
import './components/modal/pillarbox-playlist-modal.js';
import './lang';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/plugin').default}
 */
const Plugin = videojs.getPlugin('plugin');
const log = videojs.log.createLogger('pillarbox-playlist-ui');

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
   * @param {Object} [options.pillarboxPlaylistButton={}] - Configuration for the playlist button.
   * @param {Object} [options.pillarboxPlaylistMenuDialog={}] - Configuration for the modal dialog component. This can take any modal dialog options available in video.js.
   */
  constructor(player, options) {
    super(player);

    if (!player.usingPlugin('pillarboxPlaylist')) {
      log.error('pillarbox-playlist plugin is required');

      return;
    }

    options = this.options_ = videojs.obj.merge(this.options_, options);

    player.options({
      pillarboxPlaylistMenuDialog: options.pillarboxPlaylistMenuDialog ?? true,
      controlBar: this.mergeControlBarOptions(player, options)
    });
  }

  /**
   * This function takes the existing control bar options from the player instance
   * and merges them with the provided plugin options:
   *
   * - If the control bar is disabled in the player options, it returns the existing control bar
   *   settings without modifications.
   * - Otherwise, it merges the default ControlBar options and the player's control bar
   *   options, and then handles the insertion of the pillarbox playlist button.
   *   into the control bar's children array.
   *
   * @param {Player} player - The  player instance.
   * @param {Object} options - The options to merge into the control bar options.
   * @param {string} [options.insertChildBefore] - The name of the child before which to insert the pillarbox playlist button.
   *
   * @returns {Object|boolean} The merged control bar options, or false if the control bar is disabled.
   */
  mergeControlBarOptions(player, options) {
    if (player.options_.controlBar === false) return player.options_.controlBar;

    const controlBarOptions = videojs.obj.merge(
      videojs.getComponent('ControlBar').prototype.options_,
      player.options_.controlBar
    );
    const index = controlBarOptions.children.findIndex(
      item => item === options.insertChildBefore
    );

    if (options.insertChildBefore && index !== -1) {
      const children = [...controlBarOptions.children];

      children.splice(index, 0, 'pillarboxPlaylistButton');
      controlBarOptions.children = children;

      return controlBarOptions;
    }

    controlBarOptions.pillarboxPlaylistButton =
      options.pillarboxPlaylistButton ?? true;

    return controlBarOptions;
  }

}

PillarboxPlaylistUI.prototype.options_ = {
  insertChildBefore: 'fullscreenToggle'
};

videojs.registerPlugin('pillarboxPlaylistUI', PillarboxPlaylistUI);

export default PillarboxPlaylistUI;


