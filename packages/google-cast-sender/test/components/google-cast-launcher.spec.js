import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import videojs from 'video.js';
import '../../src/google-cast-sender.js';
import GoogleCastLauncher from '../../src/components/google-cast-launcher.js';
import '../google-cast.mock.js';

window.HTMLMediaElement.prototype.load = () => {
};

describe('GoogleCastLauncher', () => {
  let player, videoElement;

  beforeAll(() => {
    document.body.innerHTML = '<video id="test-video" class="video-js"></video>';
    videoElement = document.querySelector('#test-video');
  });

  describe('Google Cast not supported', () => {
    let chromeBackup;

    beforeAll(() => {
      chromeBackup = window.chrome;
      window.chrome = undefined;
    });

    beforeEach(() => {
      player = videojs(videoElement, {
        techOrder: ['chromecast', 'html5'],
        plugins: { googleCastSender: true }
      });
    });

    afterEach(() => {
      player.dispose();
    });

    afterAll(() => {
      window.chrome = chromeBackup;
    });

    it('should be registered and attached to the player', () => {
      expect(videojs.getComponent('GoogleCastLauncher')).toBe(GoogleCastLauncher);
      expect(player.controlBar.GoogleCastLauncher).toBeDefined();
      expect(GoogleCastLauncher.VERSION).toBeDefined();
    });

    it('should hide the button if chrome is not available', () => {
      expect(player.controlBar.GoogleCastLauncher.hasClass('vjs-hidden')).toBeTruthy();
    });
  });

  describe('Google Cast supported', () => {
    beforeEach(async() => {
      player = videojs(videoElement, {
        techOrder: ['chromecast', 'html5'],
        plugins: { googleCastSender: true }
      });

      await new Promise((resolve) => player.ready(resolve));
    });

    afterEach(() => {
      vi.restoreAllMocks();
      player.dispose();
    });

    it('should be registered and attached to the player', () => {
      expect(videojs.getComponent('GoogleCastLauncher')).toBe(GoogleCastLauncher);
      expect(player.controlBar.GoogleCastLauncher).toBeDefined();
      expect(GoogleCastLauncher.VERSION).toBeDefined();
    });

    it('should not hide the button if chrome is available', () => {
      expect(player.controlBar.GoogleCastLauncher.hasClass('vjs-hidden')).toBeFalsy();
    });

    it('should render an updated title on language change', () => {
      player.language('fr');
      expect(player.controlBar.GoogleCastLauncher.el().title).toBe('Utiliser Google Cast');
    });
  });
});
