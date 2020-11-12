import { copyFile } from "./../file-system/fs";
import { join } from "path";
import { writeFile, readFile } from "../file-system/fs";
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
    pumlPaths.map(path =>
      readFile(path, "utf8").then(content =>
        writeFile(path, normalize(content))
      )
    )
  );
}

/**
 * Renders PlantUML diagrams found in the specified paths in the specified format
 *
 * @export
 * @param {string} format - The format to use to render the diagram
 * @param {...string[]} pumlPaths - The filepaths to render. Only paths ending in .puml will be rendered.
 * @returns An array of paths to the rendered diagrams
 */
export async function render(format: string, ...pumlPaths: string[]) {
  if (!format || !pumlPaths || pumlPaths.length === 0) return [];

  pumlPaths = pumlPaths.filter(path => path.toLowerCase().endsWith(".puml"));
  if (pumlPaths.length === 0) return [];

  const pumlPathsChunks = chunk(pumlPaths, 64); // 64, 96, 128 Chunk to not exceed max arg length

  for(const pumlPathsChunk of pumlPathsChunks) {
    const normalizePumlsWork = normalizePumls(...pumlPathsChunk);
    const paths = pumlPathsChunk.map(pumlPath => `"${pumlPath}"`).join(" ");
    await normalizePumlsWork;
  
    exec(
      `java -Djava.awt.headless=true -jar ${plantUmlJarFilePath} -t${format} ${paths}`
    );
  }

  const rendered = pumlPaths.map(
    path => path.substring(0, path.length - 4) + format
  ); // foo.puml => foo.svg

  const copies = pumlPaths.map(path => path + "." + format); // foo.puml => foo.puml.svg

  await Promise.all([
    rendered.map((source, index) => copyFile(source, copies[index])),
  ]);

  return [...rendered, ...copies];
}
