# MorphLLM OpenCode Plugin

This is an OpenCode Plugin for [MorphLLM](https://morphllm.com/). This plugin just adds in `edit_file` and `warpgrep_codebase_search` from MorphLLM to your agent configs as well as the intelligent model router for choosing different models based on the difficulty of the prompt.

Github: https://github.com/VitoLin/opencode-morphllm

NPM: https://www.npmjs.com/package/opencode-morphllm

## Installation

In `~/.config/opencode/opencode.json`, add the following config:

```
"plugin": [
  "opencode-morphllm"
]
```

You can also set the `opencode-morphllm` config variables by creating a `json` file at `~/.config/opencode/morph.json`. You can find the provider and model ids from https://models.dev

Example configs:

```json
{
  "MORPH_API_KEY": "YOUR_API_KEY_HERE",
  "MORPH_ROUTER_CONFIGS": {
    "MORPH_MODEL_EASY": "github-copilot/gpt-5-mini",
    "MORPH_MODEL_MEDIUM": "opencode/minimax-m2.1-free",
    "MORPH_MODEL_HARD": "github-copilot/gemini-2.5-pro",
    "MORPH_ROUTER_ENABLED": true
  }
}
```

Legacy format (still supported):

```json
{
  "MORPH_API_KEY": "YOUR_API_KEY_HERE",
  "MORPH_MODEL_EASY": "github-copilot/gpt-5-mini",
  "MORPH_MODEL_MEDIUM": "opencode/minimax-m2.1-free",
  "MORPH_MODEL_HARD": "github-copilot/gemini-2.5-pro",
  "MORPH_ROUTER_ENABLED": true
}
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
