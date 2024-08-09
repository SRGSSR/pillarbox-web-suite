import videojs from 'video.js';
import './metric-label.js';
import './graph-component.js';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/component').default}
 */
const Component = videojs.getComponent('Component');

/**
 * Represents a PlottedMetricsComponent for displaying individual metrics with a graph.
 */
class MetricComponent extends Component {
  /**
   * Creates an instance of a PlottedMetricsComponent.
   *
   * @param {import('video.js/dist/types/player.js').default} player The player instance.
   * @param {Object} options Configuration options for the component.
   * @param {Function} [options.valueFormatter] - A function to format the metric value before display. Defaults to the identity function.
   * @param {Function} options.valueExtractor - A function to extract the metric value from the player instance.
   *
   */
  constructor(player, options) {
    super(player, options);
  }

  /**
   * Update the value of the metric.
   */
  update() {
    const value = this.options().valueExtractor(this.player());

    this.metricLabel?.update(this.options().valueFormatter(value));
    this.graphComponent?.update(value);
  }

  /**
   * Constructs the DOM element that will represent the MetricComponent in the player UI.
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

  buildCSSClass() {
    return `${super.buildCSSClass()} metric-component`;
  }
}

MetricComponent.prototype.options_ = {
  valueFormatter: (value) => value,
  children: [
    'metricLabel',
    'graphComponent'
  ]
};

videojs.registerComponent('MetricComponent', MetricComponent);

export default MetricComponent;
