# MorphLLM OpenCode Plugin

This is an OpenCode Plugin for [MorphLLM](https://morphllm.com/). So far this plugin just adds in `edit_file` and `warpgrep_codebase_search` from MorphLLM to your agent configs.

## Installation
In `~/.config/opencode/opencode.json`, add the following config:

```
"plugin": [
  "morphllm-opencode"
]
```

Then in your shell configs (ex: `~/.bashrc`, `~/.zshrc`, etc), add the following environment variable:

```bash
export MORPH_API_KEY="your_morph_api_key_here"
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
