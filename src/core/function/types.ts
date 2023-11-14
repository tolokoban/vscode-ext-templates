export interface TemplateFunctionContext {
    path: string
    constants: { [key: string]: string }
}

export type TemplateFunction = (context: TemplateFunctionContext) => string

export type EnumTemplateFunctionToken =
    | "SPC"
    | "VAR"
    | "FUN"
    | "PAR_OPEN"
    | "PAR_CLOSE"

export interface TemplateFunctionToken {
    type: EnumTemplateFunctionToken
    value: string
}
