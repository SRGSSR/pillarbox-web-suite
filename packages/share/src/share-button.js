import videojs from 'video.js';
import embedIcon from '../assets/embed.svg?raw';
import facebookIcon from '../assets/facebook.svg?raw';
import linkIcon from '../assets/link.svg?raw';
import linkedinIcon from '../assets/linkedin.svg?raw';
import mailIcon from '../assets/mail.svg?raw';
import whatsappIcon from '../assets/whatsapp.svg?raw';
import xIcon from '../assets/x.svg?raw';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/component').default}
 */
const Component = videojs.getComponent('Component');
const log = videojs.log.createLogger('share-button');

/**
 * A platform share button. It receives a generated media URL and wraps it for
 * its own platform.
 */
class ShareButton extends Component {
  /**
   * Creates one platform share button.
   *
   * @param {import('video.js/dist/types/player.js').default} player The player instance.
   * @param {Object} options The button options.
   */
  constructor(player, options = {}) {
    const shareText = options.shareText;

    super(player, videojs.obj.merge({
      target: '_blank',
      rel: 'noopener noreferrer'
    }, options));

    this.shareText_ = shareText;
    this.buildUrl_ = this.options().buildUrl;
  }

  /**
   * Creates the button wrapper.
   *
   * @returns {HTMLElement} The button wrapper.
   */
  createEl() {
    const element = super.createEl('div', {
      className: this.buildCSSClass(),
      title: this.localize(this.options().title)
    }, {
      tabindex: '0',
      role: 'button',
      'aria-disabled': 'false'
    });

    element.append(
      this.createControlText(),
      this.createLink(),
      this.createTitle()
    );
    element.addEventListener('click', event => this.handleActionClick(event));
    element.addEventListener('keydown', event => this.handleActionKeydown(event));

    return element;
  }

  /**
   * Creates the screen-reader text.
   *
   * @returns {HTMLElement} The screen-reader text.
   */
  createControlText() {
    return videojs.dom.createEl('span', {
      className: 'vjs-control-text',
      textContent: this.localize(this.options().title)
    }, {
      'aria-live': 'polite'
    });
  }

  /**
   * Creates the visual anchor.
   *
   * @returns {HTMLAnchorElement} The visual anchor.
   */
  createLink() {
    const { icon, iconClass, target, rel } = this.options();
    const attributes = {
      href: this.getHref(),
      tabindex: '-1'
    };

    if (target) attributes.target = target;
    if (rel) attributes.rel = rel;

    return videojs.dom.createEl('a', {
      className: [
        'vjs-share-button-link',
        iconClass
      ].filter(Boolean).join(' '),
      innerHTML: icon
    }, attributes);
  }

  /**
   * Creates the visible label.
   *
   * @returns {HTMLElement} The visible label.
   */
  createTitle() {
    return videojs.dom.createEl('span', {
      className: 'vjs-share-button-title',
      textContent: this.localize(this.options().label)
    });
  }

  /**
   * Receives the URL generator selected by ShareUrlOptions.
   *
   * @param {Function} generateUrl The URL generator.
   */
  setUrlGenerator(generateUrl) {
    this.generateUrl_ = generateUrl;
    this.updateHref();
  }

  /**
   * Returns the current action href.
   *
   * @returns {string} The action href.
   */
  getHref() {
    if (typeof this.generateUrl_ !== 'function') return '';

    try {
      return this.buildUrl_(
        this.generateUrl_(),
        this.shareText(),
        this.player(),
        this
      );
    } catch (error) {
      log.error('Error building the share url:', error);
    }

    return '';
  }

  /**
   * Returns the configured share text.
   *
   * @returns {string} The share text.
   */
  shareText() {
    const shareText = this.shareText_ ?? this.options().shareText;

    return typeof shareText === 'function' ?
      shareText(this.player(), this) :
      shareText ?? document.title;
  }

  /**
   * Sets the text generator shared by the collection.
   *
   * @param {string|Function} shareText The share text or generator.
   */
  setShareText(shareText) {
    this.shareText_ = shareText;
  }

  /**
   * Sets the callback called after a share action.
   *
   * @param {Function} handler The share handler.
   */
  setShareHandler(handler) {
    this.shareHandler_ = handler;
  }

  /**
   * Updates the visual anchor href.
   */
  updateHref() {
    const link = this.el()?.querySelector('.vjs-share-button-link');

    if (link) link.href = this.getHref();
  }

  /**
   * Handles click activation.
   *
   * @param {Event} event The click event.
   */
  handleActionClick(event) {
    event.preventDefault();
    event.stopPropagation();
    this.share();
  }

  /**
   * Handles keyboard activation.
   *
   * @param {KeyboardEvent} event The keyboard event.
   */
  handleActionKeydown(event) {
    if (!['Enter', ' '].includes(event.key)) return;

    event.preventDefault();
    this.share();
  }

  /**
   * Runs the share action.
   */
  share() {
    this.openShareUrl(this.getHref());
    this.notifyShare();
  }

  /**
   * Notifies listeners that a share action happened.
   */
  notifyShare() {
    this.trigger('share');
    this.parentComponent_?.trigger('share');
    this.shareHandler_?.(this);
  }

  /**
   * Opens a share URL.
   *
   * @param {string} url The share URL.
   */
  openShareUrl(url) {
    if (!url) return;

    if (url.startsWith('mailto:')) {
      window.location.href = url;

      return;
    }

    window.open(url, this.options().target, 'noopener');
  }

  /**
   * Returns the button CSS class.
   *
   * @returns {string} The CSS class.
   */
  buildCSSClass() {
    return [
      'vjs-share-button',
      this.options().className,
      super.buildCSSClass()
    ].filter(Boolean).join(' ');
  }

  /**
   * Updates localized button text when the player language changes.
   */
  handleLanguagechange() {
    this.el().title = this.localize(this.options().title);
    this.el().querySelector('.vjs-control-text').textContent =
      this.localize(this.options().title);
    this.el().querySelector('.vjs-share-button-title').textContent =
      this.localize(this.options().label);
  }
}

ShareButton.prototype.options_ = {
  className: '',
  icon: '',
  iconClass: '',
  label: '',
  title: '',
  buildUrl: url => url
};

class FacebookShareButton extends ShareButton {}
FacebookShareButton.prototype.options_ = {
  className: 'vjs-share-button--facebook',
  label: 'Facebook',
  title: 'Share on Facebook',
  icon: facebookIcon,
  buildUrl: url => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
};

class XShareButton extends ShareButton {}
XShareButton.prototype.options_ = {
  className: 'vjs-share-button--x',
  label: 'X',
  title: 'Share on X',
  icon: xIcon,
  buildUrl: (url, text) =>
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
};

class LinkedinShareButton extends ShareButton {}
LinkedinShareButton.prototype.options_ = {
  className: 'vjs-share-button--linkedin',
  label: 'LinkedIn',
  title: 'Share on LinkedIn',
  icon: linkedinIcon,
  buildUrl: url => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
};

class WhatsappShareButton extends ShareButton {}
WhatsappShareButton.prototype.options_ = {
  className: 'vjs-share-button--whatsapp',
  label: 'WhatsApp',
  title: 'Share on WhatsApp',
  icon: whatsappIcon,
  buildUrl: (url, text) =>
    `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text} ${url}`)}`
};

class EmailShareButton extends ShareButton {}
EmailShareButton.prototype.options_ = {
  className: 'vjs-share-button--email',
  label: 'E-mail',
  title: 'Share by email',
  icon: mailIcon,
  buildUrl: (url, text) => {
    const encodedText = encodeURIComponent(text);

    return `mailto:?subject=${encodedText}&body=${encodedText}%20${encodeURIComponent(url)}`;
  }
};

class CopyLinkShareButton extends ShareButton {
  /**
   * Copies the generated media URL instead of opening a platform URL.
   */
  share() {
    this.copyText(this.generateUrl_());
    this.notifyShare();
  }

  /**
   * Copies text to the system clipboard.
   *
   * @param {string} text The text to copy.
   */
  copyText(text) {
    if (!navigator.clipboard?.writeText) {
      log.warn('Clipboard API is unavailable; the text could not be copied.');

      return;
    }

    try {
      Promise.resolve(navigator.clipboard.writeText(text)).catch(error => {
        log.error('The text could not be copied:', error);
      });
    } catch (error) {
      log.error('The text could not be copied:', error);
    }
  }
}
CopyLinkShareButton.prototype.options_ = {
  className: 'vjs-share-button--copy',
  label: 'Copy link',
  title: 'Copy link',
  icon: linkIcon,
  target: '',
  rel: '',
  buildUrl: () => '#'
};

class EmbedShareButton extends CopyLinkShareButton {
  /**
   * Copies the generated embed code instead of opening a platform URL.
   */
  share() {
    this.copyText(this.options().buildEmbedCode(
      this.generateUrl_(),
      this.player(),
      this
    ));
    this.notifyShare();
  }
}
EmbedShareButton.prototype.options_ = {
  className: 'vjs-share-button--embed',
  label: 'Embed',
  title: 'Embed',
  icon: embedIcon,
  target: '',
  rel: '',
  buildUrl: () => '#',
  buildEmbedCode: url => `<iframe src="${url}" width="560" height="315" allowfullscreen></iframe>`
};

[
  ['ShareButton', ShareButton],
  ['FacebookShareButton', FacebookShareButton],
  ['XShareButton', XShareButton],
  ['LinkedinShareButton', LinkedinShareButton],
  ['WhatsappShareButton', WhatsappShareButton],
  ['EmailShareButton', EmailShareButton],
  ['CopyLinkShareButton', CopyLinkShareButton],
  ['EmbedShareButton', EmbedShareButton]
].forEach(([name, ComponentClass]) => {
  videojs.registerComponent(name, ComponentClass);
});

export {
  CopyLinkShareButton,
  EmailShareButton,
  EmbedShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  ShareButton,
  WhatsappShareButton,
  XShareButton
};

export default ShareButton;
