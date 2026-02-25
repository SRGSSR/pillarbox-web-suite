import videojs from 'video.js';
import { version } from '../package.json';

/**
* @ignore
* @type {typeof import('video.js/dist/types/control-bar/time-controls/current-time-display').default}
*/
const VJSCurrentTimeDisplay = videojs.getComponent('CurrentTimeDisplay');

/**
 * Displays the current time
 *
 * @extends VJSCurrentTimeDisplay
 */
class CurrentTimeDisplay extends VJSCurrentTimeDisplay {
  ready() {
    this.player().on('durationchange', () => {
      setTimeout(() => {
        this.updateTextNode_(0);
      }, 1);
    });
    this.on(this.player(), 'seeking', (e) => {
      this.updateContent(e);
    });
  }

  /**
   * @override
   */
  updateContent() {
    let time = (this.player().scrubbing())
      ? this.player().getCache().currentTime
      : this.player().currentTime();

    if (this.player().liveTracker && this.player().liveTracker.isLive()) {
      time = new Date(
        (Date.now() - Math.abs(
          this.player().liveTracker.liveCurrentTime() -
          this.player().currentTime()
        ) * 1000)
      ).toTimeString().slice(0, 5);

      this.updateTextNode_(time);
      // Avoid overriding updateTextNode_ to have the time formatted in hours e.g 00:00
      this.formattedTime_ = time;

      return;
    }

    this.updateTextNode_(time);
  }

  static get VERSION() {
    return version;
  }
}

videojs.registerComponent('CurrentTimeDisplay', CurrentTimeDisplay);

export default CurrentTimeDisplay;
