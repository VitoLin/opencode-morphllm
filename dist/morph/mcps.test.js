import { describe, it, expect, vi } from 'bun:test';
vi.mock('../shared/config', () => ({
  API_KEY: 'test-api-key-123',
}));
import { createBuiltinMcps } from './mcps';
describe('mcps.ts', () => {
  describe('createBuiltinMcps', () => {
    it('should create morph_mcp configuration', () => {
      const mcps = createBuiltinMcps();
      expect(mcps).toHaveProperty('morph_mcp');
      expect(mcps.morph_mcp.type).toBe('local');
      expect(mcps.morph_mcp.enabled).toBe(true);
    });
    it('should set correct command for morph_mcp', () => {
      const mcps = createBuiltinMcps();
      expect(mcps.morph_mcp.command).toEqual([
        'npx',
        '-y',
        '@morphllm/morphmcp',
      ]);
    });
    it('should set MORPH_API_KEY in environment', () => {
      const mcps = createBuiltinMcps();
      const env = mcps.morph_mcp.environment;
      expect(env).toBeDefined();
      expect(env?.MORPH_API_KEY).toBe('test-api-key-123');
    });
    it('should set ENABLED_TOOLS environment variable', () => {
      const mcps = createBuiltinMcps();
      const env = mcps.morph_mcp.environment;
      expect(env).toBeDefined();
      expect(env?.ENABLED_TOOLS).toBe('edit_file,warpgrep_codebase_search');
    });
    it('should only create morph_mcp key', () => {
      const mcps = createBuiltinMcps();
      expect(Object.keys(mcps)).toEqual(['morph_mcp']);
    });
  });
});
