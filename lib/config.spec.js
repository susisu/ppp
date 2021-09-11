import fs from "fs";
import os from "os";
import path from "path";
import yaml from "js-yaml";

import { getFields, getWrapSize, load } from "./config.js";

describe("load", () => {
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

    await expect(load([file1, file2])).resolves.toEqual({ value: 1 });
    await expect(load([dummyFile, file2])).resolves.toEqual({ value: 2 });
  });

  it("throws an error if the file content cannot be parsed", async () => {
    const brokenFile = path.join(dir, "errorConfig.yml");
    await fs.promises.writeFile(brokenFile, ":", { encoding: "utf8" });

    await expect(load([brokenFile])).rejects.toThrowError("Invalid config format");
  });

  it("returns an empty object if the file content is empty", async () => {
    const emptyFile = path.join(dir, "emptyConfig.yml");
    await fs.promises.writeFile(emptyFile, "", { encoding: "utf8" });

    const conf = await load([emptyFile]);
    expect(conf).toEqual({});
  });

  it("throws an error if the content of the file content is not an object", async () => {
    const invalidFile = path.join(dir, "invalidConfig.yml");
    await fs.promises.writeFile(invalidFile, yaml.dump(null), { encoding: "utf8" });

    await expect(load([invalidFile])).rejects.toThrowError("Invalid config format");
  });

  it("throws an error if the file cannot be read for some reason", async () => {
    const forbiddenFile = path.join(dir, "forbiddenConfig.yml");
    await fs.promises.writeFile(forbiddenFile, "", { encoding: "utf8", mode: 0o000 });

    await expect(load([forbiddenFile])).rejects.toThrowError("EACCES");
  });

  it("returns an empty object if the file does not exist", async () => {
    const dummyFile = path.join(dir, "dummyConfig.yml");

    const conf = await load([dummyFile]);
    expect(conf).toEqual({});
  });
});

describe("getFields", () => {
  it("returns 'fields' of the config if it is an array of strings", () => {
    const conf = {
      fields: ["name", "version"],
    };
    expect(getFields(conf)).toEqual(["name", "version"]);
  });

  it("returns undefined if the config does not have 'fields'", () => {
    expect(getFields({})).toBe(undefined);
  });

  it("throws an error if 'fields' is not an array", () => {
    const conf = {
      fields: null,
    };
    expect(() => getFields(conf)).toThrowError("'fields' must be a list of field names");
  });

  it("throws an error if 'fields' contains a non-string value", () => {
    const conf = {
      fields: ["name", 42],
    };
    expect(() => getFields(conf)).toThrowError("'fields' must be a list of field names");
  });
});

describe("getWrapSize", () => {
  it("returns 'wrap' of the config if it is an integer", () => {
    const conf = {
      wrap: 80,
    };
    expect(getWrapSize(conf)).toBe(80);
  });

  it("returns null if 'wrap' is not positive", () => {
    const conf = {
      wrap: -42,
    };
    expect(getWrapSize(conf)).toBe(null);
  });

  it("returns undefined if the config does not have 'wrap'", () => {
    expect(getWrapSize({})).toBe(undefined);
  });

  it("throws an error if 'fields' is not a number", () => {
    const conf = {
      wrap: "foo",
    };
    expect(() => getWrapSize(conf)).toThrowError("'wrap' must be an integer");
  });
});
