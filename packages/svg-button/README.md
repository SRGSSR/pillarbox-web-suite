# Pillarbox Web: SvgButton

The `SvgButton` and the `SvgComponent` are reusable base components for Video.js that simplifies the
process of adding custom SVG icons to your video player UI.

These components support multiple icon input formats, including raw SVG strings, URLs, inline
SVGElements. They also integrates smoothly with Video.js’s experimental SVG icon system and icon
font classes.

## Requirements

To use these components, you need the following installed on your system:

- Node.js

## Quick Start

To get started with these components, install it through the following command:

```bash
npm install --save video.js @srgssr/svg-button
```

### Usage

Once the player is installed import and register your own button component

```javascript
import videojs from 'video.js';
import '@srgssr/svg-button';
import icon from './assets/my-icon.svg?raw';

const SvgButton = videojs.getComponent('SvgButton');

class MyCustomButton extends SvgButton {
  handleClick(event) {
    console.log('MyCustomButton clicked');
  }

  buildCSSClass() {
    return `vjs-my-button ${super.buildCSSClass()}`;
  }
}

videojs.registerComponent('MyCustomButton', MyCustomButton);

const player = videojs('my-player');
player.controlBar.addChild('MyCustomButton', { icon });
```

To apply the default styling, add the following line to your CSS file:

```css
@import "@srgssr/svg-button/dist/svg-button.min.css";
```

You can also quickly add an inline button without creating a custom class:

```js
import videojs from 'video.js';
import '@srgssr/svg-button';
import icon from './assets/my-icon.svg?raw';

const player = videojs('my-player');
player.controlBar.addChild('SvgButton', {
  icon,
  iconName: 'my-button',
  controlText: 'My Button',
  clickHandler: () => console.log('Inline SvgButton clicked'),
  className: 'vjs-my-button'
});
```

## API Documentation

### Options

When initializing the `SvgButton`, `SvgComponen` or any subclass of them, you can pass an `options`
object to customize their behavior:

| Option     | Type                          | Default     | Description                                                                                                                               |
|------------|-------------------------------|-------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| `icon`     | `SVGElement \| string \| URL` | `undefined` | An SVG icon to display inside the button. Can be an `SVGElement`, a raw SVG string, or a URL (string or `URL` object). Throws if invalid. |
| `iconName` | `string`                      | `undefined` | The name of the registered Video.js icon (if using [experimental SVG icons][experimental-svg]).                                           |

### Methods

The following table outlines the key methods available in this component:

| Function                         | Description                                                                                                                                                                                                                                 |
|----------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `appendIcon({ icon, iconName })` | Dynamically updates the icon of the component. Accepts an `SVGElement`, raw SVG string, or URL as `icon`, and an optional `iconName` (e.g., `"play"`, `"pause"`). If called without arguments, it re-renders the currently configured icon. |

### Icon Integration

The `SvgButton` and the `SvgComponent` support multiple strategies for integrating a custom icon,
depending on your project setup and preferences:

#### 1. Using SVG Icon Class (with experimental SVG icons)

If your project uses Video.js’s [experimental SVG icon support][experimental-svg] you can pass the
registered icon name through the `iconName` option, the button will automatically include a
`vjs-icon-${iconName}` class.

```js
player.controlBar.addChild('MyButton', { iconName: 'my-button' });
```

#### 2. Using a Custom Font Icon

If your project uses an icon font (such as Font Awesome or a custom font), you can style the icon
placeholder button via CSS:

```css
.vjs-my-button .vjs-icon-placeholder::before {
  content: '\f123'; /* Font Unicode */
  font-family: 'YourFont';
}
```

#### 3. Providing an Icon via Options

You can also pass a custom icon directly using the `icon` option. This works regardless of whether
experimental SVG support is enabled. Accepted formats are:

* An `SVGElement` instance.
* A raw inline SVG string.
* A URL pointing to an external SVG file (as a string or `URL` object)

Example with raw SVG:

```js
import icon from './icon.svg?raw';

player.controlBar.addChild('SvgButton', { icon });
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

[experimental-svg]: https://videojs.com/guides/options/#experimentalsvgicons
