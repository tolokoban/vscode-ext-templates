import * as FS from "fs"
import * as Path from "path"
import { warn } from "./print"
import JSON5 from "json5"

export function makeDirsIfNeeded(paths: string[]) {
    for (const path of paths) {
        if (FS.existsSync(path)) continue

        FS.mkdirSync(path, { recursive: true })
    }
}

export function getProjectAndTemplatesRoot(root: string) {
    const projectRoot = getProjectRoot(root)
    const templatesRoot = getTemplatesRoot(projectRoot)
    return { projectRoot, templatesRoot }
}

export function findAllDirsRecursively(path: string): string[] {
    const dirs: string[] = []
    const fringe = listDir(path).dirs
    while (fringe.length > 0) {
        const item = fringe.shift()
        if (!item) continue

        dirs.push(item)
        fringe.push(
            ...listDir(Path.resolve(path, item)).dirs.map(dir =>
                Path.resolve(item, dir)
            )
        )
    }
    return dirs
}

export function findAllFilesRecursively(path: string): string[] {
    const files: string[] = []
    const fringe = [path]
    while (fringe.length > 0) {
        const dir = fringe.shift()
        if (typeof dir !== "string") continue

        const content = listDir(Path.resolve(path, dir))
        files.push(
            ...content.files
                .filter(name => name !== "@.json5")
                .map(name => Path.resolve(dir, name))
        )
        fringe.push(...content.dirs.map(name => Path.resolve(dir, name)))
    }
    return files.map(name => Path.relative(path, name))
}

export function listDir(path: string): { files: string[]; dirs: string[] } {
    const filesAndFolders = FS.readdirSync(path, {
        withFileTypes: true,
    })
    const files: string[] = []
    const dirs: string[] = []
    for (const fileOrFolder of filesAndFolders) {
        if (fileOrFolder.isDirectory()) {
            dirs.push(fileOrFolder.name)
        } else {
            files.push(fileOrFolder.name)
        }
    }
    return { files, dirs }
}

export function loadTextFile(path: string): string | null {
    if (!FS.existsSync(path)) return null

    const data = FS.readFileSync(path)
    return data.toString()
}

export function saveTextFile(path: string, content: string) {
    FS.writeFileSync(path, content)
}

export function loadJsonFile(path: string): Record<string, unknown> | null {
    const content = loadTextFile(path)
    if (!content) return null

    try {
        return JSON5.parse(content)
    } catch (ex) {
        console.error("InvalidaJSON5 file:", path, ex)
        warn("Warning! The following file has an invalid JSON5 format!", path)
        return null
    }
}

export function atLeastOneExists(paths: string[]): boolean {
    for (const path of paths) {
        if (FS.existsSync(path)) return true
    }
    return false
}

export function filterExists(path: string) {
    return FS.existsSync(path)
}

// function getCurrentDir(): string {
//     return process.cwd()
// }

function getProjectRoot(root: string): string | null {
    let path: string = root
    while (path && !isProjectDir(path)) {
        const parent = Path.dirname(path)
        if (path === parent) return null
        path = parent
    }
    return Path.resolve(path, "src")
}

function isProjectDir(path: string): boolean {
    if (!FS.existsSync(Path.resolve(path, "package.json"))) return false
    if (!FS.existsSync(Path.resolve(path, "src"))) return false
    return true
}

function getTemplatesRoot(root: string | null): string | null {
    if (!root) return null

    let path: string = root
    while (path && !isTemplatesDir(path)) {
        const parent = Path.dirname(path)
        if (path === parent) return null
        path = parent
    }
    return Path.resolve(path, "@templates")
}

function isTemplatesDir(path: string): boolean {
    const dir = Path.resolve(path, "@templates")
    if (!FS.existsSync(dir)) return false

    const stats = FS.statSync(dir)
    return stats.isDirectory()
}
