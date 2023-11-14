export function cap(text: string) {
    return `${text.charAt(0).toUpperCase()}${text.substring(1)}`
}

export function uncap(text: string) {
    return `${text.charAt(0).toLowerCase()}${text.substring(1)}`
}

const RX_SEP = /[ \t_/\.-]+/

export function splitCase(input: string) {
    const result: string[] = []
    input.split(RX_SEP).forEach(part => result.push(...splitUpperCase(part)))
    return result
}

function splitUpperCase(code: string): string[] {
    const result: string[] = []
    let a = 0
    for (let b = 1; b < code.length; b++) {
        const c = code.charAt(b)
        if (c === c.toUpperCase()) {
            const part = code.substring(a, b)
            if (part.length > 0) result.push(part)
            a = b
        }
    }
    const part = code.substring(a)
    if (part.length > 0) result.push(part)
    return result
}
