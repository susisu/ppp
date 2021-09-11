import childProcess from "child_process";

import { isObject } from "./utils.js";

export function parseNpmOutput(out) {
  let data;
  try {
    data = JSON.parse(out);
  } catch (err) {
    throw new Error(`Failed to parse npm output: ${err}`);
  }
  if (!isObject(data)) {
    throw new Error("Failed to parse npm output: Unexpected format");
  }
  if (Object.prototype.hasOwnProperty.call(data, "error")) {
    const code = data["error"]["code"];
    const summary = data["error"]["summary"];
    if (code && summary) {
      throw new Error(`Error in npm output: ${code}\n${summary}`);
    } else {
      throw new Error("Error in npm output: Unknown error");
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
        reject(new Error(`Process '${cmd}' interrupted by signal: ${signal}`));
        return;
      }
      // accepts code === 1 because it may contain well-formed error information
      if (code !== 0 && code !== 1) {
        reject(new Error(`Process '${cmd}' exited with non-zero code: ${code}`));
        return;
      }
      resolve(out);
    });
  });
}

function readFromStdin() {
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
  stdin: async () => {
    const out = await readFromStdin();
    return parseNpmOutput(out);
  },
};
