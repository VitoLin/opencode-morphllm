import { createBuiltinMcps } from './morph/mcps';
import { createModelRouterHook } from './morph/router';
import { MORPH_ROUTER_ENABLED } from './shared/config';
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
