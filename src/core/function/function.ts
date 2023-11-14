import {
    makeFunctionCamel,
    makeFunctionKebab,
    makeFunctionPascal,
    makeFunctionSnake,
} from "./case"
import { TokenCrawler } from "./crawler"
import { parse } from "./lexer"
import { TemplateFunction, TemplateFunctionContext } from "./types"

export function parseTemplateFunction(code: string): TemplateFunction {
    const tokens = new TokenCrawler(parse(code))
    const func = scanFunction(tokens)
    if (!func) throw Error(`Unable to parse this code!`)

    return func
}

function scanFunction(tokens: TokenCrawler): TemplateFunction | null {
    tokens.begin()
    try {
        const token = tokens.next()
        if (!token) throw Error("No more tokens!")

        if (token.type === "VAR") {
            tokens.commit()
            return (context: TemplateFunctionContext) => {
                const value = context.constants[token.value]
                if (typeof value !== "string") {
                    throw Error(`Unknown param: "${token.value}"!`)
                }
                return value
            }
        }
        if (token.type !== "FUN") throw Error(`Function name expected!`)

        const funcName = token.value
        const funcArgs = scanArgs(tokens)
        if (!funcArgs) throw Error("Missing function args!")
        tokens.commit()
        return makeFunction(funcName, funcArgs)
    } catch (ex) {
        tokens.rollback()
        return null
    }
}

function scanArgs(tokens: TokenCrawler): TemplateFunction[] | null {
    tokens.begin()
    try {
        if (!tokens.next("PAR_OPEN")) throw Error("Expected open parenthesis!")

        const args: TemplateFunction[] = []
        while (true) {
            const arg = scanFunction(tokens)
            if (arg) {
                args.push(arg)
            } else {
                if (!tokens.next("PAR_CLOSE")) {
                    throw Error("Expected close parenthesis!")
                }
                return args
            }
        }
    } catch (ex) {
        tokens.rollback()
        return null
    }
}

function makeFunction(
    funcName: string,
    funcArgs: TemplateFunction[]
): TemplateFunction | null {
    switch (funcName) {
        case "camel":
            return makeFunctionCamel(funcArgs)
        case "pascal":
            return makeFunctionPascal(funcArgs)
        case "kebab":
            return makeFunctionKebab(funcArgs)
        case "snake":
            return makeFunctionSnake(funcArgs)
        default:
            throw Error(`Unknown function: "${funcName}"!`)
    }
}
