import { createBuiltinMcps } from './mcps';
import { createModelRouterHook } from './router';
const MorphOpenCodePlugin = async () => {
  const builtinMcps = createBuiltinMcps();
  const routerHook = createModelRouterHook();
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
