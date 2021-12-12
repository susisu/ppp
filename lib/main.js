import os from "os";
import path from "path";
import commander from "commander";
import indent from "indent-string";
import wrap from "wrap-ansi";
import * as config from "./config.js";
import { npm } from "./npm.js";
import * as options from "./options.js";
import * as printer from "./printer.js";
import { isObject, isArray } from "./utils.js";

process.title = "ppp";

commander
  .description("package.json pretty printer")
  .addHelpText(
    "after",
    [
      "",
      "List of available fields:",
      indent(wrap([...printer.availableFields].sort().join(", "), 80 - 2), 2),
    ].join("\n")
  )
  .version("0.1.2", "-v, --version")
  .option("-f, --include-field <name>", "include a field (repeatable)", (x, xs) => [...xs, x], [])
  .option("-x, --exclude-field <name>", "exclude a field (repeatable)", (x, xs) => [...xs, x], [])
  .option("-w, --wrap <int>", "wrap output to the specified size", undefined)
  .arguments("[package]")
  .action(async (name, opts) => {
    const conf = await loadConfig();
    const fields = getFields(conf, opts);
    const wrapSize = getWrapSize(conf, opts);
    const pkg = await fetchPackage(name);
    await printPackage(pkg, fields, wrapSize);
  })
  .parseAsync()
  .catch(err => {
    process.stderr.write(`${String(err.message)}\n`);
    process.exitCode = 1;
  });

async function loadConfig() {
  const configPaths = ["config.yaml", "config.yml"].map(name =>
    path.join(os.homedir(), ".config", "ppp", name)
  );
  const conf = await config.load(configPaths).catch(err => {
    process.stderr.write(`Warning: ${String(err)}\n`);
    return {};
  });
  return conf;
}

function getFields(conf, opts) {
  const defaultFields = [
    "name",
    "version",
    "description",
    "license",
    "author",
    "homepage",
    "binaries",
    "engines",
    "os",
    "cpu",
    "peerDependencies",
    "tags",
  ];
  const fields = options.getFields(conf, opts, defaultFields);
  return fields;
}

function getWrapSize(conf, opts) {
  const defaultWrapSize = 80;
  const wrapSize = options.getWrapSize(conf, opts, defaultWrapSize);
  return wrapSize;
}

async function fetchPackage(name) {
  const data = name !== undefined ? await npm.view(name) : await npm.stdin();
  const pkg = isArray(data) ? data[data.length - 1] : data;
  if (!isObject(pkg)) {
    throw new TypeError("Unexpected package format");
  }
  return pkg;
}

async function printPackage(pkg, fields, wrapSize) {
  const indentSize = 2;
  const opts = {
    wrapSize: Math.max(wrapSize - indentSize, 0),
    indentSize,
  };
  const text = await printer.print(pkg, fields, opts, npm);
  process.stdout.write(indent(text, indentSize) + "\n");
}
