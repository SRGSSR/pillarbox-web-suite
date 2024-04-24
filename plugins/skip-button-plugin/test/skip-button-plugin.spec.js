import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import pillarbox from '@srgssr/pillarbox-web';
import { SkipButtonPlugin } from '../src/skip-button-plugin.js';

window.HTMLMediaElement.prototype.load = () => {};

describe('SkipButtonPlugin', () => {
  let player, videoElement;

  beforeAll(() => {
    document.body.innerHTML = '<video id="test-video" class="video-js"></video>';
    videoElement = document.querySelector('#test-video');
  });

  beforeEach(() => {
    player = pillarbox(videoElement, {
      plugins: {
        skipButtonPlugin: true
      }
    });
  });

  afterEach(() => {
    player.dispose();
  });

  it('should be registered and attached to the player', () => {
    expect(pillarbox.getPlugin('skipButtonPlugin')).toBe(SkipButtonPlugin);
    expect(player.skipButtonPlugin).toBeDefined();
  });
});
