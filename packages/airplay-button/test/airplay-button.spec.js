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
    beforeAll(() => {
      window.WebKitPlaybackTargetAvailabilityEvent = true;
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
    });

    it('should be registered and attached to the player', () => {
      expect(videojs.getComponent('AirplayButton')).toBe(AirplayButton);
      expect(player.airplayButton).toBeDefined();
      expect(AirplayButton.VERSION).toBeDefined();
    });

    it('should display the button according to the availability event', () => {
      const event = new Event('webkitplaybacktargetavailabilitychanged');

      // The button starts hidden despite compatibility
      expect(player.airplayButton.hasClass('vjs-hidden')).toBeTruthy();

      event.availability = 'available';
      videoElement.dispatchEvent(event);

      // The button becomes visible after AirPlay is available
      expect(player.airplayButton.hasClass('vjs-hidden')).toBeFalsy();

      event.availability = 'not-available';
      videoElement.dispatchEvent(event);

      // The button becomes hidden after AirPlay is no longer available
      expect(player.airplayButton.hasClass('vjs-hidden')).toBeTruthy();
    });

    it('should display the device picker when the button is clicked', () => {
      player.airplayButton.handleClick();
      expect(videoElement.webkitShowPlaybackTargetPicker).toHaveBeenCalled();
    });
  });
});
