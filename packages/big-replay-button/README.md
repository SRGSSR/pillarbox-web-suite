# Pillarbox Web: Big-Replay-Button

A big replay button that appears when the media ends, allowing users to easily restart playback.
It integrates naturally with video.js, reusing the look and behavior of the standard big play
button, and ensuring accessibility support.

## Requirements

To use this component, you need the following installed on your system:

- Node.js

## Quick Start

To get started with this component, install it through the following command:

```bash
npm install --save video.js @srgssr/big-replay-button
```

Once the player is installed you can activate the component as follows:

```javascript
import videojs from 'video.js';
import '@srgssr/big-replay-button';

const player = videojs('my-player', { bigReplayButton: true });
```

To apply the default styling, add the following line to your CSS file:

```css
@import "@srgssr/big-replay-button/dist/big-replay-button.min.css";
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
