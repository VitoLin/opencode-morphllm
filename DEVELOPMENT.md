# Development

To work on the plugin locally:

1. Clone the repository
2. Point OpenCode to your local copy in `~/.config/opencode/opencode.json`:

```json
{
  "plugins": ["/path/to/morph-opencode-plugin/"]
}
```

3. Changes are immediately reflected when you run OpenCode

## Scripts

```bash
# Build
bun run build

# Test
bun test

# Format
bun run format
```

## Developer Notes

- The config logic now exposes a small helper function (computeRouterEnabled) that encapsulates the decision logic for whether the router is enabled. This is exported primarily to make the behavior easily testable and to avoid brittle module-cache workarounds in tests.
- If you change how config values are consumed, prefer adding unit tests that call computeRouterEnabled with a trimmed test fixture rather than trying to reload module-level constants.
