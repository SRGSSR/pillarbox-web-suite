/**
 * Parses an SVG string into an SVGElement after validating its structure.
 *
 * @param {string} svgString - A raw string expected to contain valid SVG markup.
 * @returns {SVGElement} - The root SVG element parsed from the string.
 * @throws {Error} If the input is not a valid SVG or doesn't have an <svg> root element.
 */
function stringToSvgElement(svgString) {
  const doc = new DOMParser().parseFromString(svgString, 'image/svg+xml');
  const root = doc.documentElement;

  if (!(root instanceof SVGElement)) {
    throw new Error('Parsed root is not an SVGElement');
  }

  return root;
}

/**
 * Fetches an SVG from a given URL and parses it into an SVGElement.
 *
 * @param {string} urlString - A URL pointing to an SVG resource.
 * @returns {Promise<SVGElement>} - A promise resolving to the parsed SVG element.
 * @throws {Error} If the fetch fails or the response is not a valid SVG.
 */
async function fetchSvgElement(urlString) {
  const res = await fetch(urlString, { mode: 'cors' });

  if (!res.ok) {
    throw new Error(`Failed to fetch SVG: ${res.status} ${res.statusText}`);
  }

  return stringToSvgElement(await res.text());
}

/**
 * Parses a string that might be a raw SVG or a URL pointing to an SVG.
 *
 * @param {string} icon - A trimmed string containing either an SVG element or a URL.
 * @returns {Promise<SVGElement>} - A promise resolving to the parsed SVG element.
 * @throws {Error} If the string is neither an SVG nor a valid URL.
 */
async function resolveSvgFromString(icon) {
  const trimmed = icon.trim();
  const url = URL.parse(trimmed);

  if (url) {
    return await fetchSvgElement(url.href);
  }

  if (trimmed.startsWith('<')) {
    return stringToSvgElement(trimmed);
  }

  throw new Error(`Provided string is not a URL or an SVG element: ${icon}`);
}

/**
 * Resolves an icon source to an SVGElement.
 *
 * Accepts:
 * - An actual SVGElement (returned as-is)
 * - A URL object (SVG fetched and parsed)
 * - A string (parsed as a URL or inline SVG)
 *
 * @param {SVGElement | string | URL} icon - The source of the SVG.
 * @returns {Promise<SVGElement>} - A promise resolving to the final SVGElement.
 * @throws {Error} If the input type is invalid or the SVG cannot be resolved.
 */
export default async function loadSvgElement(icon) {
  if (icon instanceof SVGElement) {
    return icon;
  }

  if (icon instanceof URL) {
    return await fetchSvgElement(icon.href);
  }

  if (typeof icon === 'string') {
    return await resolveSvgFromString(icon);
  }

  throw new Error(`Invalid icon type provided: ${icon}`);
}
