import { isNumber, isString, isObject, isArray, union, difference } from "./utils.js";

describe("isNumber", () => {
  it.each([
    [42, true],
    ["foo", false],
    [{}, false],
    [null, false],
    [undefined, false],
  ])("returns true if the argument is a number: %p", (value, expected) => {
    expect(isNumber(value)).toBe(expected);
  });
});

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

describe("union", () => {
  it("creates the union set as an array of unique values", () => {
    const xs = [2, 7, 1, 8, 2, 8, 1];
    const ys = [3, 1, 4, 1, 5, 9, 2];
    expect(union(xs, ys)).toEqual([2, 7, 1, 8, 3, 4, 5, 9]);
  });
});

describe("difference", () => {
  it("creates the set difference as an array of unique values", () => {
    const xs = [2, 7, 1, 8, 2, 8, 1];
    const ys = [3, 1, 4, 1, 5, 9, 2];
    expect(difference(xs, ys)).toEqual([7, 8]);
  });
});
