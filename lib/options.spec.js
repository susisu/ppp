import { getWrapSize } from "./options";

describe("getWrapSize", () => {
  it("returns the parsed value if it is an integer", () => {
    expect(getWrapSize("80")).toBe(80);
  });

  it("returns a rounded value if it is not an integer", () => {
    expect(getWrapSize("80.9")).toBe(80);
  });

  it("returns null if it is not positive", () => {
    expect(getWrapSize("-42")).toBe(null);
  });

  it("returns undefined if the input is undefined", () => {
    expect(getWrapSize(undefined)).toBe(undefined);
  });

  it("throws an error if the input cannot be parsed as a number", () => {
    expect(() => getWrapSize("xxx")).toThrowError("'wrap' must be an integer");
  });
});
