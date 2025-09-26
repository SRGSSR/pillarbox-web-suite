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

    it('should update the icon when calling appendIcon', async() => {
      const newIcon = '<svg xmlns="http://www.w3.org/2000/svg" id="new-icon"></svg>';
      let svg = player.svgButton.el().querySelector('.icon-from-options');

      expect(svg).toBeDefined();
      expect(svg).toBeInstanceOf(SVGElement);
      expect(svg.id).toBe('');

      await player.svgButton.appendIcon({ icon: newIcon });

      svg = player.svgButton.el().querySelector('.icon-from-options');

      expect(svg).toBeDefined();
      expect(svg).toBeInstanceOf(SVGElement);
      expect(svg.id).toBe('new-icon');
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

  describe('Icon loaded as a font icon', () => {
    beforeEach(() => {
      player = videojs(videoElement, {
        svgButton: { iconName: 'chapters' }
      });
    });

    afterEach(() => {
      player.dispose();
    });

    it('should contain the vjs-icon-* class with the provided iconName', () => {
      const placeholder = player.svgButton.el().querySelector('.vjs-icon-placeholder');

      expect(placeholder).toBeDefined();
      expect(placeholder.classList).toContain('vjs-icon-chapters');
    });
  });

});
