import { writeFile } from "../file-system/fs";

const frontmatterSep = "---";

/**
 * Converts links to markdown files to links to "pretty" URLs supported by most content management
 * systems and static website generators. For example:
 *
 * `[My link](../my/link.md)` => `[My link](../my/link/)`
 *
 * @export
 * @param {string} markdown - The markdown content to transform
 * @param {boolean} isIndex - Whether the markdown is contained in a default index file (equivelent
 * to index.html)
 * @param {string} indexBaseName - The name used for default index files (e.g. index.md, readme.md)
 * @returns The same markdown as was passed in, with links beautified.
 */
export function mdLinksToPrettyLinks(
  markdown: string,
  isIndex: boolean,
  indexBaseName: string
) {
  const matchRelativeLink = /\[([^\[\]]+)\]\((?!.*\/\/)([^)]+\))/gim;
  const matchRelativeLinkToMarkdownFile = /\[([^\[\]]+)\]\((?!.*\/\/)([^)]+\.md\))/gim;
  const pattern = isIndex ? matchRelativeLinkToMarkdownFile : matchRelativeLink;
  const prepend = isIndex ? "" : "../"; // Pretty URLs add an extra "step". E.g. /my/page.md => /my/page/

  const esc = indexBaseName.replace(".", "\\.");
  const replacers = [
    { regx: new RegExp(`^` + esc + "$", "i"), repl: "./" }, // _index.md => ./
    {
      regx: new RegExp(`^\.\/` + esc + "$", "i"),
      repl: "./", // ./_index.md => ./
    },
    { regx: new RegExp(`\/` + esc + "$", "i"), repl: "/" }, // anything/_index.md => anything/
    // TODO: { regx: new RegExp(`^/.+\.md$`, "gi"), repl: "" }, // /anything.md => /anything
    { regx: new RegExp(`\.md$`, "gi"), repl: "" }, // anything.md => anything
  ];

  let match: RegExpExecArray | null;
  let result = markdown;
  while ((match = pattern.exec(markdown))) {
    const linkText = match[1];
    const linkHref = match[2].substr(0, match[2].length - 1);
    let newLinkHref =
      prepend +
      replacers.reduce(
        (prev, curr) => prev.replace(curr.regx, curr.repl),
        linkHref
      );
    if (!isIndex) {
      newLinkHref = newLinkHref
        .replace(/\/\.\//, "/") // /./ => /
        .replace(/\.\.\/\//, "../"); // ..// => ../
    }
    const newLink = `[${linkText}](${newLinkHref.replace(/ /g, "-")})`;
    result = result.replace(match[0], newLink);
    // console.debug("Replaced link", { was: match[0], is: newLink });
  }

  return result;
}

export const frontmatter = (metadata: { [key: string]: any }) =>
  Object.keys(metadata).reduce(
    (frontmatterContent, key) =>
      frontmatterContent + `${key}: ${JSON.stringify(metadata[key])}` + "\n",
    frontmatterSep + "\n"
  ) + frontmatterSep;

export const mdContent = (metadata: { [key: string]: any }, content: string) =>
  frontmatter(metadata) + "\n\n" + content;

export const mdLink = (text: string, href: string) => `[${text}](${encodeURI(href)})`;

export function mdTableColumnHeaders(...headers: string[]) {
  return (
    mdTableRow(...headers) +
    headers.reduce(
      (columns, column) => columns + `${"-".repeat(column.length + 2)}|`,
      "|"
    ) +
    "\n"
  );
}

export function mdTableRow(...values: string[]) {
  return (
    values.reduce((columns, value) => columns + `${value} | `, "| ").trimRight() +
    "\n"
  );
}

export function mdTableRows(...values: string[][]) {
  return values.reduce((rows, row) => rows + mdTableRow(...row), "");
}

export const writeMarkdown = async (
  path: string,
  metadata: any,
  content: string
) => writeFile(path, mdContent(metadata, content)).then(() => path);
