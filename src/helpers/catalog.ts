import { commonRoot } from "../file-system/fs";
import { relative, join } from "path";
import { ensure } from "../file-system/directory";

export interface CatalogItem {
	itemPath: string;
	catalogItemPath: string;
	catalogItemCreated: boolean;
}

/**
 * A function to catalog an item into a collection of similar items. If a file is created or
 * modified then return the path to the file, otherwise return null or undefined.
 *
 * @interface Cataloger
 */
export interface Cataloger {
	(path: string, catalogRelLink: string, pathRelLink: string): Promise<
		CatalogItem | undefined | null
	>;
}

export async function catalog(
	paths: string[],
	inDir: string,
	catalogItem: Cataloger
): Promise<CatalogItem[]> {
	await ensure(inDir);
	const pathsRoot = commonRoot(...paths) || ".";
	const result = await Promise.all(
		paths.map((path) => {
			const catalogRelLink = join(inDir, relative(pathsRoot, path));
			const pathRelLink = relative(catalogRelLink, path);
			return catalogItem(path, catalogRelLink, pathRelLink);
		})
	);

	return result.filter(Boolean) as CatalogItem[];
}
