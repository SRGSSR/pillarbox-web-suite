import { afterEach, describe, expect, it } from 'vitest';
import pillarbox from '@srgssr/pillarbox-web';
import SrgSsrTheme from '../src/srg-ssr-theme.js';

window.HTMLMediaElement.prototype.load = () => {};

describe('SrgSsrTheme', () => {
  it('should export the player options and the version', () => {
    expect(SrgSsrTheme.options).toBeDefined();
    expect(SrgSsrTheme.VERSION).toBeDefined();
  });

  describe('players', () => {
    const players = [];

    const createPlayer = (id, options) => {
      const element = document.createElement('video');

      element.id = id;
      element.className = 'srg-ssr-theme';
      document.body.appendChild(element);
      players.push(pillarbox(id, options));

      return players.at(-1);
    };

    afterEach(() => {
      players.splice(0).forEach(player => player.dispose());
    });

    it('should not modify the theme options when creating a player', () => {
      const before = JSON.stringify(SrgSsrTheme.options.controlBar);

      createPlayer('player', SrgSsrTheme.options);

      expect(JSON.stringify(SrgSsrTheme.options.controlBar)).toBe(before);
    });
  });

  describe('googleCastSender', () => {
    const { receiverApplicationId, sourceResolver } = SrgSsrTheme.options.plugins.googleCastSender;

    it('should cast to a receiver able to play a URN', () => {
      expect(receiverApplicationId).toBe('1AC2931D');
    });

    it('should keep a source without media data as is', () => {
      const source = { src: 'https://example.com/video.m3u8', type: 'application/x-mpegURL' };

      expect(sourceResolver(source)).toBe(source);
    });

    it('should cast an SRG SSR media by its URN', () => {
      const source = {
        src: 'https://example.com/video.m3u8',
        type: 'application/x-mpegURL',
        mediaData: { urn: 'urn:rts:video:14827306' }
      };

      expect(sourceResolver(source)).toEqual({
        src: 'urn:rts:video:14827306',
        type: 'srgssr/urn'
      });
    });
  });
});
