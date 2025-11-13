import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadSvgElement } from '../src/index.js';

describe('loadSvgElement', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return the same SVGElement if passed directly', async() => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    svg.setAttribute('viewBox', '0 0 100 100');
    expect(await loadSvgElement(svg)).toBe(svg);
  });

  it('should parse a raw SVG string into an SVGElement', async() => {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5"/></svg>`;
    const result = await loadSvgElement(svgString);

    expect(result).toBeInstanceOf(SVGElement);
    expect(result.tagName.toLowerCase()).toBe('svg');
    expect(result.querySelector('circle')).not.toBeNull();
  });

  it('should throw an error for an invalid SVG string', async() => {
    const invalidSvg = `<div>Not an SVG</div>`;

    await expect(loadSvgElement(invalidSvg)).rejects.toThrow('Parsed root is not an SVGElement');
  });

  it('should fetch and parse an SVG from a URL', async() => {
    const fakeSvg = `<svg xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10"/></svg>`;

    // Mock global fetch
    vi.stubGlobal('fetch', vi.fn(async() => ({
      ok: true,
      status: 200,
      statusText: 'OK',
      text: async() => fakeSvg,
    })));

    const fakeUrl = new URL('https://example.com/icon.svg');
    const result = await loadSvgElement(fakeUrl);

    expect(fetch).toHaveBeenCalledExactlyOnceWith(fakeUrl.href, { mode: 'cors' });
    expect(result).toBeInstanceOf(SVGElement);
    expect(result.querySelector('rect')).not.toBeNull();
  });

  it('should throw an error when fetch returns a non-OK response', async() => {
    vi.stubGlobal('fetch', vi.fn(async() => ({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      text: async() => 'Not Found',
    })));

    const url = new URL('https://example.com/missing-icon.svg');

    await expect(loadSvgElement(url)).rejects.toThrow('Failed to fetch SVG: 404 Not Found');
  });

  it('should throw an error for an invalid input type', async() => {
    const invalidInputs = [null, undefined, 42, {}, [], true];

    for (const input of invalidInputs) {
      // We stringify in the message, so allow the dynamic message
      await expect(loadSvgElement(input)).rejects.toThrow(`Invalid icon type provided: ${input}`);
    }
  });

  it('should throw an error if string is neither a valid URL nor an SVG element string', async() => {
    const invalidString = 'not a url and not svg';

    await expect(loadSvgElement(invalidString)).rejects.toThrow(
      `Provided string is not a URL or an SVG element: ${invalidString}`
    );
  });

  it('should fetch SVG if string is a valid URL but fail if fetch response is invalid SVG', async() => {
    const invalidSvg = `<div>Not an SVG</div>`;

    vi.stubGlobal('fetch', vi.fn(async() => ({
      ok: true,
      status: 200,
      statusText: 'OK',
      text: async() => invalidSvg,
    })));

    const urlString = 'https://example.com/fake.svg';

    await expect(loadSvgElement(urlString)).rejects.toThrow('Parsed root is not an SVGElement');
    expect(fetch).toHaveBeenCalledExactlyOnceWith(urlString, { mode: 'cors' });
  });

});
