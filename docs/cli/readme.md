---
title: "Using the CLI"
draft: false
weight: 2
---

`docinator` is a CLI for generating documentation from a given project directory.

## Get Help with the CLI

```bash
$ docinator --help

  Usage: index [options] [command]

  Extracts documentation from a Git repo's /docs folder in the form of markdowns, swaggers, and pumls to create a beautiful static website


  Options:

    -v, --version  output the version number
    -h, --help     output usage information


  Commands:

    build [source] [destination]  Builds a documentation website for the given source directory. If no source directory is specified, the current foler is assumed.
    serve|preview [source]      Builds and locally serves the documentation website for the given source directory. If no source directory is specified, the current foler is assumed.
    clean [destination]              Deletes build artifacts generated from the specified source directory
```

## Commands

{{% children depth="999" %}}
