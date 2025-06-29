import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import videojs from 'video.js';
import CardButton from '../src/card-button.js';
import { version } from '../package.json';

describe('CardButton', () => {
  let player;
  let options;

  beforeEach(() => {
    const videoEl = document.createElement('video');

    document.body.appendChild(videoEl);
    player = videojs(videoEl);

    options = {
      id: 'test-id',
      metadata: {
        title: 'Test Title',
        duration: 123.456,
        imageTitle: 'Test Image Title',
        imageUrl: 'http://example.com/image.png',
      },
      styleEl: 'color: green;',
    };
  });

  afterEach(() => {
    player.dispose();
  });

  describe('constructor', () => {
    it('should initialize with player and options', () => {
      const cardButton = new CardButton(player, options);

      expect(cardButton.el().getAttribute('aria-labelledby')).toBe('test-id');
      expect(cardButton.el().getAttribute('style')).toBe('color: green;');
    });
  });

  describe('buildCSSClass', () => {
    it('should return the correct CSS class', () => {
      const cardButton = new CardButton(player, options);

      expect(cardButton.buildCSSClass()).toBe('vjs-card vjs-card-button');
    });
  });

  describe('createEl', () => {
    it('should create the main button element with figure as child', () => {
      const cardButton = new CardButton(player, options);

      expect(cardButton.el().tagName).toBe('BUTTON');
      expect(cardButton.el().className).toContain('vjs-card-button');
      expect(cardButton.$('figure')).not.toBeNull();
    });
  });

  describe('VERSION', () => {
    it('should return the version', () => {
      expect(CardButton.VERSION).toBe(version);
    });
  });
});
