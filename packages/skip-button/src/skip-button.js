import pillarbox from '@srgssr/pillarbox-web';
import './lang';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/button').default}
 */
const Button = pillarbox.getComponent('Button');

/**
 * Represents a SkipButton component for the pillarbox player. Allows skipping
 * opening credits and end credits detected through the 'srgssr/interval' event.
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
  /**
   * Handles the event triggered on changing the time interval.
   * This method serves as a proxy to the main time interval change handler,
   * ensuring that additional logic can be executed or making it easier to
   * detach the event listener later.
   *
   * @private
   */
  onTimeIntervalChange_ = ({ data }) => this.handleTimeIntervalChange(data);

  constructor(player, options) {
    super(player, options);
    this.player().on('srgssr/interval', this.onTimeIntervalChange_);
  }

  dispose() {
    this.player().off('srgssr/interval', this.onTimeIntervalChange_);
    super.dispose();
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
   * @param {VTTCue} cue The cue for the current time interval.
   */
  handleTimeIntervalChange(cue) {
    this.activeInterval = cue;

    if (!this.activeInterval) {
      this.hide();

      return;
    }

    /**
     * @type {import('@srgssr/pillarbox-web/dist/types/src/dataProvider/model/typedef').TimeInterval}
     */
    const timeInterval = JSON.parse(this.activeInterval.text);
    const text = timeInterval.type === 'OPENING_CREDITS' ? 'Skip intro' : 'Skip credits';

    this.controlText(text);
    this.show();
  }
}

pillarbox.registerComponent('SkipButton', SkipButton);

export default SkipButton;
