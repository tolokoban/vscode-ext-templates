import * as JSON5 from "json5"
import * as Path from "path"
import apply from "./apply"
import {
    filterExists,
    findAllDirsRecursively,
    findAllFilesRecursively,
    listDir,
    loadJsonFile,
    loadTextFile,
    makeDirsIfNeeded,
    saveTextFile,
} from "./files"
import { assertObject, assertString, assertStringArray } from "./guards"
import { askParamsValues } from "./params"
import { warn } from "./print"
import { openFileInEditor } from "./utils"

export interface TemplateParam {
    name: string
    label: string
}

export default class Template {
    public static all(templatesRoot: string): Template[] {
        const templates: Template[] = []
        const { dirs } = listDir(templatesRoot)
        for (const subPath of dirs) {
            const path = Path.resolve(templatesRoot, subPath)
            try {
                const definition = loadJsonFile(Path.resolve(path, "@.json5"))
                if (!definition) continue

                const { name, params, open } = definition
                assertString(name, "name")
                assertObject(params, "params")
                templates.push(
                    new Template(name, path, castOpenParam(open), params)
                )
            } catch (ex) {
                warn("Invalid template definition!")
                warn("   ", path)
                warn("   ", JSON5.stringify(ex))
            }
        }
        return templates
    }

    public readonly params: Record<string, TemplateParam> = {}

    private constructor(
        public readonly name: string,
        public readonly path: string,
        private readonly open: string[],
        params: Record<string, unknown>
    ) {
        for (const key of Object.keys(params)) {
            const val = params[key]
            if (typeof val === "string") {
                this.params[key] = {
                    name: key,
                    label: val,
                }
            }
        }
    }

    async copyTo(destination: string): Promise<boolean> {
        const srcDirs = findAllDirsRecursively(this.path)
        const srcFiles = findAllFilesRecursively(this.path)
        const params = await askParamsValues(this)
        if (!params) return false

        const dstDirs = srcDirs.map(relativePath =>
            Path.resolve(destination, apply(relativePath, params))
        )
        const dstFiles = srcFiles.map(relativePath =>
            Path.resolve(destination, apply(relativePath, params))
        )
        const alreadyExistingFiles = dstFiles.filter(filterExists)
        if (alreadyExistingFiles.length > 0) {
            warn("Destination file(s) already exist!")
            alreadyExistingFiles.forEach(path => warn("   ", path))
            return false
        }
        makeDirsIfNeeded(dstDirs)
        for (let fileIndex = 0; fileIndex < srcFiles.length; fileIndex++) {
            const src = Path.resolve(this.path, srcFiles[fileIndex] ?? "")
            const dst = dstFiles[fileIndex] as string
            const content = loadTextFile(src)
            if (!content) {
                warn("Unable to read this file: ", src)
                return false
            }
            saveTextFile(dst, apply(content, params))
        }
        srcFiles.forEach((src, idx) => {
            if (!this.open.includes(src)) return

            const dst = dstFiles[idx]
            openFileInEditor(dst)
        })
        return true
    }
}

function castOpenParam(open: unknown): string[] {
    if (!open) return []
    if (typeof open === "string") return [open]
    assertStringArray(open, ".open")
    return open
}
