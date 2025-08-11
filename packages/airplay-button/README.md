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

The `AirplayButton` extends the shared [`SvgButton`][svg-button-api] component. All `SvgButton`
options are supported.

### AirplayButton-specific defaults:

| Option     | Type                          | Default     | Description                                                                                                                           |
|------------|-------------------------------|-------------|---------------------------------------------------------------------------------------------------------------------------------------|
| `icon`     | `SVGElement \| string \| URL` | `undefined`  | An SVG icon to display inside the button. Can be an SVGElement, a raw SVG string, or a URL (string or URL object). Throws if invalid. |
| `iconName` | `string`                      | `'airplay'` | Used when SVG icon class integration is enabled (e.g., `vjs-icon-airplay`).                                                           |                                         

> [!TIP]
> You can customize the `AirplayButton` icon by:
> - Passing an `iconName` or using the default `airplay` (for Video.js experimental SVG icons),
> - Styling the `.vjs-icon-placeholder` via CSS (for font icons), or
> - Providing a custom icon option as an SVGElement, raw SVG string, or SVG file URL.

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

[svg-button-api]: ../svg-button/README.md#api-documentation
