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

  describe('Google Cast API not available', () => {
    let chromeBackup;

    beforeAll(() => {
      chromeBackup = window.chrome;
      window.chrome = undefined;
    });

    beforeEach(async() => {
      player = videojs(videoElement, {
        techOrder: ['chromecast', 'html5'],
        plugins: { googleCastSender: true }
      });

      await new Promise((resolve) => player.ready(resolve));

      player.googleCastSender().onGCastApiAvailable(false);
    });

    afterEach(() => {
      player.dispose();
    });

    afterAll(() => {
      window.chrome = chromeBackup;
    });

    it('should be registered', () => {
      expect(videojs.getComponent('GoogleCastLauncher')).toBe(GoogleCastLauncher);
      expect(GoogleCastLauncher.VERSION).toBeDefined();
    });

    it('should NOT add the button if the Google cast API is not available', () => {
      expect(player.controlBar.children().find(
        child => child.name() === 'GoogleCastLauncher'
      )).toBeUndefined();
    });
  });

  describe('Google Cast API is available', () => {
    let launcher;

    beforeEach(async() => {
      player = videojs(videoElement, {
        techOrder: ['chromecast', 'html5'],
        plugins: { googleCastSender: true }
      });

      await new Promise((resolve) => player.ready(resolve));

      player.googleCastSender().onGCastApiAvailable(true);

      launcher = player.controlBar.children().find(
        child => child.name() === 'GoogleCastLauncher'
      );
    });

    afterEach(() => {
      vi.restoreAllMocks();
      player.dispose();
    });

    it('should be registered and attached to the player', () => {
      expect(videojs.getComponent('GoogleCastLauncher')).toBe(GoogleCastLauncher);
      expect(launcher).toBeDefined();
      expect(GoogleCastLauncher.VERSION).toBeDefined();
    });

    it('should not hide the button if chrome is available', () => {
      expect(launcher.hasClass('vjs-hidden')).toBeFalsy();
    });

    it('should render an updated title on language change', () => {
      player.language('fr');
      expect(launcher.el().title).toBe('Utiliser Google Cast');
    });
  });
});
