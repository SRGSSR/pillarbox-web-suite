/**
 * The distance of a wheel event in pixels.
 *
 * @ignore
 * @param {HTMLElement} el the element to scroll
 * @param {WheelEvent} event the wheel event
 * @returns {number} the distance in pixels
 */
const distance = (el, { deltaY, deltaMode }) => {
  if (deltaMode === WheelEvent.DOM_DELTA_LINE) return deltaY * 40;
  if (deltaMode === WheelEvent.DOM_DELTA_PAGE) return deltaY * el.clientWidth;

  return deltaY;
};

/**
 * Scrolls an element horizontally with a vertical wheel.
 *
 * @param {HTMLElement} el the element to scroll
 * @param {WheelEvent} event the wheel event
 */
const horizontalWheel = (el, event) => {
  const { deltaX, deltaY, shiftKey, ctrlKey } = event;

  if (shiftKey || ctrlKey || Math.abs(deltaX) >= Math.abs(deltaY)) return;
  if (el.scrollWidth <= el.clientWidth) return;

  el.scrollLeft += distance(el, event);
  event.preventDefault();
};

export default horizontalWheel;
