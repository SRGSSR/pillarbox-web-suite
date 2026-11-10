import pillarbox from '@srgssr/pillarbox-web';
import '@srgssr/chapters-bar';
import './chapters-button.js';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/component').default}
 */
const Component = pillarbox.getComponent('Component');

/**
 * A panel that displays a folded chapters bar. The panel comes into view
 * with a mouse hover or a focus. A button on the header allows to fold it back
 * down.
 *
 * The panel only display if there are chapters available.
 *
 * @extends Component
 */
class ChaptersPanel extends Component {
  /**
   * An observer to update this panel display when the child list of the
   * chapters bar changes.
   *
   * @private
   */
  #chaptersObserver = new MutationObserver(() => this.update());

  /**
   * Expands the panel once the pointer or the keyboard reaches it.
   *
   * @private
   */
  #onReach = () => this.toggle(true);

  /**
   * Creates an instance of ChaptersPanel.
   *
   * @param {import('video.js/dist/types/player').default} player the player instance.
   * @param {object} [options] configuration options for the component
   * @param {import('@srgssr/chapters-bar').ChaptersBarOptions} [options.ChaptersBar]
   *        options passed to the chapters bar
   */
  constructor(player, options) {
    super(player, options);

    this.on(['mouseenter', 'focusin'], this.#onReach);
    this.#chaptersObserver.observe(
      this.getChild('ChaptersBar').el(),
      { childList: true }
    );

    this.update();
  }

  /**
   * Disposes the component.
   */
  dispose() {
    this.#chaptersObserver.disconnect();
    this.off(['mouseenter', 'focusin'], this.#onReach);
    this.player().removeClass('srg-ssr-chapters-available');
    this.player().removeClass('srg-ssr-chapters-expanded');
    super.dispose();
  }

  /**
   * Whether the current media exposes chapters.
   *
   * @returns {boolean}
   */
  hasChapters() {
    return this.getChild('ChaptersBar').children().length > 0;
  }

  /**
   * Whether the panel is expanded.
   *
   * @returns {boolean}
   */
  expanded() {
    return this.player().hasClass('srg-ssr-chapters-expanded');
  }

  /**
   * Expands or folds back the panel. It never expands without chapters.
   *
   * @param {boolean} [expanded] the state to force, toggles when omitted
   */
  toggle(expanded = !this.expanded()) {
    const value = expanded && this.hasChapters();

    this.player().toggleClass('srg-ssr-chapters-expanded', value);
    this.getChild('ChaptersHeader').setAttribute('aria-expanded', String(value));
  }

  /**
   * Shows the panel for a media with chapters, and hides and folds it back
   * otherwise.
   */
  update() {
    const hasChapters = this.hasChapters();

    this.player().toggleClass('srg-ssr-chapters-available', hasChapters);

    if (hasChapters) {
      this.show();
    } else {
      this.hide();
      this.toggle(false);
    }
  }
}

/**
 * The default options of the panel.
 *
 * @type {object}
 */
ChaptersPanel.prototype.options_ = {
  className: 'srg-ssr-chapters',
  children: [
    {
      name: 'ChaptersHeader',
      componentClass: 'SrgSsrChaptersButton',
      className: 'srg-ssr-chapters-header'
    },
    'ChaptersBar'
  ]
};

pillarbox.registerComponent('SrgSsrChaptersPanel', ChaptersPanel);

export default ChaptersPanel;
