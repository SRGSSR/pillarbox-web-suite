import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import pillarbox from '@srgssr/pillarbox-web';
import PillarboxPlaylist from '../src/pillarbox-playlist.js';
import '../src/pillarbox-playlist-button.js';

const playlist = [
  {
    sources: [{ src: 'first-source', type: 'test' }],
    poster: 'first-poster',
    data: { title: 'first-source', duration: 120 }
  },
  {
    sources: [{ src: 'second-source', type: 'test' }],
    poster: 'second-poster',
    data: { title: 'second-source', duration: 150 }
  },
  {
    sources: [{ src: 'third-source', type: 'test' }],
    poster: 'third-poster',
    data: { title: 'third-source', duration: 180 }
  },
  {
    sources: [{ src: 'fourth-source', type: 'test' }],
    poster: 'fourth-poster',
    data: { title: 'fourth-source', duration: 210 }
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
      controlBar: {
        PillarboxPlaylistButton: true
      },
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
      pillarboxPlaylist.toggleRepeat(true);
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
  });

  describe('autoadvance', () => {
    it('should play next element on ended if autoadvance is enabled', () => {
      // Given
      const srcSpy = vi.spyOn(player, 'src').mockImplementation(() => {});
      const posterSpy = vi.spyOn(player, 'poster').mockImplementation(() => {});

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
      const srcSpy = vi.spyOn(player, 'src').mockImplementation(() => {});
      const posterSpy = vi.spyOn(player, 'poster').mockImplementation(() => {});

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

    it('should lose track of current item when deleted even when items are added', () => {
      // Given
      vi.spyOn(player, 'src').mockImplementation(() => {});
      vi.spyOn(player, 'poster').mockImplementation(() => {});
      const items = [
        { sources: [{ src: 'fifth-source', type: 'test' }], poster: 'fifth-poster' },
        { sources: [{ src: 'sixth-source', type: 'test' }], poster: 'sixth-poster' }
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

  describe('clear', () => {
    it('should clear all the items of the playlist', () => {
      // Given
      vi.spyOn(player, 'src').mockImplementation(() => {});
      vi.spyOn(player, 'poster').mockImplementation(() => {});

      // When
      pillarboxPlaylist.load(playlist);
      pillarboxPlaylist.clear();

      // Then
      expect(pillarboxPlaylist.items.length).toBe(0);
      expect(pillarboxPlaylist.currentIndex).toBe(-1);
      expect(pillarboxPlaylist.currentItem).toBeUndefined();
    });
  });

  describe('User interface',() => {
    let dialog, controls, items, button;

    beforeEach(async() => {
      vi.spyOn(player, 'src').mockImplementation(() => {});
      vi.spyOn(player, 'poster').mockImplementation(() => {});
      pillarboxPlaylist.load(playlist);

      await new Promise((resolve) => player.ready(() => resolve()));

      button = player.controlBar.PillarboxPlaylistButton;
      dialog = player.getChild('PlaylistMenuDialog');
      controls = dialog.getChild('PlaylistControls');
      items = dialog.getChild('PillarboxPlaylistMenuItemsList').children()
        .filter(item => item.name() === 'PillarboxPlaylistMenuItem')
        .map(item => item.getChild('PillarboxPlaylistMenuItemButton'));
    });

    it('should modal should display the button and all the items in the playlist', ()=> {
      // Then
      expect(button.hasClass('vjs-hidden')).toBeFalsy();
      expect(items.length).toBe(4);
      expect(items[pillarboxPlaylist.currentIndex].hasClass('vjs-selected')).toBeTruthy();
      items.filter((item, index) => index !== pillarboxPlaylist.currentIndex)
        .forEach((item) => expect(item.hasClass('vjs-selected')).toBeFalsy());
      expect(dialog.hasClass('vjs-hidden')).toBeTruthy();
    });

    it('should open the playlist dialog', ()=> {
      // When
      button.handleClick();

      // Then
      expect(dialog.hasClass('vjs-hidden')).toBeFalsy();
    });

    it('should hide the button when the playlist is empty', ()=> {
      // When
      pillarboxPlaylist.clear();

      // Then
      expect(button.hasClass('vjs-hidden')).toBeTruthy();
    });


    it('should select an item when clicked', ()=> {
      // Given
      pillarboxPlaylist.select(0);

      // When
      items[2].handleClick();

      // Then
      expect(pillarboxPlaylist.currentIndex).toBe(2);
      expect(items[pillarboxPlaylist.currentIndex].hasClass('vjs-selected')).toBeTruthy();
      items.filter((item, index) => index !== pillarboxPlaylist.currentIndex)
        .forEach((item) => expect(item.hasClass('vjs-selected')).toBeFalsy());
    });

    it('should toggle repeat mode through the dialog controls', ()=> {
      // When
      controls.getChild('RepeatButton').handleClick();

      // Then
      expect(pillarboxPlaylist.repeat).toBeTruthy();
    });

    it('should go the next item through the dialog controls', ()=> {
      // Given
      pillarboxPlaylist.select(0);

      // When
      controls.getChild('NextItemButton').handleClick();

      // Then
      expect(pillarboxPlaylist.currentIndex).toBe(1);
      expect(items[pillarboxPlaylist.currentIndex].hasClass('vjs-selected')).toBeTruthy();
      items.filter((item, index) => index !== pillarboxPlaylist.currentIndex)
        .forEach((item) => expect(item.hasClass('vjs-selected')).toBeFalsy());
    });

    it('should go the previous item through the dialog controls', ()=> {
      // Given
      pillarboxPlaylist.select(2);

      // When
      controls.getChild('PreviousItemButton').handleClick();

      // Then
      expect(pillarboxPlaylist.currentIndex).toBe(1);
      expect(items[pillarboxPlaylist.currentIndex].hasClass('vjs-selected')).toBeTruthy();
      items.filter((item, index) => index !== pillarboxPlaylist.currentIndex)
        .forEach((item) => expect(item.hasClass('vjs-selected')).toBeFalsy());
    });

    it('should shuffle the items through the dialog controls', ()=> {
      // When
      controls.getChild('ShuffleButton').handleClick();

      // Then
      expect(playlist).not.toEqual(pillarboxPlaylist.item);
      expect(playlist.length).toBe(pillarboxPlaylist.items.length);
    });
  });
});
