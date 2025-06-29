# Pillarbox Web: ChaptersBar

The `ChaptersBar` component displays a scrollable list of video chapters, allowing users to easily navigate through the content.

## Requirements

To use this component, you need the following installed on your system:

- Node.js

## Quick Start

To get started with this component, install it through the following command:

```bash
npm install --save @srgssr/pillarbox-web @srgssr/chapters-bar
```

For instructions on setting up Pillarbox, see
the [Quick Start guide](https://github.com/SRGSSR/pillarbox-web#quick-start).

Once the player is installed you can activate the component as follows:

```javascript
import pillarbox from '@srgssr/pillarbox-web';
import '@srgssr/chapters-bar';

const player = pillarbox('my-player', { chaptersBar: true });
```

To apply the default styling, add the following line to your CSS file:

```css
@import "@srgssr/chapters-bar/dist/chapters-bar.min.css";
```

## API Documentation

### Options

The chapters bar component can be configured with the following options:

| Option           | Type     | Default | Description                                                                                                |
| ---------------- | -------- | ------- | ---------------------------------------------------------------------------------------------------------- |
| `chapterOptions` | `object` | `{}`    | An object containing options to be passed to the underlying `CardLink` components for each chapter. See the Card component documentation for more details. |

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
