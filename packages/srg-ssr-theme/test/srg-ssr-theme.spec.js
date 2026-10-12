import { afterEach, describe, expect, it, vi } from 'vitest';
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

    describe('click', () => {
      const { click } = SrgSsrTheme.options.userActions;

      it('should toggle the user activity in the tiny layout', () => {
        const player = createPlayer('player', SrgSsrTheme.options);
        const play = vi.spyOn(player, 'play').mockImplementation(() => {});

        player.addClass('vjs-layout-tiny');
        player.userActive(true);
        click.call(player);

        expect(player.userActive()).toBe(false);

        click.call(player);

        expect(player.userActive()).toBe(true);
        expect(play).not.toHaveBeenCalled();
      });

      it('should toggle the controls with a class when paused in the tiny layout', () => {
        const player = createPlayer('player', SrgSsrTheme.options);

        vi.spyOn(player, 'paused').mockReturnValue(true);
        player.addClass('vjs-layout-tiny');
        player.hasStarted(true);
        player.userActive(true);
        click.call(player);

        expect(player.hasClass('srg-ssr-controls-hidden')).toBe(true);
        expect(player.userActive()).toBe(true);

        click.call(player);

        expect(player.hasClass('srg-ssr-controls-hidden')).toBe(false);
      });

      it('should not hide the controls with a class once playing or before starting', () => {
        const player = createPlayer('player', SrgSsrTheme.options);
        const paused = vi.spyOn(player, 'paused').mockReturnValue(true);

        player.addClass('vjs-layout-tiny');
        click.call(player);

        expect(player.hasClass('srg-ssr-controls-hidden')).toBe(false);

        player.hasStarted(true);
        click.call(player);
        paused.mockReturnValue(false);
        click.call(player);

        expect(player.hasClass('srg-ssr-controls-hidden')).toBe(false);
      });

      it('should toggle the playback outside the tiny layout', () => {
        const player = createPlayer('player', SrgSsrTheme.options);
        const play = vi.spyOn(player, 'play').mockImplementation(() => {});
        const pause = vi.spyOn(player, 'pause').mockImplementation(() => {});

        player.removeClass('vjs-layout-tiny');
        vi.spyOn(player, 'paused').mockReturnValueOnce(true).mockReturnValueOnce(false);
        click.call(player);

        expect(play).toHaveBeenCalledTimes(1);

        click.call(player);

        expect(pause).toHaveBeenCalledTimes(1);
      });

      it('should toggle the playback of an audio in the tiny layout', () => {
        const player = createPlayer('player', SrgSsrTheme.options);
        const play = vi.spyOn(player, 'play').mockImplementation(() => {});

        vi.spyOn(player, 'paused').mockReturnValue(true);
        vi.spyOn(player, 'audioPosterMode').mockReturnValue(true);
        player.addClass('vjs-layout-tiny');
        player.userActive(true);
        click.call(player);

        expect(play).toHaveBeenCalledTimes(1);
        expect(player.userActive()).toBe(true);
      });
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
