/**
 * The player options of the SRG SSR theme, to pass when creating a player.
 *
 * @see https://videojs.com/guides/options/
 * @see https://web.pillarbox.ch/api/tutorial-Options.html
 */
import srgSsrHotkeys from '@srgssr/srg-ssr-hotkeys';

export default {
  techOrder: ['chromecast', 'html5'],
  userActions: {
    hotkeys: srgSsrHotkeys
  },
  breakpoints: {
    tiny: 640,
    medium: Infinity
  },
  playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
  plugins: {
    googleCastSender: {
      enableDefaultCastLauncher: false,
      sourceResolver: (source) => {
        if (!source.mediaData) return source;

        return { src: source.mediaData.urn, type: 'srgssr/urn' };
      }
    }
  },
  titleBar: false,
  textTrackSettings: false,
  userPreferences: true,
  controlBar: {
    skipButtons: {
      forward: 10,
      backward: 10
    },
    children: [
      'airplayButton',
      {
        name: 'googleCastButton',
        idleIcon: { iconName: 'google-cast', icon: undefined },
        activeIcon: { iconName: 'google-cast-active', icon: undefined }
      },
      // The transport controls come first so that the audio only mode, the only
      // layout laid out by the flow, reads from left to right. The other
      // layouts place these children explicitly and ignore the DOM order.
      { name: 'skipBackward', className: 'vjs-skip-backward-button' },
      'playToggle',
      { name: 'skipForward', className: 'vjs-skip-forward-button' },
      'volumePanel',
      'currentTimeDisplay',
      {
        name: 'progressControl',
        seekBar: { playProgressBar: { timeTooltip: false } }
      },
      'durationDisplay',
      'seekToLive',
      'customControlSpacer',
      'audioTrackButton',
      'playbackRateButton',
      'subsCapsButton',
      'descriptionsButton',
      'chaptersButton',
      'pictureInPictureToggle',
      'fullscreenToggle'
    ]
  }
};
