import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import videojs from 'video.js';
import BigReplayButton from '../src/big-replay-button.js';

window.HTMLMediaElement.prototype.load = () => {};

describe('BigReplayButton', () => {
  let player, videoElement;

  beforeAll(() => {
    document.body.innerHTML = '<video id="test-video" class="video-js"></video>';
    videoElement = document.querySelector('#test-video');
  });

  beforeEach(() => {
    player = videojs(videoElement, { bigReplayButton: true });
  });

  afterEach(() => {
    player.dispose();
    vi.resetAllMocks();
  });

  it('should be registered and attached to the player', () => {
    expect(videojs.getComponent('BigReplayButton')).toBe(BigReplayButton);
    expect(player.bigReplayButton).toBeDefined();
    expect(BigReplayButton.VERSION).toBeDefined();
  });

  it('should restart the video when clicked', () => {
    const buttonInstance = player.getChild('BigReplayButton');
    const playSpy = vi.spyOn(player, 'play');

    // When
    buttonInstance.trigger('click');

    // Then
    expect(playSpy).toHaveBeenCalled();
  });
});
