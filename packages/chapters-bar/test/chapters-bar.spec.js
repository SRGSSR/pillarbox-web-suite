import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import pillarbox from '@srgssr/pillarbox-web';
import ChaptersBar from '../src/chapters-bar.js';
import { version } from '../package.json';

window.HTMLMediaElement.prototype.load = () => { };

// Mock CardLink since we are not testing its functionality here
vi.mock('@srgssr/card', () => {
  const CardLink = vi.fn().mockImplementation((player, options) => {
    const el = document.createElement('div');

    el.className = 'vjs-card-link';
    el.id = options.id;

    return {
      el: () => el,
      id: () => options.id,
      options: () => options,
      hasClass: vi.fn(),
      toggleClass: vi.fn(),
      select: vi.fn(),
      isSelected: vi.fn(),
      dispose: vi.fn(),
    };
  });


  return { CardLink };
});

describe('ChaptersBar', () => {
  let player;
  let textTrack;

  beforeEach(() => {
    const videoEl = document.createElement('video');

    document.body.appendChild(videoEl);
    player = pillarbox(videoEl);
    textTrack = {
      id: 'srgssr-chapters',
      cues: [
        { startTime: 0, endTime: 10, text: '{"urn":"urn:one","title":"Chapter 1"}' },
        { startTime: 10, endTime: 20, text: '{"urn":"urn:two","title":"Chapter 2"}' },
      ],
    };
    player.textTracks = vi.fn(() => ({
      getTrackById: vi.fn().mockReturnValue(textTrack),
    }));
  });

  afterEach(() => {
    player.dispose();
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create a ChaptersBar instance', () => {
      const chaptersBar = new ChaptersBar(player, { chapterOptions: {} });

      expect(chaptersBar).toBeInstanceOf(ChaptersBar);
    });
  });

  describe('chapters', () => {
    it('should return chapters from the text track', () => {
      const chaptersBar = new ChaptersBar(player, { chapterOptions: {} });
      const chapters = chaptersBar.chapters();

      expect(chapters).toHaveLength(2);
      expect(chapters[0].metadata.title).toBe('Chapter 1');

      chaptersBar.dispose();
    });

    it('should return an empty array if no chapters track is found', () => {
      const chaptersBarComponent = new ChaptersBar(player, { chapterOptions: {} });

      textTrack = undefined;

      expect(chaptersBarComponent.chapters()).toEqual([]);
    });

    it('should return an empty array if the track has no cues', () => {
      const chaptersBar = new ChaptersBar(player, { chapterOptions: {} });

      textTrack.cues = [];

      expect(chaptersBar.chapters()).toEqual([]);
    });
  });

  describe('loadeddata', () => {
    it('should add chapters and show the bar', () => {
      const chaptersBar = new ChaptersBar(player, { chapterOptions: {} });
      const addChapterSpy = vi.spyOn(chaptersBar, 'addChapter');
      const showSpy = vi.spyOn(chaptersBar, 'show');

      player.trigger('loadeddata');

      expect(addChapterSpy).toHaveBeenCalledTimes(2);
      expect(showSpy).toHaveBeenCalled();
    });

    it('should do nothing if there are no chapters', () => {
      const chaptersBar = new ChaptersBar(player, { chapterOptions: {} });

      textTrack.cues = [];
      const addChapterSpy = vi.spyOn(chaptersBar, 'addChapter');

      player.trigger('loadeddata');
      expect(addChapterSpy).not.toHaveBeenCalled();
    });
  });

  describe('onEmptied', () => {
    it('should hide the bar and clear all chapters', () => {
      const chaptersBar = new ChaptersBar(player, { chapterOptions: {} });

      player.trigger('loadeddata');
      expect(chaptersBar.children()).toHaveLength(2);

      const hideSpy = vi.spyOn(chaptersBar, 'hide');

      player.trigger('emptied');

      expect(hideSpy).toHaveBeenCalled();
      expect(chaptersBar.children()).toHaveLength(0);
      expect(chaptersBar.activeChapter).toBeUndefined();
    });
  });

  describe('onChapterChange', () => {
    it('should select the active chapter', () => {
      const chaptersBar = new ChaptersBar(player, { chapterOptions: {} });

      player.trigger('loadeddata');
      const chapterChangeEvent = { data: { text: '{"urn":"urn:two"}' } };
      const scrollToSelectedChapterSpy = vi.spyOn(chaptersBar, 'scrollToSelectedChapter');

      chaptersBar.onChapterChange(chapterChangeEvent);

      const firstChild = chaptersBar.getChildById('urn:one');
      const secondChild = chaptersBar.getChildById('urn:two');

      expect(firstChild.select).toHaveBeenCalledWith(false);
      expect(secondChild.select).toHaveBeenCalledWith(true);
      expect(chaptersBar.activeChapter).toBe(secondChild);
      expect(scrollToSelectedChapterSpy).toHaveBeenCalledWith(secondChild);
    });
  });

  describe('scrollToSelectedChapter', () => {
    it('should scroll to the selected chapter if it is selected', () => {
      const chaptersBar = new ChaptersBar(player, { chapterOptions: {} });

      player.trigger('loadeddata');

      const chapter = chaptersBar.getChildById('urn:one');

      chapter.isSelected.mockReturnValue(true);
      chaptersBar.el().scrollTo = vi.fn();
      const elScrollToSpy = vi.spyOn(chaptersBar.el(), 'scrollTo');

      chaptersBar.scrollToSelectedChapter(chapter);

      expect(elScrollToSpy).toHaveBeenCalledWith({
        top: chapter.el().offsetTop,
        behavior: 'smooth'
      });
      chaptersBar.dispose();
    });

    it('should not scroll if the chapter is not selected', () => {
      const chaptersBar = new ChaptersBar(player, { chapterOptions: {} });

      player.trigger('loadeddata');

      const chapter = chaptersBar.getChildById('urn:one');

      chapter.isSelected.mockReturnValue(false);
      chaptersBar.el().scrollTo = vi.fn();
      const elScrollToSpy = vi.spyOn(chaptersBar.el(), 'scrollTo');

      chaptersBar.scrollToSelectedChapter(chapter);

      expect(elScrollToSpy).not.toHaveBeenCalled();
      chaptersBar.dispose();
    });
  });

  describe('onChapterClick', () => {
    it('should seek the player to the chapter start time', () => {
      const chaptersBar = new ChaptersBar(player, { chapterOptions: {} });
      const clickHandler = chaptersBar.onChapterClick(420);
      const event = new Event('click');
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      player.currentTime = vi.fn();
      clickHandler([event]);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(player.currentTime).toHaveBeenCalledWith(420.1);
    });
  });

  describe('buildCSSClass', () => {
    it('should return the correct CSS class', () => {
      const chaptersBar = new ChaptersBar(player, { chapterOptions: {} });

      expect(chaptersBar.buildCSSClass()).toContain('pbw-chapters-bar');
    });
  });

  describe('VERSION', () => {
    it('should return the correct version', () => {
      expect(ChaptersBar.VERSION).toBe(version);
    });
  });
});
