import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getOpenCodeConfigDir } from './opencode-config-dir';

const MORPH_PLUGIN_NAME = 'morph';

export function getMorphPluginConfigPath(): string {
  const configDir = getOpenCodeConfigDir({ binary: 'opencode' });
  return join(configDir, `${MORPH_PLUGIN_NAME}.json`);
}

interface MorphConfig {
  MORPH_API_KEY?: string;
  MORPH_ROUTER_ENABLED?: boolean;
  MORPH_ROUTER_ONLY_FIRST_MESSAGE?: boolean;
  MORPH_MODEL_EASY?: string;
  MORPH_MODEL_MEDIUM?: string;
  MORPH_MODEL_HARD?: string;
  MORPH_MODEL_DEFAULT?: string;
}

function parseJsonc<T>(content: string): T | null {
  try {
    // A simple JSONC parser that removes comments
    const cleanedContent = content.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
    return JSON.parse(cleanedContent) as T;
  } catch {
    return null;
  }
}

export function loadMorphPluginConfig(): MorphConfig | null {
  const jsoncPath = getMorphPluginConfigPath().replace('.json', '.jsonc');
  const jsonPath = getMorphPluginConfigPath();

  if (existsSync(jsoncPath)) {
    try {
      const content = readFileSync(jsoncPath, 'utf-8');
      return parseJsonc<MorphConfig>(content);
    } catch {
      return null;
    }
  }

  if (existsSync(jsonPath)) {
    try {
      const content = readFileSync(jsonPath, 'utf-8');
      return JSON.parse(content) as MorphConfig;
    } catch {
      return null;
    }
  }

  return null;
}

export function loadMorphPluginConfigWithProjectOverride(
  projectDir: string = process.cwd()
): MorphConfig {
  const userConfig = loadMorphPluginConfig() ?? {};

  const projectBasePath = join(projectDir, '.opencode', MORPH_PLUGIN_NAME);
  const projectJsoncPath = `${projectBasePath}.jsonc`;
  const projectJsonPath = `${projectBasePath}.json`;

  let projectConfig: MorphConfig = {};

  if (existsSync(projectJsoncPath)) {
    try {
      const content = readFileSync(projectJsoncPath, 'utf-8');
      projectConfig = parseJsonc<MorphConfig>(content) ?? {};
    } catch {
      // Ignore parse errors
    }
  } else if (existsSync(projectJsonPath)) {
    try {
      const content = readFileSync(projectJsonPath, 'utf-8');
      projectConfig = JSON.parse(content) as MorphConfig;
    } catch {
      // Ignore parse errors
    }
  }

  return { ...userConfig, ...projectConfig };
}

const config = loadMorphPluginConfigWithProjectOverride();

export const API_KEY = config.MORPH_API_KEY || '';
export const MORPH_MODEL_EASY = config.MORPH_MODEL_EASY || '';
export const MORPH_MODEL_MEDIUM = config.MORPH_MODEL_MEDIUM || '';
export const MORPH_MODEL_HARD = config.MORPH_MODEL_HARD || '';
export const MORPH_MODEL_DEFAULT =
  config.MORPH_MODEL_DEFAULT || MORPH_MODEL_MEDIUM;
export const MORPH_ROUTER_ENABLED = config.MORPH_ROUTER_ENABLED ?? true;
export const MORPH_ROUTER_ONLY_FIRST_MESSAGE =
  config.MORPH_ROUTER_ONLY_FIRST_MESSAGE ?? false;
