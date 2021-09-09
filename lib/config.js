import fs from "fs";
import yaml from "js-yaml";

import { isObject } from "./utils.js";

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

export async function loadConfig(files) {
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
