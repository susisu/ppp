"use strict";

const strip = require("strip-ansi");

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
        "  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod ",
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

  describe("fields", () => {
    describe("binaries", () => {
      it("prints list of binaries", () => {
        const val = {
          "foo": "./bin/foo",
          "bar": "./bin/bar",
        };
        const msg = formatter.fields.binaries(val);
        expect(msg).toBe("bar, foo");
      });
    });

    describe("boolean", () => {
      it("prints boolean value", () => {
        expect(formatter.fields.boolean(true)).toBe("Yes");
        expect(formatter.fields.boolean(false)).toBe("No");
      });
    });

    describe("dependencies", () => {
      it("prints list of dependencies", () => {
        const val = {
          "foo"    : "^1.0.0",
          "bar"    : "~2.0.0",
          "nyancat": "3.1.4",
        };
        const msg = formatter.fields.dependencies(val);
        expect(strip(msg)).toBe("bar@~2.0.0, foo@^1.0.0, nyancat@3.1.4");
      });
    });

    describe("keywords", () => {
      it("prints list of keywords", () => {
        const val = ["foo", "bar"];
        const msg = formatter.fields.keywords(val);
        expect(msg).toBe("foo, bar");
      });
    });

    describe("people", () => {
      it("prints people", () => {
        const val = [
          "Foo <foo@example.com>",
          {
            name : "Bar",
            email: "bar@example.com",
            url  : "https://example.com/bar",
          },
        ];
        const msg = formatter.fields.people(val);
        expect(strip(msg)).toBe([
          "Foo <foo@example.com>",
          "Bar <bar@example.com> (https://example.com/bar)",
        ].join("\n"));
      });
    });

    describe("person", () => {
      it("prints person represented in string", () => {
        const val = "Foo <foo@example.com>";
        const msg = formatter.fields.person(val);
        expect(strip(msg)).toBe("Foo <foo@example.com>");
      });

      it("prints person represented in object", () => {
        {
          const val = {
            name: "Foo",
          };
          const msg = formatter.fields.person(val);
          expect(strip(msg)).toBe("Foo");
        }
        {
          const val = {
            name : "Foo",
            email: "foo@example.com",
            url  : "https://example.com/foo",
          };
          const msg = formatter.fields.person(val);
          expect(strip(msg)).toBe("Foo <foo@example.com> (https://example.com/foo)");
        }
      });
    });

    describe("rawText", () => {
      it("prints text without highlighting any portions", () => {
        const val = "Nyancat <nyancat@example.com> (https://example.com/nyancat)";
        const msg = formatter.fields.rawText(val);
        expect(msg).toBe(val);
      });
    });

    describe("tags", () => {
      it("prints list of distribution tags", () => {
        const val = {
          "latest": "3.1.4",
          "next"  : "4.0.0",
        };
        const msg = formatter.fields.tags(val, undefined);
        expect(strip(msg)).toBe([
          "latest : 3.1.4",
          "next   : 4.0.0",
        ].join("\n"));
      });

      it("prints list of distribution tags with published dates if times is given", () => {
        const val = {
          "latest": "3.1.0",
          "next"  : "3.1.4",
        };
        const times = {
          "3.1.0": "2000-01-01T00:00:00.000Z",
          "3.1.4": "2006-01-02T03:04:05.000Z",
        };
        const msg = formatter.fields.tags(val, times);
        expect(strip(msg)).toMatch(new RegExp("^" + [
          "latest : 3\\.1\\.0 \\(.+\\)",
          "next   : 3\\.1\\.4 \\(.+\\)",
        ].join("\n") + "$"));
      });
    });

    describe("text", () => {
      it("prints text with links and email addresses highlighted", () => {
        const val = "Nyancat <nyancat@example.com> (https://example.com/nyancat)";
        const msg = formatter.fields.text(val);
        expect(strip(msg)).toBe(val);
      });
    });

    describe("version", () => {
      it("prints version", () => {
        const val = "3.1.4";
        const msg = formatter.fields.version(val, undefined);
        expect(strip(msg)).toBe("3.1.4");
      });

      it("prints version with published date if times is given", () => {
        const val = "3.1.4";
        const times = {
          "3.1.0": "2000-01-01T00:00:00.000Z",
          "3.1.4": "2006-01-02T03:04:05.000Z",
        };
        const msg = formatter.fields.version(val, times);
        expect(strip(msg)).toMatch(/^3\.1\.4 \(.+\)$/);
      });
    });
  });
});
