import { stat, copyFile, exists } from "./fs";
import { ensure } from "./directory";
import { dirname } from "path";

export async function copyIfNewer(source: string, dest: string) {
	const newer =
		!(await exists(dest)) ||
		(await stat(source)).mtime > (await stat(dest)).mtime;

	if (newer) {
		await ensure(dirname(dest));
		await copyFile(source, dest);
		return dest;
	}

	return null;
}

export async function size(path: string) {
	return (await stat(path)).size;
}
