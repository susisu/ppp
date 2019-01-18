"use strict";

const colors = require("./colors");
const formatter = require("./formatter");

function isString(val) {
  return typeof val === "string";
}

function isObject(val) {
  return typeof val === "object" && val !== null;
}

function isArray(val) {
  return Array.isArray(val);
}

const fieldDefs = {
  "author": {
    label: "Author",
    print(pkg) {
      const val = pkg["author"];
      if (!isString(val)) {
        return null;
      }
      return formatter.fields.text(val);
    },
  },
  "binaries": {
    label: "Binaries",
    print(pkg) {
      const val = pkg["bin"];
      if (!isObject(val)) {
        return null;
      }
      return formatter.fields.binaries(val);
    },
  },
  "dependencies": {
    label: "Dependencies",
    print(pkg) {
      const val = pkg["dependencies"];
      if (!isObject(val)) {
        return null;
      }
      return formatter.fields.dependencies(val);
    },
  },
  "description": {
    label: "Description",
    print(pkg) {
      const val = pkg["description"];
      if (!isString(val)) {
        return null;
      }
      return formatter.fields.text(val);
    },
  },
  "devDependencies": {
    label: "Dev Dependencies",
    print(pkg) {
      const val = pkg["devDependencies"];
      if (!isObject(val)) {
        return null;
      }
      return formatter.fields.dependencies(val);
    },
  },
  "tags": {
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
  "engines": {
    label: "Engines",
    print(pkg) {
      const val = pkg["engines"];
      if (!isObject(val)) {
        return null;
      }
      return formatter.fields.dependencies(val);
    },
  },
  "homepage": {
    label: "Homepage",
    print(pkg) {
      const val = pkg["homepage"];
      if (!isString(val)) {
        return null;
      }
      return formatter.fields.text(val);
    },
  },
  "keywords": {
    label: "Keywords",
    print(pkg) {
      const val = pkg["keywords"];
      if (!isArray(val)) {
        return null;
      }
      return formatter.fields.keywords(val);
    },
  },
  "license": {
    label: "License",
    print(pkg) {
      const val = pkg["license"];
      if (!isString(val)) {
        return null;
      }
      return formatter.fields.text(val);
    },
  },
  "maintainers": {
    label: "Maintainers",
    print(pkg) {
      const val = pkg["maintainers"];
      if (!isArray(val)) {
        return null;
      }
      return formatter.fields.maintainers(val);
    },
  },
  "name": {
    label: "Name",
    print(pkg) {
      const val = pkg["name"];
      if (!isString(val)) {
        return null;
      }
      return formatter.fields.text(val);
    },
  },
  "peerDependencies": {
    label: "Peer Dependencies",
    print(pkg) {
      const val = pkg["peerDependencies"];
      if (!isObject(val)) {
        return null;
      }
      return formatter.fields.dependencies(val);
    },
  },
  "repository": {
    label: "Repository",
    print(pkg) {
      const val = pkg["repository"];
      if (isObject(val) && isString(val["url"])) {
        return formatter.fields.text(val["url"]);
      }
      else if (isString(val)) {
        return formatter.fields.text(val);
      }
      else {
        return null;
      }
    },
  },
  "version": {
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

const availableFileds = Object.keys(fieldDefs);

function print(pkg, fields, wrapSize, indentSize) {
  const items = [];
  for (const field of fields) {
    if (!fieldDefs.hasOwnProperty(field)) {
      throw new Error(`Unknown field: ${field}`);
    }
    const def = fieldDefs[field];
    const msg = def.print(pkg);
    if (msg === null) {
      continue;
    }
    const label = colors.label(def.label);
    items.push({ label, msg });
  }
  return formatter.items(items, wrapSize, indentSize);
}

module.exports = {
  print,
  availableFileds,
};
