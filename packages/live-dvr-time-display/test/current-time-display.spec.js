import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import videojs from 'video.js';
import CurrentTimeDisplay from '../src/current-time-display.js';
import { version } from '../package.json';

window.HTMLMediaElement.prototype.load = () => { };

describe('CurrentTimeDisplay', () => {
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

  describe('updateContent', () => {
    it('should update the text node with the player\'s current time', () => {
      const currentTimeDisplay = new CurrentTimeDisplay(player);
      const SpynOnCurrentTime = vi.spyOn(player, 'currentTime');
      const SpynOnUpdateTextNode = vi.spyOn(currentTimeDisplay, 'updateTextNode_');

      SpynOnCurrentTime.mockImplementationOnce(() => 69);

      currentTimeDisplay.updateContent();

      expect(SpynOnUpdateTextNode).toHaveBeenCalledWith(69);
    });

    it('should update the text node with the clock time when the playing a live stream', () => {
      const currentTimeDisplay = new CurrentTimeDisplay(player);
      const SpynOnCurrentTime = vi.spyOn(player, 'currentTime');
      const SpynOnIsLive = vi.spyOn(player.liveTracker, 'isLive');
      const SpynOnLiveCurrentTime = vi.spyOn(player.liveTracker, 'liveCurrentTime');
      const SpynOnUpdateTextNode = vi.spyOn(currentTimeDisplay, 'updateTextNode_');

      SpynOnIsLive.mockImplementationOnce(() => true);
      SpynOnLiveCurrentTime.mockImplementationOnce(() => 30);
      SpynOnCurrentTime.mockImplementationOnce(() => 60);

      vi.useFakeTimers().setSystemTime(
        new Date('2000-01-01T00:00:00.000')
      );

      currentTimeDisplay.updateContent();

      vi.useRealTimers();

      expect(SpynOnUpdateTextNode).toHaveBeenCalledWith('23:59');
    });
  });

  describe('VERSION', () => {
    it('should return the version', () => {
      expect(CurrentTimeDisplay.VERSION).toBe(version);
    });
  });
});
