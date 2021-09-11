import { parseNpmOutput } from "./npm.js";

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

  it("throws an error if the npm output has an 'error' property", () => {
    const out = JSON.stringify({
      error: true,
    });
    expect(() => parseNpmOutput(out)).toThrowError("Error in npm output: Unknown error");
  });

  it("throws a detailed error if the npm output has an 'error' property with the code and the summary", () => {
    const out = JSON.stringify({
      error: { code: "E404", summary: "Not Found" },
    });
    expect(() => parseNpmOutput(out)).toThrowError("Error in npm output: E404 Not Found");
  });
});
