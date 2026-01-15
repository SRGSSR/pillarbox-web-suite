/* eslint-disable */
// cspell: disable

import pillarbox from '@srgssr/pillarbox-web';
import './previous-button.js';
import './next-button.js';
import './text-track-display.js';
import './chapters-bar.js';
import './chapter-updater.js';
import { version } from '../package.json';
import './lang/index.js';

/**
* @ignore
* @type {typeof import('video.js/dist/types/component').default}
*/
const Component = pillarbox.getComponent('Component');

/**
* Represents a LegacyChaptersNavigation component for the pillarbox player.
*/
class LegacyChaptersNavigation extends Component {

  /**
  * Creates an instance of a LegacyChaptersNavigation.
  *
  * @param {import('@srgssr/pillarbox-web').Player} player The player instance.
  * @param {Object} options Configuration options for the component.
  */
  constructor(player, options) {
    super(player, options);

    this.handleChapterVisibility = this.handleChapterVisibility.bind(this);
    this.scrollPrevious = this.scrollPrevious.bind(this);
    this.scrollNext = this.scrollNext.bind(this);
    this.mouseWheelScroll = this.mouseWheelScroll.bind(this);
    this.updateButtons = this.updateButtons.bind(this);

    this.on(this.previousButton, ['click', 'tap'], this.scrollPrevious);
    this.on(this.nextButton, ['click', 'tap'], this.scrollNext);
    this.on(this.chaptersBar, 'wheel', this.mouseWheelScroll);
    this.on(this.chaptersBar, 'scroll', this.updateButtons);
    this.on(this.player(), 'loadeddata', this.handleChapterVisibility);
    this.on(this.player(), 'playerresize', this.updateButtons);
  }

  async getChaptersTrack() {
    let srgssrChapters = this.player().textTracks().getTrackById('srgssr-chapters');

    if (!srgssrChapters) {
      srgssrChapters = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(new pillarbox.TextTrack({
            id: 'srgssr-chapters',
            kind: 'metadata',
            label: 'srgssr-chapters',
            tech: this.player().tech(true),
          }));
        }, 100);
      });

      this.player().textTracks().addTrack(srgssrChapters);
    }

    return srgssrChapters;
  }

  async addChapter(chapter) {
    let srgssrChapters = await this.getChaptersTrack();

    const startTime = (Number.isFinite(chapter.markIn)
      ? chapter.markIn : chapter.fullLengthMarkIn) / 1_000;
    const endTime = (Number.isFinite(chapter.markOut)
      ? chapter.markOut : chapter.fullLengthMarkOut) / 1_000;

    srgssrChapters.addCue({
      startTime,
      endTime,
      text: JSON.stringify(chapter),
    });

    this.chaptersBar.addChapter({
      startTime,
      endTime,
      metadata: chapter
    });

    if (!this.player().hasClass('pbw-with-chapters')) {
      this.handleChapterVisibility();
    }

    this.updateButtons();
  }

  handleChapterVisibility() {
    this.player().toggleClass(
      'pbw-with-chapters',
      Boolean(this.chaptersBar.chapters().length)
    );

    if (!this.chaptersBar.chapters().length) {
      this.hide();

      return;
    }

    if (!this.player().hasStarted()) {
      this.player().one('play', () => {
        this.scrollTo(0);
        this.updateButtons();
      });
    }

    this.show();
  }

  mouseWheelScroll(e) {
    if (e.deltaY > 0) {
      this.scrollNext();
    } else {
      this.scrollPrevious();
    }

    e.preventDefault();
  }

  scrollPrevious() {
    if (!this.canSelectPrevious()) return;

    const chaptersBar = this.chaptersBar;
    const position = chaptersBar.el().scrollLeft - chaptersBar.width();

    this.scrollTo(position);
  }

  scrollNext() {
    if (!this.canSelectNext()) return;

    const chaptersBar = this.chaptersBar;
    const position = chaptersBar.el().scrollLeft + chaptersBar.width();

    this.scrollTo(position);
  }

  scrollTo(position) {
    if (!isFinite(position)) return;

    this.chaptersBar.el().scrollTo({
      left: position,
      behavior: 'smooth'
    });
  }

  canSelectPrevious() {
    if (!this.chaptersBar) return false;

    return this.chaptersBar.el().scrollLeft > 0;
  }

  canSelectNext() {
    if (!this.chaptersBar) return false;

    const el = this.chaptersBar.el();

    return el.scrollLeft < el.scrollWidth - el.clientWidth;
  }

  updateButtons() {
    if (this.canSelectPrevious()) {
      this.previousButton.enable();
    } else {
      this.previousButton.disable();
    }

    if (this.canSelectNext()) {
      this.nextButton.enable();
    } else {
      this.nextButton.disable();
    }
  }

  buildCSSClass() {
    return `${super.buildCSSClass()} pbw-chapters-navigation vjs-hidden`;
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

  dispose() {
    this.off(this.previousButton, ['click', 'tap'], this.scrollPrevious);
    this.off(this.nextButton, ['click', 'tap'], this.scrollNext);
    this.off(this.chaptersBar, 'wheel', this.mouseWheelScroll);
    this.off(this.chaptersBar, 'scroll', this.updateButtons);
    this.off(this.player(), 'loadeddata', this.handleChapterVisibility);
    this.off(this.player(), 'playerresize', this.updateButtons);

    super.dispose();
  }

  handleLanguagechange() {
    super.handleLanguagechange();
  }

  static get VERSION() {
    return version;
  }
}

LegacyChaptersNavigation.prototype.options_ = {
  children: {
    previousButton: true,
    chaptersBar: true,
    nextButton: true,
    chapterUpdater: true,
  }
};

pillarbox.registerComponent('LegacyChaptersNavigation', LegacyChaptersNavigation);

export default LegacyChaptersNavigation;
