# Pillarbox Web: Pillarbox Debug Panel

The Pillarbox Debug Panel is a component for the video.js player that displays a minimal
debugging information. It provides real-time metrics and detailed playback information, helping
developers monitor and analyze video performance.

## Requirements

To use this component, you need the following installed on your system:

- Node.js

## Quick Start

To get started with this component, install it through the following command:

```bash
npm install --save video.js @srgssr/pillarbox-debug-panel
```

Once the player is installed you can activate the component as follows:

```javascript
import videojs from 'video.js';
import '@srgssr/pillarbox-debug-panel';

const player = videojs('my-player', { pillarboxDebugPanel: true });
```

To apply the default styling, add the following line to your CSS file:

```css
@import "@srgssr/pillarbox-debug-panel/dist/pillarbox-debug-panel.min.css";
```

### Loading the Debug Panel Dynamically

You can also load the debug panel dynamically using a CDN. This method avoids the need to bundle the
debug panel in your application build, ensuring that the debug panel is only loaded when needed. See
the example below:

```javascript
async function addDebugPanel(player) {
  // Add the required styles directly to the document's stylesheet
  const styleSheet = new CSSStyleSheet();
  const cssText = await fetch('https://cdn.jsdelivr.net/npm/@srgssr/pillarbox-debug-panel/dist/pillarbox-debug-panel.min.css')
    .then(response => response.text());
  styleSheet.replaceSync(cssText);
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, styleSheet];

  // Dynamically import the Pillarbox Debug Panel script as a module
  await import('https://cdn.jsdelivr.net/npm/@srgssr/pillarbox-debug-panel/dist/pillarbox-debug-panel.umd.cjs');

  // Add the Pillarbox Debug Panel to the player
  player.addChild('PillarboxDebugPanel');
}
```

> [!IMPORTANT]
> For this script to function properly, the `videojs` object must be available in the global scope.
> **If `videojs` is not in the global scope, this method will not work.**

## API Documentation

## PillarboxDebugPanel

The `PillarboxDebugPanel` is a high-level component that serves as a container for
multiple `MetricComponent` instances. It listens to video player events and updates each
metric component dynamically as the video plays, ensuring that the displayed metrics are always
current.

Here’s a schematic representation of the relationship between the components:

```
PillarboxDebugPanel
  ├── MetricComponent
  │   ├── MetricLabel
  │   └── GraphComponent (optional)
  ├── MetricComponent
  │   ├── MetricLabel
  │   └── GraphComponent (optional)
  └── ...
```

### MetricComponent

The `MetricComponent` is responsible for rendering an individual metric. It can display both a
label (`MetricLabel`) and an optional graph (`GraphComponent`) that dynamically visualizes the
metric's data over time.

| Option           | Type     | Default                             | Description                                                                                                                            |
|------------------|----------|-------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| `valueExtractor` | Function | Required                            | A function that extracts the metric value from the player.                                                                             |
| `valueFormatter` | Function | `(value) => value`                  | A function that formats the extracted value before displaying it.                                                                      |
| `children`       | Array    | `['metricLabel', 'graphComponent']` | The child components to be rendered within the `MetricComponent`. This usually includes `MetricLabel` and optionally `GraphComponent`. |

You can omit the graph component as such:

```javascript
player.pillarboxDebugPanel.addChild(
  {
    name: 'MetricComponent',
    graphComponent: false,
    metricLabel: { label: 'My Metric' },
    valueExtractor: (player) => 'Some value'
  }
);
```

### MetricLabel

The `MetricLabel` is a simple component responsible for displaying a text label for a specific
metric. It shows the metric name along with its current value.

| Option  | Type   | Default  | Description                                                                   |
|---------|--------|----------|-------------------------------------------------------------------------------|
| `label` | String | Required | The label text for the metric. This is displayed along with the metric value. |

### GraphComponent

The `GraphComponent` is responsible for rendering a dynamic bar graph that visualizes the metric’s
data over time. This component is optional and is used within the `MetricComponent` when a graphical
representation of the metric is required.

| Option          | Type   | Default             | Description                                                                                                |
|-----------------|--------|---------------------|------------------------------------------------------------------------------------------------------------|
| `fillStyle`     | String | `'rgba(11,83,148)'` | The color of the bars in the graph.                                                                        |
| `strokeStyle`   | String | `'rgb(50,50,50)'`   | The color of the stroke around the line in the graph.                                                      |
| `maxDataPoints` | Number | `30`                | The maximum number of data points to display on the graph. Older points are removed as new ones are added. |

### Adding custom metrics

You can add additional metrics programmatically to the debug panel by adding a child or modifying
the default children array. As an example, let's display the mime type fo the currently playing
source:

```javascript
import videojs from 'video.js';
import '@srgssr/pillarbox-debug-panel';

const player = videojs('my-player', {
  pillarboxDebugPanel: {
    mimeType: {
      componentClass: "MetricComponent",
      graphComponent: false,
      metricLabel: { label: "Mime Type" },
      valueExtractor: (player) => player.currentSource().type,
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
- `urn`: Specifies the URN of the video to load. Default is `urn:rts:video:14683290`.

You can combine parameters in the URL like so:

```plaintext
http://localhost:4200/?language=fr&urn=urn:rts:video:14318206
```

## Licensing

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more
details.

[contributing-guide]: https://github.com/SRGSSR/pillarbox-web-suite/blob/main/docs/README.md#contributing
