---
title: "Adding Swaggers"
draft: false
weight: 2
---

Swaggers are easy to add to your documentation using the `{{</* swagger .. */>}}` shortcode. 

## Embed a Local Swagger

```markdown
{{</* swagger file="../petstore.swagger.json" */>}}
```

Produces:

{{< swagger file="../petstore.swagger.json" >}}

You can also specify a URL to embed a remote swagger.