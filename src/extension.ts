import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const item = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  item.command = "copilot-toggle.toggle";
  context.subscriptions.push(item);

  const updateLabel = async () => {
    // Intentamos leer el estado desde la configuración de Copilot
    const cfg = vscode.workspace.getConfiguration("github.copilot");
    const enableSetting = cfg.get<any>("enable");
    let enabled = false;

    // 'github.copilot.enable' puede ser boolean, objeto o undefined
    if (typeof enableSetting === "boolean") {
      enabled = enableSetting;
    } else if (enableSetting && typeof enableSetting === "object") {
      // Si existe la clave '*', la usamos. Si no, consideramos OFF.
      if (Object.prototype.hasOwnProperty.call(enableSetting, "*")) {
        enabled = enableSetting["*"] === true;
      } else {
        enabled = false;
      }
    } else {
      enabled = false;
    }

    item.text = enabled
      ? "$(octoface) Autocomplete: ON"
      : "$(octoface) Autocomplete: OFF";
    item.tooltip = "Click to toggle autocomplete.";
    item.show();
  };

  const toggle = async () => {
    // Alternar '*' 'plaintext' y 'markdown' juntos
    const cfg = vscode.workspace.getConfiguration("github.copilot");
    const current = cfg.get<any>("enable");
    // Siempre forzamos el objeto con los tres valores
    let enabled = false;
    if (typeof current === "boolean") {
      enabled = current;
    } else if (isCopilotEnableObject(current)) {
      enabled = current["*"] === true;
    }

    const next = {
      "*": !enabled,
      plaintext: !enabled,
      markdown: !enabled,
    };

    await cfg.update("enable", next, vscode.ConfigurationTarget.Global);
    await updateLabel();
  };

  context.subscriptions.push(
    vscode.commands.registerCommand("copilot-toggle.toggle", toggle)
  );

  // Actualizamos etiqueta al inicio y cuando cambien settings
  updateLabel();
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("github.copilot.enable")) {
        updateLabel();
      }
    })
  );
}

function isCopilotEnableObject(current: any): current is Record<string, any> {
  return (
    current !== null && typeof current === "object" && !Array.isArray(current)
  );
}

export function deactivate() {}
