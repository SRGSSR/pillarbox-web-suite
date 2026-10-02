import pillarbox from '@srgssr/pillarbox-web';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/control-bar/playback-rate-menu/playback-rate-menu-button').default}
 */
const PlaybackRateMenuButton = pillarbox.getComponent('PlaybackRateMenuButton');

/**
 * A playback rate menu button that behaves like a toggle when the play is in
 * audio only mode.
 *
 * @extends PlaybackRateMenuButton
 */
class PlaybackRateButton extends PlaybackRateMenuButton {
  /**
   * Toggles the menu, or sets the next playback rate in audio only mode.
   *
   * @param {Event} event The click event.
   */
  handleClick(event) {
    const player = this.player();
    const rates = this.playbackRates();

    if (!player.audioOnlyMode()) return super.handleClick(event);
    if (!rates.length) return;

    const index = rates.indexOf(player.playbackRate()) + 1;

    player.playbackRate(rates[index % rates.length]);
  }
}

pillarbox.registerComponent('PlaybackRateButton', PlaybackRateButton);

export default PlaybackRateButton;
