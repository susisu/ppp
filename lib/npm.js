import childProcess from "child_process";
import { isObject } from "./utils.js";

export function parseNpmOutput(out) {
  let data;
  try {
    data = JSON.parse(out);
  } catch (err) {
    throw new Error(`Failed to parse npm output: ${String(err)}`);
  }
  if (!isObject(data)) {
    throw new Error("Failed to parse npm output: Unexpected format");
  }
  return data;
}

export function handleNpmError(out) {
  let data;
  try {
    data = parseNpmOutput(out);
  } catch (err) {
    throw new Error(`Npm error: Unknown error: ${String(err)}`);
  }
  if (Object.prototype.hasOwnProperty.call(data, "error") && isObject(data["error"])) {
    const code = data["error"]["code"];
    const summary = data["error"]["summary"];
    if (code && summary) {
      throw new Error(`Npm error: ${code} ${summary}`);
    }
  }
  throw new Error("Npm error: Unknown error");
}

function readFromChildProcess(cmd, args) {
  return new Promise((resolve, reject) => {
    const cp = childProcess.spawn(cmd, args);
    let out = "";
    let err = "";
    cp.stdout.on("data", chunk => {
      out += chunk;
    });
    cp.stderr.on("data", chunk => {
      err += chunk;
    });
    cp.on("error", err => {
      reject(err);
    });
    cp.on("exit", (code, signal) => {
      if (signal !== null) {
        reject(new Error(`Process '${cmd}' interrupted by signal: ${signal}`));
        return;
      }
      switch (code) {
        case 0:
          resolve({ error: false, out });
          break;
        case 1:
          // err may contain well-formed error information
          resolve({ error: true, out: err });
          break;
        default:
          reject(new Error(`Process '${cmd}' exited with non-zero code: ${code}`));
      }
    });
  });
}

function readFromStdin() {
  return new Promise(resolve => {
    let out = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("readable", () => {
      let chunk = process.stdin.read();
      while (chunk !== null) {
        out += chunk;
        chunk = process.stdin.read();
      }
    });
    process.stdin.on("end", () => {
      resolve({ error: false, out });
    });
  });
}

const npmCommand = "npm";

export const npm = {
  view: async name => {
    const args = ["view", name, "--json", "--loglevel=silent"];
    const res = await readFromChildProcess(npmCommand, args);
    if (res.error) {
      return handleNpmError(res.out);
    }
    return parseNpmOutput(res.out);
  },
  ls: async (name, global) => {
    const args = ["ls", name, "--depth=0", "--json", "--loglevel=silent"];
    if (global) {
      args.push("--global");
    }
    const res = await readFromChildProcess(npmCommand, args);
    if (res.error) {
      return handleNpmError(res.out);
    }
    return parseNpmOutput(res.out);
  },
  stdin: async () => {
    const res = await readFromStdin();
    if (res.error) {
      return handleNpmError(res.out);
    }
    return parseNpmOutput(res.out);
  },
};
