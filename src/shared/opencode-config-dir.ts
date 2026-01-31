import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';

interface OpenCodeConfigDirOptions {
  binary: 'opencode' | 'opencode-desktop';
  version?: string | null;
  checkExisting?: boolean;
}

function getTauriConfigDir(identifier: string): string {
  const platform = process.platform;

  switch (platform) {
    case 'darwin':
      return join(homedir(), 'Library', 'Application Support', identifier);

    case 'win32': {
      const appData =
        process.env.APPDATA || join(homedir(), 'AppData', 'Roaming');
      return join(appData, identifier);
    }

    case 'linux':
    default: {
      const xdgConfig =
        process.env.XDG_CONFIG_HOME || join(homedir(), '.config');
      return join(xdgConfig, identifier);
    }
  }
}

function getCliConfigDir(): string {
  const envConfigDir = process.env.OPENCODE_CONFIG_DIR?.trim();
  if (envConfigDir) {
    return resolve(envConfigDir);
  }

  if (process.platform === 'win32') {
    const crossPlatformDir = join(homedir(), '.config', 'opencode');
    const crossPlatformConfig = join(crossPlatformDir, 'opencode.json');

    if (existsSync(crossPlatformConfig)) {
      return crossPlatformDir;
    }

    const appData =
      process.env.APPDATA || join(homedir(), 'AppData', 'Roaming');
    const appdataDir = join(appData, 'opencode');
    const appdataConfig = join(appdataDir, 'opencode.json');

    if (existsSync(appdataConfig)) {
      return appdataDir;
    }

    return crossPlatformDir;
  }

  const xdgConfig = process.env.XDG_CONFIG_HOME || join(homedir(), '.config');
  return join(xdgConfig, 'opencode');
}

export function getOpenCodeConfigDir(
  options: OpenCodeConfigDirOptions
): string {
  if (options.binary === 'opencode-desktop') {
    const version = options.version;
    const isDev =
      !!version && (version.includes('-dev') || version.includes('.dev'));
    const identifier = isDev
      ? 'ai.opencode.desktop.dev'
      : 'ai.opencode.desktop';
    return getTauriConfigDir(identifier);
  }

  return getCliConfigDir();
}
