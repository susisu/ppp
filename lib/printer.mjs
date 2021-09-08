import colors from "./colors.js";
import * as formatter from "./formatter.mjs";

function isString(val) {
  return typeof val === "string";
}

function isObject(val) {
  return typeof val === "object" && val !== null;
}

function isArray(val) {
  return Array.isArray(val);
}

function toPerson(val) {
  if (isString(val)) {
    return val;
  } else if (isObject(val)) {
    if (!isString(val["name"])) {
      return null;
    }
    const person = {
      name: val["name"],
    };
    if (isString(val["email"])) {
      person.email = val["email"];
    }
    if (isString(val["url"])) {
      person.url = val["url"];
    }
    return person;
  } else {
    return null;
  }
}

function stripScope(name) {
  return name.replace(/^@.+\//, "");
}

const fieldDefs = {
  author: {
    label: "Author",
    print(pkg) {
      const val = toPerson(pkg["author"]);
      if (val === null) {
        return null;
      }
      return formatter.fields.person(val);
    },
  },
  binaries: {
    label: "Binaries",
    print(pkg) {
      const val = pkg["bin"];
      if (isString(val)) {
        const name = pkg["name"];
        if (!isString(name)) {
          return null;
        }
        return formatter.fields.rawText(stripScope(name));
      } else if (isObject(val)) {
        return formatter.fields.binaries(val);
      } else {
        return null;
      }
    },
  },
  cpu: {
    label: "CPU",
    print(pkg) {
      const val = pkg["cpu"];
      if (!isArray(val)) {
        return null;
      }
      return formatter.fields.wordList(val);
    },
  },
  dependencies: {
    label: "Dependencies",
    print(pkg) {
      const val = pkg["dependencies"];
      if (!isObject(val)) {
        return null;
      }
      return formatter.fields.dependencies(val);
    },
  },
  description: {
    label: "Description",
    print(pkg) {
      const val = pkg["description"];
      if (!isString(val)) {
        return null;
      }
      return formatter.fields.text(val);
    },
  },
  devDependencies: {
    label: "Dev Dependencies",
    print(pkg) {
      const val = pkg["devDependencies"];
      if (!isObject(val)) {
        return null;
      }
      return formatter.fields.dependencies(val);
    },
  },
  engines: {
    label: "Engines",
    print(pkg) {
      const val = pkg["engines"];
      if (!isObject(val)) {
        return null;
      }
      return formatter.fields.dependencies(val);
    },
  },
  homepage: {
    label: "Homepage",
    print(pkg) {
      const val = pkg["homepage"];
      if (!isString(val)) {
        return null;
      }
      return formatter.fields.text(val);
    },
  },
  installed: {
    label: "Installed",
    async print(pkg, reqs) {
      const name = pkg["name"];
      if (!isString(name)) {
        return null;
      }
      const val = await reqs.installedVersions(name);
      return formatter.fields.installed(val);
    },
  },
  keywords: {
    label: "Keywords",
    print(pkg) {
      const val = pkg["keywords"];
      if (!isArray(val)) {
        return null;
      }
      return formatter.fields.wordList(val);
    },
  },
  license: {
    label: "License",
    print(pkg) {
      const val = pkg["license"];
      if (!isString(val)) {
        return null;
      }
      return formatter.fields.text(val);
    },
  },
  maintainers: {
    label: "Maintainers",
    print(pkg) {
      const val = pkg["maintainers"];
      if (!isArray(val)) {
        return null;
      }
      return formatter.fields.people(val.map(toPerson).filter(p => p !== null));
    },
  },
  module: {
    label: "Module",
    print(pkg) {
      const val = pkg["module"];
      return formatter.fields.boolean(isString(val));
    },
  },
  name: {
    label: "Name",
    print(pkg) {
      const val = pkg["name"];
      if (!isString(val)) {
        return null;
      }
      return formatter.fields.rawText(val);
    },
  },
  npm: {
    label: "NPM",
    print(pkg) {
      const val = pkg["name"];
      if (!isString(val)) {
        return null;
      }
      return formatter.fields.text(`https://www.npmjs.com/package/${val}`);
    },
  },
  optionalDependencies: {
    label: "Optional Dependencies",
    print(pkg) {
      const val = pkg["optionalDependencies"];
      if (!isObject(val)) {
        return null;
      }
      return formatter.fields.dependencies(val);
    },
  },
  os: {
    label: "OS",
    print(pkg) {
      const val = pkg["os"];
      if (!isArray(val)) {
        return null;
      }
      return formatter.fields.wordList(val);
    },
  },
  peerDependencies: {
    label: "Peer Dependencies",
    print(pkg) {
      const val = pkg["peerDependencies"];
      if (!isObject(val)) {
        return null;
      }
      return formatter.fields.dependencies(val);
    },
  },
  repository: {
    label: "Repository",
    print(pkg) {
      const val = pkg["repository"];
      if (isObject(val) && isString(val["url"])) {
        return formatter.fields.text(val["url"]);
      } else if (isString(val)) {
        return formatter.fields.text(val);
      } else {
        return null;
      }
    },
  },
  shasum: {
    label: "SHA Checksum",
    print(pkg) {
      const dist = pkg["dist"];
      if (!isObject(dist)) {
        return null;
      }
      const val = dist["shasum"];
      if (!isString(val)) {
        return null;
      }
      return formatter.fields.rawText(val);
    },
  },
  tags: {
    label: "Tags",
    print(pkg) {
      const val = pkg["dist-tags"];
      if (!isObject(val)) {
        return null;
      }
      const times = pkg["time"];
      return formatter.fields.tags(val, times);
    },
  },
  tarball: {
    label: "Tarball",
    print(pkg) {
      const dist = pkg["dist"];
      if (!isObject(dist)) {
        return null;
      }
      const val = dist["tarball"];
      if (!isString(val)) {
        return null;
      }
      return formatter.fields.text(val);
    },
  },
  types: {
    label: "Types",
    print(pkg) {
      const val = pkg["types"] || pkg["typings"];
      return formatter.fields.boolean(isString(val));
    },
  },
  version: {
    label: "Version",
    print(pkg) {
      const val = pkg["version"];
      if (!isString(val)) {
        return null;
      }
      const times = pkg["time"];
      return formatter.fields.version(val, times);
    },
  },
};

export const availableFields = new Set(Object.keys(fieldDefs));

export async function print(pkg, fields, opts, reqs) {
  const { wrapSize, indentSize } = opts;
  const items = [];
  for (const field of fields) {
    if (!Object.prototype.hasOwnProperty.call(fieldDefs, field)) {
      throw new Error(`Unknown field '${field}'`);
    }
    const def = fieldDefs[field];
    const msg = await def.print(pkg, reqs);
    if (msg === null) {
      continue;
    }
    const label = colors.label(def.label);
    items.push({ label, msg });
  }
  return formatter.items(items, wrapSize, indentSize);
}
