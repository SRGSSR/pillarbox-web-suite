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
    const modal = player.addChild('ShareModal');

    modal.open();
    document.body.dispatchEvent(new Event('pointerdown', {
      bubbles: true
    }));

    expect(modal.opened()).toBe(false);
  });

  it('should not close when clicking inside the modal', () => {
    const modal = player.addChild('ShareModal');

    modal.open();
    modal.el().dispatchEvent(new Event('pointerdown', {
      bubbles: true
    }));

    expect(modal.opened()).toBe(true);
  });

  it('should treat clicks on the share toggle as outside the modal', () => {
    const modal = player.addChild('ShareModal');
    const toggle = player.getChild('ShareToggle');

    modal.open();
    modal.handleOutsideClick({ target: toggle.el() });

    expect(modal.opened()).toBe(false);
  });

  it('should close from the close button', () => {
    const modal = player.addChild('ShareModal');

    modal.open();
    modal.el().querySelector('.vjs-close-button').click();

    expect(modal.opened()).toBe(false);
  });

  it('should render configured button children', () => {
    const modal = player.addChild('ShareModal', {
      shareButtonCollection: {
        xShareButton: false,
        linkedinShareButton: false,
        whatsappShareButton: false,
        emailShareButton: false,
        facebookShareButton: { label: 'facebook' },
        copyLinkShareButton: { label: 'Copier le lien' },
        embedShareButton: { label: 'Embed' }
      }
    });

    modal.open();

    expect(modal.el().querySelector('.vjs-share-button-collection')).not.toBeNull();
    expect(modal.el().querySelector('.vjs-share-button-facebook')).not.toBeNull();
    expect(modal.el().querySelector('.vjs-share-button-copy')).not.toBeNull();
    expect(modal.el().querySelector('.vjs-share-button-embed')).not.toBeNull();
    expect(modal.el().querySelector('.vjs-share-button-x')).toBeNull();
    expect(modal.el().querySelector('.vjs-share-button-linkedin')).toBeNull();
    expect(modal.el().querySelector('.vjs-share-button-whatsapp')).toBeNull();
    expect(modal.el().querySelector('.vjs-share-button-email')).toBeNull();
    expect(modal.el().textContent).toContain('facebook');
  });

  it('should let configured platform builders replace default share URLs', () => {
    const share = vi.fn();
    const modal = player.addChild('ShareModal', {
      shareUrlOptions: {
        url: 'https://www.example.com/watch/video-14683290'
      },
      shareButtonCollection: {
        facebookShareButton: {
          buildUrl: url => `https://example.com/share?u=${encodeURIComponent(url)}`
        },
        xShareButton: false,
        linkedinShareButton: false,
        whatsappShareButton: false,
        emailShareButton: false,
        copyLinkShareButton: false,
        embedShareButton: false
      }
    });

    player.on('share', share);
    modal.open();
    // Prevent jsdom from trying to navigate when the link is clicked.
    modal.el().addEventListener('click', event => event.preventDefault());
    const link = modal.el().querySelector('.vjs-share-button-facebook');

    expect(link.href).toBe(
      'https://example.com/share?u=https%3A%2F%2Fwww.example.com%2Fwatch%2Fvideo-14683290'
    );
    expect(link.target).toBe('_blank');
    expect(link.rel).toBe('noopener noreferrer');

    link.click();

    expect(share).toHaveBeenCalledTimes(1);
    expect(modal.opened()).toBe(false);
  });

  it('should update platform URLs when the selected URL option changes', () => {
    const modal = player.addChild('ShareModal', {
      shareUrlOptions: {
        includeCurrentTime: true,
        url: 'https://www.example.com/watch/video-14683290'
      },
      shareButtonCollection: {
        shareText: 'Regarde ca',
        facebookShareButton: false,
        linkedinShareButton: false,
        whatsappShareButton: false,
        emailShareButton: false,
        copyLinkShareButton: false,
        embedShareButton: false
      }
    });

    vi.spyOn(player, 'currentTime').mockReturnValue(83);
    modal.open();
    const link = modal.el().querySelector('.vjs-share-button-x');

    expect(link.href).toContain('startTime%3D83');

    const episodeOption = modal.el().querySelector(
      '#' + modal.getChild('ShareUrlOptions').id() + '_episode'
    );

    episodeOption.checked = true;
    episodeOption.dispatchEvent(new Event('change', { bubbles: true }));

    expect(link.href).toBe(
      'https://twitter.com/intent/tweet?url=https%3A%2F%2Fwww.example.com%2Fwatch%2Fvideo-14683290&text=Regarde%20ca'
    );
  });

  it('should read the share text from the button options at runtime', () => {
    const modal = player.addChild('ShareModal', {
      shareUrlOptions: {
        url: 'https://www.rts.ch/play/tv/video/14683290'
      },
      shareButtonCollection: {
        shareText: 'From the collection',
        xShareButton: { shareText: () => 'From the button' },
        facebookShareButton: false,
        linkedinShareButton: false,
        emailShareButton: false,
        copyLinkShareButton: false,
        embedShareButton: false
      }
    });

    modal.open();
    const collection = modal.getChild('ShareButtonCollection');
    const xLink = modal.el().querySelector('.vjs-share-button-x');
    const whatsappLink = modal.el().querySelector('.vjs-share-button-whatsapp');

    expect(xLink.href).toContain('text=From%20the%20button');
    expect(whatsappLink.href).toContain('From%20the%20collection');

    collection.options({ shareText: 'Updated' });
    collection.getChild('WhatsappShareButton').updateHref();

    expect(whatsappLink.href).toContain('text=Updated');
  });

  it('should copy the generated share URL and close', () => {
    const writeText = vi.fn();
    const modal = player.addChild('ShareModal', {
      shareUrlOptions: {
        url: 'https://www.example.com/watch/video-14683290'
      },
      shareButtonCollection: {
        facebookShareButton: false,
        xShareButton: false,
        linkedinShareButton: false,
        whatsappShareButton: false,
        emailShareButton: false,
        embedShareButton: false
      }
    });

    vi.stubGlobal('navigator', {
      clipboard: {
        writeText
      }
    });

    modal.open();
    modal.el().querySelector('.vjs-share-button-copy').click();

    expect(writeText).toHaveBeenCalledWith(
      'https://www.example.com/watch/video-14683290'
    );
    expect(modal.opened()).toBe(false);
  });

  it('should generate share URLs from a configured URL callback', () => {
    const writeText = vi.fn();
    const modal = player.addChild('ShareModal', {
      shareUrlOptions: {
        url: (currentPlayer, component, context) =>
          `https://www.example.com/watch/${context.currentSource.src}`
      },
      shareButtonCollection: {
        facebookShareButton: false,
        xShareButton: false,
        linkedinShareButton: false,
        whatsappShareButton: false,
        emailShareButton: false,
        embedShareButton: false
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
    modal.el().querySelector('.vjs-share-button-copy').click();

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
        facebookShareButton: false,
        xShareButton: false,
        linkedinShareButton: false,
        whatsappShareButton: false,
        emailShareButton: false,
        embedShareButton: false
      }
    });

    modal.open();
    modal.el().querySelector('.vjs-share-button-copy').click();

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
        facebookShareButton: false,
        xShareButton: false,
        linkedinShareButton: false,
        whatsappShareButton: false,
        emailShareButton: false,
        embedShareButton: false
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
    modal.el().querySelector('.vjs-share-button-copy').click();

    expect(writeText).toHaveBeenCalledWith(window.location.href);
  });

  it('should build the embed code from a callback', () => {
    const buildEmbedCode = vi.fn(url => `${url}?embed=true`);
    const writeText = vi.fn();
    const modal = player.addChild('ShareModal', {
      shareButtonCollection: {
        facebookShareButton: false,
        xShareButton: false,
        linkedinShareButton: false,
        whatsappShareButton: false,
        emailShareButton: false,
        copyLinkShareButton: false,
        embedShareButton: { buildEmbedCode }
      }
    });

    vi.stubGlobal('navigator', {
      clipboard: {
        writeText
      }
    });
    modal.open();
    modal.el().querySelector('.vjs-share-button-embed').click();

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
