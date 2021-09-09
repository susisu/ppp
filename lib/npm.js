import childProcess from "child_process";

import { isObject } from "./utils.js";

export function parseNpmResult(result) {
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

function readFromChildProcess(cmd, args) {
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

export async function npmView(name) {
  const args = ["view", name, "--json", "--loglevel=silent"];
  const result = await readFromChildProcess(npmCommand, args);
  return parseNpmResult(result);
}

export async function npmLs(name, global) {
  const args = ["ls", name, "--depth=0", "--json", "--loglevel=silent"];
  if (global) {
    args.push("--global");
  }
  const result = await readFromChildProcess(npmCommand, args);
  return parseNpmResult(result);
}
