import fs from 'fs';
import path from 'path';
const configPath = path.join(
  process.env.HOME || process.env.USERPROFILE || '',
  '.config/opencode/morph.json'
);
let config = {};
try {
  if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }
} catch (e) {
  console.warn('[Morph Plugin] Failed to load config file:', configPath);
}
export const API_KEY = config.MORPH_API_KEY || '';
export const MORPH_MODEL_EASY = config.MORPH_MODEL_EASY || '';
export const MORPH_MODEL_MEDIUM = config.MORPH_MODEL_MEDIUM || '';
export const MORPH_MODEL_HARD = config.MORPH_MODEL_HARD || '';
export const MORPH_MODEL_DEFAULT = config.MORPH_MODEL_DEFAULT || '';
export const MORPH_ROUTER_ENABLED = config.MORPH_ROUTER_ENABLED ?? true;
