import { loadSvgElement } from '@srgssr/web-suite-utils';

/**
 * Loads and appends an SVG icon into a Video.js component.
 *
 * @param {import('video.js').Component} component - The Video.js component instance.
 */
export async function appendSvgIcon(component) {
  const { icon, iconName } = component.options();

  if (iconName) component.setIcon(iconName);

  const placeholder = component.el().querySelector('.vjs-icon-placeholder');

  if (iconName && placeholder) placeholder.classList.toggle(`vjs-icon-${iconName}`, true);

  await insertSvgIcon(icon, placeholder);
}

async function insertSvgIcon(icon, placeholder) {
  if (!icon || !placeholder) return;

  const svg = await loadSvgElement(icon);

  svg.classList.add('icon-from-options');
  placeholder.classList.add('vjs-svg-icon');
  placeholder.replaceChildren(svg);
}

