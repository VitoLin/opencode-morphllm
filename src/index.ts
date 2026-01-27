import { Plugin } from "@opencode-ai/plugin";
import type { McpLocalConfig } from "@opencode-ai/sdk";

import { createBuiltinMcps } from "./mcps";

const MorphOpenCodePlugin: Plugin = async (ctx) => {
  const builtinMcps: Record<string, McpLocalConfig> = createBuiltinMcps();

  return {
    config: async (currentConfig: any) => {
      currentConfig.mcp = {
        ...currentConfig.mcp,
        ...builtinMcps,
      };
    },
  };
};

export default MorphOpenCodePlugin;
