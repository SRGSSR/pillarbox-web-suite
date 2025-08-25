import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import videojs from 'video.js';
import { GoogleCastSender } from '../src/google-cast-sender.js';
import './google-cast.mock.js';

window.HTMLMediaElement.prototype.load = () => { };

describe('GoogleCastSender', () => {
  let player;
  let googleCastSender;

  beforeEach(() => {
    const videoEl = document.createElement('video');

    document.body.appendChild(videoEl);
    player = videojs(videoEl, {
      controls: true,
      techOrder: ['chromecast', 'html5'],
      plugins: {
        googleCastSender: false
      }
    });

    googleCastSender = player.googleCastSender();
  });

  afterEach(() => {
    if (player) {
      player.dispose();
    }
    if (document.getElementById('gstatic_cast_sender')) {
      document.getElementById('gstatic_cast_sender').remove();
    }

    vi.restoreAllMocks();
  });

  describe('plugin initialization', () => {
    it('should load the cast sender script', () => {
      const spyOnLoadCastSenderScript = vi.spyOn(GoogleCastSender.prototype, 'loadCastSenderScript');
      const videoEl = document.createElement('video');

      document.body.appendChild(videoEl);
      player = videojs(videoEl, {
        techOrder: ['chromecast', 'html5'],
        plugins: {
          googleCastSender: true
        }
      });

      expect(spyOnLoadCastSenderScript).toHaveBeenCalled();
    });
  });

  describe('loadCastSenderScript', () => {
    it('should not load the script if chrome is not available', () => {
      const originalChrome = window.chrome;
      const videoEl = document.createElement('video');

      if (document.getElementById('gstatic_cast_sender')) {
        document.getElementById('gstatic_cast_sender').remove();
      }

      window.chrome = undefined;
      document.body.appendChild(videoEl);
      player = videojs(videoEl, {
        techOrder: ['chromecast', 'html5'],
        plugins: {
          googleCastSender: true
        }
      });

      expect(document.getElementById('gstatic_cast_sender')).toBeNull();
      window.chrome = originalChrome;
    });

    it('should create the cast script element', () => {
      googleCastSender = player.googleCastSender();
      expect(document.getElementById('gstatic_cast_sender')).not.toBeNull();
    });

    it('should trigger onGCastApiAvailable if script already exists', () => {
      const script = document.createElement('script');
      const videoEl = document.createElement('video');

      script.id = 'gstatic_cast_sender';
      document.head.appendChild(script);
      document.body.appendChild(videoEl);
      const spy = vi.spyOn(GoogleCastSender.prototype, 'onGCastApiAvailable');

      player = videojs(videoEl, {
        techOrder: ['chromecast', 'html5'],
        plugins: {
          googleCastSender: true
        }
      });

      expect(spy).toHaveBeenCalledWith(true);
    });
  });

  describe('onGCastApiAvailable', () => {
    let setOptionsSpy;
    let addEventListenerSpy;

    beforeEach(() => {
      setOptionsSpy = vi.spyOn(
        window.cast.framework.CastContext.getInstance(),
        'setOptions'
      );
      addEventListenerSpy = vi.spyOn(
        window.cast.framework.CastContext.getInstance(),
        'addEventListener'
      );
    });

    afterEach(() => {
      vi.restoreAllMocks(); // restores all spies/stubs to original
    });

    it('should not do anything if isAvailable is false', () => {
      googleCastSender.onGCastApiAvailable(false);

      expect(setOptionsSpy).not.toHaveBeenCalled();
      expect(addEventListenerSpy).not.toHaveBeenCalled();
    });

    it('should initialize cast context and set options', () => {
      googleCastSender.onGCastApiAvailable(true);

      expect(setOptionsSpy).toHaveBeenCalledWith({
        androidReceiverCompatible: expect.any(Boolean),
        autoJoinPolicy: expect.any(String),
        receiverApplicationId: expect.any(String),
      });

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        window.cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
        expect.any(Function)
      );
    });
  });


  describe('session state changes', () => {
    beforeEach(() => {
      googleCastSender.onGCastApiAvailable(true);
    });

    it('should handle SESSION_STARTED', () => {

      const spy = vi.spyOn(googleCastSender, 'onCastSessionStarted');
      const event = { sessionState: window.cast.framework.SessionState.SESSION_STARTED };

      spy.mockImplementationOnce(() => { });

      googleCastSender.sessionStateChangedListener(event);
      expect(spy).toHaveBeenCalledOnce();
    });

    it('should handle SESSION_RESUMED', () => {
      const spy = vi.spyOn(googleCastSender, 'onCastSessionResumed');
      const event = { sessionState: window.cast.framework.SessionState.SESSION_RESUMED };

      spy.mockImplementationOnce(() => { });

      googleCastSender.sessionStateChangedListener(event);
      expect(spy).toHaveBeenCalledOnce();
    });

    it('should handle SESSION_ENDED', () => {
      const spy = vi.spyOn(googleCastSender, 'onCastSessionEnded');
      const event = { sessionState: window.cast.framework.SessionState.SESSION_ENDED };

      spy.mockImplementationOnce(() => { });

      googleCastSender.sessionStateChangedListener(event);
      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe('onCastSessionEnded', () => {
    it('should restore player state', () => {
      const cache = {
        currentTime: 10,
        source: { src: 'http://example.com/video.mp4', type: 'video/mp4' },
        volume: 0.5
      };

      player.getCache = vi.fn(() => cache);
      vi.spyOn(googleCastSender, 'getCastSessionTracks').mockReturnValue({
        audioTrack: { language: 'en' },
        textTrack: { language: 'fr', mode: 'showing' }
      });
      const loadTechSpy = vi.spyOn(player, 'loadTech_');
      const srcSpy = vi.spyOn(player, 'src');
      const currentTimeSpy = vi.spyOn(player, 'currentTime');
      const volumeSpy = vi.spyOn(player, 'volume');

      googleCastSender.onCastSessionEnded();
      player.trigger('loadeddata');

      expect(loadTechSpy).toHaveBeenCalledWith('html5');
      expect(srcSpy).toHaveBeenCalledWith(cache.source);
      expect(currentTimeSpy).toHaveBeenCalledWith(cache.currentTime);
      expect(volumeSpy).toHaveBeenCalledWith(cache.volume);
    });
  });

  describe('onCastSessionStarted', () => {
    it('should load chromecast tech with current player state', () => {
      const cache = {
        currentTime: 10,
        source: { src: 'http://example.com/video.mp4', type: 'video/mp4' }
      };

      player.getCache = vi.fn(() => cache);

      vi.spyOn(googleCastSender, 'findEnabledAudioTrack').mockReturnValue({ language: 'en' });
      vi.spyOn(googleCastSender, 'findShowingTextTrack').mockReturnValue({ language: 'fr', mode: 'showing' });
      const loadTechSpy = vi.spyOn(player, 'loadTech_');


      googleCastSender.onCastSessionStarted();


      expect(loadTechSpy).toHaveBeenCalledWith('chromecast', {
        ...cache.source,
        currentTime: cache.currentTime,
        audioTrack: { language: 'en' },
        textTrack: { language: 'fr', mode: 'showing' }
      });
    });
  });

  describe('onCastSessionResumed', () => {
    it('should load chromecast tech with current source', () => {
      const currentSource = { src: 'http://example.com/video.mp4', type: 'video/mp4' };

      player.currentSource = vi.fn(() => currentSource);
      const loadTechSpy = vi.spyOn(player, 'loadTech_');

      googleCastSender.onCastSessionResumed();

      expect(loadTechSpy).toHaveBeenCalledWith('chromecast', currentSource);
    });
  });

  describe('getCastSessionTracks', () => {
    it('should return active audio and text tracks from cast tech', () => {
      const audioTrack = { language: 'en', enabled: true };
      const textTrack = { language: 'fr', mode: 'showing' };
      const techOptions = {
        audioTracks: [audioTrack],
        textTracks: [textTrack]
      };

      player.tech = vi.fn(() => ({ options: () => techOptions }));
      vi.spyOn(googleCastSender, 'findEnabledAudioTrack').mockReturnValue(audioTrack);
      vi.spyOn(googleCastSender, 'findShowingTextTrack').mockReturnValue(textTrack);

      const tracks = googleCastSender.getCastSessionTracks();

      expect(tracks).toEqual({ audioTrack, textTrack });
    });
  });

  describe('sourceResolver', () => {
    it('should return original source if no resolver provided', () => {
      const source = { src: 'http://example.com/video.mp4' };

      expect(googleCastSender.sourceResolver(source)).toBe(source);
    });

    it('should return resolved source if resolver is provided', () => {
      const source = { src: 'http://example.com/video.mp4' };
      const resolvedSource = { src: 'http://example.com/69-420/resolved.mp4' };
      const sourceResolver = vi.fn(() => resolvedSource);
      const videoEl = document.createElement('video');

      document.body.appendChild(videoEl);
      player = videojs(videoEl, {
        techOrder: ['chromecast', 'html5'],
        plugins: {
          googleCastSender: {
            sourceResolver
          }
        }
      });


      googleCastSender = player.googleCastSender();
      expect(googleCastSender.sourceResolver(source)).toBe(resolvedSource);
      expect(sourceResolver).toHaveBeenCalledWith(source);
    });
  });

  describe('dispose', () => {
    it('should clean up listeners and elements', () => {
      googleCastSender.onGCastApiAvailable(true);
      const removeListenerSpy = vi.spyOn(googleCastSender, 'removeCastListener');
      const removeScriptSpy = vi.spyOn(googleCastSender, 'removeCastScript');
      const endSessionSpy = vi.spyOn(googleCastSender, 'endCurrentSession');

      googleCastSender.dispose();
      expect(removeListenerSpy).toHaveBeenCalledOnce();
      expect(removeScriptSpy).toHaveBeenCalledOnce();
      expect(endSessionSpy).toHaveBeenCalledOnce();
      expect(window.__onGCastApiAvailable).toBeUndefined();
    });
  });
});
