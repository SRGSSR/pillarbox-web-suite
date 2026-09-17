import { afterEach, describe, expect, it } from 'vitest';
import pillarbox from '@srgssr/pillarbox-web';
import '../src/playback-rate-button.js';

window.HTMLMediaElement.prototype.load = () => {};

describe('PlaybackRateButton', () => {
  let player;

  const createPlayer = (options = {}) => {
    document.body.innerHTML = '<video id="test-video" class="video-js"></video>';
    player = pillarbox('test-video', {
      playbackRates: [0.5, 1, 2],
      controlBar: { children: ['playbackRateButton'] },
      ...options
    });

    return player.controlBar.getChild('PlaybackRateButton');
  };

  afterEach(() => {
    player.dispose();
  });

  it('should open the menu on click', () => {
    const button = createPlayer();

    player.playbackRate(1);
    button.handleClick();
    expect(button.buttonPressed_).toBe(true);
    expect(player.playbackRate()).toBe(1);
  });

  it('should cycle through the playback rates on click in audio only mode', async() => {
    const button = createPlayer({ audioOnlyMode: true });

    await new Promise(resolve => player.ready(resolve));

    player.playbackRate(1);
    button.handleClick();
    expect(player.playbackRate()).toBe(2);

    button.handleClick();
    expect(player.playbackRate()).toBe(0.5);
    expect(button.buttonPressed_).toBeFalsy();
  });
});
