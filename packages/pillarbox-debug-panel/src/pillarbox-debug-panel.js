import videojs from 'video.js';
import { version } from '../package.json';
import './metric-component.js';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/component').default}
 */
const Component = videojs.getComponent('Component');

/**
 * Represents a PillarboxDebugPanel component for the Video.js player.
 *
 * The PillarboxDebugPanel is a high-level component that serves as a container
 * for multiple MetricComponent instances. Each MetricComponent is responsible
 * for displaying a specific video playback metric, optionally with a graphical
 * representation (using a GraphComponent).
 */
class PillarboxDebugPanel extends Component {
  update_ = () => this.update();

  /**
   * Creates an instance of a PillarboxDebugPanel.
   *
   * @param {import('video.js/dist/types/player.js').default} player - The Video.js player instance.
   * @param {Object} options - Configuration options for the PillarboxDebugPanel.
   */
  constructor(player, options) {
    super(player, options);

    this.player().one('loadeddata', this.update_);
    this.player().on('timeupdate', this.update_);
  }

  dispose() {
    this.player().off('loadeddata', this.update_);
    this.player().off('timeupdate', this.update_);
  }

  /**
   * Updates all MetricComponent instances within this panel.
   */
  update() {
    this.children().forEach(child => child.update && child.update());
  }

  /**
   * Constructs the DOM element that will represent the PillarboxDebugPanel in the player UI.
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
      }, props),
      attributes
    );
  }

  buildCSSClass() {
    return `${super.buildCSSClass()} pbw-debug-panel`;
  }

  static get VERSION() {
    return version;
  }
}

/**
 * Helper function to extract an attribute from the VHS tech.
 *
 * @param {import('video.js/dist/types/player.js').default} player - The Video.js player instance.
 * @param {string} attribute - The VHS attribute to extract.
 *
 * @returns {string|undefined} The value of the VHS attribute, or undefined if not available.
 */
function extractVhsAttribute(player, attribute) {
  const tech = player.tech({});

  if (!tech?.vhs) return undefined;

  return tech.vhs.playlists.media().attributes[attribute];
}

/**
 * Helper function to extract a statistic from the VHS tech.
 *
 * @param {import('video.js/dist/types/player.js').default} player - The Video.js player instance.
 * @param {string} stat - The VHS statistic to extract.
 *
 * @returns {number|undefined} The value of the VHS statistic, or undefined if not available.
 */
function extractVhsStats(player, stat) {
  const tech = player.tech({});

  if (!tech?.vhs) return undefined;

  return tech.vhs.stats[stat];
}

/**
 * Helper function to get the currently selected video track.
 *
 * @param {import('video.js/dist/types/player.js').default} player - The Video.js player instance.
 *
 * @returns {Object|undefined} The currently selected video track, or undefined if none is selected.
 */
function currentVideoTrack(player) {
  return Array.from(player.videoTracks()).find(track => track.selected);
}

/**
 * Helper function to get the currently enabled audio track.
 *
 * @param {import('video.js/dist/types/player.js').default} player - The Video.js player instance.
 *
 * @returns {Object|undefined} The currently enabled audio track, or undefined if none is enabled.
 */
function currentAudioTrack(player) {
  return Array.from(player.audioTracks()).find(track => track.enabled);
}

PillarboxDebugPanel.prototype.options_ = {
  children: [
    {
      name: 'bufferMetricComponent',
      id: 'bufferMetricComponent',
      componentClass: 'MetricComponent',
      metricLabel: { label: 'Buffer' },
      graphComponent: { fillStyle: 'rgb(151,32,48)' },
      valueExtractor: (player) => {
        const buffered = player.buffered();
        const currentTime = player.currentTime();

        return Math.max(
          0,
          (buffered.length ? buffered.end(buffered.length - 1) - currentTime
            : 0)
        ).toFixed(2);
      },
      valueFormatter: (value) => value ? `${value} s` : 'N/A'
    },
    {
      name: 'bandwidthMetricComponent',
      id: 'bandwidthMetricComponent',
      componentClass: 'MetricComponent',
      metricLabel: { label: 'Bandwidth' },
      valueExtractor: (player) => extractVhsStats(player, 'bandwidth'),
      valueFormatter: (value) => value ? `${(value / 1e6).toFixed(2)} Mbps` : 'N/A'
    },
    {
      name: 'bitrateMetricComponent',
      id: 'bitrateMetricComponent',
      componentClass: 'MetricComponent',
      metricLabel: { label: 'Bitrate' },
      graphComponent: { fillStyle: 'rgb(0,128,128)' },
      valueExtractor: (player) =>
        extractVhsAttribute(player, 'BANDWIDTH') ??
        currentVideoTrack(player)?.configuration?.bitrate,
      valueFormatter: (value) => value ? `${(value / 1e6).toFixed(2)} Mbps` : 'N/A'
    },
    {
      name: 'mediaDurationMetricComponent',
      id: 'mediaDurationMetricComponent',
      componentClass: 'MetricComponent',
      graphComponent: false,
      metricLabel: { label: 'Media Duration' },
      valueExtractor: (player) => player.duration().toFixed(2) + 's'
    },
    {
      name: 'positionMetricComponent',
      id: 'positionMetricComponent',
      componentClass: 'MetricComponent',
      graphComponent: false,
      metricLabel: { label: 'Position' },
      valueExtractor: (player) => player.currentTime().toFixed(2) + 's'
    },
    {
      name: 'codecsMetricComponent',
      id: 'codecsMetricComponent',
      componentClass: 'MetricComponent',
      graphComponent: false,
      metricLabel: { label: 'Codecs' },
      valueExtractor: (player) => {
        const codec = extractVhsAttribute(player, 'CODECS');

        if (codec) return codec;

        const videoCodec = currentVideoTrack(player)?.configuration?.codec;
        const audioCodec = currentAudioTrack(player)?.configuration?.codec;

        return [videoCodec, audioCodec].filter(Boolean).join(',') || 'N/A';
      }
    },
    {
      name: 'framerateMetricComponent',
      id: 'framerateMetricComponent',
      componentClass: 'MetricComponent',
      graphComponent: false,
      metricLabel: { label: 'Framerate' },
      valueExtractor: (player) => {
        const frameRate = extractVhsAttribute(player, 'FRAME-RATE') ??
          currentVideoTrack(player)?.configuration?.framerate;

        return frameRate ? `${frameRate} fps` : 'N/A';
      }
    },
    {
      name: 'totalFramesMetricComponent',
      id: 'totalFramesMetricComponent',
      componentClass: 'MetricComponent',
      graphComponent: false,
      metricLabel: { label: 'Total frames' },
      valueExtractor: (player) => {
        const quality = player.getVideoPlaybackQuality();

        return quality.totalVideoFrames ?? 'N/A';
      }
    },
    {
      name: 'droppedFramesMetricComponent',
      id: 'droppedFramesMetricComponent',
      componentClass: 'MetricComponent',
      graphComponent: false,
      metricLabel: { label: 'Dropped frames' },
      valueExtractor: (player) => {
        const quality = player.getVideoPlaybackQuality();

        return quality.droppedVideoFrames ?? 'N/A';
      }
    },
    {
      name: 'resolutionMetricComponent',
      id: 'resolutionMetricComponent',
      componentClass: 'MetricComponent',
      graphComponent: false,
      metricLabel: { label: 'Resolution' },
      valueExtractor: (player) => {
        const resolution = extractVhsAttribute(player, 'RESOLUTION') ??
          currentVideoTrack(player)?.configuration;

        return resolution ? `${resolution.width}x${resolution.height}` : 'N/A';
      }
    },
    {
      name: 'timestampMetricComponent',
      id: 'timestampMetricComponent',
      componentClass: 'MetricComponent',
      graphComponent: false,
      metricLabel: { label: 'Timestamp' },
      valueExtractor: () => new Date().toLocaleTimeString()
    }
  ]
};

videojs.registerComponent('PillarboxDebugPanel', PillarboxDebugPanel);

export default PillarboxDebugPanel;
