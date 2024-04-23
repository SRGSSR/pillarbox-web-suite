import pillarbox from '@srgssr/pillarbox-web';
import SkipButton from './skip-button.js';'./skip-button.js';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/plugin').default}
 */
const Plugin = pillarbox.getPlugin('plugin');

/**
 * Represents a SkipButtonPlugin plugin for the pillarbox player.
 */
class SkipButtonPlugin extends Plugin {
  /**
   * Creates an instance of a SkipButtonPlugin.
   *
   * @param {import('@srgssr/pillarbox-web').Player} player The player instance.
   * @param {Object} options Configuration options for the plugin.
   */
  constructor(player, options) {
    super(player, options);
    this.player.addChild('SkipButton');
  }
}

pillarbox.registerPlugin('skipButtonPlugin', SkipButtonPlugin);

export {SkipButtonPlugin, SkipButton};
