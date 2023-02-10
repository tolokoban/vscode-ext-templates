export default function apply(
    text: string,
    params: Record<string, string>
): string {
    let out = text
    for (const key of Object.keys(params)) {
        const val = params[key]
        if (typeof val !== "string") continue

        out = out.replace(new RegExp(`\\{\\{${key}}}`, "g"), val)
        out = out.replace(new RegExp(`/\*\\{\\{${key}}}\*/`, "g"), val)
    }
    return out
}
