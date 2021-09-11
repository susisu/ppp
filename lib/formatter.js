import indent from "indent-string";
import strip from "strip-ansi";
import wrap from "wrap-ansi";

import * as colors from "./colors.js";
import { isString } from "./utils.js";

function maximum(xs) {
  return xs.reduce((max, x) => Math.max(max, x), 0);
}

function canFit(msg, size) {
  return strip(msg).length <= size;
}

function isMultiline(msg) {
  return msg.indexOf("\n") >= 0;
}

function multilineMsg(msg, wrapSize, indentSize) {
  const wrapped = wrap(msg, wrapSize - indentSize, { trim: false });
  return indent(wrapped, indentSize);
}

function padEnd(msg, size) {
  const msgSize = strip(msg).length;
  return msg + " ".repeat(Math.max(size - msgSize, 0));
}

export function items(items, wrapSize, indentSize) {
  const labelSize = maximum(items.map(item => strip(item.label).length));
  const msgSize = wrapSize - (labelSize + " : ".length);
  const texts = items.map(item => {
    const label = padEnd(item.label, labelSize);
    if (canFit(item.msg, msgSize) && !isMultiline(item.msg)) {
      return `${label} : ${item.msg}`;
    } else {
      return `${label} :\n${multilineMsg(item.msg, wrapSize, indentSize)}`;
    }
  });
  return texts.join("\n");
}

function date(str) {
  return colors.date(new Date(str).toLocaleString());
}

function colorLinksAndEmails(msg) {
  // need better regular expression?
  const re = /(https?:\/\/[\w\-./#&?=+%~@]+)|([\w\-+][\w\-+.]*@[\w\-.]+)/g;
  return msg.replace(re, colors.link);
}

function getTime(times, version) {
  return times && Object.prototype.hasOwnProperty.call(times, version) ? times[version] : undefined;
}

export const fields = {
  binaries: val => {
    const binNames = Object.keys(val).sort();
    return binNames.join(", ");
  },
  boolean: val => (val ? "Yes" : "No"),
  dependencies: val => {
    const depNames = Object.keys(val).sort();
    const deps = depNames.map(name => {
      const version = colors.version(val[name]);
      return `${name}@${version}`;
    });
    return deps.join(", ");
  },
  installed: val => {
    const localVersion = val.local !== undefined ? colors.version(val.local) : "(not installed)";
    const globalVersion = val.global !== undefined ? colors.version(val.global) : "(not installed)";
    return `local: ${localVersion}, global: ${globalVersion}`;
  },
  people: val => val.map(p => fields.person(p)).join("\n"),
  person: val => {
    if (isString(val)) {
      return fields.text(val);
    } else {
      const email = isString(val.email) ? ` <${colorLinksAndEmails(val.email)}>` : "";
      const url = isString(val.url) ? ` (${colorLinksAndEmails(val.url)})` : "";
      return val.name + email + url;
    }
  },
  rawText: val => val,
  tags: (val, times) => {
    const tagNames = Object.keys(val).sort();
    const tags = tagNames.map(name => {
      const version = val[name];
      const time = getTime(times, version);
      const label = colors.tagName(name);
      const msg = time ? `${colors.version(version)} (${date(time)})` : colors.version(version);
      return { label, msg };
    });
    return items(tags, Infinity, 2);
  },
  text: val => colorLinksAndEmails(val),
  version: (val, times) => {
    const time = getTime(times, val);
    return time ? `${colors.version(val)} (${date(time)})` : colors.version(val);
  },
  wordList: val => val.join(", "),
};
