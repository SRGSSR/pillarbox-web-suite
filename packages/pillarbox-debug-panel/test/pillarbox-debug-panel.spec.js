import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import videojs from 'video.js';
import PillarboxDebugPanel from '../src/pillarbox-debug-panel.js';

window.HTMLMediaElement.prototype.load = () => {};

describe('PillarboxDebugPanel', () => {
  let player, videoElement;

  beforeAll(() => {
    document.body.innerHTML = '<video id="test-video" class="video-js"></video>';
    videoElement = document.querySelector('#test-video');
  });

  beforeEach(() => {
    player = videojs(videoElement, {
      PillarboxDebugPanel: true
    });
  });

  afterEach(() => {
    player.dispose();
  });

  it('should be registered and attached to the player', () => {
    expect(videojs.getComponent('PillarboxDebugPanel')).toBe(PillarboxDebugPanel);
    expect(player.PillarboxDebugPanel).toBeDefined();
  });
});
