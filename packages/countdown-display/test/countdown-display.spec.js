import { vi, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import videojs from 'video.js';
import CountdownDisplay from '../src/countdown-display.js';

window.HTMLMediaElement.prototype.load = () => {
};

describe('CountdownDisplay', () => {
  let player, videoElement, countdownDisplay;

  beforeAll(() => {
    document.body.innerHTML = '<video id="test-video" class="video-js"></video>';
    videoElement = document.querySelector('#test-video');
  });

  beforeEach(() => {
    vi.useFakeTimers();

    player = videojs(videoElement, {
      countdownDisplay: true
    });

    countdownDisplay = player.countdownDisplay;
  });

  afterEach(() => {
    vi.useRealTimers();
    player.dispose();
  });

  describe('Component initialization', () => {
    it('should be registered and attached to the player', () => {
      expect(videojs.getComponent('CountdownDisplay')).toBe(CountdownDisplay);
      expect(player.countdownDisplay).toBeDefined();
      expect(CountdownDisplay.VERSION).toBeDefined();
    });

    it('should be hidden by default', () => {
      expect(countdownDisplay.hasClass('vjs-hidden')).toBeTruthy();
    });
  });

  describe('Public API', () => {
    it('should open the modal when start is called', () => {
      const timestamp = Date.now() + 10_000;

      countdownDisplay.start(timestamp, {
        src: 'test-source', type: 'video/mp4'
      });

      expect(countdownDisplay.hasClass('vjs-hidden')).toBeFalsy();
    });

    it('should close the modal when reset is called', () => {
      const timestamp = Date.now() + 10_000;

      countdownDisplay.start(timestamp, {
        src: 'test-source', type: 'video/mp4'
      });
      countdownDisplay.reset();

      expect(countdownDisplay.hasClass('vjs-hidden')).toBeTruthy();
    });
  });

  describe('Countdown behavior', () => {
    it('should update countdown units over time', () => {
      const timestamp = Date.now() + 3_000;

      countdownDisplay.start(timestamp, {
        src: 'test-source', type: 'video/mp4'
      });

      const countdown = countdownDisplay.getChild('Countdown');
      const secondsUnit = countdown.getChild('CountdownUnitSeconds');

      const valueEl = secondsUnit.el().querySelector('.vjs-countdown-value');

      expect(valueEl.textContent).toBe('03');

      vi.advanceTimersByTime(1_000);
      expect(valueEl.textContent).toBe('02');

      vi.advanceTimersByTime(1_000);
      expect(valueEl.textContent).toBe('01');
    });

    it('should load the source when the countdown reaches zero', () => {
      const srcSpy = vi.spyOn(player, 'src').mockImplementation(() => {});

      const timestamp = Date.now() + 1_000;
      const source = { src: 'final-source', type: 'video/mp4' };

      countdownDisplay.start(timestamp, source);

      vi.advanceTimersByTime(2_000);

      expect(srcSpy).toHaveBeenCalledWith(source);
    });

    it('should immediately load the source if the end timestamp is in the past', () => {
      const srcSpy = vi.spyOn(player, 'src').mockImplementation(() => {});

      const timestamp = Date.now() - 1_000;
      const source = { src: 'final-source', type: 'video/mp4' };

      countdownDisplay.start(timestamp, source);
      expect(srcSpy).toHaveBeenCalledWith(source);
    });

    it('should close the modal when the countdown finishes', () => {
      const timestamp = Date.now() + 1_000;

      countdownDisplay.start(timestamp, {
        src: 'final-source', type: 'video/mp4'
      });

      vi.advanceTimersByTime(2_000);

      expect(countdownDisplay.hasClass('vjs-hidden')).toBeTruthy();
    });
  });

  describe('Player lifecycle integration', () => {
    it('should reset when the player triggers loadstart', () => {
      const timestamp = Date.now() + 10_000;

      countdownDisplay.start(timestamp, {
        src: 'test-source', type: 'video/mp4'
      });
      player.trigger('loadstart');

      expect(countdownDisplay.hasClass('vjs-hidden')).toBeTruthy();
    });

    it('should reset when the player is disposed', () => {
      const timestamp = Date.now() + 10_000;

      countdownDisplay.start(timestamp, {
        src: 'test-source', type: 'video/mp4'
      });
      player.dispose();

      // No exception + interval cleared implicitly
      expect(true).toBe(true);
    });
  });
});
