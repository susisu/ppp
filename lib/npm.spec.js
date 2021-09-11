import { parseNpmOutput, handleNpmError } from "./npm.js";

describe("parseNpmOutput", () => {
  it("returns the parsed data", () => {
    const out = JSON.stringify({
      name: "@susisu/ppp",
    });
    expect(parseNpmOutput(out)).toEqual({
      name: "@susisu/ppp",
    });
  });

  it("throws an error if the npm output is not a JSON string", () => {
    expect(() => parseNpmOutput("xxx")).toThrowError("Failed to parse npm output");
  });

  it("throws an error if the npm output does not represent an object", () => {
    expect(() => parseNpmOutput("42")).toThrowError(
      "Failed to parse npm output: Unexpected format"
    );
  });
});

describe("handleNpmError", () => {
  it("throws a detailed error if the npm output contains well-formed error information", () => {
    const out = JSON.stringify({
      error: { code: "E404", summary: "Not Found" },
    });
    expect(() => handleNpmError(out)).toThrowError("Npm error: E404 Not Found");
  });

  it("throws an unknown error if the npm output does not contain well-formed error information", () => {
    const out = JSON.stringify({});
    expect(() => handleNpmError(out)).toThrowError("Npm error: Unknown error");
  });

  it("throws an error if the npm output cannot be parsed as JSON", () => {
    expect(() => handleNpmError("xxx")).toThrowError("Npm error: Unknown error");
  });
});
