/* eslint-disable */
/* eslint no-unused-vars: "off" */

import pillarbox from '@srgssr/pillarbox-web';

function tryUpdateStyle(el, style, rule) {
  try {
    el.style[style] = rule;
  } catch (_) {
    // Satisfies linter.
    return _;
  }
}
function getCSSPositionValue(position) {
  return position ? `${position}px` : '';
}

/**
 * Text Track Display
 *
 * Keep subtitles inside the video, taking into account the height of the
 * chapters and the control bar.
 *
 * This component does not export any classes because it is not intended to be
 * used outside of this package.
 *
 * @override
 */
pillarbox.registerComponent('TextTrackDisplay', class extends pillarbox.getComponent('TextTrackDisplay') {
  constructor(player, options) {
    super(player, options);

    this.handleLoadedData = this.handleLoadedData.bind(this);
    this.handlePlay = this.handlePlay.bind(this);

    this.player().on('loadeddata', this.handleLoadedData);
  }

  handleLoadedData() {
    this.player().off('play', this.handlePlay);
    this.player().one('play', this.handlePlay);
  }

  handlePlay() {
    this.updateDisplayOverlay();
  }

  dispose() {
    this.player().off('loadeddata', this.handleLoadedData);
    super.dispose();
  }

  /**
   * @override
   */
  updateDisplayOverlay() {
    if (!this.player_.videoHeight()) return;

    const controlBarBottom = parseFloat(getComputedStyle(this.player().controlBar.el()).bottom || 0);
    const playerWidth = this.player_.currentWidth();
    const playerHeight = this.player_.currentHeight() - controlBarBottom;
    const playerAspectRatio = playerWidth / playerHeight;
    const videoAspectRatio = this.player_.videoWidth() / this.player_.videoHeight();

    let insetInlineMatch = 0;
    let insetBlockMatch = 0;

    if (Math.abs(playerAspectRatio - videoAspectRatio) > 0.1) {
      if (playerAspectRatio > videoAspectRatio) {
        insetInlineMatch = Math.round((playerWidth - playerHeight * videoAspectRatio) / 2);
      } else {
        insetBlockMatch = Math.round((playerHeight - playerWidth / videoAspectRatio) / 2);
      }
    }

    tryUpdateStyle(this.el_, 'insetInline', getCSSPositionValue(insetInlineMatch));
    tryUpdateStyle(this.el_, 'insetBlockStart', getCSSPositionValue(insetBlockMatch));
    tryUpdateStyle(this.el_, 'insetBlockEnd', getCSSPositionValue(insetBlockMatch && insetBlockMatch + controlBarBottom));
  }
});

