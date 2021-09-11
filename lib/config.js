import fs from "node:fs";
import yaml from "js-yaml";
import { isNumber, isString, isObject, isArray } from "./utils.js";

async function readFileIfExists(file) {
  let content;
  try {
    content = await fs.promises.readFile(file, { encoding: "utf8" });
  } catch (err) {
    if (err.code !== "ENOENT") {
      throw err;
    }
  }
  return content;
}

export async function load(files) {
  let content;
  for (const file of files) {
    try {
      content = await readFileIfExists(file);
    } catch (err) {
      throw new Error(`Failed to load config: ${String(err)}`);
    }
    if (content !== undefined) {
      break;
    }
  }
  if (content === undefined) {
    return {};
  }
  let conf;
  try {
    conf = yaml.load(content);
  } catch {
    throw new Error("Failed to load config: Invalid config format");
  }
  if (conf === undefined) {
    return {};
  }
  if (!isObject(conf)) {
    throw new Error("Failed to load config: Invalid config format");
  }
  return conf;
}

export function getFields(conf) {
  if (!Object.prototype.hasOwnProperty.call(conf, "fields")) {
    return undefined;
  }
  const fields = conf["fields"];
  if (!isArray(fields) || !fields.every(isString)) {
    throw new Error("Failed to load config value: 'fields' must be a list of field names");
  }
  return fields;
}

export function getWrapSize(conf) {
  if (!Object.prototype.hasOwnProperty.call(conf, "wrap")) {
    return undefined;
  }
  let wrapSize = conf["wrap"];
  if (!isNumber(wrapSize) || Number.isNaN(wrapSize)) {
    throw new Error("Failed to load config value: 'wrap' must be a number");
  }
  wrapSize = Math.floor(wrapSize);
  return wrapSize >= 0 ? wrapSize : Infinity;
}
