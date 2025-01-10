import { TokenCrawler } from "./crawler"
import { TemplateFunction, TemplateFunctionContext } from "./types"
import { cap, splitCase } from "./utils"

export const makeFunctionCamel = makeCase("", (s, i) =>
    i === 0 ? s.toLowerCase() : cap(s.toLowerCase())
)

export const makeFunctionPascal = makeCase("", s => cap(s.toLowerCase()))

export const makeFunctionKebab = makeCase("-", s => s.toLowerCase())

export const makeFunctionSnake = makeCase("-", s => s.toLowerCase())

function makeCase(sep: string, map: (text: string, index: number) => string) {
    return (args: TemplateFunction[]): TemplateFunction => {
        return (context: TemplateFunctionContext) => {
            const input = args.map(arg => arg(context)).join("")
            const parts = splitCase(input)
            return parts.map(map).join(sep)
        }
    }
}
