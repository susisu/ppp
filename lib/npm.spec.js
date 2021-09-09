import { parseNpmResult } from "./npm.js";

describe("parseNpmResult", () => {
  it("returns the parsed data", () => {
    const result = JSON.stringify({
      name: "@susisu/ppp",
    });
    expect(parseNpmResult(result)).toEqual({
      name: "@susisu/ppp",
    });
  });

  it("throws an error if input is not a JSON string", () => {
    expect(() => parseNpmResult("xxx")).toThrow(SyntaxError);
  });

  it("throws an error if input does not represent an object", () => {
    expect(() => parseNpmResult("42")).toThrowError("Unexpected format");
  });

  it("throws an error if input has an 'error' property", () => {
    const result = JSON.stringify({
      error: true,
    });
    expect(() => parseNpmResult(result)).toThrowError("Unexpected format");
  });

  it("throws a detailed error if input has an 'error' property with the code and the summary", () => {
    const result = JSON.stringify({
      error: { code: "E404", summary: "Not Found" },
    });
    expect(() => parseNpmResult(result)).toThrowError("E404\nNot Found");
  });
});
