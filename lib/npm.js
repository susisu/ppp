import childProcess from "child_process";

import { isObject } from "./utils.js";

export function parseNpmOutput(out) {
  const data = JSON.parse(out);
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
    const cp = childProcess.spawn(cmd, args);
    let out = "";
    cp.stdout.on("data", chunk => {
      out += chunk;
    });
    cp.on("error", err => {
      reject(err);
    });
    cp.on("exit", (code, signal) => {
      if (signal !== null) {
        reject(new Error(`process '${cmd}' interrupted by signal: ${signal}`));
        return;
      }
      // also accept code === 1 because it may contain well-formed error information
      if (code !== 0 && code !== 1) {
        reject(new Error(`process '${cmd}' exited with non-zero code: ${code}`));
        return;
      }
      resolve(out);
    });
  });
}

const npmCommand = "npm";

export const npm = {
  view: async name => {
    const args = ["view", name, "--json", "--loglevel=silent"];
    const out = await readFromChildProcess(npmCommand, args);
    return parseNpmOutput(out);
  },
  ls: async (name, global) => {
    const args = ["ls", name, "--depth=0", "--json", "--loglevel=silent"];
    if (global) {
      args.push("--global");
    }
    const out = await readFromChildProcess(npmCommand, args);
    return parseNpmOutput(out);
  },
};
