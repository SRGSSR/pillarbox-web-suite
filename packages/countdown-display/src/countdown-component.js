import videojs from 'video.js';
import './countdown-unit.js';

const SECONDS_IN_MS = 1_000;
const MINUTES = 60 * SECONDS_IN_MS;
const HOURS = 60 * MINUTES;
const DAYS = 24 * HOURS;

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/component').default}
 */
const Component = videojs.getComponent('Component');
const log = videojs.log.createLogger('countdown');

/**
 * Represents a Countdown component for the Video.js player.
 *
 * This component displays a countdown with separate CountdownUnit children
 * for days, hours, minutes, and seconds. It updates every second and can
 * automatically load a new video source when the countdown finishes.
 */
class Countdown extends Component {
  /**
   * The interval ID used for the countdown timer.
   *
   * @type {number|undefined}
   * @private
   */
  intervalId_;

  /**
   * Creates an instance of a Countdown.
   *
   * @param {import('video.js/dist/types/player.js').default} player The player instance.
   * @param {Object} options Configuration options for the component.
   */
  constructor(player, options) {
    super(player, options);
  }

  /**
   * Resets the countdown by clearing the update interval.
   */
  reset() {
    this.clearInterval(this.intervalId_);
  }

  /**
   * Disposes the component.
   */
  dispose() {
    this.reset();
    super.dispose();
  }

  /**
   * Starts the countdown timer.
   *
   * Performs an immediate update, then schedules periodic updates every second.
   * When the countdown reaches zero, the interval is cleared and the specified
   * video source is loaded into the player.
   *
   * @param {number} endTimestamp The target end time in milliseconds.
   * @param {any} source The source to play when the countdown ends.
   */
  start(endTimestamp, source) {
    this.clearInterval(this.intervalId_);

    if (typeof endTimestamp !== 'number') {
      log.error('Invalid endTimestamp provided to start(). Expected a number (milliseconds).', endTimestamp);

      return;
    }

    if (this.updateCountdown(endTimestamp, source)) return;

    this.intervalId_ =
      this.setInterval(() => this.updateCountdown(endTimestamp, source), 1_000);
  }

  /**
   * Updates the countdown UI and checks whether the countdown has finished.
   *
   * Calculates the remaining duration from the given timestamp, updates all
   * CountdownUnit children, and completes the countdown when time reaches zero.
   *
   * @param {number} endTimestamp Target end time in milliseconds.
   * @param {any} source The source to play when the countdown ends.
   *
   * @returns {boolean} `true` if the countdown has finished, `false` otherwise.
   */
  updateCountdown(endTimestamp, source) {
    const remainingDuration = this.remainingDuration(endTimestamp);

    if (remainingDuration.totalInMilliseconds <= 0) {
      this.clearInterval(this.intervalId_);
      this.player().src(source);

      return true;
    }

    Object.entries(remainingDuration).forEach(
      ([key, value]) => {
        this.getChild(`CountdownUnit${key}`)?.update(value);
      }
    );

    return false;
  }

  /**
   * The remaining duration until the target timestamp.
   *
   * @param {number} timestamp The target timestamp in milliseconds.
   *
   * @returns {Object} An object containing the remaining days, hours, minutes, seconds, and total in milliseconds.
   */
  remainingDuration(timestamp) {
    const totalInMilliseconds = timestamp - Date.now();

    let diff = totalInMilliseconds;
    let days = Math.floor(diff / DAYS);

    diff -= days * DAYS;

    let hours = Math.floor(diff / HOURS);

    diff -= hours * HOURS;

    let minutes = Math.floor(diff / MINUTES);

    diff -= minutes * MINUTES;

    let seconds = Math.floor(diff / SECONDS_IN_MS);

    return {
      'Days': days.toString().padStart(2, '0'),
      'Hours': hours.toString().padStart(2, '0'),
      'Minutes': minutes.toString().padStart(2, '0'),
      'Seconds': seconds.toString().padStart(2, '0'),
      totalInMilliseconds
    };
  }

  /**
   * Creates the container element for the countdown component.
   *
   * @param {string} [tagName='div'] the tag name for the element.
   * @param {object} [properties] the properties to apply to the element.
   * @param {object} [attributes] the attributes to apply to the element.
   * @returns {HTMLElement} The created countdown container element.
   */
  createEl(tagName = 'div', properties, attributes) {
    const props = videojs.obj.merge({
      className: this.buildCSSClass(),
    }, properties);

    return super.createEl(tagName, props, attributes);
  }

  /**
   * Builds the CSS class for the component.
   *
   * @returns {string} the CSS class name
   */
  buildCSSClass() {
    return `vjs-countdown ${super.buildCSSClass()}`;
  }
}

Countdown.prototype.options_ = {
  children: ['Days', 'Hours', 'Minutes', 'Seconds'].map((unit) => ({
    name: `CountdownUnit${unit}`,
    id: `CountdownUnit${unit}`,
    componentClass: 'CountdownUnit',
    label: unit
  }))
};

videojs.registerComponent('Countdown', Countdown);

export default Countdown;
