import fs from "fs";
import os from "os";
import path from "path";
import yaml from "js-yaml";

import { loadConfig } from "./config.js";

describe("loadConfig", () => {
  let dir;

  beforeAll(async () => {
    dir = await fs.promises.mkdtemp(path.join(os.tmpdir(), "@susisu-ppp-test-"));
  });

  it("reads the config from the first found file in the list", async () => {
    const file1 = path.join(dir, "config1.yml");
    await fs.promises.writeFile(file1, yaml.dump({ value: 1 }), { encoding: "utf8" });

    const file2 = path.join(dir, "config2.yml");
    await fs.promises.writeFile(file2, yaml.dump({ value: 2 }), { encoding: "utf8" });

    const dummyFile = path.join(dir, "dummyConfig.yml");

    await expect(loadConfig([file1, file2])).resolves.toEqual({ value: 1 });
    await expect(loadConfig([dummyFile, file2])).resolves.toEqual({ value: 2 });
  });

  it("throws an error if the file content cannot be parsed", async () => {
    const brokenFile = path.join(dir, "errorConfig.yml");
    await fs.promises.writeFile(brokenFile, ":", { encoding: "utf8" });

    await expect(loadConfig([brokenFile])).rejects.toThrowError("Invalid config format");
  });

  it("returns an empty object if the file content is empty", async () => {
    const emptyFile = path.join(dir, "emptyConfig.yml");
    await fs.promises.writeFile(emptyFile, "", { encoding: "utf8" });

    const conf = await loadConfig([emptyFile]);
    expect(conf).toEqual({});
  });

  it("throws an error if the content of the file content is not an object", async () => {
    const invalidFile = path.join(dir, "invalidConfig.yml");
    await fs.promises.writeFile(invalidFile, yaml.dump(null), { encoding: "utf8" });

    await expect(loadConfig([invalidFile])).rejects.toThrowError("Invalid config format");
  });

  it("throws an error if the file cannot be read for some reason", async () => {
    const forbiddenFile = path.join(dir, "forbiddenConfig.yml");
    await fs.promises.writeFile(forbiddenFile, "", { encoding: "utf8", mode: 0o000 });

    await expect(loadConfig([forbiddenFile])).rejects.toThrowError("EACCES");
  });

  it("returns an empty object if the file does not exist", async () => {
    const dummyFile = path.join(dir, "dummyConfig.yml");

    const conf = await loadConfig([dummyFile]);
    expect(conf).toEqual({});
  });
});
