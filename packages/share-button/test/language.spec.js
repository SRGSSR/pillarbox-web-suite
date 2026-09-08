import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import '../src/lang';
import videojs from 'video.js';

window.HTMLMediaElement.prototype.load = () => {};

describe('Language', () => {
  let player;

  beforeEach(() => {
    document.body.innerHTML = '<video id="test-video" class="video-js"></video>';

    const videoElement = document.querySelector('#test-video');

    player = videojs(videoElement);
  });

  afterEach(() => {
    player.dispose();
  });

  it('should use the correct French translations', () => {
    // When
    player.language('fr');

    // Then
    expect(player.localize('Share')).toBe('Partager');
    expect(player.localize('Copy link')).toBe('Copier le lien');
  });
});
