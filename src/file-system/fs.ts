import { promisify } from "util";
import * as fs from "graceful-fs";
import { dirname, sep, resolve, join, relative } from "path";
import { isDir, ensure } from "./directory";
import { copyIfNewer } from "./file";

export const copyFile = promisify(fs.copyFile);
export const mkdir = promisify(fs.mkdir);
export const readdir = promisify(fs.readdir);
export const readFile = promisify(fs.readFile);
export const rename = promisify(fs.rename);
export const rmdir = promisify(fs.rmdir);
export const stat = promisify(fs.stat);
export const unlink = promisify(fs.unlink);
export const writeFile = promisify(fs.writeFile);

const noSuchFileOrDirectoryCode = "ENOENT";

export async function statSafe(path: string) {
  try {
    return await stat(path);
  } catch (err) {
    return null;
  }
}

export function commonRoot(...paths: string[]) {
  return !paths || paths.length === 0
    ? undefined
    : paths
        .map(path => dirname(resolve(path)))
        .reduce((prev, curr) => {
          const prevParts = prev.split(sep);
          const currParts = curr.split(sep);
          return prevParts.filter((part, i) => part === currParts[i]).join(sep);
        });
}

export function copy(sourcePath?: string, ...includeOnly: string[]) {
  const dirPath = sourcePath || commonRoot(...includeOnly) || ".";
  const cp = async function(
    destination: string,
    cpFile: { (sourcePath: string, destPath: string): Promise<string | null> }
  ) {
    await ensure(destination);
    if (!includeOnly || includeOnly.length === 0) {
      includeOnly = [dirPath];
    }
    const sourceFiles = await files(...includeOnly);
    const result: string[] = [];
    const work = sourceFiles.map(path =>
      cpFile(path, join(destination, relative(dirPath, path))).then(copied => {
        if (copied) result.push(copied);
      })
    );
    await Promise.all(work);
    return result;
  };

  return {
    to: async function(destination: string) {
      return cp(destination, async (src, dest) => {
        await copyFile(src, dest);
        return dest;
      });
    },
    newerFiles: {
      to: async function(destination: string) {
        return cp(destination, copyIfNewer);
      },
    },
  };
}

export async function exists(path: string) {
  try {
    return !!(await stat(path));
  } catch (err) {
    if (err.code === noSuchFileOrDirectoryCode) {
      return false;
    }
    throw err;
  }
}

export async function files(...sources: string[]) {
  const result: string[] = [];
  const work: Promise<void>[] = [];
  for (const source of sources) {
    if (await isDir(source)) {
      work.push(
        readdir(source).then(contents =>
          files(...contents.map(content => join(source, content))).then(
            files => {
              result.push(...files);
            }
          )
        )
      );
    } else {
      result.push(source);
    }
  }
  await Promise.all(work);
  return result;
}
