import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import videojs from 'video.js';
import '../src/lang';
import CountdownUnit from '../src/countdown-unit.js';

window.HTMLMediaElement.prototype.load = () => {};

describe('CountdownUnit localization', () => {
  let player;
  let videoElement;
  let unit;

  beforeEach(async() => {
    document.body.innerHTML = '<video id="test-video" class="video-js"></video>';
    videoElement = document.querySelector('#test-video');

    player = videojs(videoElement);

    await new Promise((resolve) => player.ready(resolve));

    unit = new CountdownUnit(player, {
      label: 'Seconds'
    });

    player.addChild(unit);
  });

  afterEach(() => {
    player.dispose();
    vi.resetAllMocks();
  });

  it('should display the localized label when the language changes', () => {
    const labelEl = unit.el().querySelector('.vjs-countdown-label');

    // Initial language (default)
    expect(labelEl.textContent).toBe('Seconds');

    // When
    player.language('fr');
    player.trigger('languagechange');

    // Then
    expect(labelEl.textContent).toBe('Secondes');
  });
});
