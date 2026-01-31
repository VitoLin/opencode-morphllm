import { API_KEY } from '../shared/config';
export function createBuiltinMcps() {
  return {
    morph_mcp: {
      type: 'local',
      command: ['npx', '-y', '@morphllm/morphmcp'],
      environment: {
        MORPH_API_KEY: API_KEY,
        ENABLED_TOOLS: 'edit_file,warpgrep_codebase_search',
      },
      enabled: true,
    },
  };
}
export default createBuiltinMcps;
