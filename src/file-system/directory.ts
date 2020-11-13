import { statSafe, readdir, unlink, rmdir, files } from "./fs";
import { join } from "path";
import { mkdir } from "shelljs";

export async function ensure(path: string) {
	if (!(await exists(path))) {
		mkdir("-p", path);
	}

	return path;
}

export async function exists(path: string) {
	return !!(await isDir(path));
}

export async function isDir(path: string) {
	const stats = await statSafe(path);
	return !!stats && stats.isDirectory();
}

export async function remove(path: string) {
	if (await exists(path)) {
		const contents = await files(path);
		await Promise.all(contents.map((file) => unlink(file)));
		const dirs = await readdir(path);
		await Promise.all(dirs.map((dir) => remove(join(path, dir))));
		await rmdir(path);
	}
}
