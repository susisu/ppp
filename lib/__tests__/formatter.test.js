"use strict";

const formatter = require("../formatter");

describe("formatter", () => {
  describe("items", () => {
    it("prints items as a list", () => {
      const items = [
        {
          label: "Foo",
          msg  : "foo",
        },
        {
          label: "Nyancat",
          msg  : "nyancat",
        },
      ];
      const text = formatter.items(items, null, 2);
      expect(text).toBe([
        "Foo     : foo",
        "Nyancat : nyancat",
      ].join("\n"));
    });

    it("wraps long message if wrapSize is not null", () => {
      const items = [
        {
          label: "Long",
          msg  : "Lorem ipsum dolor sit amet, consectetur adipisicing elit,"
            + " sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        },
      ];
      const text = formatter.items(items, 80, 2);
      expect(text).toBe([
        "Long :",
        "  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod",
        "  tempor incididunt ut labore et dolore magna aliqua.",
      ].join("\n"));
    });

    it("does not wrap long message if wrapSize is null", () => {
      const items = [
        {
          label: "Long",
          msg  : "Lorem ipsum dolor sit amet, consectetur adipisicing elit,"
            + " sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        },
      ];
      const text = formatter.items(items, null, 2);
      expect(text).toBe([
        "Long : Lorem ipsum dolor sit amet, consectetur adipisicing elit,"
          + " sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      ].join("\n"));
    });

    it("indents multiline message", () => {
      const items = [
        {
          label: "Multiline",
          msg  : [
            "Foo     : foo",
            "Nyancat : nyancat",
          ].join("\n"),
        },
      ];
      const text = formatter.items(items, null, 2);
      expect(text).toBe([
        "Multiline :",
        "  Foo     : foo",
        "  Nyancat : nyancat",
      ].join("\n"));
    });
  });
});
