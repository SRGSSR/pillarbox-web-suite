/**
 * A class that plots a dynamic line graph on a given canvas.
 */
export default class Graph {
  /**
   * Create a graph.
   *
   * @param {HTMLCanvasElement} canvas - The canvas element where the graph will be plotted.
   * @param {number} [maxDataPoints=100] - The maximum number of data points to display on the graph.
   * @param {string} [lineColor='rgba(11,83,148)'] - The line color.
   */
  constructor(
    canvas,
    maxDataPoints = 30,
    lineColor = 'rgba(11,83,148)'
  ) {
    this.canvas = canvas;
    this.lineColor = lineColor;
    this.ctx = canvas.getContext('2d');
    this.maxDataPoints = maxDataPoints;
    this.data = [];
  }

  /**
   * Update the graph with a new data point.
   *
   * @param {number} value - The new data point to add to the graph.
   */
  update(value) {
    if (this.data.length >= this.maxDataPoints) {
      this.data.shift();  // Remove the oldest point
    }

    this.data.push(value);

    this.drawGraph();
  }

  /**
   * Draw the graph on the canvas.
   * @private
   */
  drawGraph() {
    const maxValue = Math.max(...this.data);

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const barWidth = this.canvas.width / this.maxDataPoints;

    this.data.forEach((point, index) => {
      const x = index * barWidth;
      const y = this.canvas.height - (point / maxValue) * this.canvas.height; // Scale dynamically based on maxValue
      const barHeight = (point / maxValue) * this.canvas.height;

      // Draw the bar with fill and stroke
      this.ctx.beginPath();
      this.ctx.rect(x, y, barWidth, barHeight);
      this.ctx.closePath();

      this.ctx.fillStyle = this.lineColor;
      this.ctx.fill();

      this.ctx.strokeStyle = 'rgb(50,50,50)';
      this.ctx.stroke();
    });
  }
}
