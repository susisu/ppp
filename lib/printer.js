import * as colors from "./colors.js";
import * as formatter from "./formatter.js";
import { isString, isObject, isArray } from "./utils.js";

function toPerson(val) {
  if (isString(val)) {
    return val;
  } else if (isObject(val)) {
    if (!isString(val["name"])) {
      return undefined;
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
    return undefined;
  }
}

function stripScope(name) {
  return name.replace(/^@.+\//, "");
}

async function installedVersions(npm, name) {
  const [localVersion, globalVersion] = await Promise.all([
    installedVersion(npm, name, false),
    installedVersion(npm, name, true),
  ]);
  return {
    local: localVersion,
    global: globalVersion,
  };
}

async function installedVersion(npm, name, global) {
  try {
    const data = await npm.ls(name, global);
    const version = data["dependencies"][name]["version"];
    if (!isString(version)) {
      return undefined;
    }
    return version;
  } catch {
    return undefined;
  }
}

const fieldDefs = {
  author: {
    label: "Author",
    print: pkg => {
      const val = toPerson(pkg["author"]);
      if (val === undefined) {
        return undefined;
      }
      return formatter.fields.person(val);
    },
  },
  binaries: {
    label: "Binaries",
    print: pkg => {
      const val = pkg["bin"];
      if (isString(val)) {
        const name = pkg["name"];
        if (!isString(name)) {
          return undefined;
        }
        return formatter.fields.rawText(stripScope(name));
      } else if (isObject(val)) {
        return formatter.fields.binaries(val);
      } else {
        return undefined;
      }
    },
  },
  cpu: {
    label: "CPU",
    print: pkg => {
      const val = pkg["cpu"];
      if (!isArray(val)) {
        return undefined;
      }
      return formatter.fields.wordList(val);
    },
  },
  dependencies: {
    label: "Dependencies",
    print: pkg => {
      const val = pkg["dependencies"];
      if (!isObject(val)) {
        return undefined;
      }
      return formatter.fields.dependencies(val);
    },
  },
  description: {
    label: "Description",
    print: pkg => {
      const val = pkg["description"];
      if (!isString(val)) {
        return undefined;
      }
      return formatter.fields.text(val);
    },
  },
  devDependencies: {
    label: "Dev Dependencies",
    print: pkg => {
      const val = pkg["devDependencies"];
      if (!isObject(val)) {
        return undefined;
      }
      return formatter.fields.dependencies(val);
    },
  },
  engines: {
    label: "Engines",
    print: pkg => {
      const val = pkg["engines"];
      if (!isObject(val)) {
        return undefined;
      }
      return formatter.fields.dependencies(val);
    },
  },
  homepage: {
    label: "Homepage",
    print: pkg => {
      const val = pkg["homepage"];
      if (!isString(val)) {
        return undefined;
      }
      return formatter.fields.text(val);
    },
  },
  installed: {
    label: "Installed",
    print: async (pkg, npm) => {
      const name = pkg["name"];
      if (!isString(name)) {
        return undefined;
      }
      const val = await installedVersions(npm, name);
      return formatter.fields.installed(val);
    },
  },
  keywords: {
    label: "Keywords",
    print: pkg => {
      const val = pkg["keywords"];
      if (!isArray(val)) {
        return undefined;
      }
      return formatter.fields.wordList(val);
    },
  },
  license: {
    label: "License",
    print: pkg => {
      const val = pkg["license"];
      if (!isString(val)) {
        return undefined;
      }
      return formatter.fields.text(val);
    },
  },
  maintainers: {
    label: "Maintainers",
    print: pkg => {
      const val = pkg["maintainers"];
      if (!isArray(val)) {
        return undefined;
      }
      return formatter.fields.people(val.map(toPerson).filter(p => p !== undefined));
    },
  },
  module: {
    label: "Module",
    print: pkg => {
      const type = pkg["type"];
      return formatter.fields.boolean(type === "module");
    },
  },
  name: {
    label: "Name",
    print: pkg => {
      const val = pkg["name"];
      if (!isString(val)) {
        return undefined;
      }
      return formatter.fields.rawText(val);
    },
  },
  npm: {
    label: "NPM",
    print: pkg => {
      const name = pkg["name"];
      if (!isString(name)) {
        return undefined;
      }
      return formatter.fields.text(`https://www.npmjs.com/package/${name}`);
    },
  },
  optionalDependencies: {
    label: "Optional Dependencies",
    print: pkg => {
      const val = pkg["optionalDependencies"];
      if (!isObject(val)) {
        return undefined;
      }
      return formatter.fields.dependencies(val);
    },
  },
  os: {
    label: "OS",
    print: pkg => {
      const val = pkg["os"];
      if (!isArray(val)) {
        return undefined;
      }
      return formatter.fields.wordList(val);
    },
  },
  peerDependencies: {
    label: "Peer Dependencies",
    print: pkg => {
      const val = pkg["peerDependencies"];
      if (!isObject(val)) {
        return undefined;
      }
      return formatter.fields.dependencies(val);
    },
  },
  repository: {
    label: "Repository",
    print: pkg => {
      const val = pkg["repository"];
      if (isObject(val) && isString(val["url"])) {
        return formatter.fields.text(val["url"]);
      } else if (isString(val)) {
        return formatter.fields.text(val);
      } else {
        return undefined;
      }
    },
  },
  shasum: {
    label: "SHA Checksum",
    print: pkg => {
      const dist = pkg["dist"];
      if (!isObject(dist)) {
        return undefined;
      }
      const val = dist["shasum"];
      if (!isString(val)) {
        return undefined;
      }
      return formatter.fields.rawText(val);
    },
  },
  tags: {
    label: "Tags",
    print: pkg => {
      const val = pkg["dist-tags"];
      if (!isObject(val)) {
        return undefined;
      }
      const times = pkg["time"];
      return formatter.fields.tags(val, times);
    },
  },
  tarball: {
    label: "Tarball",
    print: pkg => {
      const dist = pkg["dist"];
      if (!isObject(dist)) {
        return undefined;
      }
      const val = dist["tarball"];
      if (!isString(val)) {
        return undefined;
      }
      return formatter.fields.text(val);
    },
  },
  types: {
    label: "Types",
    print: pkg => {
      const types = pkg["types"];
      const typings = pkg["typings"];
      return formatter.fields.boolean(isString(types) || isString(typings));
    },
  },
  version: {
    label: "Version",
    print: pkg => {
      const val = pkg["version"];
      if (!isString(val)) {
        return undefined;
      }
      const times = pkg["time"];
      return formatter.fields.version(val, times);
    },
  },
};

export const availableFields = new Set(Object.keys(fieldDefs));

export async function print(pkg, fields, opts, npm) {
  validateFields(fields);
  const items = [];
  for (const field of fields) {
    const def = fieldDefs[field];
    const msg = await def.print(pkg, npm);
    if (msg === undefined) {
      continue;
    }
    const label = colors.label(def.label);
    items.push({ label, msg });
  }
  return formatter.items(items, opts.wrapSize, opts.indentSize);
}

function validateFields(fields) {
  for (const field of fields) {
    if (!Object.prototype.hasOwnProperty.call(fieldDefs, field)) {
      throw new Error(`Unknown field '${field}'`);
    }
  }
}
