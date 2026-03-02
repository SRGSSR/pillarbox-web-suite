import videojs from 'video.js';
import { version } from '../package.json';

/**
* @ignore
* @type {typeof import('video.js/dist/types/control-bar/progress-control/time-tooltip').default}
*/
const VJSTimeTooltip = videojs.getComponent('TimeTooltip');

/**
 * Time tooltips display a time above the progress bar.
 *
 * @extends VJSTimeTooltip
 */
class TimeTooltip extends VJSTimeTooltip {
  /**
   * @override
   */
  updateTime(seekBarRect, seekBarPoint, time, cb) {
    if (this.rafId_) {
      this.cancelAnimationFrame(this.rafId_);
    }

    this.rafId_ = this.requestAnimationFrame(() => {
      let content = videojs.time.formatTime(time);

      if (this.player_.liveTracker && this.player_.liveTracker.isLive()) {
        const liveWindow = this.player().liveTracker.liveWindow();
        const seekBarTime = seekBarPoint ? liveWindow * seekBarPoint : 0;

        content = new Date(
          (Date.now() - Math.abs(
            liveWindow - seekBarTime
          ) * 1000)
        ).toTimeString().slice(0, 8);
      }

      this.update(seekBarRect, seekBarPoint, content);

      if (cb) {
        cb();
      }
    });
  }

  static get VERSION() {
    return version;
  }
}

videojs.registerComponent('TimeTooltip', TimeTooltip);

export default TimeTooltip;
