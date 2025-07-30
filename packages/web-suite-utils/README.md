# Pillarbox Web: WebSuiteUtils

`@srgssr/web-suite-utils` is a lightweight utility library used across Pillarbox Web components and
plugins. It contains shared helper functions and modules designed to reduce duplication and promote
consistency across the suite.

## Requirements

To use this component, you need the following installed on your system:

- Node.js

## Quick Start

To get started with this component, install it through the following command:

```bash
npm install --save @srgssr/web-suite-utils
```

## API Documentation

### `loadSvgElement(icon)`

Resolves an icon source to an `SVGElement`. Useful for dynamic or flexible icon handling.

| Parameter | Type                          | Description                                                                                          |
|-----------|-------------------------------|------------------------------------------------------------------------------------------------------|
| `icon`    | `SVGElement \| string \| URL` | Source of the SVG. Can be an actual `SVGElement`, a raw SVG string, a URL string, or a `URL` object. |

**Returns:**
A `Promise<SVGElement>` resolving to the parsed and validated SVG element.

**Throws:**
If the input is of an unsupported type or the SVG cannot be parsed (e.g., malformed XML, unreachable
URL, or invalid root tag).

#### Icon Input Formats

The utility supports a variety of input formats:

- SVGElement
  ```js
  const myIcon = document.querySelector('svg');
  const svg = await loadSvgElement(myIcon); // Returned as-is
  ```

- Inline SVG string
  ```js
  const svg = await loadSvgElement('<svg><rect width="20" height="20" /></svg>');
  ```

- URL (string or URL object)
 ```js
  const svg = await loadSvgElement('https://example.com/icon.svg');

  // Or with a URL object
  const iconUrl = new URL('https://example.com/icon.svg');
  const svg = await loadSvgElement(iconUrl);
  ```

## Contributing

For detailed contribution guidelines, refer to our [Contributing guide][contributing-guide].
Please adhere to the specified guidelines.

## Licensing

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more
details.

[contributing-guide]: https://github.com/SRGSSR/pillarbox-web-suite/blob/main/docs/README.md#contributing
