# MorphLLM OpenCode Plugin

This is an OpenCode Plugin for [MorphLLM](https://morphllm.com/). So far this plugin just adds in `edit_file` and `warpgrep_codebase_search` from MorphLLM to your agent configs.

## Development
After pulling down the package, set the OpenCode config path to the local repo

`~/.config/opencode/opencode.json`

```json
"plugin": [
  "/path/to/morph-opencode-plugin/"
]
```

Now your changes will be reflected when you run OpenCode.
