import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import pillarbox from '@srgssr/pillarbox-web';
import SrgSsrTheme from '../src/srg-ssr-theme.js';

window.HTMLMediaElement.prototype.load = () => {};

/**
 * The metadata a chapter cue of a pillarbox player carries.
 *
 * @param {string} urn the urn of the chapter
 * @param {string} title the title of the chapter
 * @returns {string} the serialized metadata
 */
const chapter = (urn, title) => JSON.stringify({
  urn,
  title,
  duration: 10_000,
  vendor: 'RTS',
  mediaType: 'VIDEO'
});

const chaptersTrack = {
  id: 'srgssr-chapters',
  cues: [
    { startTime: 0, endTime: 10, text: chapter('urn:one', 'Chapter 1') },
    { startTime: 10, endTime: 20, text: chapter('urn:two', 'Chapter 2') }
  ]
};

/**
 * Fills the chapters bar the way a media exposing chapters would, and waits for
 * the bar to add its cards, which it does a while after `loadeddata`.
 *
 * @param {import('video.js/dist/types/player').default} player the player
 * @param {object|undefined} [track] the chapters text track, if any
 */
const load = async(player, track = chaptersTrack) => {
  player.textTracks().getTrackById = vi.fn().mockReturnValue(track);
  player.trigger('loadeddata');
  await vi.runAllTimersAsync();
};

/**
 * Empties the chapters bar the way changing media would.
 *
 * @param {import('video.js/dist/types/player').default} player the player
 */
const unload = async(player) => {
  player.textTracks().getTrackById = vi.fn().mockReturnValue(undefined);
  player.trigger('emptied');
  await vi.runAllTimersAsync();
};

describe('chapters', () => {
  let player;
  let panel;

  beforeEach(() => {
    vi.useFakeTimers();

    const videoEl = document.createElement('video');

    document.body.appendChild(videoEl);
    player = pillarbox(videoEl);
    player.textTracks().getTrackById = vi.fn().mockReturnValue(undefined);
    panel = player.controlBar.addChild('SrgSsrChaptersPanel', {});
  });

  afterEach(() => {
    player.dispose();
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  const expanded = () => player.hasClass('srg-ssr-chapters-expanded');

  it('should stay hidden for a media without chapters', () => {
    expect(panel.hasClass('vjs-hidden')).toBe(true);
    expect(player.hasClass('srg-ssr-chapters-available')).toBe(false);
  });

  it('should show once a media exposes chapters', async() => {
    await load(player);

    expect(panel.hasClass('vjs-hidden')).toBe(false);
    expect(player.hasClass('srg-ssr-chapters-available')).toBe(true);
  });

  it('should expand and collapse from the header', async() => {
    await load(player);

    panel.getChild('ChaptersHeader').el().click();

    expect(expanded()).toBe(true);
    expect(panel.getChild('ChaptersHeader').el().getAttribute('aria-expanded')).toBe('true');

    panel.getChild('ChaptersHeader').el().click();

    expect(expanded()).toBe(false);
    expect(panel.getChild('ChaptersHeader').el().getAttribute('aria-expanded')).toBe('false');
  });

  it('should collapse and hide once the media is gone', async() => {
    await load(player);
    panel.toggle(true);
    await unload(player);

    expect(expanded()).toBe(false);
    expect(player.hasClass('srg-ssr-chapters-available')).toBe(false);
  });

  it('should expand on hover and stay out', async() => {
    await load(player);
    panel.trigger('mouseenter');

    expect(expanded()).toBe(true);

    panel.trigger('mouseleave');

    expect(expanded()).toBe(true);
  });

  it('should never expand without chapters', () => {
    panel.toggle(true);

    expect(expanded()).toBe(false);
  });

  it('should be toggled by the control bar button', async() => {
    const button = player.controlBar.addChild('SrgSsrChaptersButton', {});

    await load(player);
    button.handleClick();

    expect(expanded()).toBe(true);

    button.handleClick();

    expect(expanded()).toBe(false);
  });

  it('should move the focus between the button and the header', async() => {
    const button = player.controlBar.addChild('SrgSsrChaptersButton', {});
    const header = panel.getChild('ChaptersHeader');

    await load(player);
    button.handleClick();

    expect(document.activeElement).toBe(header.el());

    header.handleClick();

    expect(document.activeElement).toBe(button.el());
  });

  it('should stop listening once disposed', async() => {
    const update = vi.spyOn(panel, 'update');
    const off = vi.spyOn(panel, 'off');

    await load(player);
    player.controlBar.removeChild(panel);
    panel.dispose();
    update.mockClear();
    await vi.runAllTimersAsync();

    expect(update).not.toHaveBeenCalled();
    expect(off).toHaveBeenCalledWith(['mouseenter', 'focusin'], expect.any(Function));
  });

  it('should clear the classes it set on the player once disposed', async() => {
    await load(player);
    panel.toggle(true);
    player.controlBar.removeChild(panel);
    panel.dispose();

    expect(player.hasClass('srg-ssr-chapters-available')).toBe(false);
    expect(expanded()).toBe(false);
  });

  it('should keep its header across a media change', async() => {
    await load(player);
    await unload(player);
    await load(player);

    expect(panel.children()).toEqual([panel.getChild('ChaptersHeader'), panel.getChild('ChaptersBar')]);
    expect(panel.getChild('ChaptersBar').children()).toHaveLength(2);
  });
});

// Wires a player the way a consumer of the theme does, to catch what only shows
// up once the components are built from the player options.
describe('chapters wired through the theme options', () => {
  let player;

  beforeEach(async() => {
    vi.useFakeTimers();

    const videoEl = document.createElement('video');

    videoEl.className = 'srg-ssr-theme';
    document.body.appendChild(videoEl);
    player = pillarbox(videoEl, SrgSsrTheme.options);
    await load(player);
  });

  afterEach(() => {
    player.dispose();
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('should leave chapters out once disabled in the player options', async() => {
    const videoEl = document.createElement('video');

    videoEl.className = 'srg-ssr-theme';
    document.body.appendChild(videoEl);

    const noChapters = pillarbox(videoEl, pillarbox.obj.merge(SrgSsrTheme.options, {
      controlBar: { srgSsrChaptersPanel: false, srgSsrChaptersButton: false }
    }));

    await load(noChapters);

    expect(noChapters.controlBar.getChild('SrgSsrChaptersPanel')).toBeUndefined();
    expect(noChapters.controlBar.getChild('SrgSsrChaptersButton')).toBeUndefined();
    expect(noChapters.el().querySelector('.srg-ssr-chapters')).toBeNull();
    expect(noChapters.hasClass('srg-ssr-chapters-available')).toBe(false);

    noChapters.dispose();
  });

  it('should build the panel and the button with the classes the stylesheet targets', () => {
    const panel = player.controlBar.getChild('SrgSsrChaptersPanel');

    expect(player.controlBar.getChild('SrgSsrChaptersButton').controlText()).toBe('Chapters');
    expect(player.controlBar.getChild('ChaptersButton')).toBeUndefined();
    expect(panel.el().className).toContain('srg-ssr-chapters');
    expect(panel.el().parentElement).toBe(player.controlBar.el());
    expect(panel.getChild('ChaptersHeader').controlText()).toBe('Chapters');
    expect(panel.el().querySelector('.srg-ssr-chapters-header')).not.toBeNull();
    expect(panel.el().querySelector('.pbw-chapters-bar .vjs-card')).not.toBeNull();
    expect(player.hasClass('srg-ssr-chapters-available')).toBe(true);
  });
});
