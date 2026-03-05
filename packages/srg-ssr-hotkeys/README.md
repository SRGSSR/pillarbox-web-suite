# Pillarbox Web: SrgSsrHotkeys

Add support for keyboard shortcuts to control the player as defined by the SRG SSR.

> [!IMPORTANT]
> Some keyboard shortcuts were not implemented because they are deprecated or
> conflict with browser shortcuts.


## Requirements

To use this component, you need the following installed on your system:

- Node.js

## Quick Start

To get started with this component, install it through the following command:

```bash
npm install --save @srgssr/pillarbox-web @srgssr/srg-ssr-hotkeys
```

For instructions on setting up Pillarbox, see
the [Quick Start guide](https://github.com/SRGSSR/pillarbox-web#quick-start).

Once the player is installed you can activate the component as follows:

```javascript
import pillarbox from '@srgssr/pillarbox-web';
import srgSsrHotkeys from '@srgssr/srg-ssr-hotkeys';

const player = pillarbox('my-player', {
  userActions: {
    hotkeys: srgSsrHotkeys,
  },
});
```

Listen to keyboard shortcuts from the page regardless of whether the player has focus or not:

```javascript
import pillarbox from '@srgssr/pillarbox-web';
import { HotkeysHelper } from '@srgssr/srg-ssr-hotkeys';

const keydown = (event) => {
  player.userActive(true);

  HotkeysHelper.handle(player, event);
};
document.body.addEventListener('keydown', keydown);
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
