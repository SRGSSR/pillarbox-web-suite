import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import videojs from 'video.js';
import ShareToggle from '../src/share-toggle.js';

window.HTMLMediaElement.prototype.load = () => {};

describe('ShareToggle', () => {
  let player, videoElement;

  beforeAll(() => {
    document.body.innerHTML = '<video id="test-video" class="video-js"></video>';
    videoElement = document.querySelector('#test-video');
  });

  beforeEach(() => {
    player = videojs(videoElement);
    player.addChild('ShareToggle', {
      icon: '<svg xmlns="http://www.w3.org/2000/svg"></svg>'
    });
  });

  afterEach(() => {
    player.dispose();
  });

  it('should be registered and attached to the player', () => {
    expect(videojs.getComponent('ShareToggle')).toBe(ShareToggle);
    expect(player.getChild('ShareToggle')).toBeDefined();
  });

  it('should toggle the share modal', () => {
    player.addChild('ShareModal');
    const toggle = player.getChild('ShareToggle');

    toggle.handleClick();

    expect(player.getChild('ShareModal').isOpen()).toBe(true);
    expect(toggle.hasClass('vjs-hidden')).toBe(true);

    toggle.handleClick();

    expect(player.getChild('ShareModal').isOpen()).toBe(false);
    expect(toggle.hasClass('vjs-hidden')).toBe(false);
  });

  it('should follow the share modal lifecycle when it is controlled externally', () => {
    const modal = player.addChild('ShareModal');
    const toggle = player.getChild('ShareToggle');

    toggle.bindShareModal();

    modal.open();

    expect(toggle.hasClass('vjs-hidden')).toBe(true);

    modal.close();

    expect(toggle.hasClass('vjs-hidden')).toBe(false);
  });

  it('should require a share modal child', () => {
    expect(() => player.getChild('ShareToggle').handleClick())
      .toThrow('ShareToggle requires a ShareModal child on the player');
  });
});
