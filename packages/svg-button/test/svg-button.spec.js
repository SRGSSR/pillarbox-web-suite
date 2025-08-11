import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import videojs from 'video.js';
import { SvgButton } from '../src/index.js';
import svgIcon from '../assets/custom.svg?raw';

window.HTMLMediaElement.prototype.load = () => {
};

describe('SvgButton', () => {
  let player, videoElement, icon;

  beforeAll(() => {
    document.body.innerHTML = '<video id="test-video" class="video-js"></video>';
    videoElement = document.querySelector('#test-video');
    icon = new DOMParser().parseFromString(svgIcon, 'image/svg+xml').documentElement;
  });

  describe('The SVG icon is provided', () => {
    beforeEach(() => {
      player = videojs(videoElement, {
        svgButton: { icon: icon }
      });
    });

    afterEach(() => {
      player.dispose();
    });

    it('should be registered and attached to the player', () => {
      expect(videojs.getComponent('SvgButton')).toBe(SvgButton);
      expect(player.svgButton).toBeDefined();
      expect(SvgButton.VERSION).toBeDefined();
    });

    it('should contain the provided svg as a child', () => {
      const svg = player.svgButton.el().querySelector('.icon-from-options');

      expect(svg).toBeDefined();
      expect(svg).toBeInstanceOf(SVGElement);
    });
  });

  describe('The SVG icon is not provided', () => {
    beforeEach(() => {
      player = videojs(videoElement, {
        svgButton: true
      });
    });

    afterEach(() => {
      player.dispose();
    });

    it('should not contain an SVG child', () => {
      expect(player.svgButton.el().querySelector('.icon-from-options')).toBeNull();
    });
  });

  describe('Error loading an invalid SVG icon', () => {
    beforeEach(() => {
      player = videojs(videoElement, {
        svgButton: { icon: '<svg' }
      });
    });

    afterEach(() => {
      player.dispose();
    });

    it('should not contain an SVG child', () => {
      expect(player.svgButton.el().querySelector('.icon-from-options')).toBeNull();
    });
  });

  describe('Icon loaded as an experimental SVG', () => {
    beforeEach(() => {
      player = videojs(videoElement, {
        experimentalSvgIcons: true,
        svgButton: { iconName: 'my-button' }
      });
    });

    afterEach(() => {
      player.dispose();
    });

    it('should contain a <use> referencing the correct icon', () => {
      const use = player.svgButton.el().querySelector('use');

      expect(use).toBeDefined();
      expect(use.getAttribute('href')).toBe('#vjs-icon-my-button');
    });
  });

});
