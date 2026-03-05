import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HotkeysHelper } from '../src/srg-ssr-hotkeys.js';

describe('HotkeysHelper', () => {
  let playerMock;
  let eventMock;
  let currentVolume;
  let currentTime;

  beforeEach(() => {
    currentVolume = 0.5;
    currentTime = 50;

    playerMock = {
      paused: vi.fn().mockReturnValue(true),
      play: vi.fn(),
      pause: vi.fn(),
      duration: vi.fn().mockReturnValue(100),
      muted: vi.fn(),
      handleHotkeys: vi.fn(),

      volume: vi.fn((val) => {
        if (val !== undefined) currentVolume = val;

        return currentVolume;
      }),
      currentTime: vi.fn((val) => {
        if (val !== undefined) currentTime = val;

        return currentTime;
      }),

      liveTracker: {
        isLive: vi.fn().mockReturnValue(false),
        liveWindow: vi.fn().mockReturnValue(200),
        atLiveEdge: vi.fn().mockReturnValue(false),
      },
    };

    eventMock = { key: '' };
  });

  describe('handle', () => {
    it('should sequentially call all individual hotkey processing methods', () => {
      // Spy on all static methods to ensure they are called without triggering their internal logic
      const defaultVideoJSHotkeysSpy = vi.spyOn(HotkeysHelper, 'defaultVideoJSHotkeys').mockImplementation(() => { });
      const seekSpy = vi.spyOn(HotkeysHelper, 'seek').mockImplementation(() => { });
      const seekPercentSpy = vi.spyOn(HotkeysHelper, 'seekPercent').mockImplementation(() => { });
      const togglePlaySpy = vi.spyOn(HotkeysHelper, 'togglePlay').mockImplementation(() => { });
      const volumeSpy = vi.spyOn(HotkeysHelper, 'volume').mockImplementation(() => { });

      HotkeysHelper.handle(playerMock, eventMock);

      expect(defaultVideoJSHotkeysSpy).toHaveBeenCalledWith(playerMock, eventMock);
      expect(seekSpy).toHaveBeenCalledWith(playerMock, eventMock);
      expect(seekPercentSpy).toHaveBeenCalledWith(playerMock, eventMock);
      expect(togglePlaySpy).toHaveBeenCalledWith(playerMock, eventMock);
      expect(volumeSpy).toHaveBeenCalledWith(playerMock, eventMock);

      vi.restoreAllMocks();
    });
  });

  describe('defaultVideoJSHotkeys()', () => {
    it('should delegate to the default player.handleHotkeys function', () => {
      HotkeysHelper.defaultVideoJSHotkeys(playerMock, eventMock);

      expect(playerMock.handleHotkeys).toHaveBeenCalledWith(eventMock);
      expect(playerMock.handleHotkeys).toHaveBeenCalledTimes(1);
    });
  });

  describe('seek', () => {
    it('should ignore non-arrow keys', () => {
      eventMock.key = 'Space';
      HotkeysHelper.seek(playerMock, eventMock);

      expect(playerMock.currentTime).not.toHaveBeenCalled();
    });

    it('should seek backward 10 seconds when ArrowLeft is pressed', () => {
      eventMock.key = 'ArrowLeft';
      HotkeysHelper.seek(playerMock, eventMock);

      expect(playerMock.currentTime).toHaveBeenCalledWith(40);
    });

    it('should seek forward 30 seconds when ArrowRight is pressed', () => {
      eventMock.key = 'ArrowRight';
      HotkeysHelper.seek(playerMock, eventMock);

      expect(playerMock.currentTime).toHaveBeenCalledWith(80);
    });

    it('should clamp seek position to 0 if seeking backward past the beginning', () => {
      eventMock.key = 'ArrowLeft';
      currentTime = 5;

      HotkeysHelper.seek(playerMock, eventMock);

      expect(playerMock.currentTime).toHaveBeenCalledWith(0);
    });

    it('should clamp seek position to duration - 0.1, if seeking past the end of a VOD', () => {
      eventMock.key = 'ArrowRight';
      currentTime = 90;

      HotkeysHelper.seek(playerMock, eventMock);

      expect(playerMock.currentTime).toHaveBeenCalledWith(99.9);
    });

    it('should calculate clamping using liveWindow instead of duration if the stream is live', () => {
      eventMock.key = 'ArrowRight';
      currentTime = 190;
      playerMock.liveTracker.isLive.mockReturnValue(true);

      HotkeysHelper.seek(playerMock, eventMock);

      expect(playerMock.currentTime).toHaveBeenCalledWith(199.9);
    });

    it('should not seek forward if currently at the live edge', () => {
      eventMock.key = 'ArrowRight';
      playerMock.liveTracker.isLive.mockReturnValue(true);
      playerMock.liveTracker.atLiveEdge.mockReturnValue(true);

      HotkeysHelper.seek(playerMock, eventMock);

      expect(playerMock.currentTime).toHaveBeenCalledOnce();
    });

    it('should allow seeking backward even if at the live edge', () => {
      eventMock.key = 'ArrowLeft';
      playerMock.liveTracker.isLive.mockReturnValue(true);
      playerMock.liveTracker.atLiveEdge.mockReturnValue(true);

      HotkeysHelper.seek(playerMock, eventMock);

      expect(playerMock.currentTime).toHaveBeenCalledWith(40);
    });
  });

  describe('seekPercent', () => {
    it('should ignore non-numeric keys', () => {
      eventMock.key = 'a';
      HotkeysHelper.seekPercent(playerMock, eventMock);

      expect(playerMock.currentTime).not.toHaveBeenCalled();
    });

    it('should seek to 0% when 0 is pressed', () => {
      eventMock.key = '0';
      HotkeysHelper.seekPercent(playerMock, eventMock);

      expect(playerMock.currentTime).toHaveBeenCalledWith(0);
    });

    it('should seek to 50% when 5 is pressed', () => {
      eventMock.key = '5';
      HotkeysHelper.seekPercent(playerMock, eventMock);

      expect(playerMock.currentTime).toHaveBeenCalledWith(50);
    });

    it('should seek to 90% when 9 is pressed', () => {
      eventMock.key = '9';
      HotkeysHelper.seekPercent(playerMock, eventMock);

      expect(playerMock.currentTime).toHaveBeenCalledWith(90);
    });

    it('should calculate percent using liveWindow if the stream is live', () => {
      eventMock.key = '5';
      playerMock.liveTracker.isLive.mockReturnValue(true);

      HotkeysHelper.seekPercent(playerMock, eventMock);

      expect(playerMock.currentTime).toHaveBeenCalledWith(100);
    });
  });

  describe('togglePlay', () => {
    it('should ignore keys other than p', () => {
      eventMock.key = 'a';
      HotkeysHelper.togglePlay(playerMock, eventMock);

      expect(playerMock.play).not.toHaveBeenCalled();
      expect(playerMock.pause).not.toHaveBeenCalled();
    });

    it('should play the video if paused and p is pressed', () => {
      eventMock.key = 'p';
      playerMock.paused.mockReturnValue(true);

      HotkeysHelper.togglePlay(playerMock, eventMock);

      expect(playerMock.play).toHaveBeenCalled();
      expect(playerMock.pause).not.toHaveBeenCalled();
    });

    it('should pause the video if playing and P is pressed', () => {
      eventMock.key = 'P';
      playerMock.paused.mockReturnValue(false);

      HotkeysHelper.togglePlay(playerMock, eventMock);

      expect(playerMock.pause).toHaveBeenCalled();
      expect(playerMock.play).not.toHaveBeenCalled();
    });
  });

  describe('volume', () => {
    it('should ignore keys not mapped to volume', () => {
      eventMock.key = 'a';
      HotkeysHelper.volume(playerMock, eventMock);

      expect(playerMock.volume).not.toHaveBeenCalled();
    });

    it('should increase volume by 0.1 on +', () => {
      eventMock.key = '+';
      HotkeysHelper.volume(playerMock, eventMock);

      expect(playerMock.volume).toHaveBeenCalledWith(0.6);
      expect(playerMock.muted).toHaveBeenCalledWith(false);
    });

    it('should increase volume by 0.1 on ArrowUp', () => {
      eventMock.key = 'ArrowUp';
      HotkeysHelper.volume(playerMock, eventMock);

      expect(playerMock.volume).toHaveBeenCalledWith(0.6);
      expect(playerMock.muted).toHaveBeenCalledWith(false);
    });

    it('should decrease volume by 0.1 on -', () => {
      eventMock.key = '-';
      HotkeysHelper.volume(playerMock, eventMock);

      expect(playerMock.volume).toHaveBeenCalledWith(0.4);
      expect(playerMock.muted).toHaveBeenCalledWith(false);
    });

    it('should decrease volume by 0.1 on ArrowDown', () => {
      eventMock.key = 'ArrowDown';
      HotkeysHelper.volume(playerMock, eventMock);

      expect(playerMock.volume).toHaveBeenCalledWith(0.4);
      expect(playerMock.muted).toHaveBeenCalledWith(false);
    });

    it('should mute the player if volume drops to 0 or below', () => {
      eventMock.key = '-';
      currentVolume = 0.05;

      HotkeysHelper.volume(playerMock, eventMock);

      expect(playerMock.volume).toHaveBeenCalledWith(-0.05);
      expect(playerMock.muted).toHaveBeenCalledWith(true);
    });
  });
});
