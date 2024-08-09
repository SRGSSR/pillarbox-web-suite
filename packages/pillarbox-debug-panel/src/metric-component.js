import videojs from 'video.js';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/component').default}
 */
const Component = videojs.getComponent('Component');

/**
 * Represents a MetricComponent for displaying individual metrics.
 */
class MetricComponent extends Component {
  /**
   * Creates an instance of a MetricComponent.
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
      className: this.buildCSSClass(),
      innerHTML: `${this.options_.label}: 0`
    });

    return this.el_;
  }

  /**
   * Update the value of the metric.
   */
  update() {
    this.el_.innerHTML = `${this.options_.label}: ${this.options_.valueExtractor(this.player())}`;
  }

  buildCSSClass() {
    return `${super.buildCSSClass()} metric-component`;
  }
}

videojs.registerComponent('MetricComponent', MetricComponent);

export default MetricComponent;

