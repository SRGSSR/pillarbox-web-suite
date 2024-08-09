import videojs from 'video.js';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/component').default}
 */
const Component = videojs.getComponent('Component');

const log = videojs.log.createLogger('graph-component');

/**
 * A video.js component that plots a dynamic line graph.
 *
 * This component is used to visualize data over time on a Video.js player by plotting
 * a line graph within a canvas element. It supports dynamic updates, allowing new data points
 * to be added.
 */
class GraphComponent extends Component {
  /**
   * Creates an instance of a GraphComponent.
   *
   * @param {import('video.js/dist/types/player.js').default} player - The Video.js player instance.
   * @param {Object} [options={}] - Configuration options for the GraphComponent.
   * @param {number} [options.maxDataPoints=30] - The maximum number of data points to display on the graph.
   *                                              Older data points are removed as new ones are added.
   * @param {string} [options.fillStyle='rgba(11,83,148)'] - The color of the bars on the graph.
   * @param {string} [options.strokeStyle='rgb(50,50,50)'] - The color of the stroke around the line on the graph.
   */
  constructor(player, options = {}) {
    super(player, options);
    this.data = [];
  }

  /**
   * Constructs the DOM element that will be used to render the graph.
   * It ensures the element is a canvas and sets up the necessary properties.
   *
   * @param {string} [tag='canvas'] - The HTML tag name for the element. Must be 'canvas'.
   * @param {Object} [props={}] - Additional properties to set on the element.
   * @param {Object} [attributes={}] - Additional attributes to set on the element.
   * @returns {HTMLCanvasElement} The created canvas element.
   */
  createEl(tag = 'canvas', props = {}, attributes = {}) {
    if (tag !== 'canvas') {
      log.error(`Creating a GraphComponent with an HTML element of ${tag} is not supported; the element must be a 'canvas'`);
      throw new Error(`'${tag}' is not supported for GraphComponent`);
    }

    return super.createEl(
      tag,
      videojs.obj.merge({
        className: this.buildCSSClass()
      }, props),
      attributes
    );
  }

  /**
   * Updates the graph with a new data point.
   *
   * This method adds a new data point to the graph. If the maximum number of
   * data points is exceeded, the oldest point is removed. After updating the
   * data, the graph is redrawn.
   *
   * @param {number} value - The new data point to add to the graph.
   */
  update(value) {
    if (this.data.length >= this.options().maxDataPoints) {
      this.data.shift();
    }

    this.data.push(value);
    this.drawGraph();
  }

  /**
   * Draws the graph on the canvas element.
   *
   * This method iterates over the stored data points and renders them on the
   * canvas as a series of bars. Each bar represents a data point, and the
   * height of the bar is scaled relative to the maximum value in the dataset.
   */
  drawGraph() {
    const canvas = this.el();
    const ctx = canvas.getContext('2d');

    canvas.width = this.width();
    canvas.height = this.height();

    const maxValue = Math.max(...this.data);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = canvas.width / this.options().maxDataPoints;

    this.data.forEach((point, index) => {
      const x = index * barWidth;
      const y = canvas.height - (point / maxValue) * canvas.height; // Scale dynamically based on maxValue
      const barHeight = (point / maxValue) * canvas.height;

      ctx.beginPath();
      ctx.rect(x, y, barWidth, barHeight);
      ctx.closePath();

      ctx.fillStyle = this.options().fillStyle;
      ctx.fill();

      ctx.strokeStyle = this.options().strokeStyle;
      ctx.stroke();
    });
  }

  buildCSSClass() {
    return `${super.buildCSSClass()} graph-component`;
  }

  /**
   * Get the `GraphComponent`s DOM element
   *
   * @return {HTMLCanvasElement}
   *         The DOM element for this `Component`.
   */
  el() {
    return this.el_;
  }
}

/**
 * @type {GraphComponentOptions & Object}
 */
GraphComponent.prototype.options_ = {
  fillStyle: 'rgba(11,83,148)',
  strokeStyle: 'rgb(50,50,50)',
  maxDataPoints: 30
};

videojs.registerComponent('GraphComponent', GraphComponent);

export default GraphComponent;

/**
 * @typedef {Object} GraphComponentOptions
 * @property {string} [fillStyle] - The fill color style in any valid CSS color format (e.g., 'rgba(11,83,148)').
 * @property {string} [strokeStyle] - The stroke color style in any valid CSS color format (e.g., 'rgb(50,50,50)').
 * @property {number} [maxDataPoints] - The maximum number of data points to display.
 */
