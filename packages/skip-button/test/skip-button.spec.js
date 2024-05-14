import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import SkipButton from '../src/skip-button'; // Adjust path as needed
import pillarbox from '@srgssr/pillarbox-web';

window.HTMLMediaElement.prototype.load = () => {};

describe('SkipButton', () => {
  let player;

  beforeEach(() => {
    document.body.innerHTML = '<video id="test-video" class="video-js"></video>';

    const videoElement = document.querySelector('#test-video');
    const Button = pillarbox.getComponent('Button');

    player = pillarbox(videoElement, { SkipButton: true });
    vi.spyOn(Button.prototype, 'handleClick').mockImplementation(()=>{});

  });

  afterEach(() => {
    player.dispose();
    vi.resetAllMocks();
  });

  it('should be registered and attached to the player', () => {
    expect(pillarbox.getComponent('SkipButton')).toBe(SkipButton);
    expect(player.SkipButton).toBeDefined();
  });

  it('should update the button text and show it for valid interval', () => {
    // Given
    const data = {
      text: JSON.stringify({
        type: 'OPENING_CREDITS',
        endTime: 90
      })
    };

    // When
    player.SkipButton.handleTimeIntervalChange(data);

    // Then
    expect(player.SkipButton.controlText()).toBe('Skip intro');
    expect(player.SkipButton.hasClass('vjs-hidden')).toBeFalsy();
  });

  it('should hide the button when there is no active interval', () => {
    // When
    player.SkipButton.handleTimeIntervalChange();

    // Then
    expect(player.SkipButton.hasClass('vjs-hidden')).toBeTruthy();
  });

  it('should seek to the end of the interval when clicked', () => {
    // Given
    const data = {
      endTime: 90,
      text: JSON.stringify({ type: 'OPENING_CREDITS' })
    };
    const spy = vi.spyOn(player, 'currentTime');

    // When
    player.SkipButton.handleTimeIntervalChange(data);
    player.SkipButton.handleClick();

    // Then
    expect(spy).toHaveBeenCalledWith(90);

    vi.resetAllMocks;
  });

  it('should unregister the time interval change event listener upon disposal', () => {
    // Given
    const spy = vi.spyOn(player, 'off');
    const Button = pillarbox.getComponent('Button');

    vi.spyOn(Button.prototype, 'dispose').mockImplementation(() => {});

    // When
    player.SkipButton.dispose();

    // Then
    expect(spy).toHaveBeenCalledWith('srgssr/interval', player.SkipButton.onTimeIntervalChange_);

    vi.resetAllMocks();
  });
});
