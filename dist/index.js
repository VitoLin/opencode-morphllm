import { createBuiltinMcps } from "./mcps";
const MorphOpenCodePlugin = async (ctx) => {
    const builtinMcps = createBuiltinMcps();
    return {
        config: async (currentConfig) => {
            currentConfig.mcp = {
                ...currentConfig.mcp,
                ...builtinMcps,
            };
        },
    };
};
export default MorphOpenCodePlugin;
