import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
  beforeAll,
  afterAll,
} from 'bun:test';
import {
  existsSync,
  writeFileSync,
  readFileSync,
  rmSync,
  mkdirSync,
} from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

// Mock the opencode-config-dir module before importing config
const mockConfigDir = join(tmpdir(), 'mock-opencode-config-test');
const mockMorphJson = join(mockConfigDir, 'morph.json');
const mockMorphJsonc = join(mockConfigDir, 'morph.jsonc');

vi.mock('./opencode-config-dir', () => ({
  getOpenCodeConfigDir: vi.fn(() => mockConfigDir),
}));

import {
  getMorphPluginConfigPath,
  loadMorphPluginConfig,
  loadMorphPluginConfigWithProjectOverride,
} from './config';

describe('config.ts', () => {
  beforeAll(() => {
    // Create mock config directory
    if (!existsSync(mockConfigDir)) {
      mkdirSync(mockConfigDir, { recursive: true });
    }
  });

  afterAll(() => {
    // Cleanup
    try {
      if (existsSync(mockMorphJson)) rmSync(mockMorphJson);
      if (existsSync(mockMorphJsonc)) rmSync(mockMorphJsonc);
      if (existsSync(mockConfigDir)) rmSync(mockConfigDir, { recursive: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  beforeEach(() => {
    // Clean up any existing config files before each test
    try {
      if (existsSync(mockMorphJson)) rmSync(mockMorphJson);
      if (existsSync(mockMorphJsonc)) rmSync(mockMorphJsonc);
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('getMorphPluginConfigPath', () => {
    it('should return path to morph.json in config directory', () => {
      const path = getMorphPluginConfigPath();
      expect(path).toContain('morph.json');
      expect(path).toContain(mockConfigDir);
    });
  });

  describe('loadMorphPluginConfig', () => {
    it('should return null when no config files exist', () => {
      const result = loadMorphPluginConfig();
      expect(result).toBeNull();
    });

    it('should load config from .jsonc file', () => {
      const content = `{
        "MORPH_API_KEY": "test-key-123",
        "MORPH_ROUTER_ENABLED": false
      }`;
      writeFileSync(mockMorphJsonc, content);

      const result = loadMorphPluginConfig();
      expect(result).not.toBeNull();
      expect(result?.MORPH_API_KEY).toBe('test-key-123');
      expect(result?.MORPH_ROUTER_ENABLED).toBe(false);
    });

    it('should load config from .json file', () => {
      const content = JSON.stringify({
        MORPH_API_KEY: 'json-key-456',
        MORPH_MODEL_EASY: 'provider/model-easy',
      });
      writeFileSync(mockMorphJson, content);

      const result = loadMorphPluginConfig();
      expect(result).not.toBeNull();
      expect(result?.MORPH_API_KEY).toBe('json-key-456');
      expect(result?.MORPH_MODEL_EASY).toBe('provider/model-easy');
    });

    it('should prefer .jsonc over .json when both exist', () => {
      const jsoncContent = '{"MORPH_API_KEY": "from-jsonc"}';
      const jsonContent = '{"MORPH_API_KEY": "from-json"}';

      writeFileSync(mockMorphJsonc, jsoncContent);
      writeFileSync(mockMorphJson, jsonContent);

      const result = loadMorphPluginConfig();
      expect(result?.MORPH_API_KEY).toBe('from-jsonc');
    });

    it('should return null for invalid .jsonc content', () => {
      writeFileSync(mockMorphJsonc, 'invalid json content');

      const result = loadMorphPluginConfig();
      expect(result).toBeNull();
    });

    it('should return null for invalid .json content', () => {
      writeFileSync(mockMorphJson, 'invalid json content');

      const result = loadMorphPluginConfig();
      expect(result).toBeNull();
    });

    it('should handle all MORPH config fields', () => {
      const content = JSON.stringify({
        MORPH_API_KEY: 'api-key',
        MORPH_ROUTER_ENABLED: true,
        MORPH_MODEL_EASY: 'easy/provider/model',
        MORPH_MODEL_MEDIUM: 'medium/provider/model',
        MORPH_MODEL_HARD: 'hard/provider/model',
        MORPH_MODEL_DEFAULT: 'default/provider/model',
      });
      writeFileSync(mockMorphJson, content);

      const result = loadMorphPluginConfig();
      expect(result).toEqual({
        MORPH_API_KEY: 'api-key',
        MORPH_ROUTER_ENABLED: true,
        MORPH_MODEL_EASY: 'easy/provider/model',
        MORPH_MODEL_MEDIUM: 'medium/provider/model',
        MORPH_MODEL_HARD: 'hard/provider/model',
        MORPH_MODEL_DEFAULT: 'default/provider/model',
      });
    });

    it('should handle nested MORPH_ROUTER_CONFIGS', () => {
      const content = JSON.stringify({
        MORPH_API_KEY: 'api-key',
        MORPH_ROUTER_CONFIGS: {
          MORPH_ROUTER_ENABLED: true,
          MORPH_MODEL_EASY: 'easy/provider/model',
          MORPH_MODEL_MEDIUM: 'medium/provider/model',
          MORPH_MODEL_HARD: 'hard/provider/model',
          MORPH_MODEL_DEFAULT: 'default/provider/model',
        },
      });
      writeFileSync(mockMorphJson, content);

      const result = loadMorphPluginConfig();
      expect(result?.MORPH_API_KEY).toBe('api-key');
      expect(result?.MORPH_ROUTER_CONFIGS).toEqual({
        MORPH_ROUTER_ENABLED: true,
        MORPH_MODEL_EASY: 'easy/provider/model',
        MORPH_MODEL_MEDIUM: 'medium/provider/model',
        MORPH_MODEL_HARD: 'hard/provider/model',
        MORPH_MODEL_DEFAULT: 'default/provider/model',
      });
    });
  });

  describe('loadMorphPluginConfigWithProjectOverride', () => {
    it('should return empty object when no config exists', () => {
      const result =
        loadMorphPluginConfigWithProjectOverride('/non-existent-path');
      expect(result).toEqual({});
    });

    it('should merge user config with project config', () => {
      // Create user config
      writeFileSync(
        mockMorphJson,
        JSON.stringify({
          MORPH_API_KEY: 'user-api-key',
          MORPH_MODEL_EASY: 'user-easy-model',
        })
      );

      // Create project config directory
      const projectDir = join(tmpdir(), 'test-project');
      const projectConfigDir = join(projectDir, '.opencode');
      const projectConfigPath = join(projectConfigDir, 'morph.json');

      mkdirSync(projectConfigDir, { recursive: true });
      writeFileSync(
        projectConfigPath,
        JSON.stringify({
          MORPH_API_KEY: 'project-api-key',
          MORPH_MODEL_HARD: 'project-hard-model',
        })
      );

      const result = loadMorphPluginConfigWithProjectOverride(projectDir);

      // Project config should override user config
      expect(result.MORPH_API_KEY).toBe('project-api-key');
      expect(result.MORPH_MODEL_EASY).toBe('user-easy-model');
      expect(result.MORPH_MODEL_HARD).toBe('project-hard-model');
    });

    it('should handle project .jsonc config', () => {
      // Create user config
      writeFileSync(
        mockMorphJson,
        JSON.stringify({
          MORPH_API_KEY: 'user-key',
        })
      );

      // Create project config with .jsonc
      const projectDir = join(tmpdir(), 'test-project2');
      const projectConfigDir = join(projectDir, '.opencode');
      const projectConfigPath = join(projectConfigDir, 'morph.jsonc');

      mkdirSync(projectConfigDir, { recursive: true });
      const jsoncContent = `
        // Project config with comments
        {
          "MORPH_MODEL_MEDIUM": "project-medium-model"
        }
      `;
      writeFileSync(projectConfigPath, jsoncContent);

      const result = loadMorphPluginConfigWithProjectOverride(projectDir);

      expect(result.MORPH_API_KEY).toBe('user-key');
      expect(result.MORPH_MODEL_MEDIUM).toBe('project-medium-model');
    });
  });
});
