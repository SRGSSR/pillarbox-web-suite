import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import pillarbox from '@srgssr/pillarbox-web';
import LegacyChaptersNavigation from '../src/legacy-chapters-navigation.js';

window.HTMLMediaElement.prototype.load = () => {};

describe('LegacyChaptersNavigation', () => {
  let player, videoElement;

  beforeAll(() => {
    document.body.innerHTML = '<video id="test-video" class="video-js"></video>';
    videoElement = document.querySelector('#test-video');
  });

  beforeEach(() => {
    player = pillarbox(videoElement, {
      legacyChaptersNavigation: true
    });
  });

  afterEach(() => {
    player.dispose();
  });

  it('should be registered and attached to the player', () => {
    expect(pillarbox.getComponent('LegacyChaptersNavigation')).toBe(LegacyChaptersNavigation);
    expect(player.legacyChaptersNavigation).toBeDefined();
    expect(LegacyChaptersNavigation.VERSION).toBeDefined();
  });
});
