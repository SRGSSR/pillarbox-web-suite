import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../src/lang';
import pillarbox from '@srgssr/pillarbox-web';

window.HTMLMediaElement.prototype.load = () => {};

describe('Language', () => {
  let player;

  beforeEach(() => {
    document.body.innerHTML = '<video id="test-video" class="video-js"></video>';

    const videoElement = document.querySelector('#test-video');

    player = pillarbox(videoElement);
  });

  afterEach(() => {
    player.dispose();
    vi.resetAllMocks();
  });

  it('should use the correct French translations', () => {
    // When
    player.language('fr');

    // Then
    expect(player.localize('Play')).toBe('Lecture');
    expect(player.localize('Skip credits')).toBe('Passer');
  });
});
