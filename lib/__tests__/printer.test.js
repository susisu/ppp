"use strict";

const strip = require("strip-ansi");

const printer = require("../printer");

describe("printer", () => {
  describe("print", () => {
    const opts = {
      wrapSize: null,
      indentSize: 2,
    };
    const reqs = {
      installedVersions(_name) {
        return Promise.resolve({
          local: "3.1.4",
          global: null,
        });
      },
    };

    describe("author", () => {
      it("can print package author", async () => {
        {
          const pkg = {
            author: "Nyancat <nyancat@example.com>",
          };
          const text = await printer.print(pkg, ["author"], opts, reqs);
          expect(strip(text)).toBe("Author : Nyancat <nyancat@example.com>");
        }
        {
          const pkg = {
            author: {
              name: "Nyancat",
              email: "nyancat@example.com",
              url: "https://example.com/nyancat",
            },
          };
          const text = await printer.print(pkg, ["author"], opts, reqs);
          expect(strip(text)).toBe(
            "Author : Nyancat <nyancat@example.com> (https://example.com/nyancat)"
          );
        }
      });

      it("skips if the field does not exist or is invalid", async () => {
        const pkg = {};
        const text = await printer.print(pkg, ["author"], opts, reqs);
        expect(strip(text)).toBe("");
      });
    });

    describe("binaries", () => {
      it("can print list of binaries", async () => {
        {
          const pkg = {
            bin: {
              foo: "./bin/foo",
              bar: "./bin/bar",
            },
          };
          const text = await printer.print(pkg, ["binaries"], opts, reqs);
          expect(strip(text)).toBe("Binaries : bar, foo");
        }
        {
          const pkg = {
            name: "my-awesome-package",
            bin: "./bin/cli",
          };
          const text = await printer.print(pkg, ["binaries"], opts, reqs);
          expect(strip(text)).toBe("Binaries : my-awesome-package");
        }
        {
          const pkg = {
            name: "@susisu/ppp",
            bin: "./bin/ppp",
          };
          const text = await printer.print(pkg, ["binaries"], opts, reqs);
          expect(strip(text)).toBe("Binaries : ppp");
        }
      });

      it("skips if the field does not exist or is invalid", async () => {
        {
          const pkg = {};
          const text = await printer.print(pkg, ["binaries"], opts, reqs);
          expect(strip(text)).toBe("");
        }
        {
          const pkg = {
            bin: "./bin/cli",
          };
          const text = await printer.print(pkg, ["binaries"], opts, reqs);
          expect(strip(text)).toBe("");
        }
      });
    });

    describe("cpu", () => {
      it("can print list of supported cpu architectures", async () => {
        const pkg = {
          cpu: ["x64", "!arm"],
        };
        const text = await printer.print(pkg, ["cpu"], opts, reqs);
        expect(strip(text)).toBe("CPU : x64, !arm");
      });

      it("skips if the field does not exist or is invalid", async () => {
        const pkg = {};
        const text = await printer.print(pkg, ["cpu"], opts, reqs);
        expect(strip(text)).toBe("");
      });
    });

    describe("dependencies", () => {
      it("can print list of dependencies", async () => {
        const pkg = {
          dependencies: {
            foo: "^1.0.0",
            bar: "~2.0.0",
          },
        };
        const text = await printer.print(pkg, ["dependencies"], opts, reqs);
        expect(strip(text)).toBe("Dependencies : bar@~2.0.0, foo@^1.0.0");
      });

      it("skips if the field does not exist or is invalid", async () => {
        const pkg = {};
        const text = await printer.print(pkg, ["dependencies"], opts, reqs);
        expect(strip(text)).toBe("");
      });
    });

    describe("description", () => {
      it("can print package description", async () => {
        const pkg = {
          description: "This is a test",
        };
        const text = await printer.print(pkg, ["description"], opts, reqs);
        expect(strip(text)).toBe("Description : This is a test");
      });

      it("skips if the field does not exist or is invalid", async () => {
        const pkg = {};
        const text = await printer.print(pkg, ["description"], opts, reqs);
        expect(strip(text)).toBe("");
      });
    });

    describe("devDependencies", () => {
      it("can print list of dev dependencies", async () => {
        const pkg = {
          devDependencies: {
            foo: "^1.0.0",
            bar: "~2.0.0",
          },
        };
        const text = await printer.print(pkg, ["devDependencies"], opts, reqs);
        expect(strip(text)).toBe("Dev Dependencies : bar@~2.0.0, foo@^1.0.0");
      });

      it("skips if the field does not exist or is invalid", async () => {
        const pkg = {};
        const text = await printer.print(pkg, ["devDependencies"], opts, reqs);
        expect(strip(text)).toBe("");
      });
    });

    describe("engines", () => {
      it("can print list of required engines", async () => {
        const pkg = {
          engines: {
            node: ">=8.0.0",
            npm: ">=5.0.0",
          },
        };
        const text = await printer.print(pkg, ["engines"], opts, reqs);
        expect(strip(text)).toBe("Engines : node@>=8.0.0, npm@>=5.0.0");
      });

      it("skips if the field does not exist or is invalid", async () => {
        const pkg = {};
        const text = await printer.print(pkg, ["engines"], opts, reqs);
        expect(strip(text)).toBe("");
      });
    });

    describe("homepage", () => {
      it("can print package homepage", async () => {
        const pkg = {
          homepage: "https://example.com/nyancat",
        };
        const text = await printer.print(pkg, ["homepage"], opts, reqs);
        expect(strip(text)).toBe("Homepage : https://example.com/nyancat");
      });

      it("skips if the field does not exist or is invalid", async () => {
        const pkg = {};
        const text = await printer.print(pkg, ["homepage"], opts, reqs);
        expect(strip(text)).toBe("");
      });
    });

    describe("installed", () => {
      it("can print installed versions", async () => {
        const pkg = {
          name: "@susisu/ppp",
        };
        const text = await printer.print(pkg, ["installed"], opts, reqs);
        expect(strip(text)).toBe("Installed : local: 3.1.4, global: (not installed)");
      });

      it("skips if the package name does not exist or is invalid", async () => {
        const pkg = {};
        const text = await printer.print(pkg, ["installed"], opts, reqs);
        expect(strip(text)).toBe("");
      });
    });

    describe("keywords", () => {
      it("can print list of keywords", async () => {
        const pkg = {
          keywords: ["test", "evaluation"],
        };
        const text = await printer.print(pkg, ["keywords"], opts, reqs);
        expect(strip(text)).toBe("Keywords : test, evaluation");
      });

      it("skips if the field does not exist or is invalid", async () => {
        const pkg = {};
        const text = await printer.print(pkg, ["keywords"], opts, reqs);
        expect(strip(text)).toBe("");
      });
    });

    describe("license", () => {
      it("can print license of the package", async () => {
        const pkg = {
          license: "MIT",
        };
        const text = await printer.print(pkg, ["license"], opts, reqs);
        expect(strip(text)).toBe("License : MIT");
      });

      it("skips if the field does not exist or is invalid", async () => {
        const pkg = {};
        const text = await printer.print(pkg, ["license"], opts, reqs);
        expect(strip(text)).toBe("");
      });
    });

    describe("maintainers", () => {
      it("can print list of maintainers", async () => {
        const pkg = {
          maintainers: [
            "Foo <foo@example.com>",
            {
              name: "Bar",
            },
            {
              name: "Baz",
              email: "baz@example.com",
              url: "https://example.com/baz",
            },
            {
              email: "nyancat@example.com",
              url: "https://example.com/nyancat",
            },
          ],
        };
        const text = await printer.print(pkg, ["maintainers"], opts, reqs);
        expect(strip(text)).toBe(
          /* eslint-disable prettier/prettier */
          [
            "Maintainers :",
            "  Foo <foo@example.com>",
            "  Bar",
            "  Baz <baz@example.com> (https://example.com/baz)",
          ].join("\n")
          /* eslint-enable prettier/prettier */
        );
      });

      it("skips if the field does not exist or is invalid", async () => {
        const pkg = {};
        const text = await printer.print(pkg, ["maintainers"], opts, reqs);
        expect(strip(text)).toBe("");
      });
    });

    describe("module", () => {
      it("can print whether the package provides ES2016 module or not", async () => {
        {
          const pkg = {
            module: "./dist/index.mjs",
          };
          const text = await printer.print(pkg, ["module"], opts, reqs);
          expect(strip(text)).toBe("Module : Yes");
        }
        {
          const pkg = {};
          const text = await printer.print(pkg, ["module"], opts, reqs);
          expect(strip(text)).toBe("Module : No");
        }
      });
    });

    describe("name", () => {
      it("can print package name", async () => {
        const pkg = {
          name: "@susisu/ppp",
        };
        const text = await printer.print(pkg, ["name"], opts, reqs);
        expect(strip(text)).toBe("Name : @susisu/ppp");
      });

      it("skips if the field does not exist or is invalid", async () => {
        const pkg = {};
        const text = await printer.print(pkg, ["name"], opts, reqs);
        expect(strip(text)).toBe("");
      });
    });

    describe("npm", () => {
      it("can print package URL on npm", async () => {
        const pkg = {
          name: "@susisu/ppp",
        };
        const text = await printer.print(pkg, ["npm"], opts, reqs);
        expect(strip(text)).toBe("NPM : https://www.npmjs.com/package/@susisu/ppp");
      });

      it("skips if the field does not exist or is invalid", async () => {
        const pkg = {};
        const text = await printer.print(pkg, ["npm"], opts, reqs);
        expect(strip(text)).toBe("");
      });
    });

    describe("optionalDependencies", () => {
      it("can print list of optional dependencies", async () => {
        const pkg = {
          optionalDependencies: {
            foo: "^1.0.0",
            bar: "~2.0.0",
          },
        };
        const text = await printer.print(pkg, ["optionalDependencies"], opts, reqs);
        expect(strip(text)).toBe("Optional Dependencies : bar@~2.0.0, foo@^1.0.0");
      });

      it("skips if the field does not exist or is invalid", async () => {
        const pkg = {};
        const text = await printer.print(pkg, ["optionalDependencies"], opts, reqs);
        expect(strip(text)).toBe("");
      });
    });

    describe("os", () => {
      it("can print list of supported operating systems", async () => {
        const pkg = {
          os: ["linux", "!win32"],
        };
        const text = await printer.print(pkg, ["os"], opts, reqs);
        expect(strip(text)).toBe("OS : linux, !win32");
      });

      it("skips if the field does not exist or is invalid", async () => {
        const pkg = {};
        const text = await printer.print(pkg, ["os"], opts, reqs);
        expect(strip(text)).toBe("");
      });
    });

    describe("peerDependencies", () => {
      it("can print list of peer dependencies", async () => {
        const pkg = {
          peerDependencies: {
            foo: "^1.0.0",
            bar: "~2.0.0",
          },
        };
        const text = await printer.print(pkg, ["peerDependencies"], opts, reqs);
        expect(strip(text)).toBe("Peer Dependencies : bar@~2.0.0, foo@^1.0.0");
      });

      it("skips if the field does not exist or is invalid", async () => {
        const pkg = {};
        const text = await printer.print(pkg, ["peerDependencies"], opts, reqs);
        expect(strip(text)).toBe("");
      });
    });

    describe("repository", () => {
      it("can print package repository", async () => {
        {
          const pkg = {
            repository: {
              type: "git",
              url: "git+https://github.com/susisu/ppp.git",
            },
          };
          const text = await printer.print(pkg, ["repository"], opts, reqs);
          expect(strip(text)).toBe("Repository : git+https://github.com/susisu/ppp.git");
        }
        {
          const pkg = {
            repository: "https://github.com/susisu/ppp.git",
          };
          const text = await printer.print(pkg, ["repository"], opts, reqs);
          expect(strip(text)).toBe("Repository : https://github.com/susisu/ppp.git");
        }
      });

      it("skips if the field does not exist or is invalid", async () => {
        const pkg = {};
        const text = await printer.print(pkg, ["repository"], opts, reqs);
        expect(strip(text)).toBe("");
      });
    });

    describe("shasum", () => {
      it("can print SHA checksum of the package", async () => {
        const pkg = {
          dist: {
            shasum: "36926c675b6c138dd155f453f043e8b9cb365886",
          },
        };
        const text = await printer.print(pkg, ["shasum"], opts, reqs);
        expect(strip(text)).toBe("SHA Checksum : 36926c675b6c138dd155f453f043e8b9cb365886");
      });

      it("skips if the field does not exist or is invalid", async () => {
        {
          const pkg = {};
          const text = await printer.print(pkg, ["shasum"], opts, reqs);
          expect(strip(text)).toBe("");
        }
        {
          const pkg = {
            dist: {},
          };
          const text = await printer.print(pkg, ["shasum"], opts, reqs);
          expect(strip(text)).toBe("");
        }
      });
    });

    describe("tags", () => {
      it("can print list of tags", async () => {
        {
          const pkg = {
            "dist-tags": {
              latest: "3.1.4",
              next: "4.0.0",
            },
          };
          const text = await printer.print(pkg, ["tags"], opts, reqs);
          expect(strip(text)).toBe(
            /* eslint-disable prettier/prettier */
            [
              "Tags :",
              "  latest : 3.1.4",
              "  next   : 4.0.0",
            ].join("\n")
            /* eslint-enable prettier/prettier */
          );
        }
        {
          const pkg = {
            "dist-tags": {
              latest: "3.1.4",
              next: "4.0.0",
            },
            "time": {
              "3.1.4": "2000-01-01T00:00:00.000Z",
              "4.0.0": "2006-01-02T03:04:05.000Z",
            },
          };
          const text = await printer.print(pkg, ["tags"], opts, reqs);
          expect(strip(text)).toMatch(
            new RegExp(
              /* eslint-disable prettier/prettier */
              "^" + [
                "Tags :",
                "  latest : 3\\.1\\.4 \\(.+\\)",
                "  next   : 4\\.0\\.0 \\(.+\\)",
              ].join("\n") + "$"
              /* eslint-enable prettier/prettier */
            )
          );
        }
      });

      it("skips if the field does not exist or is invalid", async () => {
        const pkg = {};
        const text = await printer.print(pkg, ["tags"], opts, reqs);
        expect(strip(text)).toBe("");
      });
    });

    describe("tarball", () => {
      it("can print URL of the package tarball", async () => {
        const pkg = {
          dist: {
            tarball: "https://example.com/nyancat.tgz",
          },
        };
        const text = await printer.print(pkg, ["tarball"], opts, reqs);
        expect(strip(text)).toBe("Tarball : https://example.com/nyancat.tgz");
      });

      it("skips if the field does not exist or is invalid", async () => {
        {
          const pkg = {};
          const text = await printer.print(pkg, ["tarball"], opts, reqs);
          expect(strip(text)).toBe("");
        }
        {
          const pkg = {
            dist: {},
          };
          const text = await printer.print(pkg, ["tarball"], opts, reqs);
          expect(strip(text)).toBe("");
        }
      });
    });

    describe("types", () => {
      it("can print whether the package provides type definitions for TypeScript", async () => {
        {
          const pkg = {
            types: "./dist/index.d.ts",
          };
          const text = await printer.print(pkg, ["types"], opts, reqs);
          expect(strip(text)).toBe("Types : Yes");
        }
        {
          const pkg = {
            typings: "./dist/index.d.ts",
          };
          const text = await printer.print(pkg, ["types"], opts, reqs);
          expect(strip(text)).toBe("Types : Yes");
        }
        {
          const pkg = {};
          const text = await printer.print(pkg, ["types"], opts, reqs);
          expect(strip(text)).toBe("Types : No");
        }
      });
    });

    describe("version", () => {
      it("can print package version", async () => {
        {
          const pkg = {
            version: "3.1.4",
          };
          const text = await printer.print(pkg, ["version"], opts, reqs);
          expect(strip(text)).toBe("Version : 3.1.4");
        }
        {
          const pkg = {
            version: "3.1.4",
            time: {
              "3.1.4": "2006-01-02T03:04:05.000Z",
            },
          };
          const text = await printer.print(pkg, ["version"], opts, reqs);
          expect(strip(text)).toMatch(/^Version : 3\.1\.4 \(.+\)$/);
        }
      });

      it("skips if the field does not exist or is invalid", async () => {
        const pkg = {};
        const text = await printer.print(pkg, ["version"], opts, reqs);
        expect(strip(text)).toBe("");
      });
    });

    it("can print multiple fields", async () => {
      const pkg = {
        name: "@susisu/ppp",
        description: "package.json pretty printer",
      };
      const text = await printer.print(pkg, ["name", "description"], opts, reqs);
      expect(strip(text)).toBe(
        /* eslint-disable prettier/prettier */
        [
          "Name        : @susisu/ppp",
          "Description : package.json pretty printer",
        ].join("\n")
        /* eslint-enable prettier/prettier */
      );
    });

    it("throws error if unknown field is specified", async () => {
      const pkg = {};
      const promise = printer.print(pkg, ["unknown"], opts, reqs);
      await expect(promise).rejects.toThrow();
    });
  });
});
