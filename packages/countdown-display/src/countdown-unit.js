import videojs from 'video.js';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/component').default}
 */
const Component = videojs.getComponent('Component');

/**
 * Represents a single countdown unit in a Video.js countdown component.
 * Each unit shows a numeric value, a separator, and a localized label.
 */
class CountdownUnit extends Component {
  /**
   * Creates an instance of a CountdownUnit.
   *
   * @param {import('video.js/dist/types/player.js').default} player The player instance.
   * @param {Object} options Configuration options for the component.
   * @param {string} [options.label] Label for the countdown unit (e.g., "Seconds").
   * @param {string} [options.separator=":"] Separator between units (e.g., ":").
   */
  constructor(player, options) {
    super(player, options);
  }

  /**
   * Creates the DOM element for the countdown unit.
   *
   * This element contains:
   *   - `.vjs-countdown-value` — the numeric value (default: "00")
   *   - `.vjs-countdown-separator` — the separator character
   *   - `.vjs-countdown-label` — localized label
   *
   * @param {string} [tagName='div'] the tag name for the element
   * @param {object} [properties] the properties to apply to the element
   * @param {object} [attributes] the attributes to apply to the element
   * @returns {HTMLElement} the card bar element
   */
  createEl(tagName = 'div', properties, attributes) {
    const props = videojs.obj.merge({
      className: this.buildCSSClass(),
    }, properties);

    const el = super.createEl(tagName, props, attributes);

    el.append(
      videojs.dom.createEl('span', { className: 'vjs-countdown-value' }, {}, '00'),
      videojs.dom.createEl('span', { className: 'vjs-countdown-separator' }, {}, this.options().separator),
      videojs.dom.createEl('span', { className: 'vjs-countdown-label' }, {}, this.localize(this.options().label))
    );

    return el;
  }

  /**
   * Builds the CSS class for the component.
   *
   * @returns {string} the CSS class name
   */
  buildCSSClass() {
    return `vjs-countdown-unit ${super.buildCSSClass()}`;
  }

  /**
   * Updates the unit's label when the player's language changes.
   */
  handleLanguagechange() {
    this.el().getElementsByClassName('vjs-countdown-label')[0].textContent = this.localize(this.options().label);
  }

  /**
   * Updates the numeric value displayed in the countdown unit.
   *
   * @param {string|number} value - The new numeric value to display.
   */
  update(value) {
    const valueEl = this.el().getElementsByClassName('vjs-countdown-value')[0];

    if (valueEl.textContent !== value) valueEl.textContent = value;
  }
}

CountdownUnit.prototype.options_ = {
  separator: ':'
};

videojs.registerComponent('CountdownUnit', CountdownUnit);

export default CountdownUnit;
