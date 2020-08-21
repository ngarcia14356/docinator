---
title: "Authoring Content"
draft: false
weight: 1
---

Writing "documentation as code" is easy with Docinator. Just add your documentation to your Git repository's `docs/` directory in [markdown (`*.md`)](https://learn.netlify.com/en/cont/markdown/) format and Docinator will generate a beautiful, searchable, static website for you automatically.

{{% notice tip %}}
When authoring content, keep in mind that `docinator` uses [Hugo](https://gohugo.io/) with the [Learn Theme](https://learn.netlify.com/en/) behind the scenes. Their documentation and features apply here.
{{% /notice %}}

## Structuring Content

The structure of your content determines the navigation structure of your Docinator website. 

As a bare-minimum, your `docs/` director should contain a file called `_index.md` or `readme.md` to serve as your documentation's home page.

You can create additional "sections" of content simply by adding sub-directories in your `docs/` folder and including an `_index.md` or `readme.md` file in the sub-directory. Additional markdown files in the directory become navigation items. You can also add additional sub-directories - there's no depth limit.

### Front Matter

To set properties for your content, add front-matter. Here is an example markdown file:

```markdown
---
title: "Set the Page Title Like This"
menuTitle: "This shows in the nav (defaults to title)"
draft: false
weight: 5
---

Content goes here.
```

{{% notice tip %}}
For more information on front matter, read [Hugo's Frontmatter Documentation](https://gohugo.io/content-management/front-matter/) and [Learn Theme's Frontmatter Documentation](https://learn.netlify.com/en/cont/pages/#front-matter-configuration).
{{% /notice %}}

## Referencing Files in Your Repository

You can references static content (for example, images) just as you would expect to be able to using relative urls.