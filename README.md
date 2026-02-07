# MorphLLM OpenCode Plugin

[![coverage](coverage/coverage.svg)](https://www.npmjs.com/package/opencode-morphllm)
[![npm](https://img.shields.io/npm/v/opencode-morphllm?style=flat-square)](https://www.npmjs.com/package/opencode-morphllm)
[![downloads](https://img.shields.io/npm/dt/opencode-morphllm?style=flat-square)](https://www.npmjs.com/package/opencode-morphllm)

An [OpenCode](https://opencode.ai/) plugin that integrates [MorphLLM](https://morphllm.com/)'s intelligent model routing and powerful MCP tools into your AI coding workflow.

- **GitHub**: https://github.com/VitoLin/opencode-morphllm
- **NPM**: https://www.npmjs.com/package/opencode-morphllm

## Features

### Intelligent Model Router

Automatically classifies your prompts by complexity (easy/medium/hard) and routes them to the most cost-effective and appropriate model. Save money on simple tasks while using powerful models only when needed.

### MCP Tools

Adds MorphLLM's specialized MCP tools to OpenCode:

- **`edit_file`** - Fast, precise file editing tool optimized for code modifications
- **`warpgrep_codebase_search`** - Advanced codebase search with contextual understanding

### Prompt Caching Optimization

Optional mode that maintains model consistency within a session, reducing costs through prompt caching.

## Installation

### 1. Install the Plugin

Add the plugin to your OpenCode configuration at `~/.config/opencode/opencode.json`:

```json
{
  "plugins": ["opencode-morphllm"]
}
```

### 2. Configure MorphLLM

Create a configuration file at `~/.config/opencode/morph.json` or for repo level configs, you can create the config at your repo root at `.opencode/morph.json`.

Example:

```json
{
  "MORPH_API_KEY": "your_morph_api_key_here",
  "MORPH_ROUTER_CONFIGS": {
    "MORPH_MODEL_EASY": "github-copilot/gpt-5-mini",
    "MORPH_MODEL_MEDIUM": "opencode/minimax-m2.1-free",
    "MORPH_MODEL_HARD": "github-copilot/gemini-2.5-pro",
    "MORPH_ROUTER_ENABLED": true,
    "MORPH_ROUTER_PROMPT_CACHING_AWARE": false
  }
}
```

Find available models at [models.dev](https://models.dev).

## Configuration Reference

### Core Settings

| Option          | Description           | Required |
| --------------- | --------------------- | -------- |
| `MORPH_API_KEY` | Your MorphLLM API key | Yes      |

### Router Settings (inside `MORPH_ROUTER_CONFIGS`)

| Option                              | Description                                               | Default                         |
| ----------------------------------- | --------------------------------------------------------- | ------------------------------- |
| `MORPH_ROUTER_ENABLED`              | Enable/disable the intelligent router                     | `true`                          |
| `MORPH_MODEL_EASY`                  | Model for easy prompts (simple questions, formatting)     | `your currently selected model` |
| `MORPH_MODEL_MEDIUM`                | Model for medium prompts (standard coding tasks)          | `your currently selected model` |
| `MORPH_MODEL_HARD`                  | Model for hard prompts (complex architecture, debugging)  | `your currently selected model` |
| `MORPH_MODEL_DEFAULT`               | Fallback model when classification fails                  | `MORPH_MODEL_MEDIUM`            |
| `MORPH_ROUTER_PROMPT_CACHING_AWARE` | Stick to first model per session for caching optimization | `false`                         |

> Note about router enablement
>
> - The router will be automatically disabled if none of the model slots (`MORPH_MODEL_EASY`, `MORPH_MODEL_MEDIUM`, `MORPH_MODEL_HARD`) are configured (i.e., all are empty strings). This prevents the router from being active when there are no target models configured. An explicit `MORPH_ROUTER_ENABLED: false` in your config will also disable the router even if models are present.

### System Message Customization

| Option                 | Description                                                | Default   |
| ---------------------- | ---------------------------------------------------------- | --------- |
| `MORPH_SYSTEM_MESSAGE` | Custom system message appended to OpenCode's system prompt | See below |

The `MORPH_SYSTEM_MESSAGE` setting allows you to customize or override the default system message that MorphLLM appends to OpenCode's system prompt. This message guides the AI on using Morph's MCP tools effectively.

**Default message:**

```
You **MUST** consider using morph_mcp. For editing files, consider using morph_mcp_edit_file. For searching the code base, consider using warpgrep_codebase_search
```

**When to customize:**

- You want to emphasize different tool preferences for your workflow
- You need to add project-specific conventions or guidelines
- You want to disable the default guidance entirely (set to empty string `""`)

**Example:**

```json
{
  "MORPH_API_KEY": "your_morph_api_key_here",
  "MORPH_SYSTEM_MESSAGE": "Your custom system message here"
}
```

### Model Format

Models are specified as `provider/model-id`. Examples:

- `github-copilot/gpt-5-mini`
- `github-copilot/gemini-2.5-pro`
- `opencode/minimax-m2.1-free`

### Legacy Format

For backward compatibility, you can also use flat configuration:

```json
{
  "MORPH_API_KEY": "your_key",
  "MORPH_MODEL_EASY": "github-copilot/gpt-5-mini",
  "MORPH_MODEL_MEDIUM": "opencode/minimax-m2.1-free",
  "MORPH_MODEL_HARD": "github-copilot/gemini-2.5-pro",
  "MORPH_ROUTER_ENABLED": true
}
```

### Project-Level Configuration

You can also configure per-project settings by creating `.opencode/morph.json` in your project root. Project settings override user settings.

```
my-project/
├── .opencode/
│   └── morph.json      # Project-specific Morph config
└── src/
```

Both `.json` and `.jsonc` (with comments) formats are supported.

## How It Works

### Intelligent Routing

When you send a prompt, the plugin:

1. **Classifies** the prompt complexity using MorphLLM's classification engine
2. **Selects** the appropriate model based on your configuration
3. **Routes** the request to the chosen model

Example routing:

- "Format this JSON" → Easy → `MORPH_MODEL_EASY` (cheaper, faster)
- "Add a React component" → Medium → `MORPH_MODEL_MEDIUM`
- "Debug this race condition" → Hard → `MORPH_MODEL_HARD` (powerful)

### Prompt Caching Mode

When `MORPH_ROUTER_PROMPT_CACHING_AWARE` is enabled:

- The first prompt in a session determines the model for all subsequent prompts
- Reduces costs through prompt caching with compatible providers
- Best for long conversations on similar topics

## Development

See [DEVELOPMENT.md](DEVELOPMENT.md) for setup instructions and development notes.

## Troubleshooting

### Plugin not loading

Ensure the plugin is properly listed in your OpenCode config:

```json
{
  "plugins": ["opencode-morphllm"]
}
```

### Router not working

Check that:

1. `MORPH_API_KEY` is set correctly
2. `MORPH_ROUTER_ENABLED` is not set to `false`
3. At least one model is configured

### Where to find models

Visit [models.dev](https://models.dev) to browse available models and their IDs.

## License

[MIT](LICENSE)
