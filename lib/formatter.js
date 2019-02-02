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
  const wrapped = wrapSize !== null ? wrap(msg, wrapSize - indentSize, { trim: false }) : msg;
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

function colorLinksAndEmails(msg) {
  // need better regular expressions?
  const re = /(https?:\/\/[\w\-./#&?=+%~@]+)|([\w\-+][\w\-+.]*@[\w\-.]+)/g;
  return msg.replace(re, colors.link);
}

function getTime(times, version) {
  return times && Object.prototype.hasOwnProperty.call(times, version) ? times[version] : null;
}

const fields = {
  binaries(val) {
    const binNames = Object.keys(val).sort();
    return binNames.join(", ");
  },
  boolean(val) {
    return val ? "Yes" : "No";
  },
  dependencies(val) {
    const depNames = Object.keys(val).sort();
    const deps = depNames.map(name => {
      const version = colors.version(val[name]);
      return `${name}@${version}`;
    });
    return deps.join(", ");
  },
  keywords(val) {
    return val.join(", ");
  },
  people(val) {
    return val.map(p => this.person(p)).join("\n");
  },
  person(val) {
    if (typeof val === "string") {
      return this.text(val);
    }
    else {
      const email = typeof val.email === "string" ? ` <${colorLinksAndEmails(val.email)}>` : "";
      const url = typeof val.url === "string" ? ` (${colorLinksAndEmails(val.url)})` : "";
      return val.name + email + url;
    }
  },
  rawText(val) {
    return val;
  },
  tags(val, times) {
    const tagNames = Object.keys(val).sort();
    const tags = tagNames.map(name => {
      const version = val[name];
      const time = getTime(times, version);
      const label = colors.tagName(name);
      const msg = time ? `${colors.version(version)} (${date(time)})` : colors.version(version);
      return { label, msg };
    });
    return items(tags, null, 2);
  },
  text(val) {
    return colorLinksAndEmails(val);
  },
  version(val, times) {
    const time = getTime(times, val);
    return time ? `${colors.version(val)} (${date(time)})` : colors.version(val);
  },
};

module.exports = {
  items,
  fields,
};
