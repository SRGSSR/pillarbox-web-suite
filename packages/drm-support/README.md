# Pillarbox Web: DrmSupport

This plugin provides a tool to check the DRM (Digital Rights Management) and HDCP (High-bandwidth Digital Content Protection) capabilities of a user's browser. It helps in determining which DRM systems (like Widevine, PlayReady, FairPlay, and ClearKey) and what security levels are supported.

## Requirements

To use this plugin, you need the following installed on your system:

- Node.js

## Quick Start

To get started with this plugin, install it through the following command:

```bash
npm install --save video.js @srgssr/drm-support
```

Once the player is installed you can activate the plugin as follows:

```javascript
import videojs from 'video.js';
import '@srgssr/drm-support';

const player = videojs('my-player', { drmSupport: true });
```

## Usage

The `check` method allows verifying the DRM and HDCP capabilities of the browser. It returns a `Promise` that resolves to an object containing information about the supported DRM schemes and their respective security levels and HDCP versions.

An example of how to use the `check` method:

```javascript
import videojs from 'video.js';
import DrmSupport from '@srgssr/drm-support';

const player = videojs('my-player', { drmSupport: true });

player.drmSupport().check().then((results) => {
  console.log('DRM Support Results:', results);
  // Example output:
  // {
  //   widevine: { level: 'L1', hdcp: '2.2' },
  //   playReady: null,
  //   fairPlay: null,
  //   clearKey: { level: 'Supported', hdcp: null }
  // }
});
```

You can also provide options to the `check` method to specify the content type and initialization data types:

```javascript
player.drmSupport().check({
  contentType: 'video/mp4; codecs="avc1.4d401e"',
  initDataTypes: ['cenc', 'keyids']
}).then((results) => {
  console.log('DRM Support Results:', results);
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
