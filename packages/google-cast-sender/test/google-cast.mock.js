import { vi } from 'vitest';

window.chrome = {
  cast: {
    AutoJoinPolicy: {
      TAB_AND_ORIGIN_SCOPED: 'tab_and_origin_scoped',
    },
    media: {
      DEFAULT_MEDIA_RECEIVER_APP_ID: 'test_app_id',
      MediaInfo: vi.fn(),
      LoadRequest: vi.fn(),
      EditTracksInfoRequest: vi.fn(),
    },
  },
};
const getMediaSession = {
  activeTrackIds: [],
  editTracksInfo: vi.fn(),
};

const getCurrentSession = {
  getSessionState: vi.fn(),
  getMediaSession: vi.fn(() => getMediaSession),
  loadMedia: vi.fn(() => Promise.resolve()),
  getCastDevice: vi.fn(() => ({
    friendlyName: 'Test Device',
  })),
  endSession: vi.fn()
};

const castContextInstance = {
  setOptions: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  requestSession: vi.fn(),
  endCurrentSession: vi.fn(),
  getCurrentSession: vi.fn(() => getCurrentSession),
  getCastState: vi.fn(),
};

const remotePlayerController = {
  addEventListener: vi.fn(),
  muteOrUnmute: vi.fn(),
  playOrPause: vi.fn(),
  removeEventListener: vi.fn(),
  seek: vi.fn(),
  setVolumeLevel: vi.fn(),
  isMuted: false,
  volumeLevel: 1,
  isPaused: false,
  currentTime: 0,
  duration: 0
};

window.cast = {
  framework: {
    CastContext: {
      getInstance: vi.fn(() => castContextInstance),
    },
    CastContextEventType: {
      SESSION_STATE_CHANGED: 'session_state_changed',
    },
    RemotePlayer: vi.fn(),
    RemotePlayerController: vi.fn(() => remotePlayerController),
    RemotePlayerEventType: {
      ANY_CHANGE: 'any_change',
    },
    SessionState: {
      SESSION_STARTED: 'session_started',
      SESSION_RESUMED: 'session_resumed',
      SESSION_ENDED: 'session_ended',
    },
    CastState: {
      CONNECTED: 'connected',
    },
  },
};
