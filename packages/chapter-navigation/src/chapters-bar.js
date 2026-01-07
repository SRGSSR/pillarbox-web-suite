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
    if (!chapter.isSelected()) return;

    this.el().scrollTo({
      left: chapter.el().offsetLeft,
      behavior: 'smooth'
    });
  }
});
