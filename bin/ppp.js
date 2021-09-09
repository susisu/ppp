#!/usr/bin/env node

import difference from "lodash.difference";
import commander from "commander";
import indent from "indent-string";
import os from "os";
import path from "path";
import union from "lodash.union";
import yaml from "js-yaml";
import wrap from "wrap-ansi";

import { readFileIfExists } from "../lib/files.js";
import { npm, parseNpmOutput } from "../lib/npm.js";
import * as printer from "../lib/printer.js";
import { isObject } from "../lib/utils.js";

function readStdin() {
  return new Promise(resolve => {
    let buffer = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("readable", () => {
      let chunk = process.stdin.read();
      while (chunk !== null) {
        buffer += chunk;
        chunk = process.stdin.read();
      }
    });
    process.stdin.on("end", () => {
      resolve(buffer);
    });
  });
}

function warn(msg) {
  process.stderr.write(`Warning: ${msg}\n`);
}

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
  .option("-w, --wrap <int>", "wrap output to the specified size", x => parseInt(x, 10), undefined)
  .arguments("[package]")
  .parse();

async function main() {
  const conf = await readConfig(configPaths);
  const fields = getFields(conf);
  const wrapSize = getWrapSize(conf);
  const pkg = await readPackageInfo();
  await printInfo(pkg, fields, wrapSize);
}

main().catch(err => {
  process.stderr.write(String(err) + "\n");
  process.exitCode = 1;
});

async function readConfig(filepaths) {
  let file;
  for (const filepath of filepaths) {
    file = await readFileIfExists(filepath);
    if (file !== undefined) {
      break;
    }
  }
  if (file === undefined) {
    return {};
  }
  let data;
  try {
    data = yaml.load(file);
  } catch (err) {
    warn("Invalid config format");
    return {};
  }
  if (data === null) {
    return {};
  }
  if (!isObject(data)) {
    warn("Invalid config format");
    return {};
  }
  return data;
}

function getFields(conf) {
  const includedFields = commander.getOptionValue("includeField");
  const excludedFields = commander.getOptionValue("excludeField");
  let fields;
  if (!Object.prototype.hasOwnProperty.call(conf, "fields")) {
    fields = defaultFields;
  } else {
    const valid =
      Array.isArray(conf["fields"]) && conf["fields"].every(field => typeof field === "string");
    if (!valid) {
      throw new TypeError("'fields' must be a list of field names");
    }
    fields = conf["fields"];
  }
  fields = difference(union(fields, includedFields), excludedFields);
  for (const field of fields) {
    if (!printer.availableFields.has(field)) {
      throw new Error(`Unknown field '${field}'`);
    }
  }
  return fields;
}

function getWrapSize(conf) {
  const wrapSize = commander.getOptionValue("wrap");
  if (wrapSize !== undefined) {
    if (Number.isNaN(wrapSize)) {
      throw new TypeError("'wrap' must be an integer");
    }
    return wrapSize > 0 ? wrapSize : null;
  }
  if (!Object.prototype.hasOwnProperty.call(conf, "wrap")) {
    return defaultWrapSize;
  }
  if (typeof conf["wrap"] !== "number") {
    throw new TypeError("'wrap' must be an integer");
  }
  return conf["wrap"] > 0 ? conf["wrap"] : null;
}

async function readPackageInfo() {
  let data;
  const name = commander.processedArgs[0];
  if (name !== undefined) {
    data = await npm.view(name);
  } else {
    const input = await readStdin();
    data = parseNpmOutput(input);
  }
  const pkg = Array.isArray(data) ? data[data.length - 1] : data;
  if (!isObject(pkg)) {
    throw new TypeError("Unexpected format");
  }
  return pkg;
}

async function printInfo(pkg, fields, wrapSize) {
  const opts = {
    wrapSize: wrapSize !== null ? Math.max(wrapSize - indentSize, 0) : null,
    indentSize,
  };
  const reqs = { installedVersions };
  const result = await printer.print(pkg, fields, opts, reqs);
  process.stdout.write(indent(result, indentSize) + "\n");
}

async function installedVersions(name) {
  const [localVersion, globalVersion] = await Promise.all([
    installedVersion(name, false),
    installedVersion(name, true),
  ]);
  return {
    local: localVersion,
    global: globalVersion,
  };
}

async function installedVersion(name, global) {
  let version;
  try {
    const ls = await npm.ls(name, global);
    version = ls["dependencies"][name]["version"];
    if (typeof version !== "string") {
      version = null;
    }
  } catch (err) {
    version = null;
  }
  return version;
}
