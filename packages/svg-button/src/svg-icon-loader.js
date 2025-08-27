import { loadSvgElement } from '@srgssr/web-suite-utils';

/**
 * Loads and appends an SVG icon into a Video.js component.
 *
 * @param {import('video.js').Component} component - The Video.js component instance.
 */
export async function appendSvgIcon(component) {
  const { icon, iconName } = component.options();
  const placeholder = component.el().querySelector('.vjs-icon-placeholder');

  if (iconName) component.setIcon(iconName);
  if (!icon) return;
  if (!placeholder) return;

  const svg = await loadSvgElement(icon);

  svg.classList.add('icon-from-options');
  placeholder.classList.add('vjs-svg-icon');
  placeholder.replaceChildren(svg);
}

