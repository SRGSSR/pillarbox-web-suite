import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import videojs from 'video.js';
import {
  ShareButton,
  ShareButtonCollection,
  ShareModal,
  ShareToggle,
  ShareUrlOptions
} from '../src/share.js';

window.HTMLMediaElement.prototype.load = () => {};

describe('Share', () => {
  let player, videoElement;

  const createPlayer = (options = {}) => {
    document.body.innerHTML = '<video id="share-video" class="video-js"></video>';
    videoElement = document.querySelector('#share-video');
    player = videojs(videoElement, options);

    return player;
  };

  beforeEach(() => {
    createPlayer();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    player.dispose();
  });

  it('should export and register the components', () => {
    expect(videojs.getComponent('ShareToggle')).toBe(ShareToggle);
    expect(videojs.getComponent('ShareModal')).toBe(ShareModal);
    expect(videojs.getComponent('ShareUrlOptions')).toBe(ShareUrlOptions);
    expect(videojs.getComponent('ShareButtonCollection')).toBe(ShareButtonCollection);
    expect(videojs.getComponent('ShareButton')).toBe(ShareButton);
    expect(videojs.getComponent('FacebookShareButton')).toBeDefined();
    expect(videojs.getComponent('CopyLinkShareButton')).toBeDefined();
  });

  it('should initialize share components from player options', () => {
    player.dispose();
    createPlayer({
      language: 'fr',
      ShareModal: {
        title: 'Partager la video',
        shareUrlOptions: {
          url: 'https://www.rts.ch/play/tv/video/14683290',
          includeCurrentTime: true
        },
        shareButtonCollection: {
          shareText: 'Regarde ca',
          FacebookShareButton: { label: 'Facebook custom' }
        }
      },
      ShareToggle: true
    });
    vi.spyOn(player, 'currentTime').mockReturnValue(83);

    const toggle = player.getChild('ShareToggle');

    toggle.handleClick();

    const modal = player.getChild('ShareModal');
    const urlOptions = modal.getChild('ShareUrlOptions');

    expect(modal.el().querySelector('.vjs-share-title').textContent)
      .toBe('Partager la video');
    expect(modal.el().querySelector('.vjs-share-url-options')).not.toBeNull();
    expect(modal.el().querySelector('#' + urlOptions.id() + '_episode').checked).toBe(false);
    expect(modal.el().querySelector('#' + urlOptions.id() + '_currentTime').checked).toBe(true);
    expect(modal.el().querySelector('.vjs-share-url-option-label').textContent)
      .toContain('Épisode');
    expect(modal.el().querySelectorAll('.vjs-share-url-option-label')[1].textContent)
      .toContain('Position courante');
    expect(modal.el().querySelector('.vjs-share-button--facebook').textContent)
      .toContain('Facebook custom');
    expect(modal.el().querySelector('.vjs-share-button--x a').href)
      .toContain('startTime%3D83');
    expect(modal.el().querySelector('.vjs-share-button--x a').href)
      .toContain('text=Regarde%20ca');
  });
});
