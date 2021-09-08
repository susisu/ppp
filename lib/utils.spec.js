import { isArray, isString, isObject } from "./utils.js";

describe("isString", () => {
  it.each([
    ["foo", true],
    [42, false],
    [{}, false],
    [null, false],
    [undefined, false],
  ])("returns true if the argument is a string: %p", (value, expected) => {
    expect(isString(value)).toBe(expected);
  });
});

describe("isObject", () => {
  it.each([
    [{}, true],
    [[], true],
    [42, false],
    [null, false],
    [undefined, false],
  ])("returns true if the argument is an object: %p", (value, expected) => {
    expect(isObject(value)).toBe(expected);
  });
});

describe("isArray", () => {
  it.each([
    [[], true],
    [42, false],
    [{}, false],
    [null, false],
    [undefined, false],
  ])("returns true if the argument is an array: %p", (value, expected) => {
    expect(isArray(value)).toBe(expected);
  });
});
