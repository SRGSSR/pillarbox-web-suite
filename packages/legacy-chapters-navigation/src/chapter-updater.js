/* eslint-disable */
// cspell: disable

import pillarbox from '@srgssr/pillarbox-web';

/**
* @ignore
* @type {typeof import('video.js/dist/types/component').default}
*/
const Component = pillarbox.getComponent('Component');

class ChapterUpdater extends Component {
  chapterUpdateInterval;
  cachedMainChapterUrn;
  isLive;

  constructor(player, options, ready) {
    const opts = pillarbox.obj.merge(
      { pollingDelay: 30_000 },
      options,
      { createEl: false }
    );

    super(player, opts, ready);

    this.handleChapterInitialization = this.handleChapterInitialization.bind(this);
    this.handleStartLongPolling = this.handleStartLongPolling.bind(this);
    this.handleStopLongPolling = this.handleStopLongPolling.bind(this);

    this.on(
      player.textTracks(),
      'addtrack',
      this.handleChapterInitialization
    );

    this.on(
      player,
      'loadeddata',
      this.handleStartLongPolling
    );

    this.on(
      player,
      ['ended', 'dispose', 'playerreset', 'error'],
      this.handleStopLongPolling
    );
  }

  async handleChapterInitialization({ track: chapterTrack }) {
    if (chapterTrack.id !== 'srgssr-chapters') return;

    const {
      mediaData: {
        urn,
        live
      } = {}
    } = this.player().currentSource();

    this.cachedMainChapterUrn = urn;
    this.isLive = live;

    // VOD
    if (!this.isLive) return;

    const chapterList = await this.fetchChaptersList(this.cachedMainChapterUrn) || [];

    chapterList.forEach(chapter => {
      this.player()
        .legacyChaptersNavigation.addChapter(chapterTrack, chapter)
    });

    if (chapterList.length) {
      this.player()
        .legacyChaptersNavigation.chaptersBar.show();
    }
  }

  handleStartLongPolling() {
    this.clearInterval(this.chapterUpdateInterval);

    this.chapterUpdateInterval = this.setInterval(() => {
      const currentSource = this.player().currentSource();

      if (
        !currentSource ||
        !currentSource.mediaData ||
        currentSource.mediaData.urn !== this.cachedMainChapterUrn
      ) return;

      this.update(this.cachedMainChapterUrn);
    }, this.options().pollingDelay);
  }

  handleStopLongPolling() {
    this.clearInterval(this.chapterUpdateInterval);
  }

  /**
   * Returns a chapter list without the main chapter
   */
  async fetchChaptersList(urn) {
    const { chapterList } = await this.player()
      .options()
      .srgOptions
      .dataProvider(urn);

    return chapterList
      .filter(chapter => chapter.urn !== this.cachedMainChapterUrn);
  }

  hasChaptersNavigation() {
    const legacyChaptersNavigation = this.player()
      .legacyChaptersNavigation;
    const srgssrChaptersTrack = this.player().textTracks().getTrackById('srgssr-chapters');

    return Boolean(srgssrChaptersTrack) &&
      Boolean(legacyChaptersNavigation) &&
      Boolean(legacyChaptersNavigation.chaptersBar)
  }

  async update(urn) {
    if (!this.hasChaptersNavigation()) return;

    const { legacyChaptersNavigation } = this.player();
    const srgssrChaptersTrack = this.player().textTracks().getTrackById('srgssr-chapters');
    const chapterList = await this.fetchChaptersList(urn);

    this.addChapters(
      legacyChaptersNavigation,
      srgssrChaptersTrack,
      chapterList
    );

    this.updateChapters(
      legacyChaptersNavigation,
      urn,
      srgssrChaptersTrack,
      chapterList
    );

    this.removeChapters(
      legacyChaptersNavigation,
      srgssrChaptersTrack,
      chapterList
    );

    if (!srgssrChaptersTrack.cues.length) {
      legacyChaptersNavigation.chaptersBar.children().length = 0;
      legacyChaptersNavigation.handleChapterVisibility();
    }
  }

  addChapters(chapterNavigationComponent, chaptersTrack, chapterList = []) {
    const { chaptersBar } = chapterNavigationComponent;
    const chaptersUrn = chaptersBar
      .chapters()
      .map(chapter => chapter.metadata.urn);

    const chaptersToAdd = chapterList
      .reduce((chapterEntries, chapter, index) => {
        if (chaptersUrn.includes(chapter.urn) ||
          chapter.urn === this.cachedMainChapterUrn) return chapterEntries;

        chapterEntries.push({
          index,
          chapter
        });

        return chapterEntries;
      }, []);

    chaptersToAdd.forEach(chapterEntry => {
      this.addChapter(
        chapterNavigationComponent,
        chaptersTrack,
        chapterEntry.chapter,
        chapterEntry.index
      );

      chaptersBar.scrollToSelectedChapter(chaptersBar.children().at(-1), true);
    });

    if (chapterList.length && chaptersBar.hasClass('vjs-hidden')) {
      chaptersBar.show();
    }

    if (!this.player().hasClass('pbw-with-chapters')) {
      chapterNavigationComponent.handleChapterVisibility();
    }

    chapterNavigationComponent.updateButtons();
  }

  async addChapter(chapterNavigationComponent, chaptersTrack, chapter, chapterIndex) {
    const startTime = (Number.isFinite(chapter.markIn)
      ? chapter.markIn : chapter.fullLengthMarkIn) / 1_000;
    const endTime = (Number.isFinite(chapter.markOut)
      ? chapter.markOut : chapter.fullLengthMarkOut) / 1_000;

    this.addChapterCue(chaptersTrack, startTime, endTime, chapter);
    this.addChapterChild(chapterNavigationComponent, startTime, endTime, chapter, chapterIndex);
  }

  addChapterChild(chapterNavigationComponent, startTime, endTime, metadata, chapterIndex) {
    chapterNavigationComponent.chaptersBar.addChapter(
      {
        startTime,
        endTime,
        metadata
      },
      chapterIndex
    );
  }

  addChapterCue(chaptersTrack, startTime, endTime, chapter) {
    const text = JSON.stringify(chapter);
    const cue = new VTTCue(startTime, endTime, text);

    cue.id = chapter.urn;

    chaptersTrack.addCue(cue);
  }

  updateChapters(chapterNavigationComponent, urn, chaptersTrack, chapterList = []) {
    chapterList.forEach(chapter => {
      // main chapter or unrelated chapter
      if (chapter.urn === urn || chapter.fullLengthUrn !== urn) return;

      const chapterStringified = JSON.stringify(chapter);
      const startTime = (Number.isFinite(chapter.markIn)
        ? chapter.markIn : chapter.fullLengthMarkIn) / 1_000;
      const endTime = (Number.isFinite(chapter.markOut)
        ? chapter.markOut : chapter.fullLengthMarkOut) / 1_000;

      // chapter hasn't change
      if (!this.updateChaptersCue(
        chaptersTrack,
        startTime,
        endTime,
        chapterStringified,
        chapter
      )) return;

      this.updateChaptersChild(chapterNavigationComponent, chapter, startTime);

    });
  }

  updateChaptersCue(chaptersTrack, startTime, endTime, chapterText, chapter) {
    const cue = chaptersTrack.cues.getCueById(chapter.urn);

    if (
      cue.text === chapterText &&
      cue.startTime === startTime &&
      cue.endTime === endTime
    ) return false;

    cue.startTime = startTime;
    cue.endTime = endTime;
    cue.text = chapterText;

    return true;
  }

  updateChaptersChild(chapterNavigationComponent, chapter, startTime) {
    if (
      !chapterNavigationComponent ||
      !chapterNavigationComponent.chaptersBar
    ) return;

    const child = chapterNavigationComponent.chaptersBar.getChildById(chapter.urn);

    // no child found
    if (!child) return false;

    child.$('.vjs-card-title').textContent = chapter.title;
    child.$('.vjs-card-duration').textContent = pillarbox.formatTime(
      chapter.duration / 1_000, 600
    );
    child.$('.vjs-card-img').src = chapter.imageUrl;
    child.options({
      clickHandler: ([e]) => {
        e.preventDefault();

        this.player().currentTime(startTime + 0.1);
      }
    });

    return true;
  }

  removeChapters(chapterNavigationComponent, chaptersTrack, chapterList = []) {
    if (
      !chapterNavigationComponent ||
      !chapterNavigationComponent.chaptersBar
    ) return;

    const cues = Array.from(chaptersTrack.cues);

    // no chapter
    if (!cues.length) return;

    // remove everything
    if (cues.length && !chapterList.length) {
      Array.from(cues).forEach(cue => {
        const chapter = chapterNavigationComponent.chaptersBar.getChildById(cue.id);

        chapter.dispose();
        chapterNavigationComponent.chaptersBar.removeChild(chapter);
        chaptersTrack.removeCue(cue);
      });

      return;
    }

    // specific chapter
    cues.forEach(cue => {
      if (chapterList.map(chapter => chapter.urn).includes(cue.id)) return;

      chaptersTrack.removeCue(cue);

      const chapter = chapterNavigationComponent.chaptersBar.getChildById(cue.id);
      chapter.dispose();
      chapterNavigationComponent.chaptersBar.removeChild(chapter);
    });
  }

  dispose() {
    this.clearInterval(this.chapterUpdateInterval);

    this.off(
      this.player().textTracks(),
      'addtrack',
      this.handleChapterInitialization
    );

    this.off(
      this.player(),
      'loadeddata',
      this.handleStartLongPolling
    );

    this.off(
      this.player(),
      ['ended', 'dispose', 'playerreset', 'error'],
      this.handleStopLongPolling
    );

    super.dispose();
  }
}

pillarbox.registerComponent('ChapterUpdater', ChapterUpdater);
export default ChapterUpdater;
