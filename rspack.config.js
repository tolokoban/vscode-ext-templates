//@ts-check

"use strict"

const path = require("path")

/** @type {import('@rspack/cli').Configuration} */
const extensionConfig = {
    target: "node",
    mode: "none",
    entry: "./src/extension.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "extension.js",
        libraryTarget: "commonjs2",
    },
    externals: {
        vscode: "commonjs vscode",
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: "builtin:swc-loader",
                options: {
                    jsc: {
                        parser: {
                            syntax: "typescript",
                        },
                        target: "es2020",
                    },
                },
                type: "javascript/auto",
            },
        ],
    },
    devtool: "nosources-source-map",
    infrastructureLogging: {
        level: "log",
    },
}
module.exports = [extensionConfig]
