# Pillarbox Web: Thumbnail-Preview

ThumbnailPreview is a custom Video.js plugin that displays thumbnails extracted from a sprite sheet
when users hover through the progress control bar. It supports responsive scaling via
breakpoint-specific coefficients to dynamically adjusts based on player size.

## Requirements

To use this plugin, you need the following installed on your system:

- Node.js

## Quick Start

To get started with this plugin, install it through the following command:

```bash
npm install --save video.js @srgssr/thumbnail-preview
```

Once the player is installed you can activate the plugin as follows:

```javascript
import videojs from 'video.js';
import '@srgssr/thumbnail-preview';

const player = videojs('my-player', {
  plugins: {
    thumbnailPreview: {
      sprite: {
        rows: 1,
        columns: 10,
        thumbnailHeight: 100,
        thumbnailWidth: 100,
        interval: 10000,
        url: 'https://il.srgssr.ch/spritesheet/urn/rts/video/14683290/sprite-14683290.jpeg'
      }
    }
  }
});
```

To apply the default styling, add the following line to your CSS file:

```css
@import "@srgssr/thumbnail-preview/dist/thumbnail-preview.min.css";
```

### API Documentation

#### Methods

The following table outlines the key methods available in this plugin:

| Function               | Description                                                                                                          |
|------------------------|----------------------------------------------------------------------------------------------------------------------|
| `updateSprite(sprite)` | Updates the sprite sheet used for thumbnails. This is useful when switching sources or dynamically changing visuals. |
| `resetSprite()`        | Resets the current sprite configuration and deactivates the component. The thumbnail preview will be hidden.         |

#### Options

When initializing the `ThumbnailPreview` plugin, you can pass an `options` object to configure
its behavior:

| Option                   | Type                     | Default                              | Description                                                                                                     |
|--------------------------|--------------------------|--------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| `sprite`                 | `ThumbnailSpriteOptions` | [See below](#thumbnailspriteoptions) | Configuration for the sprite sheet used to display thumbnails.                                                  |
| `breakpointsCoeficients` | `BreakpointCoefficients` | [See below](#breakpointcoefficients) | Scaling factors per Video.js breakpoint for responsive thumbnail sizing.                                        |
| `displayThresholdHeight` | `number`                 | `395`                                | Minimum player height (in pixels) required to display the thumbnail preview. Below this, the preview is hidden. |
| `resetPositionDelay`     | `number`                 | `300`                                | Delay in milliseconds before resetting the thumbnail’s position after canceling.                                |

##### `ThumbnailSpriteOptions`

| Property          | Type     | Default | Description                                                              |
|-------------------|----------|---------|--------------------------------------------------------------------------|
| `url`             | `string` | `''`    | URL to the sprite image.                                                 |
| `rows`            | `number` | `1`     | Number of rows in the sprite grid.                                       |
| `columns`         | `number` | `1`     | Number of columns in the sprite grid.                                    |
| `thumbnailWidth`  | `number` | `0`     | Width of a single thumbnail in pixels.                                   |
| `thumbnailHeight` | `number` | `0`     | Height of a single thumbnail in pixels.                                  |
| `interval`        | `number` | `10000` | Time (in milliseconds) between each thumbnail frame in the sprite sheet. |

##### `BreakpointCoefficients`

| Key      | Type     | Default | Description                               |
|----------|----------|---------|-------------------------------------------|
| `huge`   | `number` | `1.7`   | Scale factor for the `huge` breakpoint.   |
| `xlarge` | `number` | `1.7`   | Scale factor for the `xlarge` breakpoint. |
| `large`  | `number` | `1.4`   | Scale factor for the `large` breakpoint.  |
| `medium` | `number` | `1.3`   | Scale factor for the `medium` breakpoint. |
| `small`  | `number` | `1.2`   | Scale factor for the `small` breakpoint.  |
| `xsmall` | `number` | `1.0`   | Scale factor for the `xsmall` breakpoint. |
| `tiny`   | `number` | `1.0`   | Scale factor for the `tiny` breakpoint.   |

### Workflow

* When the player emits the `emptied` event (typically when switching sources), the plugin
  **automatically becomes inactive**. You must **manually reinitialize** it (e.g. in a `loadstart`
  event handler) using `updateSprite()`.
* If the plugin is initialized without a `sprite.url`, the component starts in an **inactive** state
  and no thumbnail will be shown.
* Calling `updateSprite()` with a `null` or `undefined` URL also results in an **inactive**
  component.
* Calling `resetSprite()` will **deactivate** the component and hide the preview entirely.

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
