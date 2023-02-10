export function assertString(
    data: unknown,
    name: string
): asserts data is string {
    if (typeof data !== "string") {
        throw Error(`${name} was expected to be a string!`)
    }
}

export function assertObject(
    data: unknown,
    name: string
): asserts data is Record<string, unknown> {
    if (!data || Array.isArray(data) || typeof data !== "object") {
        throw Error(`${name} was expected to be a object!`)
    }
}

export function assertStringArray(
    data: unknown,
    name: string
): asserts data is string[] {
    if (!Array.isArray(data))
        throw Error(`${name} was expected to be an array!`)
    for (let i = 0; i < data.length; i++) {
        if (typeof data !== "string") {
            throw Error(`${name}[${i}] was expected to be a string!`)
        }
    }
}
