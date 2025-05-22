import videojs from 'video.js';
import { version } from '../package.json';
import './components/thumbnail-preview-overlay.js';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/plugin').default}
 */
const Plugin = videojs.getPlugin('plugin');
const log = videojs.log.createLogger('thumbnail-preview');

/**
 * Represents the ThumbnailPreview plugin that adds hover-based thumbnail
 * previews to the player's progress bar using a sprite sheet.
 */
export class ThumbnailPreview extends Plugin {

  /**
   * Creates an instance of a thumbnail preview plugin.
   *
   * @param {import('video.js/dist/types/player.js').default} player - The video.js player instance.
   * @param {Object} options - Configuration options.
   * @param {import('./components/thumbnail-preview-overlay.js').ThumbnailSpriteOptions} [options.sprite] - Sprite sheet configuration.
   * @param {import('./components/thumbnail-preview-overlay.js').BreakpointCoefficients} [options.breakpointsCoeficients] - Coefficients for responsive scaling.
   * @param {number} [options.displayThresholdHeight] - Height threshold under which the thumbnail is hidden.
   * @param {number} [options.resetPositionDelay=300] - Delay in milliseconds before resetting the thumbnail position after canceling (defaults to 300ms).
   */
  constructor(player, options) {
    super(player);

    if (this.isProgressControlDisabled()) {
      log.error(
        'Cannot initialize because no ProgressControl component was found in ' +
        'the player’s ControlBar. Make sure the player is configured with ' +
        'controlBar.progressControl enabled.'
      );

      return;
    }

    options = this.options_ = videojs.obj.merge(this.options_, options);

    this.player.options({
      controlBar: {
        progressControl: {
          thumbnailPreviewOverlay: options
        }
      }
    });

    this.player.ready(() => {
      const progressControl = this.player.controlBar.progressControl;

      this.thumbnailPreviewOverlay = progressControl.thumbnailPreviewOverlay;
      this.thumbnailPreviewOverlay.init();
    });
  }

  /**
   * Determines whether the progress control is disabled in the player's options.
   *
   * @returns {boolean} `true` if progress control is disabled, otherwise `false`.
   */
  isProgressControlDisabled() {
    const playerOpts = this.player.options();

    return playerOpts.controlBar === false ||
      playerOpts.controlBar?.progressControl === false ||
      (playerOpts.children && !playerOpts.children.includes('controlBar'));
  }

  /**
   * Updates the sprite used for displaying thumbnails.
   *
   * @param {import('./components/thumbnail-preview-overlay.js').ThumbnailSpriteOptions} sprite - New sprite configuration.
   */
  updateSprite(sprite) {
    this.thumbnailPreviewOverlay.updateSprite(sprite);
  }

  /**
   * Resets the sprite and disables the thumbnail preview.
   */
  resetSprite() {
    this.thumbnailPreviewOverlay.resetSprite();
  }

  static get VERSION() {
    return version;
  }
}

videojs.registerPlugin('thumbnailPreview', ThumbnailPreview);
