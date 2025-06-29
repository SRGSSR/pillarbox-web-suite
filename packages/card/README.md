# Pillarbox Web: Card

The card component is a suite of three components Card, CardLink and StyledCardButton. They are versatile and customizable allowing to display media metadata such as title, duration, and a preview image in a consistent way. These components are suitable for a wide range of use cases such as chapter displays and recommendation grids.

## Requirements

To use this component, you need the following installed on your system:

- Node.js

## Quick Start

To get started with this component, install it through the following command:

```bash
npm install --save video.js @srgssr/card
```

Once the player is installed you can activate the component as follows:

```javascript
import videojs from 'video.js';
import '@srgssr/card';

const player = videojs('my-player', {
  card: {
    metadata: {
      title: 'Video title',
      duration: 420,
      imageUrl: 'https://domain.com/image.jpg',
      imageTitle: 'Image title'
    },
    styleEl: 'color: red; background-color: #420;'
  }
});
```

To apply the default styling, add the following line to your CSS file:

```css
@import "@srgssr/card/dist/card.min.css";
```

## API Documentation

### Options

The card component can be configured with the following options:

| Option     | Type     | Default | Description                                                                                                |
| ---------- | -------- | ------- | ---------------------------------------------------------------------------------------------------------- |
| `metadata` | `object` | `{}`    | An object containing metadata for the card, such as `title`, `duration`, `imageTitle`, and `imageUrl`.       |
| `styleEl`  | `string` | `''`    | A string of CSS styles to be applied directly to the card's main element. This is used by all card components. |

### Methods

The card component provides the following methods to interact with it programmatically:

| Method              | Parameters            | Description                                                                                                                               |
| ------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `select(isSelected)`| `isSelected: boolean` | Toggles the selection state of the card by adding or removing the `vjs-card-selected` CSS class.                                          |
| `isSelected()`      | None                  | Returns a boolean indicating whether the card is currently selected (i.e., has the `vjs-card-selected` CSS class).                        |

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
