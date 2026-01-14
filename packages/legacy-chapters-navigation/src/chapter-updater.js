import pillarbox from '@srgssr/pillarbox-web';

/**
* @ignore
* @type {typeof import('video.js/dist/types/component').default}
*/
const Component = pillarbox.getComponent('Component');

class ChapterUpdater extends Component {
  chapterUpdateInterval;
  cachedUrn;

  constructor(player, options, ready) {
    const opts = pillarbox.obj.merge(
      { pollingDelay: 30_000 },
      options,
      { createEl: false }
    );

    super(player, opts, ready);

    this.handleStartLongPolling = this.handleStartLongPolling.bind(this);
    this.handleStopLongPolling = this.handleStopLongPolling.bind(this);

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

  handleStartLongPolling() {
    this.clearInterval(this.chapterUpdateInterval);

    const currentSource = this.player().currentSource();

    this.cachedUrn = currentSource
      && currentSource.mediaData
      && currentSource.mediaData.urn;

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

  async update(urn) {
    const legacyChaptersNavigation = this.player()
      .legacyChaptersNavigation;

    if (
      !legacyChaptersNavigation ||
      !legacyChaptersNavigation.chaptersBar
    ) return;

    const { chapterList } = await this.player()
      .options()
      .srgOptions
      .dataProvider(urn);

    const chaptersUrn = legacyChaptersNavigation
      .chaptersBar
      .chapters()
      .map(chapter => chapter.metadata.urn);

    const chaptersToAdd = chapterList
      .filter(chapter =>
        !chaptersUrn.includes(chapter.urn) &&
        chapter.urn !== this.cachedUrn);

    chaptersToAdd.forEach(chapter => {
      legacyChaptersNavigation.addChapter(chapter);
    });
  }

  dispose() {
    this.clearInterval(this.chapterUpdateInterval);
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
