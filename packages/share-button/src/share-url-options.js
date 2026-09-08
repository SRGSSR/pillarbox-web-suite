import videojs from 'video.js';
import './lang';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/component').default}
 */
const Component = videojs.getComponent('Component');

const baseUrl = (player, component) =>
  configuredUrl(player, component) || window.location.href;

const configuredUrl = (player, component) => {
  const { url } = component.options();

  return typeof url === 'function' ?
    url(player, component, component.context()) :
    url;
};

const getMediaComposition = (player) =>
  player.options().mediaComposition;

const getMainChapter = (player) =>
  getMediaComposition(player)?.getMainChapter?.();

const getSubdivisions = (player) =>
  getMediaComposition(player)?.getSubdivisions?.() ?? [];

const containsTime = (segment, time) =>
  time >= segment.markIn / 1000 && time < segment.markOut / 1000;

const getCurrentSubdivision = (player) =>
  getSubdivisions(player)
    .filter((segment) => !segment.blockReason)
    .filter((segment) => containsTime(segment, player.currentTime()))
    .pop();

const getSourceMediaData = (player) => player.currentSource()?.mediaData;

const getCurrentMedia = (player) =>
  getMainChapter(player) ||
  getSourceMediaData(player);

/**
 * A radio group selecting which URL is shared. The selected option generates
 * the media URL that the share buttons wrap for their own platform.
 *
 * The native `change` event of the radio inputs bubbles up to this component
 * element, listen to it to be notified when the selection changes.
 */
class ShareUrlOptions extends Component {
  /**
   * Creates the URL option radio group.
   *
   * @param {import('video.js/dist/types/player.js').default} player The player instance.
   * @param {Object} options The URL option configuration.
   * @param {string|function(player, component, context): string} [options.url] The base URL used to
   * generate the share URLs, defaults to the current page URL.
   * @param {boolean} [options.includeCurrentTime=false] Enables the current position option.
   * @param {string} [options.defaultOption] The initially selected option, `'currentTime'` when the
   * current position is enabled, `'episode'` otherwise.
   * @param {Object} [options.options] The available options, keyed by name. Each one declares a
   * `label`, a `title`, a `generateUrl(player, component)` and optionally `isHidden(player, component)`,
   * `isDisabled(player, component)` or a static `disabled`. Set an entry to `false` to remove it.
   */
  constructor(player, options = {}) {
    super(player, options);
    this.render();
    this.on(this.player(), 'timeupdate', this.updateOptionsState);
  }

  /**
   * Creates the component element.
   *
   * @returns {HTMLElement} The radio group element.
   */
  createEl() {
    return super.createEl('div', {}, {
      role: 'radiogroup',
      'aria-label': this.localize('Sharing type')
    });
  }

  /**
   * Renders the enabled options. The group is hidden when there is nothing
   * to choose from.
   *
   * @param {string} [selected] The name of the checked option.
   */
  render(selected = this.defaultOption()) {
    const entries = this.entries();

    this.toggleClass('vjs-hidden', entries.length <= 1);
    this.el().replaceChildren(...entries.map(
      ([name, option]) => this.createOption(name, option, name === selected)
    ));
  }

  /**
   * Returns the enabled URL option entries.
   *
   * @returns {Array} The enabled `[name, option]` pairs.
   */
  entries() {
    const { options, includeCurrentTime } = this.options();

    return Object.entries(options).filter(([name, option]) =>
      option !== false &&
      !this.isOptionHidden(option) &&
      (name !== 'currentTime' || includeCurrentTime));
  }

  /**
   * Returns whether an option should be hidden.
   *
   * @param {Object} option The option config.
   *
   * @returns {boolean} True when hidden.
   */
  isOptionHidden(option) {
    return typeof option.isHidden === 'function' ?
      option.isHidden(this.player(), this) :
      false;
  }

  /**
   * Returns whether an option is currently disabled.
   *
   * @param {Object} option The option config.
   *
   * @returns {boolean} True when disabled.
   */
  isOptionDisabled(option) {
    return typeof option.isDisabled === 'function' ?
      option.isDisabled(this.player(), this) :
      Boolean(option.disabled);
  }

  /**
   * Returns the name of the option checked by default. Disabled options are
   * never selected by default.
   *
   * @returns {string} The default option name.
   */
  defaultOption() {
    const { defaultOption, includeCurrentTime } = this.options();
    const preferred = defaultOption ??
      (includeCurrentTime ? 'currentTime' : 'episode');
    const entries = this.entries()
      .filter(([, option]) => !this.isOptionDisabled(option));

    return entries.some(([name]) => name === preferred) ?
      preferred :
      entries[0]?.[0];
  }

  /**
   * Creates one radio option.
   *
   * @param {string} name The option name.
   * @param {Object} option The option configuration.
   * @param {boolean} checked Whether the option is checked.
   *
   * @returns {HTMLLabelElement} The option label wrapping the radio input.
   */
  createOption(name, option, checked) {
    const id = `${this.id()}_${name}`;
    const label = videojs.dom.createEl('label', {
      className: 'vjs-share-url-option-label',
      title: this.localize(option.title ?? option.label)
    }, { for: id });

    label.append(
      videojs.dom.createEl('input', {
        className: 'vjs-share-url-option-input',
        checked,
        disabled: this.isOptionDisabled(option)
      }, {
        id,
        type: 'radio',
        name: `${this.id()}_url_option`,
        value: name
      }),
      videojs.dom.createEl('span', {
        textContent: this.localize(option.label)
      })
    );

    return label;
  }

  /**
   * Returns the radio input of an option.
   *
   * @param {string} name The option name.
   *
   * @returns {HTMLInputElement|null} The radio input, when rendered.
   */
  input(name) {
    return this.$(`.vjs-share-url-option-input[value="${name}"]`);
  }

  /**
   * Returns the name of the selected option.
   *
   * @returns {string|undefined} The selected option name.
   */
  selected() {
    return this.$('.vjs-share-url-option-input:checked')?.value;
  }

  /**
   * Refreshes the disabled state of the rendered options, falling back to the
   * default option when the selected one becomes disabled.
   */
  updateOptionsState() {
    this.entries().forEach(([name, option]) => {
      const input = this.input(name);

      if (input) input.disabled = this.isOptionDisabled(option);
    });

    const selected = this.options().options[this.selected()];

    if (selected && this.isOptionDisabled(selected)) {
      this.selectDefaultOption();
    }
  }

  /**
   * Selects the current default URL option.
   */
  selectDefaultOption() {
    const input = this.input(this.defaultOption());

    if (!input) return;

    input.checked = true;
    this.trigger('change');
  }

  /**
   * Returns media information available to URL builders.
   *
   * @returns {Object} The current media context.
   */
  context() {
    const currentMedia = getCurrentMedia(this.player());

    return {
      currentMedia,
      currentSource: this.player().currentSource?.(),
      currentSubdivision: getCurrentSubdivision(this.player()),
      currentTime: this.player().currentTime(),
      mainChapter: getMainChapter(this.player()),
      mediaData: getSourceMediaData(this.player()),
      subdivisions: getSubdivisions(this.player()),
      title: currentMedia?.title
    };
  }

  /**
   * Generates the share URL of the selected option.
   *
   * @returns {string} The share URL.
   */
  generateUrl() {
    const option = this.options().options[this.selected()];

    return option ? option.generateUrl(this.player(), this) : '';
  }

  /**
   * Re-renders the options with the current language, keeping the selection.
   */
  handleLanguagechange() {
    this.el().setAttribute('aria-label', this.localize('Sharing type'));
    this.render(this.selected());
  }
}

ShareUrlOptions.prototype.options_ = {
  className: 'vjs-share-url-options',
  defaultOption: undefined,
  includeCurrentTime: false,
  url: undefined,
  options: {
    episode: {
      label: 'Episode',
      title: 'Share episode',
      generateUrl: (player, component) => baseUrl(player, component)
    },
    currentTime: {
      label: 'Current position',
      title: 'Share the current position',
      generateUrl: (player, component) => {
        const url = new URL(baseUrl(player, component));

        url.searchParams.set('startTime', Math.floor(player.currentTime()));

        return url.toString();
      }
    }
  }
};

videojs.registerComponent('ShareUrlOptions', ShareUrlOptions);

export default ShareUrlOptions;
