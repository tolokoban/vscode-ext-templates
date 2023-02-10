import * as vscode from "vscode"
import { fatal } from "./print"
import Template from "./template"

export async function input(prompt: string): Promise<string | undefined> {
    const answer = await vscode.window.showInputBox({
        title: prompt,
    })
    return answer
}

export async function selectTemplate(
    templates: Template[]
): Promise<Template | undefined> {
    if (templates.length < 1) {
        fatal("No template found!")
        return
    }

    if (templates.length === 1) return templates[0]

    const templateNames: string[] = templates.map(tpl => tpl.name)
    const answer = await vscode.window.showQuickPick(templateNames, {
        canPickMany: false,
        title: "Please select a Template",
        matchOnDetail: true,
        matchOnDescription: true,
    })
    if (!answer) return

    const selectedTemplateName = answer
    return templates.find(tpl => tpl.name === selectedTemplateName)
}
