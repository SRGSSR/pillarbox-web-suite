# Pillarbox Web: Brand Button

The BrandButton component adds a customizable branding button that can be added directly into
video.js control bar. It allows integrators to define a destination URL and an SVG icon, providing
an easy way to redirect users to a branded website, app, or landing page.

## Requirements

To use this component, you need the following installed on your system:

- Node.js

## Quick Start

To get started with this component, install it through the following command:

```bash
npm install --save video.js @srgssr/brand-button
```

Once the player is installed you can activate the component as follows:

```javascript
import videojs from 'video.js';
import '@srgssr/brand-button';

// SVG Icon initialization
const icon = new DOMParser().parseFromString(
  '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><rect x="0" y="0" width="20" height="20" fill="red"/></svg>',
  'image/svg+xml'
).documentElement;

// Create the player with the BrandButton
const player = videojs('my-player', {
  controlBar: {
    brandButton: {
      href: 'https://example.com',
      title: 'Visit Example',
      icon
    }
  }
});
```

To apply the default styling, add the following line to your CSS file:

```css
@import "@srgssr/brand-button/dist/brand-button.min.css";
```

## API Documentation

### Options

When initializing the `BrandButton` component, you can pass an `options` object to customize its
behavior:

| Option   | Type                                   | Default                 | Description                                                                                     |
|----------|----------------------------------------|-------------------------|-------------------------------------------------------------------------------------------------|
| `title`  | `string`                               | `''`                    | The tooltip text displayed on hover. Will be localized based on the player's current language.  |
| `icon`   | `SVGElement`                           | `undefined`             | An optional SVG icon to display inside the button.                                              |
| `href`   | `string \| function(player) => string` | `''`                    | The URL for the button link, or a callback that receives the player instance and returns a URL. |
| `target` | `string`                               | `'_blank'`              | The `target` attribute of the link (`'_blank'`, `'_self'`, etc.).                               |
| `rel`    | `string`                               | `'noopener noreferrer'` | The `rel` attribute of the link, controlling link relationship and security.                    |

## Contributing

For detailed contribution guidelines, refer to our [Contributing guide][contributing-guide].
Please adhere to the specified guidelines.

### Setting up a development server

Start the development server:

```bash
npm run start
```

This will start the server on `http://localhost:4200`. Open this URL in your browser to view the
demo page.

The video player (`player`) and the Pillarbox library (`pillarbox`) are exposed on the `window`
object, making it easy to access and manipulate from the browser's developer console for debugging.

#### Available URL parameters

The demo page supports several URL parameters that modify the behavior of the video player:

- `debug`: Set this to enable debugging mode.
- `ilHost`: Specifies the host for the data provider.
- `language`: Sets the language for the player interface.
- `urn`: Specifies the URN of the video to load. Default is `urn:rts:video:14683290`.

You can combine parameters in the URL like so:

```plaintext
http://localhost:4200/?language=fr&urn=urn:rts:video:14318206
```

## Licensing

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more
details.

[contributing-guide]: https://github.com/SRGSSR/pillarbox-web-suite/blob/main/docs/README.md#contributing
