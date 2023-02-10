import * as vscode from "vscode"
import * as FS from "fs"

export async function openTextDocument(
    filename: string
): Promise<vscode.TextDocument | null> {
    return new Promise((resolve, reject) => {
        if (!exists(filename)) {
            resolve(null)
            return
        }
        vscode.workspace.openTextDocument(filename).then(resolve, reject)
    })
}

export async function openFileInEditor(
    filename: string,
    viewColumn: vscode.ViewColumn = vscode.ViewColumn.Active
): Promise<boolean> {
    const doc = await openTextDocument(filename)
    if (!doc) return false
    vscode.window.showTextDocument(doc, viewColumn.valueOf())
    return true
}

function exists(path: string): boolean {
    return FS.existsSync(path)
}
