import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import pillarbox from '@srgssr/pillarbox-web';
import { PillarboxPlaylist, RepeatMode } from '../src/pillarbox-playlist.js';

const playlist = [
  {
    sources: [{
      src: 'first-source',
      type: 'test'
    }],
    poster: 'first-poster',
    data: {
      title: 'first-source',
      duration: 180
    }
  },
  {
    sources: [{
      src: 'second-source',
      type: 'test'
    }],
    poster: 'second-poster',
    data: {
      title: 'second-source',
      duration: 150
    }
  },
  {
    sources: [{
      src: 'third-source',
      type: 'test'
    }],
    poster: 'third-poster',
    data: {
      title: 'third-source',
      duration: 120
    }
  },
  {
    sources: [{
      src: 'fourth-source',
      type: 'test'
    }],
    poster: 'fourth-poster',
    startTime: 100,
    data: {
      title: 'fourth-source',
      duration: 210
    }
  }
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
    expect(PillarboxPlaylist.VERSION).toBeDefined();
  });

  describe('load', () => {
    it('should load a playlist', () => {
      // Given
      const srcSpy = vi.spyOn(player, 'src').mockImplementation(() => {
      });
      const posterSpy = vi.spyOn(player, 'poster').mockImplementation(() => {
      });

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

    it('should load a playlist from options', async() => {
      // Given
      player.dispose();
      player = pillarbox(videoElement, {
        plugins: {
          pillarboxPlaylist: { playlist },
        }
      });
      pillarboxPlaylist = player.pillarboxPlaylist();

      const srcSpy = vi.spyOn(player, 'src').mockImplementation(() => {
      });
      const posterSpy = vi.spyOn(player, 'poster').mockImplementation(() => {
      });

      // When
      await new Promise((resolve) => player.ready(() => resolve()));

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
      const srcSpy = vi.spyOn(player, 'src').mockImplementation(() => {
      });
      const posterSpy = vi.spyOn(player, 'poster').mockImplementation(() => {
      });

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
      const srcSpy = vi.spyOn(player, 'src').mockImplementation(() => {
      });
      const posterSpy = vi.spyOn(player, 'poster').mockImplementation(() => {
      });

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
      const srcSpy = vi.spyOn(player, 'src').mockImplementation(() => {
      });
      const posterSpy = vi.spyOn(player, 'poster').mockImplementation(() => {
      });

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
      const srcSpy = vi.spyOn(player, 'src').mockImplementation(() => {
      });
      const posterSpy = vi.spyOn(player, 'poster').mockImplementation(() => {
      });

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
      const srcSpy = vi.spyOn(player, 'src').mockImplementation(() => {
      });
      const posterSpy = vi.spyOn(player, 'poster').mockImplementation(() => {
      });

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

    it('should play first element if the current index is the last of the playlist and repeat mode all is enabled', () => {
      // Given
      const srcSpy = vi.spyOn(player, 'src').mockImplementation(() => {
      });
      const posterSpy = vi.spyOn(player, 'poster').mockImplementation(() => {
      });

      // When
      pillarboxPlaylist.toggleRepeat(RepeatMode.REPEAT_ALL);
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
      const srcSpy = vi.spyOn(player, 'src').mockImplementation(() => {
      });
      const posterSpy = vi.spyOn(player, 'poster').mockImplementation(() => {
      });

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

    it('should restart the current media if the current time is beyond the threshold', () => {
      // Given
      const currentTime = vi.spyOn(player, 'currentTime').mockImplementation(() => pillarboxPlaylist.previousNavigationThreshold + 1);

      // When
      pillarboxPlaylist.load(playlist);
      pillarboxPlaylist.select(2);
      pillarboxPlaylist.previous();

      // Then
      expect(pillarboxPlaylist.hasPrevious()).toBeTruthy();
      expect(pillarboxPlaylist.hasNext()).toBeTruthy();
      expect(pillarboxPlaylist.items.length).toBe(4);
      expect(pillarboxPlaylist.currentIndex).toBe(2);
      expect(pillarboxPlaylist.currentItem).toBe(playlist[2]);
      expect(currentTime).toHaveBeenLastCalledWith(0);
    });

    it('should not play previous if the current index is the last of the playlist', () => {
      // Given
      const srcSpy = vi.spyOn(player, 'src').mockImplementation(() => {
      });
      const posterSpy = vi.spyOn(player, 'poster').mockImplementation(() => {
      });

      // When
      pillarboxPlaylist.load(playlist);
      pillarboxPlaylist.select(0);
      pillarboxPlaylist.previous();

      // Then
      expect(pillarboxPlaylist.hasPrevious()).toBeFalsy();
      expect(pillarboxPlaylist.hasNext()).toBeTruthy();
      expect(pillarboxPlaylist.items.length).toBe(4);
      expect(pillarboxPlaylist.currentIndex).toBe(0);
      expect(pillarboxPlaylist.currentItem).toBe(playlist[0]);
      expect(srcSpy).toHaveBeenLastCalledWith(playlist[0].sources);
      expect(posterSpy).toHaveBeenLastCalledWith(playlist[0].poster);
    });

    it('should play last element if the current index is the first of the playlist and repeat mode all is enabled', () => {
      // Given
      const srcSpy = vi.spyOn(player, 'src').mockImplementation(() => {
      });
      const posterSpy = vi.spyOn(player, 'poster').mockImplementation(() => {
      });

      // When
      pillarboxPlaylist.toggleRepeat(RepeatMode.REPEAT_ALL);
      pillarboxPlaylist.load(playlist);
      pillarboxPlaylist.select(0);
      pillarboxPlaylist.previous();

      // Then
      expect(pillarboxPlaylist.hasPrevious()).toBeTruthy();
      expect(pillarboxPlaylist.hasNext()).toBeFalsy();
      expect(pillarboxPlaylist.items.length).toBe(4);
      expect(pillarboxPlaylist.currentIndex).toBe(3);
      expect(pillarboxPlaylist.currentItem).toBe(playlist[3]);
      expect(srcSpy).toHaveBeenLastCalledWith(playlist[3].sources);
      expect(posterSpy).toHaveBeenLastCalledWith(playlist[3].poster);
    });
  });

  describe('autoadvance', () => {
    it('should play next element on ended if autoadvance is enabled', () => {
      // Given
      const srcSpy = vi.spyOn(player, 'src').mockImplementation(() => {
      });
      const posterSpy = vi.spyOn(player, 'poster').mockImplementation(() => {
      });

      // When
      pillarboxPlaylist.toggleAutoadvance(true);
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
      const srcSpy = vi.spyOn(player, 'src').mockImplementation(() => {
      });
      const posterSpy = vi.spyOn(player, 'poster').mockImplementation(() => {
      });

      // When
      pillarboxPlaylist.toggleAutoadvance(false);
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

  describe('repeat', () => {
    it('should play the same element if repeat mode is "repeat one"', () => {
      // Given
      const playSpy = vi.spyOn(player, 'play')
        .mockImplementation(() => Promise.resolve());

      // When
      pillarboxPlaylist.toggleRepeat(RepeatMode.REPEAT_ONE);
      pillarboxPlaylist.load(playlist);
      pillarboxPlaylist.handleEnded();

      // Then
      expect(pillarboxPlaylist.hasPrevious()).toBeFalsy();
      expect(pillarboxPlaylist.hasNext()).toBeTruthy();
      expect(pillarboxPlaylist.items.length).toBe(4);
      expect(pillarboxPlaylist.currentIndex).toBe(0);
      expect(pillarboxPlaylist.currentItem).toBe(playlist[0]);
      expect(playSpy).toHaveBeenCalled();
    });

    it('should play the first element if repeat is true when next is called and the current index is the last of the playlist', () => {
      // Given
      const srcSpy = vi.spyOn(player, 'src').mockImplementation(() => {
      });
      const posterSpy = vi.spyOn(player, 'poster').mockImplementation(() => {
      });

      // When
      pillarboxPlaylist.toggleRepeat(RepeatMode.REPEAT_ALL);
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

    it('should toggle repeat mode', () => {
      pillarboxPlaylist.toggleRepeat(RepeatMode.NO_REPEAT);

      pillarboxPlaylist.toggleRepeat();
      expect(pillarboxPlaylist.repeat).toBe(RepeatMode.REPEAT_ALL);
      expect(pillarboxPlaylist.isNoRepeatMode()).toBeFalsy();
      expect(pillarboxPlaylist.isRepeatAllMode()).toBeTruthy();
      expect(pillarboxPlaylist.isRepeatOneMode()).toBeFalsy();

      pillarboxPlaylist.toggleRepeat();
      expect(pillarboxPlaylist.repeat).toBe(RepeatMode.REPEAT_ONE);
      expect(pillarboxPlaylist.isNoRepeatMode()).toBeFalsy();
      expect(pillarboxPlaylist.isRepeatAllMode()).toBeFalsy();
      expect(pillarboxPlaylist.isRepeatOneMode()).toBeTruthy();

      pillarboxPlaylist.toggleRepeat();
      expect(pillarboxPlaylist.repeat).toBe(RepeatMode.NO_REPEAT);
      expect(pillarboxPlaylist.isNoRepeatMode()).toBeTruthy();
      expect(pillarboxPlaylist.isRepeatAllMode()).toBeFalsy();
      expect(pillarboxPlaylist.isRepeatOneMode()).toBeFalsy();
    });
  });

  describe('shuffle', () => {
    it('should randomize the order of playlist items', () => {
      // Given
      vi.spyOn(player, 'src').mockImplementation(() => {
      });
      vi.spyOn(player, 'poster').mockImplementation(() => {
      });

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
      vi.spyOn(player, 'src').mockImplementation(() => {
      });
      vi.spyOn(player, 'poster').mockImplementation(() => {
      });
      const items = [
        {
          sources: [{
            src: 'fifth-source',
            type: 'test'
          }],
          poster: 'fifth-poster'
        },
        {
          sources: [{
            src: 'sixth-source',
            type: 'test'
          }],
          poster: 'sixth-poster'
        }
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
      vi.spyOn(player, 'src').mockImplementation(() => {
      });
      vi.spyOn(player, 'poster').mockImplementation(() => {
      });

      const items = [
        {
          sources: [{
            src: 'fifth-source',
            type: 'test'
          }],
          poster: 'fifth-poster'
        },
        {
          sources: [{
            src: 'sixth-source',
            type: 'test'
          }],
          poster: 'sixth-poster'
        }
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
      vi.spyOn(player, 'src').mockImplementation(() => {
      });
      vi.spyOn(player, 'poster').mockImplementation(() => {
      });

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
      vi.spyOn(player, 'src').mockImplementation(() => {
      });
      vi.spyOn(player, 'poster').mockImplementation(() => {
      });
      const items = [
        {
          sources: [{
            src: 'fifth-source',
            type: 'test'
          }],
          poster: 'fifth-poster'
        },
        {
          sources: [{
            src: 'sixth-source',
            type: 'test'
          }],
          poster: 'sixth-poster'
        }
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
      vi.spyOn(player, 'src').mockImplementation(() => {
      });
      vi.spyOn(player, 'poster').mockImplementation(() => {
      });

      // When
      pillarboxPlaylist.load(playlist);
      pillarboxPlaylist.splice(0, 1);

      // Then
      expect(pillarboxPlaylist.items.length).toBe(3);
      expect(pillarboxPlaylist.currentIndex).toBe(-1);
      expect(pillarboxPlaylist.currentItem).toBeUndefined();
    });

    it('should lose track of current item when deleted even when items are added', () => {
      // Given
      vi.spyOn(player, 'src').mockImplementation(() => {
      });
      vi.spyOn(player, 'poster').mockImplementation(() => {
      });
      const items = [
        {
          sources: [{
            src: 'fifth-source',
            type: 'test'
          }],
          poster: 'fifth-poster'
        },
        {
          sources: [{
            src: 'sixth-source',
            type: 'test'
          }],
          poster: 'sixth-poster'
        }
      ];

      // When
      pillarboxPlaylist.load(playlist);
      pillarboxPlaylist.splice(0, 1, items);

      // Then
      expect(pillarboxPlaylist.items.length).toBe(4);
      expect(pillarboxPlaylist.currentIndex).toBe(-1);
      expect(pillarboxPlaylist.currentItem).toBeUndefined();
    });
  });

  describe('reverse', () => {
    it('should reverse the order of items and update currentIndex correctly', () => {
      // Given
      pillarboxPlaylist.load(playlist);
      pillarboxPlaylist.select(1);

      // When
      pillarboxPlaylist.reverse();

      // Then
      expect(pillarboxPlaylist.currentIndex).toBe(2);
      expect(pillarboxPlaylist.currentItem).toBe(playlist[1]);
    });

    it('should reverse an empty playlist without errors', () => {
      // Given
      pillarboxPlaylist.load([]);

      // When
      pillarboxPlaylist.reverse();

      // Then
      expect(pillarboxPlaylist.items_.length).toBe(0);
      expect(pillarboxPlaylist.currentIndex).toBe(-1);
      expect(pillarboxPlaylist.currentItem).toBeUndefined();
    });

    it('should reverse a single-item playlist without changing the index', () => {
      // Given
      const items = [{
        sources: [{
          src: 'first-source',
          type: 'test'
        }],
        poster: 'first-poster',
        data: {
          title: 'first-source',
          duration: 120
        }
      }];

      pillarboxPlaylist.load(items);

      // When
      pillarboxPlaylist.reverse();

      // Then
      expect(pillarboxPlaylist.currentIndex).toBe(0);
      expect(pillarboxPlaylist.currentItem).toBe(items[0]);
    });
  });

  describe('sort', () => {
    it('should sort items by duration and update currentIndex correctly', () => {
      // Given
      pillarboxPlaylist.load(playlist);
      pillarboxPlaylist.select(2);

      // When
      pillarboxPlaylist.sort((a, b) => a.data.duration - b.data.duration);

      // Then
      const durations = pillarboxPlaylist.items_.map(item => item.data.duration);

      for (let i = 0; i < durations.length - 1; i++) {
        expect(durations[i]).toBeLessThanOrEqual(durations[i + 1]);
      }
      expect(pillarboxPlaylist.currentIndex).toBe(0);
      expect(pillarboxPlaylist.currentItem).toBe(playlist[2]);
    });

    it('should handle sorting an empty playlist without errors', () => {
      // Given
      pillarboxPlaylist.load([]);

      // When
      pillarboxPlaylist.sort((a, b) => a.data.duration - b.data.duration);

      // Then
      expect(pillarboxPlaylist.items_.length).toBe(0);
      expect(pillarboxPlaylist.currentIndex).toBe(-1);
    });

    it('should sort a single-item playlist without changing the index', () => {
      // Given
      const items = [{
        sources: [{
          src: 'first-source',
          type: 'test'
        }],
        poster: 'first-poster',
        data: {
          title: 'first-source',
          duration: 120
        }
      }];

      pillarboxPlaylist.load(items);

      // When
      pillarboxPlaylist.sort((a, b) => a.data.duration - b.data.duration);

      // Then
      expect(pillarboxPlaylist.currentIndex).toBe(0);
      expect(pillarboxPlaylist.currentItem).toBe(items[0]);
    });
  });

  describe('clear', () => {
    it('should clear all the items of the playlist', () => {
      // Given
      vi.spyOn(player, 'src').mockImplementation(() => {
      });
      vi.spyOn(player, 'poster').mockImplementation(() => {
      });

      // When
      pillarboxPlaylist.load(playlist);
      pillarboxPlaylist.clear();

      // Then
      expect(pillarboxPlaylist.items.length).toBe(0);
      expect(pillarboxPlaylist.currentIndex).toBe(-1);
      expect(pillarboxPlaylist.currentItem).toBeUndefined();
    });
  });

  describe('startTime', () => {
    it('should seek to the item startTime on loadeddata', () => {
      // Given
      const currentTimeSpy = vi.spyOn(player, 'currentTime').mockImplementation(() => {
      });
      const srcSpy = vi.spyOn(player, 'src').mockImplementation(() => {
      });
      const posterSpy = vi.spyOn(player, 'poster').mockImplementation(() => {
      });

      // When
      pillarboxPlaylist.load(playlist);
      pillarboxPlaylist.select(3);
      pillarboxPlaylist.handleLoadedData();

      // Then
      expect(pillarboxPlaylist.currentItem).toBe(playlist[3]);
      expect(srcSpy).toHaveBeenLastCalledWith(playlist[3].sources);
      expect(posterSpy).toHaveBeenLastCalledWith(playlist[3].poster);
      expect(currentTimeSpy).toHaveBeenLastCalledWith(playlist[3].startTime);
    });

    it('should not seek if no startTime is defined on the current item', () => {
      // Given
      const currentTimeSpy = vi.spyOn(player, 'currentTime').mockImplementation(() => {
      });
      const srcSpy = vi.spyOn(player, 'src').mockImplementation(() => {
      });
      const posterSpy = vi.spyOn(player, 'poster').mockImplementation(() => {
      });

      // When
      pillarboxPlaylist.load(playlist);
      pillarboxPlaylist.select(2);
      pillarboxPlaylist.handleLoadedData();

      // Then
      expect(pillarboxPlaylist.currentItem).toBe(playlist[2]);
      expect(srcSpy).toHaveBeenLastCalledWith(playlist[2].sources);
      expect(posterSpy).toHaveBeenLastCalledWith(playlist[2].poster);
      expect(currentTimeSpy).not.toHaveBeenCalled();
    });
  });
});
