import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import videojs from 'video.js';
import UserPreferences from '../src/user-preferences.js';
import { version } from '../package.json';

window.HTMLMediaElement.prototype.load = () => { };

describe('UserPreferences', () => {
  let player, videoElement;

  beforeEach(() => {
    document.body.innerHTML = '<video id="test-video" class="video-js"></video>';
    videoElement = document.querySelector('#test-video');
    player = videojs(videoElement, {
      textTrackDisplay: false,
      userPreferences: true,
      html5: {
        vhs: {
          overrideNative: false
        },
      }
    });

    player.audioTracks().addTrack(new videojs.AudioTrack({
      enabled: true,
      id: '1',
      kind: 'main',
      label: 'English',
      language: 'en',
    }));
    player.audioTracks().addTrack(new videojs.AudioTrack({
      enabled: false,
      id: '2',
      kind: 'alternative',
      label: 'English alternative',
      language: 'en',
    }));
  });

  afterEach(() => {
    player.dispose();
  });

  it('should be registered and attached to the player', () => {
    expect(videojs.getComponent('UserPreferences')).toBe(UserPreferences);
    expect(player.userPreferences).toBeDefined();
    expect(UserPreferences.VERSION).toBeDefined();
  });

  describe('audioTrackChange', () => {

    it('should not save preferences if the player has not started', () => {
      const spyOnSave = vi.spyOn(player.userPreferences, 'save');

      player.hasStarted(false);
      player.audioTracks().trigger('change');

      expect(spyOnSave).not.toBeCalled();
    });

    it('should save the language and kind of the enabled audio track', () => {
      const spyOnSave = vi.spyOn(player.userPreferences, 'save');

      player.hasStarted(true);
      player.audioTracks().getTrackById('2').enabled = true;
      player.audioTracks().trigger('change');

      expect(spyOnSave).toBeCalledWith({
        audioTrack: { language: 'en', kind: 'alternative' }
      });
    });

    it.skip('should merge with existing preferences', () => {
      localStorage.setItem('vjs-user-preferences', JSON.stringify({
        volume: 0.69, muted: false
      }));
      const spyOnSave = vi.spyOn(player.userPreferences, 'save');

      player.hasStarted(true);
      player.audioTracks().getTrackById('2').enabled = true;
      player.audioTracks().trigger('change');

      expect(spyOnSave).toHaveBeenCalledWith({
        volume: 0.69,
        muted: false,
        audioTrack: { language: 'en', kind: 'alternative' }
      });
    });
  });

  describe('emptied', () => {
    it('should set the isEmptied when the emptied event is fired', () => {
      expect(player.userPreferences.isEmptied).toBe(undefined);
      player.trigger('emptied');
      expect(player.userPreferences.isEmptied).toBe(true);
    });
  });

  describe('playbackRateChange', () => {
    it('should not save preferences if the player has not started or if isEmptied is true', () => {
      const spyOnSave = vi.spyOn(player.userPreferences, 'save');

      player.hasStarted(false);
      player.trigger('ratechange');

      player.userPreferences.isEmptied = true;
      player.trigger('ratechange');

      expect(spyOnSave).not.toBeCalled();
    });

    it('should save the playback rate', () => {
      const spyOnSave = vi.spyOn(player.userPreferences, 'save');

      player.hasStarted(true);
      player.userPreferences.isEmptied = false;
      player.playbackRate(1.420);

      expect(spyOnSave).toBeCalledWith({
        playbackRate: 1.420
      });
    });
  });

  describe('restoreAudioTrack', () => {
    it('should do nothing if no audioTrack preference is saved', () => {
      const preferences = {};
      const track1 = player.audioTracks().getTrackById('1');
      const track2 = player.audioTracks().getTrackById('2');

      player.userPreferences.restoreAudioTrack(preferences);

      expect(track1.enabled).toBe(true);
      expect(track2.enabled).toBe(false);
    });

    it('should do nothing if audioTrack preference has no language', () => {
      const preferences = { audioTrack: { kind: 'main' } };
      const track1 = player.audioTracks().getTrackById('1');
      const track2 = player.audioTracks().getTrackById('2');

      player.userPreferences.restoreAudioTrack(preferences);

      expect(track1.enabled).toBe(true);
      expect(track2.enabled).toBe(false);
    });

    it('should enable the track matching both language and kind', () => {
      const preferences = { audioTrack: { language: 'en', kind: 'alternative' } };
      const track1 = player.audioTracks().getTrackById('1');
      const track2 = player.audioTracks().getTrackById('2');

      // Ensure initial state is different
      track1.enabled = true;
      track2.enabled = false;

      player.userPreferences.restoreAudioTrack(preferences);

      expect(track1.enabled).toBe(false);
      expect(track2.enabled).toBe(true);
    });

    it('should enable the first track matching the language if kind does not match', () => {
      player.audioTracks().addTrack(new videojs.AudioTrack({
        enabled: false,
        id: '3',
        kind: 'commentary',
        label: 'English Commentary',
        language: 'en',
      }));

      const preferences = { audioTrack: { language: 'en', kind: 'non-existent-kind' } };
      const track1 = player.audioTracks().getTrackById('1');
      const track2 = player.audioTracks().getTrackById('2');
      const track3 = player.audioTracks().getTrackById('3');

      // Ensure initial state
      track1.enabled = false;
      track2.enabled = false;
      track3.enabled = true;

      player.userPreferences.restoreAudioTrack(preferences);

      expect(track1.enabled).toBe(true);
      expect(track2.enabled).toBe(false);
      expect(track3.enabled).toBe(false);
    });

    it('should do nothing if no track matches the saved language', () => {
      const preferences = { audioTrack: { language: 'fr', kind: 'main' } };
      const track1 = player.audioTracks().getTrackById('1');
      const track2 = player.audioTracks().getTrackById('2');

      player.userPreferences.restoreAudioTrack(preferences);

      expect(track1.enabled).toBe(true);
      expect(track2.enabled).toBe(false);
    });

    it('should enable the first track matching the language even if kind is undefined in preferences', () => {
      const preferences = { audioTrack: { language: 'en' } };
      const track1 = player.audioTracks().getTrackById('1');
      const track2 = player.audioTracks().getTrackById('2');

      // Ensure initial state
      track1.enabled = false;
      track2.enabled = true;

      player.userPreferences.restoreAudioTrack(preferences);

      expect(track1.enabled).toBe(true);
      expect(track2.enabled).toBe(false);
    });
  });

  describe('restoreTextTrack', () => {
    beforeEach(() => {
      player.textTracks().addTrack(
        new videojs.TextTrack({
          mode: 'disabled',
          kind: 'subtitles', language: 'en', label: 'English Subs',
          tech: player.tech(true)
        })
      );
      player.textTracks().addTrack(
        new videojs.TextTrack({
          mode: 'disabled',
          kind: 'captions', language: 'en', label: 'English Caps',
          tech: player.tech(true)
        })
      );
      player.textTracks().addTrack(
        new videojs.TextTrack({
          mode: 'disabled',
          kind: 'subtitles', language: 'fr', label: 'French Subs',
          tech: player.tech(true)
        })
      );
      player.textTracks().addTrack(
        new videojs.TextTrack({
          mode: 'hidden',
          kind: 'metadata', language: 'zxx', label: 'Metadata',
          tech: player.tech(true)
        })
      );
      player.textTracks().addTrack(
        new videojs.TextTrack({
          mode: 'hidden',
          kind: 'chapters', language: 'zxx', label: 'Chapters',
          tech: player.tech(true)
        })
      );
    });

    it('should do nothing if no textTrack preference is saved', () => {
      const preferences = {};
      const tracks = Array.from(player.textTracks());

      player.userPreferences.restoreTextTrack(preferences);

      tracks.forEach(track => {
        if (!['metadata', 'chapters'].includes(track.kind)) {
          expect(track.mode).toBe('disabled');
        }
      });
    });

    it('should disable all tracks if textTrack preference has no language', () => {
      const preferences = { textTrack: { kind: 'subtitles' } };
      const tracks = Array.from(player.textTracks());
      const enSubs = tracks.find(t => t.language === 'en' && t.kind === 'subtitles');

      enSubs.mode = 'showing';

      player.userPreferences.restoreTextTrack(preferences);

      tracks.forEach(track => {
        if (!['metadata', 'chapters'].includes(track.kind)) {
          expect(track.mode).toBe('disabled');
        }
      });
    });

    it('should enable the track matching both language and kind', () => {
      const preferences = { textTrack: { language: 'en', kind: 'captions' } };
      const tracks = Array.from(player.textTracks());
      const enCaps = tracks.find(t => t.language === 'en' && t.kind === 'captions');
      const enSubs = tracks.find(t => t.language === 'en' && t.kind === 'subtitles');
      const frSubs = tracks.find(t => t.language === 'fr' && t.kind === 'subtitles');

      player.userPreferences.restoreTextTrack(preferences);

      expect(enCaps.mode).toBe('showing');
      expect(enSubs.mode).toBe('disabled');
      expect(frSubs.mode).toBe('disabled');
    });

    it('should enable the first track matching the language if kind does not match', () => {
      const preferences = { textTrack: { language: 'en', kind: 'non-existent-kind' } };
      const tracks = Array.from(player.textTracks());
      const enSubs = tracks.find(t => t.language === 'en' && t.kind === 'subtitles');
      const enCaps = tracks.find(t => t.language === 'en' && t.kind === 'captions');
      const frSubs = tracks.find(t => t.language === 'fr' && t.kind === 'subtitles');

      player.userPreferences.restoreTextTrack(preferences);

      expect(enSubs.mode).toBe('showing');
      expect(enCaps.mode).toBe('disabled');
      expect(frSubs.mode).toBe('disabled');
    });

    it('should do nothing if no track matches the saved language', () => {
      const preferences = { textTrack: { language: 'de', kind: 'subtitles' } };
      const tracks = Array.from(player.textTracks());

      player.userPreferences.restoreTextTrack(preferences);

      tracks.forEach(track => {
        if (!['metadata', 'chapters'].includes(track.kind)) {
          expect(track.mode).toBe('disabled');
        }
      });
    });

    it('should enable the first track matching the language if kind is undefined in preferences', () => {
      const preferences = { textTrack: { language: 'en' } };
      const tracks = Array.from(player.textTracks());
      const enSubs = tracks.find(t => t.language === 'en' && t.kind === 'subtitles');
      const enCaps = tracks.find(t => t.language === 'en' && t.kind === 'captions');
      const frSubs = tracks.find(t => t.language === 'fr' && t.kind === 'subtitles');

      player.userPreferences.restoreTextTrack(preferences);

      expect(enSubs.mode).toBe('showing');
      expect(enCaps.mode).toBe('disabled');
      expect(frSubs.mode).toBe('disabled');
    });

    it('should ignore metadata and chapters tracks when restoring', () => {
      const preferences = { textTrack: { language: 'zxx', kind: 'metadata' } };
      const tracks = player.textTracks().tracks_;
      const metadataTrack = tracks.find(t => t.kind === 'metadata');
      const chaptersTrack = tracks.find(t => t.kind === 'chapters');
      const enSubs = tracks.find(t => t.language === 'en' && t.kind === 'subtitles');

      player.userPreferences.restoreTextTrack(preferences);

      expect(metadataTrack.mode).not.toBe('showing');
      expect(chaptersTrack.mode).not.toBe('showing');
      expect(enSubs.mode).toBe('disabled');

      // Try restoring a valid track to ensure metadata/chapters weren't accidentally enabled
      const validPreferences = { textTrack: { language: 'en', kind: 'subtitles' } };

      player.userPreferences.restoreTextTrack(validPreferences);

      expect(enSubs.mode).toBe('showing');
      expect(metadataTrack.mode).not.toBe('showing');
      expect(chaptersTrack.mode).not.toBe('showing');
    });
  });

  describe('restoreUserPreference', () => {
    beforeEach(() => {
      player.userPreferences.isEmptied = true;
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should do nothing if storage() returns null', () => {
      const storageSpy = vi.spyOn(player.userPreferences, 'storage').mockReturnValue(null);
      const volumeSpy = vi.spyOn(player, 'volume');
      const mutedSpy = vi.spyOn(player, 'muted');
      const playbackRateSpy = vi.spyOn(player, 'playbackRate');
      const restoreTextTrackSpy = vi.spyOn(player.userPreferences, 'restoreTextTrack');
      const restoreAudioTrackSpy = vi.spyOn(player.userPreferences, 'restoreAudioTrack');


      player.userPreferences.restoreUserPreference();

      expect(storageSpy).toHaveBeenCalledTimes(1);
      expect(player.userPreferences.isEmptied).toBe(true);
      expect(volumeSpy).not.toHaveBeenCalled();
      expect(mutedSpy).not.toHaveBeenCalled();
      expect(playbackRateSpy).not.toHaveBeenCalled();
      expect(restoreTextTrackSpy).not.toHaveBeenCalled();
      expect(restoreAudioTrackSpy).not.toHaveBeenCalled();
    });

    it('should restore all preferences from storage() result and reset isEmptied', () => {
      const mockPreferences = {
        volume: 0.69,
        muted: true,
        playbackRate: 1.5,
        textTrack: { language: 'fr', kind: 'subtitles' },
        audioTrack: { language: 'en', kind: 'alternative' }
      };
      const storageSpy = vi.spyOn(player.userPreferences, 'storage')
        .mockReturnValue(mockPreferences);
      const volumeSpy = vi.spyOn(player, 'volume');
      const mutedSpy = vi.spyOn(player, 'muted');
      const playbackRateSpy = vi.spyOn(player, 'playbackRate');
      const restoreTextTrackSpy = vi.spyOn(player.userPreferences, 'restoreTextTrack');
      const restoreAudioTrackSpy = vi.spyOn(player.userPreferences, 'restoreAudioTrack');

      player.userPreferences.restoreUserPreference();

      expect(storageSpy).toHaveBeenCalled();
      expect(player.userPreferences.isEmptied).toBe(false);
      expect(volumeSpy).toHaveBeenCalledWith(mockPreferences.volume);
      expect(mutedSpy).toHaveBeenCalledWith(mockPreferences.muted);
      expect(playbackRateSpy).toHaveBeenCalledWith(mockPreferences.playbackRate);
      expect(restoreTextTrackSpy).toHaveBeenCalledWith(mockPreferences);
      expect(restoreAudioTrackSpy).toHaveBeenCalledWith(mockPreferences);
    });
  });

  describe('save', () => {
    let setItemSpy, getItemSpy, logErrorSpy;

    beforeEach(() => {
      setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
      getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
      logErrorSpy = vi.spyOn(videojs.log, 'error');
      localStorage.clear();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should save the preference object to localStorage', () => {
      const preference = { volume: 0.5, muted: false };
      const expectedStorageName = 'vjs-user-preferences';

      player.userPreferences.save(preference);

      expect(getItemSpy).toHaveBeenCalledWith(expectedStorageName);
      expect(setItemSpy).toHaveBeenCalledWith(
        expectedStorageName,
        JSON.stringify(preference)
      );
    });

    it('should merge the preference object with existing preferences in localStorage', () => {
      const initialPreference = { playbackRate: 1.69 };
      const newPreference = { volume: 0.69 };
      const expectedMergedPreference = { playbackRate: 1.69, volume: 0.69 };
      const expectedStorageName = 'vjs-user-preferences';

      localStorage.setItem(
        expectedStorageName,
        JSON.stringify(initialPreference)
      );
      getItemSpy.mockReturnValueOnce(JSON.stringify(initialPreference));

      player.userPreferences.save(newPreference);

      expect(getItemSpy).toHaveBeenCalledWith(expectedStorageName);
      expect(setItemSpy).toHaveBeenCalledWith(
        expectedStorageName,
        JSON.stringify(expectedMergedPreference)
      );
    });

    it('should handle errors during localStorage.setItem and log them', () => {
      const preference = { volume: 0.3 };
      const expectedStorageName = 'vjs-user-preferences';
      const testError = new Error('Storage quota exceeded');

      setItemSpy.mockImplementation(() => {
        throw testError;
      });

      player.userPreferences.save(preference);

      expect(getItemSpy).toHaveBeenCalledWith(expectedStorageName);
      expect(setItemSpy).toHaveBeenCalledWith(
        expectedStorageName,
        JSON.stringify(preference)
      );
      expect(logErrorSpy).toHaveBeenCalledWith(
        'UserPreferences: Error saving preferences:',
        testError
      );
    });

    it('should not call setItem if preference argument is null or undefined', () => {
      player.userPreferences.save(null);
      expect(setItemSpy).not.toHaveBeenCalled();

      player.userPreferences.save(undefined);
      expect(setItemSpy).not.toHaveBeenCalled();
    });
  });

  describe('storage', () => {
    let getItemSpy, logErrorSpy;

    beforeEach(() => {
      getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
      logErrorSpy = vi.spyOn(videojs.log, 'error');
      localStorage.clear();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should return null if the storage is empty', () => {
      vi.spyOn(player.userPreferences, 'options').mockRejectedValue({
        storageName: 'vjs-user-preferences'
      });
      const storage = player.userPreferences.storage();

      expect(storage).toBeNull(null);
    });

    it('should return the preference object', () => {
      vi.spyOn(player.userPreferences, 'options').mockRejectedValue({
        storageName: 'vjs-user-preferences'
      });

      const storedPreferences = { playbackRate: 1.69, volume: 0.69 };

      getItemSpy.mockReturnValueOnce(JSON.stringify(storedPreferences));

      const storage = player.userPreferences.storage();

      expect(storage).toEqual(storedPreferences);
    });

    it('should handle invalid JSON parsing errors', () => {
      const testError = new Error('SyntaxError: JSON.parse:');

      vi.spyOn(player.userPreferences, 'options').mockRejectedValue({
        storageName: 'vjs-user-preferences'
      });
      vi.spyOn(JSON, 'parse').mockImplementation(() => {
        throw testError;
      });

      player.userPreferences.storage();

      expect(logErrorSpy).toHaveBeenCalledWith(
        'UserPreferences: localStorage:',
        testError
      );
    });
  });

  describe('textTrackChange', () => {
    it('should not save preferences if the player has not started', () => {
      const spyOnSave = vi.spyOn(player.userPreferences, 'save');

      player.hasStarted(false);
      player.textTracks().trigger('change');

      expect(spyOnSave).not.toBeCalled();
    });

    it('should save the language and kind of the enabled text track', () => {
      const spyOnSave = vi.spyOn(player.userPreferences, 'save');

      player.textTracks().addTrack(
        new videojs.TextTrack({
          id: '1',
          mode: 'disabled',
          kind: 'subtitles', language: 'en', label: 'English Subs',
          tech: player.tech(true)
        })
      );

      player.hasStarted(true);
      player.textTracks().getTrackById('1').mode = 'showing';
      player.textTracks().trigger('change');

      expect(spyOnSave).toBeCalledWith({
        textTrack: { language: 'en', kind: 'subtitles' }
      });
    });
  });

  describe('volumeChange', () => {
    it('should the volume and muted', () => {
      const spyOnSave = vi.spyOn(player.userPreferences, 'save');

      player.volume(0.69),
        player.muted(true),
        player.trigger('volumechange');

      expect(spyOnSave).toBeCalledWith({
        volume: 0.69,
        muted: true,
      });
    });
  });

  describe('VERSION', () => {
    it('should return the correct version number', () => {
      expect(UserPreferences.VERSION).toBe(version);
    });
  });
});
