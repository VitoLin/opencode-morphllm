import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getOpenCodeConfigDir } from './opencode-config-dir';

const MORPH_PLUGIN_NAME = 'morph';

export function getMorphPluginConfigPath(): string {
  const configDir = getOpenCodeConfigDir({ binary: 'opencode' });
  return join(configDir, `${MORPH_PLUGIN_NAME}.json`);
}

interface MorphRouterConfigs {
  MORPH_ROUTER_ENABLED?: boolean;
  MORPH_ROUTER_PROMPT_CACHING_AWARE?: boolean;
  MORPH_MODEL_EASY?: string;
  MORPH_MODEL_MEDIUM?: string;
  MORPH_MODEL_HARD?: string;
  MORPH_MODEL_DEFAULT?: string;
}

interface MorphConfig {
  MORPH_API_KEY?: string;
  MORPH_SYSTEM_MESSAGE?: string;
  MORPH_ROUTER_CONFIGS?: MorphRouterConfigs;
  // Legacy fields for backward compatibility
  MORPH_ROUTER_ENABLED?: boolean;
  MORPH_ROUTER_PROMPT_CACHING_AWARE?: boolean;
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

const routerConfigs = config.MORPH_ROUTER_CONFIGS || {};

export const API_KEY = config.MORPH_API_KEY || '';
export const MORPH_MODEL_EASY =
  routerConfigs.MORPH_MODEL_EASY || config.MORPH_MODEL_EASY || '';
export const MORPH_MODEL_MEDIUM =
  routerConfigs.MORPH_MODEL_MEDIUM || config.MORPH_MODEL_MEDIUM || '';
export const MORPH_MODEL_HARD =
  routerConfigs.MORPH_MODEL_HARD || config.MORPH_MODEL_HARD || '';
export const MORPH_MODEL_DEFAULT =
  routerConfigs.MORPH_MODEL_DEFAULT ||
  config.MORPH_MODEL_DEFAULT ||
  MORPH_MODEL_MEDIUM;

/**
 * Computes whether the router should be enabled based on config and model availability.
 * Exported for testing purposes.
 */
export function computeRouterEnabled(
  routerConfigs: MorphRouterConfigs,
  config: MorphConfig
): boolean {
  const easy = routerConfigs.MORPH_MODEL_EASY || config.MORPH_MODEL_EASY || '';
  const medium =
    routerConfigs.MORPH_MODEL_MEDIUM || config.MORPH_MODEL_MEDIUM || '';
  const hard = routerConfigs.MORPH_MODEL_HARD || config.MORPH_MODEL_HARD || '';

  // Router should be disabled if all model values are empty strings
  const allModelsEmpty = !easy && !medium && !hard;

  return (
    !allModelsEmpty &&
    (routerConfigs.MORPH_ROUTER_ENABLED ?? config.MORPH_ROUTER_ENABLED ?? true)
  );
}

export const MORPH_ROUTER_ENABLED = computeRouterEnabled(routerConfigs, config);
export const MORPH_ROUTER_PROMPT_CACHING_AWARE =
  routerConfigs.MORPH_ROUTER_PROMPT_CACHING_AWARE ??
  config.MORPH_ROUTER_PROMPT_CACHING_AWARE ??
  false;

const DEFAULT_SYSTEM_MESSAGE =
  '\nYou **MUST** consider using morph_mcp. For editing files, consider using morph_mcp_edit_file. For searching the code base, consider using warpgrep_codebase_search';

export const MORPH_SYSTEM_MESSAGE =
  config.MORPH_SYSTEM_MESSAGE || DEFAULT_SYSTEM_MESSAGE;
