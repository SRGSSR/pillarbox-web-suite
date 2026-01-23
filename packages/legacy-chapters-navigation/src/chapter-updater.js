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
  cachedUrn;
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

  async handleChapterInitialization({ track : chapterTrack }) {
    if (chapterTrack.id !== 'srgssr-chapters') return;

    const {
      mediaData: {
        urn,
        live
      } = {}
    } = this.player().currentSource();

    this.cachedUrn = urn;
    this.isLive = live;

    // VOD
    if (!this.isLive) return;

    const chapterList = await this.fetchChaptersList(this.cachedUrn) || [];

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

    // VOD
    if (!this.isLive) return;

    this.chapterUpdateInterval = this.setInterval(() => {
      const currentSource = this.player().currentSource();

      if (
        !currentSource ||
        !currentSource.mediaData ||
        currentSource.mediaData.urn !== this.cachedUrn
      ) return;

      this.update(this.cachedUrn);
    }, this.options().pollingDelay);
  }

  handleStopLongPolling() {
    this.clearInterval(this.chapterUpdateInterval);
  }

  async fetchChaptersList(urn) {
    const { chapterList } = await this.player()
      .options()
      .srgOptions
      .dataProvider(urn);

    return chapterList
      .filter(chapter => chapter.urn !== this.cachedUrn);
  }

  async update(urn) {
    const legacyChaptersNavigation = this.player()
      .legacyChaptersNavigation;
    const srgssrChaptersTrack = this.player().textTracks().getTrackById('srgssr-chapters');

    if (
      !srgssrChaptersTrack ||
      !legacyChaptersNavigation ||
      !legacyChaptersNavigation.chaptersBar
    ) return;

    const chapterList = await this.fetchChaptersList(urn);
    const chaptersUrn = legacyChaptersNavigation
      .chaptersBar
      .chapters()
      .map(chapter => chapter.metadata.urn);
    const chaptersToAdd = chapterList
      .filter(chapter =>
        !chaptersUrn.includes(chapter.urn) &&
        chapter.urn !== this.cachedUrn);

    chaptersToAdd.forEach(chapter => {
      legacyChaptersNavigation.addChapter(srgssrChaptersTrack, chapter);
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
