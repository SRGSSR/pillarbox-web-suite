import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import videojs from 'video.js';
import AirplayButton from '../src/airplay-button.js';

window.HTMLMediaElement.prototype.load = () => {
};

describe('AirplayButton', () => {
  let player, videoElement;

  beforeAll(() => {
    document.body.innerHTML = '<video id="test-video" class="video-js"></video>';
    videoElement = document.querySelector('#test-video');
  });

  describe('Airplay not supported', () => {
    beforeAll(() => {
      window.WebKitPlaybackTargetAvailabilityEvent = undefined;
    });

    beforeEach(() => {
      player = videojs(videoElement, {
        airplayButton: true
      });
    });

    afterEach(() => {
      player.dispose();
    });

    it('should be registered and attached to the player', () => {
      expect(videojs.getComponent('AirplayButton')).toBe(AirplayButton);
      expect(player.airplayButton).toBeDefined();
      expect(AirplayButton.VERSION).toBeDefined();
    });

    it('should hide the button if airplay is not supported', () => {
      expect(player.airplayButton.hasClass('vjs-hidden')).toBeTruthy();
    });
  });


  describe('Airplay supported', () => {
    let initSpy;

    beforeAll(() => {
      window.WebKitPlaybackTargetAvailabilityEvent = true;
      initSpy = vi.spyOn(AirplayButton.prototype, 'init');
    });

    beforeEach(async() => {
      player = videojs(videoElement, {
        airplayButton: true
      });

      videoElement.webkitShowPlaybackTargetPicker = vi.fn();
      await new Promise((resolve) => player.ready(() => resolve()));
    });

    afterEach(() => {
      player.dispose();
      initSpy.mockClear();
    });

    it('should be registered and attached to the player', () => {
      expect(videojs.getComponent('AirplayButton')).toBe(AirplayButton);
      expect(player.airplayButton).toBeDefined();
      expect(AirplayButton.VERSION).toBeDefined();
    });

    it('should display the button if WebKitPlaybackTargetAvailabilityEvent is truthy', () => {
      // The button becomes visible
      expect(initSpy).toHaveBeenCalled();
      expect(player.airplayButton.hasClass('vjs-hidden')).toBeFalsy();
    });

    it('should display the device picker when the button is clicked', () => {
      player.airplayButton.handleClick();
      expect(videoElement.webkitShowPlaybackTargetPicker).toHaveBeenCalled();
    });
  });
});
