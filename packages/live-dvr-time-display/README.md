# Pillarbox Web: Live DVR Time Display

Live DVR Time Display is a component that overrides the default behaviors of the video.js
`CurrentTimeDisplay` and `TimeTooltip` components, allowing to display the time
corresponding to the position in the progress bar in a live stream with DVR.

> [!NOTE]
> The seconds have been deliberately removed from the `CurrentTimeDisplay`
> display to avoid any sudden changes that may occur when the buffer is updated.
> `TimeTooltip` displays the seconds when the mouse is over the progress bar.

## Requirements

To use this component, you need the following installed on your system:

- Node.js

## Quick Start

To get started with this component, install it through the following command:

```bash
npm install --save video.js @srgssr/live-dvr-time-display
```

Once the player is installed you can activate the component as follows:

```javascript
import videojs from 'video.js';
import '@srgssr/live-dvr-time-display';

const player = videojs('my-player');
```

To apply the default styling, add the following line to your CSS file:

```css
@import "@srgssr/live-dvr-time-display/dist/live-dvr-time-display.min.css";
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
