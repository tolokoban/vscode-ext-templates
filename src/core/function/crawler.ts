import { EnumTemplateFunctionToken, TemplateFunctionToken } from "./types"

export class TokenCrawler {
    private index = 0

    private transactions: number[] = []

    constructor(private readonly tokens: TemplateFunctionToken[]) {}

    next(type?: EnumTemplateFunctionToken): TemplateFunctionToken | undefined {
        const token = this.tokens[this.index++]
        if (type && token?.type !== type) {
            throw Error(`Expected "${type}" but got "${token?.type}"!`)
        }
        return token
    }

    begin() {
        this.transactions.push(this.index)
    }

    rollback() {
        const index = this.transactions.pop()
        if (typeof index === "number") this.index = index
    }

    commit() {
        this.transactions.pop()
    }
}
