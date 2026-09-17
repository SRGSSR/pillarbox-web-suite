# Pillarbox Web: SRG SSR Theme

The SRG SSR theme restyles the Pillarbox player with the design used by the SRG SSR players, and
sets the player options that go with it. Every control is in the control bar, laid out over the
media in three rows:

- **Top right corner**: the AirPlay and Google Cast buttons, the title is omitted.
- **Progress row**: the current time, the progress control and the duration. On a live stream with
  DVR the current time shows the time of day, through the
  [Live DVR Time Display](../live-dvr-time-display#readme) component.
- **Bottom row**: every other control. In the tiny layout, 640px wide or less, the skip backward,
  play and skip forward buttons move to the center of the media.
- The [SRG SSR keyboard shortcuts](../srg-ssr-hotkeys#readme) are enabled.
- The [user preferences](../user-preferences#readme) are also enabled. 
- A custom set of icons.

Use an `<audio>` element to get the audio experience, which has a slightly different layout:
- The poster stays visible
- The progress and bottom rows are always visible.
- The bottom row displays a big play button with skip buttons around it, in every layout.

## Requirements

To use this theme, you need the following installed on your system:

- Node.js

## Quick Start

To get started with this theme, install it through the following command:

```bash
npm install --save video.js @srgssr/srg-ssr-theme
```

For instructions on setting up Pillarbox, see
the [Quick Start guide](https://github.com/SRGSSR/pillarbox-web#quick-start).

Once the player is installed, import the theme and pass its options when creating a player:

```javascript
import pillarbox from '@srgssr/pillarbox-web';
import SrgSsrTheme from '@srgssr/srg-ssr-theme';

const player = pillarbox('my-player', SrgSsrTheme.options);
```

Importing the theme registers the components it relies on but the options need to be set
explicitly to each player, as an opt-in. A page can create multiple players with and without the 
theme options, and any player can override its options:

```javascript
const player = pillarbox('my-player', pillarbox.obj.merge(SrgSsrTheme.options, {
  playbackRates: [0.5, 1, 2],
  breakpoints: { tiny: 320 }
}));
```

For the [audio only mode](https://docs.videojs.com/player#audioOnlyMode) of video.js, where only
the control bar is displayed, enable the mode. The controls are laid out in one row, and the
player is as high as the bar:

```javascript
const player = pillarbox('my-player', pillarbox.obj.merge(SrgSsrTheme.options, {
  audioOnlyMode: true
}));
```

The Google Cast sender is enabled, without its default launcher, and casts SRG SSR media by URN.
It uses the default media receiver, which does not play DRM content. To cast with your own
receiver application, pass its identifier:

```javascript
const player = pillarbox('my-player', pillarbox.obj.merge(SrgSsrTheme.options, {
  plugins: {
    googleCastSender: { receiverApplicationId: 'YOUR_APP_ID' }
  }
}));
```

The theme stylesheet includes the video.js styles, use it instead of `pillarbox.min.css`, and
give the player element the `srg-ssr-theme` class:

```css
@import "@srgssr/srg-ssr-theme/dist/srg-ssr-theme.min.css";
```

```html
<video id="my-player" class="srg-ssr-theme"></video>
```

### Typography

The theme declares the `SRG_SSR_Text_VF` font family, the SRG SSR corporate typeface, with a
`sans-serif` fallback. The typeface is not bundled, load it in your page with a `@font-face` rule
of that name, declaring its weight range, to get the exact rendering. Without it the player uses
the default sans-serif font of the platform.

## Customizing the theme

The theme is made of two parts:

- `scss/_preset.scss`: the style overrides, organized like the video.js stylesheet: the icon font in
  `scss/_icons.scss`, the variables in `scss/_variables.scss`, and one file per component in
  `scss/components`, the breakpoint variants in `scss/components/_adaptive.scss`.
- `src/player-options.js`: the player options exposed as `SrgSsrTheme.options`, to pass when
  creating a player.

### Variables

The colors and sizes are CSS custom properties declared with no specificity, override them on the
player element:

```css
.srg-ssr-theme {
  --srg-ssr-red: #d40000;
  --srg-ssr-gutter: 2.4em;
}
```

| Property                      | Default   | Description                                      |
|-------------------------------|-----------|--------------------------------------------------|
| `--srg-ssr-white`             | `#fff`    | Menu text, audio play button, rate pill, tooltip |
| `--srg-ssr-black`             | `#000`    | Audio only bar, icons on light backgrounds       |
| `--srg-ssr-hover`             | `#dadad2` | Controls under the pointer or focused            |
| `--srg-ssr-menu`              | `#141411` | Menu background                                  |
| `--srg-ssr-menu-hover`        | `#2e2d29` | Menu item under the pointer                      |
| `--srg-ssr-neutral`           | `#6b6960` | Live button, menu scrollbar                      |
| `--srg-ssr-red`               | `#e31f2b` | Big play button                                  |
| `--srg-ssr-red-dark`          | `#c91024` | Big play button hover, loading spinner           |
| `--srg-ssr-progress`          | `#af001e` | Played part of the progress bar                  |
| `--srg-ssr-live`              | `#ff6669` | Live button at the live edge                     |
| `--srg-ssr-focus`             | `#78aeda` | Keyboard focus ring                              |
| `--srg-ssr-control-size`      | `4em`     | Height of the controls                           |
| `--srg-ssr-gap`               | `.8em`    | Space between the controls                       |
| `--srg-ssr-gutter`            | `3.2em`   | Space between the controls and the player edges  |
| `--srg-ssr-padding`           | `.8em`    | Space below the bottom row                       |
| `--srg-ssr-time-width`        | `9em`     | Width of the current time and duration           |
| `--srg-ssr-gap-tiny`          | `.4em`    | `--srg-ssr-gap` in the tiny layout               |
| `--srg-ssr-gutter-tiny`       | `.8em`    | `--srg-ssr-gutter` in the tiny layout            |
| `--srg-ssr-padding-tiny`      | `.4em`    | `--srg-ssr-padding` in the tiny layout           |
| `--srg-ssr-time-width-tiny`   | `7em`     | `--srg-ssr-time-width` in the tiny layout        |
| `--srg-ssr-audio-play-size`   | `4.8em`   | Size of the play and skip buttons, audio layout  |
| `--srg-ssr-audio-only-height` | `3.2em`   | Height of the controls, audio only mode          |

### Icons

The icons are provided by an icon font embedded in the stylesheet. The font uses the private use
codepoints of the video.js icon font, from `U+F101` to `U+F12E`, and adds four glyphs:

| Glyph            | Codepoint | CSS class                 |
|------------------|-----------|---------------------------|
| `cam-on`         | `U+F12F`  | `vjs-icon-cam-on`         |
| `cam-off`        | `U+F130`  | `vjs-icon-cam-off`        |
| `airplay`        | `U+F131`  | `vjs-icon-airplay`        |
| `playback-speed` | `U+F132`  | `vjs-icon-playback-speed` |

The font is stored in `assets/fonts`.

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

- `audioOnlyMode`: Set this to enable the audio only mode of video.js, a single bar.
- `debug`: Set this to enable debugging mode.
- `ilHost`: Specifies the host for the data provider.
- `language`: Sets the language for the player interface.
- `urn`: Specifies the URN of the media to load. Default is `urn:rts:video:14683290`. An audio
  URN is played from an `audio` element.

You can combine parameters in the URL like so:

```plaintext
http://localhost:4200/?language=fr&urn=urn:rts:video:14318206
```

## Licensing

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more
details.

[contributing-guide]: https://github.com/SRGSSR/pillarbox-web-suite/blob/main/docs/README.md#contributing
