import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest';
import videojs from 'video.js';
import { ThumbnailPreview } from '../src/thumbnail-preview.js';

window.HTMLMediaElement.prototype.load = () => {};
window.PointerEvent = MouseEvent;

describe('ThumbnailPreview', () => {
  let player, videoElement;

  beforeAll(() => {
    document.body.innerHTML = '<video id="test-video" class="video-js"></video>';
    videoElement = document.querySelector('#test-video');
  });

  afterEach(() => {
    player.dispose();
    vi.resetAllMocks();
  });

  describe('when progress control is available', () => {
    beforeEach(async() => {
      player = videojs(videoElement, {
        plugins: {
          thumbnailPreview: {
            resetPositionDelay: 0,
            sprite: {
              rows: 1,
              columns: 10,
              thumbnailHeight: 100,
              thumbnailWidth: 100,
              interval: 10000,
              url: 'https://il.srgssr.ch/spritesheet/urn/rts/video/14683290/sprite-14683290.jpeg'
            }
          }
        }
      });

      afterEach(() => {
        player.dispose();
        vi.resetAllMocks();
      });

      await new Promise((resolve) => player.ready(() => resolve()));

      player.duration(100);
      player.height(500);
      player.trigger('playerresize');

      const progressControlEl = player.controlBar.progressControl.el();

      progressControlEl.getBoundingClientRect = () => ({
        left: 0,
        right: 400,
        width: 400,
        top: 0,
        bottom: 30,
        height: 30
      });

      Object.defineProperty(progressControlEl, 'offsetWidth', {
        configurable: true,
        get: () => 400
      });
      Object.defineProperty(progressControlEl, 'offsetHeight', {
        configurable: true,
        get: () => 30
      });
      Object.defineProperty(progressControlEl, 'offsetLeft', {
        configurable: true,
        get: () => 0
      });
      Object.defineProperty(progressControlEl, 'offsetTop', {
        configurable: true,
        get: () => 0
      });
      Object.defineProperty(progressControlEl, 'offsetParent', {
        configurable: true,
        get: () => document.body
      });
    });

    it('should be registered and attached to the player', () => {
      expect(videojs.getPlugin('thumbnailPreview')).toBe(ThumbnailPreview);
      expect(player.thumbnailPreview).toBeDefined();
      expect(player.thumbnailPreview().thumbnailPreviewOverlay).toBeDefined();
      expect(player.thumbnailPreview().thumbnailPreviewOverlay).toBe(player.controlBar.progressControl.thumbnailPreviewOverlay);
      expect(ThumbnailPreview.VERSION).toBeDefined();
    });

    it('should display correct thumbnail frame when hovering progress bar', async() => {
      const progressControl = player.controlBar.progressControl;
      const thumbnailPreviewOverlay = progressControl.thumbnailPreviewOverlay;
      const thumbnailImg = thumbnailPreviewOverlay.el().querySelector('.pbw-thumbnail');
      const progressControlEl = player.controlBar.progressControl.el();
      const rect = progressControlEl.getBoundingClientRect();

      const moveEvent = new MouseEvent('pointermove', {
        clientX: rect.left + rect.width * 0.25
      });

      progressControlEl.dispatchEvent(moveEvent);

      expect(thumbnailImg.style.left).toBe(`-200px`);
      expect(thumbnailImg.style.top).toBe(`0px`);
      expect(thumbnailPreviewOverlay.el().style.transform).toBe(`translateX(50px)`);

      progressControlEl.dispatchEvent(new PointerEvent('pointerleave'));
      await expect.poll(() => thumbnailPreviewOverlay.el().style.transform).toBe(`translateX(-1000px)`);
    });

    it('should hide the thumbnail preview if the current player\'s height is below the threshold', () => {
      const overlayEl = player.controlBar.progressControl.thumbnailPreviewOverlay.el();

      player.height(100);
      player.trigger('playerresize');

      expect(overlayEl.classList).toContain(`vjs-hidden`);

      player.height(500);
      player.trigger('playerresize');

      expect(overlayEl.classList).not.toContain(`vjs-hidden`);
    });

    it('should update the sprite dynamically', async() => {
      const progressControl = player.controlBar.progressControl;
      const thumbnailPreviewOverlay = progressControl.thumbnailPreviewOverlay;
      const thumbnailImg = thumbnailPreviewOverlay.el().querySelector('.pbw-thumbnail');
      const progressControlEl = player.controlBar.progressControl.el();
      const rect = progressControlEl.getBoundingClientRect();
      const moveEvent = new PointerEvent('pointermove', {
        clientX: rect.left + rect.width * 0.25
      });

      player.thumbnailPreview().updateSprite({
        rows: 1,
        columns: 5,
        thumbnailHeight: 200,
        thumbnailWidth: 200,
        interval: 10000,
        url: 'https://il.srgssr.ch/spritesheet/urn/rts/video/14683290/sprite-14683290.jpeg'
      });

      progressControlEl.dispatchEvent(moveEvent);

      expect(thumbnailImg.style.left).toBe(`-400px`);
      expect(thumbnailImg.style.top).toBe(`0px`);
      expect(thumbnailPreviewOverlay.el().style.transform).toBe(`translateX(28px)`);

      progressControlEl.dispatchEvent(new PointerEvent('pointerleave'));
      await expect.poll(() => thumbnailPreviewOverlay.el().style.transform).toBe(`translateX(-1000px)`);
    });

    it('should deactivate the thumbnail overlay when updateSprite is called with a null url', () => {
      const progressControl = player.controlBar.progressControl;
      const thumbnailPreviewOverlay = progressControl.thumbnailPreviewOverlay;
      const overlayEl = thumbnailPreviewOverlay.el();

      expect(overlayEl.classList).not.toContain(`vjs-hidden`);
      expect(thumbnailPreviewOverlay.active).toBeTruthy();
      player.thumbnailPreview().updateSprite({ url: null });
      expect(overlayEl.classList).toContain('vjs-hidden');
      expect(thumbnailPreviewOverlay.active).toBeFalsy();
    });

    it('should deactivate the thumbnail overlay when updateSprite is called with a undefined url', () => {
      const progressControl = player.controlBar.progressControl;
      const thumbnailPreviewOverlay = progressControl.thumbnailPreviewOverlay;
      const overlayEl = thumbnailPreviewOverlay.el();

      expect(overlayEl.classList).not.toContain(`vjs-hidden`);
      expect(thumbnailPreviewOverlay.active).toBeTruthy();
      player.thumbnailPreview().updateSprite({ url: undefined });
      expect(overlayEl.classList).toContain('vjs-hidden');
      expect(thumbnailPreviewOverlay.active).toBeFalsy();
    });

    it('should deactivate the thumbnail overlay when resetSprite is called', () => {
      const progressControl = player.controlBar.progressControl;
      const thumbnailPreviewOverlay = progressControl.thumbnailPreviewOverlay;
      const overlayEl = thumbnailPreviewOverlay.el();

      expect(overlayEl.classList).not.toContain(`vjs-hidden`);
      expect(thumbnailPreviewOverlay.active).toBeTruthy();
      player.thumbnailPreview().resetSprite();
      expect(overlayEl.classList).toContain('vjs-hidden');
      expect(thumbnailPreviewOverlay.active).toBeFalsy();
    });

  });

  describe('when progress control is missing', () => {

    it('should not attach the thumbnail preview overlay if the progressControl is not available', async() => {
      player = videojs(videoElement, {
        controlBar: {
          progressControl: false
        },
        plugins: {
          thumbnailPreview: {
            sprite: {
              rows: 1,
              columns: 10,
              thumbnailHeight: 100,
              thumbnailWidth: 100,
              interval: 10000,
              url: 'https://il.srgssr.ch/spritesheet/urn/rts/video/14683290/sprite-14683290.jpeg'
            }
          }
        }
      });

      await new Promise((resolve) => player.ready(() => resolve()));

      expect(player.controlBar.progressControl).toBeUndefined();
      expect(player.thumbnailPreview().thumbnailPreviewOverlay).toBeUndefined();
    });

    it('should not attach the thumbnail preview overlay if the control bar is not available', async() => {
      player = videojs(videoElement, {
        controlBar: false,
        plugins: {
          thumbnailPreview: {
            sprite: {
              rows: 1,
              columns: 10,
              thumbnailHeight: 100,
              thumbnailWidth: 100,
              interval: 10000,
              url: 'https://il.srgssr.ch/spritesheet/urn/rts/video/14683290/sprite-14683290.jpeg'
            }
          }
        }
      });

      await new Promise((resolve) => player.ready(() => resolve()));

      expect(player.controlBar).toBeUndefined();
      expect(player.thumbnailPreview().thumbnailPreviewOverlay).toBeUndefined();
    });

    it('should not attach the thumbnail preview overlay if the control bar is not a player child', async() => {
      player = videojs(videoElement, {
        children: [
          'mediaLoader',
          'posterImage',
          'titleBar',
          'textTrackDisplay',
          'loadingSpinner',
          'bigPlayButton',
          'liveTracker',
          'errorDisplay',
          'textTrackSettings',
          'resizeManager'
        ],
        plugins: {
          thumbnailPreview: {
            sprite: {
              rows: 1,
              columns: 10,
              thumbnailHeight: 100,
              thumbnailWidth: 100,
              interval: 10000,
              url: 'https://il.srgssr.ch/spritesheet/urn/rts/video/14683290/sprite-14683290.jpeg'
            }
          }
        }
      });

      await new Promise((resolve) => player.ready(() => resolve()));

      expect(player.controlBar).toBeUndefined();
      expect(player.thumbnailPreview().thumbnailPreviewOverlay).toBeUndefined();
    });
  });

});
