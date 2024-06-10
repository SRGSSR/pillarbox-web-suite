import videojs from 'video.js';
import './pillarbox-playlist-next-item-button.js';
import './pillarbox-previous-item-button.js';
import './pillarbox-playlist-repeat-button.js';
import './pillarbox-playlist-shuffle-button.js';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/component').default}
 */
const Component = videojs.getComponent('Component');

class PillarboxPlaylistControls extends Component {

}

PillarboxPlaylistControls.prototype.options_ = {
  className: 'pbw-playlist-controls',
  children: [
    'pillarboxPlaylistRepeatButton',
    'pillarboxPlaylistShuffleButton',
    'pillarboxPlaylistPreviousItemButton',
    'pillarboxPlaylistNextItemButton'
  ]
};

videojs.registerComponent('PillarboxPlaylistControls', PillarboxPlaylistControls);
