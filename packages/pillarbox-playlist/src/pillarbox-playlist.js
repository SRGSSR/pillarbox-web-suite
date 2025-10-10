import videojs from 'video.js';
import { version } from '../package.json';

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/plugin').default}
 */
const Plugin = videojs.getPlugin('plugin');
const log = videojs.log.createLogger('pillarbox-playlist');

/**
 * Defines the available repeat modes for the playlist.
 *
 * @enum {number}
 */
export const RepeatMode = {
  /**
   * Disables repeat mode.
   */
  NO_REPEAT: 0,
  /**
   * Loops the entire playlist. Once the last element of the playlist ends the n
   * ext element will be the first one. This mode only works forwards,
   * i.e. when advancing to the next element.
   */
  REPEAT_ALL: 1,
  /**
   * Loops the currently playing item in the playlist.
   */
  REPEAT_ONE: 2,
};

/**
 * Represents a Plugin that allows control over a playlist.
 */
export class PillarboxPlaylist extends Plugin {
  /**
   * The items in the playlist.
   *
   * @type {PlaylistItem[]}
   * @private
   */
  items_ = [];

  /**
   * The current index.
   *
   * @type {number}
   * @private
   */
  currentIndex_ = -1;

  /**
   * Threshold in seconds for determining the behavior when navigating to the previous item.
   *
   * - If the media is live, {@link previous} will navigate to the previous item,
   *   regardless of the threshold.
   * - If the playback position is within this threshold, {@link previous} will
   *   navigate to the previous item.
   * - If the playback position is beyond this threshold, {@link previous} will
   *   restart the current media.
   *
   * To disable this functionality, set the value to undefined or infinity.
   *
   * @type {number}
   * @default 3
   */
  previousNavigationThreshold = 3;

  /**
   * The current repeat mode of the player. By default, repeat is disabled.
   *
   * @type {RepeatMode}
   */
  repeat = RepeatMode.NO_REPEAT;

  /**
   * Toggles the repeat mode of the player to the opposite of its current state.
   *
   * @param {RepeatMode} [force] Optional.
   *        If provided, sets the repeat mode to the specified state.
   *        If omitted, the repeat mode will cycle in order through: no repeat, repeat all and repeat one.
   */
  toggleRepeat(force = undefined) {
    this.repeat = force ?? (this.repeat + 1) % Object.keys(RepeatMode).length;
  }

  /**
   * Checks if the repeat mode is set to {@link RepeatMode.REPEAT_ONE}.
   *
   * @returns {boolean} True if the repeat mode is {@link RepeatMode.REPEAT_ONE}, false otherwise.
   */
  isRepeatOneMode() {
    return this.repeat === RepeatMode.REPEAT_ONE;
  }

  /**
   * Checks if the repeat mode is set to {@link RepeatMode.REPEAT_ALL}.
   *
   * @returns {boolean} True if the repeat mode is {@link RepeatMode.REPEAT_ALL}, false otherwise.
   */
  isRepeatAllMode() {
    return this.repeat === RepeatMode.REPEAT_ALL;
  }

  /**
   * Checks if the repeat mode is set to {@link RepeatMode.NO_REPEAT}.
   *
   * @returns {boolean} True if the repeat mode is {@link RepeatMode.NO_REPEAT}, false otherwise.
   */
  isNoRepeatMode() {
    return this.repeat === RepeatMode.NO_REPEAT;
  }

  /**
   * Whether auto-advance is enabled or not.
   *
   * @type boolean
   */
  autoadvance = false;

  /**
   * Toggles the auto-advance mode of the player to the opposite of its current state.
   *
   * @param {boolean} [force] Optional. If provided, sets the auto-advance mode to the specified boolean value (true or false).
   *                          If omitted, the auto-advance mode will toggle to the opposite of its current state.
   */
  toggleAutoadvance(force = undefined) {
    this.autoadvance = force ?? !this.autoadvance;
  }

  /**
   * Handles the 'ended' event when triggered. This method serves as a proxy to
   * the main `ended` handler, ensuring that additional logic can be executed or
   * making it easier to detach the event listener later.
   *
   * @private
   */
  onEnded_ = () => this.handleEnded();

  /**
   * Handles the 'loadeddata' event when triggered. This method serves as a
   * proxy to the main `loaded` handler, ensuring that additional logic can be
   * executed or making it easier to detach the event listener later.
   *
   * @private
   */
  onLoadedData_ = () => this.handleLoadedData();

  /**
   * Creates an instance of a pillarbox playlist.
   *
   * @param {import('video.js/dist/types/player.js').default} player - The player instance.
   * @param {Object} options - Configuration options for the plugin.
   * @param {Array} [options.playlist=[]] - An array of playlist items to be initially loaded into the player.
   * @param {Boolean} [options.repeat=false] - If true, the playlist will start over automatically after the last item ends.
   * @param {Boolean} [options.autoadvance=false] - If enabled, the player will automatically move to the next item after the current one ends.
   * @param {Number} [options.previousNavigationThreshold=3] - Threshold in seconds for determining the behavior when navigating to the previous item.
   */
  constructor(player, options) {
    super(player);

    options = this.options_ = videojs.obj.merge(this.options_, options);
    if (options.playlist && options.playlist.length) {
      player.ready(() => {
        this.load(...options.playlist);
      });
    }

    this.autoadvance = Boolean(options.autoadvance);
    this.repeat = options.repeat ?? this.repeat;
    this.previousNavigationThreshold =
      Number.isFinite(options.previousNavigationThreshold) ?
      options.previousNavigationThreshold :
      this.previousNavigationThreshold;

    this.player.on('ended', this.onEnded_);
    this.player.on('loadeddata', this.onLoadedData_);
  }

  dispose() {
    this.player.off('ended', this.onEnded_);
    this.player.off('loadeddata', this.onLoadedData_);
  }

  /**
   * Loads a playlist into the player. This method will load the first element
   * in the playlist. Use it to initialize the playlist.
   *
   * Note: A copy of the playlist items array is made internally to ensure that
   * external modifications to the array do not affect the internal state and
   * vice versa.
   *
   * @param {PlaylistItem[]} items The playlist items to load.
   */
  load(items) {
    this.items_ = [...items];
    this.select(0);
  }

  /**
   * Adds one or more items at the end of the playlist. This method will not
   * load any of the elements. Use it to add items while the playlist is
   * running.
   *
   * @param {...PlaylistItem} items the items to add to the playlist.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push
   */
  push(...items) {
    this.items_.push(...items);
    this.updateState_();
  }

  /**
   * Modifies the contents of the playlist by removing or replacing existing
   * elements and/or adding new elements.
   *
   * The method also adjusts currentIndex accordingly if items are added or
   * removed in such a way that it affects the currentIndex.
   *
   * If the current item is deleted then the currentIndex becomes -1, the
   * current element will continue playing but the next element will be the
   * first element in the playlist.
   *
   * @param {number} start The zero-based location in the array from which to
   *                       start removing elements.
   * @param {number} deleteCount The number of elements to remove.
   * @param {...PlaylistItem} items The items to add to the playlist.
   *
   * @return {PlaylistItem[]} An array containing the deleted elements.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
   */
  splice(start, deleteCount, ...items) {
    const itemsAddedCount = items.length;
    const deletedElements = this.items_.splice(start, deleteCount, ...items);
    const deletedElementsCount = deletedElements.length;

    if (this.currentIndex_ >= start &&
      this.currentIndex_ < start + deletedElementsCount) {
      // Current item was removed, set currentIndex to -1
      this.currentIndex_ = -1;
    } else if (this.currentIndex_ >= start) {
      // Adjust currentIndex based on the net items added/removed
      this.currentIndex_ =
        this.currentIndex_ - deletedElementsCount + itemsAddedCount;
    }

    this.updateState_();

    return deletedElements;
  }

  /**
   * Clears the internal playlist. This method empties the playlist and resets
   * the current index to -1.
   *
   * Note that this method does not stop the currently playing media or unload it.
   */
  clear() {
    this.items_ = [];
    this.currentIndex_ = -1;
    this.updateState_();
  }

  /**
   * Reverses the order of the items in the playlist and updates the current index to reflect
   * the new position of the previously current item after reversal.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse
   */
  reverse() {
    if (!this.items_.length) return;

    this.items_.reverse();
    this.currentIndex_ = this.items_.length - 1 - this.currentIndex_;
    this.updateState_();
  }

  /**
   * Sorts the items in the playlist using the provided compare function and updates the current
   * index to reflect the new position of the previously current item after sorting.
   *
   * @method sort
   * @param {Function} compareFn - A function that defines the sort order.
   *        The return value should be a number whose sign indicates the relative order
   *        of the two elements: negative if a is less than b, positive if a is
   *        greater than b, and zero if they are equal. NaN is treated as 0. If omitted,
   *        the array elements are converted to strings, then sorted according to each
   *        character's Unicode code point value.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
   */
  sort(compareFn) {
    if (!this.items_.length) return;

    const currentItem = this.currentItem;

    this.items_.sort(compareFn);
    this.currentIndex_ = this.items_.indexOf(currentItem);
    this.updateState_();
  }

  /**
   * Get the currently playing index.
   *
   * @returns {number} the currently playing index.
   */
  get currentIndex() {
    return this.currentIndex_;
  }

  /**
   * Get the currently playing item.
   *
   * @returns {PlaylistItem} the currently playing item.
   */
  get currentItem() {
    return this.items_[this.currentIndex_];
  }

  /**
   * Get the current playlist items.This is a copy of the internal list
   * modifying this list will not affect the playlist. use `push` and `splice`
   * to modify the internal list.
   *
   * @returns {PlaylistItem[]} the current list of items.
   */
  get items() {
    return [...this.items_];
  }

  /**
   * Plays the playlist item at the given index. If the index is not in
   * the playlist this method has no effect.
   *
   * @param {number} index The index of the item to play.
   */
  // eslint-disable-next-line max-statements
  select(index) {
    if (index < 0 || index >= this.items_.length) {
      log.warn(`Index: ${index} is out of bounds (The current playlist has ${this.items_.length} elements)`);

      return;
    }

    if (index === this.currentIndex_) {
      log.warn(`Index: ${index} is already selected`);

      return;
    }

    const item = this.items_[index];

    this.player.src(item.sources);
    this.player.poster(item.poster);
    this.currentIndex_ = index;
    this.updateState_();
  }

  /**
   * Advances to the next item in the playlist. If {@link RepeatMode#REPEAT_ALL}
   * mode is enabled, then once the last item of the playlist is reached this
   * function will play the first one.
   */
  next() {
    if (this.hasNext()) {
      this.select(this.currentIndex_ + 1);

      return;
    }

    if (this.repeat === RepeatMode.REPEAT_ALL) this.select(0);
  }

  /**
   * Whether an element exists in the playlist after the one that is currently playing.
   * If `repeat` mode is enabled this function will still return `false` when the
   * current position is the last item in the playlist.
   *
   * @returns {boolean} true if there is an element after, false otherwise.
   */
  hasNext() {
    return this.currentIndex_ + 1 < this.items_.length;
  }

  /**
   * Navigates to the previous item in the playlist or restarts the current
   * media based on playback position.
   *
   * - If the media is live, navigates to the previous item regardless of the threshold.
   * - If playback is beyond the threshold, restarts the current media.
   * - If playback is within the threshold, navigates to the previous item.
   * - If {@link RepeatMode#REPEAT_ALL} mode is enabled, then once the first
   *   item of the playlist is reached this function will play the last one.
   *
   * @see previousNavigationThreshold
   */
  previous() {
    if (!this.isLive() &&
      this.player.currentTime() > this.previousNavigationThreshold) {
      this.player.currentTime(0);

      return;
    }

    if (this.hasPrevious()) {
      this.select(this.currentIndex_ - 1);

      return;
    }

    if (this.repeat === RepeatMode.REPEAT_ALL) {
      this.select(this.items_.length - 1);
    }
  }

  isLive() {
    const liveTracker = this.player.liveTracker;

    return liveTracker && liveTracker.isLive();
  }

  /**
   * Whether an element exists before the one that is currently playing.
   * If `repeat` mode is enabled this function will still return `false` when the
   * current position is the first item in the playlist.
   *
   * @returns {boolean} true if there is an element before, false otherwise.
   */
  hasPrevious() {
    return this.currentIndex_ > 0;
  }

  /**
   * Handles the `ended` event. If auto-advance is enabled then the next item
   * will be played, otherwise nothing happens.
   */
  handleEnded() {
    if (this.repeat === RepeatMode.REPEAT_ONE) {
      this.player.play().then(() => {});

      return;
    }

    if (!this.autoadvance) {
      return;
    }

    this.next();
  }

  /**
   * Handles the `loadeddata` event. If the currently playing item defines a
   * `startTime`, the player will automatically seek to that position once the
   * media data has loaded.
   */
  handleLoadedData() {
    const startTime = this.currentItem?.startTime;

    if (!startTime) return;

    this.player.currentTime(startTime);
  }

  /**
   * Shuffles the order of the items in the playlist randomly.
   * This method implements the Fisher-Yates shuffle algorithm to
   * ensure each permutation of the array elements is equally likely.
   */
  shuffle() {
    for (let i = this.items_.length - 1; i > 0; i -= 1) {
      // Pick a remaining element…
      const j = Math.floor(Math.random() * (i + 1));

      // And swap it with the current element.
      [this.items_[i], this.items_[j]] = [this.items_[j], this.items_[i]];

      // Check if the currentIndex was swapped, update if necessary
      if (this.currentIndex_ === i) {
        this.currentIndex_ = j;
      } else if (this.currentIndex_ === j) {
        this.currentIndex_ = i;
      }
    }

    this.updateState_();
  }

  /**
   * Updates the component's state with the current items and index.
   *
   * @private
   */
  updateState_() {
    this.setState({
      // Converts the items array to a JSON string before setting it in the state.
      // Otherwise, the change is not detected.
      items: JSON.stringify(this.items_),
      currentIndex: this.currentIndex_
    });
  }

  static get VERSION() {
    return version;
  }
}

PillarboxPlaylist.prototype.options_ = {
  autoadvance: false,
  repeat: false
};

videojs.registerPlugin('pillarboxPlaylist', PillarboxPlaylist);

/**
 * Represents a single item in the playlist.
 *
 * @typedef {Object} PlaylistItem
 * @property {any[]} sources The array of media sources for the playlist item.
 * @property {string} poster A url for the poster.
 * @property {number} startTime The time position (in seconds) where playback
 *                              should begin.
 * @property {Object} data The metadata for the playlist item. In this object
 *                          you can store properties related to the playlist
 *                          item such as `title`, the `duration`,
 *                          and other relevant metadata.
 */


