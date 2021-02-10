import { writeMarkdown } from "./../helpers/markdown";
import { join, dirname, basename } from "path";
import { exists, rename, writeFile, readFile, files, MAX_OPEN_FILES } from "../file-system/fs";
import { mdLinksToPrettyLinks } from "../helpers/markdown";
import { batchProcess } from "../utils";

export async function useReadMeAsIndex(...contentPaths: string[]) {
	const result: string[] = [];
	const work: Promise<void>[] = [];
	const readmePaths = contentPaths.filter((path) =>
		path.toLowerCase().endsWith("readme.md")
	);
	for (const readmePath of readmePaths) {
		const dir = dirname(readmePath);
		const indexPath = join(dir, "_index.md");
		if (!(await exists(indexPath))) {
			work.push(rename(readmePath, indexPath));
			result.push(indexPath);
		}
	}
	await Promise.all(work);
	return result;
}

export async function createDefaultIndexPages(contentPaths: string[]) {
	const defaultIndexPageContent =
		'{{% children depth="999" %}}\n\n' +
		"(This page was automatically generated by Docinator: To override it, create a readme.md or _index.md file)";
	// TODO: Generate page list here instead of using `children` short-code

	const result: string[] = [];
	const dirs: string[] = [];
	await batchProcess(contentPaths, MAX_OPEN_FILES, async (paths) => {
		const work: Promise<void>[] = [];
		for (const path of paths) {
			const dir = dirname(path);
			if (!dirs.includes(dir)) {
				const indexPath = join(dir, "_index.md");
				if (!(await exists(indexPath))) {
					if ((await files(dir)).find((path) => path.endsWith(".md"))) {
						work.push(
							writeMarkdown(
								indexPath,
								{ title: basename(dir), weight: 100 },
								defaultIndexPageContent
							).then(() => {
								result.push(indexPath);
							})
						);
					}
				}
				dirs.push(dir);
			}
		}
		await Promise.all(work);
	});

	return result;
}

export async function markdownLinksToHugoPrettyLinks(
	contentPaths: string[]
) {
	console.log("markdownLinksToHugoPrettyLinks")
	await batchProcess(contentPaths, MAX_OPEN_FILES, async (paths) => {
		const work: Promise<void>[] = [];
		for (const contentPath of paths) {
			const lcContentPath = contentPath.toLowerCase();
			if (lcContentPath.endsWith(".md")) {
				const workItem = async function () {
					if (await exists(contentPath)) {
						const content = mdLinksToPrettyLinks(
							await readFile(contentPath, "utf8"),
							lcContentPath.endsWith("_index.md"),
							"_index.md"
						);
						await writeFile(contentPath, content);
					}
				};
				work.push(workItem());
			}
		}
		return Promise.all(work);
	});
}
