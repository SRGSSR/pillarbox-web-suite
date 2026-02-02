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
  constructor(player, options) {
    super(player, options);

    this.removeChapters = this.removeChapters.bind(this);

    this.on(this.player(), ['emptied', 'error', 'playerreset'], this.removeChapters);
  }

  /**
   * @override
   *
   * @param {Chapter} chapter the chapter to add
   * @param {number} chapterIndex the index where the chapter should be added
   */
  addChapter({
    startTime,
    endTime,
    metadata
  }, chapterIndex) {
    const cardLink = pillarbox.getComponent('CardLink');
    const chardLinkChild = new cardLink(
      this.player(),
      {
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
      }
    );

    this.addChild(chardLinkChild, undefined, chapterIndex);
  }

  removeChapters() {
    this.onEmptied();

    const srgssrChapters = this.player().textTracks().getTrackById('srgssr-chapters');

    if (!srgssrChapters) return;

    Array.from(srgssrChapters.cues).forEach(chapter => {
      srgssrChapters.removeCue(chapter);
    });
  }

  /**
   * @override
   */
  onAddChaptersTrack({ track }) {
    if (!track || track.id !== 'srgssr-chapters') return;

    const trackCues = Array.from(track.cues);

    if (!trackCues.length) return;

    const chapters = trackCues.map(({
      startTime,
      endTime,
      text
    }) => ({
      startTime,
      endTime,
      metadata: JSON.parse(text)
    }));

    chapters.forEach(this.addChapter.bind(this));

    this.show();
  }

  /**
   * @override
   */
  scrollToSelectedChapter(chapter, forceScroll = false) {
    if (chapter && !chapter.isSelected() && !forceScroll) return;

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

  /**
   * @override
   */
  dispose() {
    this.off(this.player(), ['emptied', 'error', 'playerreset'], this.removeChapters);
    super.dispose();
  }
});
