import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import videojs from 'video.js';
import '../../src/google-cast-sender.js';
import GoogleCastButton from '../../src/components/google-cast-button.js';
import '../google-cast.mock.js';

window.HTMLMediaElement.prototype.load = () => { };

describe('GoogleCastButton', () => {
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
        plugins: { googleCastSender: { enableDefaultCastLauncher: false } }
      });
    });

    afterEach(() => {
      player.dispose();
    });

    afterAll(() => {
      window.chrome = chromeBackup;
    });

    it('should be registered and attached to the player', () => {
      expect(videojs.getComponent('GoogleCastButton')).toBe(GoogleCastButton);
      expect(player.controlBar.GoogleCastButton).toBeDefined();
      expect(GoogleCastButton.VERSION).toBeDefined();
    });

    it('should hide the button if chrome is not available', () => {
      expect(player.controlBar.GoogleCastButton.hasClass('vjs-hidden')).toBeTruthy();
    });
  });

  describe('Google Cast supported', () => {
    let requestSessionSpy;

    beforeEach(async() => {
      player = videojs(videoElement, {
        techOrder: ['chromecast', 'html5'],
        plugins: { googleCastSender: { enableDefaultCastLauncher: false } }
      });

      // grab requestSession spy
      requestSessionSpy = vi.spyOn(
        window.cast.framework.CastContext.getInstance(),
        'requestSession'
      );

      await new Promise((resolve) => player.ready(resolve));
      player.googleCastSender().onGCastApiAvailable(true);
    });

    afterEach(() => {
      vi.restoreAllMocks();
      player.dispose();
    });

    it('should be registered and attached to the player', () => {
      expect(videojs.getComponent('GoogleCastButton')).toBe(GoogleCastButton);
      expect(player.controlBar.GoogleCastButton).toBeDefined();
      expect(GoogleCastButton.VERSION).toBeDefined();
    });

    it('should not hide the button if chrome is available', () => {
      expect(player.controlBar.GoogleCastButton.hasClass('vjs-hidden')).toBeFalsy();
    });

    it('should call requestSession when clicked', () => {
      player.controlBar.GoogleCastButton.handleClick();
      expect(requestSessionSpy).toHaveBeenCalled();
    });

    it('should handle SESSION_STARTED', () => {
      const event = { sessionState: window.cast.framework.SessionState.SESSION_STARTED };

      player.googleCastSender().sessionStateChangedListener(event);
      expect(player.controlBar.GoogleCastButton.el().querySelector('.vjs-icon.google-cast-active')).toBeDefined();
    });

    it('should handle SESSION_RESUMED', () => {
      const event = { sessionState: window.cast.framework.SessionState.SESSION_RESUMED };

      player.googleCastSender().sessionStateChangedListener(event);
      expect(player.controlBar.GoogleCastButton.el().querySelector('.vjs-icon.google-cast-active')).toBeDefined();
    });

    it('should handle SESSION_ENDED', () => {
      const event = { sessionState: window.cast.framework.SessionState.SESSION_ENDED };

      player.googleCastSender().sessionStateChangedListener(event);
      expect(player.controlBar.GoogleCastButton.el().querySelector('.vjs-icon.google-cast-idle')).toBeDefined();
    });
  });


  describe('Google Cast supported with end current session on click', () => {
    let requestSessionSpy, endCurrentSessionSpy;

    beforeEach(async() => {
      player = videojs(videoElement, {
        techOrder: ['chromecast', 'html5'],
        controlBar: { GoogleCastButton: {endSessionOnClick: true} },
        plugins: { googleCastSender: true }
      });

      // grab requestSession spy
      requestSessionSpy = vi.spyOn(
        window.cast.framework.CastContext.getInstance(),
        'requestSession'
      );

      // grab requestSession spy
      endCurrentSessionSpy = vi.spyOn(
        window.cast.framework.CastContext.getInstance(),
        'endCurrentSession'
      );

      await new Promise((resolve) => player.ready(resolve));
      player.googleCastSender().onGCastApiAvailable(true);
    });

    afterEach(() => {
      vi.restoreAllMocks();
      player.dispose();
    });

    it('should call requestSession when clicked', () => {
      player.controlBar.GoogleCastButton.handleClick();
      expect(requestSessionSpy).toHaveBeenCalled();
    });


    it('should call endCurrentSession when clicked if the cast is connected', () => {
      player.addClass('vjs-chromecast-connected');
      player.controlBar.GoogleCastButton.handleClick();
      expect(endCurrentSessionSpy).toHaveBeenCalled();
    });
  });
});
