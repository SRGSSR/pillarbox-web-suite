import { loadSvgElement } from '@srgssr/web-suite-utils';
import videojs from 'video.js';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/utils/log.js').default}
 */
const log = videojs.log.createLogger('svg-icon-loader');

/**
 * Loads and appends an SVG icon into a Video.js component.
 *
 * @param {import('video.js').Component} component - The Video.js component instance.
 */
export function appendSvgIcon(component) {
  const { icon, iconName } = component.options();

  if (iconName) {
    component.setIcon(iconName);
  }

  if (!icon) {
    return;
  }

  loadSvgElement(icon).then(svg => {
    const placeholder = component.el().querySelector('.vjs-icon-placeholder');

    if (placeholder) {
      svg.classList.add('icon-from-options');
      placeholder.classList.add('vjs-svg-icon');
      placeholder.innerHTML = '';
      placeholder.appendChild(svg);
    }
  }, reason => {
    log.error(`There was a problem loading the provided SVG Icon`, reason);
  });
}
