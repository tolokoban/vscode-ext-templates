import * as vscode from "vscode"

export function fatal(...messages: string[]) {
    vscode.window.showErrorMessage(messages.join("\n"))
}

export function warn(...messages: string[]) {
    vscode.window.showWarningMessage(messages.join("\n"))
}

export function success(...messages: string[]) {
    vscode.window.showInformationMessage(messages.join("\n"))
}
