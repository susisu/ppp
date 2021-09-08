#!/usr/bin/env node

import difference from "lodash.difference";
import childProcess from "child_process";
import commander from "commander";
import fs from "fs";
import indent from "indent-string";
import os from "os";
import path from "path";
import union from "lodash.union";
import yaml from "js-yaml";
import wrap from "wrap-ansi";

import printer from "../lib/printer.js";

function readFile(filepath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, "utf-8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
}

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

function readSubprocess(cmd, args) {
  return new Promise((resolve, reject) => {
    const sub = childProcess.spawn(cmd, args);
    let buffer = "";
    sub.stdout.on("data", chunk => {
      buffer += chunk;
    });
    sub.on("error", err => {
      reject(err);
    });
    sub.on("exit", (code, signal) => {
      if (signal !== null) {
        reject(new Error(`process '${cmd}' interrupted by signal: ${signal}`));
        return;
      }
      // also accept code === 1 because it may contain well-formed error information
      if (code !== 0 && code !== 1) {
        reject(new Error(`process '${cmd}' exited with non-zero code: ${code}`));
        return;
      }
      resolve(buffer);
    });
  });
}

const npmCommand = "npm";

async function npmView(name) {
  const args = ["view", name, "--json", "--loglevel=silent"];
  const result = await readSubprocess(npmCommand, args);
  return parseNpmResult(result);
}

async function npmLs(name, inGlobal) {
  const args = ["ls", name, "--depth=0", "--json", "--loglevel=silent"];
  if (inGlobal) {
    args.push("--global");
  }
  const result = await readSubprocess(npmCommand, args);
  return parseNpmResult(result);
}

function parseNpmResult(result) {
  const data = JSON.parse(result);
  if (!isObject(data)) {
    throw new TypeError("Unexpected format");
  }
  if (Object.prototype.hasOwnProperty.call(data, "error")) {
    const code = data["error"]["code"];
    const summary = data["error"]["summary"];
    if (code && summary) {
      throw new Error(`${code}\n${summary}`);
    } else {
      throw new TypeError("Unexpected format");
    }
  }
  return data;
}

function isObject(val) {
  return typeof val === "object" && val !== null;
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

async function readFileIfExists(filepath) {
  let file;
  try {
    file = await readFile(filepath);
  } catch (err) {
    if (err.code !== "ENOENT") {
      throw err;
    }
  }
  return file;
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
  const wrap = commander.getOptionValue("wrap");
  if (wrap !== undefined) {
    if (Number.isNaN(wrap)) {
      throw new TypeError("'wrap' must be an integer");
    }
    return wrap > 0 ? wrap : null;
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
    data = await npmView(name);
  } else {
    const input = await readStdin();
    data = parseNpmResult(input);
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

async function installedVersion(name, inGlobal) {
  let version;
  try {
    const ls = await npmLs(name, inGlobal);
    version = ls["dependencies"][name]["version"];
    if (typeof version !== "string") {
      version = null;
    }
  } catch (err) {
    version = null;
  }
  return version;
}
