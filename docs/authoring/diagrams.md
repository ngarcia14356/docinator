---
title: "Adding Diagrams"
draft: false
weight: 1
---

## PlantUML Diagrams

Diagrams are easy to add to your documentation using the `{{</* puml .. */>}}` shortcode. For example:

```markdown
{{</* puml file="../cmd-build.puml" */>}}
```

Renders the [../cmd-build.puml](../cmd-build.puml) to produce:

{{< puml file="../cmd-build.puml" >}}

For more information, check out the [PlantUML website](http://plantuml.com/).

## Mermaid Diagrams

You can also create diagrams directly in markdown using the `{{</* mermaid */>}}` shortcode. For example, this:

```markdown
{{</*mermaid align="left"*/>}}
graph LR;
	A[Hard edge] -->|Link text| B(Round edge)
	B --> C{Decision}
	C -->|One| D[Result one]
	C -->|Two| E[Result two]
{{</* /mermaid */>}}
```

Renders this:

{{< mermaid align="left" >}}
graph LR;
	A[Hard edge] -->|Link text| B(Round edge)
	B --> C{Decision}
	C -->|One| D[Result one]
	C -->|Two| E[Result two]
{{< /mermaid >}}

For more information, check out the [Mermaid Diagrams documentation](https://mermaidjs.github.io/).