import strip from "strip-ansi";

import * as colors from "./colors.js";

describe("date", () => {
  it("prints input with colors", () => {
    const res = colors.date("TEST");
    expect(strip(res)).toBe("TEST");
  });
});

describe("label", () => {
  it("prints input with colors", () => {
    const res = colors.label("TEST");
    expect(strip(res)).toBe("TEST");
  });
});

describe("link", () => {
  it("prints input with colors", () => {
    const res = colors.link("TEST");
    expect(strip(res)).toBe("TEST");
  });
});

describe("tagName", () => {
  it("prints input with colors", () => {
    const res = colors.tagName("TEST");
    expect(strip(res)).toBe("TEST");
  });
});

describe("version", () => {
  it("prints input with colors", () => {
    const res = colors.version("TEST");
    expect(strip(res)).toBe("TEST");
  });
});
