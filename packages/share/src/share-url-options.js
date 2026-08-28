import videojs from 'video.js';
import './lang';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/component').default}
 */
const Component = videojs.getComponent('Component');

const HIDDEN_ATTRIBUTES = {
  'aria-hidden': 'true'
};

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
 * Builds the share URL selected by the user.
 */
class ShareUrlOptions extends Component {
  /**
   * Creates the URL option radio group.
   *
   * @param {import('video.js/dist/types/player.js').default} player The player instance.
   * @param {Object} options The URL option configuration.
   */
  constructor(player, options = {}) {
    super(player, options);
    this.handleChange = this.handleChange.bind(this);
    this.updateOptionsState = this.updateOptionsState.bind(this);
    this.inputs_ = new Map();
    this.selected_ = this.defaultOption();
    this.renderOptions();
    this.on(this.el(), 'change', this.handleChange);
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
   * Renders the configured options.
   */
  renderOptions() {
    const options = this.entries();
    const elements = options.map(
      ([name, option]) => this.createOption(name, option)
    );

    this.el().classList.toggle(
      'vjs-hidden',
      options.length <= 1
    );
    this.el().append(...elements);
  }

  /**
   * Returns enabled URL option entries.
   *
   * @returns {Array} The enabled options.
   */
  entries() {
    return Object.entries(this.options().options)
      .filter(([name, option]) =>
        option !== false &&
        !this.isOptionHidden(option) &&
        (name !== 'currentTime' || this.options().includeCurrentTime));
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
   * Returns the selected default option.
   *
   * @returns {string} The default option name.
   */
  defaultOption() {
    const preferredOption = this.options().defaultOption ??
      (this.options().includeCurrentTime ? 'currentTime' : 'episode');
    const entries = this.entries()
      .filter(([, option]) => !this.isOptionDisabled(option));

    return entries.some(([name]) => name === preferredOption) ?
      preferredOption :
      entries[0]?.[0];
  }

  /**
   * Creates one radio option.
   *
   * @param {string} name The option name.
   * @param {Object} option The option config.
   *
   * @returns {HTMLLabelElement} The option label.
   */
  createOption(name, option) {
    const input = this.createInput(name);
    const label = videojs.dom.createEl('label', {
      className: 'vjs-share-url-option-label',
      title: this.localize(option.title ?? option.label)
    }, {
      for: input.id
    });

    label.append(
      this.createControlText(option),
      input,
      videojs.dom.createEl('span', {
        className: 'vjs-share-url-option-radio'
      }, HIDDEN_ATTRIBUTES),
      videojs.dom.createEl('span', {
        textContent: this.localize(option.label)
      }, HIDDEN_ATTRIBUTES)
    );

    return label;
  }

  /**
   * Creates an option radio input.
   *
   * @param {string} name The option name.
   *
   * @returns {HTMLInputElement} The radio input.
   */
  createInput(name) {
    const option = this.options().options[name];
    const input = videojs.dom.createEl('input', {
      className: 'vjs-share-url-option-input'
    }, {
      id: `${this.id()}_${name}`,
      type: 'radio',
      name: `${this.id()}_url_option`,
      value: name
    });

    if (name === this.selected_) input.checked = true;
    input.disabled = this.isOptionDisabled(option);
    this.inputs_.set(name, input);

    return input;
  }

  /**
   * Creates the screen-reader text.
   *
   * @param {Object} option The option config.
   *
   * @returns {HTMLElement} The text element.
   */
  createControlText(option) {
    return videojs.dom.createEl('span', {
      className: 'vjs-control-text',
      textContent: this.localize(option.title ?? option.label)
    }, {
      'aria-live': 'polite'
    });
  }

  /**
   * Handles selected option changes.
   *
   * @param {Event} event The selected option change event.
   */
  handleChange(event) {
    const input = event.target.closest?.('.vjs-share-url-option-input');

    if (!input || !this.el().contains(input)) return;
    if (input.disabled) return;

    this.selected_ = input.value;
    this.trigger('change');
  }

  /**
   * Updates dynamic URL options.
   */
  updateOptionsState() {
    this.entries().forEach(([name, option]) => {
      this.inputs_.get(name).disabled = this.isOptionDisabled(option);
    });

    if (this.isOptionDisabled(this.options().options[this.selected_])) {
      this.selectDefaultOption();
    }
  }

  /**
   * Selects the current default URL option.
   */
  selectDefaultOption() {
    this.selected_ = this.defaultOption();
    this.inputs_.get(this.selected_).checked = true;
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
   * Generates the selected share URL.
   *
   * @returns {string} The share URL.
   */
  generateUrl() {
    const option = this.options().options[this.selected_];

    return option.generateUrl(this.player(), this);
  }

  handleLanguagechange() {
    // do nothing here
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
        const currentUrl = new URL(baseUrl(player, component));

        currentUrl.searchParams.set(
          'startTime',
          Math.floor(player.currentTime())
        );

        return decodeURIComponent(currentUrl.href);
      }
    }
  }
};

videojs.registerComponent('ShareUrlOptions', ShareUrlOptions);

export default ShareUrlOptions;
