import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import videojs from 'video.js';
import TimeTooltip from '../src/time-tooltip.js';
import { version } from '../package.json';

window.HTMLMediaElement.prototype.load = () => { };

describe('TimeTooltip', () => {
  let player, videoElement;

  beforeAll(() => {
    document.body.innerHTML = '<video id="test-video" class="video-js"></video>';
    videoElement = document.querySelector('#test-video');
  });

  beforeEach(() => {
    player = videojs(videoElement);
  });

  afterEach(() => {
    player.dispose();
  });

  describe('updateTime', () => {
    it('should update with the formatted player\'s current time', () => {
      const timeTooltip = new TimeTooltip(player);
      const SpynOnUpdate = vi.spyOn(timeTooltip, 'update');

      vi.useFakeTimers();

      timeTooltip.updateTime({ x: 0 }, 0, 69);

      vi.advanceTimersToNextFrame();
      vi.useRealTimers();

      expect(SpynOnUpdate).toHaveBeenCalledWith({ x: 0 }, 0, '1:09');
    });

    it('should update with the clock time when playing a live stream', () => {
      const timeTooltip = new TimeTooltip(player);
      const SpynOnIsLive = vi.spyOn(player.liveTracker, 'isLive');
      const SpynOnLiveWindow = vi.spyOn(player.liveTracker, 'liveWindow');
      const SpynOnUpdate = vi.spyOn(timeTooltip, 'update');

      SpynOnIsLive.mockImplementationOnce(() => true);
      SpynOnLiveWindow.mockImplementationOnce(() => 120);

      vi.useFakeTimers().setSystemTime(
        new Date('2000-01-01T00:00:00.000')
      );

      timeTooltip.updateTime({ x: 0 }, 0.25, undefined);

      vi.advanceTimersToNextFrame();
      vi.useRealTimers();

      expect(SpynOnUpdate).toHaveBeenCalledWith({ x: 0 }, 0.25, '23:58:30');
    });
  });

  describe('VERSION', () => {
    it('should return the version', () => {
      expect(TimeTooltip.VERSION).toBe(version);
    });
  });
});
