import pillarbox from '@srgssr/pillarbox-web';
import '@srgssr/svg-button';

import arrowLeft from '../assets/arrow-left.svg?raw';


/**
* @ignore
* @type {typeof import('@srgssr/svg-button').SvgButton}
*/
const SvgButton = pillarbox.getComponent('SvgButton');

class PreviousButton extends SvgButton { }

PreviousButton.prototype.options_ = {
  id: 'previousButton',
  name: 'previousButton',
  componentClass: 'SvgButton',
  className: 'pbw-chapter-button pbw-chapter-previous',
  controlText: 'Previous',
  icon: arrowLeft,
  iconName: 'arrow-left'
};

pillarbox.registerComponent('PreviousButton', PreviousButton);

export default PreviousButton;
