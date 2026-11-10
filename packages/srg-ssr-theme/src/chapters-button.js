import pillarbox from '@srgssr/pillarbox-web';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/button').default}
 */
const Button = pillarbox.getComponent('Button');

/**
 * A control bar button that opens and closes the chapters panel, visible only
 * for the tiny layout where the panel has no room to peek.
 *
 * @extends Button
 */
class ChaptersButton extends Button {
  /**
   * Toggles the chapters panel, moving the focus to the opposite control as
   * the tiny layout hides the one clicked.
   */
  handleClick() {
    const controlBar = this.player().controlBar;
    const panel = controlBar?.getChild('SrgSsrChaptersPanel');

    if (!panel) return;

    panel.toggle();

    if (panel.expanded()) {
      panel.getChild('ChaptersHeader').focus();
    } else {
      controlBar.getChild('SrgSsrChaptersButton')?.focus();
    }
  }

  /**
   * Builds the CSS class for the component.
   *
   * @returns {string} the CSS class name
   */
  buildCSSClass() {
    return `srg-ssr-chapters-button vjs-visible-text ${super.buildCSSClass()}`;
  }
}

ChaptersButton.prototype.options_ = {
  controlText: 'Chapters'
};

pillarbox.registerComponent('SrgSsrChaptersButton', ChaptersButton);

export default ChaptersButton;
