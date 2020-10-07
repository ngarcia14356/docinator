---
title: "Docinator"
draft: false
---

# Docinator

Welcome to the documentation for Docinator! Docinator is a simple [CLI](cli) for taking the markdown from a `docs` folder and distilling the documentation from it by generating a beautiful website containing all of your project's documentation. It supports PlantUML and Mermaid diagrams, and makes incorporating Swaggers a snap!

## Getting Started

{{% notice warning %}}
Before installing Docinator, make sure you have the [current version of NodeJS](https://nodejs.org/en/) installed (8.11 or higher), as well as [Java 8](http://www.oracle.com/technetwork/java/javase/downloads/jre8-downloads-2133155.html) or above (it may work with earlier versions, but it is untested).
{{% /notice %}}

Install Docinator via the command line:

```bash
npm install -g docinator
```

Some types of diagrams require you to have [Graphviz](http://www.graphviz.org/download/) installed.

Though not required, it's also useful to have [VSCode](https://code.visualstudio.com/Download) with the [PlantUML plug-in](https://marketplace.visualstudio.com/items?itemName=jebbs.plantuml) for easy PlantUML diagram editing.

{{%expand "Are you new to markdown?" %}}
Check out the [markdown cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)!
{{% /expand%}}

## How Docinator Works

Docinator works by combining your repository's documentation with a pre-built template using Hugo:

{{<mermaid>}}
graph TD
ProjectRepo[Project Repository] --> Docinator[fa:fa-spinner Docinator]
BaseSite[Docinator Base Website] --> Docinator
Docinator -- Hugo with Learn Theme --> Website
Website --> S3
{{< /mermaid >}}

Once combined, Docinator does a little "magic" to make things are structured consistently between your project repository and the website structure "expected" by Hugo. It then uses [Hugo](https://gohugo.io/) along with the [Hugo Learn Theme](https://github.com/matcornic/hugo-theme-learn) to generate a super-fast, searchable, easy-to-navigate static website that can be hosted on AWS S3 or virtually anywhere else.

## What is "Documentation as Code"?

Documentation that exists outside of code is managed using processes outside of code, and that creates unnecessary overhead.

- Documentation easily becomes outdated - you can't "see" the need for a documentation update in a pull request, for instance
- There's no easy way to tell if the documentation up to date (except by unpleasant surprise) because its history isn't tracked along-side the product's development history.
- In other words: "Is the wiki up-to-date?" … "I don't know" … but really, just "no, it's not"

**Documentation as code** brings the process of developing software and the process of documenting software together.

- Feature branches include the documentation for the feature.
- The code history is the documentation history, so you always know if code changes are out-pacing documentation changes and you get the full traceability of Git.
- Pipelines can enforce rules, such as "pull requests must include documentation changes"
- Publishing new versions of a product includes publishing the accompanying documentation, because the documentation and the code aren't treated any differently.
- Processes (e.g. spring ceremonies) can be shared

### Where Docinator Comes In

Word Documents, PDF files, and other common documentation formats don't work well "as code". But Markdown does!

Docinator is a simple CLI for technical writers and developers that takes the markdowns, swaggers, PlantUML diagrams, and other assets from your product's Git repository and “distills” them into a beautiful, fully searchable, static website that contains all of your project’s documentation. Unlike typical documentation and static website generators, there's nothing to add to the repository other than your documentation (e.g. no website templates, configurations, libraries, etc).
