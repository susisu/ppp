import { jest } from "@jest/globals";
import strip from "strip-ansi";

import { print } from "./printer.js";

describe("print", () => {
  const opts = {
    wrapSize: null,
    indentSize: 2,
  };

  describe("author", () => {
    it("prints the package author", async () => {
      {
        const pkg = {
          author: "Nyancat <nyancat@example.com>",
        };
        const text = await print(pkg, ["author"], opts, {});
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
        const text = await print(pkg, ["author"], opts, {});
        expect(strip(text)).toBe(
          "Author : Nyancat <nyancat@example.com> (https://example.com/nyancat)"
        );
      }
    });

    it("skips if the field does not exist or is invalid", async () => {
      const pkg = {};
      const text = await print(pkg, ["author"], opts, {});
      expect(strip(text)).toBe("");
    });
  });

  describe("binaries", () => {
    it("prints the list of the binaries", async () => {
      {
        const pkg = {
          bin: {
            foo: "./bin/foo",
            bar: "./bin/bar",
          },
        };
        const text = await print(pkg, ["binaries"], opts, {});
        expect(strip(text)).toBe("Binaries : bar, foo");
      }
      {
        const pkg = {
          name: "my-awesome-package",
          bin: "./bin/cli",
        };
        const text = await print(pkg, ["binaries"], opts, {});
        expect(strip(text)).toBe("Binaries : my-awesome-package");
      }
      {
        const pkg = {
          name: "@susisu/ppp",
          bin: "./bin/ppp",
        };
        const text = await print(pkg, ["binaries"], opts, {});
        expect(strip(text)).toBe("Binaries : ppp");
      }
    });

    it("skips if the field does not exist or is invalid", async () => {
      {
        const pkg = {};
        const text = await print(pkg, ["binaries"], opts, {});
        expect(strip(text)).toBe("");
      }
      {
        const pkg = {
          bin: "./bin/cli",
        };
        const text = await print(pkg, ["binaries"], opts, {});
        expect(strip(text)).toBe("");
      }
    });
  });

  describe("cpu", () => {
    it("prints the list of the supported cpu architectures", async () => {
      const pkg = {
        cpu: ["x64", "!arm"],
      };
      const text = await print(pkg, ["cpu"], opts, {});
      expect(strip(text)).toBe("CPU : x64, !arm");
    });

    it("skips if the field does not exist or is invalid", async () => {
      const pkg = {};
      const text = await print(pkg, ["cpu"], opts, {});
      expect(strip(text)).toBe("");
    });
  });

  describe("dependencies", () => {
    it("prints the list of the dependencies", async () => {
      const pkg = {
        dependencies: {
          foo: "^1.0.0",
          bar: "~2.0.0",
        },
      };
      const text = await print(pkg, ["dependencies"], opts, {});
      expect(strip(text)).toBe("Dependencies : bar@~2.0.0, foo@^1.0.0");
    });

    it("skips if the field does not exist or is invalid", async () => {
      const pkg = {};
      const text = await print(pkg, ["dependencies"], opts, {});
      expect(strip(text)).toBe("");
    });
  });

  describe("description", () => {
    it("prints the package description", async () => {
      const pkg = {
        description: "This is a test",
      };
      const text = await print(pkg, ["description"], opts, {});
      expect(strip(text)).toBe("Description : This is a test");
    });

    it("skips if the field does not exist or is invalid", async () => {
      const pkg = {};
      const text = await print(pkg, ["description"], opts, {});
      expect(strip(text)).toBe("");
    });
  });

  describe("devDependencies", () => {
    it("prints the list of the dev dependencies", async () => {
      const pkg = {
        devDependencies: {
          foo: "^1.0.0",
          bar: "~2.0.0",
        },
      };
      const text = await print(pkg, ["devDependencies"], opts, {});
      expect(strip(text)).toBe("Dev Dependencies : bar@~2.0.0, foo@^1.0.0");
    });

    it("skips if the field does not exist or is invalid", async () => {
      const pkg = {};
      const text = await print(pkg, ["devDependencies"], opts, {});
      expect(strip(text)).toBe("");
    });
  });

  describe("engines", () => {
    it("prints the list of the required engines", async () => {
      const pkg = {
        engines: {
          node: ">=8.0.0",
          npm: ">=5.0.0",
        },
      };
      const text = await print(pkg, ["engines"], opts, {});
      expect(strip(text)).toBe("Engines : node@>=8.0.0, npm@>=5.0.0");
    });

    it("skips if the field does not exist or is invalid", async () => {
      const pkg = {};
      const text = await print(pkg, ["engines"], opts, {});
      expect(strip(text)).toBe("");
    });
  });

  describe("homepage", () => {
    it("prints the package homepage", async () => {
      const pkg = {
        homepage: "https://example.com/nyancat",
      };
      const text = await print(pkg, ["homepage"], opts, {});
      expect(strip(text)).toBe("Homepage : https://example.com/nyancat");
    });

    it("skips if the field does not exist or is invalid", async () => {
      const pkg = {};
      const text = await print(pkg, ["homepage"], opts, {});
      expect(strip(text)).toBe("");
    });
  });

  describe("installed", () => {
    it("prints the installed versions", async () => {
      const pkg = {
        name: "@susisu/ppp",
      };
      const ls = jest.fn((name, global) =>
        Promise.resolve(global ? {} : { dependencies: { [name]: { version: "3.1.4" } } })
      );
      const text = await print(pkg, ["installed"], opts, { ls });
      expect(ls).toHaveBeenCalledWith("@susisu/ppp", false);
      expect(ls).toHaveBeenCalledWith("@susisu/ppp", true);
      expect(strip(text)).toBe("Installed : local: 3.1.4, global: (not installed)");
    });

    it("treats as not installed if the dependency version is invalid", async () => {
      const pkg = {
        name: "@susisu/ppp",
      };
      const ls = name => Promise.resolve({ dependencies: { [name]: { version: null } } });
      const text = await print(pkg, ["installed"], opts, { ls });
      expect(strip(text)).toBe("Installed : local: (not installed), global: (not installed)");
    });

    it("treats as not installed if failed to 'npm ls'", async () => {
      const pkg = {
        name: "@susisu/ppp",
      };
      const ls = () => Promise.reject(new Error("failed"));
      const text = await print(pkg, ["installed"], opts, { ls });
      expect(strip(text)).toBe("Installed : local: (not installed), global: (not installed)");
    });

    it("skips if the package name does not exist or is invalid", async () => {
      const pkg = {};
      const text = await print(pkg, ["installed"], opts, {});
      expect(strip(text)).toBe("");
    });
  });

  describe("keywords", () => {
    it("prints the list of the keywords", async () => {
      const pkg = {
        keywords: ["test", "evaluation"],
      };
      const text = await print(pkg, ["keywords"], opts, {});
      expect(strip(text)).toBe("Keywords : test, evaluation");
    });

    it("skips if the field does not exist or is invalid", async () => {
      const pkg = {};
      const text = await print(pkg, ["keywords"], opts, {});
      expect(strip(text)).toBe("");
    });
  });

  describe("license", () => {
    it("prints the license of the package", async () => {
      const pkg = {
        license: "MIT",
      };
      const text = await print(pkg, ["license"], opts, {});
      expect(strip(text)).toBe("License : MIT");
    });

    it("skips if the field does not exist or is invalid", async () => {
      const pkg = {};
      const text = await print(pkg, ["license"], opts, {});
      expect(strip(text)).toBe("");
    });
  });

  describe("maintainers", () => {
    it("prints the list of the maintainers", async () => {
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
      const text = await print(pkg, ["maintainers"], opts, {});
      expect(strip(text)).toBe(
        // prettier-ignore
        [
            "Maintainers :",
            "  Foo <foo@example.com>",
            "  Bar",
            "  Baz <baz@example.com> (https://example.com/baz)",
          ].join("\n")
      );
    });

    it("skips if the field does not exist or is invalid", async () => {
      const pkg = {};
      const text = await print(pkg, ["maintainers"], opts, {});
      expect(strip(text)).toBe("");
    });
  });

  describe("module", () => {
    it("prints whether the package provides ES2016 module or not", async () => {
      {
        const pkg = {
          module: "./dist/index.mjs",
        };
        const text = await print(pkg, ["module"], opts, {});
        expect(strip(text)).toBe("Module : Yes");
      }
      {
        const pkg = {};
        const text = await print(pkg, ["module"], opts, {});
        expect(strip(text)).toBe("Module : No");
      }
    });
  });

  describe("name", () => {
    it("prints the package name", async () => {
      const pkg = {
        name: "@susisu/ppp",
      };
      const text = await print(pkg, ["name"], opts, {});
      expect(strip(text)).toBe("Name : @susisu/ppp");
    });

    it("skips if the field does not exist or is invalid", async () => {
      const pkg = {};
      const text = await print(pkg, ["name"], opts, {});
      expect(strip(text)).toBe("");
    });
  });

  describe("npm", () => {
    it("prints the package URL on npm", async () => {
      const pkg = {
        name: "@susisu/ppp",
      };
      const text = await print(pkg, ["npm"], opts, {});
      expect(strip(text)).toBe("NPM : https://www.npmjs.com/package/@susisu/ppp");
    });

    it("skips if the field does not exist or is invalid", async () => {
      const pkg = {};
      const text = await print(pkg, ["npm"], opts, {});
      expect(strip(text)).toBe("");
    });
  });

  describe("optionalDependencies", () => {
    it("prints the list of the optional dependencies", async () => {
      const pkg = {
        optionalDependencies: {
          foo: "^1.0.0",
          bar: "~2.0.0",
        },
      };
      const text = await print(pkg, ["optionalDependencies"], opts, {});
      expect(strip(text)).toBe("Optional Dependencies : bar@~2.0.0, foo@^1.0.0");
    });

    it("skips if the field does not exist or is invalid", async () => {
      const pkg = {};
      const text = await print(pkg, ["optionalDependencies"], opts, {});
      expect(strip(text)).toBe("");
    });
  });

  describe("os", () => {
    it("prints the list of the supported operating systems", async () => {
      const pkg = {
        os: ["linux", "!win32"],
      };
      const text = await print(pkg, ["os"], opts, {});
      expect(strip(text)).toBe("OS : linux, !win32");
    });

    it("skips if the field does not exist or is invalid", async () => {
      const pkg = {};
      const text = await print(pkg, ["os"], opts, {});
      expect(strip(text)).toBe("");
    });
  });

  describe("peerDependencies", () => {
    it("prints the list of the peer dependencies", async () => {
      const pkg = {
        peerDependencies: {
          foo: "^1.0.0",
          bar: "~2.0.0",
        },
      };
      const text = await print(pkg, ["peerDependencies"], opts, {});
      expect(strip(text)).toBe("Peer Dependencies : bar@~2.0.0, foo@^1.0.0");
    });

    it("skips if the field does not exist or is invalid", async () => {
      const pkg = {};
      const text = await print(pkg, ["peerDependencies"], opts, {});
      expect(strip(text)).toBe("");
    });
  });

  describe("repository", () => {
    it("prints the package repository", async () => {
      {
        const pkg = {
          repository: {
            type: "git",
            url: "git+https://github.com/susisu/ppp.git",
          },
        };
        const text = await print(pkg, ["repository"], opts, {});
        expect(strip(text)).toBe("Repository : git+https://github.com/susisu/ppp.git");
      }
      {
        const pkg = {
          repository: "https://github.com/susisu/ppp.git",
        };
        const text = await print(pkg, ["repository"], opts, {});
        expect(strip(text)).toBe("Repository : https://github.com/susisu/ppp.git");
      }
    });

    it("skips if the field does not exist or is invalid", async () => {
      const pkg = {};
      const text = await print(pkg, ["repository"], opts, {});
      expect(strip(text)).toBe("");
    });
  });

  describe("shasum", () => {
    it("prints the SHA checksum of the package", async () => {
      const pkg = {
        dist: {
          shasum: "36926c675b6c138dd155f453f043e8b9cb365886",
        },
      };
      const text = await print(pkg, ["shasum"], opts, {});
      expect(strip(text)).toBe("SHA Checksum : 36926c675b6c138dd155f453f043e8b9cb365886");
    });

    it("skips if the field does not exist or is invalid", async () => {
      {
        const pkg = {};
        const text = await print(pkg, ["shasum"], opts, {});
        expect(strip(text)).toBe("");
      }
      {
        const pkg = {
          dist: {},
        };
        const text = await print(pkg, ["shasum"], opts, {});
        expect(strip(text)).toBe("");
      }
    });
  });

  describe("tags", () => {
    it("prints the list of the available tags", async () => {
      {
        const pkg = {
          "dist-tags": {
            latest: "3.1.4",
            next: "4.0.0",
          },
        };
        const text = await print(pkg, ["tags"], opts, {});
        expect(strip(text)).toBe(
          // prettier-ignore
          [
              "Tags :",
              "  latest : 3.1.4",
              "  next   : 4.0.0",
            ].join("\n")
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
        const text = await print(pkg, ["tags"], opts, {});
        expect(strip(text)).toMatch(
          new RegExp(
            // prettier-ignore
            "^" + [
                "Tags :",
                "  latest : 3\\.1\\.4 \\(.+\\)",
                "  next   : 4\\.0\\.0 \\(.+\\)",
              ].join("\n") + "$"
          )
        );
      }
    });

    it("skips if the field does not exist or is invalid", async () => {
      const pkg = {};
      const text = await print(pkg, ["tags"], opts, {});
      expect(strip(text)).toBe("");
    });
  });

  describe("tarball", () => {
    it("prints the URL of the package tarball", async () => {
      const pkg = {
        dist: {
          tarball: "https://example.com/nyancat.tgz",
        },
      };
      const text = await print(pkg, ["tarball"], opts, {});
      expect(strip(text)).toBe("Tarball : https://example.com/nyancat.tgz");
    });

    it("skips if the field does not exist or is invalid", async () => {
      {
        const pkg = {};
        const text = await print(pkg, ["tarball"], opts, {});
        expect(strip(text)).toBe("");
      }
      {
        const pkg = {
          dist: {},
        };
        const text = await print(pkg, ["tarball"], opts, {});
        expect(strip(text)).toBe("");
      }
    });
  });

  describe("types", () => {
    it("prints whether the package provides type definitions for TypeScript", async () => {
      {
        const pkg = {
          types: "./dist/index.d.ts",
        };
        const text = await print(pkg, ["types"], opts, {});
        expect(strip(text)).toBe("Types : Yes");
      }
      {
        const pkg = {
          typings: "./dist/index.d.ts",
        };
        const text = await print(pkg, ["types"], opts, {});
        expect(strip(text)).toBe("Types : Yes");
      }
      {
        const pkg = {};
        const text = await print(pkg, ["types"], opts, {});
        expect(strip(text)).toBe("Types : No");
      }
    });
  });

  describe("version", () => {
    it("prints the package version", async () => {
      {
        const pkg = {
          version: "3.1.4",
        };
        const text = await print(pkg, ["version"], opts, {});
        expect(strip(text)).toBe("Version : 3.1.4");
      }
      {
        const pkg = {
          version: "3.1.4",
          time: {
            "3.1.4": "2006-01-02T03:04:05.000Z",
          },
        };
        const text = await print(pkg, ["version"], opts, {});
        expect(strip(text)).toMatch(/^Version : 3\.1\.4 \(.+\)$/);
      }
    });

    it("skips if the field does not exist or is invalid", async () => {
      const pkg = {};
      const text = await print(pkg, ["version"], opts, {});
      expect(strip(text)).toBe("");
    });
  });

  it("prints multiple fields", async () => {
    const pkg = {
      name: "@susisu/ppp",
      description: "package.json pretty printer",
    };
    const text = await print(pkg, ["name", "description"], opts, {});
    expect(strip(text)).toBe(
      // prettier-ignore
      [
          "Name        : @susisu/ppp",
          "Description : package.json pretty printer",
        ].join("\n")
    );
  });

  it("throws error if unknown field is specified", async () => {
    const pkg = {};
    const promise = print(pkg, ["xxx"], opts, {});
    await expect(promise).rejects.toThrowError("Unknown field 'xxx'");
  });
});
