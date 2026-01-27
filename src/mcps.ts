import type { McpLocalConfig } from "@opencode-ai/sdk";

export function createBuiltinMcps(): Record<string, McpLocalConfig> {
  return {
    morph_mcp: {
      type: "local",
      command: ["npx", "-y", "@morphllm/morphmcp"],
      environment: {
        MORPH_API_KEY: process.env.MORPH_API_KEY || "",
        ENABLED_TOOLS: "edit_file,warpgrep_codebase_search",
      },
      enabled: true,
    },
  };
}

export default createBuiltinMcps;
