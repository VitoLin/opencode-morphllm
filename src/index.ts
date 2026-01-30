import { Plugin } from '@opencode-ai/plugin';
import type { McpLocalConfig } from '@opencode-ai/sdk';

import { createBuiltinMcps } from './mcps';
import { createModelRouterHook } from './router';
import { MORPH_ROUTER_ENABLED } from './const';

const MorphOpenCodePlugin: Plugin = async () => {
  const builtinMcps: Record<string, McpLocalConfig> = createBuiltinMcps();
  const routerHook = MORPH_ROUTER_ENABLED ? createModelRouterHook() : {};

  return {
    config: async (currentConfig: any) => {
      currentConfig.mcp = {
        ...currentConfig.mcp,
        ...builtinMcps,
      };
    },
    ...routerHook,
  };
};

export default MorphOpenCodePlugin;
