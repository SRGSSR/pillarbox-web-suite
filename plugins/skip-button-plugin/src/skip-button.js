import pillarbox from '@srgssr/pillarbox-web';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/button').default}
 */
const Button = pillarbox.getComponent('Button');

/**
 * Represents a SkipButton component for the pillarbox player.
 *
 * @class SkipButton
 */
class SkipButton extends Button {
  /**
   * @type {TextTrackCue}
   */
  activeInterval;

  constructor(player, options) {
    super(player, options);
    this.addClass('pbw-skip-button', 'vjs-hidden', 'vjs-visible-text');
    this.player().on('srgssr/interval', ({ data }) => this.handleTimeIntervalChange(data));
  }

  handleClick(event) {
    super.handleClick(event);
    this.player().currentTime(this.activeInterval.endTime);
  }

  handleTimeIntervalChange(data) {
    this.activeInterval = data;
    if (!this.activeInterval) {
      this.hide();

      return;
    }

    /**
     * @type {import('@srgssr/pillarbox-web/dist/types/src/dataProvider/model/typedef').TimeInterval}
     */
    const timeInterval = JSON.parse(data.text);
    const text = timeInterval.type === 'OPENING_CREDITS' ? 'Skip intro' : 'Skip credits';

    this.controlText(this.localize(text));
    this.activeInterval = data;
    this.show();
  }
}

pillarbox.registerComponent('SkipButton', SkipButton);

pillarbox.addLanguage('en', {
  'Skip credits': 'Skip credits',
  'Skip intro': 'Skip intro',
});
pillarbox.addLanguage('fr', {
  'Skip credits': 'Passer',
  'Skip intro': 'Passer l’intro',
});
pillarbox.addLanguage('de', {
  'Skip credits': 'Abspann überspringen',
  'Skip intro': 'Intro überspringen'
});
pillarbox.addLanguage('it', {
  'Skip credits': 'Salta i credits',
  'Skip intro': 'Salta l\'intro',
});
pillarbox.addLanguage('rm', {
  'Skip credits': 'Sursiglir credentials',
  'Skip intro': 'Sursiglir intro',
});

export default SkipButton;
