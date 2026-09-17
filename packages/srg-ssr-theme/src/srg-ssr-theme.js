import '@srgssr/airplay-button';
import '@srgssr/google-cast-sender';
import '@srgssr/google-cast-sender/button';
import '@srgssr/live-dvr-time-display';
import '@srgssr/user-preferences';
import './playback-rate-button.js';
import { version } from '../package.json';

import options from './player-options.js';

/**
 * The SRG SSR theme for the Pillarbox player.
 *
 * @example
 * import pillarbox from '@srgssr/pillarbox-web';
 * import SrgSsrTheme from '@srgssr/srg-ssr-theme';
 *
 * const player = pillarbox('my-player', SrgSsrTheme.options);
 *
 * @example
 * // Override some of the theme options
 * const player = pillarbox('my-player', pillarbox.obj.merge(SrgSsrTheme.options, {
 *   playbackRates: [0.5, 1, 2]
 * }));
 *
 * @example
 * // Audio only mode
 * const player = pillarbox('my-player', pillarbox.obj.merge(SrgSsrTheme.options, {
 *   audioOnlyMode: true
 * }));
 *
 * @property {Object} options The player options of the theme.
 * @property {string} VERSION The version of the theme.
 */
const SrgSsrTheme = {
  options,
  VERSION: version
};

export default SrgSsrTheme;
