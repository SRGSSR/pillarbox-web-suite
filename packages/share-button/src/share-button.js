import videojs from 'video.js';
import '@srgssr/svg-button';
import embedIcon from '../assets/embed.svg?raw';
import facebookIcon from '../assets/facebook.svg?raw';
import linkIcon from '../assets/link.svg?raw';
import linkedinIcon from '../assets/linkedin.svg?raw';
import mailIcon from '../assets/mail.svg?raw';
import whatsappIcon from '../assets/whatsapp.svg?raw';
import xIcon from '../assets/x.svg?raw';

/**
 * @ignore
 * @type {typeof import('@srgssr/svg-button').SvgComponent}
 */
const SvgComponent = videojs.getComponent('SvgComponent');

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/utils/log.js').default}
 */
const log = videojs.log.createLogger('share-button');

/**
 * A platform share button. It receives a generated media URL and wraps it for
 * its own platform. The element is a link so the browser handles the
 * navigation, `target` and `rel` natively.
 */
class ShareButton extends SvgComponent {
  /**
   * Creates one platform share button.
   *
   * @param {import('video.js/dist/types/player.js').default} player The player instance.
   * @param {Object} options The button options.
   * @param {string} [options.label] The visible label displayed below the icon.
   * @param {string} [options.title] The accessible title of the link.
   * @param {SVGElement|string|URL} [options.icon] The icon displayed by the button.
   * @param {string} [options.iconName] The icon name when using Video.js experimental SVG icons.
   * @param {string} [options.target='_blank'] The `target` attribute of the link.
   * @param {string} [options.rel='noopener noreferrer'] The `rel` attribute of the link.
   * @param {string|function(player, button): string} [options.shareText] The text shared alongside the URL.
   * @param {function(url, text, player, button): string} options.buildUrl Builds the platform URL.
   */
  constructor(player, options = {}) {
    super(player, options);

    this.on('click', this.handleClick);
  }

  /**
   * Creates the link element.
   *
   * @param {string} [tag='a'] The HTML tag name, must be `a`.
   * @param {Object} [props={}] Additional element properties.
   * @param {Object} [attributes={}] Additional element attributes.
   *
   * @returns {HTMLAnchorElement} The created anchor element.
   */
  createEl(tag = 'a', props = {}, attributes = {}) {
    if (tag !== 'a') {
      log.error(`Creating a ShareButton with an HTML element of ${tag} is not supported; the element must be an 'a'`);
      throw new Error(`'${tag}' is not supported for ShareButton`);
    }

    const { title, target, rel } = this.options();
    const el = super.createEl(tag, props, videojs.obj.merge({
      href: this.getHref(),
      title: this.localize(title),
      target,
      rel
    }, attributes));

    el.prepend(videojs.dom.createEl('span', {
      className: 'vjs-control-text',
      textContent: this.localize(title)
    }));
    el.append(videojs.dom.createEl('span', {
      className: 'vjs-share-button-title',
      textContent: this.localize(this.options().label)
    }));

    return el;
  }

  /**
   * Receives the URL generator selected by `ShareUrlOptions`.
   *
   * @param {Function} generateUrl The URL generator.
   */
  setUrlGenerator(generateUrl) {
    this.generateUrl_ = generateUrl;
    this.updateHref();
  }

  /**
   * Returns the generated media URL, or an empty string when no generator has
   * been provided yet.
   *
   * @returns {string} The generated media URL.
   */
  generateUrl() {
    return typeof this.generateUrl_ === 'function' ? this.generateUrl_() : '';
  }

  /**
   * Returns the platform URL built from the generated media URL.
   *
   * @returns {string} The platform URL.
   */
  getHref() {
    const url = this.generateUrl();

    if (!url) return '';

    try {
      const { buildUrl } = this.options();

      return buildUrl(url, this.shareText(), this.player(), this);
    } catch (error) {
      log.error('Error building the share url:', error);
    }

    return '';
  }

  /**
   * Returns the text shared alongside the URL.
   *
   * @returns {string} The share text.
   */
  shareText() {
    const shareText = this.options().shareText ??
      this.parentComponent_?.options().shareText ??
      document.title;

    return typeof shareText === 'function' ?
      shareText(this.player(), this) :
      shareText;
  }

  /**
   * Updates the link `href`.
   */
  updateHref() {
    this.el().href = this.getHref();
  }

  /**
   * Notifies that a share action happened. The event bubbles so the modal
   * and the player can react to it.
   */
  handleClick() {
    this.trigger({ type: 'share', bubbles: true });
  }

  /**
   * Builds the CSS class string for the button.
   *
   * @returns {string} The CSS class string.
   */
  buildCSSClass() {
    return `vjs-share-button ${super.buildCSSClass()}`;
  }

  /**
   * Updates the localized texts when the player language changes.
   */
  handleLanguagechange() {
    const { title, label } = this.options();

    this.el().title = this.localize(title);
    this.$('.vjs-control-text').textContent = this.localize(title);
    this.$('.vjs-share-button-title').textContent = this.localize(label);
  }
}

ShareButton.prototype.options_ = {
  target: '_blank',
  rel: 'noopener noreferrer',
  buildUrl: url => url
};

/**
 * Shares the media URL on Facebook.
 */
class FacebookShareButton extends ShareButton {}
FacebookShareButton.prototype.options_ = videojs.obj.merge(
  ShareButton.prototype.options_,
  {
    className: 'vjs-share-button-facebook',
    label: 'Facebook',
    title: 'Share on Facebook',
    icon: facebookIcon,
    iconName: 'facebook',
    buildUrl: url =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  }
);

/**
 * Shares the media URL and the share text on X.
 */
class XShareButton extends ShareButton {}
XShareButton.prototype.options_ = videojs.obj.merge(
  ShareButton.prototype.options_,
  {
    className: 'vjs-share-button-x',
    label: 'X',
    title: 'Share on X',
    icon: xIcon,
    iconName: 'x',
    buildUrl: (url, text) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
  }
);

/**
 * Shares the media URL on LinkedIn.
 */
class LinkedinShareButton extends ShareButton {}
LinkedinShareButton.prototype.options_ = videojs.obj.merge(
  ShareButton.prototype.options_,
  {
    className: 'vjs-share-button-linkedin',
    label: 'LinkedIn',
    title: 'Share on LinkedIn',
    icon: linkedinIcon,
    iconName: 'linkedin',
    buildUrl: url =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  }
);

/**
 * Shares the media URL and the share text on WhatsApp.
 */
class WhatsappShareButton extends ShareButton {}
WhatsappShareButton.prototype.options_ = videojs.obj.merge(
  ShareButton.prototype.options_,
  {
    className: 'vjs-share-button-whatsapp',
    label: 'WhatsApp',
    title: 'Share on WhatsApp',
    icon: whatsappIcon,
    iconName: 'whatsapp',
    buildUrl: (url, text) =>
      `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text} ${url}`)}`
  }
);

/**
 * Shares the media URL and the share text through the default mail client.
 */
class EmailShareButton extends ShareButton {}
EmailShareButton.prototype.options_ = videojs.obj.merge(
  ShareButton.prototype.options_,
  {
    className: 'vjs-share-button-email',
    label: 'E-mail',
    title: 'Share by email',
    icon: mailIcon,
    iconName: 'email',
    target: '_self',
    buildUrl: (url, text) => {
      const encodedText = encodeURIComponent(text);

      return `mailto:?subject=${encodedText}&body=${encodedText}%20${encodeURIComponent(url)}`;
    }
  }
);

/**
 * A share button that copies the generated media URL to the clipboard instead
 * of opening a platform URL.
 */
class CopyLinkShareButton extends ShareButton {
  /**
   * Copies the generated media URL and notifies the share action.
   *
   * @param {Event} event The click event.
   */
  handleClick(event) {
    event.preventDefault();
    this.copyText(this.textToCopy());
    super.handleClick(event);
  }

  /**
   * Returns the text copied to the clipboard.
   *
   * @returns {string} The generated media URL.
   */
  textToCopy() {
    return this.generateUrl();
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

    Promise.resolve(navigator.clipboard.writeText(text)).catch(error => {
      log.error('The text could not be copied:', error);
    });
  }
}
CopyLinkShareButton.prototype.options_ = videojs.obj.merge(
  ShareButton.prototype.options_,
  {
    className: 'vjs-share-button-copy',
    label: 'Copy link',
    title: 'Copy link',
    icon: linkIcon,
    iconName: 'copy-link',
    target: '',
    rel: '',
    buildUrl: () => '#'
  }
);

/**
 * A share button that copies the embed code of the generated media URL.
 *
 * @param {import('video.js/dist/types/player.js').default} player The player instance.
 * @param {Object} options The button options, on top of the `ShareButton` ones.
 * @param {function(url, player, button): string} [options.buildEmbedCode] Builds the embed code
 * from the generated media URL.
 */
class EmbedShareButton extends CopyLinkShareButton {
  /**
   * Returns the embed code copied to the clipboard.
   *
   * @returns {string} The embed code.
   */
  textToCopy() {
    const { buildEmbedCode } = this.options();

    return buildEmbedCode(this.generateUrl(), this.player(), this);
  }
}
EmbedShareButton.prototype.options_ = videojs.obj.merge(
  CopyLinkShareButton.prototype.options_,
  {
    className: 'vjs-share-button-embed',
    label: 'Embed',
    title: 'Embed',
    icon: embedIcon,
    iconName: 'embed',
    buildEmbedCode: url =>
      `<iframe src="${url}" width="560" height="315" allowfullscreen></iframe>`
  }
);

videojs.registerComponent('ShareButton', ShareButton);
videojs.registerComponent('FacebookShareButton', FacebookShareButton);
videojs.registerComponent('XShareButton', XShareButton);
videojs.registerComponent('LinkedinShareButton', LinkedinShareButton);
videojs.registerComponent('WhatsappShareButton', WhatsappShareButton);
videojs.registerComponent('EmailShareButton', EmailShareButton);
videojs.registerComponent('CopyLinkShareButton', CopyLinkShareButton);
videojs.registerComponent('EmbedShareButton', EmbedShareButton);

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
