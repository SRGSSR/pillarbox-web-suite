import pillarbox from '@srgssr/pillarbox-web';
import '@srgssr/svg-button';

import arrowRight from '../assets/arrow-right.svg?raw';


/**
* @ignore
* @type {typeof import('@srgssr/svg-button').SvgButton}
*/
const SvgButton = pillarbox.getComponent('SvgButton');

class NextButton extends SvgButton { }

NextButton.prototype.options_ = {
  id: 'nextButton',
  name: 'nextButton',
  componentClass: 'SvgButton',
  className: 'pbw-chapter-button pbw-chapter-next',
  controlText: 'Next',
  icon: arrowRight,
  iconName: 'arrow-right'

};

pillarbox.registerComponent('NextButton', NextButton);

export default NextButton;
