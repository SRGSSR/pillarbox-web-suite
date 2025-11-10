import videojs from 'video.js';
import { version } from '../package.json';

/* global chrome, cast */

/**
 * @ignore
 * @type {typeof import('video.js/dist/types/tech/tech').default}
 */
const Tech = videojs.getTech('Tech');

/**
 * Chromecast Media Controller - Tech
 *
 * @class Chromecast
 * @extends Tech
 */
class Chromecast extends Tech {
  /**
   * Create an instance of this Tech.
   *
   * @param {Object} [options] the key/value store of player options
   * @param {Function} [ready] callback function to execute when
   *                           the `Chromecast` is ready
   */
  constructor(options, ready) {
    super(options, ready);

    if (!options.source) {
      return;
    }

    this.setupInitialState(options);
    this.bindListenersContext();
    this.initRemotePlayer();
    this.initRemoteListeners();

    this.setSource(options.source);
  }

  /**
   * Setup initial state.
   *
   * @param {Object} options the options object
   */
  setupInitialState(options) {
    this.isScrubbing_ = false;
    this.isSeeking = false;
    this.hasTracks = true;

    this.localPlayer = videojs(options.playerId);
    this.localPlayer.addClass('vjs-chromecast-connected');
    this.localPlayer.controlBar.lockShowing();
  }

  /**
   * Bind listeners to the current context.
   */
  bindListenersContext() {
    this.audioTrackChangeListener = this.audioTrackChangeListener.bind(this);
    this.textTrackChangeListener = this.textTrackChangeListener.bind(this);
    this.anyChangeListener = this.anyChangeListener.bind(this);
  }

  /**
   * Initialize the remote player and controller.
   */
  initRemotePlayer() {
    if (!window.cast) {
      return;
    }

    const {
      RemotePlayer,
      RemotePlayerController,
      RemotePlayerEventType,
    } = window.cast.framework;

    this.remotePlayer = new RemotePlayer();
    this.remotePlayerController = new RemotePlayerController(this.remotePlayer);
    this.remotePlayerEventType = RemotePlayerEventType;
  }

  /**
   * Initialize remote player listeners.
   */
  initRemoteListeners() {
    this.remotePlayerController.addEventListener(
      this.remotePlayerEventType.ANY_CHANGE,
      this.anyChangeListener
    );
  }

  /**
   * Handles any changes in the player state.
   *
   * @param {cast.framework.RemotePlayerChangedEvent} playerState the player
   * state
   */
  anyChangeListener(playerState) {
    this.initTracks(playerState);
    this.initDuration(playerState);
    this.triggerWaiting(playerState);
    this.handleSeeking(playerState);
    this.handlePlaying(playerState);
    this.handlePause(playerState);
    this.handleEnded(playerState);
  }

  /**
   * Initialize audio an text tracks.
   *
   * Will:
   * - get the tracks from the remote player
   * - add change event listeners
   * - restore tracks from remote to local or local to remote depending
   *   if the cast session starts or resumes
   *
   *
   * @param {cast.framework.RemotePlayerChangedEvent} playerState the player state
   */
  initTracks(playerState) {
    if (!(
      playerState.field === 'mediaInfo' &&
      playerState.value &&
      playerState.value.tracks &&
      !this.hasTracks
    )) return;

    this.hasTracks = true;

    this.addAudioTracks(this.remotePlayerAudioTracks());
    this.addTextTracks(this.remotePlayerTextTracks());

    this.audioTracks().on('change', this.audioTrackChangeListener);
    this.textTracks().on('change', this.textTrackChangeListener);

    this.restoreTracksFromRemote();
    this.restoreTracksFromLocal();
  }

  /**
   * Initialize the duration.
   *
   * @param {cast.framework.RemotePlayerChangedEvent} playerState the player
   * state
   */
  initDuration(playerState) {
    if (!(playerState.field === 'duration' && playerState.value !== 0)) return;

    this.trigger('durationchange');
  }

  /**
   * Trigger a `waiting` event each time the remote player is buffering.
   *
   * @param {cast.framework.RemotePlayerChangedEvent} playerState the player
   * state
   */
  triggerWaiting(playerState) {
    if (playerState.value === 'BUFFERING') {
      this.trigger('waiting');
    }
  }

  /**
   * Handle seeking.
   *
   * @param {cast.framework.RemotePlayerChangedEvent} playerState the player
   * state
   */
  handleSeeking(playerState) {
    // On the web receiver, the `field` property containing the value `videoInfo`
    // allows, when combined with the other values, determining that a seek
    // operation has finished, even when the media is paused. This prevents a
    // spinner from continuing to spin while waiting for playback to resume,
    // even though the seek operation has already completed.

    // On the Android receiver, however, the `field` property containing `videoInfo`
    // does not seem to be emitted, so the `mediaInfo` is used instead.
    if (['mediaInfo', 'videoInfo'].includes(playerState.field) && !this.scrubbing() && this.isSeeking) {
      this.isSeeking = false;
      this.trigger('seeked');
    }
  }

  /**
   * Handle playing.
   *
   * @param {cast.framework.RemotePlayerChangedEvent} playerState the player
   * state
   */
  handlePlaying(playerState) {
    if (playerState.value === 'PLAYING') {
      this.trigger('play');
      this.trigger('playing');
    }
  }

  /**
   * Handle paused.
   *
   * @param {cast.framework.RemotePlayerChangedEvent} playerState the player
   * state
   */
  handlePause(playerState) {
    if (playerState.value === 'PAUSED') {
      this.trigger('pause');
    }
  }

  /**
   * Handle ended.
   *
   * @param {cast.framework.RemotePlayerChangedEvent} playerState the player
   * state
   */
  handleEnded(playerState) {
    if (playerState.value === 'IDLE') {
      this.trigger('ended');
    }
  }


  /**
   * Restore audio and text tracks from remote to local.
   */
  restoreTracksFromRemote() {
    this.getActiveTrackIds().forEach((trackId) => {
      const audioTrack = this.audioTracks().getTrackById(trackId);
      const textTrack = this.textTracks().getTrackById(trackId);

      if (audioTrack) {
        audioTrack.enabled = true;
      }

      if (textTrack) {
        textTrack.mode = 'showing';
      }
    });
  }

  /**
   * Restore audio and text tracks from local to remote.
   */
  restoreTracksFromLocal() {
    const { audioTrack, textTrack } = this.options().source;
    // avoid resetting the playback position. Happens when restoring the audio
    // track if the selected one isn't the default when the cast session starts.
    // TODO: create a reduce test case and open an issue https://issuetracker.google.com/issues?q=status:open%20componentid:1456266
    const MAGIC_NUMBER = 2_000;

    this.setTimeout(() => {
      this.activeRemoteTrack({
        audioTrackId: this.findRemoteAudioTrackId(audioTrack),
        textTrackId: this.findRemoteTextTrackId(textTrack)
      }, () => {
        this.restoreTracksFromRemote();
      });
    }, MAGIC_NUMBER);
  }

  /**
   * Set the source for the player.
   *
   * @param {Object} source the source object
   */
  setSrc(source) {
    if (this.currentSource_) {
      this.trigger('emptied');
    }

    if (!source) {
      return;
    }

    this.currentSession =
      cast.framework.CastContext.getInstance().getCurrentSession();

    if (
      this.currentSession.getSessionState() ===
      cast.framework.SessionState.SESSION_RESUMED &&
      this.currentSession.getMediaSession()
    ) {
      this.resumeCastingSession();

      return;
    }

    this.loadMedia(source);
  }

  /**
   * Resume cast session.
   *
   * Will:
   * - trigger a play/playing event if the content is not paused
   * - clear local tracks
   * - restore volume level from remote
   * - restore muted state from remote
   * - reset the background image
   */
  resumeCastingSession() {
    this.ready(() => {
      if (!this.remotePlayer.isPaused) {
        this.trigger('play');
        this.trigger('playing');
      }

      this.hasStarted_ = true;
      this.hasTracks = false;

      this.clearTracks(['audio', 'text']);
      this.setVolume(this.remotePlayer.volumeLevel);
      this.setMuted(this.remotePlayer.isMuted);

      this.el().style = `background-image: url("${this.poster()}")`;

      // calling this method triggers a mediaInfo event
      this.getMediaSession().getStatus();
    });

    this.triggerReady();
  }

  /**
   * Load media into the player.
   *
   * @param {Object} source the source object
   */
  loadMedia(source) {
    const { src, type } = this.localPlayer
      .googleCastSender()
      .sourceResolver(source);
    const { currentTime = null } = source;
    const mediaInfo = new chrome.cast.media.MediaInfo(src, type);
    const request = new chrome.cast.media.LoadRequest(mediaInfo);

    // TODO: add resolvers to handle entity and aTvEntity

    request.currentTime = currentTime;

    this.currentSession.loadMedia(request).then(
      () => {
        this.triggerReady();
        this.trigger('loadstart');
        this.trigger('loadedmetadata');
        this.trigger('loadeddata');
        this.trigger('play');
        this.trigger('playing');

        this.hasStarted_ = true;
        this.hasTracks = false;

        this.clearTracks(['audio', 'text']);
      },
      (errorCode) => {
        this.error(errorCode);
      }
    );
  }

  load() {
    this.loadMedia(this.currentSource_);
  }

  controls() {
    return false;
  }

  /**
   * Get the current media session if any.
   *
   * @returns {chrome.cast.media.Media | undefined} the current media session
   */
  getMediaSession() {
    if (!this.currentSession || !this.currentSession.getMediaSession()) {
      return;
    }

    return this.currentSession.getMediaSession();
  }

  dispose() {
    this.audioTracks().off('change', this.audioTrackChangeListener);
    this.textTracks().off('change', this.textTrackChangeListener);

    if (this.remotePlayerController) {
      this.remotePlayerController.removeEventListener(
        this.remotePlayerEventType.ANY_CHANGE,
        this.anyChangeListener
      );
    }

    if (this.localPlayer) {
      this.localPlayer.controlBar.unlockShowing();
      this.localPlayer.removeClass('vjs-chromecast-connected');
    }

    if (this.currentSession) {
      this.currentSession.endSession();
    }

    super.dispose();
  }

  duration() {
    // -1 is live
    const duration = this.remotePlayer.duration;

    return duration === -1 ? Infinity : duration;
  }

  ended() {
    if(!this.src().src) return;

    return this.remotePlayer
      && this.remotePlayer.playerState === 'IDLE' ? true : false;
  }

  muted() {
    return this.remotePlayer.isMuted;
  }

  pause() {
    if (this.remotePlayer && !this.remotePlayer.isPaused) {
      this.remotePlayerController.playOrPause();
      this.trigger('pause');
    }
  }

  paused() {
    if (this.ended()) {
      return true;
    }

    return this.remotePlayer.isPaused;
  }

  play() {
    if (!this.remotePlayer) return;

    if (this.ended()) {
      this.load();

      return;
    }

    if (this.remotePlayer.isPaused) {
      this.remotePlayerController.playOrPause();
      this.trigger('play');
      this.trigger('playing');
    }
  }

  playbackRate() {
    return this.getMediaSession() ? this.getMediaSession().playbackRate : 1;
  }

  poster() {
    const remotePoster = this.remotePlayer && this.remotePlayer.imageUrl;

    return remotePoster || this.options().poster;
  }

  src(source) {
    if (!source) {
      return this.localPlayer.currentSource();
    }
    this.setSrc(source);
  }

  setVolume(volumeLevel) {
    if (!this.remotePlayer || !this.hasStarted_) {
      return;
    }

    if (this.remotePlayer.volumeLevel !== volumeLevel) {
      this.remotePlayer.volumeLevel = volumeLevel;
      this.remotePlayerController.setVolumeLevel();
    }

    this.trigger('volumechange');
  }

  seekable() {
    if (!this.getMediaSession()) {
      return videojs.time.createTimeRanges(0, 0);
    }

    if (!this.getMediaSession().liveSeekableRange) {
      return videojs.time.createTimeRanges(0, this.remotePlayer.duration);
    }

    const { end, start } =
      this.getMediaSession().getEstimatedLiveSeekableRange();

    return videojs.time.createTimeRanges(start, end);
  }

  seeking() {
    return this.isSeeking;
  }

  setScrubbing(isScrubbing) {
    this.isScrubbing_ = isScrubbing;
  }

  scrubbing() {
    return this.isScrubbing_;
  }

  currentTime() {
    if (this.scrubbing() || this.seeking()) {
      return this.seekTime();
    }

    // CurrentTime after seek is no more updated
    const currentTime = this.getMediaSession() ?
      this.getMediaSession().getEstimatedTime() : 0;

    return currentTime;
  }

  setCurrentTime(time) {
    const duration = this.duration();

    if (time > duration || !this.remotePlayer.canSeek) {
      return;
    }

    this.seekTime(time);

    // Seeking to any place within (approximately) 1 second of the end of the
    // item causes the Video.js player to get stuck in a BUFFERING state. To
    // work around this, we only allow seeking to within 1 second of the end
    // of an item.
    this.isSeeking = true;
    this.remotePlayer.currentTime = Math.min(duration - 1, time);
    this.remotePlayerController.seek();

    this.trigger('timeupdate');
    this.trigger('seeking');
  }

  /**
   * Get or set the seek time.
   *
   * @param {number} [time] the time to seek to
   *
   * @returns {number|undefined} the seek time
   */
  seekTime(time) {
    if (time === undefined) {
      return this.seekTimeValue;
    }

    this.seekTimeValue = time;
  }

  reset() {
    // noop
  }

  setMuted(isMuted) {
    if (this.remotePlayer.isMuted !== isMuted) {
      this.remotePlayerController.muteOrUnmute();
      this.trigger('volumechange');
    }
  }

  setPlaybackRate() {
    // Not supported
  }

  readyState() {
    if (this.remotePlayer.playerState === 'IDLE' || this.remotePlayer.playerState === 'BUFFERING') {
      return 0;
    }

    return 4;
  }

  volume() {
    return this.remotePlayer.volumeLevel;
  }

  /**
   * Creates the div element for the tech.
   *
   * @returns {HTMLDivElement} the div element
   */
  createEl() {
    const el = super.createEl('div', {
      id: this.options().techId,
      className: 'vjs-tech vjs-tech-chromecast',
    }, {
      style: `background-image: url("${this.poster()}")`
    });

    this.ready(() => {
      const iconEl = videojs.dom.createEl('div', {
        className: 'vjs-icon-chromecast-active icon',
      });

      const contentEl = videojs.dom.createEl(
        'p',
        {
          className: 'vjs-tech-chromecast-title'
        },
        {},
        this.localize('Playing on {1}', [
          this.currentSession.getCastDevice().friendlyName
        ])
      );

      const titleContainer = videojs.dom.createEl('div', {
        className: 'vjs-tech-chromecast-container',
      }, {}, [iconEl, contentEl]);

      el.appendChild(titleContainer);
    });

    return el;
  }

  /**
   * Get all remote player tracks.
   *
   * @returns {Array} the remote player tracks
   */
  remotePlayerTracks() {
    return this.remotePlayer.mediaInfo.tracks;
  }

  /**
   * Get remote player audio tracks.
   *
   * @returns {Array} the remote player audio tracks
   */
  remotePlayerAudioTracks() {
    return this.remotePlayerTracks().filter(({ type }) => type === 'AUDIO');
  }

  /**
   * Get remote player text tracks.
   *
   * @returns {Array} the remote player text tracks
   */
  remotePlayerTextTracks() {
    return this.remotePlayerTracks().filter(({ type }) => type === 'TEXT');
  }

  /**
   * Find a remote text track ID.
   *
   * @param {Object} track the track to find
   * @returns {number|undefined} the track ID
   */
  findRemoteTextTrackId(track) {
    if (!track) {
      return;
    }

    const normalizeLanguage = (language) => [
      language,
      language.replace('_', '')
    ];
    const [{ trackId } = {}] = this.remotePlayerTextTracks().filter(
      ({ language, name }) => {
        const normLang = normalizeLanguage(language);
        const hasLang = normLang.includes(track.language);

        return (hasLang && track.label === name) || hasLang;
      }
    );

    return trackId;
  }

  /**
   * Find a remote audio track ID.
   *
   * @param {Object} track the track to find
   * @returns {number|undefined} the track ID
   */
  findRemoteAudioTrackId(track) {
    if (!track) {
      return;
    }

    const [{ trackId } = {}] = this.remotePlayerAudioTracks()
      .filter(({ language }) => track.language === language);

    return trackId;
  }

  /**
   * Add audio tracks to the player.
   *
   * @param {Array} tracks the tracks to add
   */
  addAudioTracks(tracks) {
    const localPlayerAudioTrack = this.options().source.audioTrack;

    tracks.forEach((track) => {
      const isAudioEnabled = localPlayerAudioTrack ?
        localPlayerAudioTrack.enabled &&
        localPlayerAudioTrack.language === track.language : false;

      this.audioTracks().addTrack(new videojs.AudioTrack({
        id: track.trackId,
        language: track.language,
        label: track.name,
        enabled: isAudioEnabled,
        kind: track.trackId === 1 ? 'main' : 'alternative',
      }));
    });
  }

  /**
   * Add text tracks to the player.
   *
   * @param {Array} tracks the tracks to add
   */
  addTextTracks(tracks) {
    const localPlayerTextTrack = this.options().source.textTrack;

    tracks.forEach((track) => {
      const mode = localPlayerTextTrack && localPlayerTextTrack.mode === 'showing' &&
        localPlayerTextTrack.language === track.language ?
        'showing' :
        'disabled';

      this.textTracks().addTrack(new videojs.TextTrack({
        id: track.trackId,
        language: track.language,
        label: track.name,
        mode,
        kind: 'subtitles',
        tech: this
      }));
    });
  }

  /**
   * Get active track IDs.
   *
   * @returns {Array} the active track IDs
   */
  getActiveTrackIds() {
    return this.getMediaSession().activeTrackIds;
  }

  /**
   * Handle audio track changes.
   */
  audioTrackChangeListener() {
    const currentTextTrack = Array.from(this.audioTracks())
      .find((track) => track.enabled);
    const audioTrackId = this.findRemoteAudioTrackId(currentTextTrack);

    this.activeRemoteTrack({
      audioTrackId,
    });
  }

  /**
   * Handle text track changes.
   */
  textTrackChangeListener() {
    const currentTextTrack = Array.from(this.textTracks()).find((track) => track.mode === 'showing');
    const textTrackId = this.findRemoteTextTrackId(currentTextTrack);

    this.activeRemoteTrack({
      textTrackId,
    });
  }

  /**
   * Activate a remote track.
   *
   * @param {Object} tracksObject the tracks to activate
   * @param {Function} [successCallback] the success callback
   * @param {Function} [errorCallback] the error callback
   */
  activeRemoteTrack(tracksObject, successCallback, errorCallback) {
    if (!this.remotePlayer || !this.remotePlayer.mediaInfo) {
      return;
    }

    this.activeTracks = {
      ...this.activeTracks,
      ...tracksObject
    };

    this.editRemoteTracksInfo(
      [
        this.activeTracks.audioTrackId,
        this.activeTracks.textTrackId,
      ],
      successCallback,
      errorCallback
    );
  }

  /**
   * Edit remote tracks info.
   *
   * @param {Array} [trackIds=[]] the track IDs to edit
   * @param {Function} [successCallback] the success callback
   * @param {Function} [errorCallback] the error callback
   */
  editRemoteTracksInfo(trackIds = [], successCallback, errorCallback) {
    if (!this.getMediaSession()) {
      return;
    }

    const { cast: { media } } = chrome;

    const request = new media.EditTracksInfoRequest(
      trackIds.filter((trackId) => trackId)
    );

    this.getMediaSession().editTracksInfo(
      request,
      successCallback,
      errorCallback
    );
  }

  /**
   * Check if the tech is supported.
   *
   * @returns {boolean} true if the tech is supported
   */
  static isSupported() {
    return (
      Boolean(window.chrome) &&
      Boolean(window.chrome.cast) &&
      Boolean(window.cast) &&
      cast.framework.CastContext.getInstance().getCastState() ===
      cast.framework.CastState.CONNECTED
    );
  }

  get featuresPlaybackRate() {
    return false;
  }

  get featuresVolumeControl() {
    return true;
  }

  get featuresTimeupdateEvents() {
    return false;
  }

  get movingMediaElementInDOM() {
    return false;
  }

  get featuresFullscreenResize() {
    return false;
  }

  get featuresProgressEvents() {
    return false;
  }

  get featuresNativeTextTracks() {
    return false;
  }

  get featuresNativeAudioTracks() {
    return false;
  }

  get featuresNativeVideoTracks() {
    return false;
  }

  /**
   * Get the native source handler.
   *
   * @returns {Object} the native source handler
   */
  static get nativeSourceHandler() {
    return {
      name: 'videojs-chromecast',
      VERSION: version,
      canHandleSource(srcObj, options = {}) {
        return Chromecast.canPlayType(srcObj.type, options);
      },

      handleSource(source, tech, options = {}) {
        const { source: { castSessionResumed = false } = {} } = options;

        tech.setSrc({ castSessionResumed, ...source });
      },

      canPlaySource(srcObj, options = {}) {
        return Chromecast.canPlayType(srcObj.type, options);
      },

      // Only in receiver :(
      // https://developers.google.com/cast/docs/reference/web_receiver/cast.framework.CastReceiverContext#canDisplayType
      canPlayType(type, options = {}) {
        if (!cast.framework.CastContext.getInstance().getCurrentSession()) {
          return false;
        }

        return videojs.VhsSourceHandler.canPlayType(type, options);
      }
    };
  }

  /**
   * Get the version of the tech.
   *
   * @returns {string} the version
   */
  static get VERSION() {
    return version;
  }
}

Chromecast.withSourceHandlers(Chromecast);
Chromecast.registerSourceHandler(Chromecast.nativeSourceHandler, 0);

videojs.registerTech('chromecast', Chromecast);

export default Chromecast;
