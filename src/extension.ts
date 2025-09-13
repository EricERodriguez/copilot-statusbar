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
    let enabled = true;

    // 'github.copilot.enable' puede ser boolean u objeto por lenguaje
    if (typeof enableSetting === "boolean") {
      enabled = enableSetting;
    } else if (enableSetting && typeof enableSetting === "object") {
      // Heurística simple: si "*" está true, consideramos ON
      enabled = enableSetting["*"] !== false;
    }

    item.text = enabled
      ? "$(octoface) Copilot: ON"
      : "$(octoface) Copilot: OFF";
    item.tooltip = "Click para alternar Copilot completions";
    item.show();
  };

  const toggle = async () => {
    // 1) Preferimos el comando oficial de Copilot (si existe):
    //    github.copilot.completions.toggle  (antes: github.copilot.toggleCopilot)
    try {
      const all = await vscode.commands.getCommands(true);
      const cmd = all.includes("github.copilot.completions.toggle")
        ? "github.copilot.completions.toggle"
        : all.includes("github.copilot.toggleCopilot")
        ? "github.copilot.toggleCopilot"
        : null;

      if (cmd) {
        await vscode.commands.executeCommand(cmd);
        // Le damos un respiro y refrescamos la etiqueta
        setTimeout(updateLabel, 150);
        return;
      }
    } catch {
      // seguimos al plan B
    }

    // 2) Plan B: alternar el setting 'github.copilot.enable'
    const cfg = vscode.workspace.getConfiguration("github.copilot");
    const current = cfg.get<any>("enable");
    let next: any;

    if (typeof current === "boolean") {
      next = !current;
    } else if (current && typeof current === "object") {
      next = { ...current, "*": !(current["*"] === true) };
    } else {
      next = false; // si no hay nada, lo dejamos en OFF
    }

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
      if (e.affectsConfiguration("github.copilot.enable")) updateLabel();
    })
  );
}

export function deactivate() {}
