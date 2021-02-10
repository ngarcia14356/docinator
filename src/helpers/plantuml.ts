import { join } from "path";
import { copyFile, readFile, stat, writeFile } from "../file-system/fs";
import { chunk, exec } from "../utils";

const plantUmlJarFilePath = join(
	__dirname,
	"../../lib/plantuml",
	"plantuml.jar"
);

export function normalize(pumlText: string) {
	return pumlText.replace(/^@startuml.*/, "@startuml");
}

function normalizePumls(...pumlPaths: string[]) {
	return Promise.all(
		pumlPaths.map(async (path) => {
			const content = await readFile(path, "utf8");
			const originalLen = content.length;
			const normalized = normalize(content);
			const normalizedLen = normalized.length;

			if (normalizedLen !== originalLen) {
				await writeFile(path, normalized);
				const newFileSize = (await stat(path)).size || (await stat(path)).size;
				if (newFileSize === 0) {
					console.warn("Normalized PUML length was zero!", {
						path,
						originalLen,
						normalizedLen,
						newFileSize,
						newFileSizeCheck: (await stat(path)).size,
						// content,
						// normalized,
					});
					// process.exit(1);
				}
			}

			// return "done";
		})
	);
}

/**
 * Renders PlantUML diagrams found in the specified paths in the specified format
 *
 * @export
 * @param {string} format - The format to use to render the diagram
 * @param {string[]} pumlPaths - The filepaths to render. Only paths ending in .puml will be rendered.
 * @returns An array of paths to the rendered diagrams
 */
export async function render(format: string, pumlPaths: string[]) {
	if (!format || !pumlPaths || pumlPaths.length === 0) return [];

	pumlPaths = pumlPaths.filter((path) => path.toLowerCase().endsWith(".puml"));
	if (pumlPaths.length === 0) return [];

	const normalizeChunks = chunk(pumlPaths, 512); // Prevent too many files from being open
	const pumlPathsChunks = chunk(pumlPaths, 32); // Prevent command too long

	for (const pumlPathsChunk of normalizeChunks) {
		await normalizePumls(...pumlPathsChunk);
	}

	for (const pumlPathsChunk of pumlPathsChunks) {
		exec(
			`java -Djava.awt.headless=true -jar ${plantUmlJarFilePath} -t${format} ${pumlPathsChunk
				.map((pumlPath) => `"${pumlPath}"`)
				.join(" ")}`
		);
	}

	const rendered = pumlPaths.map(
		(path) => path.substring(0, path.length - 4) + format
	); // foo.puml => foo.svg

	const copies = pumlPaths.map((path) => path + "." + format); // foo.puml => foo.puml.svg

	await Promise.all(
		rendered.map((source, index) => copyFile(source, copies[index]))
	);

	return [...rendered, ...copies];
}
