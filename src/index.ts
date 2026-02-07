import { Plugin } from '@opencode-ai/plugin';
import type { McpLocalConfig } from '@opencode-ai/sdk';

import { createBuiltinMcps } from './morph/mcps';
import { createModelRouterHook } from './morph/router';
import { createSystemTransformHook } from './morph/system-transform';

const MorphOpenCodePlugin: Plugin = async () => {
  const builtinMcps: Record<string, McpLocalConfig> = createBuiltinMcps();
  const systemTransformHook = createSystemTransformHook();
  const routerHook = createModelRouterHook();

  return {
    config: async (currentConfig: any) => {
      currentConfig.mcp = {
        ...currentConfig.mcp,
        ...builtinMcps,
      };
    },
    ...systemTransformHook,
    ...routerHook,
  };
};

export default MorphOpenCodePlugin;
