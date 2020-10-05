import { Provider } from './../providers';
import { Builder } from "../providers";
import { join, resolve } from "path";
import {
  useReadMeAsIndex,
  createDefaultIndexPages,
  markdownLinksToHugoPrettyLinks,
} from "./transformations";
import { render } from "../helpers/plantuml";
import { exec } from "../utils";
import { copy, commonRoot } from "../file-system/fs";
import { plantUml, hugoRenderedItemsCatalog, swagger } from "./catalogs";
import { assetFileExtensions } from "../extensions";

const hugo = require("hugo-bin");

export const siteTemplatePath = join(__dirname, "site-template");

export const hugoProvider: Provider = {
  build: async (destinationPath, docsPath, ...sourcePaths) => { 
    const result = await build(destinationPath, docsPath, ...sourcePaths);
    exec(`${hugo} --source ${destinationPath} `); //--destination ${this.destinationWorkspace.root}`)
    return result; 
  },
  serve: async (destinationPath, docsPath, sourcePaths) => { 
    const result = await build(destinationPath, docsPath, sourcePaths);
    exec(`${hugo} serve --watch=true --source ${destinationPath} --bind 0.0.0.0`);
    return result; 
  },
}

export const build: Builder = async (
  destinationPath,
  docsPath,
  sourcePaths
) => {
  // Source Paths
  docsPath = resolve(docsPath);
  const docsPaths = sourcePaths.filter(path => path.startsWith(docsPath));

  sourcePaths = sourcePaths.map(path => resolve(path));
  const sourcePath = commonRoot(...sourcePaths);

  const sourceAssetPaths = sourcePaths.filter(
    path =>
      !!assetFileExtensions.find(
        ext =>
          path.endsWith(ext) &&
          !path.startsWith(docsPath) &&
          !path.startsWith(destinationPath)
      )
  );

  // Hugo Paths

  const hugoContentPath = join(destinationPath, "content");
  const hugoContentPaths: string[] = [];

  const hugoStaticPath = join(destinationPath, "static");
  const hugoStaticPaths: string[] = [];

  // Bootstrap
  const sitePaths: string[] = [];
  await Promise.all([
    // The site template
    copy(siteTemplatePath)
      .newerFiles.to(destinationPath)
      .then(paths => sitePaths.push(...paths)),
    // The docs
    copy(docsPath, ...docsPaths)
      .newerFiles.to(hugoContentPath)
      .then(paths => hugoContentPaths.push(...paths)),
    // Assets external to docs for static folder
    copy(sourcePath, ...sourceAssetPaths)
      .newerFiles.to(hugoStaticPath)
      .then(paths => hugoStaticPaths.push(...paths)),
    // Assets external to docs for docs folder
    copy(sourcePath, ...sourceAssetPaths)
      .newerFiles.to(hugoContentPath)
      .then(paths => hugoContentPaths.push(...paths)),
  ]);

  // Catalogs
  await Promise.all([
    hugoRenderedItemsCatalog(
      "All PlantUML Diagrams",
      plantUml,
      join(hugoContentPath, "all-pumls"),
      ...hugoContentPaths
    ).then(paths => hugoContentPaths.push(...paths)),
    hugoRenderedItemsCatalog(
      "All Swaggers",
      swagger,
      join(hugoContentPath, "all-swaggers"),
      ...hugoContentPaths
    ).then(paths => hugoContentPaths.push(...paths)),
  ]);

  // Serial Transformations
  hugoContentPaths.push(...(await useReadMeAsIndex(...hugoContentPaths)));
  hugoContentPaths.push(
    ...(await createDefaultIndexPages(...hugoContentPaths))
  );

  // Parallel Transformations
  await Promise.all([
    markdownLinksToHugoPrettyLinks(...hugoContentPaths),
    render("png", ...hugoContentPaths).then(paths =>
      hugoContentPaths.push(...paths)
    ),
    render("svg", ...hugoContentPaths).then(paths =>
      hugoContentPaths.push(...paths)
    ),
  ]);

  return [...sitePaths, ...hugoContentPaths];
};
