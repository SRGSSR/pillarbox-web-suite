# Video.js Share

Video.js component that displays a share icon on the top-right corner of a player.

Clicking the icon opens a small share modal anchored to the same top-right corner. Clicking the same
icon again closes the modal.

## Requirements

To use these helpers, you need the following installed on your system:

- Node.js

## Quick Start

To get started with this package, install it through the following command:

```bash
npm install --save video.js @srgssr/share
```

### Usage

Import the components and stylesheet, then add the `ShareModal` and `ShareToggle` components to the player:

```javascript
import '@srgssr/share/dist/share.min.css';
import '@srgssr/share';

window.player = pillarbox('player', {
  debug,
  language,
  experimentalSvgIcons: true,
  srgOptions: {
    dataProviderHost: ilHost
  },
  ShareModal: {
    title: 'Share',
    shareUrlOptions: {
      includeCurrentTime: true
    },
    shareButtonCollection: {
      FacebookShareButton: true,
      XShareButton: false,
      CopyLinkShareButton: { label: 'Copy link' },
      EmbedShareButton: {
        label: 'Embed',
        buildEmbedCode: url => `<iframe src="${url}" allowfullscreen></iframe>`
      }
    }
  },
  ShareToggle: true
});
```

### Button configuration examples

The share buttons are declared as Video.js children of `ShareButtonCollection`.
Each platform button can be enabled with its default options, disabled with `false`, or customized
through its component options.

#### Default platform button

```javascript
window.player = pillarbox('player', {
  ShareModal: {
    shareButtonCollection: {
      children: ['FacebookShareButton'],
      FacebookShareButton: true
    }
  },
  ShareToggle: true
});
```

#### Custom title

```javascript
window.player = pillarbox('player', {
  ShareModal: {
    shareButtonCollection: {
      children: ['FacebookShareButton'],
      FacebookShareButton: {
        label: 'Facebook',
        title: 'Share this video on Facebook'
      }
    }
  },
  ShareToggle: true
});
```

#### Custom SVG

```javascript
const customFacebookIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M12 2.5 14.7 8l6.1.9-4.4 4.3 1 6-5.4-2.9-5.4 2.9 1-6L3.2 8.9 9.3 8 12 2.5Z" fill="currentColor"/>
  </svg>
`;

window.player = pillarbox('player', {
  ShareModal: {
    shareButtonCollection: {
      children: ['FacebookShareButton'],
      FacebookShareButton: {
        icon: customFacebookIcon
      }
    }
  },
  ShareToggle: true
});
```

#### Custom button

To add a button that does not exist in the package, create a Video.js component extending
`ShareButton`, register it, then include it in the collection `children`.

```javascript
import videojs from 'video.js';
import {
  ShareButton
} from '@srgssr/share';

const customIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M4 3h11l5 5v13H4V3Zm10 1.8V9h4.2L14 4.8ZM7 11h1.8l.9 5.4 1.2-5.4h1.6l1.2 5.4.9-5.4h1.8l-1.7 8h-1.8l-1.2-5.2L10.5 19H8.7L7 11Z" fill="currentColor"/>
  </svg>
`;

class CustomShareButton extends ShareButton {}

CustomShareButton.prototype.options_ = {
  className: 'vjs-share-button--custom',
  label: 'Custom',
  title: 'Custom',
  icon: customIcon,
  target: '',
  rel: '',
  buildUrl: url => url
};

videojs.registerComponent('CustomShareButton', CustomShareButton);

window.player = pillarbox('player', {
  ShareModal: {
    shareButtonCollection: {
      children: ['CustomShareButton']
    }
  },
  ShareToggle: true
});
```

## API Documentation

### Components

| Function              | Description                                                                                  |
|-----------------------|----------------------------------------------------------------------------------------------|
| `ShareToggle`         | Video.js button component displayed on the top-right corner of the player.                   |
| `ShareModal`          | Video.js modal component opened when `ShareToggle` is clicked.                               |
| `ShareUrlOptions`     | Video.js component that owns the selected generated URL.                                     |
| `ShareButtonCollection` | Video.js component that holds the platform share buttons.                                  |
| `ShareButton`         | Base Video.js component for one platform share button.                                      |
| `FacebookShareButton`, `XShareButton`, etc. | Platform buttons that expose their URL builder through options. |

### ShareToggle options

| Option  | Type     | Default     | Description                         |
|---------|----------|-------------|-------------------------------------|
| `iconName`  | `string` | `'share'` | Video.js icon displayed inside the button. |
| `title` | `string` | `'Share'` (localized) | Accessible title for the toggle.     |

### ShareModal options

| Option  | Type     | Default     | Description                         |
|---------|----------|-------------|-------------------------------------|
| `title` | `string` | `'Share'` (localized) | Text displayed inside the modal. |
| `shareUrlOptions` | `object` | default `ShareUrlOptions` config | Options passed to `ShareUrlOptions`. |
| `shareButtonCollection` | `object` | all platform buttons | Options passed to `ShareButtonCollection`; platform buttons can be configured or disabled with `false`. |

### ShareUrlOptions options

| Option  | Type     | Default     | Description                         |
|---------|----------|-------------|-------------------------------------|
| `includeCurrentTime` | `boolean` | `false` | Enables the current-position URL option. |
| `url` | `string` | Current page URL | Base URL used to generate share links. |
| `defaultOption` | `string` | `'episode'`, or `'currentTime'` when `includeCurrentTime` is enabled | Initially selected URL option. |

### ShareButtonCollection options

| Option  | Type     | Default     | Description                         |
|---------|----------|-------------|-------------------------------------|
| `children` | `Array<string>` | all platform buttons | Ordered list of share button component names rendered by `ShareButtonCollection`. |

Each button can also be configured by its component name, for example
`FacebookShareButton: { label: 'Facebook' }`, or disabled with
`FacebookShareButton: false`.

### ShareButton options

| Option  | Type     | Default     | Description                         |
|---------|----------|-------------|-------------------------------------|
| `label` | `string` | Platform label | Visible label displayed below the icon. |
| `title` | `string` | Platform title | Accessible title and screen-reader text. |
| `icon` | `string` | Platform icon | Raw SVG displayed by the button. |
| `buildUrl` | `function` | Platform default | Builds the platform URL from `(url, text, player, button)`. |

## Contributing

### Setting up a development server

Start the development server:

```bash
npm run start
```

This will start the server on `http://localhost:4200`. Open this URL in your browser to test the
share button on a real player.

For detailed contribution guidelines, refer to our [Contributing guide][contributing-guide].
Please adhere to the specified guidelines.

## Licensing

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more
details.

[contributing-guide]: https://github.com/SRGSSR/pillarbox-web-suite/blob/main/docs/README.md#contributing
