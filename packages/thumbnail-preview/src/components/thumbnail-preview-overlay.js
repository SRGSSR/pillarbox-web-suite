import videojs from 'video.js';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/component').default}
 */
const Component = videojs.getComponent('Component');
const log = videojs.log.createLogger('thumbnail-preview-overlay');

/**
 * Represents a ThumbnailPreviewOverlay component for the videojs player.
 * Shows video thumbnails on hover or seek over the progress bar using sprite images.
 */
class ThumbnailPreviewOverlay extends Component {
  /**
   * Handler for canceling the preview display.
   *
   * This method serves as a proxy to the main `resetThumbnailPosition` handler,
   * ensuring that additional logic can be executed or making it easier to
   * detach the event listener later.
   *
   * @private
   */
  #onCancel = () => this.resetThumbnailPosition();
  /**
   * Handler for pointer movement over the progress bar.
   *
   * This method serves as a proxy to the main `onMove` handler, ensuring
   * that additional logic can be executed or making it easier to detach the
   * event listener later.
   *
   * @private
   */
  #onMove = (e) => this.onMove(e);
  /**
   * Handler for player resize events to adjust thumbnail display.
   *
   * This method serves as a proxy to the main `updateThumbnailVisibility`
   * handler, ensuring that additional logic can be executed or making it
   * easier to detach the event listener later.
   *
   * @private
   */
  #onPlayerResize = () => this.updateThumbnailVisibility();

  /**
   * Private handler for the emptied event to reset the sprite state.
   *
   * This method serves as a proxy to the main `resetSprite` handler, ensuring
   * that additional logic can be executed or making it easier to detach the
   * event listener later.
   *
   * @private
   */
  #onEmpty = () => this.resetSprite();

  /**
   * Flag indicating whether the component has active listeners.
   *
   * @private
   * @type {boolean}
   */
  #active = false;

  /**
   * Creates an instance of ThumbnailPreviewOverlay.
   *
   * @param {import('video.js/dist/types/player.js').default} player - The video.js player instance.
   * @param {Object} options - Configuration options.
   * @param {ThumbnailSpriteOptions} [options.sprite] - Sprite sheet configuration.
   * @param {BreakpointCoefficients} [options.breakpointsCoeficients] - Coefficients for responsive scaling.
   * @param {number} [options.displayThresholdHeight] - Height threshold under which the thumbnail is hidden.
   * @param {number} [options.resetPositionDelay=300] - Delay in milliseconds before resetting the thumbnail position after canceling (defaults to 300ms).
   */
  constructor(player, options = {}) {
    super(player, options);
    this.player().on('emptied', this.#onEmpty);
  }

  /**
   * Initializes the ThumbnailPreview component.
   *
   * When properly configured, it attaches the necessary listeners and
   * resizes the thumbnail holder to match the expected layout.
   */
  init() {
    const { sprite } = this.options();

    if (sprite && sprite.url) {
      this.initListeners();
      this.resizeThumbnail();
      this.thumbnail.src = sprite.url ?? '';
      this.updateThumbnailVisibility();
    } else {
      this.resetSprite();
    }
  }

  /**
   * Retrieves the progress control component from the player's control bar.
   *
   * @returns {import('video.js/dist/types/control-bar/progress-control/progress-control').default} The progress control component, if available.
   */
  getProgressControl() {
    return this.player().controlBar?.progressControl;
  }

  /**
   * Updates the sprite metadata and image source.
   *
   * @param {ThumbnailSpriteOptions} sprite - New sprite sheet configuration.
   */
  updateSprite(sprite) {
    this.options({ sprite });
    this.init();
  }

  /**
   * Resets the sprite state by removing event listeners and hiding the component.
   */
  resetSprite() {
    this.removeListeners();
    this.hide();
  }

  /**
   * Initializes event listeners and verifies required components.
   */
  initListeners() {
    if (this.#active) return;

    const progressControl = this.getProgressControl();

    progressControl.on('pointermove', this.#onMove);
    progressControl.on('pointerleave', this.#onCancel);
    this.player().on('userinactive', this.#onCancel);
    this.player().on('playerresize', this.#onPlayerResize);

    this.#active = true;
  }

  /**
   * Removes all event listeners attached during thumbnail preview activation.
   *
   * Prevents unexpected behavior when the component is no longer active.
   */
  removeListeners() {
    if (!this.#active) return;

    const progressControl = this.getProgressControl();

    progressControl.off('pointermove', this.#onMove);
    progressControl.off('pointerleave', this.#onCancel);
    this.player().off('userinactive', this.#onCancel);
    this.player().off('playerresize', this.#onPlayerResize);

    this.#active = false;
  }

  /**
   * Cleans up event listeners when the component is disposed.
   */
  dispose() {
    this.player().off('empty', this.#onEmpty);
    this.removeListeners();
    super.dispose();
  }

  /**
   * Updates the visibility of the thumbnail preview based on player height.
   *
   * Hides the preview if the player's height is below the configured threshold;
   * otherwise, shows it. Always resizes the thumbnail regardless.
   */
  updateThumbnailVisibility() {
    const height = this.player().currentDimension('height');

    this.resizeThumbnail();

    if (height < this.options().displayThresholdHeight) {
      this.hide();

      return;
    }

    this.show();
  }

  /**
   * Resets the thumbnail position.
   */
  resetThumbnailPosition() {
    setTimeout(() => {
      this.el().style.transform = 'translateX(-1000px)';
    }, this.options().resetPositionDelay ?? 300);
  }

  /**
   * Handles movement over the progress bar and updates the thumbnail accordingly.
   *
   * @param {Event} event - Mouse or touch event triggering the move.
   */
  onMove(event) {
    const progressControl = this.getProgressControl();

    if (!progressControl) {
      log.error('progressControl is missing or invalid during mouse move.');

      return;
    }

    const rect = videojs.dom.getBoundingClientRect(progressControl.el());
    const point = ThumbnailPreviewOverlay.calculatePointBoundary(
      videojs.dom.getPointerPosition(progressControl.el(), event).x
    );

    const position = this.calculateThumbnailHolderPosition(rect, point);
    const seekingTime = Math.floor(this.player().duration() * point);

    this.el().style.transform = `translateX(${position}px)`;
    this.calculateFrame(seekingTime);
  }

  /**
   * Ensures a normalized value between 0 and 1 for the pointer position.
   *
   * @param {number} xPoint - Normalized horizontal position from pointer.
   * @returns {number} Clamped value between 0 and 1.
   */
  static calculatePointBoundary(xPoint) {
    return Math.max(0, Math.min(xPoint, 1));
  }

  /**
   * Calculates the horizontal position for the thumbnail holder to stay within bounds.
   *
   * @param {DOMRect} rect - Bounding rectangle of the progress control.
   * @param {number} point - Normalized pointer position (0–1).
   *
   * @returns {number} Pixel offset from the left.
   */
  calculateThumbnailHolderPosition(rect, point) {
    let position = rect.width * point - this.width() / 2;

    const compoundMargin = 28; // keeps the thumbnail align with the progress holder
    const rightBoundary = rect.right - this.width() - compoundMargin;
    const leftBoundary = rect.left * -1 + compoundMargin;

    return Math.max(leftBoundary, Math.min(rightBoundary, position));
  }

  /**
   * Calculates and sets the sprite frame based on the seeking time.
   *
   * @param {number} seekingTime - Time in seconds to determine thumbnail frame.
   */
  calculateFrame(seekingTime) {
    const {
      interval,
      columns,
      thumbnailHeight,
      thumbnailWidth
    } = this.options().sprite;

    const frame = Math.floor(seekingTime / (interval / 1000));
    const row = Math.floor(frame / columns);
    const col = (frame % columns);

    const yPosition = row * thumbnailHeight * this.coef;
    const xPosition = col * thumbnailWidth * this.coef;

    const thumb = this.$('.pbw-thumbnail');

    thumb.style.left = `${-xPosition}px`;
    thumb.style.top = `${-yPosition}px`;
  }

  /**
   * Updates the component and sprite size based on the configured breakpoints.
   */
  resizeThumbnail() {
    const breakpoint = this.player().currentBreakpoint();
    const {
      thumbnailWidth,
      thumbnailHeight,
      columns
    } = this.options().sprite;

    this.coef = this.options().breakpointsCoeficients[breakpoint] || 1;
    this.el().style.width = `${thumbnailWidth * this.coef}px`;
    this.el().style.height = `${thumbnailHeight * this.coef}px`;
    this.thumbnail.width = thumbnailWidth * columns * this.coef;
  }

  /**
   * Creates the DOM element for the component.
   *
   * @param {string} [tag='div'] - Tag name to use (must be 'div').
   * @param {Object} [props={}] - DOM properties to assign.
   * @param {Object} [attributes={}] - HTML attributes to assign.
   *
   * @returns {HTMLElement} The created DOM element.
   */
  createEl(tag = 'div', props = {}, attributes = {}) {
    if (tag !== 'div') {
      log.error(`Creating a ThumbnailPreview with an HTML element of ${tag} is not supported; the element must be a 'div'`);
      throw new Error(`'${tag}' is not supported for ThumbnailPreview`);
    }

    this.thumbnail = this.createThumbnailEl();

    return videojs.dom.createEl(
      tag,
      videojs.obj.merge({ className: this.buildCSSClass() }, props),
      attributes,
      this.thumbnail
    );
  }

  /**
   * Creates the thumbnail <img> element.
   * Uses the sprite URL if defined, or an empty string otherwise.
   *
   * @returns {HTMLImageElement}
   */
  createThumbnailEl() {
    return videojs.dom.createEl('img', {
      className: 'pbw-thumbnail',
      src: this.options().sprite?.url ?? ''
    });
  }

  /**
   * Builds the CSS class string for the button.
   *
   * @returns {string} The CSS class string.
   */
  buildCSSClass() {
    return `${super.buildCSSClass()} pbw-thumbnail-preview`;
  }

  /**
   * Flag indicating whether the component has active listeners.
   *
   * @returns {boolean}
   */
  get active() {
    return this.#active;
  }
}

ThumbnailPreviewOverlay.prototype.options_ = {
  className: 'pbw-thumbnail-preview',
  displayThresholdHeight: 279,
  resetPositionDelay: 300,
  breakpointsCoeficients: {
    huge: 1.7,
    xlarge: 1.7,
    large: 1.4,
    medium: 1.3,
    small: 1.2,
    xsmall: 1,
    tiny: 1,
  },
  sprite: {
    rows: 1,
    columns: 1,
    thumbnailWidth: 0,
    thumbnailHeight: 0,
    interval: 10000,
  }
};

videojs.registerComponent('ThumbnailPreviewOverlay', ThumbnailPreviewOverlay);

export default ThumbnailPreviewOverlay;

/**
 * Metadata describing the structure and timing of a thumbnail sprite sheet.
 * Used to control how thumbnails are extracted and displayed.
 *
 * @typedef {Object} ThumbnailSpriteOptions
 *
 * @property {string} url - URL to the sprite image.
 * @property {number} rows - Number of rows in the sprite grid.
 * @property {number} columns - Number of columns in the sprite grid.
 * @property {number} thumbnailWidth - Width of each thumbnail in pixels.
 * @property {number} thumbnailHeight - Height of each thumbnail in pixels.
 * @property {number} interval - Time between thumbnails in milliseconds.
 */

/**
 * Breakpoint coefficient map for responsive thumbnail scaling.
 * Keys correspond to [Video.js layout breakpoints](https://videojs.com/guides/layout/#breakpoints).
 *
 * @typedef {Object.<string, number>} BreakpointCoefficients
 */
