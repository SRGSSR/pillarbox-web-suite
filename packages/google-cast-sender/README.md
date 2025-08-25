# Pillarbox Web: GoogleCastSender

This plugin integrates Google Cast functionality into a video.js player, allowing users to stream
video content to a Chromecast device. It supports subtitle and audio track selection. It also allows
for custom source resolution, which is useful for integrations that play custom sources based on IDs
or other middleware logic. Finally it also supports live streams with DVR capabilities.

## Requirements

To use this plugin, you need the following installed on your system:

- Node.js

## Quick Start

To get started with this plugin, install it through the following command:

```bash
npm install --save video.js @srgssr/google-cast-sender
```

Once the player is installed you can activate the plugin as follows:

```javascript
import videojs from 'video.js';
import '@srgssr/google-cast-sender';
import '@srgssr/google-cast-sender/launcher';

const player = videojs('my-player', {
  techOrder: ['chromecast', 'html5'],
  plugins: {
    googleCastSender: true
  }
});
```

To apply the default styling, add the following line to your CSS file:

```css
@import "@srgssr/google-cast-sender/dist/google-cast-sender.min.css";
```

## API Documentation

### Options

The component's behavior can be customized by passing options during player initialization under the
`googleCastSender` key:

| Option                      | Type       | Default                                            | Description                                                                                         |
|-----------------------------|------------|----------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| `androidReceiverCompatible` | `boolean`  | `true`                                             | Indicates whether the receiver application is compatible with Android TV devices.                   |
| `autoJoinPolicy`            | `string`   | `chrome.cast.AutoJoinPolicy.TAB_AND_ORIGIN_SCOPED` | The policy for automatically joining a Cast session. See [AutoJoinPolicy docs][auto-join-policy].   |
| `enableDefaultCastLauncher` | `boolean`  | `true`                                             | Indicates whether the default `GoogleCastLauncher` component should be displayed in the controlBar. |                                                       
| `receiverApplicationId`     | `string`   | `chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID`  | The ID of the receiver application to use. The default receiver does not handle DRM content.        |
| `script`                    | `object`   | `{ id: 'gstatic_cast_sender', src: '...' }`        | Configuration for the Google Cast sender script.                                                    |
| `sourceResolver`            | `function` | `undefined`                                        | A function to resolve the source to be played on the cast device.                                   |

**Example:**

```javascript
const player = new videojs('my-player', {
  techOrder: ['chromecast', 'html5'],
  plugins: {
    googleCastSender: {
      receiverApplicationId: 'YOUR_APP_ID',
      sourceResolver: (source) => {
        // modify the source for the cast device
        return {
          ...source,
          src: source.src.replace('example.com', 'cast.example.com')
        };
      }
    }
  }
});
```

### User Interface

The plugin provides two ways to integrate a Cast button into your player.

#### 1. Chromecast Launcher (default)

This is the standard Google Cast launcher wrapped as a Video.js component. It is **plug-and-play**
and automatically manages Cast sessions.

* **Pros**: Zero configuration required.
* **Cons**: Limited customization and not fully accessible.

##### Disable the default launcher

To disable the default launcher simply use the `enableDefaultCastLauncher` property:

```javascript
const player = new videojs('my-player', {
  techOrder: ['chromecast', 'html5'],
  plugins: {
    googleCastSender: {
      enableDefaultCastLauncher: false
    }
  }
});
```

#### 2. Chromecast Button (customizable)

```js
import "@srgssr/google-cast-sender/button";
```

This is a custom button built on top of the shared [`SvgButton`][svg-button-api]component. All 
`SvgButton` options are supported.

| Option     | Type                          | Default     | Description                                                                                                                           |
|------------|-------------------------------|-------------|---------------------------------------------------------------------------------------------------------------------------------------|
| `icon`     | `SVGElement \| string \| URL` | `undefined` | An SVG icon to display inside the button. Can be an SVGElement, a raw SVG string, or a URL (string or URL object). Throws if invalid. |
| `iconName` | `string`                      | `'airplay'` | Used when SVG icon class integration is enabled (e.g., `vjs-icon-airplay`).                                                           |                                         

Example:

  ```js
  import icon from './cast-icon.svg?raw';

  const player = videojs('my-player', {
    techOrder: ['chromecast', 'html5'],
    controlBar: {
      googleCastButton: { icon }
    },
    plugins: {
      googleCastSender: {
        enableDefaultCastLauncher: false
      }
    }
  });
  ```

##### Placement & Removal

Since the `GoogleCastButton` component is automatically injected into the control bar, you can 
modify its placement like you would do with any other control bar component:

* **Disable via options**:

  ```js
  const player = videojs('my-player', {
    controlBar: {
      googleCastButton: false
    }
  });
  ```
* **Reorder manually**: update the `controlBar.children` array with your desired button order.

The default styles are included in the plugin’s CSS.

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

## Known issues

- Chromecast default button accessibility properties
- Live stream resume playback on local player

## Licensing

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more
details.

[auto-join-policy]: https://developers.google.com/cast/docs/reference/web_sender/chrome.cast#.AutoJoinPolicy
[contributing-guide]: https://github.com/SRGSSR/pillarbox-web-suite/blob/main/docs/README.md#contributing
[svg-button-api]: ../svg-button/README.md#api-documentation
