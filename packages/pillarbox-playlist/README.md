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
import '@srgssr/pillarbox-playlist';
import '@srgssr/pillarbox-playlist/ui';

const player = new Pillarbox('my-player', {
  plugins: { 
    pillarboxPlaylist: { autoadvance: true, repeat: true },
    pillarboxPlaylistUI: true
  }
});

const playlist = [
  { sources: [{ src: 'video1.mp4', type: 'video/mp4' }], poster: 'poster1.jpg' },
  { sources: [{ src: 'video2.mp4', type: 'video/mp4' }], poster: 'poster2.jpg' }
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

The following table outlines the key methods available in the this plugin:

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
| `toggleRepeat(force?)`                 | Toggles the repeat mode of the player to the opposite of its current state, or sets it to the specified boolean value if provided.       |
| `toggleAutoadvance(force?)`            | Toggles the auto-advance mode of the player to the opposite of its current state, or sets it to the specified boolean value if provided. |

#### Options

When initializing the playlist plugin, you can pass an `options` object that configures the
behavior of the plugin. Here are the available options:

| Option                        | Type    | Default | Description                                                                                 |
|-------------------------------|---------|---------|---------------------------------------------------------------------------------------------|
| `playlist`                    | Array   | `[]`    | An array of playlist items to be initially loaded into the player.                          |
| `repeat`                      | Boolean | `false` | If true, the playlist will start over automatically after the last item ends.               |
| `autoadvance`                 | Boolean | `false` | If enabled, the player will automatically move to the next item after the current one ends. |
| `previousNavigationThreshold` | Number  | 3       | Threshold in seconds for determining the behavior when navigating to the previous item.     |

#### Properties

After initializing the plugin, you can modify or read these properties to control playlist behavior
dynamically:

| Property                      | Type    | Description                                                                                                                                   |
|-------------------------------|---------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| `repeat`                      | Boolean | Enables or disables repeating the playlist once the last item has played. Changes take effect immediately and apply to subsequent operations. |
| `autoadvance`                 | Boolean | Toggles automatic advancement to the next item when the current item ends.                                                                    |
| `previousNavigationThreshold` | Number  | Threshold in seconds for determining the behavior when navigating to the previous item.                                                       |

The following properties are read-only:

| Property       | Type   | Description                                                                                                                  |
|----------------|--------|------------------------------------------------------------------------------------------------------------------------------|
| `currentIndex` | Number | Retrieves the index of the currently playing item.                                                                           |
| `currentItem`  | Object | Retrieves the currently playing item.                                                                                        |
| `items`        | Array  | Retrieves all items in the playlist. Modifications to the returned array will not affect the internal state of the playlist. |

#### Events

The following event is emitted by the playlist plugin:

| Event          | Description                                                                                                                                                                    |
|----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `statechanged` | Triggered whenever there is a change in the playlist state. This event provides an object containing the properties that have changed, allowing you to react to these changes. |

**Event Payload:**

| Property  | Type   | Description                                                                                          |
|-----------|--------|------------------------------------------------------------------------------------------------------|
| `changes` | Object | An object containing the properties that have changed. Possible keys are `items` and `currentIndex`. |

**Example Usage:**

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

| Option                                                  | Type    | Default            | Description                                                                                                                                                                                                                                                 |
|---------------------------------------------------------|---------|--------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `insertChildBefore`                                     | String  | `fullscreenToggle` | The control bar child name before which the playlist button should be inserted.                                                                                                                                                                             |
| `pillarboxPlaylistMenuDialog`                           | Object  | `{}`               | Configuration for the modal dialog component. This can take any modal dialog options available in video.js. [See Video.js ModalDialog Documentation](https://docs.videojs.com/tutorial-modal-dialog.html)                                                   |
| `pillarboxPlaylistMenuDialog.pauseOnOpen`               | Boolean | `false`            | If true, the player will pause when the modal dialog is opened.                                                                                                                                                                                             |
| `pillarboxPlaylistMenuDialog.pillarboxPlaylistControls` | Object  | `{}`               | Configuration for the control buttons within the modal. You can define the order of the buttons, remove buttons you don't need, or add new ones. [See Video.js Component Children Documentation](https://videojs.com/guides/components/#component-children) |

***Example Usage***

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
      inserChildBefore: 'subsCapsButton',
      pillarboxPlaylistMenuDialog: {
        // Force the playback to pause when the modal is opened
        pauseOnOpen: true,
        // Remove the shuffle  button 
        pillarboxPlaylistControls: { pillarboxPlaylistShuffleButton: false }
      }
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

You can combine parameters in the URL like so:

```plaintext
http://localhost:4200/?language=fr
```

## Licensing

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more
details.

[contributing-guide]: https://github.com/SRGSSR/pillarbox-web-suite/blob/main/docs/README.md#contributing
