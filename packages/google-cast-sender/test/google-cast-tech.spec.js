import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import videojs from 'video.js';
import Chromecast from '../src/google-cast-tech.js';
import './google-cast.mock.js';
import '../src/google-cast-sender.js';


window.HTMLMediaElement.prototype.load = () => { };

describe('Chromecast', () => {
  let player;
  let tech;

  beforeEach(() => {
    vi.useFakeTimers();
    const videoEl = document.createElement('video');

    document.body.appendChild(videoEl);
    player = videojs(videoEl);
    tech = new Chromecast({
      playerId: player.id(),
      source: {
        src: 'https://test.url/video.mp4',
        type: 'video/mp4'
      }
    });
  });

  afterEach(() => {
    player.dispose();
    vi.useRealTimers();
  });

  describe('constructor', () => {
    it('should create a new Chromecast instance', () => {
      expect(tech).toBeInstanceOf(Chromecast);
    });
  });

  describe('setSrc', () => {
    it('should set the source and load media', () => {
      const source = {
        src: 'https://test.url/video.mp4',
        type: 'video/mp4'
      };

      tech.setSrc(source);
      expect(window.chrome.cast.media.MediaInfo).toHaveBeenCalledWith(
        'https://test.url/video.mp4',
        'video/mp4'
      );
      expect(window.chrome.cast.media.LoadRequest).toHaveBeenCalled();
    });

    it('should resume a casting session', () => {
      vi.spyOn(tech.currentSession, 'getSessionState').mockReturnValue(window.cast.framework.SessionState.SESSION_RESUMED);

      const resumeCastingSessionSpy = vi.spyOn(tech, 'resumeCastingSession');

      tech.setSrc(tech.options().source);
      expect(resumeCastingSessionSpy).toHaveBeenCalled();
    });
  });

  describe('loadMedia', () => {
    it('should handle loadMedia error', async() => {
      const error = new Error('error');
      const errorSpy = vi.spyOn(tech, 'error');

      tech.currentSession.loadMedia.mockRejectedValueOnce(error);

      await tech.loadMedia({ src: 'test.mp4', type: 'video/mp4' });

      expect(errorSpy).toHaveBeenCalledWith(error);
    });
  });

  describe('play', () => {
    it('should call playOrPause', () => {
      const playOrPauseSpy = vi.spyOn(
        tech.remotePlayerController,
        'playOrPause'
      );

      tech.remotePlayer.isPaused = true;
      tech.play();
      expect(playOrPauseSpy).toHaveBeenCalled();
    });
  });

  describe('pause', () => {
    it('should call playOrPause', () => {
      const playOrPauseSpy = vi.spyOn(
        tech.remotePlayerController,
        'playOrPause'
      );

      tech.remotePlayer.isPaused = false;
      tech.pause();
      expect(playOrPauseSpy).toHaveBeenCalled();
    });
  });

  describe('setVolume', () => {
    it('should set the volume', () => {
      tech.hasStarted_ = true;
      tech.setVolume(0.5);
      expect(tech.remotePlayer.volumeLevel).toBe(0.5);
      expect(tech.remotePlayerController.setVolumeLevel).toHaveBeenCalled();
    });
  });

  describe('setMuted', () => {
    it('should mute and unmute', () => {
      const muteOrUnmuteSpy = vi.spyOn(
        tech.remotePlayerController,
        'muteOrUnmute'
      );

      tech.setMuted(true);
      expect(muteOrUnmuteSpy).toHaveBeenCalled();
      tech.setMuted(false);
      expect(muteOrUnmuteSpy).toHaveBeenCalled();
    });
  });

  describe('setCurrentTime', () => {
    it('should seek to the given time', () => {
      tech.remotePlayer.canSeek = true;
      tech.remotePlayer.duration = 100;
      tech.setCurrentTime(50);
      expect(tech.remotePlayer.currentTime).toBe(50);
      expect(tech.remotePlayerController.seek).toHaveBeenCalled();
    });
  });

  describe('duration', () => {
    it('should return the correct duration', () => {
      tech.remotePlayer.duration = 120;
      expect(tech.duration()).toBe(120);
    });

    it('should return infinity for live content', () => {
      tech.remotePlayer.duration = -1;
      expect(tech.duration()).toBe(Infinity);
    });
  });

  describe('dispose', () => {
    it('should dispose the tech', () => {
      const removeEventListenerSpy = vi.spyOn(
        tech.remotePlayerController,
        'removeEventListener'
      );
      const endSessionSpy = vi.spyOn(tech.currentSession, 'endSession');

      tech.dispose();
      expect(removeEventListenerSpy).toHaveBeenCalled();
      expect(endSessionSpy).toHaveBeenCalled();
    });
  });

  describe('initTracks', () => {
    it('should initialize tracks on mediaInfo change', () => {
      tech.hasTracks = false;
      tech.remotePlayer.mediaInfo = {
        tracks: [
          { trackId: 1, type: 'AUDIO', language: 'en', name: 'English' },
          { trackId: 2, type: 'TEXT', language: 'fr', name: 'French', subtype: 'SUBTITLES' }
        ]
      };
      const getActiveTrackIdsSpy = vi.spyOn(tech, 'getActiveTrackIds');
      const addAudioTracksSpy = vi.spyOn(tech, 'addAudioTracks');
      const addTextTracksSpy = vi.spyOn(tech, 'addTextTracks');

      getActiveTrackIdsSpy.mockReturnValueOnce([]);

      tech.initTracks({
        field: 'mediaInfo',
        value: tech.remotePlayer.mediaInfo
      });

      expect(tech.hasTracks).toBe(true);
      expect(addAudioTracksSpy).toHaveBeenCalled();
      expect(addTextTracksSpy).toHaveBeenCalled();
    });
  });

  describe('initDuration', () => {
    it('should trigger durationchange', () => {
      const triggerSpy = vi.spyOn(tech, 'trigger');

      tech.initDuration({
        field: 'duration',
        value: 100
      });
      expect(triggerSpy).toHaveBeenCalledWith('durationchange');
    });
  });

  describe('triggerWaiting', () => {
    it('should trigger waiting', () => {
      const triggerSpy = vi.spyOn(tech, 'trigger');

      tech.triggerWaiting({
        value: 'BUFFERING'
      });
      expect(triggerSpy).toHaveBeenCalledWith('waiting');
    });
  });

  describe('handleSeeking', () => {
    it('should trigger seeked', () => {
      const triggerSpy = vi.spyOn(tech, 'trigger');

      tech.isSeeking = true;
      tech.handleSeeking({
        field: 'videoInfo'
      });
      expect(triggerSpy).toHaveBeenCalledWith('seeked');
    });
  });

  describe('handlePlaying', () => {
    it('should trigger play and playing', () => {
      const triggerSpy = vi.spyOn(tech, 'trigger');

      tech.handlePlaying({
        value: 'PLAYING'
      });
      expect(triggerSpy).toHaveBeenCalledWith('play');
      expect(triggerSpy).toHaveBeenCalledWith('playing');
    });
  });

  describe('handleEnded', () => {
    it('should trigger ended', () => {
      const triggerSpy = vi.spyOn(tech, 'trigger');

      tech.handleEnded({
        value: 'IDLE'
      });
      expect(triggerSpy).toHaveBeenCalledWith('ended');
    });
  });

  describe('getters', () => {
    it('should return correct values', () => {
      tech.remotePlayer.playerState = 'IDLE';
      expect(tech.ended()).toBe(true);

      tech.remotePlayer.isPaused = true;
      expect(tech.paused()).toBe(true);

      tech.remotePlayer.isMuted = true;
      expect(tech.muted()).toBe(true);

      tech.remotePlayer.volumeLevel = 0.7;
      expect(tech.volume()).toBe(0.7);

      tech.remotePlayer.imageUrl = 'http://test.url/poster.jpg';
      expect(tech.poster()).toBe('http://test.url/poster.jpg');
    });
  });

  describe('isSupported', () => {
    it('should check if supported', () => {
      window.cast.framework.CastContext.getInstance().getCastState.mockReturnValue(
        'connected'
      );
      expect(Chromecast.isSupported()).toBe(true);

      window.cast.framework.CastContext.getInstance().getCastState.mockReturnValue(
        'not_connected'
      );
      expect(Chromecast.isSupported()).toBe(false);
    });
  });

  describe('audioTrackChangeListener', () => {
    it('should handle audio track changes', () => {
      const activeRemoteTrackSpy = vi.spyOn(tech, 'activeRemoteTrack');

      tech.remotePlayer.mediaInfo = {
        tracks: [
          { trackId: 1, type: 'AUDIO', language: 'en', name: 'English' },
          { trackId: 2, type: 'TEXT', language: 'fr', name: 'French', subtype: 'SUBTITLES' }
        ]
      };
      tech.audioTracks().addTrack(new videojs.AudioTrack({ id: '1', language: 'en', enabled: true }));
      tech.audioTrackChangeListener();
      expect(activeRemoteTrackSpy).toHaveBeenCalled();
    });
  });

  describe('textTrackChangeListener', () => {
    it('should handle text track changes', () => {
      const activeRemoteTrackSpy = vi.spyOn(tech, 'activeRemoteTrack');

      tech.remotePlayer.mediaInfo = {
        tracks: [
          { trackId: 1, type: 'AUDIO', language: 'en', name: 'English' },
          { trackId: 2, type: 'TEXT', language: 'fr', name: 'French', subtype: 'SUBTITLES' }
        ]
      };
      tech.textTracks().addTrack(new videojs.TextTrack({ id: '2', language: 'fr', mode: 'showing', tech }));
      tech.textTrackChangeListener();
      expect(activeRemoteTrackSpy).toHaveBeenCalled();
    });
  });

  describe('readyState', () => {
    it('should return correct readyState', () => {
      tech.remotePlayer.playerState = 'IDLE';
      expect(tech.readyState()).toBe(0);
      tech.remotePlayer.playerState = 'BUFFERING';
      expect(tech.readyState()).toBe(0);
      tech.remotePlayer.playerState = 'PLAYING';
      expect(tech.readyState()).toBe(4);
    });
  });

  describe('createEl', () => {
    it('should create an element', () => {
      const el = tech.createEl();

      expect(el.className).toContain('vjs-tech-chromecast');
    });
  });

  describe('findRemoteTrackId', () => {
    it('should find remote track IDs', () => {
      tech.remotePlayer.mediaInfo = {
        tracks: [
          { trackId: 1, type: 'AUDIO', language: 'en', name: 'English' },
          { trackId: 2, type: 'TEXT', language: 'fr', name: 'French', subtype: 'SUBTITLES' }
        ]
      };
      const audioTrack = { language: 'en' };
      const textTrack = { language: 'fr', label: 'French' };

      expect(tech.findRemoteAudioTrackId(audioTrack)).toBe(1);
      expect(tech.findRemoteTextTrackId(textTrack)).toBe(2);
    });
  });

  describe('currentTime', () => {
    it('should handle currentTime when scrubbing or seeking', () => {
      tech.seekTime(50);
      tech.isSeeking = true;
      expect(tech.currentTime()).toBe(50);
      tech.isSeeking = false;
      tech.setScrubbing(true);
      expect(tech.currentTime()).toBe(50);
    });
  });

  describe('seekable', () => {
    it('should return seekable time ranges', () => {
      const mediaSession = window.cast.framework.CastContext.getInstance().getCurrentSession().getMediaSession();

      tech.remotePlayer.duration = 100;
      mediaSession.liveSeekableRange = null;
      let seekable = tech.seekable();

      expect(seekable.length).toBe(1);
      expect(seekable.start(0)).toBe(0);
      expect(seekable.end(0)).toBe(100);
      mediaSession.getEstimatedLiveSeekableRange = () => ({ start: 10, end: 90 });
      mediaSession.liveSeekableRange = true;
      seekable = tech.seekable();
      expect(seekable.length).toBe(1);
      expect(seekable.start(0)).toBe(10);
      expect(seekable.end(0)).toBe(90);
    });
  });

  describe('editRemoteTracksInfo', () => {
    it('should edit remote tracks info', () => {
      const mediaSession = window.cast.framework.CastContext.getInstance().getCurrentSession().getMediaSession();

      tech.editRemoteTracksInfo([1, 2]);
      expect(mediaSession.editTracksInfo).toHaveBeenCalled();
      expect(window.chrome.cast.media.EditTracksInfoRequest).toHaveBeenCalledWith([1, 2]);
    });
  });

  describe('restoreTracksFromRemote', () => {
    it('should restore tracks from remote', () => {
      tech.audioTracks().addTrack(new videojs.AudioTrack({ id: '1', language: 'en' }));
      tech.textTracks().addTrack(new videojs.TextTrack({ id: '2', language: 'fr', tech }));
      vi.spyOn(tech, 'getActiveTrackIds').mockReturnValue(['1', '2']);
      tech.restoreTracksFromRemote();
      expect(tech.audioTracks().getTrackById('1').enabled).toBe(true);
      expect(tech.textTracks().getTrackById('2').mode).toBe('showing');
    });
  });

  describe('addAudioTracks', () => {
    it('should add audio tracks', () => {
      const tracks = [{ trackId: 1, language: 'en', name: 'English' }];

      tech.addAudioTracks(tracks);
      expect(tech.audioTracks().length).toBe(1);
      expect(tech.audioTracks().getTrackById(1).label).toBe('English');
    });
  });

  describe('addTextTracks', () => {
    it('should add text tracks', () => {
      const tracks = [{ trackId: 2, language: 'fr', name: 'French' }];

      tech.addTextTracks(tracks);
      expect(tech.textTracks().length).toBe(1);
      expect(tech.textTracks().getTrackById(2).label).toBe('French');
    });
  });

  describe('nativeSourceHandler', () => {
    it('should handle source', () => {
      const source = { src: 'test.mp4', type: 'video/mp4' };
      const techMock = { setSrc: vi.fn() };

      Chromecast.nativeSourceHandler.handleSource(source, techMock);
      expect(techMock.setSrc).toHaveBeenCalledWith({ castSessionResumed: false, ...source });
    });

    it('should check if it can play a source', () => {
      vi.spyOn(videojs.VhsSourceHandler, 'canPlayType').mockReturnValueOnce('maybe');

      const canPlay = Chromecast.nativeSourceHandler.canPlaySource({ type: 'video/mp4' });

      expect(canPlay).toBe('maybe');
    });
  });
});
