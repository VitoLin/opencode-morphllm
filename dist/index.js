import { createBuiltinMcps } from './morph/mcps';
import { createModelRouterHook } from './morph/router';
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
