import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import pillarbox from '@srgssr/pillarbox-web';
import PillarboxPlaylist from '../src/pillarbox-playlist.js';

const playlist = [
  { sources: [{ src: 'first-source', type: 'test' }], poster: 'first-poster' },
  { sources: [{ src: 'second-source', type: 'test' }], poster: 'second-poster' },
  { sources: [{ src: 'third-source', type: 'test' }], poster: 'third-poster' },
  { sources: [{ src: 'fourth-source', type: 'test' }], poster: 'fourth-poster' }
];

window.HTMLMediaElement.prototype.load = () => {
};

describe('PillarboxPlaylist', () => {
  let player, pillarboxPlaylist, videoElement;

  beforeAll(() => {
    document.body.innerHTML = '<video id="test-video" class="video-js"></video>';
    videoElement = document.querySelector('#test-video');
  });

  beforeEach(() => {
    player = pillarbox(videoElement, {
      plugins: {
        pillarboxPlaylist: true
      }
    });
    pillarboxPlaylist = player.pillarboxPlaylist();
  });

  afterEach(() => {
    vi.resetAllMocks();
    player.dispose();
  });

  it('should be registered and attached to the player', () => {
    expect(pillarbox.getPlugin('pillarboxPlaylist')).toBe(PillarboxPlaylist);
    expect(player.pillarboxPlaylist).toBeDefined();
  });

  describe('load', () => {
    it('should load a playlist', () => {
      // Given
      const srcSpy = vi.spyOn(player, 'src').mockImplementation(() => {});
      const posterSpy = vi.spyOn(player, 'poster').mockImplementation(() => {});

      // When
      pillarboxPlaylist.load(playlist);

      // Then
      expect(pillarboxPlaylist.hasPrevious()).toBeFalsy();
      expect(pillarboxPlaylist.hasNext()).toBeTruthy();
      expect(pillarboxPlaylist.items.length).toBe(4);
      expect(pillarboxPlaylist.currentIndex).toBe(0);
      expect(pillarboxPlaylist.currentItem).toBe(playlist[0]);
      expect(srcSpy).toHaveBeenCalledWith(playlist[0].sources);
      expect(posterSpy).toHaveBeenCalledWith(playlist[0].poster);
    });
  });

  describe('select', () => {
    it('should select an item by index', () => {
      // Given
      const srcSpy = vi.spyOn(player, 'src').mockImplementation(() => {});
      const posterSpy = vi.spyOn(player, 'poster').mockImplementation(() => {});

      // When
      pillarboxPlaylist.load(playlist);
      pillarboxPlaylist.select(3);

      // Then
      expect(pillarboxPlaylist.currentIndex).toBe(3);
      expect(pillarboxPlaylist.currentItem).toBe(playlist[3]);
      expect(srcSpy).toHaveBeenLastCalledWith(playlist[3].sources);
      expect(posterSpy).toHaveBeenLastCalledWith(playlist[3].poster);
    });

    it('should not load an item if its already selected', () => {
      // Given
      const srcSpy = vi.spyOn(player, 'src').mockImplementation(() => {});
      const posterSpy = vi.spyOn(player, 'poster').mockImplementation(() => {});

      // When
      pillarboxPlaylist.load(playlist);
      pillarboxPlaylist.select(0);

      // Then
      expect(pillarboxPlaylist.currentIndex).toBe(0);
      expect(pillarboxPlaylist.currentItem).toBe(playlist[0]);
      expect(srcSpy).toHaveBeenCalledTimes(1);
      expect(srcSpy).toHaveBeenLastCalledWith(playlist[0].sources);
      expect(posterSpy).toHaveBeenCalledTimes(1);
      expect(posterSpy).toHaveBeenLastCalledWith(playlist[0].poster);
    });

    it('should not load an item if its outside of the playlist range', () => {
      // Given
      const srcSpy = vi.spyOn(player, 'src').mockImplementation(() => {});
      const posterSpy = vi.spyOn(player, 'poster').mockImplementation(() => {});

      // When
      pillarboxPlaylist.load(playlist);
      pillarboxPlaylist.select(5);

      // Then
      expect(pillarboxPlaylist.currentIndex).toBe(0);
      expect(pillarboxPlaylist.currentItem).toBe(playlist[0]);
      expect(srcSpy).toHaveBeenCalledTimes(1);
      expect(srcSpy).toHaveBeenLastCalledWith(playlist[0].sources);
      expect(posterSpy).toHaveBeenCalledTimes(1);
      expect(posterSpy).toHaveBeenLastCalledWith(playlist[0].poster);
    });
  });

  describe('next', () => {
    it('should play next on a registered playlist', () => {
      // Given
      const srcSpy = vi.spyOn(player, 'src').mockImplementation(() => {});
      const posterSpy = vi.spyOn(player, 'poster').mockImplementation(() => {});

      // When
      pillarboxPlaylist.load(playlist);
      pillarboxPlaylist.next();

      // Then
      expect(pillarboxPlaylist.hasPrevious()).toBeTruthy();
      expect(pillarboxPlaylist.hasNext()).toBeTruthy();
      expect(pillarboxPlaylist.items.length).toBe(4);
      expect(pillarboxPlaylist.currentIndex).toBe(1);
      expect(pillarboxPlaylist.currentItem).toBe(playlist[1]);
      expect(srcSpy).toHaveBeenLastCalledWith(playlist[1].sources);
      expect(posterSpy).toHaveBeenLastCalledWith(playlist[1].poster);
    });

    it('should not play next if the current index is the last of the playlist', () => {
      // Given
      const srcSpy = vi.spyOn(player, 'src').mockImplementation(() => {});
      const posterSpy = vi.spyOn(player, 'poster').mockImplementation(() => {});

      // When
      pillarboxPlaylist.load(playlist);
      pillarboxPlaylist.select(3);
      pillarboxPlaylist.next();

      // Then
      expect(pillarboxPlaylist.hasPrevious()).toBeTruthy();
      expect(pillarboxPlaylist.hasNext()).toBeFalsy();
      expect(pillarboxPlaylist.items.length).toBe(4);
      expect(pillarboxPlaylist.currentIndex).toBe(3);
      expect(pillarboxPlaylist.currentItem).toBe(playlist[3]);
      expect(srcSpy).toHaveBeenLastCalledWith(playlist[3].sources);
      expect(posterSpy).toHaveBeenLastCalledWith(playlist[3].poster);
    });

    it('should play the first element if repeat is true when next is called and the current index is the last of the playlist', () => {
      // Given
      const srcSpy = vi.spyOn(player, 'src').mockImplementation(() => {});
      const posterSpy = vi.spyOn(player, 'poster').mockImplementation(() => {});

      // When
      pillarboxPlaylist.repeat = true;
      pillarboxPlaylist.load(playlist);
      pillarboxPlaylist.select(3);
      pillarboxPlaylist.next();

      // Then
      expect(pillarboxPlaylist.hasPrevious()).toBeFalsy();
      expect(pillarboxPlaylist.hasNext()).toBeTruthy();
      expect(pillarboxPlaylist.items.length).toBe(4);
      expect(pillarboxPlaylist.currentIndex).toBe(0);
      expect(pillarboxPlaylist.currentItem).toBe(playlist[0]);
      expect(srcSpy).toHaveBeenLastCalledWith(playlist[0].sources);
      expect(posterSpy).toHaveBeenLastCalledWith(playlist[0].poster);
    });
  });

  describe('previous', () => {
    it('should play previous on a registered playlist', () => {
      // Given
      const srcSpy = vi.spyOn(player, 'src').mockImplementation(() => {});
      const posterSpy = vi.spyOn(player, 'poster').mockImplementation(() => {});

      // When
      pillarboxPlaylist.load(playlist);
      pillarboxPlaylist.select(2);
      pillarboxPlaylist.previous();

      // Then
      expect(pillarboxPlaylist.hasPrevious()).toBeTruthy();
      expect(pillarboxPlaylist.hasNext()).toBeTruthy();
      expect(pillarboxPlaylist.items.length).toBe(4);
      expect(pillarboxPlaylist.currentIndex).toBe(1);
      expect(pillarboxPlaylist.currentItem).toBe(playlist[1]);
      expect(srcSpy).toHaveBeenLastCalledWith(playlist[1].sources);
      expect(posterSpy).toHaveBeenLastCalledWith(playlist[1].poster);
    });
  });

  describe('autoadvance', () => {
    it('should play next element on ended if autoadvance is enabled', () => {
      // Given
      const srcSpy = vi.spyOn(player, 'src').mockImplementation(() => {});
      const posterSpy = vi.spyOn(player, 'poster').mockImplementation(() => {});

      // When
      pillarboxPlaylist.autoadvance = true;
      pillarboxPlaylist.load(playlist);
      pillarboxPlaylist.handleEnded();

      // Then
      expect(pillarboxPlaylist.hasPrevious()).toBeTruthy();
      expect(pillarboxPlaylist.hasNext()).toBeTruthy();
      expect(pillarboxPlaylist.items.length).toBe(4);
      expect(pillarboxPlaylist.currentIndex).toBe(1);
      expect(pillarboxPlaylist.currentItem).toBe(playlist[1]);
      expect(srcSpy).toHaveBeenLastCalledWith(playlist[1].sources);
      expect(posterSpy).toHaveBeenLastCalledWith(playlist[1].poster);
    });

    it('should not play next element on ended if autoadvance is disabled', () => {
      // Given
      const srcSpy = vi.spyOn(player, 'src').mockImplementation(() => {});
      const posterSpy = vi.spyOn(player, 'poster').mockImplementation(() => {});

      // When
      pillarboxPlaylist.load(playlist);
      pillarboxPlaylist.handleEnded();

      // Then
      expect(pillarboxPlaylist.hasPrevious()).toBeFalsy();
      expect(pillarboxPlaylist.hasNext()).toBeTruthy();
      expect(pillarboxPlaylist.items.length).toBe(4);
      expect(pillarboxPlaylist.currentIndex).toBe(0);
      expect(pillarboxPlaylist.currentItem).toBe(playlist[0]);
      expect(srcSpy).toHaveBeenLastCalledWith(playlist[0].sources);
      expect(posterSpy).toHaveBeenLastCalledWith(playlist[0].poster);
    });
  });

  describe('shuffle', () => {
    it('should randomize the order of playlist items', () => {
      // Given
      vi.spyOn(player, 'src').mockImplementation(() => {});
      vi.spyOn(player, 'poster').mockImplementation(() => {});

      // When
      pillarboxPlaylist.load(playlist);
      pillarboxPlaylist.shuffle();

      // Then
      expect(playlist).not.toEqual(pillarboxPlaylist.item);
      expect(playlist.length).toBe(pillarboxPlaylist.items.length);
    });
  });

  describe('push', () => {
    it('should push new items at the end of the playlist', () => {
      // Given
      vi.spyOn(player, 'src').mockImplementation(() => {});
      vi.spyOn(player, 'poster').mockImplementation(() => {});
      const items = [
        { sources: [{ src: 'fifth-source', type: 'test' }], poster: 'fifth-poster' },
        { sources: [{ src: 'sixth-source', type: 'test' }], poster: 'sixth-poster' }
      ];

      // When
      pillarboxPlaylist.load(playlist);
      pillarboxPlaylist.push(...items);

      // Then
      expect(pillarboxPlaylist.items.length).toBe(6);
      expect(pillarboxPlaylist.currentIndex).toBe(0);
      expect(pillarboxPlaylist.currentItem).toBe(playlist[0]);
    });
  });

  describe('splice', () => {
    it('should push new items at any point of the playlist', () => {
      // Given
      vi.spyOn(player, 'src').mockImplementation(() => {});
      vi.spyOn(player, 'poster').mockImplementation(() => {});

      const items = [
        { sources: [{ src: 'fifth-source', type: 'test' }], poster: 'fifth-poster' },
        { sources: [{ src: 'sixth-source', type: 'test' }], poster: 'sixth-poster' }
      ];

      // When
      pillarboxPlaylist.load(playlist);
      pillarboxPlaylist.splice(0, 0, ...items);

      // Then
      expect(pillarboxPlaylist.items.length).toBe(6);
      expect(pillarboxPlaylist.currentIndex).toBe(2);
      expect(pillarboxPlaylist.currentItem).toBe(playlist[0]);
    });

    it('should delete items at any point of the playlist', () => {
      // Given
      vi.spyOn(player, 'src').mockImplementation(() => {});
      vi.spyOn(player, 'poster').mockImplementation(() => {});

      // When
      pillarboxPlaylist.load(playlist);
      pillarboxPlaylist.select(2);
      pillarboxPlaylist.splice(0, 1);

      // Then
      expect(pillarboxPlaylist.items.length).toBe(3);
      expect(pillarboxPlaylist.currentIndex).toBe(1);
      expect(pillarboxPlaylist.currentItem).toBe(playlist[2]);
    });

    it('should push and delete items at any point of the playlist', () => {
      // Given
      vi.spyOn(player, 'src').mockImplementation(() => {});
      vi.spyOn(player, 'poster').mockImplementation(() => {});
      const items = [
        { sources: [{ src: 'fifth-source', type: 'test' }], poster: 'fifth-poster' },
        { sources: [{ src: 'sixth-source', type: 'test' }], poster: 'sixth-poster' }
      ];

      // When
      pillarboxPlaylist.load(playlist);
      pillarboxPlaylist.select(2);
      pillarboxPlaylist.splice(1, 1, ...items);

      // Then
      expect(pillarboxPlaylist.items.length).toBe(5);
      expect(pillarboxPlaylist.currentIndex).toBe(3);
      expect(pillarboxPlaylist.currentItem).toBe(playlist[2]);
    });

    it('should lose track of current item when deleted', () => {
      // Given
      vi.spyOn(player, 'src').mockImplementation(() => {});
      vi.spyOn(player, 'poster').mockImplementation(() => {});

      // When
      pillarboxPlaylist.load(playlist);
      pillarboxPlaylist.splice(0, 1);

      // Then
      expect(pillarboxPlaylist.items.length).toBe(3);
      expect(pillarboxPlaylist.currentIndex).toBe(-1);
      expect(pillarboxPlaylist.currentItem).toBeUndefined();
    });
  });
});
