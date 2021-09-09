import fs from "fs";
import yaml from "js-yaml";

import { isArray, isObject } from "./utils.js";

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
    content = await readFileIfExists(file);
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
    throw new Error("Invalid config format");
  }
  if (conf === undefined) {
    return {};
  }
  if (!isObject(conf)) {
    throw new Error("Invalid config format");
  }
  return conf;
}

export function getFields(conf) {
  if (!Object.prototype.hasOwnProperty.call(conf, "fields")) {
    return undefined;
  }
  const fields = conf["fields"];
  const isValid = isArray(fields) && fields.every(field => typeof field === "string");
  if (!isValid) {
    throw new TypeError("'fields' must be a list of field names");
  }
  return fields;
}
