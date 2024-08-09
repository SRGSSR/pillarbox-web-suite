import videojs from 'video.js';
import Graph from './graph.js';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/component').default}
 */
const Component = videojs.getComponent('Component');

/**
 * Represents a PlottedMetricsComponent for displaying individual metrics with a graph.
 */
class PlottedMetricComponent extends Component {
  /**
   * Creates an instance of a PlottedMetricsComponent.
   *
   * @param {import('video.js/dist/types/player.js').default} player The player instance.
   * @param {Object} options Configuration options for the component.
   */
  constructor(player, options) {
    super(player, options);
  }

  /**
   * Create the component's DOM element.
   *
   * @return {Element}
   */
  createEl() {
    this.el_ = super.createEl('div', {
      className: this.buildCSSClass()
    });

    this.labelEl_ = super.createEl('div', {
      innerHTML: `${this.options_.label}: 0`
    });

    this.el_.appendChild(this.labelEl_);

    this.canvasEl_ = super.createEl('canvas');

    this.el_.appendChild(this.canvasEl_);

    this.graph_ = new Graph(
      this.canvasEl_,
      this.options_.maxDataPoints,
      this.options_.lineColor
    );

    return this.el_;
  }

  /**
   * Update the value of the metric.
   */
  update() {
    const value = this.options_.valueExtractor(this.player());

    this.labelEl_.innerHTML = `${this.options_.label}: ${this.options_.valueFormatter(value)}`;
    this.graph_.update(value);
  }

  buildCSSClass() {
    return `${super.buildCSSClass()} plotted-metric-component`;
  }
}

videojs.registerComponent('PlottedMetricComponent', PlottedMetricComponent);
