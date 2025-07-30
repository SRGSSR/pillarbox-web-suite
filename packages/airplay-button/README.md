# Pillarbox Web: Airplay-Button

A Video.js component that adds native Apple AirPlay support. Shows a configurable AirPlay icon in
the control bar when AirPlay is available, and opens the system picker on click.

## Requirements

To use this button, you need the following installed on your system:

- Node.js

## Quick Start

To get started with this button, install it through the following command:

```bash
npm install --save video.js @srgssr/airplay-button
```

Once the player is installed you can activate the button as follows:

```javascript
import videojs from 'video.js';
import '@srgssr/airplay-button';
// (Optional) Import the provided SVG
import airplayIcon from '@srgssr/airplay-button/assets/airplay.svg?raw';

const player = videojs('my-player');
const controlBar = player.controlBar;

// Add the AirPlay button to the control bar, placing it second to last
controlBar.addChild('AirplayButton', { icon: airplayIcon }, controlBar.children().length - 1);
```

To apply the default styling, add the following line to your CSS file:

```css
@import "@srgssr/airplay-button/dist/airplay-button.min.css";
```

## API Documentation

### Options

When initializing the `AirplayButton` component, you can pass an `options` object to customize its
behavior:

| Option | Type                          | Default     | Description                                                                                                                           |
|--------|-------------------------------|-------------|---------------------------------------------------------------------------------------------------------------------------------------|
| `icon` | `SVGElement \| string \| URL` | `undefined` | An SVG icon to display inside the button. Can be an SVGElement, a raw SVG string, or a URL (string or URL object). Throws if invalid. |

### Icon Integration

The `AirplayButton` supports multiple strategies for integrating a custom icon, depending on your
project setup and preferences:

#### 1. Using SVG Icon Class (with experimental SVG icons)

If your project uses Video.js’s [experimental SVG icon support][experimental-svg], the button
automatically includes the `vjs-icon-airplay` class, simply register an icon named `airplay` in your
SVG icon set.

#### 2. Using a Custom Font Icon

If your project uses an icon font (such as Font Awesome or a custom font), you can style the Airplay
button via CSS:

```css
.vjs-airplay-button .vjs-icon-placeholder::before {
  content: '\f123'; /* Your font icon’s Unicode */
  font-family: 'YourCustomFont';
}
```

#### 3. Providing an Icon via Options

You can also pass a custom icon directly using the `icon` option. This works regardless of whether
experimental SVG support is enabled. Accepted formats are:

* An `SVGElement` instance.
* A raw inline SVG string.
* A URL pointing to an external SVG file (as a string or `URL` object)

> [!TIP]
> An AirPlay icon is included with this package under the assets/ directory and can be used
> directly.

Example (using the built-in icon):

```js
import airplayIcon from '@srgssr/assets/airplay.svg?raw';

player.controlBar.addChild('AirplayButton', { icon: airplayIcon });
```

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

[experimental-svg]: https://videojs.com/guides/options/#experimentalsvgicons
