import { resolve } from "path";
import { readFileSync } from "fs";

type PackageJson = {
	description: string;
	name: string;
	version: string;
};

const packageJsonPath = resolve(__dirname, "../package.json");
const packageJsonContents = readFileSync(packageJsonPath, "utf8");

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const packageJson: PackageJson = packageJsonContents
	? JSON.parse(packageJsonContents)
	: null;

export const { name, version, description } = packageJson;
