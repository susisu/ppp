import { describe, expect, it } from "@jest/globals";
import { getFields, getWrapSize } from "./options";

describe("getFields", () => {
  it("returns conf.fields + opts.includeField - opts.excludeField if conf.fields exists", () => {
    const conf = { fields: ["name", "version", "license"] };
    const opts = {
      includeField: ["version", "dependencies", "devDependencies"],
      excludeField: ["license", "devDependencies", "peerDependencies"],
    };
    const defaultFields = ["name", "author"];
    expect(getFields(conf, opts, defaultFields)).toEqual(["name", "version", "dependencies"]);
  });

  it("returns defaultFields + opts.includeField - opts.excludeField if conf.fields does not exist", () => {
    const conf = {};
    const opts = {
      includeField: ["version", "dependencies", "devDependencies"],
      excludeField: ["license", "devDependencies", "peerDependencies"],
    };
    const defaultFields = ["name", "author"];
    expect(getFields(conf, opts, defaultFields)).toEqual([
      "name",
      "author",
      "version",
      "dependencies",
    ]);
  });

  it("throws an error if the result contains invalid fields", () => {
    const conf = { fields: ["name", "xxx"] };
    const opts = {
      includeField: [],
      excludeField: [],
    };
    const defaultFields = [];
    expect(() => getFields(conf, opts, defaultFields)).toThrowError("Unknown field 'xxx'");
  });
});

describe("getWrapSize", () => {
  it("parses opts.wrap and returns it if valid", () => {
    const conf = { wrap: 120 };
    const opts = { wrap: "40" };
    const defaultWrapSize = 80;
    expect(getWrapSize(conf, opts, defaultWrapSize)).toBe(40);
  });

  it("returns a rounded value if opts.wrap is not an integer", () => {
    const conf = { wrap: 120 };
    const opts = { wrap: "40.9" };
    const defaultWrapSize = 80;
    expect(getWrapSize(conf, opts, defaultWrapSize)).toBe(40);
  });

  it("returns null if opts.wrap is not positive", () => {
    const conf = { wrap: 120 };
    const opts = { wrap: "-42" };
    const defaultWrapSize = 80;
    expect(getWrapSize(conf, opts, defaultWrapSize)).toBe(null);
  });

  it("throws an error if opts.wrap cannot be parsed", () => {
    const conf = { wrap: 120 };
    const opts = { wrap: "xxx" };
    const defaultWrapSize = 80;
    expect(() => getWrapSize(conf, opts, defaultWrapSize)).toThrowError("'wrap' must be a number");
  });

  it("returns conf.wrap if opts.wrap is undefined", () => {
    const conf = { wrap: 120 };
    const opts = { wrap: undefined };
    const defaultWrapSize = 80;
    expect(getWrapSize(conf, opts, defaultWrapSize)).toBe(120);
  });

  it("returns defaultWrapSize if both opts.wrap and conf.wrap are undefined", () => {
    const conf = {};
    const opts = { wrap: undefined };
    const defaultWrapSize = 80;
    expect(getWrapSize(conf, opts, defaultWrapSize)).toBe(80);
  });
});
