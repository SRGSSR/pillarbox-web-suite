import videojs from 'video.js';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/component').default}
 */
const Component = videojs.getComponent('Component');

/**
 * Represents a MetricLabel component for displaying individual metrics.
 *
 * The MetricLabel is a simple component used to display a text label for a specific metric.
 * It shows the metric's name and its current value.
 */
class MetricLabel extends Component {
  /**
   * Creates an instance of a MetricLabel.
   *
   * @param {import('video.js/dist/types/player.js').default} player - The Video.js player instance.
   * @param {Object} options - Configuration options for the MetricLabel.
   * @param {string} options.label - The label text for the metric. This text is displayed along with the metric value.
   */
  constructor(player, options) {
    super(player, options);
  }

  /**
   * Constructs the DOM element that will represent the MetricLabel in the player UI.
   *
   * @param {string} [tag] - The HTML tag name for the element.
   * @param {Object} [props={}] - Additional properties to set on the element.
   * @param {Object} [attributes={}] - Additional attributes to set on the element.
   *
   * @return {Element} The created DOM element.
   */
  createEl(tag, props = {}, attributes = {}) {
    return super.createEl(
      tag,
      videojs.obj.merge({
        className: this.buildCSSClass()
      }, props)
      , attributes
    );
  }

  /**
   * Updates the value of the metric displayed by the MetricLabel.
   *
   * @param {string|number} value - The current value of the metric to display.
   */
  update(value) {
    videojs.dom.textContent(this.el(), `${this.options().label}: ${this.localize(value)}`);
  }

  buildCSSClass() {
    return `${super.buildCSSClass()} metric-label`;
  }
}

videojs.registerComponent('MetricLabel', MetricLabel);

export default MetricLabel;

