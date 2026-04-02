// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode"
import { getProjectAndTemplatesRoot } from "./core/files"
import { LICENSES } from "./core/licenses"
import { fatal, success } from "./core/print"
import { selectTemplate } from "./core/select"
import Template from "./core/template"

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
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
            if (!template) return

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
                if (templatesRoot) {
                    vscode.commands.executeCommand(
                        "vscode.openFolder",
                        vscode.Uri.file(templatesRoot),
                        true
                    )
                }
            }
        }
    )

    context.subscriptions.push(disposableForEditTemplates)

    const disposableForLicense = vscode.commands.registerCommand(
        "tolokoban-templates.license",
        async () => {
            const keys = Object.keys(LICENSES).map(getLicenseTitle)
            const selection = await vscode.window.showQuickPick(keys, {
                placeHolder: "Choose a license for this project:",
            })
            if (!selection) return

            const [key] = selection.split(":")
            const workspaceFolders = vscode.workspace.workspaceFolders
            if (!workspaceFolders) {
                fatal("No workspace open yet!")
                return
            }

            const rootUri = workspaceFolders[0].uri
            const licenseUri = vscode.Uri.joinPath(rootUri, "LICENSE")
            const content = LICENSES[key as keyof typeof LICENSES]
            await vscode.workspace.fs.writeFile(
                licenseUri,
                Buffer.from(content)
            )
            vscode.env.openExternal(
                vscode.Uri.parse(
                    `https://choosealicense.com/licenses/${key}`
                )
            )
            success("Done!")
        }
    )

    context.subscriptions.push(disposableForLicense)
}

// This method is called when your extension is deactivated
export function deactivate() { }


function getLicenseTitle(key: string): string {
    const content = LICENSES[key]
    if (!content) return "N/A"

    const pos = content.indexOf("\n")
    const title = content.slice(0, pos).trim()
    return `${key}: ${title}`
}