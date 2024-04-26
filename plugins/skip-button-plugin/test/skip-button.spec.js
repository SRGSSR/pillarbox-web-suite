import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import SkipButton from '../src/skip-button'; // Adjust path as needed
import pillarbox from '@srgssr/pillarbox-web';

describe('SkipButton', () => {
  let originalHandleClick;

  beforeEach(() => {
    const Button = pillarbox.getComponent('Button');

    originalHandleClick = Button.prototype.handleClick;
    Button.prototype.handleClick = vi.fn();
  });

  afterEach(() => {
    // Restore the original handleClick method after each test
    pillarbox.getComponent('Button').prototype.handleClick = originalHandleClick;
  });

  it('should update the button text and show it for valid interval', () => {
    // Given
    const text = JSON.stringify({
      type: 'OPENING_CREDITS',
      endTime: 90
    });
    const data = { text };
    const show = vi.fn();
    const hide = vi.fn();
    const controlText = vi.fn();
    const { handleTimeIntervalChange } = SkipButton.prototype;
    const context = {
      controlText,
      show,
      hide,
      localize: s => s
    };

    // When
    handleTimeIntervalChange.bind(context)(data);

    // Then
    expect(controlText).toHaveBeenCalledWith('Skip intro');
    expect(show).toHaveBeenCalled();
  });

  it('should hide the button when there is no active interval', () => {
    // Given
    const data = null;
    const hide = vi.fn();
    const { handleTimeIntervalChange } = SkipButton.prototype;
    const context = { hide };

    // When
    handleTimeIntervalChange.bind(context)(data);

    // Then
    expect(hide).toHaveBeenCalled();
  });

  it('should seek to the end of the interval when clicked', () => {
    // Given
    const currentTime = vi.fn();
    const endTime = 150;
    const { handleClick } = SkipButton.prototype;
    const context = {
      activeInterval: { endTime },
      player: () => {
        return { currentTime };
      },
      super: { handleClick: vi.fn() }
    };

    // When
    handleClick.bind(context)({});

    // Then
    expect(currentTime).toHaveBeenCalledWith(endTime);
  });

  it('should unregister the time interval change event listener upon disposal', () => {
    // Given
    const player = { on: vi.fn(), off: vi.fn(), currentTime: vi.fn() };
    const skipButtonInstance = Object.create(SkipButton.prototype);

    skipButtonInstance.player = () => player;
    player.on('srgssr/interval', skipButtonInstance.onTimeIntervalChange_);

    // When
    SkipButton.prototype.dispose.call(skipButtonInstance);

    // Then
    expect(player.off).toHaveBeenCalledWith('srgssr/interval', skipButtonInstance.onTimeIntervalChange_);
  });
});
