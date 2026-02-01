# MorphLLM OpenCode Plugin

[![coverage](https://github.com/VitoLin/opencode-morphllm/blob/main/coverage/coverage.svg)](https://www.npmjs.com/package/opencode-morphllm)
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

Create a configuration file at `~/.config/opencode/morph.json`:

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

| Option                              | Description                                               | Default              |
| ----------------------------------- | --------------------------------------------------------- | -------------------- |
| `MORPH_ROUTER_ENABLED`              | Enable/disable the intelligent router                     | `true`               |
| `MORPH_MODEL_EASY`                  | Model for easy prompts (simple questions, formatting)     | -                    |
| `MORPH_MODEL_MEDIUM`                | Model for medium prompts (standard coding tasks)          | -                    |
| `MORPH_MODEL_HARD`                  | Model for hard prompts (complex architecture, debugging)  | -                    |
| `MORPH_MODEL_DEFAULT`               | Fallback model when classification fails                  | `MORPH_MODEL_MEDIUM` |
| `MORPH_ROUTER_PROMPT_CACHING_AWARE` | Stick to first model per session for caching optimization | `false`              |

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

To work on the plugin locally:

1. Clone the repository
2. Point OpenCode to your local copy in `~/.config/opencode/opencode.json`:

```json
{
  "plugins": ["/path/to/morph-opencode-plugin/"]
}
```

3. Changes are immediately reflected when you run OpenCode

### Scripts

```bash
# Build
bun run build

# Test
bun test

# Format
bun run format
```

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
