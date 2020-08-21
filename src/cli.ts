#!/usr/bin/env node
import cli from "commander";
import { name, version, description } from "./package-json";
import { register, execute } from "./cli-commander-async";
import { build, clean, serve } from ".";

cli.version(version, "-v, --version").description(description);

register({
  action: clean,
  argsDescriptor: "[destination]",
  description:
    "Deletes build artifacts generated from the specified source directory",
}).to(cli);

register({
  action: build,
  argsDescriptor: "[files...]",
  description:
    "Builds a documentation website for the given source directory. " +
    "If no source directory is specified, the current foler is assumed." +
    "Optionally, pass a list of files at the end of the command to build ONLY those files.",
})
  .to(cli)
  .option("--clean")
  .option("--destination <destination>")
  .option("--source <source>");

  register({
    action: serve,
    argsDescriptor: "[files...]",
    description:
      "Builds a documentation website for the given source directory. " +
      "If no source directory is specified, the current foler is assumed." +
      "Optionally, pass a list of files at the end of the command to build ONLY those files.",
  })
    .to(cli)
    .option("--clean")
    .option("--destination <destination>")
    .option("--source <source>");

// TODO: .option("-b, --builder <builder>", "hugo|gatsby", "hugo");

const succeed = () => {
  console.log(`${name} Succeeded!`);
  process.exit(0);
};

const fail = (err: any) => {
  console.log(`${name} Failed!`);
  console.error(err);
  process.exit(1);
};

try {
  cli.parse(process.argv);
  execute()
    .then(succeed)
    .catch(fail);
} catch (err) {
  fail(err);
}
