# tolokoban-templates README

Apply and edit your personal code templates.

## Features

Right click on a folder in the file explorer to display the context menu.
When you click on __"Tolokoban: Apply Template"__, you will be asked to select a template
and you will potentially be prompted with few questions before the files will be generated.

Templates definitions are stored in a `@templates/` folder that must be found in a parent
folder of the one you selected

\!\[feature X\]\(images/feature-x.png\)

## How to write a template

A template is any sub-folder of `@templates/` that owns a `@.json5` file.

Let's take an example. Here is the tree view of a template:

```
MyTemplate/
  @.json5
  {{name}}/
    {{name}}.module.css
    {{name}}.ts
    index.ts
```

Here is the content of `@.json5` which is the template definition:

```js
{
    name: "React component with CSS module",
    params: {
        name: "Component's name"
    },
    open: "{{name}}/{{name}}.ts"
}
```

This files says that the folder is a template named _"React component with CSS module"_ with one unique parameter called _"Component's name"_.

When applying this template, the user will be prompted to enter a value
for this parameter and this value will be used in all the `{{name}}` placeholders.

Every file and folder inside the template (except for `@.json5`) will be copied to the destination folder. The name can contain a placeholder, as this it the case in our example. Thus, the name itself will depend on the value entered by the user for params.

The placeholder syntax for a parameter `MyParam27` is `{{MyParam27}}`.
For file contents, you can also use this syntax: `/*{{MyParam27}}*/`.

## `@.json5` documentation

### name

Name to display for template selection.

### open

Files to open in the editor once the template has been applied.  
Examples:

```js
{
    open: "{{name}}/{{name}}.tsx"
}
```

```js
{
    open: [
        "{{name}}/{{name}}.tsx",
        "{{name}}/{{name}}.module.css"
    ]
}
```

### params

an object of all the parameters to use in placeholders.

## Extension Settings

## Known Issues

## Release Notes

### 0.1.0

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

__Enjoy!__
