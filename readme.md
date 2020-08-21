# Docinator

Welcome to Docinator! Docinator extracts documentation in the form of PlantUML diagrams, Swagger specs, markdowns, and more to build a beautiful documentation website without any modifications to your repository. Docinator "just works" - install it, run it, that's it.

Learn to use Docinator by reading the [user documentation](docs/) or simply run `docinator --help` command.

<!-- TODO 
## User Guide

Docinator is published as an NPM/yarn package using the Gitlab NPM package
registry.

To install and use:

1. Make sure you've already [configured your local NPM/yarn to pull scoped packages
from the Gitlab package
registry](https://docs.gitlab.com/ee/user/packages/npm_registry/#authenticating-with-a-personal-access-token)

2. Then (assuming you've followed the above instructions to configure a package
scope named `@tmobile` mapped to the Gitlab NPM registry):

    ```bash
    npm install -g @tmobile/docinator
    ```
-->

## Developer Guide

Any editor will do, but effort has been put into getting
[VSCode](https://code.visualstudio.com/) configured _just right_ so please use
that unless you have a strong preference for another editor.

### System Requirements

If you don't have typescript and TS-Node installed, start by installing them:

```bash
npm install -g typescript ts-node
```

You'll also need Java 8 or above for the PlantUML integration.

### Project Initialization and First Run

The following will download the code, install dependencies, and serve the Docinator documentation:

```bash
git clone --recurse-submodules ...
npm i
ts-node src/cli.ts serve
```

### Run the CLI

```bash
npm run build && npm link
docinator --help
```

Docinator will now be available on the command line.

To avoid having to re-link between changes, use ts-node:

```bash
ts-node src/cli.ts --help
```

<!-- TODO:

## Resources

* [asciinema](https://asciinema.org/)

-->

## Acknowledgements

This distribution includes a binary for [PlantUML](https://github.com/plantuml/plantuml).
