import pillarbox from '@srgssr/pillarbox-web';
import ChaptersBar from '@srgssr/chapters-bar';

/**
 * Chapters Bar horizontal scroll
 *
 * This component does not export any classes because it is not intended to be
 * used outside of this package.
 *
 * @override
 */
pillarbox.registerComponent('ChaptersBar', class extends ChaptersBar {
  /**
   * @override
   */
  scrollToSelectedChapter(chapter) {
    if (chapter && !chapter.isSelected()) return;

    this.el().scrollTo({
      left: chapter.el().offsetLeft,
      behavior: 'smooth'
    });
  }

  /**
   * @override
   */
  userActive() {
    if (!this.activeChapter || this.player().paused()) return;

    this.el().scrollLeft = this.activeChapter.el().offsetLeft;
  }

  /**
   * Hides the component and resets the scroll position.
   */
  hide() {
    this.el().scrollLeft = 0;

    super.hide();
  }

  /**
   * Shows the component and selects the active chapter.
   */
  show() {
    super.show();

    if (!this.activeChapter) return;

    this.el().scrollLeft = this.activeChapter.el().offsetLeft;
  }
});
