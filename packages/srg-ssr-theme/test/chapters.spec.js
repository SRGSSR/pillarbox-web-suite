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

  it('should expand on hover of the chapters bar and stay out', async() => {
    const bar = panel.getChild('ChaptersBar');

    await load(player);
    bar.trigger('mouseenter');

    expect(expanded()).toBe(true);

    bar.trigger('mouseleave');

    expect(expanded()).toBe(true);
  });

  it('should not expand on hover of the header', async() => {
    await load(player);
    panel.trigger('mouseenter');
    panel.getChild('ChaptersHeader').trigger('mouseenter');

    expect(expanded()).toBe(false);
  });

  it('should expand once the keyboard reaches the panel', async() => {
    await load(player);
    panel.trigger('focusin');

    expect(expanded()).toBe(true);
  });

  it('should fold back once the user becomes inactive', async() => {
    await load(player);
    panel.toggle(true);
    player.trigger('userinactive');

    expect(expanded()).toBe(false);
  });

  it('should stay expanded on user inactivity once the folding is disabled', async() => {
    player.controlBar.removeChild(panel);
    panel.dispose();
    panel = player.controlBar.addChild('SrgSsrChaptersPanel', { foldOnUserInactive: false });

    await load(player);
    panel.toggle(true);
    player.trigger('userinactive');

    expect(expanded()).toBe(true);
  });

  it('should follow the folding option once changed', async() => {
    await load(player);
    panel.options({ foldOnUserInactive: false });
    panel.toggle(true);
    player.trigger('userinactive');

    expect(expanded()).toBe(true);

    panel.options({ foldOnUserInactive: true });
    player.trigger('userinactive');

    expect(expanded()).toBe(false);
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
    const barOff = vi.spyOn(panel.getChild('ChaptersBar'), 'off');

    await load(player);
    player.controlBar.removeChild(panel);
    panel.dispose();
    update.mockClear();
    await vi.runAllTimersAsync();

    expect(update).not.toHaveBeenCalled();
    expect(off).toHaveBeenCalledWith('focusin', expect.any(Function));
    expect(barOff).toHaveBeenCalledWith('mouseenter', expect.any(Function));

    await load(player);
    player.addClass('srg-ssr-chapters-expanded');
    player.trigger('userinactive');

    expect(expanded()).toBe(true);
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

describe('chapters bar', () => {
  let player;
  let bar;

  /**
   * Lays the cards out on a row the way the stylesheet does, as jsdom has no
   * layout, with the first card past the padding of the bar.
   */
  const layOut = () => {
    bar.children().forEach((card, index) => {
      Object.defineProperty(card.el(), 'offsetLeft', { value: 16 + index * 200 });
    });
  };

  /**
   * Selects a chapter the way a pillarbox player does during playback.
   *
   * @param {string} urn the urn of the chapter
   */
  const selectChapter = (urn) => {
    player.trigger({
      type: 'srgssr/chapter',
      data: chaptersTrack.cues.find(({ text }) => JSON.parse(text).urn === urn)
    });
  };

  beforeEach(async() => {
    vi.useFakeTimers();

    const videoEl = document.createElement('video');

    document.body.appendChild(videoEl);
    player = pillarbox(videoEl);
    player.textTracks().getTrackById = vi.fn().mockReturnValue(undefined);
    bar = player.controlBar.addChild('SrgSsrChaptersPanel', {}).getChild('ChaptersBar');
    bar.el().scrollTo = vi.fn();
    await load(player);
    layOut();
  });

  afterEach(() => {
    player.dispose();
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('should be the horizontal bar of the theme', () => {
    expect(bar.name()).toBe('ChaptersBar');
    expect(bar.el().className).toContain('pbw-chapters-bar');
  });

  it('should scroll horizontally to the chapter playback selects', () => {
    selectChapter('urn:two');

    expect(bar.el().scrollTo).toHaveBeenCalledWith({ left: 200, behavior: 'smooth' });
    expect(bar.el().scrollTo).not.toHaveBeenCalledWith(expect.objectContaining({ top: expect.anything() }));
  });

  it('should bring the active chapter into view once the user is active', () => {
    selectChapter('urn:two');
    player.trigger('useractive');

    expect(bar.el().scrollLeft).toBe(200);
  });

  it('should bring the active chapter into view once the panel expands', () => {
    const panel = player.controlBar.getChild('SrgSsrChaptersPanel');

    selectChapter('urn:two');
    bar.el().scrollLeft = 0;
    panel.toggle(true);

    expect(bar.el().scrollLeft).toBe(200);

    bar.el().scrollLeft = 0;
    panel.toggle(true);

    expect(bar.el().scrollLeft).toBe(0);
  });

  it('should leave the scroll position alone without an active chapter', () => {
    player.trigger('useractive');
    bar.show();

    expect(bar.el().scrollLeft).toBe(0);
  });

  it('should reset the scroll position once hidden', () => {
    bar.el().scrollLeft = 200;
    bar.hide();

    expect(bar.el().scrollLeft).toBe(0);
  });

  describe('wheel', () => {
    /**
     * Gives the bar the sizes of a row of cards, as jsdom has no layout.
     *
     * @param {number} scrollWidth the width of the row of cards
     * @param {number} [clientWidth=400] the width of the bar
     */
    const size = (scrollWidth, clientWidth = 400) => {
      Object.defineProperty(bar.el(), 'scrollWidth', { value: scrollWidth, configurable: true });
      Object.defineProperty(bar.el(), 'clientWidth', { value: clientWidth, configurable: true });
    };

    /**
     * Turns the wheel over an element the way a browser does.
     *
     * @param {WheelEventInit} init the properties of the wheel event
     * @param {HTMLElement} [el] the element under the pointer
     * @returns {WheelEvent} the dispatched event
     */
    const wheel = (init, el = bar.el()) => {
      const event = new WheelEvent('wheel', { bubbles: true, cancelable: true, ...init });

      el.dispatchEvent(event);

      return event;
    };

    beforeEach(() => size(1000));

    it('should scroll horizontally with a vertical wheel', () => {
      const forward = wheel({ deltaY: 100 });

      expect(bar.el().scrollLeft).toBe(100);
      expect(forward.defaultPrevented).toBe(true);

      const backward = wheel({ deltaY: -40 });

      expect(bar.el().scrollLeft).toBe(60);
      expect(backward.defaultPrevented).toBe(true);
    });

    it('should scroll with a wheel turned over a card', () => {
      wheel({ deltaY: 100 }, bar.children()[0].el());

      expect(bar.el().scrollLeft).toBe(100);
    });

    it('should scroll by lines and pages with a wheel reporting them', () => {
      wheel({ deltaY: 3, deltaMode: WheelEvent.DOM_DELTA_LINE });

      expect(bar.el().scrollLeft).toBe(120);

      wheel({ deltaY: 1, deltaMode: WheelEvent.DOM_DELTA_PAGE });

      expect(bar.el().scrollLeft).toBe(520);
    });

    it.each([
      ['a horizontal wheel', { deltaX: 100 }],
      ['a mostly horizontal wheel', { deltaX: 100, deltaY: 30 }],
      ['a wheel with shift', { deltaY: 100, shiftKey: true }],
      ['a wheel with ctrl', { deltaY: 100, ctrlKey: true }]
    ])('should leave %s to the browser', (_, init) => {
      const event = wheel(init);

      expect(bar.el().scrollLeft).toBe(0);
      expect(event.defaultPrevented).toBe(false);
    });

    it('should leave the wheel to the page once the cards fit in the bar', () => {
      size(400);

      const event = wheel({ deltaY: 100 });

      expect(bar.el().scrollLeft).toBe(0);
      expect(event.defaultPrevented).toBe(false);
    });

    it('should stop listening to the wheel once disposed', () => {
      const el = bar.el();
      const off = vi.spyOn(bar, 'off');
      const panel = player.controlBar.getChild('SrgSsrChaptersPanel');

      player.controlBar.removeChild(panel);
      panel.dispose();

      expect(off).toHaveBeenCalledWith('wheel', expect.any(Function));

      const event = wheel({ deltaY: 100 }, el);

      expect(el.scrollLeft).toBe(0);
      expect(event.defaultPrevented).toBe(false);
    });
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

  it('should fold the panel back once the user becomes inactive', () => {
    player.controlBar.getChild('SrgSsrChaptersPanel').toggle(true);
    player.trigger('userinactive');

    expect(player.hasClass('srg-ssr-chapters-expanded')).toBe(false);
  });

  it('should keep the panel expanded on user inactivity once disabled in the player options', async() => {
    const videoEl = document.createElement('video');

    videoEl.className = 'srg-ssr-theme';
    document.body.appendChild(videoEl);

    const unfolding = pillarbox(videoEl, pillarbox.obj.merge(SrgSsrTheme.options, {
      controlBar: { srgSsrChaptersPanel: { foldOnUserInactive: false } }
    }));

    await load(unfolding);
    unfolding.controlBar.getChild('SrgSsrChaptersPanel').toggle(true);
    unfolding.trigger('userinactive');

    expect(unfolding.hasClass('srg-ssr-chapters-expanded')).toBe(true);

    unfolding.dispose();
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
