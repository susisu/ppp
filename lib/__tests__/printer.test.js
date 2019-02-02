"use strict";

const strip = require("strip-ansi");

const printer = require("../printer");

describe("printer", () => {
  describe("print", () => {
    describe("author", () => {
      it("can print package author", () => {
        {
          const pkg = {
            "author": "Nyancat <nyancat@example.com>",
          };
          const text = printer.print(pkg, ["author"], null, 2);
          expect(strip(text)).toBe([
            "Author : Nyancat <nyancat@example.com>",
          ].join("\n"));
        }
        {
          const pkg = {
            "author": {
              "name" : "Nyancat",
              "email": "nyancat@example.com",
              "url"  : "https://example.com/nyancat",
            },
          };
          const text = printer.print(pkg, ["author"], null, 2);
          expect(strip(text)).toBe([
            "Author : Nyancat <nyancat@example.com> (https://example.com/nyancat)",
          ].join("\n"));
        }
      });

      it("skips if the field does not exist or is invalid", () => {
        const pkg = {};
        const text = printer.print(pkg, ["author"], null, 2);
        expect(strip(text)).toBe("");
      });
    });

    describe("binaries", () => {
      it("can print list of binaries", () => {
        {
          const pkg = {
            "bin": {
              "foo": "./bin/foo",
              "bar": "./bin/bar",
            },
          };
          const text = printer.print(pkg, ["binaries"], null, 2);
          expect(strip(text)).toBe([
            "Binaries : bar, foo",
          ].join("\n"));
        }
        {
          const pkg = {
            "name": "my-awesome-package",
            "bin" : "./bin/cli",
          };
          const text = printer.print(pkg, ["binaries"], null, 2);
          expect(strip(text)).toBe([
            "Binaries : my-awesome-package",
          ].join("\n"));
        }
        {
          const pkg = {
            "name": "@susisu/ppp",
            "bin" : "./bin/ppp",
          };
          const text = printer.print(pkg, ["binaries"], null, 2);
          expect(strip(text)).toBe([
            "Binaries : ppp",
          ].join("\n"));
        }
      });

      it("skips if the field does not exist or is invalid", () => {
        {
          const pkg = {};
          const text = printer.print(pkg, ["binaries"], null, 2);
          expect(strip(text)).toBe("");
        }
        {
          const pkg = {
            "bin": "./bin/cli",
          };
          const text = printer.print(pkg, ["binaries"], null, 2);
          expect(strip(text)).toBe("");
        }
      });
    });

    describe("dependencies", () => {
      it("can print list of dependencies", () => {
        const pkg = {
          "dependencies": {
            "foo": "^1.0.0",
            "bar": "~2.0.0",
          },
        };
        const text = printer.print(pkg, ["dependencies"], null, 2);
        expect(strip(text)).toBe([
          "Dependencies : bar@~2.0.0, foo@^1.0.0",
        ].join("\n"));
      });

      it("skips if the field does not exist or is invalid", () => {
        const pkg = {};
        const text = printer.print(pkg, ["dependencies"], null, 2);
        expect(strip(text)).toBe("");
      });
    });

    describe("description", () => {
      it("can print package description", () => {
        const pkg = {
          "description": "This is a test",
        };
        const text = printer.print(pkg, ["description"], null, 2);
        expect(strip(text)).toBe([
          "Description : This is a test",
        ].join("\n"));
      });

      it("skips if the field does not exist or is invalid", () => {
        const pkg = {};
        const text = printer.print(pkg, ["description"], null, 2);
        expect(strip(text)).toBe("");
      });
    });

    describe("devDependencies", () => {
      it("can print list of dev dependencies", () => {
        const pkg = {
          "devDependencies": {
            "foo": "^1.0.0",
            "bar": "~2.0.0",
          },
        };
        const text = printer.print(pkg, ["devDependencies"], null, 2);
        expect(strip(text)).toBe([
          "Dev Dependencies : bar@~2.0.0, foo@^1.0.0",
        ].join("\n"));
      });

      it("skips if the field does not exist or is invalid", () => {
        const pkg = {};
        const text = printer.print(pkg, ["devDependencies"], null, 2);
        expect(strip(text)).toBe("");
      });
    });

    describe("engines", () => {
      it("can print list of required engines", () => {
        const pkg = {
          "engines": {
            "node": ">=8.0.0",
            "npm" : ">=5.0.0",
          },
        };
        const text = printer.print(pkg, ["engines"], null, 2);
        expect(strip(text)).toBe([
          "Engines : node@>=8.0.0, npm@>=5.0.0",
        ].join("\n"));
      });

      it("skips if the field does not exist or is invalid", () => {
        const pkg = {};
        const text = printer.print(pkg, ["engines"], null, 2);
        expect(strip(text)).toBe("");
      });
    });

    describe("homepage", () => {
      it("can print package homepage", () => {
        const pkg = {
          "homepage": "https://example.com/nyancat",
        };
        const text = printer.print(pkg, ["homepage"], null, 2);
        expect(strip(text)).toBe([
          "Homepage : https://example.com/nyancat",
        ].join("\n"));
      });

      it("skips if the field does not exist or is invalid", () => {
        const pkg = {};
        const text = printer.print(pkg, ["homepage"], null, 2);
        expect(strip(text)).toBe("");
      });
    });

    describe("keywords", () => {
      it("can print list of keywords", () => {
        const pkg = {
          "keywords": ["test", "evaluation"],
        };
        const text = printer.print(pkg, ["keywords"], null, 2);
        expect(strip(text)).toBe([
          "Keywords : test, evaluation",
        ].join("\n"));
      });

      it("skips if the field does not exist or is invalid", () => {
        const pkg = {};
        const text = printer.print(pkg, ["keywords"], null, 2);
        expect(strip(text)).toBe("");
      });
    });

    describe("license", () => {
      it("can print license of the package", () => {
        const pkg = {
          "license": "MIT",
        };
        const text = printer.print(pkg, ["license"], null, 2);
        expect(strip(text)).toBe([
          "License : MIT",
        ].join("\n"));
      });

      it("skips if the field does not exist or is invalid", () => {
        const pkg = {};
        const text = printer.print(pkg, ["license"], null, 2);
        expect(strip(text)).toBe("");
      });
    });

    describe("maintainers", () => {
      it("can print list of maintainers", () => {
        const pkg = {
          "maintainers": [
            "Foo <foo@example.com>",
            {
              "name": "Bar",
            },
            {
              "name" : "Baz",
              "email": "baz@example.com",
              "url"  : "https://example.com/baz",
            },
            {
              "email": "nyancat@example.com",
              "url"  : "https://example.com/nyancat",
            },
          ],
        };
        const text = printer.print(pkg, ["maintainers"], null, 2);
        expect(strip(text)).toBe([
          "Maintainers :",
          "  Foo <foo@example.com>",
          "  Bar",
          "  Baz <baz@example.com> (https://example.com/baz)",
        ].join("\n"));
      });

      it("skips if the field does not exist or is invalid", () => {
        const pkg = {};
        const text = printer.print(pkg, ["maintainers"], null, 2);
        expect(strip(text)).toBe("");
      });
    });

    describe("module", () => {
      it("can print whether the package provides ES2016 module or not", () => {
        {
          const pkg = {
            "module": "./dist/index.mjs",
          };
          const text = printer.print(pkg, ["module"], null, 2);
          expect(strip(text)).toBe([
            "Module : Yes",
          ].join("\n"));
        }
        {
          const pkg = {};
          const text = printer.print(pkg, ["module"], null, 2);
          expect(strip(text)).toBe([
            "Module : No",
          ].join("\n"));
        }
      });
    });

    describe("name", () => {
      it("can print package name", () => {
        const pkg = {
          "name": "@susisu/ppp",
        };
        const text = printer.print(pkg, ["name"], null, 2);
        expect(strip(text)).toBe([
          "Name : @susisu/ppp",
        ].join("\n"));
      });

      it("skips if the field does not exist or is invalid", () => {
        const pkg = {};
        const text = printer.print(pkg, ["name"], null, 2);
        expect(strip(text)).toBe("");
      });
    });

    describe("npm", () => {
      it("can print package URL on npm", () => {
        const pkg = {
          "name": "@susisu/ppp",
        };
        const text = printer.print(pkg, ["npm"], null, 2);
        expect(strip(text)).toBe([
          "NPM : https://www.npmjs.com/package/@susisu/ppp",
        ].join("\n"));
      });

      it("skips if the field does not exist or is invalid", () => {
        const pkg = {};
        const text = printer.print(pkg, ["npm"], null, 2);
        expect(strip(text)).toBe("");
      });
    });

    describe("optionalDependencies", () => {
      it("can print list of optional dependencies", () => {
        const pkg = {
          "optionalDependencies": {
            "foo": "^1.0.0",
            "bar": "~2.0.0",
          },
        };
        const text = printer.print(pkg, ["optionalDependencies"], null, 2);
        expect(strip(text)).toBe([
          "Optional Dependencies : bar@~2.0.0, foo@^1.0.0",
        ].join("\n"));
      });

      it("skips if the field does not exist or is invalid", () => {
        const pkg = {};
        const text = printer.print(pkg, ["optionalDependencies"], null, 2);
        expect(strip(text)).toBe("");
      });
    });

    describe("peerDependencies", () => {
      it("can print list of peer dependencies", () => {
        const pkg = {
          "peerDependencies": {
            "foo": "^1.0.0",
            "bar": "~2.0.0",
          },
        };
        const text = printer.print(pkg, ["peerDependencies"], null, 2);
        expect(strip(text)).toBe([
          "Peer Dependencies : bar@~2.0.0, foo@^1.0.0",
        ].join("\n"));
      });

      it("skips if the field does not exist or is invalid", () => {
        const pkg = {};
        const text = printer.print(pkg, ["peerDependencies"], null, 2);
        expect(strip(text)).toBe("");
      });
    });

    describe("repository", () => {
      it("can print package repository", () => {
        {
          const pkg = {
            "repository": {
              "type": "git",
              "url" : "git+https://github.com/susisu/ppp.git",
            },
          };
          const text = printer.print(pkg, ["repository"], null, 2);
          expect(strip(text)).toBe([
            "Repository : git+https://github.com/susisu/ppp.git",
          ].join("\n"));
        }
        {
          const pkg = {
            "repository": "https://github.com/susisu/ppp.git",
          };
          const text = printer.print(pkg, ["repository"], null, 2);
          expect(strip(text)).toBe([
            "Repository : https://github.com/susisu/ppp.git",
          ].join("\n"));
        }
      });

      it("skips if the field does not exist or is invalid", () => {
        const pkg = {};
        const text = printer.print(pkg, ["repository"], null, 2);
        expect(strip(text)).toBe("");
      });
    });

    describe("shasum", () => {
      it("can print SHA checksum of the package", () => {
        const pkg = {
          "dist": {
            "shasum": "36926c675b6c138dd155f453f043e8b9cb365886",
          },
        };
        const text = printer.print(pkg, ["shasum"], null, 2);
        expect(strip(text)).toBe([
          "SHA Checksum : 36926c675b6c138dd155f453f043e8b9cb365886",
        ].join("\n"));
      });

      it("skips if the field does not exist or is invalid", () => {
        {
          const pkg = {};
          const text = printer.print(pkg, ["shasum"], null, 2);
          expect(strip(text)).toBe("");
        }
        {
          const pkg = {
            "dist": {},
          };
          const text = printer.print(pkg, ["shasum"], null, 2);
          expect(strip(text)).toBe("");
        }
      });
    });

    describe("tags", () => {
      it("can print list of tags", () => {
        {
          const pkg = {
            "dist-tags": {
              "latest": "3.1.4",
              "next"  : "4.0.0",
            },
          };
          const text = printer.print(pkg, ["tags"], null, 2);
          expect(strip(text)).toBe([
            "Tags :",
            "  latest : 3.1.4",
            "  next   : 4.0.0",
          ].join("\n"));
        }
        {
          const pkg = {
            "dist-tags": {
              "latest": "3.1.4",
              "next"  : "4.0.0",
            },
            "time": {
              "3.1.4": "2000-01-01T00:00:00.000Z",
              "4.0.0": "2006-01-02T03:04:05.000Z",
            },
          };
          const text = printer.print(pkg, ["tags"], null, 2);
          expect(strip(text)).toMatch(new RegExp("^" + [
            "Tags :",
            "  latest : 3\\.1\\.4 \\(.+\\)",
            "  next   : 4\\.0\\.0 \\(.+\\)",
          ].join("\n") + "$"));
        }
      });

      it("skips if the field does not exist or is invalid", () => {
        const pkg = {};
        const text = printer.print(pkg, ["tags"], null, 2);
        expect(strip(text)).toBe("");
      });
    });

    describe("tarball", () => {
      it("can print URL of the package tarball", () => {
        const pkg = {
          "dist": {
            "tarball": "https://example.com/nyancat.tgz",
          },
        };
        const text = printer.print(pkg, ["tarball"], null, 2);
        expect(strip(text)).toBe([
          "Tarball : https://example.com/nyancat.tgz",
        ].join("\n"));
      });

      it("skips if the field does not exist or is invalid", () => {
        {
          const pkg = {};
          const text = printer.print(pkg, ["tarball"], null, 2);
          expect(strip(text)).toBe("");
        }
        {
          const pkg = {
            "dist": {},
          };
          const text = printer.print(pkg, ["tarball"], null, 2);
          expect(strip(text)).toBe("");
        }
      });
    });

    describe("types", () => {
      it("can print whether the package provides type definitions for TypeScript", () => {
        {
          const pkg = {
            "types": "./dist/index.d.ts",
          };
          const text = printer.print(pkg, ["types"], null, 2);
          expect(strip(text)).toBe([
            "Types : Yes",
          ].join("\n"));
        }
        {
          const pkg = {
            "typings": "./dist/index.d.ts",
          };
          const text = printer.print(pkg, ["types"], null, 2);
          expect(strip(text)).toBe([
            "Types : Yes",
          ].join("\n"));
        }
        {
          const pkg = {};
          const text = printer.print(pkg, ["types"], null, 2);
          expect(strip(text)).toBe([
            "Types : No",
          ].join("\n"));
        }
      });
    });

    describe("version", () => {
      it("can print package version", () => {
        {
          const pkg = {
            "version": "3.1.4",
          };
          const text = printer.print(pkg, ["version"], null, 2);
          expect(strip(text)).toBe([
            "Version : 3.1.4",
          ].join("\n"));
        }
        {
          const pkg = {
            "version": "3.1.4",
            "time"   : {
              "3.1.4": "2006-01-02T03:04:05.000Z",
            },
          };
          const text = printer.print(pkg, ["version"], null, 2);
          expect(strip(text)).toMatch(new RegExp("^" + [
            "Version : 3\\.1\\.4 \\(.+\\)",
          ].join("\n") + "$"));
        }
      });

      it("skips if the field does not exist or is invalid", () => {
        const pkg = {};
        const text = printer.print(pkg, ["version"], null, 2);
        expect(strip(text)).toBe("");
      });
    });

    it("can print multiple fields", () => {
      const pkg = {
        "name"       : "@susisu/ppp",
        "description": "package.json pretty printer",
      };
      const text = printer.print(pkg, ["name", "description"], null, 2);
      expect(strip(text)).toBe([
        "Name        : @susisu/ppp",
        "Description : package.json pretty printer",
      ].join("\n"));
    });

    it("throws error if unknown field is specified", () => {
      const pkg = {};
      expect(() => {
        printer.print(pkg, ["unknown"], null, 2);
      }).toThrow();
    });
  });
});
