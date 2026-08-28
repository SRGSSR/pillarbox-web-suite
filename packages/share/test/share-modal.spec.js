import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import videojs from 'video.js';
import '../src/share-modal.js';
import '../src/share-toggle.js';

window.HTMLMediaElement.prototype.load = () => {};

describe('ShareModal', () => {
  let player, videoElement;

  beforeAll(() => {
    document.body.innerHTML = '<video id="modal-video" class="video-js"></video>';
    videoElement = document.querySelector('#modal-video');
  });

  beforeEach(() => {
    player = videojs(videoElement);
    player.addChild('ShareToggle', {
      icon: '<svg xmlns="http://www.w3.org/2000/svg"></svg>'
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    player.dispose();
  });

  it('should close on outside click', () => {
    player.addChild('ShareModal');
    const toggle = player.getChild('ShareToggle');

    toggle.handleClick();
    document.body.dispatchEvent(new Event('pointerdown', {
      bubbles: true
    }));

    expect(player.getChild('ShareModal').isOpen()).toBe(false);
    expect(toggle.hasClass('vjs-hidden')).toBe(false);
  });

  it('should not close when clicking inside the modal', () => {
    player.addChild('ShareModal');
    const toggle = player.getChild('ShareToggle');
    const modal = player.getChild('ShareModal');

    toggle.handleClick();
    modal.el().dispatchEvent(new Event('pointerdown', {
      bubbles: true
    }));

    expect(modal.isOpen()).toBe(true);
  });

  it('should treat clicks on the share toggle as outside the modal', () => {
    player.addChild('ShareModal');
    const toggle = player.getChild('ShareToggle');
    const modal = player.getChild('ShareModal');

    toggle.handleClick();
    modal.handleOutsideClick({ target: toggle.el() });

    expect(modal.isOpen()).toBe(false);
  });

  it('should close from the close button', () => {
    player.addChild('ShareModal');
    const toggle = player.getChild('ShareToggle');

    toggle.handleClick();
    const closeButton = player.getChild('ShareModal').el().querySelector('.vjs-close-button');

    closeButton.click();

    expect(player.getChild('ShareModal').isOpen()).toBe(false);
    expect(toggle.hasClass('vjs-hidden')).toBe(false);
  });

  it('should render configured button children', () => {
    const modal = player.addChild('ShareModal', {
      shareButtonCollection: {
        XShareButton: false,
        LinkedinShareButton: false,
        WhatsappShareButton: false,
        EmailShareButton: false,
        FacebookShareButton: { label: 'facebook' },
        CopyLinkShareButton: { label: 'Copier le lien' },
        EmbedShareButton: { label: 'Embed' }
      }
    });

    modal.open();

    expect(modal.el().querySelector('.vjs-share-button-collection')).not.toBeNull();
    expect(modal.el().querySelector('.vjs-share-button--facebook')).not.toBeNull();
    expect(modal.el().querySelector('.vjs-share-button--copy')).not.toBeNull();
    expect(modal.el().querySelector('.vjs-share-button--embed')).not.toBeNull();
    expect(modal.el().querySelector('.vjs-share-button--x')).toBeNull();
    expect(modal.el().querySelector('.vjs-share-button--linkedin')).toBeNull();
    expect(modal.el().querySelector('.vjs-share-button--whatsapp')).toBeNull();
    expect(modal.el().querySelector('.vjs-share-button--email')).toBeNull();
    expect(modal.el().textContent).toContain('facebook');
  });

  it('should let configured platform builders replace default share URLs', () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(undefined);
    const modal = player.addChild('ShareModal', {
      shareUrlOptions: {
        url: 'https://www.example.com/watch/video-14683290'
      },
      shareButtonCollection: {
        FacebookShareButton: {
          buildUrl: url => `https://example.com/share?u=${encodeURIComponent(url)}`
        },
        XShareButton: false,
        LinkedinShareButton: false,
        WhatsappShareButton: false,
        EmailShareButton: false,
        CopyLinkShareButton: false,
        EmbedShareButton: false
      }
    });

    modal.open();
    modal.el().querySelector('.vjs-share-button--facebook').click();

    expect(open).toHaveBeenCalledWith(
      'https://example.com/share?u=https%3A%2F%2Fwww.example.com%2Fwatch%2Fvideo-14683290',
      '_blank',
      'noopener'
    );
  });

  it('should update platform URLs when the selected URL option changes', () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(undefined);
    const modal = player.addChild('ShareModal', {
      shareUrlOptions: {
        includeCurrentTime: true,
        url: 'https://www.example.com/watch/video-14683290'
      },
      shareButtonCollection: {
        shareText: 'Regarde ca',
        FacebookShareButton: false,
        LinkedinShareButton: false,
        WhatsappShareButton: false,
        EmailShareButton: false,
        CopyLinkShareButton: false,
        EmbedShareButton: false
      }
    });

    vi.spyOn(player, 'currentTime').mockReturnValue(83);
    modal.open();
    const episodeOption = modal.el().querySelector(
      '#' + modal.getChild('ShareUrlOptions').id() + '_episode'
    );

    episodeOption.checked = true;
    episodeOption.dispatchEvent(new Event('change', { bubbles: true }));
    modal.el().querySelector('.vjs-share-button--x').click();

    expect(open).toHaveBeenCalledWith(
      'https://twitter.com/intent/tweet?url=https%3A%2F%2Fwww.example.com%2Fwatch%2Fvideo-14683290&text=Regarde%20ca',
      '_blank',
      'noopener'
    );
  });

  it('should copy the generated share URL and close', () => {
    const writeText = vi.fn();
    const modal = player.addChild('ShareModal', {
      shareUrlOptions: {
        url: 'https://www.example.com/watch/video-14683290'
      },
      shareButtonCollection: {
        FacebookShareButton: false,
        XShareButton: false,
        LinkedinShareButton: false,
        WhatsappShareButton: false,
        EmailShareButton: false,
        EmbedShareButton: false
      }
    });

    vi.stubGlobal('navigator', {
      clipboard: {
        writeText
      }
    });

    modal.open();
    modal.el().querySelector('.vjs-share-button--copy').click();

    expect(writeText).toHaveBeenCalledWith(
      'https://www.example.com/watch/video-14683290'
    );
    expect(modal.isOpen()).toBe(false);
  });

  it('should generate share URLs from a configured URL callback', () => {
    const writeText = vi.fn();
    const modal = player.addChild('ShareModal', {
      shareUrlOptions: {
        url: (currentPlayer, component, context) =>
          `https://www.example.com/watch/${context.currentSource.src}`
      },
      shareButtonCollection: {
        FacebookShareButton: false,
        XShareButton: false,
        LinkedinShareButton: false,
        WhatsappShareButton: false,
        EmailShareButton: false,
        EmbedShareButton: false
      }
    });

    vi.spyOn(player, 'currentSource').mockReturnValue({
      src: 'urn:example:video:8841634'
    });
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText
      }
    });

    modal.open();
    modal.el().querySelector('.vjs-share-button--copy').click();

    expect(writeText).toHaveBeenCalledWith(
      'https://www.example.com/watch/urn:example:video:8841634'
    );
  });

  it('should expose media context to configured URL callbacks', () => {
    const buildUrl = vi.fn((currentPlayer, component, context) =>
      `https://www.example.com/media/${context.currentMedia.urn}`);
    const writeText = vi.fn();

    player.options({
      mediaComposition: {
        getMainChapter: () => ({
          id: 'main',
          title: 'Main chapter',
          urn: 'urn:example:video:main'
        }),
        getSubdivisions: () => [{
          id: 'subject',
          markIn: 10_000,
          markOut: 20_000,
          title: 'Current subject',
          urn: 'urn:example:video:subject'
        }]
      }
    });
    vi.spyOn(player, 'currentSource').mockReturnValue({
      src: 'http://example.com/video/master.m3u8',
      mediaData: {
        title: 'Source title',
        urn: 'urn:example:video:source'
      }
    });
    vi.spyOn(player, 'currentTime').mockReturnValue(12);
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText
      }
    });

    const modal = player.addChild('ShareModal', {
      shareUrlOptions: {
        url: buildUrl
      },
      shareButtonCollection: {
        FacebookShareButton: false,
        XShareButton: false,
        LinkedinShareButton: false,
        WhatsappShareButton: false,
        EmailShareButton: false,
        EmbedShareButton: false
      }
    });

    modal.open();
    modal.el().querySelector('.vjs-share-button--copy').click();

    expect(buildUrl).toHaveBeenCalledWith(
      player,
      modal.getChild('ShareUrlOptions'),
      expect.objectContaining({
        currentMedia: expect.objectContaining({
          urn: 'urn:example:video:main'
        }),
        currentSource: expect.objectContaining({
          src: 'http://example.com/video/master.m3u8'
        }),
        currentSubdivision: expect.objectContaining({
          urn: 'urn:example:video:subject'
        }),
        currentTime: 12,
        mainChapter: expect.objectContaining({
          title: 'Main chapter'
        }),
        mediaData: expect.objectContaining({
          title: 'Source title'
        }),
        subdivisions: expect.any(Array),
        title: 'Main chapter'
      })
    );
    expect(writeText).toHaveBeenCalledWith(
      'https://www.example.com/media/urn:example:video:main'
    );
  });

  it('should share the current page URL by default for URN sources', () => {
    const writeText = vi.fn();
    const modal = player.addChild('ShareModal', {
      shareButtonCollection: {
        FacebookShareButton: false,
        XShareButton: false,
        LinkedinShareButton: false,
        WhatsappShareButton: false,
        EmailShareButton: false,
        EmbedShareButton: false
      }
    });

    vi.spyOn(player, 'currentSource').mockReturnValue({
      src: 'urn:example:video:8841634'
    });
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText
      }
    });

    modal.open();
    modal.el().querySelector('.vjs-share-button--copy').click();

    expect(writeText).toHaveBeenCalledWith(window.location.href);
  });

  it('should build the embed code from a callback', () => {
    const buildEmbedCode = vi.fn(url => `${url}?embed=true`);
    const writeText = vi.fn();
    const modal = player.addChild('ShareModal', {
      shareButtonCollection: {
        FacebookShareButton: false,
        XShareButton: false,
        LinkedinShareButton: false,
        WhatsappShareButton: false,
        EmailShareButton: false,
        CopyLinkShareButton: false,
        EmbedShareButton: { buildEmbedCode }
      }
    });

    vi.stubGlobal('navigator', {
      clipboard: {
        writeText
      }
    });
    modal.open();
    modal.el().querySelector('.vjs-share-button--embed').click();

    expect(buildEmbedCode).toHaveBeenCalledWith(
      window.location.href,
      player,
      expect.anything()
    );
    expect(writeText).toHaveBeenCalledWith(
      `${window.location.href}?embed=true`
    );
  });
});
