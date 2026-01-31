import { Plugin } from '@opencode-ai/plugin';
import type { McpLocalConfig } from '@opencode-ai/sdk';

import { createBuiltinMcps } from './morph/mcps';
import { createModelRouterHook } from './morph/router';
import { MORPH_ROUTER_ENABLED } from './shared/config';

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
