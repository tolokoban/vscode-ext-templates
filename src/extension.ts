// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode"
import { getProjectAndTemplatesRoot } from "./core/files"
import { fatal, success } from "./core/print"
import { selectTemplate } from "./core/select"
import Template from "./core/template"

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // This line of code will only be executed once when your extension is activated
    console.log(
        'Congratulations, your extension "tolokoban-templates" is now active!'
    )

    const disposableForApplyTemplate = vscode.commands.registerCommand(
        "tolokoban-templates.applyTemplate",
        async (folderName: vscode.Uri) => {
            const folders = getProjectAndTemplatesRoot(folderName.path)
            const { templatesRoot } = folders
            if (!templatesRoot) {
                fatal(
                    `There is no "@templates/" folder in the parent hierarchy of`,
                    folderName.path
                )
                return
            }
            const templates = Template.all(templatesRoot)
            if (templates.length === 0) {
                fatal(`No template defined in`, templatesRoot)
                return
            }
            const template = await selectTemplate(templates)
            console.log("🚀 [extension] template = ", template) // @FIXME: Remove this line written on 2023-02-06 at 10:58
            if (!template) {
                console.warn("Template application has been cancelled.")

                return
            }

            template.copyTo(folderName.path)
            success("Done!")
        }
    )

    context.subscriptions.push(disposableForApplyTemplate)

    const disposableForEditTemplates = vscode.commands.registerCommand(
        "tolokoban-templates.editTemplates",
        async () => {
            const workspaceFolders = vscode.workspace.workspaceFolders
            if (!workspaceFolders) {
                fatal("No workspace open yet!")
                return
            }

            for (const folder of workspaceFolders) {
                const { templatesRoot } = getProjectAndTemplatesRoot(
                    folder.uri.path
                )
                console.log("🚀 [extension] templatesRoot = ", templatesRoot) // @FIXME: Remove this line written on 2023-02-06 at 12:17
                if (templatesRoot) {
                    vscode.commands.executeCommand(
                        "vscode.openFolder",
                        vscode.Uri.file(templatesRoot)
                    )
                }
            }
        }
    )

    context.subscriptions.push(disposableForEditTemplates)
}

// This method is called when your extension is deactivated
export function deactivate() {}
