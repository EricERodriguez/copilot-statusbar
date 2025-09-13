import * as vscode from "vscode";

export function activate(ctx: vscode.ExtensionContext) {
  vscode.window.showInformationMessage("Copilot Toggle: extensión activada");

  const item = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    10000
  );
  item.text = "$(octoface) Autocomplete: ON";
  item.tooltip = "Click para alternar";
  item.command = "copilot-toggle.toggle";
  item.show();
  ctx.subscriptions.push(item);

  const cmd = vscode.commands.registerCommand(
    "copilot-toggle.toggle",
    async () => {
      vscode.window.showInformationMessage(
        "Click en el botón de status bar recibido"
      );
    }
  );
  ctx.subscriptions.push(cmd);
}

export function deactivate() {}
