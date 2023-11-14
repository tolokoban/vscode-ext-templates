import { EnumTemplateFunctionToken, TemplateFunctionToken } from "./types"

/* eslint-disable @typescript-eslint/naming-convention */
const RULES: { [name in EnumTemplateFunctionToken]: RegExp } = {
    SPC: makeRegExp("[ \t\r\n,]+"),
    VAR: makeRegExp("\\$[a-z]+[a-z0-9_]*"),
    FUN: makeRegExp("[a-z]+[a-z0-9_]*"),
    PAR_OPEN: makeRegExp("("),
    PAR_CLOSE: makeRegExp(")"),
}

function makeRegExp(pattern: string): RegExp {
    return new RegExp(`^${pattern}`, "ig")
}

export function parse(code: string): TemplateFunctionToken[] {
    const tokens: TemplateFunctionToken[] = []
    let cursor = 0
    while (cursor < code.length - 1) {
        const token = findToken(code, cursor)
        cursor += token.value.length
        code = code.substring(cursor)
        if (token.type === "SPC") continue

        tokens.push(token)
    }
    return tokens
}

function findToken(code: string, cursor: number): TemplateFunctionToken {
    for (const key of Object.keys(RULES)) {
        const type = key as EnumTemplateFunctionToken
        const rx = RULES[type]
        rx.lastIndex = cursor
        const match = rx.exec(code)
        if (match) {
            return {
                type,
                value: match[0],
            }
        }
    }
    throw Error(`Unknown token!`)
}
