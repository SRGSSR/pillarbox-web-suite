import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import videojs from 'video.js';
import CardLink from '../src/card-link.js';
import { version } from '../package.json';

describe('CardLink', () => {
  let player;
  let options;

  beforeEach(() => {
    const videoEl = document.createElement('video');

    document.body.appendChild(videoEl);
    player = videojs(videoEl);

    options = {
      metadata: {
        title: 'Test Title',
        duration: 123.456,
        imageTitle: 'Test Image Title',
        imageUrl: 'http://example.com/image.png',
      },
      urlHandler: vi.fn(() => 'http://example.com/link'),
      styleEl: 'color: blue;',
    };
  });

  afterEach(() => {
    player.dispose();
  });

  describe('constructor', () => {
    it('should initialize with player and options', () => {
      const cardLink = new CardLink(player, options);

      expect(cardLink.handleUrl).toBeInstanceOf(Function);
      expect(cardLink.el().getAttribute('href')).toBe('http://example.com/link');
      expect(cardLink.el().getAttribute('aria-labelledby')).toBe(cardLink.id());
      expect(cardLink.el().getAttribute('title')).toBe('Test Title');
      expect(cardLink.el().getAttribute('style')).toBe('color: blue;');
    });
  });

  describe('buildCSSClass', () => {
    it('should return the correct CSS class', () => {
      const cardLink = new CardLink(player, options);
      const cssClass = 'vjs-card vjs-card-link';

      expect(cardLink.buildCSSClass()).toBe(cssClass);
    });
  });

  describe('createEl', () => {
    it('should create the anchor element', () => {
      const cardLink = new CardLink(player, options);
      const anchorEl = cardLink.createEl();

      expect(anchorEl.tagName).toBe('A');
      expect(anchorEl.className).toContain('vjs-card-link');
      expect(anchorEl.getAttribute('rel')).toBe('noopener noreferrer');
    });
  });

  describe('VERSION', () => {
    it('should return the version', () => {
      expect(CardLink.VERSION).toBe(version);
    });
  });
});
