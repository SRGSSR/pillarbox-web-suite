import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import pillarbox from '@srgssr/pillarbox-web';
import '../src/pillarbox-playlist.js';
import PillarboxPlaylistUi from '../src/pillarbox-playlist-ui.js';
import { RepeatMode } from '../src/pillarbox-playlist.js';


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
    data: {
      title: 'fourth-source',
      duration: 210
    }
  }
];

window.HTMLMediaElement.prototype.load = () => {
};

describe('PillarboxPlaylist', () => {
  let videoElement, player;

  describe('Component initialisation', () => {
    const controlBarChildIndex = (childName) => {
      const children = player.controlBar.children();

      return children.findIndex(child => child.name() === childName);
    };

    it('should be registered and attached to the player', () => {
      player = pillarbox(videoElement, {
        plugins: {
          pillarboxPlaylist: true,
          pillarboxPlaylistUI: true
        }
      });
      expect(pillarbox.getPlugin('pillarboxPlaylistUI')).toBe(PillarboxPlaylistUi);
      expect(player.pillarboxPlaylistUI).toBeDefined();
      expect(PillarboxPlaylistUi.VERSION).toBeDefined();
    });

    it('should not to initialize if the playlist plugin is not being used', async() => {
      player = pillarbox(videoElement, {
        plugins: {
          pillarboxPlaylistUI: true
        }
      });

      await new Promise((resolve) => player.ready(() => resolve()));

      expect(pillarbox.getPlugin('pillarboxPlaylistUI')).toBe(PillarboxPlaylistUi);
      expect(player.pillarboxPlaylistUI).toBeDefined();
      expect(player.controlBar.pillarboxPlaylistButton).toBeUndefined();
      expect(player.pillarboxPlaylistMenuDialog).toBeUndefined();
    });

    it('should merge user defined controlBar options', () => {
      player = pillarbox(videoElement, {
        controlBar: {
          volumePanel: false
        },
        plugins: {
          pillarboxPlaylist: true,
          pillarboxPlaylistUI: true
        }
      });

      expect(pillarbox.getPlugin('pillarboxPlaylistUI')).toBe(PillarboxPlaylistUi);
      expect(player.pillarboxPlaylistUI).toBeDefined();
      expect(player.controlBar.volumePanel).toBeUndefined();
      expect(player.controlBar.pillarboxPlaylistButton).toBeDefined();

      const fullscreenBtnIndex = controlBarChildIndex('FullscreenToggle');
      const playlistBtnIndex = controlBarChildIndex('PillarboxPlaylistButton');

      expect(playlistBtnIndex).toBe(fullscreenBtnIndex - 1);
    });

    it('should insert the playlist button at the last position if no sibling was found', () => {
      player = pillarbox(videoElement, {
        controlBar: {
          children: ['playToggle', 'volumePanel']
        },
        plugins: {
          pillarboxPlaylist: true,
          pillarboxPlaylistUI: true
        }
      });

      expect(pillarbox.getPlugin('pillarboxPlaylistUI')).toBe(PillarboxPlaylistUi);
      expect(player.pillarboxPlaylistUI).toBeDefined();
      expect(player.controlBar.pillarboxPlaylistButton).toBeDefined();

      const playlistBtnIndex = controlBarChildIndex('PillarboxPlaylistButton');

      expect(playlistBtnIndex).toBe(player.controlBar.children().length - 1);
    });

    it('should not insert the playlist button if the control bar is disabled', () => {
      player = pillarbox(videoElement, {
        controlBar: false,
        plugins: {
          pillarboxPlaylist: true,
          pillarboxPlaylistUI: true
        }
      });

      expect(pillarbox.getPlugin('pillarboxPlaylistUI')).toBe(PillarboxPlaylistUi);
      expect(player.pillarboxPlaylistUI).toBeDefined();
      expect(player.controlBar).toBeUndefined();
    });
  });

  describe('User interface', () => {
    let pillarboxPlaylist, dialog, controls, items, button;

    beforeEach(async() => {
      player = pillarbox(videoElement, {
        plugins: {
          pillarboxPlaylist: true,
          pillarboxPlaylistUI: true
        }
      });

      pillarboxPlaylist = player.pillarboxPlaylist();

      vi.spyOn(player, 'src').mockImplementation(() => {
      });
      vi.spyOn(player, 'poster').mockImplementation(() => {
      });
      pillarboxPlaylist.load(playlist);

      await new Promise((resolve) => player.ready(() => resolve()));

      button = player.controlBar.pillarboxPlaylistButton;
      dialog = player.pillarboxPlaylistMenuDialog;
      controls = dialog.getChild('PillarboxPlaylistControls');
      items = dialog.getChild('PillarboxPlaylistMenuItemsList').children()
        .filter(item => item.name() === 'PillarboxPlaylistMenuItem');
    });

    it('should modal should display the button and all the items in the playlist', () => {
      // Then
      expect(button.hasClass('vjs-hidden')).toBeFalsy();
      expect(items.length).toBe(4);
      expect(items[pillarboxPlaylist.currentIndex].hasClass('vjs-card-selected')).toBeTruthy();
      items.filter((item, index) => index !== pillarboxPlaylist.currentIndex)
        .forEach((item) => expect(item.hasClass('vjs-card-selected')).toBeFalsy());
      expect(dialog.hasClass('vjs-hidden')).toBeTruthy();
    });

    it('should open the playlist dialog', () => {
      // When
      button.handleClick();

      // Then
      expect(dialog.hasClass('vjs-hidden')).toBeFalsy();
    });

    it('should hide the button when the playlist is empty', () => {
      // When
      pillarboxPlaylist.clear();

      // Then
      expect(button.hasClass('vjs-hidden')).toBeTruthy();
    });

    it('should select an item when clicked', () => {
      // Given
      pillarboxPlaylist.select(0);

      // When
      items[2].handleClick();

      // Then
      expect(pillarboxPlaylist.currentIndex).toBe(2);
      expect(items[pillarboxPlaylist.currentIndex].hasClass('vjs-card-selected')).toBeTruthy();
      items.filter((item, index) => index !== pillarboxPlaylist.currentIndex)
        .forEach((item) => expect(item.hasClass('vjs-card-selected')).toBeFalsy());
    });

    it('should toggle repeat mode through the dialog controls', () => {
      pillarboxPlaylist.toggleRepeat(RepeatMode.NO_REPEAT);

      controls.getChild('PillarboxPlaylistRepeatButton').handleClick();
      expect(pillarboxPlaylist.repeat).toBe(RepeatMode.REPEAT_ALL);
      expect(pillarboxPlaylist.isNoRepeatMode()).toBeFalsy();
      expect(pillarboxPlaylist.isRepeatAllMode()).toBeTruthy();
      expect(pillarboxPlaylist.isRepeatOneMode()).toBeFalsy();

      controls.getChild('PillarboxPlaylistRepeatButton').handleClick();
      expect(pillarboxPlaylist.repeat).toBe(RepeatMode.REPEAT_ONE);
      expect(pillarboxPlaylist.isNoRepeatMode()).toBeFalsy();
      expect(pillarboxPlaylist.isRepeatAllMode()).toBeFalsy();
      expect(pillarboxPlaylist.isRepeatOneMode()).toBeTruthy();

      controls.getChild('PillarboxPlaylistRepeatButton').handleClick();
      expect(pillarboxPlaylist.repeat).toBe(RepeatMode.NO_REPEAT);
      expect(pillarboxPlaylist.isNoRepeatMode()).toBeTruthy();
      expect(pillarboxPlaylist.isRepeatAllMode()).toBeFalsy();
      expect(pillarboxPlaylist.isRepeatOneMode()).toBeFalsy();
    });

    it('should go the next item through the dialog controls', () => {
      // Given
      pillarboxPlaylist.select(0);

      // When
      controls.getChild('PillarboxPlaylistNextItemButton').handleClick();

      // Then
      expect(pillarboxPlaylist.currentIndex).toBe(1);
      expect(items[pillarboxPlaylist.currentIndex].hasClass('vjs-card-selected')).toBeTruthy();
      items.filter((item, index) => index !== pillarboxPlaylist.currentIndex)
        .forEach((item) => expect(item.hasClass('vjs-card-selected')).toBeFalsy());
    });

    it('should go the previous item through the dialog controls', () => {
      // Given
      pillarboxPlaylist.select(2);

      // When
      controls.getChild('PillarboxPlaylistPreviousItemButton').handleClick();

      // Then
      expect(pillarboxPlaylist.currentIndex).toBe(1);
      expect(items[pillarboxPlaylist.currentIndex].hasClass('vjs-card-selected')).toBeTruthy();
      items.filter((item, index) => index !== pillarboxPlaylist.currentIndex)
        .forEach((item) => expect(item.hasClass('vjs-card-selected')).toBeFalsy());
    });

    it('should shuffle the items through the dialog controls', () => {
      // When
      controls.getChild('PillarboxPlaylistShuffleButton').handleClick();

      // Then
      expect(playlist).not.toEqual(pillarboxPlaylist.item);
      expect(playlist.length).toBe(pillarboxPlaylist.items.length);
    });
  });

  beforeAll(() => {
    document.body.innerHTML = '<video id="test-video" class="video-js"></video>';
    videoElement = document.querySelector('#test-video');
  });

  afterEach(() => {
    vi.resetAllMocks();
    player.dispose();
  });

});
