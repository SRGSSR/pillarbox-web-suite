import pillarbox from '@srgssr/pillarbox-web';
import './lang';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/button').default}
 */
const Button = pillarbox.getComponent('Button');

/**
 * Represents a SkipButton component for the pillarbox player.
 *
 * @class SkipButton
 */
class SkipButton extends Button {
  /**
   * The currently active interval.
   *
   * @type {VTTCue}
   */
  activeInterval;

  constructor(player, options) {
    super(player, options);
    this.player().on('srgssr/interval', ({ data }) => this.handleTimeIntervalChange(data));
  }

  buildCSSClass() {
    return `${super.buildCSSClass()} pbw-skip-button vjs-hidden vjs-visible-text`;
  }

  handleClick(event) {
    super.handleClick(event);
    this.player().currentTime(this.activeInterval.endTime);
  }

  /**
   * Handles the time interval change and updates the currently active interval.
   * If there is no currently active interval the component is hidden, otherwise
   * it is shown.
   *
   * @param {VTTCue} data
   */
  handleTimeIntervalChange(data) {
    this.activeInterval = data;

    if (!this.activeInterval) {
      this.hide();

      return;
    }

    /**
     * @type {import('@srgssr/pillarbox-web/dist/types/src/dataProvider/model/typedef').TimeInterval}
     */
    const timeInterval = JSON.parse(this.activeInterval.text);
    const text = timeInterval.type === 'OPENING_CREDITS' ? 'Skip intro' : 'Skip credits';

    this.controlText(this.localize(text));
    this.show();
  }
}

pillarbox.registerComponent('SkipButton', SkipButton);

export default SkipButton;
