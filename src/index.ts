import { Plugin } from '@opencode-ai/plugin';
import type { McpLocalConfig } from '@opencode-ai/sdk';

import { createBuiltinMcps } from './morph/mcps';
import { createModelRouterHook } from './morph/router';

const MorphOpenCodePlugin: Plugin = async () => {
  const builtinMcps: Record<string, McpLocalConfig> = createBuiltinMcps();
  const routerHook = createModelRouterHook();

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
