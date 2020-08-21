---
title: "Docinator build"
draft: false
weight: 1
---

```bash
$ docinator build --help

  Usage: build [source] [destination]

  Builds a documentation website for the given source directory. If no source directory is specified, the current foler is assumed.


  Options:

    -d, --destination <destination>
    -h, --help                       output usage information
```

## Examples

Build a directory:

```bash
docinator build project-folder
```

Build a specific branch or tag:

```bash
git checkout v1.2.3  && docinator build
```
