---
title: "Advanced Elements"
draft: false
weight: 3
---

The [Learn Theme for Hugo](https://learn.netlify.com/en/) comes with some nifty extras. Here are a few examples with links to additional documentation.

## Buttons

The [button shortcode](https://learn.netlify.com/en/shortcodes/button/) allows you to add nice looking buttons to your content.

So this:

```markdown
{{%/* button href="https://github.com/tmobile/docinator" icon="fa fa-download" %}}Get Docinator!{{% /button */%}}
```

Becomes this:

{{% button href="https://github.com/tmobile/docinator" icon="fa fa-download" %}}Get Docinator!{{% /button %}}

## Expanding Content

The [expand shortcode](https://learn.netlify.com/en/shortcodes/expand/) creates expandable content.

So this:

```markdown
{{%/* expand "Is Docinator amazing?" */%}}
Why yes it is!
{{%/* /expand */%}}
```

Becomes this:

{{<expand "Is Docinator amazing?" >}}
Why yes it is!
{{< /expand >}}

## Mermaid Diagrams

Full documentation: 
https://learn.netlify.com/en/shortcodes/mermaid/

Example:

{{<mermaid align="left">}}
graph LR;
    A[Write Documentation] -->|Docinator| B(Get Website)
    B --> C{Celebrate?}
    C -->|Yes| D[Woot!]
    C -->|No| E[But Why?]
{{< /mermaid >}}

## Notices

Full documentation: https://learn.netlify.com/en/shortcodes/notice/

Example:
{{% notice note %}}
A notice disclaimer
{{% /notice %}}

## More

* [List child pages](https://learn.netlify.com/en/shortcodes/children/)