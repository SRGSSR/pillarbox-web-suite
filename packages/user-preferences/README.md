# Pillarbox Web: UserPreferences

This component persists user preferences across sessions using the browser's `localStorage`. It saves and restores settings like volume, mute status, playback rate, selected text track, and selected audio track, providing a seamless playback experience.

## Requirements

To use this component, you need the following installed on your system:

- Node.js

## Quick Start

To get started with this component, install it through the following command:

```bash
npm install --save video.js @srgssr/user-preferences
```

Once the player is installed you can activate the component as follows:

```javascript
import videojs from 'video.js';
import '@srgssr/user-preferences';

const player = videojs('my-player', { userPreferences: true });
```

## API Documentation

The User Preferences component works automatically in the background after being imported and registered. There are no public methods or events intended for direct user interaction.

### Options

You can customize the component's behavior by passing options during player initialization under the `userPreferences` key:

| Option             | Type   | Default                                                                      | Description                                                                                                                             |
|--------------------|--------|------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| storageName        | String | `vjs-user-preferences`                                                       | The key used to store the preferences in `localStorage`.                                                                                |
| allowedPreferences | Object | `{ volume: true, muted: true, playbackRate: true, audioTrack: true, textTrack: true }` | An object specifying which preferences to save/restore. Keys: `volume`, `muted`, `playbackRate`, `audioTrack`, `textTrack`. Set a key to `false` to disable. |

**Example:**

```javascript
const player = new videojs('my-player', {
  userPreferences: {
    storageName: 'pillarbox-player-settings',
    allowedPreferences: {
      playbackRate: false
    }
  }
});
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
