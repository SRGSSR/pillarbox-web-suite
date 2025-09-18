# Pillarbox Web: Playlist Plugin

This plugin extends the pillarbox-web player with playlist management capabilities. It allows to
load, manage, and control playback of a sequence of videos with options for auto-advancing,
repeating content, and dynamic playlist modification.

## Requirements

To use this plugin, you need the following installed on your system:

- Node.js

## Quick Start

To get started with this plugin, install it through the following command:

```bash
npm install --save @srgssr/pillarbox-web @srgssr/pillarbox-playlist
```

For instructions on setting up Pillarbox, see
the [Quick Start guide](https://github.com/SRGSSR/pillarbox-web#quick-start).

Once the player is installed you can activate the plugin as follows:

```javascript
import Pillarbox from '@srgssr/pillarbox-web';
import { RepeatMode } from '@srgssr/pillarbox-playlist';
import '@srgssr/pillarbox-playlist/ui';

const player = new Pillarbox('my-player', {
  plugins: {
    pillarboxPlaylist: {
      autoadvance: true,
      repeat: RepeatMode.REPEAT_ALL
    },
    pillarboxPlaylistUI: true
  }
});

const playlist = [
  {
    sources: [{ src: 'video1.mp4', type: 'video/mp4' }],
    poster: 'poster1.jpg'
  },
  {
    sources: [{ src: 'video2.mp4', type: 'video/mp4' }],
    poster: 'poster2.jpg'
  }
];

player.playlistPlugin().load(playlist);
```

To apply the default styling, add the following line to your CSS file:

```css
@import "@srgssr/pillarbox-playlist/dist/pillarbox-playlist.min.css";
```

> [!TIP]
> To opt-out of the default UI, simply remove the `pillarboxPlaylistUI` plugin from the player
> configuration.

### API Documentation

#### Methods

The following table outlines the key methods available in this plugin:

| Function                               | Description                                                                                                                              |
|----------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| `load(items)`                          | Initializes the playlist with the given items and starts playback from the first item.                                                   |
| `push(...items)`                       | Adds new items to the end of the current playlist.                                                                                       |
| `splice(start, deleteCount, ...items)` | Modifies the playlist by adding, removing, or replacing items. Adjusts the current index if necessary.                                   |
| `clear()`                              | Clears the internal playlist. Does not stop or unload the currently playing media.                                                       |
| `reverse()`                            | Reverses the order of the items in the playlist. Adjusts the current index if necessary.                                                 |
| `sort(compareFn?)`                     | Sorts the items in the playlist using the provided compare function. Adjusts the current index if necessary.                             |
| `next()`                               | Advances to the next item in the playlist, with support for repeat mode.                                                                 |
| `previous()`                           | Navigates to the previous item or restarts the current item based on playback position and threshold.                                    |
| `shuffle()`                            | Randomizes the order of the playlist items using the Fisher-Yates shuffle algorithm.                                                     |
| `select(index)`                        | Selects and plays the item at the specified index in the playlist.                                                                       |
| `toggleRepeat(force?)`                 | Cycles through the repeat mode of the player, or sets it to the specified value if provided.                                             |
| `toggleAutoadvance(force?)`            | Toggles the auto-advance mode of the player to the opposite of its current state, or sets it to the specified boolean value if provided. |

#### Options

When initializing the playlist plugin, you can pass an `options` object that configures the
behavior of the plugin. Here are the available options:

| Option                        | Type                             | Default | Description                                                                                 |
|-------------------------------|----------------------------------|---------|---------------------------------------------------------------------------------------------|
| `playlist`                    | [`PlaylistItem](#playlistitem)[] | `[]`    | An array of playlist items to be initially loaded into the player.                          |
| `repeat`                      | `number`                         | 0       | Set the repeat mode of the playlist: 0 - No Repeat, 1 - Repeat All, 2 - Repeat one.         |
| `autoadvance`                 | `boolean`                        | `false` | If enabled, the player will automatically move to the next item after the current one ends. |
| `previousNavigationThreshold` | `number`                         | 3       | Threshold in seconds for determining the behavior when navigating to the previous item.     |

#### Properties

After initializing the plugin, you can modify or read these properties to control playlist behavior
dynamically:

| Property                      | Type      | Description                                                                                  |
|-------------------------------|-----------|----------------------------------------------------------------------------------------------|
| `repeat`                      | `number`  | Changes the repeat mode of the playlist: 0 - No Repeat, 1 - Repeat All, 2 - Repeat one.    . |
| `autoadvance`                 | `boolean` | Toggles automatic advancement to the next item when the current item ends.                   |
| `previousNavigationThreshold` | `number`  | Threshold in seconds for determining the behavior when navigating to the previous item.      |

The following properties are read-only:

| Property       | Type                              | Description                                                                                                                  |
|----------------|-----------------------------------|------------------------------------------------------------------------------------------------------------------------------|
| `currentIndex` | `number`                          | Retrieves the index of the currently playing item.                                                                           |
| `currentItem`  | [`PlaylistItem`](#playlistitem)   | Retrieves the currently playing item.                                                                                        |
| `items`        | [`PlaylistItem`](#playlistitem)[] | Retrieves all items in the playlist. Modifications to the returned array will not affect the internal state of the playlist. |

#### PlaylistItem

Represents a single item in the playlist.

| Property  | Type     | Description                                                                                                      |
|-----------|----------|------------------------------------------------------------------------------------------------------------------|
| `sources` | `any[]`  | The array of media sources for the playlist item.                                                                |
| `poster`  | `string` | A URL for the poster image.                                                                                      |
| `data`    | `Object` | Metadata for the playlist item, where you can store fields like `title`, `duration`, or other custom properties. |

#### Constants

The following table outlines the key constants available in this plugin:

| Constant                | Description                                                                                                                                                                             |
|-------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `RepeatMode.NO_REPEAT`  | Disables repeat mode.                                                                                                                                                                   |
| `RepeatMode.REPEAT_ALL` | Loops the entire playlist. Once the last element of the playlist ends, the next element will be the first one. This mode only works forwards, i.e., when advancing to the next element. |
| `RepeatMode.REPEAT_ONE` | Loops the currently playing item in the playlist.                                                                                                                                       |

#### Events

The following event is emitted by the playlist plugin:

| Event          | Description                                                                                                                                                                    |
|----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `statechanged` | Triggered whenever there is a change in the playlist state. This event provides an object containing the properties that have changed, allowing you to react to these changes. |

**Event Payload:**

| Property               | Type                              | Description                                                                     |
|------------------------|-----------------------------------|---------------------------------------------------------------------------------|
| `changes.items`        | [`PlaylistItem[]`](#playlistitem) | The updated array of playlist items (if the playlist content has changed).      |
| `changes.currentIndex` | `number`                          | The new index of the currently selected item (if the current item has changed). |

##### `stagechanged` Usage Example

```javascript
player.playlistPlugin().on('statechanged', ({ changes }) => {
  if ('items' in changes) {
    // React to 'items' changes
  }

  if ('currentIndex' in changes) {
    // React to 'currentIndex' changes
  }
});
```

#### User Interface

As seen before, this library contains an additional plugin that provides a customizable user
interface for the playlist.

##### Options

When initializing the playlist-ui plugin, you can pass an `options` object that configures the
behavior of the plugin. Here are the available options:

| Option              | Type   | Default            | Description                                                                     |
|---------------------|--------|--------------------|---------------------------------------------------------------------------------|
| `insertChildBefore` | String | `fullscreenToggle` | The control bar child name before which the playlist button should be inserted. |

The plugin automatically adds 2 new components to the player:

- [`PillarboxPlaylistMenuDialog`][pillarbox-playlist-modal]: a custom
  dialog that extends the ModalDialog class. This component is added to the root options of the
  player, it can take any modal dialog options available in
  video.js ([See Video.js ModalDialog Documentation][videojs-modal-doc]) as well as the following
  options:

| Option                      | Type      | Default                     | Description                                                                                                                                                                                                                                                 |
 |-----------------------------|-----------|-----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `pauseOnOpen`               | `boolean` | `false`                     | If true, the player will pause when the modal dialog is opened.                                                                                                                                                                                             |
| `pillarboxPlaylistControls` | `Object`  | `{}`                        | Configuration for the control buttons within the modal. You can define the order of the buttons, remove buttons you don't need, or add new ones. [See Video.js Component Children Documentation](https://videojs.com/guides/components/#component-children) |
| `itemComponentName`         | `string`  | `PillarboxPlaylistMenuItem` | Name of the Video.js Component used to render each playlist item. Allows replacing the default playlist item component. The specified component must be registered with Video.js via `videojs.registerComponent` before the dialog is created.              |

- [`PillarboxPlaylistButton`][pillarbox-playlist-button.js] And [`SvgButton`][svg-button-api]
  component added to the `controlBar` with the following default options:

| Option        | Type   | Default    |
 |---------------|--------|------------|
| `iconName`    | String | `chapters` |
| `controlText` | String | `Playlist` |

###### Playlist Controls API

The [`PillarboxPlaylistControls`][pillarbox-playlist-controls] component contains four children:

| Button                                | Default `iconName` |
|---------------------------------------|--------------------|
| `pillarboxPlaylistRepeatButton`       | `'repeat'`         | 
| `pillarboxPlaylistShuffleButton`      | `'shuffle'`        | 
| `pillarboxPlaylistPreviousItemButton` | `'previous-item'`  | 
| `pillarboxPlaylistNextItemButton`     | `'next-item`       |

Each button extends the shared [`SvgButton`][svg-button-api] component. All `SvgButton` options are
supported.

##### Playlist Item UI Data

The playlist ui plugin uses the [`PlaylistItem`](#playlistitem) objects provided by the core
plugin.

The following fields in `item.data` are recognized and displayed automatically in the UI:

| Property   | Type     | Description                                      |
|------------|----------|--------------------------------------------------|
| `title`    | `string` | The title displayed in the playlist menu.        |
| `duration` | `number` | The duration (in seconds) shown in the playlist. |

Any additional properties stored in `item.data` are ignored by the UI but remain available for
custom usage.

##### Playlist UI Plugin Usage Example

```javascript
import Pillarbox from '@srgssr/pillarbox-web';
import '@srgssr/pillarbox-playlist';
import '@srgssr/pillarbox-playlist/ui';

const player = new Pillarbox('my-player', {
  plugins: {
    // Include the playlist plugin 
    pillarboxPlaylist: true,
    // Include the playlist UI plugin
    pillarboxPlaylistUI: {
      // Change the placement of the playlist button
      inserChildBefore: 'subsCapsButton'
    }
  },
  // Change the Dialog options
  pillarboxPlaylistMenuDialog: {
    // Force the playback to pause when the modal is opened
    pauseOnOpen: true,
    // Remove the shuffle  button 
    pillarboxPlaylistControls: { pillarboxPlaylistShuffleButton: false }
  },
  // Customize the look of the playlist button
  controlBar: {
    pillarboxPlaylistButton: { iconName: 'square' }
  }
});

// Build a playlist with titles and durations
const playlist = [
  {
    sources: [{ src: 'video1.mp4', type: 'video/mp4' }],
    poster: 'poster1.jpg',
    data: { title: 'Big Buck Bunny', duration: 596 }
  },
  {
    sources: [{ src: 'video2.mp4', type: 'video/mp4' }],
    poster: 'poster2.jpg',
    data: { title: 'Sintel', duration: 888 }
  }
];

player.playlistPlugin().load(playlist);
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

You can combine parameters in the URL like so:

```plaintext
http://localhost:4200/?language=fr
```

## Licensing

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more
details.

[contributing-guide]: https://github.com/SRGSSR/pillarbox-web-suite/blob/main/docs/README.md#contributing
[svg-button-api]: ../svg-button/README.md#api-documentation
[pillarbox-playlist-modal]: ./src/components/modal/pillarbox-playlist-modal.js
[videojs-modal-doc]: https://docs.videojs.com/tutorial-modal-dialog.html
[pillarbox-playlist-controls]: ./src/components/modal/pillarbox-playlist-controls.js
[pillarbox-playlist-button]: ./src/components/pillarbox-playlist-button.js
