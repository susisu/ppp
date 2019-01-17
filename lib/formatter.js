"use strict";

const indent = require("indent-string");
const strip = require("strip-ansi");
const wrap = require("wrap-ansi");

const colors = require("./colors");

function maximum(xs) {
  return xs.reduce((max, x) => Math.max(max, x), 0);
}

function canFit(msg, size) {
  return size === null || strip(msg).length <= size;
}

function isMultiline(msg) {
  return msg.indexOf("\n") >= 0;
}

function multilineMsg(msg, wrapSize, indentSize) {
  const wrapped = wrapSize !== null ? wrap(msg, wrapSize - indentSize) : msg;
  return indent(wrapped, indentSize);
}

function padEnd(msg, size) {
  const msgSize = strip(msg).length;
  return msg + " ".repeat(Math.max(size - msgSize, 0));
}

function items(items, wrapSize, indentSize) {
  const labelSize = maximum(items.map(item => strip(item.label).length));
  const msgSize = wrapSize !== null
    ? wrapSize - (labelSize + 3) // 3 === " : ".length
    : null;
  const texts = items.map(item => {
    const label = padEnd(item.label, labelSize);
    if (canFit(item.msg, msgSize) && !isMultiline(item.msg)) {
      return `${label} : ${item.msg}`;
    }
    else {
      return `${label} :\n${multilineMsg(item.msg, wrapSize, indentSize)}`;
    }
  });
  return texts.join("\n");
}

function date(str) {
  return colors.date(new Date(str).toLocaleString());
}

function colorLink(msg) {
  return msg.replace(/https?:\/\/[0-9A-Za-z\-_./#&?=+%]+/g, colors.link);
}

const fields = {
  binaries(val, pkg) {
    const binNames = Object.keys(val).sort();
    return binNames.join(", ");
  },
  dependencies(val, pkg) {
    const depNames = Object.keys(val).sort();
    const deps = depNames.map(name => {
      const version = colors.version(val[name]);
      return `${name}@${version}`;
    });
    return deps.join(", ");
  },
  engines(val, pkg) {
    const engineNames = Object.keys(val).sort();
    const engines = engineNames.map(name => {
      const version = colors.version(val[name]);
      return `${name}@${version}`;
    });
    return engines.join(", ");
  },
  keywords(val, pkg) {
    return val.join(", ");
  },
  maintainers(val, pkg) {
    return val.map(colorLink).join("\n");
  },
  repository(val, pkg) {
    return typeof val["url"] === "string" ? colorLink(val["url"])
      : typeof val === "string" ? colorLink(val)
      : null;
  },
  tags(val, pkg) {
    const tagNames = Object.keys(val).sort();
    const tags = tagNames.map(name => {
      const version = val[name];
      const time = pkg["time"] && pkg["time"][version];
      return {
        label: colors.tagName(name),
        msg  : time ? `${colors.version(version)} (${date(time)})` : colors.version(version),
      };
    });
    return items(tags, null, 2);
  },
  text(val, pkg) {
    return colorLink(val);
  },
  version(val, pkg) {
    const time = pkg["time"] && pkg["time"][val];
    return time ? `${colors.version(val)} (${date(time)})` : colors.version(val);
  },
};

module.exports = {
  items,
  fields,
};
