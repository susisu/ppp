#!/usr/bin/env node

import difference from "lodash.difference";
import commander from "commander";
import indent from "indent-string";
import os from "os";
import path from "path";
import union from "lodash.union";
import wrap from "wrap-ansi";

import * as config from "../lib/config.js";
import { npm } from "../lib/npm.js";
import * as options from "../lib/options.js";
import * as printer from "../lib/printer.js";
import { isArray, isObject } from "../lib/utils.js";

process.title = "ppp";

const configPaths = ["config.yaml", "config.yml"].map(name =>
  path.join(os.homedir(), ".config", "ppp", name)
);

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
const defaultWrapSize = 80;
const indentSize = 2;

const availableFieldsText = `
List of available fields:
${indent(wrap([...printer.availableFields].sort().join(", "), 80 - 2), 2)}`;

commander
  .description("package.json pretty printer")
  .addHelpText("after", availableFieldsText)
  .version("0.0.6", "-v, --version")
  .option("-f, --include-field <name>", "include a field (repeatable)", (x, xs) => xs.concat(x), [])
  .option("-x, --exclude-field <name>", "exclude a field (repeatable)", (x, xs) => xs.concat(x), [])
  .option("-w, --wrap <int>", "wrap output to the specified size")
  .arguments("[package]")
  .parse();

main().catch(err => {
  process.stderr.write(String(err) + "\n");
  process.exitCode = 1;
});

async function main() {
  const conf = await loadConfig();
  const fields = getFields(conf);
  const wrapSize = getWrapSize(conf);
  const pkg = await fetchPackage();
  await printPackage(pkg, fields, wrapSize);
}

async function loadConfig() {
  let conf;
  try {
    conf = await config.load(configPaths);
  } catch (err) {
    process.stderr.write(`Warning: failed to load config: ${String(err)}\n`);
    conf = {};
  }
  return conf;
}

function getFields(conf) {
  const includedFields = commander.getOptionValue("includeField");
  const excludedFields = commander.getOptionValue("excludeField");
  let fields = config.getFields(conf) || defaultFields;
  fields = difference(union(fields, includedFields), excludedFields);
  printer.validateFields(fields);
  return fields;
}

function getWrapSize(conf) {
  let wrapSize = options.getWrapSize(commander.getOptionValue("wrap"));
  if (wrapSize !== undefined) {
    return wrapSize;
  }
  wrapSize = config.getWrapSize(conf);
  if (wrapSize !== undefined) {
    return wrapSize;
  }
  return defaultWrapSize;
}

async function fetchPackage() {
  const name = commander.processedArgs[0];
  const data = name !== undefined ? await npm.view(name) : await npm.stdin();
  const pkg = isArray(data) ? data[data.length - 1] : data;
  if (!isObject(pkg)) {
    throw new TypeError("Unexpected format");
  }
  return pkg;
}

async function printPackage(pkg, fields, wrapSize) {
  const opts = {
    wrapSize: wrapSize !== null ? Math.max(wrapSize - indentSize, 0) : null,
    indentSize,
  };
  const text = await printer.print(pkg, fields, opts, npm);
  process.stdout.write(indent(text, indentSize) + "\n");
}
