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
import ThumbnailPreview from '../src/thumbnail-preview.js';

window.HTMLMediaElement.prototype.load = () => {
};

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
        controlBar: {
          progressControl: {
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
        }
      });

      afterEach(() => {
        player.dispose();
        vi.resetAllMocks();
      });

      await new Promise((resolve) => player.ready(() => resolve()));

      player.duration(100);
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
      expect(videojs.getComponent('ThumbnailPreview')).toBe(ThumbnailPreview);
      expect(player.controlBar.progressControl.thumbnailPreview).toBeDefined();
      expect(ThumbnailPreview.VERSION).toBeDefined();
    });

    it('should display correct thumbnail frame when hovering progress bar', async() => {
      const progressControl = player.controlBar.progressControl;
      const thumbnailPreview = progressControl.thumbnailPreview;
      const thumbnailImg = thumbnailPreview.el().querySelector('.pbw-thumbnail');
      const progressControlEl = player.controlBar.progressControl.el();
      const rect = progressControlEl.getBoundingClientRect();

      const moveEvent = new MouseEvent('mousemove', {
        clientX: rect.left + rect.width * 0.25
      });

      progressControlEl.dispatchEvent(moveEvent);

      expect(thumbnailImg.style.left).toBe(`-200px`);
      expect(thumbnailImg.style.top).toBe(`0px`);
      expect(thumbnailPreview.el().style.transform).toBe(`translateX(50px)`);

      progressControlEl.dispatchEvent(new MouseEvent('mouseleave'));
      await expect.poll(() => thumbnailPreview.el().style.transform).toBe(`translateX(-1000px)`);
    });

    it('should hide the thumbnail preview if the current player\'s height is below the threshold', () => {
      const thumbnailPreview = player.controlBar.progressControl.thumbnailPreview.el();

      player.height(100);
      player.trigger('playerresize');

      expect(thumbnailPreview.classList).toContain(`vjs-hidden`);

      player.height(500);
      player.trigger('playerresize');

      expect(thumbnailPreview.classList).not.toContain(`vjs-hidden`);
    });

    it('should update the sprite dynamically', async() => {
      const progressControl = player.controlBar.progressControl;
      const thumbnailPreview = progressControl.thumbnailPreview;
      const thumbnailImg = thumbnailPreview.el().querySelector('.pbw-thumbnail');
      const progressControlEl = player.controlBar.progressControl.el();
      const rect = progressControlEl.getBoundingClientRect();
      const moveEvent = new MouseEvent('mousemove', {
        clientX: rect.left + rect.width * 0.25
      });

      thumbnailPreview.updateSprite({
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
      expect(thumbnailPreview.el().style.transform).toBe(`translateX(28px)`);

      progressControlEl.dispatchEvent(new MouseEvent('mouseleave'));
      await expect.poll(() => thumbnailPreview.el().style.transform).toBe(`translateX(-1000px)`);
    });
  });

  describe('when progress control is missing', () => {

    it('should dispose the thumbnail preview if progress bar is not available on player ready', async() => {
      player = videojs(videoElement, {
        controlBar: {
          progressControl: false
        },
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
      });

      await new Promise((resolve) => player.ready(() => resolve()));

      expect(player.controlBar.progressControl).toBeUndefined();
      expect(player.thumbnailPreview.el().classList).toContain(`vjs-hidden`);
    });
  });

});
