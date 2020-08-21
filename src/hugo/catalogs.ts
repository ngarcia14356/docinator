import { Cataloger, catalog } from "../helpers/catalog";
import { exists, ensure } from "../file-system/directory";
import { dirname, basename, join, relative } from "path";
import {
  writeMarkdown,
  mdTableColumnHeaders,
  mdTableRows,
  mdLink,
} from "../helpers/markdown";

export async function hugoRenderedItemsCatalog(
  title: string,
  cataloger: Cataloger,
  catalogPath: string,
  ...contentPaths: string[]
) {
  const catalogItems = await catalog(contentPaths, catalogPath, cataloger);
  const indexPath = join(catalogPath, "_index.md");
  if (!(await exists(indexPath))) {
    const indexMdContent =
      mdTableColumnHeaders("Raw File", "Rendered") +
      mdTableRows(
        ...catalogItems.map(item => [
          mdLink(
            relative(dirname(indexPath), item.itemPath),
            relative(dirname(indexPath), item.itemPath)
          ),
          mdLink(
            relative(dirname(indexPath), item.catelogItemPath.replace(/ /g, "-")),
            relative(dirname(indexPath), item.catelogItemPath.replace(/ /g, "-"))
          ),
        ])
      );
    catalogItems.push({
      itemPath: indexPath,
      catelogItemPath: await writeMarkdown(
        indexPath,
        { title, weight: 1000 },
        indexMdContent
      ),
      catelogItemCreated: true,
    });
  }

  return catalogItems
    .filter(item => item.catelogItemCreated)
    .map(item => item.catelogItemPath);
}

function createHugoCataloger(
  shortcode: string,
  include: {
    (path: string): boolean;
  }
): Cataloger {
  return async (itemPath, catalogRelLink, pathRelLink) => {
    if (!include(itemPath)) return undefined;

    const catelogItemPath = catalogRelLink + ".md";
    const catelogItemCreated =
      !(await exists(catelogItemPath)) &&
      !!(await ensure(dirname(catelogItemPath))) &&
      !!(await writeMarkdown(
        catelogItemPath,
        { title: basename(itemPath) },
        `{{< ${shortcode} file="${pathRelLink}" >}}`
      ));

    return {
      itemPath,
      catelogItemPath,
      catelogItemCreated,
    };
  };
}

export const plantUml = createHugoCataloger("puml", path =>
  path.toLowerCase().endsWith(".puml")
);

export const swagger = createHugoCataloger(
  "swagger",
  path =>
    path.toLowerCase().endsWith(".swagger.json") ||
    path.toLowerCase().endsWith(".swagger.yaml") ||
    path.toLowerCase().endsWith(".swagger.yml") ||
    path.toLowerCase().endsWith(".swagger.txt")
);
