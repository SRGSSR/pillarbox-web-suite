# Pillarbox Web: Countdown Display

The Countdown Display is a reusable Video.js component for presenting a countdown overlay that leads
into a playback transition.

It wraps the countdown logic inside a modal dialog and integrates directly with the player
lifecycle, ensuring the countdown is started, reset, and cleaned up automatically when the player
state changes.

## Requirements

To use this component, you need the following installed on your system:

- Node.js

## Quick Start

To get started with this component, install it through the following command:

```bash
npm install --save video.js @srgssr/countdown-display
```

Once the player is installed you can activate the component as follows:

```javascript
import videojs from 'video.js';
import '@srgssr/countdown-display';

const player = videojs('my-player', { countdownDisplay: true });
player.countdownDisplay.start(Date.now() + timeout, { src: 'video.mp4', type: 'video/mp4' });
```

To apply the default styling, add the following line to your CSS file:

```css
@import "@srgssr/countdown-display/dist/countdown-display.min.css";
```

## API Documentation

### CountdownDisplay

`CountdownDisplay` component is the primary interface for displaying and controlling a countdown
component. It handles opening, closing, and resetting the countdown automatically when the player
starts, resets, disposes, or encounters an error.

### Options

The `CountdownDisplay` component can be configured with the following options:

| Option        | Type      | Default         | Description                                                                |
|---------------|-----------|-----------------|----------------------------------------------------------------------------|
| `pauseOnOpen` | `boolean` | `false`         | Whether playback pauses when the countdown modal opens.                    |
| `fillAlways`  | `boolean` | `true`          | Whether the modal always fills the player area.                            |
| `temporary`   | `boolean` | `false`         | Whether the modal is treated as temporary by Video.js.                     |
| `uncloseable` | `boolean` | `true`          | Prevents the countdown modal from being closed by user interaction.        |
| `children`    | `Array`   | `['Countdown']` | Child components rendered inside the display. See [Countdown](#countdown). |

### Methods

| Method                     | Description                                                                                                                                                |
|----------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `start(timestamp, source)` | Opens the countdown modal and starts counting down to the given timestamp. When the countdown reaches zero, the provided source is loaded into the player. |
| `reset()`                  | Stops the countdown and closes the modal dialog.                                                                                                           |

### Countdown

Manages countdown timing, periodic updates, and completion behavior.

#### Options

| Option     | Type    | Default                       | Description                                                                                        |
|------------|---------|-------------------------------|----------------------------------------------------------------------------------------------------|
| `children` | `Array` | Days, Hours, Minutes, Seconds | Defines which countdown units are rendered and in what order. See [CountdownUnit](#countdownunit). |

### CountdownUnit

Represents an individual time unit within the countdown (e.g. days, hours, minutes, seconds).

#### Options

| Option      | Type     | Default     | Description                                   |
|-------------|----------|-------------|-----------------------------------------------|
| `label`     | `string` | `undefined` | Label for the unit (localized automatically). |
| `separator` | `string` | `':'`       | Separator displayed after the unit value.     |

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
- `timeout`: Sets the timeout for the countdown in milliseconds. Default is `60000`.

You can combine parameters in the URL like so:

```plaintext
http://localhost:4200/?language=fr&urn=urn:rts:video:14318206
```

## Licensing

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more
details.

[contributing-guide]: https://github.com/SRGSSR/pillarbox-web-suite/blob/main/docs/README.md#contributing
