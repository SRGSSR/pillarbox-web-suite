import videojs from 'video.js';
import './metric-component.js';
import './plotted-metric-component.js';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/component').default}
 */
const Component = videojs.getComponent('Component');

/**
 * Represents a PillarboxDebugPanel component for the videojs player.
 */
class PillarboxDebugPanel extends Component {
  /**
   * Creates an instance of a PillarboxDebugPanel.
   *
   * @param {import('video.js/dist/types/player.js').default} player The player instance.
   * @param {Object} options Configuration options for the component.
   */
  constructor(player, options) {
    super(player, options);

    player.one('loadeddata', () => this.update());
    player.on('timeupdate', () => this.update());
  }

  /**
   * Update all metrics.
   */
  update() {
    this.children().forEach(child => {
      if (child.update) {
        child.update();
      }
    });
  }
}

function extractVhsAttribute(player, attribute) {
  const tech = player.tech({});

  if (!tech?.vhs) return undefined;

  return tech.vhs.playlists.media().attributes[attribute];
}

function extractVhsStats(player, stat) {
  const tech = player.tech({});

  if (!tech?.vhs) return undefined;

  return tech.vhs.stats[stat];
}

function currentVideoTrack(player) {
  return Array.from(player.videoTracks()).find(track => track.selected);
}

function currentAudioTrack(player) {
  return Array.from(player.audioTracks()).find(track => track.enabled);
}

PillarboxDebugPanel.prototype.options_ = {
  className: 'pbw-debug-panel',
  children: [
    {
      name: 'PlottedMetricComponent',
      label: 'Buffer',
      lineColor: 'rgb(151,32,48)',
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
      name: 'MetricComponent',
      label: 'Media Duration',
      valueExtractor: (player) => player.duration().toFixed(2) + 's'
    },
    {
      name: 'MetricComponent',
      label: 'Position',
      valueExtractor: (player) => player.currentTime().toFixed(2) + 's'
    },
    {
      name: 'PlottedMetricComponent',
      label: 'Bandwidth',
      valueExtractor: (player) => extractVhsStats(player, 'bandwidth'),
      valueFormatter: (value) => value ? `${(value / 1e6).toFixed(2)} Mbps` : 'N/A'
    },
    {
      name: 'PlottedMetricComponent',
      label: 'Bitrate',
      lineColor: 'rgb(0,128,128)',
      valueExtractor: (player) =>
        extractVhsAttribute(player, 'BANDWIDTH') ??
        currentVideoTrack(player)?.configuration?.bitrate,
      valueFormatter: (value) => value ? `${(value / 1e6).toFixed(2)} Mbps` : 'N/A',
    },
    {
      name: 'MetricComponent',
      label: 'Codecs',
      valueExtractor: (player) => {
        const codec = extractVhsAttribute(player, 'CODECS');

        if (codec) return codec;

        const videoCodec = currentVideoTrack(player)?.configuration?.codec;
        const audioCodec = currentAudioTrack(player)?.configuration?.codec;

        return [videoCodec, audioCodec].filter(Boolean).join(',') || 'N/A';
      }
    },
    {
      name: 'MetricComponent',
      label: 'Framerate',
      valueExtractor: (player) => {
        const frameRate = extractVhsAttribute(player, 'FRAME-RATE') ??
          currentVideoTrack(player)?.configuration?.framerate;

        return frameRate ? `${frameRate} fps` : 'N/A';
      }
    },
    {
      name: 'MetricComponent',
      label: 'Total frames',
      valueExtractor: (player) => {
        const quality = player.getVideoPlaybackQuality();

        return quality.totalVideoFrames ?? 'N/A';
      }
    },
    {
      name: 'MetricComponent',
      label: 'Dropped frames',
      valueExtractor: (player) => {
        const quality = player.getVideoPlaybackQuality();

        return quality.droppedVideoFrames ?? 'N/A';
      }
    },
    {
      name: 'MetricComponent',
      label: 'Resolution',
      valueExtractor: (player) => {
        const resolution = extractVhsAttribute(player, 'RESOLUTION') ??
          currentVideoTrack(player)?.configuration;

        return resolution ? `${resolution.width}x${resolution.height}` : 'N/A';
      }
    },
    {
      name: 'MetricComponent',
      label: 'Timestamp',
      valueExtractor: () => new Date().toLocaleTimeString()
    }
  ]
};

videojs.registerComponent('PillarboxDebugPanel', PillarboxDebugPanel);

export default PillarboxDebugPanel;
