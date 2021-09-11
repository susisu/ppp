import strip from "strip-ansi";

import { date, label, link, tagName, version } from "./colors.js";

describe("date", () => {
  it("prints input with colors", () => {
    const res = date("TEST");
    expect(res).not.toBe("TEST");
    expect(strip(res)).toBe("TEST");
  });
});

describe("label", () => {
  it("prints input with colors", () => {
    const res = label("TEST");
    expect(res).not.toBe("TEST");
    expect(strip(res)).toBe("TEST");
  });
});

describe("link", () => {
  it("prints input with colors", () => {
    const res = link("TEST");
    expect(res).not.toBe("TEST");
    expect(strip(res)).toBe("TEST");
  });
});

describe("tagName", () => {
  it("prints input with colors", () => {
    const res = tagName("TEST");
    expect(res).not.toBe("TEST");
    expect(strip(res)).toBe("TEST");
  });
});

describe("version", () => {
  it("prints input with colors", () => {
    const res = version("TEST");
    expect(res).not.toBe("TEST");
    expect(strip(res)).toBe("TEST");
  });
});
