import { input } from "./select"
import Template from "./template"

export async function askParamsValues(
    template: Template
): Promise<Record<string, string> | undefined> {
    const { params } = template
    const values: Record<string, string> = {}
    for (const name of Object.keys(params)) {
        const param = params[name]
        if (!param) continue

        const value = await input(param?.label)
        if (!value) return

        values[name] = value
    }
    return values
}
