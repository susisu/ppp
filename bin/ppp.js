#!/usr/bin/env node

import commander from "commander";
import indent from "indent-string";
import os from "os";
import path from "path";
import wrap from "wrap-ansi";

import * as config from "../lib/config.js";
import { npm } from "../lib/npm.js";
import * as options from "../lib/options.js";
import * as printer from "../lib/printer.js";
import { isObject, isArray } from "../lib/utils.js";

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
  .version("0.0.6", "-v, --version")
  .option("-f, --include-field <name>", "include a field (repeatable)", (x, xs) => [...xs, x], [])
  .option("-x, --exclude-field <name>", "exclude a field (repeatable)", (x, xs) => [...xs, x], [])
  .option("-w, --wrap <int>", "wrap output to the specified size", undefined)
  .arguments("[package]")
  .parse();

main().catch(err => {
  process.stderr.write(String(err) + "\n");
  process.exitCode = 1;
});

async function main() {
  const opts = {
    includeField: commander.getOptionValue("includeField"),
    excludeField: commander.getOptionValue("excludeField"),
    wrap: commander.getOptionValue("wrap"),
  };
  const args = commander.processedArgs;

  const configPaths = ["config.yaml", "config.yml"].map(name =>
    path.join(os.homedir(), ".config", "ppp", name)
  );
  const conf = await config.load(configPaths).catch(err => {
    process.stderr.write(`Warning: failed to load config: ${String(err)}\n`);
    return {};
  });

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

  const defaultWrapSize = 80;
  const wrapSize = options.getWrapSize(conf, opts, defaultWrapSize);

  const pkg = await fetchPackage(args[0]);
  await printPackage(pkg, fields, wrapSize);
}

async function fetchPackage(name) {
  const data = name !== undefined ? await npm.view(name) : await npm.stdin();
  const pkg = isArray(data) ? data[data.length - 1] : data;
  if (!isObject(pkg)) {
    throw new TypeError("Unexpected format");
  }
  return pkg;
}

async function printPackage(pkg, fields, wrapSize) {
  const indentSize = 2;
  const opts = {
    wrapSize: wrapSize !== null ? Math.max(wrapSize - indentSize, 0) : null,
    indentSize,
  };
  const text = await printer.print(pkg, fields, opts, npm);
  process.stdout.write(indent(text, indentSize) + "\n");
}
