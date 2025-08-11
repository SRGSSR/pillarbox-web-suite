import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import videojs from 'video.js';
import { Card } from '../src/index.js';
import { version } from '../package.json';


describe('Card', () => {
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
      styleEl: 'color: red;',
    };
  });

  afterEach(() => {
    player.dispose();
  });

  describe('constructor', () => {
    it('should initialize with player and options', () => {
      const card = new Card(player, options);

      expect(card.metadata).toEqual(options.metadata);
      expect(card.el().querySelector('figure')).not.toBeNull();
      expect(card.el().getAttribute('style')).toBe('color: red;');
    });
  });

  describe('createTitle', () => {
    it('should create a title element', () => {
      const card = new Card(player, options);
      const titleEl = card.createTitle();

      expect(titleEl.tagName).toBe('P');
      expect(titleEl.className).toBe('vjs-card-title');
      expect(titleEl.textContent).toBe('Test Title');
    });
  });

  describe('createDuration', () => {
    it('should create a duration element', () => {
      const card = new Card(player, options);
      const durationEl = card.createDuration();

      expect(durationEl.tagName).toBe('SPAN');
      expect(durationEl.className).toBe('vjs-card-duration');
      expect(durationEl.getAttribute('aria-hidden')).toBe('true');
      expect(durationEl.textContent).toBe(videojs.time.formatTime(123.456, 600));
    });
  });

  describe('createFigCaption', () => {
    it('should create a figcaption element with title and duration', () => {
      const card = new Card(player, options);
      const figcaptionEl = card.createFigCaption();

      expect(figcaptionEl.tagName).toBe('FIGCAPTION');
      expect(figcaptionEl.className).toBe('vjs-card-figcaption');
      expect(figcaptionEl.querySelector('.vjs-card-title')).not.toBeNull();
      expect(figcaptionEl.querySelector('.vjs-card-duration')).not.toBeNull();
    });
  });

  describe('createImage', () => {
    it('should create an image element', () => {
      const card = new Card(player, options);
      const imageEl = card.createImage();

      expect(imageEl.tagName).toBe('IMG');
      expect(imageEl.className).toBe('vjs-card-img');
      expect(imageEl.alt).toBe('Test Image Title');
      expect(imageEl.src).toBe('http://example.com/image.png');
    });
  });

  describe('createFigure', () => {
    it('should create a figure element with image and figcaption', () => {
      const card = new Card(player, options);
      const figureEl = card.createFigure();

      expect(figureEl.tagName).toBe('FIGURE');
      expect(figureEl.className).toBe('vjs-card-figure');
      expect(figureEl.querySelector('img')).not.toBeNull();
      expect(figureEl.querySelector('figcaption')).not.toBeNull();
    });
  });

  describe('select', () => {
    it('should add the vjs-card-selected class when selected is true', () => {
      const card = new Card(player, options);

      card.select(true);
      expect(card.hasClass('vjs-card-selected')).toBe(true);
    });

    it('should remove the vjs-card-selected class when selected is false', () => {
      const card = new Card(player, options);

      card.addClass('vjs-card-selected'); // Ensure it's initially selected
      card.select(false);
      expect(card.hasClass('vjs-card-selected')).toBe(false);
    });
  });

  describe('isSelected', () => {
    it('should return true if the card has the vjs-card-selected class', () => {
      const card = new Card(player, options);

      card.el().classList.add('vjs-card-selected');
      expect(card.isSelected()).toBe(true);
    });

    it('should return false if the card does not have the vjs-card-selected class', () => {
      const card = new Card(player, options);

      expect(card.isSelected()).toBe(false);
    });
  });

  describe('buildCSSClass', () => {
    it('should return the correct CSS class', () => {
      const card = new Card(player, options);

      expect(card.buildCSSClass()).toBe('vjs-card');
    });
  });

  describe('createEl', () => {
    it('should create the main div element with figure as child', () => {
      const card = new Card(player, options);
      const mainEl = card.createEl();

      expect(mainEl.tagName).toBe('DIV');
      expect(mainEl.className).toContain('vjs-card');
      expect(mainEl.querySelector('figure')).not.toBeNull();
    });

    it('should create an element with a custom tag and properties', () => {
      const card = new Card(player, options);
      const customEl = card.createEl('span', { id: 'custom-id' }, { 'data-test': 'value' });

      expect(customEl.tagName).toBe('SPAN');
      expect(customEl.id).toBe('custom-id');
      expect(customEl.getAttribute('data-test')).toBe('value');
      expect(customEl.querySelector('figure')).not.toBeNull();
    });
  });

  describe('VERSION', () => {
    it('should return the version', () => {
      expect(Card.VERSION).toBe(version);
    });
  });
});
