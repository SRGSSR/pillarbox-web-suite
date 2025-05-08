import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import videojs from 'video.js';
import BrandButton from '../src/brand-button.js';
import svgIcon from '../assets/brand-logo.svg?raw';

window.HTMLMediaElement.prototype.load = () => {};

describe('BrandButton', () => {
  let player, videoElement, icon;

  beforeAll(() => {
    document.body.innerHTML = '<video id="test-video" class="video-js"></video>';
    videoElement = document.querySelector('#test-video');
    icon = new DOMParser().parseFromString(svgIcon, 'image/svg+xml').documentElement;
  });

  afterEach(() => {
    player.dispose();
  });

  it('should be registered and attached to the player', () => {
    player = videojs(videoElement, {
      controlBar: {
        brandButton: true
      }
    });
    expect(videojs.getComponent('BrandButton')).toBe(BrandButton);
    expect(player.controlBar.brandButton).toBeDefined();
    expect(BrandButton.VERSION).toBeDefined();
  });

  it('should render the brand link and update title on language change', () => {
    videojs.addLanguage('fr', { 'Open in new window': 'Ouvrir dans une nouvelle fenêtre' });
    player = videojs(videoElement, {
      controlBar: {
        brandButton: {
          href: 'https://www.rts.ch/',
          title: 'Open in new window',
          icon: icon
        }
      }
    });

    const buttonInstance = player.controlBar.brandButton;

    expect(buttonInstance.el().rel).toBe('noopener noreferrer');
    expect(buttonInstance.el().target).toBe('_blank');
    expect(buttonInstance.el().title).toBe('Open in new window');
    expect(buttonInstance.el().href).toBe('https://www.rts.ch/');

    player.language('fr');

    expect(buttonInstance.el().title).toBe('Ouvrir dans une nouvelle fenêtre');
  });

  it('should adapt link with a custom callback', () => {
    player = videojs(videoElement, {
      controlBar: {
        brandButton: {
          href: (player) => `https://www.rts.ch/?language=${player.language()}`,
          title: 'Open in new window',
          icon: icon
        }
      }
    });

    const buttonInstance = player.controlBar.brandButton;

    expect(buttonInstance.el().href).toBe('https://www.rts.ch/?language=en-us');

    player.language('fr');
    player.trigger('loadeddata');
    expect(buttonInstance.el().href).toBe('https://www.rts.ch/?language=fr');
  });
});
