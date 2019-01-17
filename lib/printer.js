"use strict";

const colors = require("./colors");
const formatter = require("./formatter");

const fields = {
  "author": {
    label : "Author",
    format: formatter.fields.text,
  },
  "bin": {
    label : "Binaries",
    format: formatter.fields.binaries,
  },
  "dependencies": {
    label : "Dependencies",
    format: formatter.fields.dependencies,
  },
  "description": {
    label : "Description",
    format: formatter.fields.text,
  },
  "devDependencies": {
    label : "Dev Dependencies",
    format: formatter.fields.dependencies,
  },
  "dist-tags": {
    label : "Tags",
    format: formatter.fields.tags,
  },
  "engines": {
    label : "Engines",
    format: formatter.fields.engines,
  },
  "homepage": {
    label : "Homepage",
    format: formatter.fields.text,
  },
  "keywords": {
    label : "Keywords",
    format: formatter.fields.keywords,
  },
  "license": {
    label : "License",
    format: formatter.fields.text,
  },
  "maintainers": {
    label : "Maintainers",
    format: formatter.fields.maintainers,
  },
  "name": {
    label : "Name",
    format: formatter.fields.text,
  },
  "peerDependencies": {
    label : "Peer Dependencies",
    format: formatter.fields.dependencies,
  },
  "repository": {
    label : "Repository",
    format: formatter.fields.repository,
  },
  "version": {
    label : "Version",
    format: formatter.fields.version,
  },
};

function print(pkg, fieldNames, wrapSize, indentSize) {
  const items = [];
  for (const name of fieldNames) {
    if (!fields.hasOwnProperty(name)) {
      throw new Error(`Unknown field: ${name}`);
    }
    if (!pkg.hasOwnProperty(name)) {
      continue;
    }
    const field = fields[name];
    const val = pkg[name];
    const msg = field.format(val, pkg);
    if (msg === null) {
      continue;
    }
    items.push({
      label: colors.label(field.label),
      msg  : msg,
    });
  }
  return formatter.items(items, wrapSize, indentSize);
}

module.exports = {
  print,
};
