import pillarbox from '@srgssr/pillarbox-web';
import '@srgssr/svg-button';
import './text-track-display.js';
import './chapters-bar.js';
import { version } from '../package.json';
import './lang';
import arrowLeft from '../assets/arrow-left.svg?raw';
import arrowRight from '../assets/arrow-right.svg?raw';

/**
* @ignore
* @type {typeof import('video.js/dist/types/component').default}
*/
const Component = pillarbox.getComponent('Component');

/**
* Represents a ChapterNavigation component for the pillarbox player.
*/
class ChapterNavigation extends Component {

  scrollToChild = 0;

  /**
  * Creates an instance of a ChapterNavigation.
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

    this.on(this.priviousChapter, ['click', 'tap'], this.scrollPrevious);
    this.on(this.nextChapter, ['click', 'tap'], this.scrollNext);
    this.on(this.chaptersBar, 'wheel', this.mouseWheelScroll);
    this.on(this.player(), 'loadeddata', this.handleChapterVisibility);
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

    this.scrollToChild -= this.scrollToChild > 0 ? 1 : 0;

    const chapterToScrollTo = this.chaptersBar.children()[this.scrollToChild];

    this.scrollTo(chapterToScrollTo);
  }

  scrollNext() {
    if (!this.canSelectNext()) return;

    this.scrollToChild += this.chaptersBar.children().length > 0 ? 1 : 0;

    const chapterToScrollTo = this.chaptersBar.children()[this.scrollToChild];

    this.scrollTo(chapterToScrollTo);

  }

  scrollTo(chapter, factor = 2) {
    if (!chapter) return;

    this.chaptersBar.el().scrollTo({
      left: chapter.el().offsetLeft * factor,
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

  handleLanguagechange() {
    super.handleLanguagechange();
  }

  static get VERSION() {
    return version;
  }
}

ChapterNavigation.prototype.options_ = {
  children: {
    priviousChapter: {
      id: 'priviousChapter',
      name: 'priviousChapter',
      componentClass: 'SvgButton',
      className: 'pbw-chapter-arrow pbw-chapter-left',
      controlText: 'Previous chapter',
      icon: arrowLeft,
      iconName: 'arrow-left'
    },
    chaptersBar: true,
    nextChapter: {
      id: 'nextChapter',
      name: 'nextChapter',
      componentClass: 'SvgButton',
      className: 'pbw-chapter-arrow pbw-chapter-right',
      controlText: 'Next chapter',
      icon: arrowRight,
      iconName: 'arrow-right'
    },
  }
};

pillarbox.registerComponent('ChapterNavigation', ChapterNavigation);

export default ChapterNavigation;
