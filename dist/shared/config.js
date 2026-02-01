import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getOpenCodeConfigDir } from './opencode-config-dir';
const MORPH_PLUGIN_NAME = 'morph';
export function getMorphPluginConfigPath() {
  const configDir = getOpenCodeConfigDir({ binary: 'opencode' });
  return join(configDir, `${MORPH_PLUGIN_NAME}.json`);
}
function parseJsonc(content) {
  try {
    // A simple JSONC parser that removes comments
    const cleanedContent = content.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
    return JSON.parse(cleanedContent);
  } catch {
    return null;
  }
}
export function loadMorphPluginConfig() {
  const jsoncPath = getMorphPluginConfigPath().replace('.json', '.jsonc');
  const jsonPath = getMorphPluginConfigPath();
  if (existsSync(jsoncPath)) {
    try {
      const content = readFileSync(jsoncPath, 'utf-8');
      return parseJsonc(content);
    } catch {
      return null;
    }
  }
  if (existsSync(jsonPath)) {
    try {
      const content = readFileSync(jsonPath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return null;
    }
  }
  return null;
}
export function loadMorphPluginConfigWithProjectOverride(
  projectDir = process.cwd()
) {
  const userConfig = loadMorphPluginConfig() ?? {};
  const projectBasePath = join(projectDir, '.opencode', MORPH_PLUGIN_NAME);
  const projectJsoncPath = `${projectBasePath}.jsonc`;
  const projectJsonPath = `${projectBasePath}.json`;
  let projectConfig = {};
  if (existsSync(projectJsoncPath)) {
    try {
      const content = readFileSync(projectJsoncPath, 'utf-8');
      projectConfig = parseJsonc(content) ?? {};
    } catch {
      // Ignore parse errors
    }
  } else if (existsSync(projectJsonPath)) {
    try {
      const content = readFileSync(projectJsonPath, 'utf-8');
      projectConfig = JSON.parse(content);
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
export const MORPH_ROUTER_ENABLED =
  routerConfigs.MORPH_ROUTER_ENABLED ?? config.MORPH_ROUTER_ENABLED ?? true;
export const MORPH_ROUTER_PROMPT_CACHING_AWARE =
  routerConfigs.MORPH_ROUTER_PROMPT_CACHING_AWARE ??
  config.MORPH_ROUTER_PROMPT_CACHING_AWARE ??
  false;
