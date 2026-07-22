import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import videojs from 'video.js';
import DrmSupport from '../src/drm-support.js';

window.HTMLMediaElement.prototype.load = () => { };

describe('DrmSupport', () => {
  let player, videoElement, plugin;

  beforeAll(() => {
    document.body.innerHTML = '<video id="test-video" class="video-js"></video>';
    videoElement = document.querySelector('#test-video');
  });

  beforeEach(() => {
    vi.restoreAllMocks();
    window.navigator.requestMediaKeySystemAccess = vi.fn();

    player = videojs(videoElement, {
      plugins: {
        drmSupport: true
      }
    });
    plugin = player.drmSupport();
  });

  afterEach(() => {
    player.dispose();
  });

  it('should be registered and attached to the player', () => {
    expect(videojs.getPlugin('drmSupport')).toBe(DrmSupport);
    expect(player.drmSupport).toBeDefined();
    expect(DrmSupport.VERSION).toBeDefined();
  });

  describe('checkVendor', () => {
    const levels = [
      { robustness: 'HIGH', label: 'L1' },
      { robustness: 'LOW', label: 'L3' }
    ];
    const initTypes = ['cenc'];
    const type = 'video/mp4';

    it('should return level and hdcp for successful robustness', async() => {
      const mockMediaKeys = {};
      const mockAccess = { createMediaKeys: vi.fn().mockResolvedValue(mockMediaKeys) };

      window.navigator.requestMediaKeySystemAccess.mockResolvedValue(mockAccess);

      vi.spyOn(plugin, 'findMaxHdcp').mockResolvedValue('2.2');

      const result = await plugin.checkVendor('test.drm', levels, initTypes, type);

      expect(result).toEqual({ level: 'L1', hdcp: '2.2' });
      expect(mockAccess.createMediaKeys).toHaveBeenCalledTimes(1);
    });

    it('should continue to next level if first fails', async() => {
      const mockMediaKeys = {};
      const mockAccess = { createMediaKeys: vi.fn().mockResolvedValue(mockMediaKeys) };


      window.navigator
        .requestMediaKeySystemAccess
        .mockRejectedValueOnce(new Error('Fail HIGH'))
        .mockResolvedValueOnce(mockAccess);

      vi.spyOn(plugin, 'findMaxHdcp').mockResolvedValue('1.4');

      const result = await plugin.checkVendor('test.drm', levels, initTypes, type);

      expect(result).toEqual({ level: 'L3', hdcp: '1.4' });

      expect(window.navigator.requestMediaKeySystemAccess).toHaveBeenCalledTimes(2);
    });

    it('should return null if all levels fail', async() => {
      window.navigator.requestMediaKeySystemAccess.mockRejectedValue(new Error('Fail'));

      const result = await plugin.checkVendor('test.drm', levels, initTypes, type);

      expect(result).toBeNull();
    });
  });

  describe('findMaxHdcp', () => {
    it('should return null if getStatusForPolicy is missing', async() => {
      const mediaKeys = {};

      const result = await plugin.findMaxHdcp(mediaKeys);

      expect(result).toBeNull();
    });

    it('should return highest usable HDCP version', async() => {
      const mediaKeys = {
        getStatusForPolicy: vi.fn().mockImplementation(async({ minHdcpVersion }) => {
          if (minHdcpVersion === '2.3') throw new Error('Too high');
          if (minHdcpVersion === '2.2') return 'usable';

          return 'usable';
        })
      };

      const result = await plugin.findMaxHdcp(mediaKeys);

      expect(result).toBe('2.2');
    });

    it('should return null if no version is usable', async() => {
      const mediaKeys = {
        getStatusForPolicy: vi.fn().mockRejectedValue(new Error('Fail'))
      };

      const result = await plugin.findMaxHdcp(mediaKeys);

      expect(result).toBeNull();
    });
  });

  describe('check', () => {
    it('should call checkVendor for all configs', async() => {
      vi.spyOn(plugin, 'checkVendor').mockResolvedValue({ level: 'MockLabel', hdcp: '2.2' });

      const result = await plugin.check();

      expect(plugin.checkVendor).toHaveBeenCalledTimes(Object.keys(DrmSupport.DRM_CONFIG).length);

      expect(result).toEqual({
        widevine: { level: 'MockLabel', hdcp: '2.2' },
        playReady: { level: 'MockLabel', hdcp: '2.2' },
        fairPlay: { level: 'MockLabel', hdcp: '2.2' },
        clearKey: { level: 'MockLabel', hdcp: '2.2' }
      });
    });
  });
});
