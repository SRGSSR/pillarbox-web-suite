import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import nodePlop from 'node-plop';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const create = async function(options) {
  const plop = await nodePlop('scripts/create.js');

  await plop.getGenerator('plugin').runActions({...options, name:'TestPlugin'});
};

describe('Plop generator', () => {
  const testDir = path.resolve(__dirname, '../../packages', 'test-plugin');

  beforeEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should generate a pillarbox plugin successfully', async() => {
    await create(  { platform: 'pillarbox', type: 'Plugin', wantLocalization: false, wantScss: true });
    const packageJsonPath = path.join(testDir, 'package.json');

    expect(fs.existsSync(packageJsonPath)).toBe(true);

    try {
      execSync('npm run build', { stdio: 'pipe', cwd: testDir });
      execSync('npm run test', { stdio: 'pipe', cwd: testDir });
    } catch (error) {
      let errorMessage = 'Command failed:';

      if (error.stdout) {
        errorMessage += `\nstdout:\n${error.stdout.toString()}`;
      }
      if (error.stderr) {
        errorMessage += `\nstderr:\n${error.stderr.toString()}`;
      }
      expect.fail(errorMessage);
    }
  });

  it('should generate a pillarbox component with localization successfully', async() => {
    await create(  { platform: 'pillarbox', type: 'Component', wantLocalization: true, wantScss: true});
    const packageJsonPath = path.join(testDir, 'package.json');

    expect(fs.existsSync(packageJsonPath)).toBe(true);

    try {
      execSync('npm run build', { stdio: 'pipe', cwd: testDir });
      execSync('npm run test', { stdio: 'pipe', cwd: testDir });
    } catch (error) {
      let errorMessage = 'Command failed:';

      if (error.stdout) {
        errorMessage += `\nstdout:\n${error.stdout.toString()}`;
      }
      if (error.stderr) {
        errorMessage += `\nstderr:\n${error.stderr.toString()}`;
      }
      expect.fail(errorMessage);
    }
  });

  it('should generate a video.js component without css successfully', async() => {
    await create(  { platform: 'videojs', type: 'Component', wantLocalization: true, wantScss: false });
    const packageJsonPath = path.join(testDir, 'package.json');

    expect(fs.existsSync(packageJsonPath)).toBe(true);

    try {
      execSync('npm run build', { stdio: 'pipe', cwd: testDir });
      execSync('npm run test', { stdio: 'pipe', cwd: testDir });
    } catch (error) {
      let errorMessage = 'Command failed:';

      if (error.stdout) {
        errorMessage += `\nstdout:\n${error.stdout.toString()}`;
      }
      if (error.stderr) {
        errorMessage += `\nstderr:\n${error.stderr.toString()}`;
      }
      expect.fail(errorMessage);
    }
  });
});
