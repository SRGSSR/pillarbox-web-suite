# Pillarbox Web: Share Button

The Share Button adds a share toggle on the top-right corner of a video.js player. Clicking it
opens a share modal anchored to the same corner, from which the user can share the media on
social networks, by email, or copy the link and the embed code.

## Requirements

To use this component, you need the following installed on your system:

- Node.js

## Quick Start

To get started with this component, install it through the following command:

```bash
npm install --save video.js @srgssr/share-button
```

Once the player is installed you can activate the component as follows:

```javascript
import videojs from 'video.js';
import '@srgssr/share-button';

const player = videojs('my-player', {
  shareToggle: true,
  shareModal: true
});
```

To apply the default styling, add the following line to your CSS file:

```css
@import "@srgssr/share-button/dist/share-button.min.css";
```

> [!TIP]
> The `ShareModal` must be added to the player by the integrator, the `ShareToggle` only opens it.
> This lets you open the modal from anywhere else, e.g. `player.getChild('ShareModal').open()`.

## API Documentation

The component adds 2 new components to the player:

- `ShareToggle`: the button that opens the modal. It extends the shared
  [`SvgButton`][svg-button-api] component, all `SvgButton` options are supported as well as the
  following defaults:

| Option        | Type     | Default   |
|---------------|----------|-----------|
| `controlText` | `string` | `'Share'` |
| `iconName`    | `string` | `'share'` |

- [`ShareModal`][share-modal]: a custom dialog that extends the `ModalDialog` class. It can take any
  modal dialog options available in video.js ([See Video.js ModalDialog Documentation][videojs-modal-doc])
  as well as the following options:

| Option                  | Type     | Default   | Description                                                                                |
|-------------------------|----------|-----------|--------------------------------------------------------------------------------------------|
| `title`                 | `string` | `'Share'` | The title displayed at the top of the modal, localized in the player language.             |
| `shareUrlOptions`       | `Object` | `{}`      | Configuration for the [`ShareUrlOptions`](#share-url-options) child component.             |
| `shareButtonCollection` | `Object` | `{}`      | Configuration for the [`ShareButtonCollection`](#share-button-collection) child component. |

### Share URL Options

The [`ShareUrlOptions`][share-url-options] component is a radio group selecting which URL is
shared. The selected option generates the media URL that each share button wraps for its own
platform.

| Option               | Type               | Default                                             | Description                                                                                            |
|----------------------|--------------------|-----------------------------------------------------|--------------------------------------------------------------------------------------------------------|
| `url`                | `string\|function` | `window.location.href`                              | The base URL used to generate the shared URL. Functions receive `(player, component, context)`.        |
| `includeCurrentTime` | `boolean`          | `false`                                             | Enables the option sharing the media at the current position, adding a `startTime` parameter.          |
| `defaultOption`      | `string`           | `'currentTime'` when enabled, `'episode'` otherwise | The initially selected option. Disabled options are never selected by default.                         |
| `options`            | `Object`           | `episode` and `currentTime`                         | The available options, each one declaring a `label`, a `title` and a `generateUrl(player, component)`. |

Set an entry of `options` to `false` to remove it. An entry may also declare
`isHidden(player, component)` to leave the option out of the group entirely, and
`isDisabled(player, component)` — or a static `disabled` boolean — to render it as a disabled radio.
Both are re-evaluated on `timeupdate`, and the group falls back to the default option when the
selected one becomes disabled.

When `url` is a function, the `context` argument exposes available media information without
imposing any application-specific URL format:

| Context property     | Description                                                                      |
|----------------------|----------------------------------------------------------------------------------|
| `currentSource`      | Result of `player.currentSource()` when available.                               |
| `mediaData`          | `currentSource.mediaData` when available.                                        |
| `mainChapter`        | Result of `mediaComposition.getMainChapter()` when available.                    |
| `currentMedia`       | `mainChapter`, falling back to `mediaData`.                                      |
| `subdivisions`       | Result of `mediaComposition.getSubdivisions()` when available.                   |
| `currentSubdivision` | Current non-blocked subdivision matching `player.currentTime()`, when available. |
| `currentTime`        | Result of `player.currentTime()`.                                                |
| `title`              | Title of `currentMedia` when available.                                          |

### Share Button Collection

The [`ShareButtonCollection`][share-button-collection] component contains the platform buttons as
its children:

| Button                | Default `label` | Default `title`       |
|-----------------------|-----------------|-----------------------|
| `facebookShareButton` | `'Facebook'`    | `'Share on Facebook'` |
| `xShareButton`        | `'X'`           | `'Share on X'`        |
| `linkedinShareButton` | `'LinkedIn'`    | `'Share on LinkedIn'` |
| `whatsappShareButton` | `'WhatsApp'`    | `'Share on WhatsApp'` |
| `emailShareButton`    | `'E-mail'`      | `'Share by email'`    |
| `copyLinkShareButton` | `'Copy link'`   | `'Copy link'`         |
| `embedShareButton`    | `'Embed'`       | `'Embed'`             |

You can define the order of the buttons, remove buttons you don't need, or add new ones.
[See Video.js Component Children Documentation][videojs-children-doc]. The collection also accepts
the following option:

| Option      | Type                                 | Default          | Description                                                                      |
|-------------|--------------------------------------|------------------|----------------------------------------------------------------------------------|
| `shareText` | `string \| function(player, button)` | `document.title` | The text shared alongside the URL by every button, unless overridden per button. |

### Share Button

Each button extends the shared [`SvgComponent`][svg-component-api] component. All `SvgComponent`
options are supported as well as the following options:

| Option           | Type                                  | Default                 | Description                                                                   |
|------------------|---------------------------------------|-------------------------|-------------------------------------------------------------------------------|
| `label`          | `string`                              | Platform label          | The visible label displayed below the icon, localized in the player language. |
| `title`          | `string`                              | Platform title          | The accessible title of the link, localized in the player language.           |
| `buildUrl`       | `function(url, text, player, button)` | Platform URL            | Builds the platform URL from the generated media URL and the share text.      |
| `shareText`      | `string \| function(player, button)`  | `undefined`             | Overrides the collection `shareText` for this button.                         |
| `target`         | `string`                              | `'_blank'`              | The `target` attribute of the link.                                           |
| `rel`            | `string`                              | `'noopener noreferrer'` | The `rel` attribute of the link.                                              |
| `buildEmbedCode` | `function(url, player, button)`       | An `iframe` snippet     | `EmbedShareButton` only, builds the embed code copied to the clipboard.       |

To add a button that does not exist in the package, create a component extending
[`ShareButton`][share-button], register it, then include it in the collection `children`.

### Events

The following event is emitted by the share buttons:

| Event   | Description                                                                                      |
|---------|--------------------------------------------------------------------------------------------------|
| `share` | Triggered when a share button is activated. The event bubbles up to the modal and to the player. |

### Usage Example

```javascript
import videojs from 'video.js';
import { ShareButton } from '@srgssr/share-button';

// Add a custom share button
class CustomShareButton extends ShareButton {}

CustomShareButton.prototype.options_ = videojs.obj.merge(ShareButton.prototype.options_, {
  className: 'vjs-share-button-custom',
  label: 'Custom',
  title: 'Share on Custom',
  icon: '<svg>...</svg>',
  buildUrl: url => `https://custom.example/share?u=${encodeURIComponent(url)}`
});

videojs.registerComponent('CustomShareButton', CustomShareButton);

const player = videojs('my-player', {
  // Customize the look of the share button
  shareToggle: { iconName: 'square' },
  // Change the modal options
  shareModal: {
    // Force the playback to pause when the modal is opened
    pauseOnOpen: true,
    shareUrlOptions: {
      // Let the user share the media at the current position
      includeCurrentTime: true
    },
    shareButtonCollection: {
      // Share a custom text instead of the page title
      shareText: player => `Watch ${player.currentSrc()}`,
      // Remove the X button
      xShareButton: false,
      // Customize the Facebook button
      facebookShareButton: { title: 'Share this video on Facebook' },
      // Add the custom button
      customShareButton: true
    }
  }
});

// React to share actions
player.on('share', ({ target }) => console.log('Shared through', target.className));
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
- `urn`: Specifies the URN of the video to load. Default is `urn:rts:video:8841634`.

You can combine parameters in the URL like so:

```plaintext
http://localhost:4200/?language=fr&urn=urn:rts:video:14318206
```

## Licensing

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more
details.

[contributing-guide]: https://github.com/SRGSSR/pillarbox-web-suite/blob/main/docs/README.md#contributing
[svg-button-api]: ../svg-button/README.md#api-documentation
[svg-component-api]: ../svg-button/README.md#api-documentation
[videojs-modal-doc]: https://docs.videojs.com/tutorial-modal-dialog.html
[videojs-children-doc]: https://videojs.com/guides/components/#component-children
[share-modal]: ./src/share-modal.js
[share-url-options]: ./src/share-url-options.js
[share-button-collection]: ./src/share-button-collection.js
[share-button]: ./src/share-button.js
