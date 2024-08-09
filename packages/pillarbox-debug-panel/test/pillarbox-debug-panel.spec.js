import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import videojs from 'video.js';
import PillarboxDebugPanel from '../src/pillarbox-debug-panel.js';

window.HTMLMediaElement.prototype.load = () => {
};

HTMLCanvasElement.prototype.getContext = () => ({
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  rect: vi.fn(),
  closePath: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn()
});

describe('PillarboxDebugPanel', () => {
  let player, videoElement;

  beforeAll(() => {
    document.body.innerHTML = '<video id="test-video" class="video-js"></video>';
    videoElement = document.querySelector('#test-video');
  });

  beforeEach(async() => {
    player = videojs(videoElement, {
      pillarboxDebugPanel: true
    });
    await new Promise((resolve) => player.ready(() => resolve()));
  });

  afterEach(() => {
    vi.resetAllMocks();
    player.dispose();
  });

  it('should be registered and attached to the player', () => {
    expect(videojs.getComponent('PillarboxDebugPanel')).toBe(PillarboxDebugPanel);
    expect(player.pillarboxDebugPanel).toBeDefined();
  });

  it('should update the UI when "loadeddata" event is triggered', () => {
    const metrics = player.pillarboxDebugPanel.children();

    player.trigger('loadeddata');
    expect(metrics[0].metricLabel.el().textContent).toMatch(/^Buffer:/);
    expect(metrics[metrics.length - 1].metricLabel.el().textContent).toMatch(/^Timestamp:/);
  });

  it('should update the UI when "timeupdate" event is triggered', () => {
    const metrics = player.pillarboxDebugPanel.children();

    player.trigger('timeupdate');

    expect(metrics[0].metricLabel.el().textContent).toMatch(/^Buffer:/);
    expect(metrics[metrics.length - 1].metricLabel.el().textContent).toMatch(/^Timestamp:/);
  });
});
