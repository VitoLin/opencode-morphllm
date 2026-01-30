# MorphLLM OpenCode Plugin

This is an OpenCode Plugin for [MorphLLM](https://morphllm.com/). This plugin just adds in `edit_file` and `warpgrep_codebase_search` from MorphLLM to your agent configs as well as the intelligent model router for choosing different models based on the difficulty of the prompt.

## Installation

In `~/.config/opencode/opencode.json`, add the following config:

```
"plugin": [
  "opencode-morphllm"
]
```

You can also set the `opencode-morphllm` config variables by creating a .env file at `~/.config/opencode/.env`. You can find the provider and model ids from https://models.dev

Example configs:

```bash
export MORPH_API_KEY="your_morph_api_key_here"
export MORPH_MODEL_EASY = 'github-copilot/gpt-5-mini';
export MORPH_MODEL_MEDIUM = 'opencode/minimax-m2.1-free';
export MORPH_MODEL_HARD = 'gemini-3-flash-preview';
export MORPH_MODEL_DEFAULT = 'github-copilot/gpt-5-mini';
export MORPH_ROUTER_ENABLED = true;
```

## Development

After pulling down the package, set the OpenCode config path to the local repo

`~/.config/opencode/opencode.json`

```json
"plugin": [
  "/path/to/morph-opencode-plugin/"
]
```

Now your changes will be reflected when you run OpenCode.
