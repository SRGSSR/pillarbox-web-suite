import pillarbox from '@srgssr/pillarbox-web';
import { version } from '../package.json';
import { CardLink } from '@srgssr/card';

/**
 * @typedef {import('@srgssr/pillarbox-web/dist/types/src/dataProvider/model/MediaComposition.js').Chapter} Chapter
 *
 * @typedef {import('@srgssr/card').CardLinkOptions} chapterOptions
 *
 * @typedef {object} ChaptersBarOptions
 * @property {chapterOptions} chapterOptions options to be passed to the chapter cards
 */

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/utils/log.js').default}
 */
const log = pillarbox.log.createLogger('chapters-bar');

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/component').default}
 */
const Component = pillarbox.getComponent('Component');

/**
 * A component that displays a list of chapters for the current video.
 *
 * @extends Component
 */
class ChaptersBar extends Component {
  /**
   * Creates an instance of ChaptersBar.
   *
   * @param {import('@srgssr/pillarbox-web').Player} player the player instance.
   * @param {ChaptersBarOptions} options configuration options for the component
   */
  constructor(player, options) {
    super(player, options);

    this.onLoadedData = this.onLoadedData.bind(this);
    this.onEmptied = this.onEmptied.bind(this);
    this.onChapterChange = this.onChapterChange.bind(this);
    this.userActive = this.userActive.bind(this);

    this.player().on('loadeddata', this.onLoadedData);
    this.player().on('emptied', this.onEmptied);
    this.player().on('useractive', this.userActive);
    this.player().on('srgssr/chapter', this.onChapterChange);
  }

  /**
   * Adds a chapter to the chapters bar.
   *
   * @param {Chapter} chapter the chapter to add
   */
  addChapter({
    startTime,
    endTime,
    metadata
  }) {
    this.addChild(new CardLink(this.player(), {
      id: metadata.urn,
      name: metadata.urn,
      metadata: {
        ...metadata,
        startTime,
        endTime,
        duration: metadata.duration / 1_000
      },
      clickHandler: this.onChapterClick(startTime),
      urlHandler() {
        const {
          vendor,
          mediaType,
          urn
        } = this.options().metadata;

        return `https://www.${vendor.toLowerCase()}.ch/play/tv/-/${mediaType.toLowerCase()}/-?urn=${urn}`;
      },
      ...this.options().chapterOptions
    }));
  }

  /**
   * Scrolls to the active chapter when the user becomes active.
   *
   * @private
   */
  userActive() {
    if (!this.activeChapter) return;

    this.el().scrollTop = this.activeChapter.el().offsetTop;
  }

  /**
   * Returns the chapters for the current video.
   *
   * @returns {Chapter[]} an array of chapters
   */
  chapters() {
    const srgssrChapters = this.player().textTracks().getTrackById('srgssr-chapters');

    if (!srgssrChapters) return [];

    const chapters = Array.from(srgssrChapters.cues);

    if (!chapters.length) return [];

    try {
      return chapters.map(({
        startTime,
        endTime,
        text
      }) => ({
        startTime,
        endTime,
        metadata: JSON.parse(text)
      }));
    } catch (error) {
      log(error);
    }
  }

  /**
   * Handles a click on a chapter.
   *
   * @private
   * @param {number} value the start time of the chapter
   * @returns {function(Event): void}
   */
  onChapterClick(value) {
    return ([e]) => {
      e.preventDefault();

      this.player().currentTime(value + 0.1);
    };
  }

  /**
   * Checks if a chapter is the current chapter.
   *
   * @private
   * @param {Chapter} currentChapter the current chapter
   * @param {CardLink} chapter the chapter to check
   * @returns {boolean}
   */
  selectChapter(currentChapter, chapter) {
    return currentChapter
      && currentChapter.urn === chapter.id();
  }

  /**
   * Scrolls the chapters bar to the currently selected chapter.
   *
   * @private
   * @param {CardLink} chapter the chapter to scroll to
   */
  scrollToSelectedChapter(chapter) {
    if (!chapter.isSelected()) return;

    this.el().scrollTo({
      top: chapter.el().offsetTop,
      behavior: 'smooth'
    });
  }

  /**
   * Handles a chapter change event.
   *
   * @private
   * @param {object} event the chapter change event
   * @param {{text: string}} event.data the chapter data
   */
  onChapterChange({ data }) {
    try {
      const currentChapter = data ? JSON.parse(data.text) : {};

      /** @type { CardLink }*/
      this.activeChapter = this.getChildById(currentChapter.urn);
      this.children().forEach(chapter => {
        chapter
          .select(
            this.selectChapter(currentChapter, chapter)
          );

        this.scrollToSelectedChapter(chapter);
      });
    } catch (error) {
      log(error);
    }
  }

  /**
   * Handles the `loadeddata` event.
   *
   * @private
   */
  onLoadedData() {
    const chapters = this.chapters();

    if (!chapters.length) return;

    chapters.forEach(this.addChapter.bind(this));
    this.show();
  }

  /**
   * Handles the `emptied` event.
   *
   * @private
   */
  onEmptied() {
    this.hide();

    this.activeChapter = undefined;
    this.children().forEach(card => card.dispose());
    this.children().length = 0;

    pillarbox.dom.emptyEl(this.el());
  }

  /**
   * Builds the CSS class for the component.
   *
   * @returns {string} the CSS class name
   */
  buildCSSClass() {
    return `${super.buildCSSClass()} pbw-chapters-bar`;
  }

  /**
   * Creates the card bar element for the component.
   *
   * @param {string} [tagName='div'] the tag name for the element
   * @param {object} [properties] the properties to apply to the element
   * @param {object} [attributes] the attributes to apply to the element
   * @returns {HTMLElement} the card bar element
   */
  createEl(tagName = 'div', properties, attributes) {
    const props = pillarbox.obj.merge({
      className: this.buildCSSClass(),
    }, properties);

    return super.createEl(tagName, props, attributes);
  }

  /**
   * Hides the component and resets the scroll position.
   */
  hide() {
    this.el().scrollTop = 0;

    super.hide();
  }

  /**
   * Shows the component and selects the active chapter.
   */
  show() {
    super.show();

    if (!this.activeChapter) return;

    this.el().scrollTop = this.activeChapter.el().offsetTop;
  }

  /**
   * Disposes the component.
   */
  dispose() {
    this.onEmptied();
    this.player().off('loadeddata', this.onLoadedData);
    this.player().off('emptied', this.onEmptied);
    this.player().off('useractive', this.userActive);
    this.player().on('srgssr/chapter', this.onChapterChange);
    super.dispose();
  }

  /**
   * Returns the version of the component.
   *
   * @static
   * @returns {string} the version of the component
   */
  static get VERSION() {
    return version;
  }
}

pillarbox.registerComponent('ChaptersBar', ChaptersBar);

export default ChaptersBar;
