import { createBuiltinMcps } from './mcps';
import { createModelRouterHook } from './router';
import { MORPH_ROUTER_ENABLED } from './config';
const MorphOpenCodePlugin = async () => {
  const builtinMcps = createBuiltinMcps();
  const routerHook = MORPH_ROUTER_ENABLED ? createModelRouterHook() : {};
  return {
    config: async (currentConfig) => {
      currentConfig.mcp = {
        ...currentConfig.mcp,
        ...builtinMcps,
      };
    },
    ...routerHook,
  };
};
export default MorphOpenCodePlugin;
