import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import videojs from 'video.js';
import ShareToggle from '../src/share-toggle.js';
import '../src/share-modal.js';

window.HTMLMediaElement.prototype.load = () => {};

describe('ShareToggle', () => {
  let player;

  const icon = '<svg xmlns="http://www.w3.org/2000/svg"></svg>';
  const ready = () => new Promise(resolve => player.ready(resolve));

  beforeEach(() => {
    document.body.innerHTML = '<video id="test-video" class="video-js"></video>';
    player = videojs(document.querySelector('#test-video'));
  });

  afterEach(() => {
    player.dispose();
  });

  it('should be registered and attached to the player', () => {
    player.addChild('ShareToggle', { icon });

    expect(videojs.getComponent('ShareToggle')).toBe(ShareToggle);
    expect(player.getChild('ShareToggle')).toBeDefined();
  });

  it('should open the share modal and hide itself until the modal closes', async() => {
    const modal = player.addChild('ShareModal');
    const toggle = player.addChild('ShareToggle', { icon });

    await ready();
    toggle.handleClick();

    expect(modal.opened()).toBe(true);
    expect(toggle.hasClass('vjs-hidden')).toBe(true);

    modal.close();

    expect(toggle.hasClass('vjs-hidden')).toBe(false);
  });

  it('should follow the modal state when initialized before the modal', async() => {
    player.dispose();
    document.body.innerHTML = '<video id="test-video" class="video-js"></video>';
    player = videojs(document.querySelector('#test-video'), {
      shareToggle: { icon },
      shareModal: true
    });

    const toggle = player.getChild('ShareToggle');
    const modal = player.getChild('ShareModal');

    await ready();
    modal.open();

    expect(toggle.hasClass('vjs-hidden')).toBe(true);

    modal.close();

    expect(toggle.hasClass('vjs-hidden')).toBe(false);
  });

  it('should be hidden when bound to an already open modal', async() => {
    const modal = player.addChild('ShareModal');

    modal.open();

    const toggle = player.addChild('ShareToggle', { icon });

    await ready();

    expect(toggle.hasClass('vjs-hidden')).toBe(true);
  });

  it('should require a share modal child', async() => {
    const toggle = player.addChild('ShareToggle', { icon });

    await ready();

    expect(() => toggle.handleClick())
      .toThrow('ShareToggle requires a ShareModal child on the player');
  });
});
