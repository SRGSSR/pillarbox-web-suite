import pillarbox from '@srgssr/pillarbox-web';
import '@srgssr/chapters-bar';
import horizontalWheel from './horizontal-wheel.js';

/**
 * @ignore
 * @type {typeof import('@srgssr/chapters-bar').default}
 */
const ChaptersBar = pillarbox.getComponent('ChaptersBar');

/**
 * A chapters bar that scrolls horizontally, as the theme lays its cards out on
 * a single row. The standalone bar scrolls vertically and keeps doing so.
 *
 * @extends ChaptersBar
 */
class SrgSsrChaptersBar extends ChaptersBar {
  /**
   * Scrolls the bar horizontally with a vertical wheel.
   *
   * @private
   * @param {WheelEvent} event the wheel event
   */
  #onWheel = (event) => horizontalWheel(this.el(), event);

  /**
   * Creates an instance of SrgSsrChaptersBar.
   *
   * @param {import('@srgssr/pillarbox-web').Player} player the player
   * @param {import('@srgssr/chapters-bar').ChaptersBarOptions} options the options
   */
  constructor(player, options) {
    super(player, options);

    this.on('wheel', this.#onWheel);
  }

  /**
   * The horizontal scroll position that brings a card to the start of the bar.
   * The offset of the first card is subtracted, so the position does not
   * depend on the offset parent of the cards nor on the padding of the bar.
   *
   * @private
   * @param {import('@srgssr/card').CardLink} chapter the chapter card
   * @returns {number} the scroll position in pixels
   */
  scrollLeftOf(chapter) {
    return chapter.el().offsetLeft - this.children()[0].el().offsetLeft;
  }

  /**
   * Brings the active chapter into view, without animation.
   */
  scrollToActiveChapter() {
    if (!this.activeChapter) return;

    this.el().scrollLeft = this.scrollLeftOf(this.activeChapter);
  }

  /**
   * Scrolls to the active chapter when the user becomes active.
   *
   * @private
   */
  userActive() {
    this.scrollToActiveChapter();
  }

  /**
   * Scrolls the chapters bar to the currently selected chapter.
   *
   * @private
   * @param {import('@srgssr/card').CardLink} chapter the chapter to scroll to
   */
  scrollToSelectedChapter(chapter) {
    if (!chapter.isSelected()) return;

    this.el().scrollTo({
      left: this.scrollLeftOf(chapter),
      behavior: 'smooth'
    });
  }

  /**
   * Hides the component and resets the scroll position.
   */
  hide() {
    this.el().scrollLeft = 0;

    super.hide();
  }

  /**
   * Shows the component and brings the active chapter into view.
   */
  show() {
    super.show();
    this.scrollToActiveChapter();
  }

  /**
   * Disposes the component.
   */
  dispose() {
    this.off('wheel', this.#onWheel);

    super.dispose();
  }
}

pillarbox.registerComponent('SrgSsrChaptersBar', SrgSsrChaptersBar);

export default SrgSsrChaptersBar;
