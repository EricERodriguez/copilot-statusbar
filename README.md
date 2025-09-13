# Copilot Statusbar Toggle

One-click toggle for **GitHub Copilot completions** from the VS Code status bar.

> Quick, lightweight, and workspace-aware.  
> _ES:_ Botón en la barra de estado para activar/desactivar el autocomplete de Copilot.

---

## Features

- Adds a status bar button: `Autocomplete: ON / OFF`.
- Toggles Copilot completions using Copilot’s own commands when available.
- Falls back to settings if commands are missing.
- Respects the current scope (Workspace / Global) when changing settings.

## Requirements

- [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) extension installed and signed in.

## Usage

1. Install this extension.
2. Look at the right side of the status bar: `Autocomplete: ON / OFF`.
3. Click to toggle.

### Command

- `Copilot: Toggle Completions` — `copilot-toggle.toggle`

## Settings

This extension does **not** add new settings.  
It reads/updates Copilot settings used by the official extension:

- `github.copilot.editor.enableAutoCompletions` (newer versions)
- `github.copilot.enable` (legacy, supports per-language)

## Known limitations

- If you configured Copilot per-language, the status might differ from your global setting.
- Some Copilot builds expose `enable/disable` commands; others only expose a toggle. This extension handles both.

## Troubleshooting

- Ensure **GitHub Copilot** is installed and enabled.
- Run “Developer: Reload Window” after installing.
- Check **Output → Log (Extension Host)** for errors.

## Release Notes

### 0.0.1

- Initial release: status bar toggle + command.

## License

MIT
