import {
    makeFunctionCamel,
    makeFunctionKebab,
    makeFunctionPascal,
    makeFunctionSnake,
} from "./case"
import { TokenCrawler } from "./crawler"
import { parse } from "./lexer"
import { TemplateFunction, TemplateFunctionContext } from "./types"

type Fatal = (message: string) => never

export function parseTemplateFunction(code: string): TemplateFunction {
    let err: Error | null = null
    const tokens = new TokenCrawler(parse(code))
    const func = scanFunction(tokens, (message: string) => {
        err = new Error(message)
        throw err
    })
    if (!func)
        throw Error(
            `Unable to parse this code: "${code}"!\n${
                err ? (err as Error).message : ""
            }`
        )

    return func
}

function scanFunction(
    tokens: TokenCrawler,
    fatal: Fatal
): TemplateFunction | null {
    tokens.begin()
    try {
        const token = tokens.next()
        if (!token) fatal("No more tokens!")

        if (token.type === "VAR") {
            tokens.commit()
            return (context: TemplateFunctionContext) => {
                const value = context.constants[token.value.substring(1)]
                if (typeof value !== "string") {
                    fatal(`Unknown param: "${token.value}"!`)
                }
                return value
            }
        }
        if (token.type !== "FUN") fatal(`Function name expected!`)

        const funcName = token.value
        const funcArgs = scanArgs(tokens, fatal)
        if (!funcArgs) throw Error("Missing function args!")
        tokens.commit()
        return makeFunction(funcName, funcArgs)
    } catch (ex) {
        tokens.rollback()
        return null
    }
}

function scanArgs(
    tokens: TokenCrawler,
    fatal: Fatal
): TemplateFunction[] | null {
    tokens.begin()
    try {
        if (!tokens.next("PAR_OPEN")) fatal("Expected open parenthesis!")

        const args: TemplateFunction[] = []
        while (true) {
            const arg = scanFunction(tokens, fatal)
            if (arg) {
                args.push(arg)
            } else {
                if (!tokens.next("PAR_CLOSE")) {
                    fatal("Expected close parenthesis!")
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
