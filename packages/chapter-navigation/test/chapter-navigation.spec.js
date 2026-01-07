import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import pillarbox from '@srgssr/pillarbox-web';
import ChapterNavigation from '../src/chapter-navigation.js';

window.HTMLMediaElement.prototype.load = () => {};

describe('ChapterNavigation', () => {
  let player, videoElement;

  beforeAll(() => {
    document.body.innerHTML = '<video id="test-video" class="video-js"></video>';
    videoElement = document.querySelector('#test-video');
  });

  beforeEach(() => {
    player = pillarbox(videoElement, {
      chapterNavigation: true
    });
  });

  afterEach(() => {
    player.dispose();
  });

  it('should be registered and attached to the player', () => {
    expect(pillarbox.getComponent('ChapterNavigation')).toBe(ChapterNavigation);
    expect(player.chapterNavigation).toBeDefined();
    expect(ChapterNavigation.VERSION).toBeDefined();
  });
});
