import { TemplateFunction, TemplateFunctionContext } from "./function"

export default function apply(
    path: string,
    text: string,
    params: Record<string, string>,
    vars: Record<string, TemplateFunction>
): string {
    const ctx: TemplateFunctionContext = {
        constants: params,
        path,
    }
    let out = text
    for (const key of Object.keys(params)) {
        const val = getParamValue(key, params, vars, ctx)
        if (typeof val !== "string") continue

        out = out.replace(new RegExp(`\\{\\{${key}}}`, "g"), val)
        out = out.replace(new RegExp(`/\*\\{\\{${key}}}\*/`, "g"), val)
    }
    return out
}

function getParamValue(
    key: string,
    params: Record<string, string>,
    vars: Record<string, TemplateFunction>,
    ctx: TemplateFunctionContext
) {
    const param = params[key]
    if (typeof param === "string") return param

    const func = vars[key]
    if (!func) return null

    return func(ctx)
}
