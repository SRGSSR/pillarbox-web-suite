import { describe, expect, it } from 'vitest';
import SrgSsrTheme from '../src/srg-ssr-theme.js';

describe('SrgSsrTheme', () => {
  it('should export the player options and the version', () => {
    expect(SrgSsrTheme.options).toBeDefined();
    expect(SrgSsrTheme.VERSION).toBeDefined();
  });
});
