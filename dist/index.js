import { createBuiltinMcps } from './morph/mcps';
import { createModelRouterHook } from './morph/router';
import { createSystemTransformHook } from './morph/system-transform';
const MorphOpenCodePlugin = async () => {
    const builtinMcps = createBuiltinMcps();
    const systemTransformHook = createSystemTransformHook();
    const routerHook = createModelRouterHook();
    return {
        config: async (currentConfig) => {
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
